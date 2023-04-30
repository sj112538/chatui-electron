import { defineStore } from "pinia";

export const settingStore = defineStore('settingStore',
  () => {
    const FormData = ref<settingFormData>({} as any)
    return { FormData }
  },
  {
    persist: true
  }
)
