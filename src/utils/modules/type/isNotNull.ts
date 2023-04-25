export const isNotNull = (data: any) => {
  return JSON.stringify(data) === '{}' || Object.prototype.toString.call(data) === '[object Undefined]'
}