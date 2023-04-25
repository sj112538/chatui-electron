<template>
  <div :class="name">
    <el-dialog v-model="dialogVisible" :title="name + '设置'" width="80%" align-center>
      <div class="form">
        <el-form :modelItem="form" ref="stableDiffusionForm" :rules="rules">
          <el-form-item :label="'开启' + name">
            <el-switch v-model="form.isOpen" :active-value="true" :inactive-value="false">
            </el-switch>
          </el-form-item>
          <el-form-item label="接口地址">
            <el-input :disabled="form.isOpen" v-model="form!.location" placeholder="请输入接口地址!例：127.0.0.1:6000" clearable>
            </el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang='ts'>
import useForm from './hook/useForm';
import { formData } from './hook/useForm'
const form = ref<StableDiffusion>({
  location: '',
  isOpen: false
})
const name = 'stableDiffusion'
try {
  if (formData.value.stableDiffusion) {
    form.value = formData.value.stableDiffusion
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