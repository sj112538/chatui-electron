<template>
  <!-- <template v-for="item in getCmdList().value">
    <div :class="'cmdItem ' + item.type">
      {{ item.message }}
    </div>
  </template>
  <div class="cmdInput">
    <el-input @input="cmdInputEvent" @keyup.enter.native="execute(cmdInputValue)" autosize :rows="8" type="textarea"
      ref="cmdInputRef" v-model="cmdInputValue"></el-input>
  </div> -->
  <div ref="termRef"></div>
  <div class="focusBlock" @click="cmdFocus"></div>
</template>

<script setup lang='ts'>
// import { useCmd } from '.';
// const { getCmdList, execute, cmdInputEvent, cmdInputValue } = useCmd()
const cmdInputRef = ref<HTMLElement>()
watchEffect(() => {
  cmdInputRef.value?.focus()
})
const cmdFocus = (e: Event) => {
  e.stopPropagation()
  cmdInputRef.value?.focus()
}
//
const termRef = ref()
onMounted(async () => {
  await nextTick()
  const term = useCommand(termRef)
  term.init()
})
</script>

<style lang="scss" scoped>
.error {
  color: rgb(237, 68, 68);
}


.focusBlock {
  width: 100%;
  flex: 1;
}

.cmdItem {
  z-index: 2;
  position: relative;
  font-size: 16px;
  word-break: break-all;
  white-space: pre-wrap;
}

:deep(.el-textarea__inner) {
  box-shadow: none !important;
  padding: 0px;
  font-size: 16px;
  color: black;
  line-height: normal;
}
</style>