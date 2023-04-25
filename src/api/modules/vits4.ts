import { formData } from '@/pages/Home/com/setting/hook/useForm'
import Http from '../http'

export const vits4Api = new class vits3Api extends Http {
  generate = async (options: Vits4, speakerName: string, controller: AbortController) => {
    return this.post('post', {
      allUrl: `http://${formData.value['vits4'].location}/run/tts-${speakerName}`, body: {
        data: options
      },
      signal: controller.signal
    })
  }
  getModels = async (folderPath: string) => {
    return this.get('get', {
      allUrl: `http://${formData.value['vits4'].location}/getModels/${folderPath}`
    })
  }
  checkModel = (configPath: string, modelPath: string, infoPath: string) => {
    return this.post('post', {
      allUrl: `http://${formData.value['vits4'].location}/switchs`, body: {
        device: 'cuda',
        configPath,
        modelPath,
        infoPath
      },
    })
  }
}
