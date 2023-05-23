import * as D from 'three'
export const useThree = (canvas: HTMLElement, command: string) => {
  if (!canvas) {
    throw new Error("画布不存在。");
  }
  const THREE = D
  eval(command)
  return canvas
}
