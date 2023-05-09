import useAiBase from './useAiBase'
export const vits3_is_open = ref<boolean>(false)
export const vits4_is_open = ref<boolean>(false)
class useVits extends useAiBase {
  listModels = async (setData: any) => {
    const models: any[] = []
    settingStore().FormData.vits3.modelData.forEach((m) => {
      const model = {
        id: m.modelsName,
        object: "model",
        owned_by: "vits",
        source: 'outline',
        type: 'voice',
        info: null,
        image: m.models[0].cover,
        version: 'vits3',
        modelInfo: {
          ...m
        }
      }
      models.push(model)
    })
    settingStore().FormData.vits4.modelData.forEach((m) => {
      const model = {
        id: m.modelsName,
        object: "model",
        owned_by: "vits",
        source: 'outline',
        type: 'voice',
        info: null,
        image: m.models[0].cover,
        version: 'vits4',
        modelInfo: {
          ...m
        }
      }
      models.push(model)
    })
    return setData(models, 'model')
  };
  async send(textItem?: any) {
    textItems = textItem
    oldMessage = textItems.value.message
    const prompt = textItems.value.message
    try {
      if (!prompt) {
        return
      }
      const sentences = prompt.replace(/\。/g, '。|').split('|')
      voiceHanlder(sentences)
    } catch (err) {
      console.log(err);
    }
  }
  async setModel(Model: Model) {
    const info = Model.modelInfo
    if (info?.type === 'single' && Model.version === 'vits3') {
      const { data } = await vits3Api.checkModel(info.config, info.models[0].path, info.modelsName)
    }
    if (info?.type === 'single' && Model.version === 'vits4') {
      const data = await vits4Api.checkModel(info.config, info.models[0].path, info.modelsName, info.models[0].clusterModelPath)
      FormStore().FormData.vits4.spks = data[0]
    }
    nowVitsModel.value = Model
  }
  getModel() {
    return nowVitsModel
  }
  async confirm() {
    try {
      if (FormStore().FormData.vits3.location) {
        const data = await vits3Api.confirm()
        if (data) {
          vits3_is_open.value = true
        }
      }
    } catch { }
    if (FormStore().FormData.vits4.location) {
      const data = await vits4Api.confirm()
      if (data) {
        vits4_is_open.value = true
      }
    }
  }
}
export default new useVits

const nowVitsModel = ref<Model>()
let textItems: Ref<any>
let oldMessage = '';
const isPlay = ref<boolean>(false)
const voiceStock = ref<VoiceStock[]>([])

watch(() => voiceStock.value, async () => {
  if (isPlay.value) {
    return
  }
  while (voiceStock.value.length !== 0) {
    let voice = null
    let audios = null
    if (nowVitsModel.value?.version === 'vits4') {
      voice = voiceStock.value.shift()
      audios = voice!.data! as unknown as string
    }
    if (nowVitsModel.value?.version === 'vits3') {
      const [sampleRate, audio] = voice!.data!
      audios = audio
    }
    const message = voice?.value
    const newStr = highlightString(oldMessage, message!)
    textItems.value.message = newStr
    isPlay.value = true
    await playAudio(audios!, 22050)
    if (voiceStock.value.length === 0) {
      textItems.value.message = cancelHighlightString(textItems.value.message)
    }
    isPlay.value = false
  }
}, {
  deep: true
})

const voiceHanlder = async (sentences: string[]) => {
  let index = 0
  for (let value of sentences) {
    if (value) {
      const controller = new AbortController()
      const matche = value?.match(/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FCFゃゅょ。、々〇〻\u3400-\u4DBF\u4E00-\u9FFFA-Za-z，、！？：；——～｜《》【】（）{}『』「」『』“”‘’]/g)!.join('')
      if (vits4_is_open.value && nowVitsModel.value?.version === 'vits4') {
        const form = FormStore().FormData.vits4
        const { data } = await vits4Api.generate({ text2tts: matche, ...form }, controller)
        voiceStock.value.push({
          data,
          index,
          controller,
          value
        })
      }
      if (vits3_is_open.value && nowVitsModel.value?.version === 'vits3') {
        const form = FormStore().FormData.vits3
        const { data } = await vits3Api.generate({
          text: matche,
          ...form
        }, controller)
        voiceStock.value.push({
          data: data[1],
          index,
          controller,
          value
        })
      }
    }
    index++
  }
}
