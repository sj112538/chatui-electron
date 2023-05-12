import { nowSessionName, saveSession, useSession } from "@/pages/Home/com/chatLeft"
import ClipboardJS from "clipboard"
import { ElMessage } from "element-plus"
export const modelsInfo = ref<GPT3Models>()
abstract class useAiBase {
  editorArea = ref<string>('')
  textList = ref<Partial<chatCompletion>[]>([])
  stop = async (item: chatCompletion) => {
    saveSession()
    if (item.sessionIng === '已终止') {
      return
    }
    item.sessionIng = '已终止'
    item.signal.abort()
  }
  setTextList = (textList: Ref<Partial<chatCompletion>[]>) => {
    this.textList = textList
  }
  addUserSession = async (prompt: string) => {
    const { addSession, sessionBuilder } = useSession(this.textList)
    if (this.textList.value.length === 0) {
      const name = Date.now().toString()
      addSession(name)
      sessionBuilder()
      nowSessionName.value = name
    }
    this.editorArea.value = ''
    const time = Date.now()
    this.textList.value!.push({
      message: prompt,
      title: prompt,
      role: 'user',
      owned_by: 'my',
      createdTime: Dayjs(time).format('YYYY-MM-DD HH:mm:ss'),
      edit: false,
      sessionIng: '已完成',
      created: time
    })
    saveSession()
    await nextTick()
    const clipboard = new ClipboardJS('.copy-' + time);
    clipboard.on('success', () => {
      ElMessage({
        type: "success",
        message: "复制成功！"
      })
    })
  }
  ModelInfoInit = async () => {
    const json: GPT3Models = await (await fetch('modelsInfo.json')).json()
    modelsInfo.value = json
  }
  abstract setModel(Model: Model): void
  abstract getModel(): any
  abstract listModels: (setData: any) => any
  abstract send(prompt?: string, textList?: Ref<Partial<chatCompletion>[]>): void
}
export default useAiBase