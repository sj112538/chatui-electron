import { App } from 'vue'
import loadings from './loadings'
import dragResize from './dragResize'
export default {
  install: (app: App) => {
    app.use(loadings)
    app.use(dragResize)
  }
}
