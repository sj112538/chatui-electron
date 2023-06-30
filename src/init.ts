import { sessionMap, useSession } from "./pages/Home/com/chatLeft"
import { formData } from "./pages/Home/com/setting/hook/useForm"
export const init = async () => {
  openServer()
  sessionInit()
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
  nodePort.value = await Localforage.getItem('nodePort') as number
  pythonPort.value = await Localforage.getItem('pythonPort') as number
  try {
    await localApi.confirmNode().catch(async () => {
      nodePort.value = await portfinder.getPortPromise({
        port: 6001
      })
      await Localforage.setItem('nodePort', nodePort.value)
      const nodeProcess = child_process.spawn("..\\nodeserver-win", [nodePort.value], {
        shell: process.platform === 'win32',
        stdio: "pipe",
      });
      nodeProcess.stdout.on("data", (data: any) => {
        console.log(icDcode(data));
      });
      nodeProcess.stderr.on("data", (data: any) => {
        console.log(icDcode(data));
      })
      nodeProcess.on("exit", (code: any) => {
        console.log(`子进程退出码：${code}`);
      });
    })
    await localApi.confirmPython().catch(async () => {
      pythonPort.value = await portfinder.getPortPromise({
        port: 5001
      })
      await Localforage.setItem('pythonPort', pythonPort.value)
      const Process = child_process.spawn("..\\venv\\python.exe", ["..\\server\\api.py", pythonPort.value], {
        shell: process.platform === 'win32',
        stdio: "pipe",
      });
      Process.stdout.on("data", (data: any) => {
        console.log(icDcode(data));
      });
      Process.stderr.on("data", (data: any) => {
        console.log(icDcode(data));
      });
      Process.on("exit", (code: any) => {
        console.log(`子进程退出码：${code}`);
      });
    })
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