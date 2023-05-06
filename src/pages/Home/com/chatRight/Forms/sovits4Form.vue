<template>
  <div v-if="visible" class="chatForm">
    <el-dialog title="VITS" v-model="logVisible" width="50%" center>
      <simple-form v-model:formData="form.FormData.vits3" :options="form.FormInfo!['vits3'].formOptions"
        :label-position="'left'" :inline="false">
      </simple-form>
    </el-dialog>
    <el-button type="primary" class="btn" @click="logVisible = true">配置VITS</el-button>
    <el-button type="primary" v-if="vits3_is_open" class="btn" @click="vits3Run" :loading="vits3Loading">结束VITS4</el-button>
    <el-button type="primary" v-else class="btn" @click="vits3Run" :loading="vits3Loading">启动VITS4</el-button>
  </div>
</template>
<script setup lang='ts'>
import { FormStore } from '@/store/Form/FormStore';
import { useTools } from '../../chat/chat-tool-bar';
import { vits3_is_open } from '@/composables/useVits';
const name = ref('vits3')
const visible = ref<boolean>()
const logVisible = ref<boolean>(false)
const show = () => {
  visible.value = true
}
const hidden = () => {
  visible.value = false
}
const form = FormStore()
FormStore().setFormItem('vits3')
const vits3Loading = ref<boolean>(false)
const vits3Run = async () => {
  vits3Loading.value = true
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
        excute(['cls', 'cd ..', 'cd server/vits4', 'python api.py ' + data.result.trim()], 'command')
        clearInterval(inter)
      }
    }, 500)
    const vits4IsRun = setInterval(async () => {
      if (isWsOpen('command')) {
        if (form.FormData.vits4.location) {
          const data = await vits4Api.confirm()
          if (data) { 
            vits3Loading.value = false
            vits3_is_open.value = true
          }
        }
        clearInterval(vits4IsRun)
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