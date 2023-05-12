import { useSession } from "@/pages/Home/com/chatLeft"

export const usePreText = () => {
  const textActive = ref<boolean>(false)
  const preTextList = ref<preTextList[]>([])
  const addPreText = (chatList: Partial<chatCompletion>[], title: string) => {
    preTextList.value.push({
      title,
      chatList,
      dele: false
    })
    saveTextList()
  }
  const editPreText = (item: Partial<chatCompletion>[], index: number) => {
    preTextList.value[index].chatList = item
    saveTextList()
  }
  const saveTextList = () => {
    Localforage.setItem('preTextList', JSON.stringify(preTextList.value))
  }
  const sendText = (content: string, event: MouseEvent) => {
    event.stopPropagation()
    const { send } = useAiHandler()
    useSession().addSession(Date.now().toString())
  }
  return {
    textActive,
    preTextList,
    addPreText,
    sendText,
    saveTextList,
    editPreText
  }
}
