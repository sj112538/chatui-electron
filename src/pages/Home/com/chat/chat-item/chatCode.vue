<template>
  <div @mouseenter="isHover = true" @mouseleave="isHover = false" id="chatCode" ref="chatCode">
    <div v-if="isHover" class="playBtn" @mouseenter="isHoverCmd = true" @mouseleave="isHoverCmd = false">
      <div v-if="!isHoverCmd" class="commandBtn">[]</div>
      <div @click="excute" v-else class="commandPlay">
        <svg style="position: relative;left: 4px;" t="1682422527659" class="icon" viewBox="0 0 1024 1024" version="1.1"
          xmlns="http://www.w3.org/2000/svg" p-id="30693" width="20" height="20">
          <path
            d="M769.376 547.424l-445.28 272.128a44.8 44.8 0 0 1-68.16-38.24V237.12a44.8 44.8 0 0 1 68.16-38.24l445.28 272.128a44.8 44.8 0 0 1 0 76.48z"
            fill="#026BFF" p-id="30694"></path>
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  node: {
    type: HTMLElement,
    required: true
  }
})
const chatCode = ref<HTMLElement>()
const isHover = ref<boolean>(false)
const isHoverCmd = ref<boolean>(false)
onMounted(() => {
  chatCode.value!.append(props.node as HTMLElement)
})
const emit = defineEmits(['excute'])
const excute = () => {
  emit('excute')
}
</script>

<style lang="scss">
.playBtn {
  position: absolute;
  top: 10px;
  right: 12px;
  cursor: pointer;
}

.github-markdown-body code {
  font-size: 100% !important;
}
</style>