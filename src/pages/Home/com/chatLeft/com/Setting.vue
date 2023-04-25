<template>
  <div class="siderList">
    <div class="settingCollapse">
      <el-collapse v-model="activeNames">
        <el-collapse-item title="本地模型设置" name="1">
          <el-button style="margin-bottom: 10px;margin-left: 0;margin-left: 10px;" @click="openDialog(button.text)"
            v-for="button in buttons" text bg :key="button.text" :type="(button.type as any)">{{
              button.text
            }}</el-button>
        </el-collapse-item>
      </el-collapse>
      <Suspense>
        <component :is="component" v-for="component, index in components" ref="componentRefs"></component>
      </Suspense>
    </div>
  </div>
</template>
<script setup lang='ts'>
const activeNames = ref()
const buttons = [{
  text: 'stableDiffusion',
  type: 'primary'
}, {
  text: 'openAi',
  type: 'primary'
},
{
  text: 'vits3',
  type: 'primary'
},
{
  text: 'vits4',
  type: 'primary'
}]
const componentRefs: Ref<settingLogRef[]> = ref([])
const components: any[] = shallowReactive([])
const modules = import.meta.glob('../../setting/**/*.vue')
Object.keys(modules).forEach(async (e) => {
  const com = defineAsyncComponent(modules[e] as any)
  components.push(com)
})
const openDialog = (name: string) => {
  componentRefs.value.forEach((e) => {
    if (e.name === name) {
      e.open()
    }
  })
}
</script>
<style lang="scss" scoped>
@import './index.scss';
</style>
