import { formData } from '@/pages/Home/com/setting/hook/useForm';
import useAiBase from './useAiBase'
class useVits extends useAiBase {
  listModels = async (setData: any) => {
    let files: any[] = []
    let version = ''
    const models: Model[] = []
    if (formData.value.vits3.isOpen) {
      version = 'vits3'
      const res = await vits3Api.getModels(formData.value.vits3.modelPos)
      files.push(res)
    }
    if (formData.value.vits4.isOpen) {
      version = 'vits4'
      const res = await vits4Api.getModels(formData.value.vits4.modelPos)
      files.push(res)
    }
    let image = ''
    files.forEach((file) => {
      Object.keys(file).forEach((key) => {
        file![key].image && Object.keys(file![key].image).forEach((key1) => {
          image = file![key].image[key1]
        })
        file[key]['.pth'] && models.push({
          id: key,
          object: "model",
          type: 'voice',
          source: 'outline',
          info: null,
          owned_by: 'vits',
          image,
          files: file[key],
          version: version
        })
      });
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
  setModel(Model: Model): void {
    let modelPath: string
    Object.keys(Model.files['.pth']).forEach((key) => {
      modelPath = Model.files['.pth'][key]
    })
    Model.version === 'vits3' && vits3Api.checkModel(Model.files['.json']['config.json'], modelPath!)
    Model.version === 'vits4' && vits4Api.checkModel(Model.files['.json']['config.json'], modelPath!, infoPath)
    nowVitsModel.value = Model
  }
  getModel() {
    return nowVitsModel
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
      if (formData.value.vits3.isOpen && nowVitsModel.value?.version === 'vits3') {
        const { data } = await vits3Api.generate(matche, controller)
        voiceStock.value.push({
          data,
          index,
          controller,
          value
        })
      }
      if (formData.value.vits4.isOpen && nowVitsModel.value?.version === 'vits4') {
        const { data } = await vits4Api.generate([matche, 'Japanese', 0.6, 0.668, 1, false], 'Sorasaki Hina', controller)
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
