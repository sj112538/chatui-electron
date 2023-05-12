<template>
  <div class="home" v-loadings="loading">
    <div class="content">
      <operate />
      <chat-left />
      <template v-for="( value, key )  in sessionMap">
        <template v-if="key === nowSessionName">
            <chat :textList="value" />
        </template>
      </template>
      <chat-right />
    </div>
  </div>
</template>
<script setup lang='ts'>
import { sessionMap, nowSessionName, useSession } from './com/chatLeft';
import { loading } from '@/composables/useLoading'
const { sessionBuilder, getSession } = useSession()
getSession()
sessionBuilder()
const theme = ref<string>("#FFF")
</script>
<style lang="scss">
@import "./index.scss";

.home {
  background: v-bind(theme);
  width: 100%;
  height: 100%;
  position: relative;
}

.content {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  position: relative;
}
</style>
