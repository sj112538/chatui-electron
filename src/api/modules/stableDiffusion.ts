import Http from '../http'
import { formData } from '@/pages/Home/com/setting/hook/useForm'
import { hash } from 'ohash'

export const SDApi = new class stableDiffusionApi extends Http {
  getModels = async () => {
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
}
