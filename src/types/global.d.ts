import { FormRules } from 'element-plus';
import { CreateChatCompletionResponse, CreateCompletionRequest, CreateChatCompletionRequest, ChatCompletionRequestMessage } from 'openai'
declare global {

  declare const GLOB: ViteEnv
  declare interface ViteEnv {
    VITE_ENV: string
    VITE_OSS: string
    VITE_OPENAI: string
    VITE_API_PORT: number
    VITE_PYTHON_PORT: number
  }
  interface Model extends GptModel {
    id: string;
    object: string;
    created?: number;
    owned_by?: string;
    permission?: ModelPermission[];
    root?: string;
    parent?: string | null;
    type: 'completion' | 'chatCompletion' | 'image' | 'voice',
    source: string,
    image?: string,
    files?: any
  }
  interface ModelPermission {
    id: string;
    object: string;
    created: number;
    allow_create_engine: boolean;
    allow_sampling: boolean;
    allow_logprobs: boolean;
    allow_search_indices: boolean;
    allow_view: boolean;
    allow_fine_tuning: boolean;
    organization: string;
    group: string | null;
    is_blocking: boolean;
  }
  interface ChatExtends {
    message: string,
    role: 'user' | 'assistant',
    owned_by: string
  }
  type SessionIng = '进行中' | '已完成' | '已失败' | '已终止'
  interface chatCompletion extends ChatCompletionRequestMessage, CreateChatCompletionResponse, CreateChatCompletionStreamResponse {
    message: string,
    role: 'user' | 'assistant' | 'system',
    owned_by: string,
    sessionIng: SessionIng,
    signal: AbortController,
    createdTime: string,
    title: string,
    moreTextList: { _value: chatCompletion }[],
    edit: boolean,
    isSkip: boolean
  }
  interface CreateChatCompletionStreamResponse {
    id: string;
    object: string;
    created: number;
    model: string;
    choices: Choice[];
  }

  interface Choice {
    text?: string;
    delta: {
      content: string;
    };
    index: number;
    finish_reason: null;
  }
  interface settingLogRef {
    name: string,
    open: () => void
  }
  interface chatRightItemRef {
    name: string,
    show: () => void,
    hidden: () => void
  }
  interface FormData {
    stableDiffusion: StableDiffusion
    openAi: OpenaiSetting,
    vits3: vits3
    vits4: vits4
  }
  interface vits3 {
    location: string
    isOpen: boolean
    regex: string
    modelPos: string
  }
  interface vits4 {
    location: string
    isOpen: boolean
    regex: string
    modelPos: string
  }
  interface chatRightFormData {
    chatCompletion: Partial<CreateChatCompletionRequest>
    completion: Partial<CreateCompletionRequest>
    'vits3': any
    'openAi微调': CreateFineTuneRequest
    'vits4': any
    [x: string]: Object
  }

  interface StableDiffusion {
    location: string
    isOpen: boolean
  }
  interface predict<T> {
    average_duration: number;
    data: T[];
    duration: number;
    is_generating: boolean;
  }
  interface predictData {
    choices: string[],
    value: string,
    __type__: string
  }
  interface OpenaiSetting {
    isOpen: boolean,
    apiKey: string
  }
  type GptInfo = {
    en: string;
    zh: string;
  }
  type GptModel = {
    type: string;
    info: GptInfo | null;
    version?: string;
  }
  interface GPT3Models {
    "gpt-3.5-turbo": GptModel;
    "gpt-3.5-turbo-0301": GptModel;
    "text-davinci-003": GptModel;
    "text-davinci-002": GptModel;
    "code-davinci-002": GptModel
  }
  interface formInfo {
    chatCompletion: {
      formOptions: {
        [x: string]: formOption
      };
    },
    "openAi微调": {
      formOptions: {
        [x: string]: formOption
      };
    },
    "vits3": {
      formOptions: {
        [x: string]: formOption
      };
    }
    "vits4": {
      formOptions: {
        [x: string]: formOption
      };
    }
  }
  interface formOption {
    type: 'input-number' | 'input-text' | 'checkbox' | 'select' | 'input-text-file-select',
    label: String,
    min: number,
    max: mumber,
    step: number,
    precision: number,
    rules: FormRules,
    info: string,
    select: Array,
    multiple: Boolean,
    seleType: '文件夹' | '文件' | '混合'
  }

  type GPT3ModelsKeys = keyof GPT3Models

  interface CMD {
    type: 'default' | 'success' | 'error',
    message: string
  }
  type PlayListMode = '默认模式' | '控制模式';
  type PlayList = PlayItem[]
  interface PlayItem {
    modeName: PlayListMode,
    info: string,
    status: boolean
  }
  interface preText {
    title: string,
    content: string,
    dele: boolean
  }
  interface resetSessionOptions {
    textList: Ref<chatCompletion[]>,
    index: number,
    currentChange: (n?: number) => void,
    changeCurrent: (n: number) => void
  }
  interface resqOptions {
    isJSON?: boolean;
    method?: string;
    params?: any;
    signal?: AbortSignal;
    allUrl?: string;
    headers?: { [key: string]: string };
    body?: any;
  }
  type Voice = [number, string]
  interface VoiceStock {
    data: Voice,
    index: number,
    controller: AbortController,
    value: string
  }
  type Vits4 = [
    text: string,
    language: string,
    noise_scale: number,
    noise_scale_w: number,
    length_scale: number,
    symbol_input: boolean
  ]
  interface preTextList {
    title: string,
    chatList: Partial<chatCompletion>[],
    dele: boolean
  }
  interface DiskInfo {
    使用率: string;
    可用容量: string;
    已使用容量: string;
    总容量: string;
    挂载点: string;
    文件系统类型: string;
    磁盘设备: string;
    选项: string;
    类型: '磁盘'
  }
  interface FileInfo {
    名称: string
    路径: string
    大小: number
    创建时间: number
    修改时间: number
    类型: '文件' | '文件夹' | '磁盘'
  }
  interface filesDiskInfo extends FileInfo, DiskInfo {
    select: Boolean
  }
  interface TermWsMap {
    python: WebSocket
    command: WebSocket
  }
  type TermWsMapKey = keyof TermWsMap
}