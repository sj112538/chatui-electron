<template>
  <Suspense>
    <div class="chatFormBox">
      <component :is="component" v-for="component, index in components" ref="componentRefs"></component>
    </div>
  </Suspense>
</template>
<script setup lang='ts'>
const components: any[] = shallowReactive([])
const modules = import.meta.glob('./**/*Form.vue')

Object.keys(modules).forEach(e => {
  const com = defineAsyncComponent(modules[e] as any)
  components.push(com)
})
const componentRefs: Ref<chatRightItemRef[]> = ref([])
const formComHandler = (name: string[]) => {
  componentRefs.value.forEach((e1) => {
    let comName = e1.name as unknown as Array<string>
    if (!Array.isArray(e1.name)) {
      comName = [e1.name]
    }
    if (name.some(e2 => comName.includes(e2))) {
      e1.show()
    } else {
      e1.hidden()
    }
  })
}
//切换Model
watch(() => FormStore().FormName, (e) => {
  formComHandler([e] as any)
})

// 初始化Form
watch(() => componentRefs.value, async () => {
  if (nowModel.value?.type) {
    formComHandler([nowModel.value?.type])
  }
}, {
  deep: true
}) 
</script>
<style scoped>
.chatFormBox {
  overflow: auto;
  padding-top: 10px;
}
</style>