
const nowActive = ref<string>('')
export const useTools = () => {
  const active = (name: string) => {
    if (nowActive.value !== name) {
      nowActive.value = name
    } else {
      nowActive.value = ''
    }
  }
  return { active, nowActive }
}
