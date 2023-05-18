<template>
  <div v-if="visible" class="chatForm">
    <el-drawer title="VITS" v-model="logVisible" width="50%" center>
      <simple-form v-model:formData="form.FormData.vits4" :options="form.FormInfo!['vits4'].formOptions"
        :label-position="'top'" :inline="false">
        <template #speakerIdTit="{ option }">
          <template v-if="option.key === 'speakerId'">
            <el-popover :show-after="300" placement="top-start" :title="option.key" :width="600" trigger="hover"
              content="模型的音色">
              <template #reference>
                <div class="label">{{ option.key }}</div>
              </template>
            </el-popover>
          </template>
        </template>
        <template #speakerIdBody="{ option }">
          <template v-if="option.key === 'speakerId'">
            <el-select clearable v-model="option.formDataVar[option.key]" :placeholder="'请选择' + option.key">
              <el-option v-for="item in FormStore().FormData.vits4.spks" :key="item" :label="item" :value="item">
              </el-option>
            </el-select>
          </template>
        </template>
      </simple-form>
    </el-drawer>
    <el-button type="primary" class="btn" @click="logVisible = true">配置VITS</el-button>
    <el-button type="primary" v-if="vits4_is_open" class="btn" @click="vits4Run"
      :loading="vits4Loading">结束VITS4</el-button>
    <el-button type="primary" v-else class="btn" @click="vits4Run" :loading="vits4Loading">启动VITS4</el-button>
  </div>
</template>
<script setup lang='ts'>
import { FormStore } from '@/store/Form/FormStore';
import { useTools } from '../../chat/chat-tool-bar';
import { vits4_is_open } from '@/composables/useVits';
const name = ref('vits4')
const visible = ref<boolean>()
const logVisible = ref<boolean>(false)
const show = () => {
  visible.value = true
}
const hidden = () => {
  visible.value = false
}
const form = FormStore()
FormStore().setFormItem('vits4')
const vits4Loading = ref<boolean>(false)
const vits4Run = async () => {
  vits4Loading.value = true
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
            vits4Loading.value = false
            vits4_is_open.value = true
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