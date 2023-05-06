<template>
  <div v-if="visible" class="chatForm">
    <el-dialog title="openAi微调" v-model="logVisible" width="50%" center>
      <simple-form label-position="left" v-model:formData="form.FormData.openAi微调" :options="options">
      </simple-form>
      <el-button type="primary" size="default" @click="createFineTune" :loading="createFineTuneLoading">创建微调</el-button>
    </el-dialog>
    <el-button type="primary" @click="logVisible = true">openApi微调</el-button>
  </div>
</template>

<script setup lang='ts'>
import { FilesList } from '@/composables/useOpenAi';
import { FormStore } from '@/store/Form/FormStore';
import { ModelsList } from '../../chatLeft';
const name = ref('openAi微调')
const visible = ref<boolean>()
const show = () => {
  visible.value = true
}
const logVisible = ref<boolean>(false)
const hidden = () => {
  visible.value = false
}
const form = FormStore()
FormStore().setFormItem('openAi微调')
const options = form.FormInfo!.openAi微调.formOptions
watch(() => FilesList.value, () => {
  Reflect.set(options['training_file'], 'select', FilesList.value.map((e) => {
    return {
      label: e.filename,
      value: e.id
    }
  }))
  Reflect.set(options['validation_file'], 'select', FilesList.value.map((e) => {
    return {
      label: e.filename,
      value: e.id
    }
  }))
})
Reflect.set(options['model'], 'select', ModelsList.value.map((e: Model) => {
  return {
    label: e.id,
    value: e.id
  }
}))
const createFineTuneLoading = ref<boolean>(false)
const createFineTune = async () => {
  createFineTuneLoading.value = true
  try {
    const data = await chatgptApi.createFineTunes(form.FormData.openAi微调)
  } finally {
    createFineTuneLoading.value = false
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
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  .label {
    width: 235px;
    line-height: 35px;
  }
}
</style>
