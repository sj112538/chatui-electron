import { App, DirectiveBinding } from "vue"
interface elExtends {
  loading: HTMLElement
}
export default {
  install: (app: App) => {
    app.directive('loadings', {
      mounted(el: HTMLElement & elExtends, binding: DirectiveBinding<boolean>) {
        const loading = document.createElement('div')
        loading.className = 'loading-animation'
        loading.innerHTML = '<div></div><div></div><div></div>'
        el.style.position = 'relative'
        el.loading = loading
      },
      updated(el: HTMLElement & elExtends, binding: DirectiveBinding<boolean>) {
        if (binding.value !== binding.oldValue) {
          if (binding.value) {
            el.append(el.loading)
          } else {
            el.loading.remove()
          }
        }
      }
    })
  }
}
