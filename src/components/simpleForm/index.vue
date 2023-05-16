<template>
  <el-form :model="formDataVar" v-bind="$attrs">
    <el-button class="reset" :icon="Refresh" @click="reset" type="primary">重置</el-button>
    <template v-for="(value, key) in options">
      <div :class="'form-item ' + props.labelPosition">
        <template v-if="true">
          <slot v-if="$slots[key + 'Tit']" :option="{ value, key }" :name="key + 'Tit'" />
          <el-popover v-else :show-after="500" placement="top-start" :title="key.toString()" :width="600" trigger="hover"
            :content="value.info">
            <template #reference>
              <div class="label">{{ key }}</div>
            </template>
          </el-popover>
        </template>
        <el-form-item v-if="value.type === 'custom'" :rules="value.rules">
          <slot v-if="$slots[key + 'Body']" :option="{ value, key, formDataVar }" :name="key + 'Body'" />
        </el-form-item>
        <template v-else>
          <el-form-item v-if="value.type === 'input-number'" :rules="value.rules">
            <el-input-number :min="+value.rules?.min!" :max="+value.rules?.max!"
              v-model="formDataVar[key]"></el-input-number>
          </el-form-item>
          <el-form-item v-if="value.type === 'input-text'" :rules="value.rules">
            <el-input v-model="formDataVar[key]"></el-input>
          </el-form-item>
          <el-form-item v-if="value.type === 'input-text-file-select'" :rules="value.rules">
            <el-input v-model="formDataVar[key]"></el-input>
            <file-manager :multiple="Boolean(value.multiple)" :seleType="value.seleType" v-model:路径="formDataVar[key]" />
          </el-form-item>
          <el-form-item v-if="value.type === 'checkbox'" :rules="value.rules">
            <el-switch v-model="formDataVar[key]" :active-value="true" :inactive-value="false">
            </el-switch>
          </el-form-item>
          <el-form-item v-if="value.type === 'select'" :rules="value.rules">
            <el-select clearable v-model="formDataVar[key]" :placeholder="'请选择' + key">
              <el-option v-for="item in value.select" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </template>
      </div>
    </template>
  </el-form>
</template>
<script setup lang='ts'>
import { Refresh } from '@element-plus/icons-vue'
const emit = defineEmits(["update:formData"])
const props = defineProps({
  options: {
    type: Object as PropType<formInfo['chatCompletion']['formOptions']>,
    required: true,
  },
  formData: {
    type: Object,
    required: true
  },
  labelPosition: {
    type: String as PropType<'top' | 'left' | 'right'>,
  }
})
const formDataVar = ref()
formDataVar.value = props.formData
watch(() => formDataVar.value, () => {
  emit('update:formData', formDataVar.value)
}, {
  deep: true
})
const reset = () => {
  Object.keys(props.options).forEach((key) => {
    Reflect.set(formDataVar.value,key,props.options[key].default)
  })
  emit('update:formData', {})
  FormStore().resetForm(FormStore().FormName!)
} 
</script>
<style lang="scss">
.label {
  font-size: 14px;
  color: #545050;
  padding-bottom: 10px;
}

.el-input {
  width: 200px;
}

.el-input-number {
  width: 200px;
}

.reset {
  margin-bottom: 20px;
  width: 200px !important;
}

.left {
  display: flex;
}
</style>