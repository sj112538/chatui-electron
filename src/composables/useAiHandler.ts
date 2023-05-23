import { formData } from '@/pages/Home/com/setting/hook/useForm'
import { ElMessage } from 'element-plus'
import useAiBase from './useAiBase'
import { nowSessionName } from '@/pages/Home/com/chatLeft'

class AiHandler extends useAiBase {
  listModels = async (setData: any) => {
    formData.value.openAi?.isOpen && useOpenAi.listModels(setData)
    formData.value.stableDiffusion?.isOpen && usestableDiffusion.listModels(setData);
    if (settingStore().FormData.vits3?.isOpen || settingStore().FormData.vits4?.isOpen) {
      useVits.listModels(setData)
    }
  }
  setModel(Model: Model): void {
    throw new Error("Method not implemented.");
  }
  getModel(): globalThis.Ref<any> {
    throw new Error("Method not implemented.");
  }
  async resetSession(options: resetSessionOptions) {
    if (!(await useOpenAi.getModel()).value) {
      ElMessage({
        message: "请选择文字模型",
        type: 'error'
      })
      return
    }
    useOpenAi.setTextList(options.textList)
    if ((await useOpenAi.getModel()).value) {
      useOpenAi.reSend(options)
    }
  }
  send = async (prompt: string) => {
    if (!(await useOpenAi.getModel()).value) {
      ElMessage({
        message: "请选择文字模型",
        type: 'error'
      })
      return
    }
    this.editorArea.value = ''
    useOpenAi.setTextList(this.textList)
    useOpenAi.addUserSession(prompt)
    if (nowSessionName.value === '0') {
      await useSlack().postMessage(prompt)
      return
    }
    if ((await useOpenAi.getModel()).value) {
      await useOpenAi.send()
    }
  }
}
const useAiHandler = () => {
  return new AiHandler()
}
export default useAiHandler
