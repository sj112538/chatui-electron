<template>
  <div class="chat">
    <div class="view">
      <div class="Model">
        <div class="ModelBox">
          <template v-for="item in Models">
            <Model v-if="item.value" :modelItem="(item.value as Model & OpenAIFile)" />
          </template>
          <GamePlay />
        </div>
      </div>
      <div class="viewContent">
        <div class="viewContentBox">
          <div v-for="item, index in textList" :key="item.created" class="chat-item">
            <div class="chat-item-template">
              <chat-item :index="index" ref="chatItemRef" @delete="deleteText(index)" :item="(item as any)"></chat-item>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="edit">
      <chat-tool-bar></chat-tool-bar>
      <div class="sendInputBox">
        <el-input @keyup="KeyUp" @keydown="KeyDown" v-model="editorArea" type="textarea" placeholder="请输入信息！" />
        <el-button type="primary" :disabled="!editorArea" size="large" class="sendBtn" @click="sendChat">发送</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { ElMessage } from 'element-plus';
import { OpenAIFile } from 'openai';
import ClipboardJS from 'clipboard'
import GamePlay from './GamePlay/index.vue'
import { saveSession } from '../chatLeft';
import chatItem from './chat-item/index.vue'
let Models = ref()
const initModel = async () => {
  const textModel = await useOpenAi.getModel()
  const imgModel = await useStableDiffion.getModel()
  const voiceModel = useVits.getModel()
  Models.value = markRaw([textModel, imgModel, voiceModel])
}
initModel()
const { editorArea, send, textList } = useAiHandler()
const props = defineProps({
  textList: Object as PropType<Ref<chatCompletion[]>>
})
textList.value = props.textList as any
textList.value.forEach((item: any) => {
  const clipboard = new ClipboardJS('.copy-' + item.created);
  clipboard.on('success', () => {
    ElMessage({
      type: "success",
      message: "复制成功！"
    })
  })
})
const deleteText = (index: number) => {
  textList.value.splice(index, 1)
  saveSession()
}
const { KeyDown, KeyUp, onkeydowned } = useKeyDown()
onkeydowned((keyMap) => {
  if (keyMap.get('ControlLeft') && keyMap.get('Enter')) {
    sendChat()
  }
})
const sendChat = () => {
  if (editorArea.value.length > 0) send(editorArea.value)
}
provide('textList', textList)

</script>
<style lang="scss">
@import './index.scss';
</style>
