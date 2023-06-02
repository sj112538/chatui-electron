import { pythonPort } from '@/init'
import Http from '../http'
export const localApi = new class localFiles extends Http {
  getDiskInfo() {
    return this.get('get', {
      allUrl: `http://127.0.0.1:${GLOB.VITE_API_PORT}/getDisk`
    })
  }
  getFiles(folderPath: string) {
    return this.post('post', {
      allUrl: `http://127.0.0.1:${GLOB.VITE_API_PORT}/getfiles`,
      body: {
        path: folderPath
      }
    })
  }
  excuteCmd(command: string, type: TermWsMapKey) {
    return this.post('post', {
      allUrl: `http://127.0.0.1:${pythonPort.value}/excuteNonRealTime`,
      body: {
        command,
        type
      }
    })
  }
}
