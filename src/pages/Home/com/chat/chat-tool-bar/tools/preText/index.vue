<template>
  <div class="preText">
    <div v-for="item, index in preTextList" class="preItem">
      <div class="itemContent" @click="addSessions(item.chatList)">
        <div class="title">{{ item.title }}</div>
      </div>
      <div class="action">
        <div @click="($event) => openAddTextDialog($event, item, index)" v-if="item.dele === false" class="edit">
          <svg t="1679974917482" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
            p-id="8860" width="15" height="15">
            <path
              d="M883 928H139a30 30 0 0 1 0-60h744a30 30 0 0 1 0 60zM541.07 207.5L164.79 583.79a30 30 0 0 0-8.78 20.4l-5 185A30 30 0 0 0 181 820h0.81l185-5a30 30 0 0 0 20.4-8.78L763.5 429.93zM862.21 288.79l-180-180a30 30 0 0 0-42.42 0l-56.29 56.28L805.93 387.5l56.28-56.29a30 30 0 0 0 0-42.42z"
              fill="#0368CD" p-id="8861"></path>
          </svg>
        </div>
        <div v-if="item.dele === false" class="delete" @click="item.dele = true">
          <svg t="1679975018215" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
            p-id="17602" width="15" height="15">
            <path
              d="M615.154032 92.154612V0H408.790712v92.154612H39.384615v92.942259h945.175513V92.154612zM782.135039 890.040275a37.807021 37.807021 0 0 1-35.444082 39.382313H268.589677a38.594667 38.594667 0 0 1-42.532898-32.293497V288.278531h-94.517551v601.761744A132.324572 132.324572 0 0 0 263.8638 1023.940139h472.587756a133.112218 133.112218 0 0 0 137.050449-129.173987v-606.487621H782.135039v601.761744z"
              fill="#3A75FF" p-id="17603"></path>
            <path d="M354.44312 288.278531h78.764626v462.348355H354.44312z m220.540953 0h81.127564v462.348355H572.621134z"
              fill="#3A75FF" p-id="17604"></path>
          </svg>
        </div>
        <div v-if="item.dele === true" @click="submit(index)" class="submit">
          <svg t="1679980570395" class="icon" viewBox="0 0 1025 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
            p-id="4505" width="15" height="15">
            <path
              d="M960.005813 324.073949l-80.827237-80.822237L418.499226 703.930062l-273.738802-273.740802-80.869237 80.875237 354.539039 354.493039 77.465227-77.517227 0.098 0.098L960.005813 324.073949zM960.005813 324.073949"
              fill="#1296db" p-id="4506"></path>
          </svg>
        </div>
        <div @click="item.dele = false" v-if="item.dele === true" class="close">
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
    <div class="preItemAdd">
      <div class="addSession" @click="(openAddTextDialog as any)">添加对话</div>
    </div>
    <el-dialog class="preTextDialog" align-center :append-to-body="true" v-model="visible" width="100%">
      <el-table row-key="created" :data="textList" style="width: 100%;max-height: 650px;min-height:650px;overflow: auto;">
        <el-table-column type="index" />
        <el-table-column prop="createdTime" width="200" label="创建时间" />
        <el-table-column prop="role" width="100" label="角色" />
        <el-table-column>
          <template #default="scope">
            <v-md-preview :text="scope.row.message" />
          </template>
          <template #header>
            内容
            <el-divider direction="vertical" />
            标题：
            <el-input v-model="formData.title" placeholder="请输入标题">
            </el-input>
            <span v-if="notice" clss="notice" style="color: red;margin-left: 10px;">注意：{{ notice }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="170">
          <template #default="scope">
            <el-button type="danger" size="small" @click="deleText(scope.$index)" :icon="Delete">删除</el-button>
            <el-button type="success" size="small" @click="editText(scope.row, scope.$index)" :icon="Edit">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <v-md-editor :right-toolbar="isEdit ? 'editSession | preview | fullscreen' : 'addSession| preview | fullscreen'"
        left-toolbar="undo | redo | clear | code | image" :toolbar="toolbar" :preview="false"
        v-model="formData.content" />
      <div class="footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="submitPreText">{{ '提交' + name }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang='ts'>
import { usePreText } from '.';
import { nowSessionName, useSession } from '@/pages/Home/com/chatLeft';
import { VMdEditor, VMdPreview } from '@/components/index'
import { Delete, Edit } from '@element-plus/icons-vue'
const name = ref<'添加对话' | '编辑对话'>('添加对话')
const notice = ref<string>('')
const formData = ref<preText>({
  title: '',
  content: '',
  dele: false
})
const rules = {
  title: [{ required: true, message: '标题不能为空' }],
  content: [{ required: true, message: '内容不能为空' }],
}
const visible = ref<boolean>(false)
const nowindex = ref<number>(0)
const openAddTextDialog = (event: Event, item?: preTextList, index?: number) => {
  formData.value = {
    title: '',
    content: '',
    dele: false
  }
  visible.value = true
  if (Boolean(item)) {
    name.value = '编辑对话'
    nowindex.value = index!
    formData.value.title = item!.title
    textList.value = item!.chatList
  } else {
    visible.value = true
    textList.value = []
    formData.value.title = ''
    name.value = '添加对话'
  }
}
const { preTextList, addPreText, editPreText, saveTextList } = usePreText()
preTextList.value = JSON.parse(await Localforage.getItem('preTextList') as string) || []
const submit = (index: number) => {
  preTextList.value.splice(index, 1)
  saveTextList()
}
const submitPreText = () => {
  if (textList.value.length === 0) {
    if (notice.value === '预设对话数量不能为0') {
      setTimeout(() => {
        notice.value = ''
        setTimeout(() => {
          notice.value = '预设对话数量不能为0'
        }, 200);
      }, 200);
    }
    notice.value = '预设对话数量不能为0'
    return
  }
  if (formData.value.title.length === 0) {
    if (notice.value === '请输入标题！') {
      setTimeout(() => {
        notice.value = ''
        setTimeout(() => {
          notice.value = '请输入标题！'
        }, 200);
      }, 200);
    }
    notice.value = '请输入标题！'
    return
  }
  if (name.value === '编辑对话') {
    editPreText(textList.value, nowindex.value)
  } else {
    textList.value.forEach((e) => {
      e.title = formData.value.title
    })
    addPreText(textList.value, formData.value.title)
  }
  visible.value = false
}
const textList = ref<Partial<chatCompletion>[]>([])

const { addSession } = useSession()
const addSessions = (item: Partial<chatCompletion>[]) => {
  const time = Date.now().toString()
  addSession(time, item)
  nowSessionName.value = time
}
const toolbar = {
  addSession: {
    title: '添加',
    icon: 'v-md-icon-save',
    action: () => {
      textList.value.push({
        role: 'system',
        message: formData.value.content,
        created: Date.now(),
        createdTime: Dayjs(Date.now()).format('YYYY-MM-DD HH:mm:ss')
      })
    }
  },
  editSession: {
    title: '保存编辑',
    icon: 'v-md-icon-toc',
    action: () => {
      textList.value[editIndex.value].message = formData.value.content
      formData.value.content = keepAdd.value
      isEdit.value = false
    }
  }
}
const deleText = (index: number) => {
  textList.value.splice(index, 1)
}
const isEdit = ref<boolean>(false)
const keepAdd = ref<string>('')
const editIndex = ref(0)
const editText = (item: chatCompletion, index: number) => {
  keepAdd.value = formData.value.content
  formData.value.content = item.message
  isEdit.value = true
  editIndex.value = index
}
</script>

<style lang="scss">
.preTextDialog {
  .v-md-editor {
    flex: 1;
    overflow: auto;
  }

  .el-dialog__body {
    padding: 0 !important;
    background: #FFF;
    flex-direction: column;
  }

  .el-table__header-wrapper {
    position: sticky;
    top: 0;
    z-index: 2;
    background: #fff;
  }

  display: contents !important;

  .el-dialog__header {
    display: none;
  }

  .el-dialog__headerbtn {
    display: none;
  }

  .el-dialog__body {
    padding: 10px;
    height: 100%;
    display: flex;
    width: 100%;
  }
}
</style>
<style lang="scss" scoped>
.preText {
  width: 100%;
  height: 100%;
  display: flex;
}

.footer {
  position: absolute;
  bottom: 20px;
  right: 20px;
}

.preItem {
  &:hover {
    background: #00000004;
  }

  position: relative;
  width: 15%;
  height: 90%;
  margin: 10px;
}

.itemContent {
  display: flex;
  width: 100%;
  cursor: pointer;
  flex-direction: column;
  height: 100%;
  align-items: center;
  justify-content: center;
}

.preItemAdd {
  flex-direction: column;
  width: 15%;
  height: 90%;
  margin: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.addSession {
  padding: 20px;
  border-radius: 10px;
  border: 1px dashed #8085ea;
  cursor: pointer;
  display: flex;
}

.action {
  display: flex;
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 2;
  cursor: pointer;
  height: 15px;
}

.submit,
.edit,
.delete,
.close {
  &:hover {
    background: #b0aeae68;
  }

  margin-left: 10px;
  height: 20px !important;
  width: 20px !important;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
}
</style>