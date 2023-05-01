import { debounce } from 'lodash'
import { ref } from 'vue'
import { Terminal } from "xterm"
import { FitAddon } from "xterm-addon-fit"
import "xterm/css/xterm.css"
const termWsMap = ref<TermWsMap | null>({
  python: null,
  command: null
})
const termList = ref<HTMLElement[]>([])
let term = ref<Terminal>()
export const useCommand = (terminal: Ref<HTMLElement | undefined>) => {
  const fitAddon = new FitAddon()
  let loading = ref(false)
  const type = ref<TermWsMapKey>('command')
  const init = () => {
    loading.value = true
    initWS()
    initTerm()
    termData()
    onTerminalResize()
    return isWsOpen
  }
  const initTerm = () => {
    term.value! = new Terminal({
      lineHeight: 1.2,
      fontSize: 12,
      fontFamily: "Monaco, Menlo, Consolas, 'Courier New', monospace",
      theme: {
        foreground: '#fff', //字体
        background: '#000', //背景色
        cursor: 'help',//设置光标
      },
      // 光标闪烁
      cursorBlink: true,
      cursorStyle: 'underline',
      scrollback: 100,
      tabStopWidth: 4,
      convertEol: true
    })
    if (termList.value.some(e => e === terminal.value)) {
      return
    }
    term.value!.open(terminal.value!)
    termList.value.push(terminal.value!)
    term.value!.loadAddon(fitAddon)
    // 不能初始化的时候fit,需要等terminal准备就绪,可以设置延时操作
    setTimeout(() => {
      fitAddon.fit()
    }, 5)
  }
  const initWS = () => {
    if (!termWsMap.value?.python) {
      createWS('python', `ws://127.0.0.1:${GLOB.VITE_PYTHON_PORT}/execute`)
    }
    if (!termWsMap.value?.command) {
      createWS('command', `ws://127.0.0.1:${GLOB.VITE_API_PORT}/cmd`)
    }
  }
  const createWS = (type: TermWsMapKey, url: string) => {
    termWsMap.value![type] = new WebSocket(url)
    termWsMap.value![type]!.onopen = runRealTerminal
    termWsMap.value![type]!.onmessage = onWSReceive
    termWsMap.value![type]!.onclose = closeRealTerminal
    termWsMap.value![type]!.onerror = errorRealTerminal
  }
  const runRealTerminal = () => {
    loading.value = false
  }
  const onWSReceive = (message: { data: any }) => {
    const data = message.data
    term.value!.element && term.value!.focus()
    term.value!.write(data)
  }
  const errorRealTerminal = (ex: any) => {
    let message = ex.message
    if (!message) message = 'disconnected'
    term.value!.write(`\x1b[31m${message}\x1b[m\r\n`)
    console.log("err")
  }
  const closeRealTerminal = () => {
    console.log("close")
  }
  const termData = () => {
    term.value!.onData((data: any) => {
      if (type.value === 'python') {
        return
      }
      const command = data
      if (isWsOpen('command')) {
        termWsMap.value!.command!.send(
          JSON.stringify({
            Op: 'stdin',
            Data: command,
          })
        )
      }
    })
  }
  // 是否连接中0 1 2 3 
  const isWsOpen = (type: TermWsMapKey | undefined) => {
    if (!type) {
      type = 'command'
    }
    const readyState = termWsMap.value![type] && termWsMap.value![type]!.readyState
    return readyState === 1
  }
  const fitTerm = () => {
    fitAddon.fit()
  }
  const onResize = debounce(() => fitTerm(), 800)
  const onTerminalResize = () => {
    window.addEventListener("resize", onResize)
  }
  const excute = (command: string, type?: TermWsMapKey) => {
    if (!type) {
      type = 'command'
    }
    if (isWsOpen(type!)) {
      termWsMap.value![type!]!.send(
        JSON.stringify({
          Op: 'stdin',
          Data: command,
        })
      )
    }
  }
  return {
    init, excute
  }
}
