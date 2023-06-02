import { formData } from "@/pages/Home/com/setting/hook/useForm"
import useAiBase from './useAiBase'
export const nowImgModel = ref<Model>()
export const SD_open = ref<boolean>(false)
class usestableDiffusion extends useAiBase {
  async open() {
    await SDApi.open()
  }
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
    if (formData.value.stableDiffusion?.isOpen && formData.value?.stableDiffusion?.location) {
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
      if (stableDiffusionProgress.value.progress !== 0) {
        stableDiffusionProgress.value = await SDApi.progress()
        return
      }
      clearInterval(inter)
    }, 1500)
  }
  exit = async () => {
    await SDApi.exit()
  }
}
export const stableDiffusionProgress = ref({
  progress: 0
})
export default new usestableDiffusion
