import { pythonPort } from '@/init'
import Http from '../http'
import { formData } from '@/pages/Home/com/setting/hook/useForm'
import { hash } from 'ohash'

export const SDApi = new class stableDiffusionApi extends Http {
  open = async () => {
    return this.post('post', {
      allUrl: `http://127.0.0.1:${pythonPort.value}/open/StableDiffusion`,
      body: {
        args: ['--xformers', '--nowebui']
      }
    })
  }
  getModels = async () => {
    if (formData.value?.stableDiffusion?.location) return
    const response: stableDiffusionModel[] = await this.get(undefined, {
      allUrl: `http://${formData.value?.stableDiffusion?.location}/sdapi/v1/sd-models/`
    })
    const Models: Partial<Model>[] = response.map(e => {
      return {
        id: e.title,
        owned_by: 'stableDiffusion',
        source: 'local',
        type: 'image'
      }
    })
    return Models
  }
  checkModel = async (ModelName: string) => {
    try {
      openLoading()
      const response = await this.post(undefined, {
        body: {
          data: [ModelName],
          fn_index: 586,
          session_hash: hash(Date.now())
        }, allUrl: `http://${formData.value?.stableDiffusion?.location}/run/predict/`
      })
      return response
    } finally {
      closeLoading()
    }
  }
  generate = async (prompt: string) => {
    return await this.post(undefined, {
      body: { ...FormStore().FormData.stableDiffusion, Prompt: prompt }, allUrl: `http://${formData.value?.stableDiffusion?.location}/sdapi/v1/txt2img`
    })
  }
  confirm = async () => {
    if (!formData.value?.stableDiffusion?.location) return
    return await this.get(undefined, {
      allUrl: `http://${formData.value?.stableDiffusion?.location}/app_id`
    })
  }
  progress = async (isSkip: boolean = false) => {
    return await this.get(undefined, {
      allUrl: `http://${formData.value?.stableDiffusion?.location}/sdapi/v1/progress?skip_current_image=${isSkip}`
    })
  }
  exit = async () => {
    return await this.get(undefined, {
      allUrl: `http://${formData.value?.stableDiffusion?.location}/sdapi/v1/exit`
    })
  }
}
