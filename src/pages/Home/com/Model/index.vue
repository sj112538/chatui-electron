<template>
  <div class="modelItem-item">
    <div v-if="modelItem?.owned_by" class="linkItemAva">
      <el-avatar :src="'data:image/png;base64,' + modelItem?.image" v-if="modelItem?.image"></el-avatar>
      <el-avatar   v-else :src="url + '/' + modelItem?.owned_by + '.png'"></el-avatar>
    </div>
    <div class="info">
      <div v-if="props.modelItem?.id" class="modelName">
        <el-input ref="editRef" v-if="isEdit" v-model="title"></el-input>
        <el-popover v-else-if="popContent" :show-after="300" placement="top-start" :title="props.modelItem?.id!"
          :width="600" trigger="hover" :content="popContent">
          <template #reference>
            <div class="label">{{ props.modelItem?.id! }}</div>
          </template>
        </el-popover>
        <OverflowTooltip v-else width="100%" :text="props.modelItem?.id!" />
      </div>
      <div class="tagInfo">
        <el-tag class="tag" v-if="props.modelItem?.type!" :disable-transitions="true" type="success">{{
          typeMap[(props.modelItem?.type!) as Type] || props.modelItem?.type }}</el-tag>
        <el-tag class="tag" v-if="props.modelItem?.version!" :disable-transitions="true" type="success">{{
          props.modelItem?.version! }}</el-tag>
      </div>
    </div>
    <div v-if="showAction" class="action">
      <div @click="edit" v-if="dele === false" class="edit">
        <svg t="1679974917482" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
          p-id="8860" width="15" height="15">
          <path
            d="M883 928H139a30 30 0 0 1 0-60h744a30 30 0 0 1 0 60zM541.07 207.5L164.79 583.79a30 30 0 0 0-8.78 20.4l-5 185A30 30 0 0 0 181 820h0.81l185-5a30 30 0 0 0 20.4-8.78L763.5 429.93zM862.21 288.79l-180-180a30 30 0 0 0-42.42 0l-56.29 56.28L805.93 387.5l56.28-56.29a30 30 0 0 0 0-42.42z"
            fill="#0368CD" p-id="8861"></path>
        </svg>
      </div>
      <div v-if="dele === false && !props.showDelete" class="delete" @click="dele = true">
        <svg t="1679975018215" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
          p-id="17602" width="15" height="15">
          <path
            d="M615.154032 92.154612V0H408.790712v92.154612H39.384615v92.942259h945.175513V92.154612zM782.135039 890.040275a37.807021 37.807021 0 0 1-35.444082 39.382313H268.589677a38.594667 38.594667 0 0 1-42.532898-32.293497V288.278531h-94.517551v601.761744A132.324572 132.324572 0 0 0 263.8638 1023.940139h472.587756a133.112218 133.112218 0 0 0 137.050449-129.173987v-606.487621H782.135039v601.761744z"
            fill="#3A75FF" p-id="17603"></path>
          <path d="M354.44312 288.278531h78.764626v462.348355H354.44312z m220.540953 0h81.127564v462.348355H572.621134z"
            fill="#3A75FF" p-id="17604"></path>
        </svg>
      </div>
      <div v-if="dele === true" @click="submit" class="submit">
        <svg t="1679980570395" class="icon" viewBox="0 0 1025 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
          p-id="4505" width="15" height="15">
          <path
            d="M960.005813 324.073949l-80.827237-80.822237L418.499226 703.930062l-273.738802-273.740802-80.869237 80.875237 354.539039 354.493039 77.465227-77.517227 0.098 0.098L960.005813 324.073949zM960.005813 324.073949"
            fill="#1296db" p-id="4506"></path>
        </svg>
      </div>
      <div @click="dele = false, isEdit = false" v-if="dele === true" class="close">
        <svg t="1679979815557" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
          p-id="1482" width="15" height="15">
          <path d="M224 846a44 44 0 0 1-31.11-75.11l576-576a44 44 0 0 1 62.22 62.22l-576 576A43.82 43.82 0 0 1 224 846z"
            fill="#0368CD" p-id="1483"></path>
          <path d="M800 846a43.82 43.82 0 0 1-31.11-12.89l-576-576a44 44 0 0 1 62.22-62.22l576 576A44 44 0 0 1 800 846z"
            fill="#0368CD" p-id="1484"></path>
        </svg>
      </div>
    </div>
  </div>
</template>
<script setup lang='ts'>
import { OpenAIFile } from 'openai/dist/api';
const props = defineProps({
  modelItem: Object as PropType<Partial<Model & OpenAIFile>>,
  showAction: Boolean,
  key: Number,
  popContent: String,
  showDelete: Boolean,
  editName: Boolean,
  image: String
})
type Type = keyof typeof typeMap
const typeMap = {
  chatCompletion: '文本',
  image: '图像',
  file: '文件',
  completion: "文本",
  voice: '音频'
}
const dele = ref<boolean>(false)
const isEdit = ref<boolean>(false)
const title = ref<string>(props.modelItem!.id!)
const url = GLOB.VITE_OSS
const emit = defineEmits(['delete', 'edit', 'updateTitle'])
const submit = () => {
  if (isEdit.value === true) {
    emit('updateTitle', title.value)
    isEdit.value = false
    dele.value = false
    return
  }
  emit('delete', props.modelItem)
}
const editRef = ref()
const edit = async () => {
  if (props.editName) {
    isEdit.value = true
    await nextTick()
    editRef.value.focus()
    dele.value = true
  }
  emit('edit', props.modelItem)
}
</script>

<style lang="scss" scoped>
.action {
  padding-left: 20px;
  display: flex;
  padding-right: 20px;

  .edit,
  .submit,
  .close,
  .delete {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    border-radius: 3px;

    &:hover {
      background: #0000000c;
    }
  }
}

.tagInfo {
  display: flex;

  .tag {
    margin-right: 10px;
  }
}

.modelItem-item {
  width: 100%;
  height: 50px;
  display: flex;
  place-items: center;
}


.modelName {
  display: inline-block;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  padding: 0 !important;
}

.linkItemAva {
  width: 40px;
  padding-left: 10px;
}

.info {
  padding-left: 20px;
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: center;
  width: 100%;
  flex: 1;
  overflow: hidden;
}

.label {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: 16px;
}

:deep(.el-input__wrapper) {
  box-shadow: none;
}
</style>