export const formData: Ref<FormData & {}> = ref({} as any)
formData.value = JSON.parse(localStorage.getItem('setting')!) || {}
class Form {
  dialogVisible = ref<boolean>()
  keep = () => {
    localStorage.setItem('setting', JSON.stringify(formData.value))
  }
  open = () => {
    this.dialogVisible.value = true
  }
  rules = {}
}
const useForm = () => {
  return new Form()
}
export default useForm