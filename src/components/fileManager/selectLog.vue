<template>
  <div class="selectLog">
    <el-dialog v-model="visiable" width="80%" draggable>
      <el-auto-resizer>
        <template #default="{ width }">
          <el-table-v2 v-if="columns" :row-key="'路径'" :columns="columns" :data="selection" :width="width" :height="460">
          </el-table-v2>
        </template>
      </el-auto-resizer>
    </el-dialog>
  </div>
</template>

<script setup lang='tsx'>
import { Column, ElButton } from 'element-plus'
const selection = ref<filesDiskInfo[]>([])
let loadCol: Function | null = null
const columns = ref<Column[]>([])
const visiable = ref<boolean>(false)
const open = (sele: filesDiskInfo[], loadColFunc: Function) => {
  selection.value = sele
  loadCol = loadColFunc
  columns.value = loadCol!(selection.value)
  columns.value.shift()
  columns.value.push({
    title: '操作',
    key: 'operate',
    dataKey: 'operate',
    width: 300,
    cellRenderer: ({ rowIndex }: any) => {
      return (
        <ElButton type='danger' onClick={() => deleSele(rowIndex)}>删除</ElButton>
      )
    },
  })
  visiable.value = true
}
const deleSele = (rowIndex: number) => {
  selection.value.splice(rowIndex, 1)
}
defineExpose({
  open
})
</script>

<style lang="scss" scoped>
.selectLog {}
</style>