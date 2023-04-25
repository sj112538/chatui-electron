import { hash } from 'ohash'
import { formData } from '@/pages/Home/com/setting/hook/useForm'
import { useCmd } from '@/pages/Home/com/chat/chat-tool-bar/tools/cmd'
interface RequestParams extends RequestInit {
  params?: any
  allUrl?: string,
  isJSON?: boolean
}

const useFetch = async (url: string, options?: RequestParams): Promise<any> => {
  const reqUrl = options?.allUrl || GLOB.VITE_OPENAI + url
  const key = hash(JSON.stringify(options) + url)
  const customHeaders = {
    Authorization: 'Bearer ' + formData.value.openAi.apiKey,
    "Content-Type": "application/json",
    Accept: "application/json",
    ...options?.headers
  }

  try {
    if ((options as any).headers["Content-Type"] == 'undefined') {
      (delete (customHeaders as any)['Content-Type'])
    }
  } catch { }
  const customOptions = { ...options, body: Object.prototype.toString.call(options?.body) === '[object FormData]' ? options?.body : JSON.stringify(options?.body) }
  let response
  if (options?.params) {
    response = await fetch(reqUrl + new URLSearchParams(options.params), { ...options, key, headers: customHeaders } as any)
  } else {
    response = await fetch(reqUrl, { ...customOptions, key, headers: customHeaders } as any)
  }
  if (options?.isJSON?.toString()) {
    return response
  }
  const data = await response.json()
  useCmd().addCMD({ type: 'error', message: data.error?.message })
  return data
}

export default class Http {

  get(url?: string, options?: resqOptions): Promise<any> {
    return useFetch(url!, { method: 'get', ...options })
  }

  post(url?: string, options?: resqOptions): Promise<any> {
    return useFetch(url!, { method: 'post', ...options })
  }

  put(url?: string, body?: any): Promise<any> {
    return useFetch(url!, { method: 'put', body })
  }

  delete(url?: string, params?: any): Promise<any> {
    return useFetch(url!, { method: 'delete', params })
  }
}