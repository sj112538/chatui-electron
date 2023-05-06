<template>
  <div class="fileMananger">
    <el-dialog v-model="visiable" title="Tips" width="80%" draggable>
      <el-auto-resizer>
        <template #default="{ width }">
          <span style="padding: 10px;">{{ '文件浏览器' }}</span>
          <el-button-group>
            <el-button size="small" :disabled="dataLink.prev && dataLink.prev.list.length > 0 ? false : true"
              @click="prevDir" type="primary" :icon="ArrowLeft"></el-button>
            <el-button size="small" :disabled="dataLink.next ? false : true" @click="nextDir" type="primary"
              :icon="ArrowRight"></el-button>
          </el-button-group>
          <el-table-v2 v-if="dataLink.list && columns && columns.length > 0" v-loading="loading" :row-key="'路径'"
            :columns="columns" :data="dataLink.list" :width="width" :height="460">
          </el-table-v2>
        </template>
      </el-auto-resizer>
      <div v-if="selection.length" class="selectFolder">
        <div class="tips">
          {{ '已选择：' + selection.length }}
        </div>
        <el-button @click="openSelectLog" plain circle size='large' :icon="Folder" color="#626aef">
        </el-button>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button size="small" @click="visiable = false">取消</el-button>
          <el-button size="small" type="primary" @click="confim">
            确认
          </el-button>
        </span>
      </template>
    </el-dialog>
    <el-button @click="open" color="#626aef" plain class="folderBtn" size="small">
      <el-icon>
        <Folder />
      </el-icon>
    </el-button>
    <select-log ref="selectLogRef" />
  </div>
</template>

<script setup lang='tsx'>
import { Folder, ArrowLeft, ArrowRight } from '@element-plus/icons-vue'
import { ElButton, Column, ElCheckbox, CheckboxValueType, ElAvatar } from 'element-plus'
const props = defineProps({
  路径: {
    type: String,
    default: "",
  },
  data: {
    type: String,
    default: "",
  },
  type: {
    type: String,
    default: 'single'
  },
  multiple: {
    type: Boolean,
    required: true
  },
  seleType: {
    type: String,
    default: '混合'
  }
})
const emit = defineEmits(['update:路径', 'update:data'])
const confim = () => {
  if (props.multiple) {
    emit('update:路径', selection.value.map((e) => {
      return e.路径
    }))
  } else {
    emit('update:路径', selection.value[0].路径)
  }
  emit('update:data',selection.value[0].data)
  visiable.value = false
}
const visiable = ref<boolean>(false)
const loading = ref<boolean>(false)
const open = () => {
  visiable.value = true
}
const columns = ref<Array<Column>>([]);
interface DataLinkNode {
  list: filesDiskInfo[]
  prev: DataLinkNode | null
  next: DataLinkNode | null
}

const dataLink = ref<DataLinkNode>({
  list: [],
  prev: null,
  next: null
})
const initData = async () => {
  try {
    loading.value = true
    const { data, status, msg } = await localApi.getDiskInfo()
    if (!errHandler(status, msg)) {
      return
    }
    loadNext(data)
    dataLink.value.list = data
  } finally {
    loading.value = false
  }
}
const doubleClick = ref<boolean>(false)
const nowPos = ref<string>('')
const enterDir = async (rowData: filesDiskInfo, key: string) => {
  disableSelect()
  if (rowData.类型 === '文件') {
    return
  }
  // 双击判断
  if (doubleClick.value) {
    try {
      loading.value = true
      const { data, status, msg } = await localApi.getFiles(rowData.路径)
      nowPos.value = rowData.路径
      loading.value = false
      if (!errHandler(status, msg)) {
        return
      }
      loadNext(data)
    } finally {
      loading.value = false
    }
  } else {
    doubleClick.value = true
    setTimeout(() => {
      doubleClick.value = false
    }, 300)
  }
}
const loadCol = (Info: filesDiskInfo[]) => {
  if (!Info[0]) {
    return
  }
  const dynamicColumns = Object.keys(Info[0]).map((key) => {
    if (key === 'select') {
      return {}
    }
    return {
      title: key,
      key,
      dataKey: key,
      width: 300,
      cellRenderer: ({ rowData }: any) => {
        if (key === '类型') {
          if (rowData.类型 === '文件夹') {
            return (
              <ElAvatar shape="square" size='small' src={GLOB.VITE_OSS + '/' + rowData.类型 + '.png'}></ElAvatar>
            )
          }
        }
        return (
          <overflowTooltip style="cursor:pointer" onClick={() => enterDir(rowData, key)} class="data-cell" text={String(rowData[key])} width='200'></overflowTooltip>
        )
      }
    }
  }) as any
  dynamicColumns.unshift({
    key: 'selection',
    width: 20,
    cellRenderer: ({ rowData }: any) => {
      if (rowData.类型 === '磁盘' || (rowData.类型 !== props.seleType && props.seleType !== '混合')) {
        return
      }
      return (
        <ElCheckbox
          onChange={($event) => onChange($event, rowData)}
          indeterminate={false}
          checked={rowData.select}
          key={rowData.select}
        />
      )
    },
    headerCellRenderer: () => {
      if (dataLink.value.list[0].类型 === '磁盘') {
        return
      }
      if (!props.multiple) {
        return
      }
      return (
        <ElCheckbox
          onChange={($event) => allSelection($event)}
          indeterminate={false}
          checked={allSelect.value}
          key={+(allSelect.value)}
        />
      )
    },
    title: '',
    dataKey: 'selection'
  })
  return dynamicColumns
}
const loadNext = (Info: filesDiskInfo[]) => {
  columns.value = loadCol(Info)
  dataLink.value.next = {
    list: Info,
    next: null,
    prev: dataLink.value
  }
  dataLink.value = dataLink.value.next
}
const prevDir = () => {
  if (dataLink.value.list[0] && dataLink.value.list[0].类型 !== dataLink.value.prev!.list[0].类型) {
    columns.value = loadCol(dataLink.value.prev!.list)
  }
  dataLink.value = dataLink.value.prev!
}
const nextDir = () => {
  if (dataLink.value.list[0] && dataLink.value.list[0].类型 !== dataLink.value.next!.list[0].类型) {
    columns.value = loadCol(dataLink.value.next!.list)
  }
  dataLink.value = dataLink.value.next!
}
const selection = ref<filesDiskInfo[]>([])
const onChange = (event: string | number | boolean, rowData: filesDiskInfo) => {
  if (event) {
    rowData.select = true
    selection.value.push(rowData)
  } else {
    rowData.select = false
    const index = selection.value.findIndex((item) => item === rowData)
    if (index !== -1) {
      selection.value.splice(index, 1)
    }
  }
}
const allSelection = (e: CheckboxValueType) => {
  if (e) {
    selection.value = selection.value.concat(dataLink.value.list.map((e) => {
      e.select = true
      return e
    }))
  } else {
    selection.value = selection.value.reduce((acc: any, item) => {
      if (dataLink.value.list.includes(item)) {
        item.select = false;
      } else {
        acc.push(item);
      }
      return acc;
    }, []);
  }
}
const allSelect = ref<boolean>(false)
watchEffect(() => {
  let allSelected = true; // 假设所有元素都被选择了
  for (let i = 0; i < dataLink.value.list.length; i++) {
    const item = dataLink.value.list[i];
    const is = selection.value.includes(item);
    if (is) {
      item.select = true;
    } else {
      item.select = false;
      allSelected = false; // 如果有一个元素没有被选择，则 allSelected 为 false
    }
  }
  allSelect.value = allSelected; // 所有元素是否都被选择
})
if (!props.multiple) {
  watch(() => selection.value, (e) => {
    if (e.length > 1) {
      const value = selection.value.shift()
    }
  }, {
    deep: true
  })
}
const selectLogRef = ref()
const openSelectLog = () => {
  selectLogRef.value.open(selection.value, loadCol)
}
initData()
defineExpose({
  open
})
</script>

<style lang="scss">
.fileMananger {
  .el-alert {
    height: 36px;
  }

  .data-cell {
    width: 100%;
    text-align: center;
  }

  .folderBtn {
    margin-left: 10px;
    margin-bottom: 2px;
    width: 30px;
    height: 30px;
  }

  .el-dialog__footer {
    margin-top: 30px;
  }

  .el-dialog__header {
    display: none;
  }

  .el-dialog__body {
    padding: 10px;
    min-height: 500px;
    max-height: 500px;
    overflow: auto;
  }

  .el-table-v2__row-cell,
  .el-table-v2__header-cell {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .selectFolder {
    position: relative;
    position: absolute;
    right: 40px;
    bottom: 65px;
    display: flex;
    align-items: center;
  }

  .tips {
    margin-right: 10px;
  }
}
</style>
