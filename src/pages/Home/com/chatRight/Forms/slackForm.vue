<template>
  <div v-if="visible" class="chatForm">
    <el-dialog title="slack" v-model="logVisible" width="50%" center>
      <simple-form v-model:formData="form.FormData.slack" :options="form.FormInfo!.slack.formOptions"
        :label-position="'left'" :inline="false">
        <template #channelTit="{ option }">
          <template v-if="option.key === 'channel'">
            <el-popover :show-after="300" placement="top-start" :title="option.key" :width="600" trigger="hover"
              content="频道">
              <template #reference>
                <div class="label">{{ option.key }}</div>
              </template>
            </el-popover>
          </template>
        </template>
        <template #channelBody="{ option }">
          <template v-if="option.key === 'channel'">
            <el-select clearable v-model="option.formDataVar[option.key]" :placeholder="'请选择' + option.key">
              <el-option v-for="item in channels" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </template>
        </template>
        <template #membersTit="{ option }">
          <template v-if="option.key === 'members'">
            <el-popover :show-after="300" placement="top-start" :title="option.key" :width="600" trigger="hover"
              content="频道">
              <template #reference>
                <div class="label">{{ option.key }}</div>
              </template>
            </el-popover>
          </template>
        </template>
        <template #membersBody="{ option }">
          <template v-if="option.key === 'members'">
            <el-select clearable v-model="option.formDataVar[option.key]" :placeholder="'请选择' + option.key">
              <el-option v-for="item in members" :key="item" :label="item" :value="item">
              </el-option>
            </el-select>
          </template>
        </template>
      </simple-form>
    </el-dialog>
    <el-button  class="btn" type="primary" @click="logVisible = true">配置slack</el-button>
  </div>
</template>
<script setup lang='ts'>
import { FormStore } from '@/store/Form/FormStore';
import { channels, members } from '@/composables/useSlack'
const name = ref('slack')
const visible = ref<boolean>()
const logVisible = ref<boolean>()
const show = () => {
  visible.value = true
}
const hidden = () => {
  visible.value = false
}
const form = FormStore()
FormStore().setFormItem('slack')

defineExpose({
  show,
  hidden,
  name
})
</script>
