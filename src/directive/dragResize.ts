import { App, DirectiveBinding } from 'vue'

type Dragable = {
  [key in dragStr]: boolean
}
type dragStr = 'right' | 'left' | 'top' | 'bottom'
export default {
  install: (app: App) => {
    const sideArr = ['right', 'left', 'top', 'bottom']
    const errmsg = 'resizable needs string value of: ' + sideArr
    const minSize = 40
    const dragSize = 5
    app.directive('dragResize', {
      mounted(el: HTMLElement, binding: DirectiveBinding) {
        const dragable: Dragable = {} as any
        const oriCur = el.style.cursor
        const sides = binding.value as dragStr[]
        let dragSide = ''
        let dragging = false
        if (sides.length === 0) {
          throw errmsg
        }
        for (let i = 0; i < sides.length; i++) {
          if (sideArr.indexOf(sides[i]) < 0) {
            throw errmsg
          }
          dragable[sides[i]] = true
        }

        el.addEventListener('mousemove', (e) => {
          if (dragging) return
          if (dragable['right'] && el.offsetWidth - e.offsetX < dragSize) {
            el.style.cursor = 'ew-resize'
            dragSide = 'right'
          }
          else if (dragable['left'] && e.offsetX < dragSize) {
            el.style.cursor = 'ew-resize'
            dragSide = 'left'
          }
          else if (dragable['top'] && e.offsetY < dragSize) {
            el.style.cursor = 'ns-resize'
            dragSide = 'top'
          }
          else if (dragable['bottom'] && el.offsetHeight - e.offsetY < dragSize) {
            el.style.cursor = 'ns-resize'
            dragSide = 'bottom'
          }
          else {
            el.style.cursor = oriCur
            dragSide = ''
          }
        })

        el.addEventListener('mousedown', (e) => {
          if (!dragSide) return

          dragging = true
          const cstyle = window.getComputedStyle(el)

             const width = Number.parseInt(cstyle.width)
          const height = Number.parseInt(cstyle.height)
          const elW = width > 0 ? width : el.offsetWidth
          const elH = height > 0 ? height : el.offsetHeight
          const clientX = e.clientX
          const clientY = e.clientY

          const movefun = (emit: Event) => {
            const e = emit as MouseEvent
            e.preventDefault()
            if (dragSide === 'right' && (e.clientX > clientX || el.offsetWidth >= minSize)) {
              el.style.width = elW + (e.clientX - clientX) + 'px'
            }
            else if (dragSide === 'left' && (e.clientX < clientX || el.offsetWidth >= minSize)) {
              el.style.width = elW + (clientX - e.clientX) + 'px'
            }
            else if (dragSide === 'top' && (e.clientY < clientY || el.offsetHeight >= minSize)) {
              el.style.height = elH + (clientY - e.clientY) + 'px'
            }
            else if (dragSide === 'bottom' && (e.clientY > clientY || el.offsetHeight >= minSize)) {
              el.style.height = elH + (e.clientY - clientY) + 'px'
            }
          }
          const removefun = () => {
            dragging = false
            document.removeEventListener('mousemove', movefun)
            document.removeEventListener('mouseup', removefun)
          }
          document.addEventListener('mousemove', movefun)
          document.addEventListener('mouseup', removefun)
        })
      }
    })
  }
}