import { saveSession, sessionMap } from "./pages/Home/com/chatLeft"
import { formData } from "./pages/Home/com/setting/hook/useForm"
export const init = async () => {
  FormStore().FormInfoInit()
  useAiHandler().ModelInfoInit()
  if (nowModel.value) {
    FormStore().setFormName(nowModel.value?.type)
  }
  formData.value.openAi?.isOpen && useOpenAi.getFile()
  formData.value.openAi?.isOpen && useOpenAi.listfineTunes()
  const data = await vits3Api.confirm()
  if (data) {
    vits3_is_open.value = true
  }
  sessionIngInit()
  saveSession()
}

const sessionIngInit = () => {
  for (const key in sessionMap.value) {
    if (sessionMap.value.hasOwnProperty(key)) {  // 排除原型链上的属性
      const value = sessionMap.value[key] as unknown as chatCompletion[];
      if (value) {
        value.forEach((e) => {
          if (e.sessionIng === '进行中') {
            e.sessionIng = '已终止'
          }
        })
      }
    }
  }
}