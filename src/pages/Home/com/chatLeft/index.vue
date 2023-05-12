<template>
  <Suspense>
    <model-list v-show="select === 'Model'" />
  </Suspense>
  <Setting v-if="select === 'setting'" />
  <session-list v-if="select === 'session'" />
  <keep-alive>
    <file-list v-if="select === 'file'" />
  </keep-alive>
  <fine-tune-list v-if="select === 'fine-tuning'"></fine-tune-list>
</template>
<script setup lang='ts'>
import { select } from '../Model/operate/index'

// 获取模型
</script>