import Http from '../http'
import { formData } from '@/pages/Home/com/setting/hook/useForm'
import { hash } from 'ohash'

export const SDApi = new class stableDiffusionApi extends Http {
  getModels = async () => {
    const response: predict<predictData> = await this.post(undefined, {
      body: {
        data: [],
        fn_index: 527,
        session_hash: hash(Date.now())
      }, allUrl: `http://${formData.value?.stableDiffusion?.location}/run/predict/`
    })
    const valueArr = response.data.map((e) => {
      if (e.value) return e.value
      return ''
    })
    const ModelNumber = fuzzyMatch(valueArr!, ['safetensors', 'ckpt'])
    const Models: Partial<Model>[] = response.data[ModelNumber[0]].choices.map(e => {
      return {
        id: e,
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
          fn_index: 524,
          session_hash: hash(Date.now())
        }, allUrl: `http://${formData.value?.stableDiffusion?.location}/run/predict/`
      })
      return response
    } finally {
      closeLoading()
    }
  }
  generate = async (prompt: string) => {
    const h = hash(Date.now())
    const response = await this.post(undefined, {
      body: {
        data: [
          "task(" + h + ")", "((masterpiece,best quality))" + prompt, "EasyNegative, extra fingers,fewer fingers", [], 20, "DPM++ 2M Karras", false, false, 1, 1, 7, -1, -1, 0, 0, 0, false, 512, 512
          , false, 0.7, 2, "Latent", 0, 0, 0, [], "None", false, "", 0, null, null, false, "none", "None", 1, null, false
          , "Scale to Fit (Inner Fit)", false, false, 64, 64, 64, 0, 1, false, 0.9, 5, "0.0001", false, "None", "", 0.1, false, false
          , false, "positive", "comma", 0, false, false, "", "Seed", "", "Nothing", "", "Nothing", "", true, false, false, false,
          0, null, 50, [{
            "name": "E:\\AI\\novelai-webui-aki-v2\\outputs\\txt2img-images\\00340-3453298615-测试.png"
            , "data": "file=E:\\AI\\novelai-webui-aki-v2\\outputs\\txt2img-images\\00340-3453298615-测试.png", "is_file": true
          }]],
        fn_index: 173,
        session_hash: hash(Date.now())
      }, allUrl: `http://${formData.value?.stableDiffusion?.location}/run/predict/`
    })
  }
}
