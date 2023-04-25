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
      localStorage.setItem('nowImgModel', JSON.stringify(Model))
      this.getModel().value = Model
    }
  }
  getModel = () => {
    nowImgModel.value = JSON.parse(localStorage.getItem("nowImgModel")!)
    return nowImgModel
  }
  listModels = async (setData: any) => {
    if (formData.value.stableDiffusion?.isOpen) {
      if (!JSON.parse(localStorage.getItem('stableDiffusionModels')!)) {
        const data = await SDApi.getModels()
        setData(data,'model')
        localStorage.setItem('stableDiffusionModels', JSON.stringify(data))
        return
      }
      setData(JSON.parse(localStorage.getItem('stableDiffusionModels')!))
    }
  }
}

export default new useStableDiffion
