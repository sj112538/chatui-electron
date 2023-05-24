import { sessionMap } from "./pages/Home/com/chatLeft"
import { formData } from "./pages/Home/com/setting/hook/useForm"
import { findAndUseOpenPort } from "./utils/modules/net/freePort"
export const init = async () => {
  console.log(findAndUseOpenPort(4000));
  const slack = useSlack()
  slack.getHistory()
  // slack.messageWS()
  usestableDiffusion.confirm()
  chatglmApi.getToken()
  FormStore().FormInfoInit()
  useAiHandler().ModelInfoInit()
  if (nowModel.value) {
    FormStore().setFormName(nowModel.value?.type)
  }
  formData.value.openAi?.isOpen && useOpenAi.getFile()
  formData.value.openAi?.isOpen && useOpenAi.listfineTunes()
  useVits.confirm()
  sessionIngInit()
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