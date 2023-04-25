import { formData } from '@/pages/Home/com/setting/hook/useForm'
import { ElMessage } from 'element-plus'
import useAiBase from './useAiBase'

class AiHandler extends useAiBase {
  listModels = async (setData: any) => {
    formData.value.openAi?.isOpen && useOpenAi.listModels(setData)
    formData.value.stableDiffusion?.isOpen && useStableDiffion.listModels(setData);
    if (formData.value.vits4?.isOpen || formData.value.vits3?.isOpen) {
      useVits.listModels(setData)
    }
  }
  setModel(Model: Model): void {
    throw new Error("Method not implemented.");
  }
  getModel(): globalThis.Ref<any> {
    throw new Error("Method not implemented.");
  }
  resetSession(options: resetSessionOptions) {
    if (!useOpenAi.getModel().value) {
      ElMessage({
        message: "请选择文字模型",
        type: 'error'
      })
      return
    }
    useOpenAi.setTextList(options.textList)
    if (useOpenAi.getModel().value) {
      useOpenAi.reSend(options)
    }
  }
  send = async (prompt: string) => {
    if (!useOpenAi.getModel().value) {
      ElMessage({
        message: "请选择文字模型",
        type: 'error'
      })
      return
    }
    this.editorArea.value = ''
    useOpenAi.setTextList(this.textList)
    useOpenAi.addUserSession(prompt)
    if (useOpenAi.getModel().value) {
      await useOpenAi.send()
    }
    // if (useStableDiffion.getModel().value) {
    //   useStableDiffion.send(prompt)
    // }
  }
}
const useAiHandler = () => {
  return new AiHandler()
}
export default useAiHandler