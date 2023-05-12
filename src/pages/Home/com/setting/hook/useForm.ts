export const formData: Ref<FormData & {}> = ref({} as any)
formData.value = JSON.parse(await Localforage.getItem('setting') as string) || {}
class Form {
  dialogVisible = ref<boolean>()
  keep = async () => {
    await Localforage.setItem('setting', JSON.stringify(formData.value))
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