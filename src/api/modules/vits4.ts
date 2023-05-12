import Http from '../http'
export const vits4Api = new class vits4Api extends Http {
  generate = async (options: Vits4, controller: AbortController) => {
    return this.post('post', {
      allUrl: `http://127.0.0.1:6002/generate`, body: {
        ...options, modelName: useVits.getModel().value?.modelInfo?.modelsName
      },
      signal: controller.signal
    })
  }
  getModels = async (folderPath: string) => {
    return this.get('get', {
      allUrl: `http://127.0.0.1:6002/getModels/${folderPath}`
    })
  }
  checkModels = (configPath: string, modelPath: string, infoPath: string) => {
    return this.post('post', {
      allUrl: `http://127.0.0.1:6002/switchs`, body: {
        device: 'cuda',
        configPath,
        modelPath,
        infoPath
      },
    })
  }
  checkModel = (configPath: string, modelPath: string, name: string, clusterModelPath: string) => {
    return this.post('post', {
      allUrl: `http://127.0.0.1:6002/switchs`, body: {
        device: 'cuda',
        configPath,
        modelPath,
        name,
        clusterModelPath,
        enhance: false
      },
    })
  }
  confirm = () => {
    return this.get('get', {
      allUrl: `http://127.0.0.1:6002/confirm`
    })
  }
}
