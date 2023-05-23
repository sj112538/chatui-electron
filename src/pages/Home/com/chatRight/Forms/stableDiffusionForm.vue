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
import { useTools } from '../../chat/chat-tool-bar';
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
    useTools().nowActive.value = 'cmdActive'
    const { init, excute } = useCommand()
    const isWsOpen = init()
    const inter = setInterval(async () => {
      if (isWsOpen('python')) {
        const command = `
import socket
import subprocess
import os
s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.bind(('localhost', 0))
port = s.getsockname()[1]
s.close()
print(port)
      `.trim()
        const data = await excute(command, 'python', true)
        form.FormData.vits4.location = data.result.trim()
        excute(['cls', 'cd ..', 'cd server/stableDiffiusion', 'A启动脚本.bat'], 'command')
        clearInterval(inter)
      }
    }, 500)
    const SDIsRun = setInterval(async () => {
      if (isWsOpen('command')) {
        if (form.FormData.vits4.location) {
          await usestableDiffusion.confirm()
          stableDiffusionLoading.value = false
        }
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