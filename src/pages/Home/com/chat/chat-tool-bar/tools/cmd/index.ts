export const cmdsList = ref<CMD[]>([])
const cmdMap = {
  cls: () => {
    cmdsList.value = []
  },
  '': () => {

  },
  test: () => {
    useTest().isShow.value = true
  }
}

type cmdMapKey = keyof typeof cmdMap
const cmdActive = ref<boolean>(false)
const paramActive = ref<boolean>(false)
const messages = ref('')
const messageStauts = ref<'STDOUT' | 'STDERR'>('STDOUT')
export const useCmd = () => {
  const cmdInputValue = ref<cmdMapKey>('')
  const oldInputVlaue = ref<cmdMapKey>('')
  const readonly = ref<boolean>(false)
  const addCMD = (cmd: CMD) => {
    if (cmd.message && cmd.type) {
      cmdsList.value.push(cmd)
    }
  }
  const clearCmdInput = () => {
    cmdInputValue.value = ''
    oldInputVlaue.value = ''
  }
  const getCmdList = () => {
    return cmdsList
  }
  const cmdInputEvent = (e: string) => {
    if (readonly.value) {
      cmdInputValue.value = oldInputVlaue.value
    } else {
      oldInputVlaue.value = e as cmdMapKey
    }
  }
  const execute = async (cmd: cmdMapKey) => {
    try {
      addCMD({ type: 'default', message: cmd })
      readonly.value = true
      const cmdText: cmdMapKey = cmd
      clearCmdInput()
      const data = await modeTypeFuncMap[useGamePlay().PlayName.value](cmdText)
      await nextTick()
      return data
    } finally {
      readonly.value = false
    }
  }
  const modeTypeFuncMap = {
    '控制模式': (cmdText: string): Promise<string> => {
      return new Promise((resolve, reject) => {
        if (cmdMap[cmdText.trim() as cmdMapKey]) {
          cmdMap[cmdText.trim() as cmdMapKey]()
          resolve('')
        } else {
          try {
            const cmd = require("child_process")
            const ls = cmd.exec(cmdText.trim(), { encoding: 'binary' })
            ls.stdout!.on('data', (data: any) => {
              messageStauts.value = 'STDOUT'
              messages.value += icDcode(data)
              addCMD({ type: 'default', message: icDcode(data) })
            })
            ls.stderr?.on('data', (data: any) => {
              messageStauts.value = 'STDERR'
              messages.value += icDcode(data)
              addCMD({ type: 'error', message: icDcode(data) })
            })
            ls.on('close', () => {
              resolve(messages.value)
            })
            ls.on('exit', () => {
              resolve(messages.value)
            })
          } catch (error) {
            console.log(error);
          }
        }
      })
    },
    '默认模式': (cmdText: string) => {
      if (cmdMap[cmdText.trim() as cmdMapKey]) {
        cmdMap[cmdText.trim() as cmdMapKey]()
      } else {
        addCMD({ type: 'error', message: `${cmdText} : 无法将“${cmdText}”项识别为 cmdlet、函数、脚本文件或可运行程序的名称。请检查名称的拼写，如果包括路径，请确保路径正确，然后再试一次。` })
      }
    }
  }
  // const matchCmd = async (cmdStr: string, textList: any) => {
  //   const regex = /RUN\((['"])([^'"]*)\1\)/g;
  //   const matches = cmdStr.matchAll(regex);
  //   for (const match of matches) {
  //     const command = match[2]
  //     const result = await execute(command as cmdMapKey)
  //     const useAi = useAiHandler()
  //     useAi.setTextList(textList)
  //     await useAi.send(messageStauts + ':' + result!)
  //     messages.value = ''
  //   }
  // }
  return {
    cmdActive,
    addCMD,
    getCmdList,
    execute,
    cmdInputEvent,
    cmdInputValue,
    paramActive,
    // matchCmd
  }
}