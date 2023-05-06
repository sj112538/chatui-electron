import Http from '../http'
export const vits3Api = new class vits3Api extends Http {
  generate = async (options: Vits3, controller: AbortController) => {
    return this.post('post', {
      allUrl: `http://127.0.0.1:${FormStore().FormData.vits3.location}/generate`, body: {
        ...options, modelName: useVits.getModel().value?.modelInfo?.modelsName
      },
      signal: controller.signal
    })
  }
  getModels = async (folderPath: string) => {
    return this.get('get', {
      allUrl: `http://127.0.0.1:${FormStore().FormData.vits3.location}/getModels/${folderPath}`
    })
  }
  checkModels = (configPath: string, modelPath: string, infoPath: string) => {
    return this.post('post', {
      allUrl: `http://127.0.0.1:${FormStore().FormData.vits3.location}/switchs`, body: {
        device: 'cuda',
        configPath,
        modelPath,
        infoPath
      },
    })
  }
  checkModel = (configPath: string, modelPath: string, name: string) => {
    return this.post('post', {
      allUrl: `http://127.0.0.1:${FormStore().FormData.vits3.location}/switch`, body: {
        device: 'cuda',
        configPath,
        modelPath,
        name
      },
    })
  }
  confirm = () => {
    return this.get('get', {
      allUrl: `http://127.0.0.1:${FormStore().FormData.Vits3.location}/confirm`
    })
  }
}
