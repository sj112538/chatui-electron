import { formData } from '@/pages/Home/com/setting/hook/useForm'
import Http from '../http'

export const vits3Api = new class vits3Api extends Http {
  generate = async (prompt: string, controller: AbortController) => {
    return this.post('post', {
      allUrl: `http://${formData.value['vits3'].location}/tts1`, body: {
        txt: prompt,
        ...FormStore().FormData['vits3']
      },
      signal: controller.signal
    })
  }
  getModels = async (folderPath: string) => {
    return this.get('get', {
      allUrl: `http://${formData.value['vits3'].location}/getModels/${folderPath}`
    })
  }
  checkModel = (configPath: string, modelPath: string) => {
    return this.post('post', {
      allUrl: `http://${formData.value['vits3'].location}/switch`, body: {
        configPath: configPath,
        modelPath: modelPath
      },
    })
  }
}
