<template>
  <div v-if="visible" class="chatForm">
    <el-drawer title="stableDiffusion" v-model="logVisible" center>
      <simple-form v-model:formData="form.FormData.stableDiffusion"
        :options="form.FormInfo!['stableDiffusion'].formOptions" :label-position="'top'" :inline="false">
      </simple-form>
    </el-drawer>
    <el-button type="primary" class="btn" @click="logVisible = true">配置stableDiffusion</el-button>
  </div>
</template>
<script setup lang='ts'>
import { FormStore } from '@/store/Form/FormStore';
const name = ref('stableDiffusion')
const visible = ref<boolean>()
const logVisible = ref<boolean>(false)
const show = () => {
  visible.value = true
}
const hidden = () => {
  visible.value = false
}
const form = FormStore()
FormStore().setFormItem('stableDiffusion')
defineExpose({
  show,
  hidden,
  name
})
</script>
<style lang="scss">
.chatForm {
  .el-button {
    margin-left: 0 !important;
  }

  .btn {
    margin-bottom: 10px;
  }
}
</style>