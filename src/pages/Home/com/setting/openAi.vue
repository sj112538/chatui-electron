<template>
  <div :class="name">
    <el-dialog v-model="dialogVisible" :title="name + '设置'" width="80%" align-center>
      <div class="form">
        <el-form :modelItem="form" ref="openaiForm" :rules="rules">
          <el-form-item :label="'开启' + name">
            <el-switch v-model="form.isOpen" :active-value="true" :inactive-value="false">
            </el-switch>
          </el-form-item>
          <el-form-item label="apiKey">
            <el-input :disabled="form.isOpen" v-model="form!.apiKey" placeholder="请输入apikey" clearable>
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
const form = ref<OpenaiSetting>({
  isOpen: false,
  apiKey: ''
})
const name = 'openAi'
try {
  if (formData.value.openAi) {
    form.value = formData.value.openAi
  }
} catch {

}
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