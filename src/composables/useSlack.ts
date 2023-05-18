import { useSession } from "@/pages/Home/com/chatLeft"
import { ConversationsHistoryResponse } from "@slack/web-api"

export const channels = ref()
export const members = ref()
export const history = ref<Partial<chatCompletion>[]>([])
class Slack {
  getChannels = async () => {
    const { result } = await slackApi.getChannel(FormStore().FormData.slack)
    channels.value = result.channels
  }
  getMembers = async () => {
    const { result } = await slackApi.getMember(FormStore().FormData.slack)
    members.value = result.members
  }
  postMessage = async (message: string) => {
    const { result } = await slackApi.postMessage({ message: message, ...FormStore().FormData.slack })
    return result
  }
  getHistory = async () => {
    const { result } = await slackApi.history(FormStore().FormData.slack) as { result: ConversationsHistoryResponse }
    history.value = result.messages!.reverse().map((e) => {
      return {
        title: 'Claude',
        role: e.bot_profile?.name === 'Claude' ? 'assistant' : 'user',
        owned_by: e.bot_profile?.name === 'Claude' ? 'Claude' : 'user',
        message: e.text,
        created: +e.ts!.replace(/\./g, ''),
        createdTime: Dayjs(+e.ts! * 1000).format('YYYY-MM-DD HH:mm:ss')
      }
    })
    useSession().addSession('0', history.value)
    return result
  }
  test = async () => {
    const { result } = await slackApi.test(FormStore().FormData.slack)
    return result
  }
  messageWS = async () => {
    const ws = new WebSocket(`ws://127.0.0.1:${GLOB.VITE_API_PORT}/slackWs`);
    ws.addEventListener('message', (event) => {
      const message = JSON.parse(event.data);
      console.log(message);
    });
  }
}

export const useSlack = () => {
  const slack = new Slack()
  return slack
}