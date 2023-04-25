const useHover = (ele: HTMLElement) => {
  const isHover = ref<boolean>()
  ele.addEventListener('mouseenter', () => {
    isHover.value = true
  })
  ele.addEventListener('mouseleave', () => {
    isHover.value = false
  })
  return { isHover }
}

export default useHover