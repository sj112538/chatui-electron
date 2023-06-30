import { nodePort, pythonPort } from '@/init'
import Http from '../http'
export const localApi = new class localFiles extends Http {
  getDiskInfo() {
    return this.get('get', {
      allUrl: `http://127.0.0.1:${nodePort.value}/getDisk`
    })
  }
  getFiles(folderPath: string) {
    return this.post('post', {
      allUrl: `http://127.0.0.1:${nodePort.value}/getfiles`,
      body: {
        path: folderPath
      }
    })
  }
  confirmNode() {
    return this.get('get', {
      allUrl: `http://127.0.0.1:${nodePort.value}/confirm`
    })
  }
  confirmPython() {
    return this.get('get', {
      allUrl: `http://127.0.0.1:${pythonPort.value}/confirm`
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
