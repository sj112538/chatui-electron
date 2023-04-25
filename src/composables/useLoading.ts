export const loading = ref<boolean>(false)
export const getLoading = () => {
  return loading.value
}
export const openLoading = () => {
  loading.value = true
}
export const closeLoading = () => {
  loading.value = false
}