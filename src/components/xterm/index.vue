<template>
  <div v-loading="loading" ref="terminal" id="xterm" element-loading-text="拼命连接中"></div>
</template>
<script setup>
import { debounce } from 'lodash'
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import "xterm/css/xterm.css";
const terminal = ref(null)
const fitAddon = new FitAddon();

let first = ref(true);
let loading = ref(false);
let terminalSocket = ref(null);
let term = ref(null);
const props = defineProps({
  type: String
})

const runRealTerminal = () => {
  loading.value = false;
}

const onWSReceive = (message) => {
  const data = message.data
  term.value.element && term.value.focus()
  term.value.write(data)
}

const errorRealTerminal = (ex) => {
  let message = ex.message;
  if (!message) message = 'disconnected'
  term.value.write(`\x1b[31m${message}\x1b[m\r\n`)
  console.log("err");
}
const closeRealTerminal = () => {
  console.log("close");
}

const createWS = () => {
  const url = `ws://127.0.0.1:3030/cmd`
  terminalSocket.value = new WebSocket(url);
  terminalSocket.value.onopen = runRealTerminal;
  terminalSocket.value.onmessage = onWSReceive;
  terminalSocket.value.onclose = closeRealTerminal;
  terminalSocket.value.onerror = errorRealTerminal;
}
const initWS = () => {
  if (!terminalSocket.value) {
    createWS();
  }
  if (terminalSocket.value && terminalSocket.value.readyState > 1) {
    terminalSocket.value.close();
    createWS();
  }
}
// 发送给后端,调整后端终端大小,和前端保持一致,不然前端只是范围变大了,命令还是会换行
const resizeRemoteTerminal = () => {
  const { cols, rows } = term.value
  if (isWsOpen()) {
    terminalSocket.value.send(JSON.stringify({
      Op: 'resize',
      Cols: cols,
      Rows: rows,
    }))
  }
}
const initTerm = () => {
  term.value = new Terminal({
    lineHeight: 1.2,
    fontSize: 12,
    fontFamily: "Monaco, Menlo, Consolas, 'Courier New', monospace",
    theme: {
      foreground: '#fff', //字体
      background: '#000', //背景色
      cursor: 'help',//设置光标
    },
    rendererType: "canvas",
    // 光标闪烁
    cursorBlink: true,
    cursorStyle: 'underline',
    scrollback: 100,
    tabStopWidth: 4,
    convertEol: true,
    enableInputFlow: true
  });
  term.value.open(terminal.value);
  term.value.loadAddon(fitAddon);
  // 不能初始化的时候fit,需要等terminal准备就绪,可以设置延时操作
  setTimeout(() => {
    fitAddon.fit();
  }, 5)
}
// 是否连接中0 1 2 3 
const isWsOpen = () => {
  const readyState = terminalSocket.value && terminalSocket.value.readyState;
  return readyState === 1
}
const fitTerm = () => {
  resizeRemoteTerminal()
  fitAddon.fit();
}
const onResize = debounce(() => fitTerm(), 800);

const termData = () => {
  // 输入与粘贴的情况,onData不能重复绑定,不然会发送多次
  term.value.onData(data => {
    const command = data
    if (isWsOpen()) {
      terminalSocket.value.send(
        JSON.stringify({
          Op: 'stdin',
          Data: command,
        })
      );
    }
  });
}
const onTerminalResize = () => {
  window.addEventListener("resize", onResize);
}
const removeResizeListener = () => {
  window.removeEventListener("resize", onResize);
}
//监听类型变化，重置term
watch(() => props.type, () => {
  first.value = true;
  loading.value = true;
  terminalSocket.value = null;
  initWS();
  // 重置
  term.value.reset();
})

const init = () => {
  loading.value = true
  initWS();
  initTerm();
  termData();
  onTerminalResize();
  return isWsOpen
}
const excute = (command) => {
  if (isWsOpen()) {
    terminalSocket.value.send(
      JSON.stringify({
        Op: 'stdin',
        Data: command,
      })
    );
  }
}
onBeforeUnmount(() => {
  removeResizeListener();
  terminalSocket.value && terminalSocket.value.close();
})
defineExpose({
  init,
  excute
})
</script>
