<template>
  <Home />
  <test v-if="isShow" />
</template>
<script setup lang="ts">
const { isShow } = useTest()

</script>
<style>
.app {
  width: 100%;
  height: 100%;
}
</style>