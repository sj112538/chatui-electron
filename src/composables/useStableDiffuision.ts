import { formData } from "@/pages/Home/com/setting/hook/useForm"
import useAiBase from './useAiBase'
export const nowImgModel = ref<Model>()
export const SD_open = ref<boolean>(false)
class useStableDiffuision extends useAiBase {
  async send(prompt: string) {
    return await SDApi.generate(prompt)
  }
  getConfig = () => {
    return formData.value.stableDiffusion
  }
  async setModel(Model: Model): Promise<void> {
    const { data } = await SDApi.checkModel(Model.id)
    if (data[0].value === Model.id) {
      await Localforage.setItem('nowImgModel', JSON.stringify(Model))
        ; (await this.getModel()).value = Model
    }
  }
  getModel = async () => {
    nowImgModel.value = JSON.parse(await Localforage.getItem("nowImgModel") as string)
    return nowImgModel
  }
  listModels = async (setData: any) => {
    if (formData.value.stableDiffusion?.isOpen) {
      if (!JSON.parse(await Localforage.getItem('stableDiffusionModels') as string)) {
        const data = await SDApi.getModels()
        setData(data, 'model')
        await Localforage.setItem('stableDiffusionModels', JSON.stringify(data))
        return
      }
      setData(JSON.parse(await Localforage.getItem('stableDiffusionModels') as string))
    }
  }
  confirm = async () => {
    if (await SDApi.confirm()) {
      SD_open.value = true
    }
  }
  progress = () => {
    const inter = setInterval(async () => {
      if (stableDiffuisionProgress.value.progress !== 0) {
        stableDiffuisionProgress.value = await SDApi.progress()
        return
      }
      clearInterval(inter)
    }, 1500)
  }
  exit = async () => {
    await SDApi.exit()
  }
}
export const stableDiffuisionProgress = ref({
  progress: 0
})
export default new useStableDiffuision
