import { OpenAIFile } from "openai"
import CircularJSON from 'circular-json'
export class Search {
  [x: string]: any
  search = ref<string>('')
  filter: Ref<Model[] & OpenAIFile[] | Object> = ref([])
  data: Ref<Model[] & OpenAIFile[] | Object> = ref([])
  constructor() {
    watchEffect(() => {
      if (Array.isArray(this.data.value)) {
        const res = fuzzyMatch(this.data.value!.map(e => {
          return e?.id || ''
        }), this.search.value)
        this.filter.value = []
        res.forEach(e => {
          (this.filter.value as any[]).push((this.data.value! as any[])[e])
        })
      } else {
        const keys = Object.keys(this.data.value);
        const values = keys.map((e) => {
          let res = ''
          if (((this.data.value as any)[e])[0]) {
            res = (this.data.value as any)[e][0].title
          }
          return res
        })
        const res = fuzzyMatch(values, this.search.value)
        this.filter.value = {}
        res.forEach((e) => {
          Reflect.set(this.filter.value, keys[e], (this.data.value as any)[keys[e]])
        })
      }
    })
  }
  setData = (data: any[], type?: 'model') => {
    this.filter.value = (this.filter.value as any[]).concat(data) as any
    this.data.value = (this.data.value as any[]).concat(data) as any
    if (type === 'model') {
      ModelsList.value = this.data.value as Model[]
    }
  }
  resetData = (data: any[] | Object) => {
    this.filter.value = data
    this.data.value = data
  }
}
export const ModelsList = ref<Model[]>([])

export const useSearch = () => {
  return new Search()
}

interface sessionMap {
  [x: string]: Ref<chatCompletion[]>
}

export const sessionMap: Ref<sessionMap> = ref({}) as any

export const saveSession = async () => {
  await Localforage.setItem('sessionMap', CircularJSON.stringify(sessionMap.value))
}
export let nowSessionName = ref<string>('')
export class Session {
  constructor(public session?: Ref<Partial<chatCompletion>[]>) { }
  addSession = (name: string, session?: Partial<chatCompletion>[]) => {
    if (session) {
      Reflect.set(sessionMap.value, name, session)
    } else {
      Reflect.set(sessionMap.value, name, this.session!.value)
    }
    saveSession()
  }
  sessionBuilder = () => {
    const textList = ref<Partial<chatCompletion>[]>([])
    useSession(textList).addSession('空白对话')
    nowSessionName.value = '空白对话'
    saveSession()
  }
  setSession = (name: string) => {
    nowSessionName.value = name
  }
  getSession = async () => {
    sessionMap.value = CircularJSON.parse(await Localforage.getItem('sessionMap') as string) || {}
  }

  insertSession = (index: number) => {
    insertSessionMap[nowModel.value!.type as insertSessionKey](index)
  }
  deleSession = (session: Partial<chatCompletion>) => {
    (sessionMap.value[session.created!] as any).forEach((e: any) => {
      if (e._value) {
        if (e._value.sessionIng === '进行中') {
          if (!isNotNull(e._value.signal))
            e._value.signal?.abort()
        }
        e.moreTextList?.forEach((e1: any) => {
          if (e1._value.sessionIng._value === '进行中') {
            e1._value.signal?.abort()
          }
        })
      }
      e.moreTextList?.forEach((e: Ref<chatCompletion>) => {
        if (e.value?.sessionIng === '进行中') {
          e.value.signal?.abort()
        }
      })
    })
    delete sessionMap.value[session.created!]
    saveSession()
  }
}

export const useSession = (session?: Ref<Partial<chatCompletion>[]>) => {
  return new Session(session)
}
type insertSessionKey = keyof typeof insertSessionMap
const insertSessionMap = {
  'chatCompletion': (index: number) => {
    (sessionMap.value[nowSessionName.value] as unknown as Partial<chatCompletion>[]).splice(index + 1, 0, {
      message: '',
      role: 'system',
      owned_by: 'my',
      edit: true,
      createdTime: Dayjs(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
      created: Date.now()
    })
  },
  'completion': () => { }
}