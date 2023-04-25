<template>
  <el-tooltip effect="dark" :show-after="700" placement="top" v-if="isShowTip" :content="text">
    <div v-bind="$attrs" class="overflow-tooltip-text" :style="{ width: width, display: display }">{{ text }}</div>
  </el-tooltip>
  <div v-else :id="id" class="overflow-tooltip-text" :style="{ width: width, display: display }">{{ text }}</div>
</template>
<script setup lang="ts">
const props = defineProps({
  text: {
    type: String,
    required: true
  },
  width: {
    type: String,
    required: true
  },
  id: {
    type: String,
    required: false,
    default: () => 'ot' + Math.random().toString().replace('.', '')
  },
  display: {
    type: String,
    required: false,
    default: 'inline-block'
  }
})

const isShowTip = ref(false)

watch(
  () => props.text,
  async function () {
    await nextTick()
    const idEle = document.getElementById(props.id)
    if (!idEle) return
    const style = window.getComputedStyle(idEle, null)
    const paddingL = parseFloat(style.getPropertyValue('padding-left')) //获取左侧内边距
    const paddingR = parseFloat(style.getPropertyValue('padding-right')) //获取右侧内边距
    isShowTip.value = idEle.scrollWidth > idEle.clientWidth - paddingL - paddingR
  },
  { immediate: true }
)
</script>
<style scoped>
.overflow-tooltip-text {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
</style>