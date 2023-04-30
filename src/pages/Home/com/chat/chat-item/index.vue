<template>
  <div :class="{ flexEnd: textItem.role === 'user' }" class="chat-textItem-box">
    <div class="linktextItemAva">
      <el-avatar :src="url + '/' + textItem?.owned_by + '.png'"></el-avatar>
    </div>
    <div class="modelName">
      {{ textItem?.owned_by }}
      {{ textItem?.createdTime }}
    </div>
  </div>
  <div ref="chats" :class="'preview ' + textItem?.created" @mouseleave="(textItem as any).isHover = false"
    @mouseenter="(textItem as any).isHover = true, codeHandler()">
    <div class="previewTop">
      <div class="pagination">
        <el-pagination :page-count="pageCount" v-model:current-page="currentPage" @current-change="currentChange"
          v-if="textItem.moreTextList && textItem.isHover" layout="prev, pager,next"
          :total="textItem.moreTextList.length * 10" small />
      </div>
      <div class="TopAction">
        <div class="isSkip" v-if="(textItem as any).isHover">
          <span style="margin-right: 5px;">跳过</span><el-switch v-model="textItem.isSkip" size="small" />
        </div>
        <el-divider direction="vertical"
          v-if="formData?.vits3?.isOpen && textItem.role === 'assistant' && (textItem as any).isHover && textItem.sessionIng !== '进行中'" />
        <div v-if="textItem.role === 'assistant' && textItem.sessionIng !== '进行中' && (textItem as any).isHover"
          class="pointer" @click="generateVoice">
          <el-icon>
            <el-icon>
              <Headset v-if="formData?.vits3?.isOpen" />
            </el-icon>
          </el-icon>
        </div>
        <el-divider direction="vertical"
          v-if="textItem.role === 'assistant' && (textItem as any).isHover && textItem.sessionIng !== '进行中'" />
        <div v-if="textItem.role === 'assistant' && textItem.sessionIng !== '进行中' && (textItem as any).isHover"
          class="pointer" @click="resetSession">
          <el-icon>
            <Refresh />
          </el-icon>
        </div>
        <el-divider direction="vertical" v-if="(textItem as any).isHover" />
        <div style="margin-bottom: 1px;" v-if="(textItem as any).isHover" class="pointer" @click="insertSession()">
          <el-icon>
            <Bottom />
          </el-icon>
        </div>
        <el-divider direction="vertical" v-if="(textItem as any).isHover" />
        <div v-if="!(textItem as any).edit && (textItem as any).isHover" class="pointer"
          @click="(textItem as any).edit = true">
          <el-icon>
            <Edit />
          </el-icon>
        </div>
        <div v-if="(textItem as any).edit && (textItem as any).isHover" class="pointer"
          @click="(textItem as any).edit = false, saveSession()">
          <el-icon>
            <Check />
          </el-icon>
        </div>
        <el-divider direction="vertical" v-if="(textItem as any).isHover" />
        <div :class="'copy-' + textItem.created" class="pointer" :data-clipboard-text="textItem.message"
          v-if="(textItem as any).isHover">
          <el-icon>
            <CopyDocument />
          </el-icon>
        </div>
        <el-divider direction="vertical"
          v-if="(textItem as any).isHover && textItem.sessionIng !== '进行中' && index !== 0" />
        <div :class="textItem.createdTime" class="pointer" @click="deleteText"
          v-if="(textItem as any).isHover && textItem.sessionIng !== '进行中' && index !== 0">
          <el-icon>
            <Close />
          </el-icon>
        </div>
        <el-divider direction="vertical" v-if="(textItem as any).isHover" />
        <span v-if="!(textItem as any).edit">{{ textItem.role === 'user' ? '用户' : textItem.role === 'assistant' ? 'AI' :
          '系统' }}</span>
        <template v-else>
          <el-select v-model="textItem.role" size="small">
            <el-option v-for="item in roleList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </template>
      </div>
    </div>
    <v-md-editor v-if="(textItem as any).edit" v-model="textItem.message"></v-md-editor>
    <v-md-preview v-else :text="textItem.message" />
    <template v-if="IsTermOpen">
      <el-divider style="width: calc(100% - 30px);margin: 0 auto;" />
      <div ref="xtermRef" />
    </template>
  </div>
  <div class="bottomAction">
    <div @click="stop(textItem as chatCompletion)" :class="'stopSession ' + textItem.sessionIng">{{ textItem.sessionIng
      === '进行中' ? '停止生成' : textItem.sessionIng }}</div>
  </div>
</template>

<script setup lang='tsx'>
import { nowSessionName, saveSession, sessionMap } from '../../chatLeft';
import { Edit, CopyDocument, Close, Check, Refresh, Headset, Bottom } from '@element-plus/icons-vue'
import { VMdPreview, VMdEditor } from '@/components/index'
import { formData } from '../../setting/hook/useForm';
const roleList = [{
  label: '用户',
  value: 'user'
}, {
  label: 'AI',
  value: 'assistant'
}, {
  label: '系统',
  value: 'system'
}]
const url = GLOB.VITE_OSS
const props = defineProps({
  item: {
    type: Object as PropType<chatCompletion>,
    required: true
  },
  index: {
    type: Number,
    required: true
  }
})
const currentPage = ref<number>(1)
const textItem = ref(props.item)
const { stop } = useAiHandler()
const emit = defineEmits(['delete'])
const deleteText = () => {
  emit('delete')
}
const changeCurrent = (n: number) => {
  currentPage.value = n
  currentChange(n)
}
const textList: Ref<chatCompletion[]> = inject('textList')!
const resetSession = async () => {
  useAiHandler().resetSession({ textList, index: props.index, currentChange, changeCurrent })
}
const pageCount = ref<number>()
const currentChange = async (number?: number) => {
  let n = null
  if (number) {
    n = number
  } else {
    n = pageCount.value!
  }
  if ((textItem.value as any).moreTextList[n - 1].value) {
    Reflect.set((textItem.value as any).moreTextList[n - 1].value, 'moreTextList', textItem.value.moreTextList)
    textItem.value = (textItem.value as any).moreTextList[n - 1].value
  } else {
    Reflect.set(textItem.value.moreTextList[n - 1]._value, 'moreTextList', textItem.value.moreTextList)
    textItem.value = textItem.value.moreTextList[n - 1]._value
  }
}
const generateVoice = () => {
  useVits.send(textItem)
}
const insertSession = () => {
  (sessionMap.value[nowSessionName.value] as unknown as Partial<chatCompletion>[]).splice(props.index + 1, 0, {
    role: 'system',
    message: '',
    created: Date.now(),
    createdTime: Dayjs(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
    edit: true
  })
}
const chats = ref<HTMLElement>()
const codeHandler = () => {
  if (textItem.value.sessionIng === '进行中') {
    return
  }
  const codes = chats.value!.querySelectorAll('pre code')
  const command = chats.value!.querySelector('#chatCode')
  if (command) {
    return
  }
  codes?.forEach(async (code) => {
    if ((code as any).__vue_app__) {
      return
    }
    const cloneNode: HTMLElement = code.cloneNode(true) as any
    const app = createApp({
      render: () => <>
        <chatCode node={cloneNode} onExcute={() => exCmd(cloneNode, cloneNode.innerText!)} />
      </>
    })
    app.mount(code)
  })
}
const xtermRef = ref<HTMLElement | undefined>()
const isWsOpen = ref<((type: TermWsMapKey | undefined) => boolean)>()
const exCmd = async (node: HTMLElement, cmd: string) => {
  const type = node.offsetParent?.className.split('-').at(-1) as TermWsMapKey | undefined
  const { init, excute } = useCommand(xtermRef)
  if (isWsOpen.value && isWsOpen.value!(type)) {
    excute(cmd, type)
    return
  }
  IsTermOpen.value = true
  await nextTick()
  isWsOpen.value = init()
  const inter = setInterval(() => {
    if (isWsOpen.value!(type)) {
      excute(cmd, type)
      clearInterval(inter)
    }
  }, 100)
}
const IsTermOpen = ref<boolean>(false)
defineExpose({
  currentChange
})
</script>

<style lang="scss">
@import '../index.scss';

.xterm {
  padding: 10px;
}

.highlightText {
  color: #5884fb;
}

.v-md-editor {
  margin-top: 10px;
  box-shadow: none;
}

.flexEnd {
  justify-content: flex-end;
}

.TopAction {
  display: flex;
  align-items: center;

  .pointer {
    display: flex;
    align-items: center;
  }

  .el-input {
    width: 60px;
  }
}

.isSkip {
  display: flex;
  align-items: center;
}

#xterm {
  padding: 15px;
  font-size: 20px;
  font-weight: 600;

  .xterm-viewport {
    border-radius: 5px;
  }
}
</style>
