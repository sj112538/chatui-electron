class Form<T> {
  visible = ref<boolean>(false)
  FormData = ref<T>()
  initData = ref<T>()
  submitEvent = ref<(data: T) => boolean>()
  constructor(data: T) {
    this.FormData.value = data
    this.initData.value = data
  }
  open() {
    this.visible.value = true
  }
  close() {
    this.visible.value = false
  }
  clear() {
    this.FormData = _.cloneDeep(this.initData)
  }
  edit(data: T) {
    this.FormData.value = data
    this.initData.value = data
  }
  submit() {
    this.submitEvent.value && this.submitEvent.value!(this.FormData.value!)
    this.visible.value = false
  }
  onSubmit = (callBack: (data: T) => boolean) => {
    this.submitEvent.value = callBack
  }
}

const useForm = <T>(data: T) => {
  const form = new Form<T>(data)
  return form
}