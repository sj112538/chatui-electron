<template>
  <div class="test">
    <Xterm/>
  </div>
</template>

<script setup lang='ts'>
const KeyDown = () => {
  document.addEventListener('keydown', (event) => {
    const e = event as KeyboardEvent
    if (e.key === 'Escape') {
      useTest().isShow.value = false
    }
  })
}
onMounted(() => {
  KeyDown()
})
</script>

<style lang="scss" scoped>
.test {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #FFF;
  z-index: 999999;
}
</style>