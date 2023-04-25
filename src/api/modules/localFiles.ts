import Http from '../http'
export const filesApi = new class localFiles extends Http {
  getDiskInfo() {
    return this.get('get', {
      allUrl: `http://127.0.0.1:3030/getDisk`
    })
  }
  getFiles(folderPath: string) {
    return this.post('post', {
      allUrl: `http://127.0.0.1:3030/getfiles`,
      body: {
        path: folderPath
      }
    })
  }
}
