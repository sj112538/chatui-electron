import { CreateChatCompletionRequest, CreateCompletionRequest, CreateFineTuneRequest, ListFilesResponse, OpenAIFile } from 'openai'
import Http from '../http'
import { saveSession } from '@/pages/Home/com/chatLeft'
import { getinfo } from '@/pages/Home/com/chatRight/com/hook/useMoneyInfo'
import ClipboardJS from 'clipboard'
import { ElMessage } from 'element-plus'
import { useCmd } from '@/pages/Home/com/chat/chat-tool-bar/tools/cmd'
export const chatgptApi = new class chatgptApi extends Http {
  async chatCompletion(data: CreateChatCompletionRequest, textList: any) {
    const response: chatCompletion = await this.post('/v1/chat/completions', { body: data })
    response.message = response.choices.map(e => e.message?.content).join()
    textList.value.push({ ...response, role: 'assistant', owned_by: 'openai' })
  }
  async chatStream(data: CreateChatCompletionRequest & CreateCompletionRequest, textList: any, url: string, options?: resetSessionOptions) {
    data.messages = data?.messages?.filter((e) => !isNotNull(e) && e.content)
    data.stream = true
    const controller = new AbortController()
    const sessionIng = ref<SessionIng>()
    sessionIng.value = '进行中'
    const text = ref<any>({
      role: 'assistant',
      owned_by: 'openai',
      content: "",
      sessionIng,
      signal: controller
    })
    if (options?.index) {
      if (!textList.value[options?.index].moreTextList) {
        Reflect.set(textList.value[options?.index], 'moreTextList', [])
      }
      textList.value[options?.index].moreTextList.push(text)
      options?.changeCurrent(textList.value[options?.index].moreTextList.length)
      data.messages = data.messages.slice(0, options?.index)
    } else {
      textList.value.push(text.value as any)
    }
    const textListLong = textList.value.length
    let response = null
    try {
      response = await this.post(url, { isJSON: false, body: data, signal: controller.signal })
      if (response.status !== 200) {
        sessionIng.value = '已失败'
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        sessionIng.value = '已终止'
      } else {
        sessionIng.value = '已失败'
      }
      useCmd().addCMD({ type: 'error', message: err })
    }
    if (!response) {
      return
    }
    const stream = response.body?.getReader()
    const readStream = (reader: ReadableStreamDefaultReader<Uint8Array> | undefined): any => {
      return reader!.read().then(({ done, value }) => {
        if (done) {
          return;
        }
        let decoded = new TextDecoder().decode(value);
        let decodedArray = decoded.split("data: ");
        decodedArray.forEach(async decoded => {
          if (decoded !== "") {
            if (decoded.trim() === "[DONE]") {
              sessionIng.value = '已完成'
              saveSession()
              // if (useGamePlay().PlayName.value === '控制模式') {
              //   if (options?.index) {
              //     useCmd().matchCmd(text.value.message, textList)
              //   } else {
              //     useCmd().matchCmd(textList.value[textListLong - 1].message, textList)
              //   }
              // }
              getinfo()
              return;
            } else {
              let json: CreateChatCompletionStreamResponse = JSON.parse(decoded)
              const index = textList.value.findIndex((e: { id: string }) => e.id === json.id)
              if (options?.index) {
                try {
                  if (text.value.choices) {
                    text.value.choices.push(...json.choices as any)
                    if (!text.value.message) text.value.message = ''
                    text.value.message += json.choices.map(e => {
                      return e.delta?.content || e.text
                    }).join()
                  } else {
                    text.value = ({
                      ...json,
                      role: 'assistant',
                      owned_by: 'openai',
                      signal: controller,
                      sessionIng,
                      createdTime: Dayjs(json.created).format('YYYY-MM-DD HH:mm:ss'),
                      message: ''
                    } as any)
                    options.changeCurrent(textList.value[options.index].moreTextList.length)
                    const clipboard = new ClipboardJS('.copy-' + text.value.created);
                    clipboard.on('success', () => {
                      ElMessage({
                        type: "success",
                        message: "复制成功！"
                      })
                    })
                    saveSession()
                  }
                } catch (err) {
                  console.log(err);
                }
                return readStream(reader);
              }
              try {
                if (index !== -1) {
                  textList.value[index].choices?.push(...json.choices as any)
                  if (!textList.value[index].message) textList.value[index].message = ''
                  textList.value[index].message += json.choices.map(e => {
                    return e.delta?.content || e.text
                  }).join()
                  const viewContent: HTMLElement = document.querySelector('.viewContent')!
                  viewContent.scrollTop = viewContent.scrollHeight
                } else {
                  const session = ref({
                    ...json,
                    role: 'assistant',
                    owned_by: 'openai',
                    signal: controller,
                    sessionIng,
                    createdTime: Dayjs(json.created).format('YYYY-MM-DD HH:mm:ss'),
                    message: '',
                    moreTextList: []
                  } as any);
                  textList.value[textListLong - 1] = session.value
                  textList.value[textListLong - 1].moreTextList.push(ref(textList.value[textListLong - 1]))
                  await nextTick()
                  const clipboard = new ClipboardJS('.copy-' + session.value.created);
                  clipboard.on('success', () => {
                    ElMessage({
                      type: "success",
                      message: "复制成功！"
                    })
                  })
                  saveSession()
                }
              } catch (err) {
                console.log(err);
              }
            }
          }
        });
        return readStream(reader);
      });
    }
    readStream(stream);
  }
  getMoneyInfo = async () => {
    // return this.get('/dashboard/billing/credit_grants')
  }
  getFile = async (): Promise<ListFilesResponse> => {
    return this.get('/v1/files')
  }
  uploadFile = async (data: FormData) => {
    return this.post('/v1/files', { body: data, headers: { 'Content-Type': 'undefined' } })
  }
  retrieveContent = async (id: string) => {
    return this.get(`/v1/files/${id}/content`)
  }
  listfineTunes = async () => {
    return this.get('/v1/fine-tunes')
  }
  deleteModel = async (id: string) => {
    return this.delete(`/v1/models/${id}`)
  }
  createFineTunes = (data: CreateFineTuneRequest) => {
    for (let prop in data) {
      let key = prop as keyof CreateFineTuneRequest
      if (data[key] === '') {
        delete data[key];
      }
    }
    return this.post('/v1/fine-tunes', { body: data })
  }
  retrieveFineTune = (id: string) => {
    return this.get(`/v1/fine-tunes/${id}`)
  }
  cancelFineTune = (id: string) => {
    return this.post(`/v1/fine-tunes/${id}/cancel`, { isJSON: true })
  }
}
