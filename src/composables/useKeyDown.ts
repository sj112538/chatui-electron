export const useKeyDown = () => {
  const keyMap = ref<Map<string, boolean>>(new Map())
  let onkeydownedFunc: (map: Map<string, boolean>) => void
  const KeyDown = (e: KeyboardEvent | Event) => {
    const event = e as KeyboardEvent
    keyMap.value.set(event.code, true)
    onkeydownedFunc(keyMap.value)
  }
  const KeyUp = (e: KeyboardEvent | Event) => {
    const event = e as KeyboardEvent
    keyMap.value.delete(event.code)
  }
  const getNowKey = () => {
    return keyMap
  }
  const onkeydowned = (func: (map: Map<string, boolean>) => void) => {
    onkeydownedFunc = func
  }
  return {
    KeyUp,
    KeyDown,
    keyMap,
    getNowKey,
    onkeydowned
  }
}