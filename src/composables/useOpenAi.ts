import {
  Configuration,
  CreateCompletionRequest,
  FineTune,
  OpenAIApi,
  OpenAIFile,
} from "openai";
import useAiBase, { modelsInfo } from "./useAiBase";
import { ChatCompletionRequestMessage } from "openai";
import { formData } from "@/pages/Home/com/setting/hook/useForm";
import { ElMessage } from "element-plus";
import { FormStore } from "@/store/Form/FormStore";
export const nowModel = ref<Model>();
export const nowFile = ref();
export const nowfineTune = ref();
export const FilesList = ref<OpenAIFile[]>([]);
export const fineTuneList = ref<FineTune[]>([]);
class useOpenAi extends useAiBase {
  getOpenapi() {
    const configuration = new Configuration({
      apiKey: formData.value.openAi.apiKey,
    });
    const openapi = new OpenAIApi(configuration);
    return openapi;
  }
  listfineTunes = async () => {
    const { data } = await chatgptApi.listfineTunes();
    fineTuneList.value = data;
  };
  listModels = async (setData: any) => {
    if (!JSON.parse((await Localforage.getItem("openaiModels")) as string)) {
      const {
        data: { data },
      } = await this.getOpenapi().listModels();
      const json: GPT3Models = modelsInfo.value!;
      const model = data.map((e: any) => {
        return {
          ...e,
          source: "online",
          ...json[(e.root ? e.root : e.id) as GPT3ModelsKeys],
        };
      });
      setData(model, "model");
      await Localforage.setItem("openaiModels", JSON.stringify(model));
      return;
    }
    setData(
      JSON.parse((await Localforage.getItem("openaiModels")) as string),
      "model"
    );
  };
  getModel = async () => {
    nowModel.value = JSON.parse((await Localforage.getItem("Model")) as string);
    return nowModel;
  };
  async setModel(Model: Model) {
    await Localforage.setItem("Model", JSON.stringify(Model));
    FormStore().setFormName(Model.type);
    (await this.getModel()).value = Model;
  }
  getFile = async () => {
    const { data } = await chatgptApi.getFile();
    const fileList = data.map((e) => {
      return {
        ...e,
        loading: false,
      };
    });
    FilesList.value = fileList;
  };
  setFile = (id: string) => {
    nowFile.value = id;
  };
  deleteFile = async (file: OpenAIFile) => {
    const result = await this.getOpenapi().deleteFile((file as any).key);
    if (result.data.deleted) {
      ElMessage({
        type: "success",
        message: "删除成功！",
      });
    } else {
      ElMessage({
        type: "error",
        message: "删除失败！",
      });
    }
    return result;
  };
  editFile = async (id: string) => {
    const result = await chatgptApi.retrieveContent(id);
    return result;
  };
  getNowFile = () => {
    return nowFile;
  };
  upload = async (e: Event) => {
    const file = (e.target! as any).files[0] as File;
    if (file.name.substring(file.name.lastIndexOf(".")) !== ".jsonl") {
      ElMessage({
        message: "请上传jsonl格式的文件",
        type: "error",
      });
      throw new Error("请上传jsonl格式的文件");
    }
    if (Math.ceil(file.size / 1024 / 1024) > 1024) {
      ElMessage({
        message: "文件大小不能超过1GB",
        type: "error",
      });
      throw new Error("文件大小不能超过1GB");
    }
    const formData = new FormData();
    formData.append("file", file);
    formData.append("purpose", "fine-tune");
    const result = await chatgptApi.uploadFile(formData);
    return result;
  };
  sendChatCompletion = async (options?: resetSessionOptions) => {
    if (!Array.isArray(this.textList.value)) {
      return;
    }
    const messages: ChatCompletionRequestMessage[] = this.textList.value.map(
      (e) => {
        if (e.isSkip) {
          return {} as any;
        }
        return {
          role: e.role,
          content: e.message,
          name: e.owned_by,
        } as ChatCompletionRequestMessage;
      }
    );
    await chatgptApi.chatStream(
      {
        model: (await this.getModel()).value!.id,
        messages: messages,
        ...FormStore().FormData.chatCompletion,
      },
      this.textList,
      "/v1/chat/completions",
      options
    );
  };
  sendCompletion = async (options?: resetSessionOptions) => {
    const messages: Array<string> = this.textList.value.map((e) => e.message!);
    const params: CreateCompletionRequest = {
      model: (await this.getModel()).value!.id,
      prompt: messages,
      ...FormStore().FormData.completion,
    };
    await chatgptApi.chatStream(
      params as any,
      this.textList,
      "/v1/completions"
    );
  };
  sendMap = {
    chatCompletion: this.sendChatCompletion,
    completion: this.sendCompletion,
    image: (options?: resetSessionOptions) => {},
    voice: () => {},
  };

  send = async () => {
    if (nowModel.value) {
      if (this.sendMap[nowModel.value?.type]) {
        await this.sendMap[nowModel.value!.type]();
        return;
      }
    }
    await this.sendCompletion();
  };
  reSend = (options?: resetSessionOptions) => {
    if (nowModel.value) {
      if (this.sendMap[nowModel.value?.type]) {
        this.sendMap[nowModel.value!.type](options);
        return;
      }
    }
    this.sendCompletion();
  };
}
export default new useOpenAi();
