export { Dayjs } from './modules/time/timeTool'
export { Localforage } from './modules/store/localforage'
export let child_process: any
export let portfinder: any

try {
  child_process = require('child_process')
  portfinder = require('portfinder')
} catch { }