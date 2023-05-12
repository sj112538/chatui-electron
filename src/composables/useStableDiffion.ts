import { formData } from "@/pages/Home/com/setting/hook/useForm"
import useAiBase from './useAiBase'
export const nowImgModel = ref<Model>()
class useStableDiffion extends useAiBase {
  send(prompt: string): void {
    SDApi.generate(prompt)
  }
  getConfig = () => {
    return formData.value.stableDiffusion
  }
  async setModel(Model: Model): Promise<void> {
    const { data } = await SDApi.checkModel(Model.id)
    if (data[0].value === Model.id) {
      await Localforage.setItem('nowImgModel', JSON.stringify(Model))
      ;(await this.getModel()).value = Model
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
}

export default new useStableDiffion
