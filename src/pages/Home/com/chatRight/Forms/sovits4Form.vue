<template>
  <div v-if="visible" class="chatForm">
    <el-dialog title="VITS" v-model="logVisible" width="50%" center>
      <simple-form v-model:formData="form.FormData.vits3" :options="form.FormInfo!['vits4'].formOptions" :label-position="'left'"
        :inline="false">
      </simple-form>
    </el-dialog>
    <el-button type="primary" @click="logVisible = true">配置VITS</el-button>
  </div>
</template>
<script setup lang='ts'>
import { FormStore } from '@/store/Form/FormStore';
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
FormStore().setFormItem('vits3')

defineExpose({
  show,
  hidden,
  name
})
</script>
