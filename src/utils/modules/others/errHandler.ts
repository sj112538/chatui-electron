import { ElNotification } from "element-plus"

export const errHandler = (status: number, msg: any) => {
  if (status !== 200) {
    ElNotification({
      title: 'Error',
      message: msg,
      type: 'error'
    })
    return false
  }
  return true
}