<template>
  <div v-if="visible" class="chatForm">
    <el-dialog :modal-append-to-body="true" title="chatCompletion" v-model="logVisible" width="50%" center>
      <simple-form v-model:formData="form.FormData.chatCompletion" :options="form.FormInfo!.chatCompletion.formOptions"
        :label-position="'left'" :inline="false">
        <template #max_tokensTit="{ option }">
          <template v-if="option.key === 'max_tokens'">
            <el-popover :show-after="300" placement="top-start" :title="option.key" :width="600" trigger="hover"
              content="限制输入文本的长度，从而控制模型的计算复杂度和输出结果的质量。一般来说，较长的文本输入可能会影响模型的性能和响应速度。因此，通过限制输入的最大长度，可以在一定程度上优化模型的性能和输出结果的质量。">
              <template #reference>
                <div class="label">{{ option.key }}</div>
              </template>
            </el-popover>
          </template>
        </template>
      </simple-form>
    </el-dialog>
    <el-button  class="btn" type="primary" @click="logVisible = true">配置chatCompletion</el-button>
  </div>
</template>

<script setup lang='ts'>
import { FormStore } from '@/store/Form/FormStore';
const name = ref('chatCompletion')
const logVisible = ref<boolean>(false)
const visible = ref<boolean>()
const show = () => {
  visible.value = true
}
const hidden = () => {
  visible.value = false
}
const form = FormStore()
FormStore().setFormItem('chatCompletion')

defineExpose({
  show,
  hidden,
  name
})
</script>
