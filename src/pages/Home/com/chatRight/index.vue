<template>
  <div :class="paramActive ? 'function' : 'none function'">
    <el-radio-group v-model="tabPosition" style="margin-bottom: 30px;">
      <el-radio-button label="text">文本</el-radio-button>
      <el-radio-button label="vits3">vits3</el-radio-button>
      <el-radio-button label="vits4">vits4</el-radio-button>
      <el-radio-button label="slack">slack</el-radio-button>
      <el-radio-button label="openAi微调">openAi微调</el-radio-button>
    </el-radio-group>
    <MoneyInfo />
    <forms />
  </div>
</template>

<script setup lang='ts'>
import { useCmd } from '../chat/chat-tool-bar/tools/cmd';
import forms from './Forms/index.vue'
const { paramActive } = useCmd()
const tabPosition = ref<tebKey>('text')
type tebKey = keyof typeof tabCheckMap
watch(() => tabPosition.value, (e: tebKey) => {
  tabCheckMap[e]()
})
const tabCheckMap = {
  'text': () => {
    useOpenAi.setModel(nowModel.value!)
  },
  'vits3': () => {
    FormStore().setFormName("vits3")
  },
  'vits4': () => {
    FormStore().setFormName("vits4")
  },
  'slack': () => {
    FormStore().setFormName("slack")
  },
  'video': () => {

  },
  'openAi微调': () => {
    FormStore().setFormName("openAi微调")
  }
}
</script>

<style lang="scss">
.function {
  width: 250px;
  padding: 20px;
  overflow: auto !important;
  box-sizing: border-box;
  background: #FFF;
  overflow: hidden;
}

.none {
  width: 0px !important;
  padding: 0;
}

.el-radio-group {
  flex-wrap: nowrap;
  width: 100%;
  overflow-x: auto;
}
</style> 