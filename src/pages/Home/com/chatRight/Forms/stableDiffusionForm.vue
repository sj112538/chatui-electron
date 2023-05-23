<template>
  <div v-if="visible" class="chatForm">
    <el-drawer title="stableDiffusion" v-model="logVisible" center>
      <simple-form v-model:formData="form.FormData.stableDiffusion"
        :options="form.FormInfo!['stableDiffusion'].formOptions" :label-position="'top'" :inline="false">
      </simple-form>
    </el-drawer>
    <el-button type="primary" class="btn" @click="logVisible = true">配置stableDiffusion</el-button>
    <el-button type="primary" v-if="SD_open" class="btn" @click="usestableDiffusion.exit()"
      :loading="stableDiffusionLoading">结束stableDiffusion</el-button>

    <el-button type="primary" class="btn" @click="stableDiffusionRun" :loading="stableDiffusionLoading"
      v-else>启动stableDiffusion</el-button>
  </div>
</template>
<script setup lang='ts'>
import { FormStore } from '@/store/Form/FormStore';
import { SD_open } from '@/composables/usestableDiffusion';
import usestableDiffusion from '@/composables/usestableDiffusion'
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
const stableDiffusionLoading = ref<boolean>(false)
const stableDiffusionRun = async () => {
  stableDiffusionLoading.value = true
  try {
    await usestableDiffusion.open()
    const SDIsRun = setInterval(async () => {
      if (form.FormData.vits4.location) {
        await usestableDiffusion.confirm()
        stableDiffusionLoading.value = false
        clearInterval(SDIsRun)
      }
    }, 1000)
  } catch (err: any) {
    console.log(err);
  } finally {
    loading.value = false
  }
}
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