import { sessionMap, useSession } from "./pages/Home/com/chatLeft"
import { formData } from "./pages/Home/com/setting/hook/useForm"
export const init = async () => {
  // openServer()
  sessionInit()
  console.log(nodePty);
  
  // slack.messageWS()
  usestableDiffusion.confirm()
  // const slack = useSlack()
  // slack.getHistory()
  // chatglmApi.getToken()
  FormStore().FormInfoInit()
  useAiHandler().ModelInfoInit()
  if (nowModel.value) {
    FormStore().setFormName(nowModel.value?.type)
  }
  formData.value.openAi?.isOpen && useOpenAi.getFile()
  formData.value.openAi?.isOpen && useOpenAi.listfineTunes()
  sessionIngInit()
  useVits.confirm()
}

export const pythonPort = ref<number>(5000)
export const nodePort = ref<number>(6000)
const openServer = async () => {
  try {
    const portfinder = require('portfinder')
    pythonPort.value = await portfinder.getPortPromise({
      port: 5000
    })
    const { spawn } = require("child_process");
    const Process = spawn("..\\venv\\python.exe", ["..\\server\\api.py", pythonPort.value], {
      shell: process.platform === 'win32',
      stdio: "pipe",
    });
    const nodeProcess = spawn("..\\venv\\python.exe", ["..\\server\\api.py", pythonPort.value], {
      shell: process.platform === 'win32',
      stdio: "pipe",
    });
    Process.stdout.on("data", (data: any) => {
      console.log(icDcode(data));
    });
    Process.stderr.on("data", (data: any) => {
      console.log(icDcode(data));
    });
  } catch (err) {
    console.log(err);
  }
};
const sessionIngInit = () => {
  for (const key in sessionMap.value) {
    if (sessionMap.value.hasOwnProperty(key)) {  // 排除原型链上的属性
      const value = sessionMap.value[key] as unknown as chatCompletion[];
      if (Array.isArray(value)) {
        value.forEach((e) => {
          if (e.sessionIng === '进行中') {
            e.sessionIng = '已终止'
          }
        })
      }
    }
  }
}
const sessionInit = () => {
  const { sessionBuilder, getSession } = useSession()
  getSession()
  sessionBuilder()
}