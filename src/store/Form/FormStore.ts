import { defineStore } from "pinia";

export const FormStore = defineStore('FormStore',
  () => {
    const FormName = ref<keyof chatRightFormData>()
    const FormData = ref<chatRightFormData>({} as any)
    const setFormName = (name?: string) => {
      FormName.value = name
    }
    const setFormItem = (name: keyof chatRightFormData) => {
      if (!FormData.value[name]) {
        Reflect.set(FormData.value, name, {})
      }
    }
    const FormInfo = ref<formInfo>()
    const FormInfoInit = async () => {
      const json = await (await fetch('Form.json')).json()
      FormInfo.value = json
    }
    const resetForm = (name: keyof chatRightFormData) => {
      FormData.value[name] = {}
    }
    return { FormName, setFormName, FormData, setFormItem, resetForm, FormInfo, FormInfoInit }
  },
  {
    persist: true
  }
)
