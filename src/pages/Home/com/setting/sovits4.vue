<template>
  <div :class="name">
    <el-dialog v-model="dialogVisible" :title="name + '设置'" width="80%" align-center>
      <div class="form">
        <el-form :modelItem="form" ref="vitsForm" :rules="rules">
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang='ts'>
import useForm from './hook/useForm';
import { formData } from './hook/useForm'
const form = ref<vits4>({
  location: '',
  isOpen: false,
  regex: '',
  modelPos: ''
})
const name = 'vits4'
try {
  if (formData.value['vits4']) {
    form.value = formData.value['vits4']
  }
} catch { }
Reflect.set(formData.value, name, form)
watch(() => form.value, () => {
  keep()
}, {
  deep: true
})
const { dialogVisible, open, rules, keep } = useForm()
defineExpose({
  open,
  name
})
</script>
<style lang="scss">
.el-upload-list {
  display: none;
}
</style>