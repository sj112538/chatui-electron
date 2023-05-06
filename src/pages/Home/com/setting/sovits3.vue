<template>
  <div :class="name">
    <el-dialog v-model="dialogVisible" :title="name + '设置'" width="80%" align-center>
      <span>启动vits3</span><el-switch size="small" style="padding: 10px;" v-model="form.vits3.isOpen"></el-switch><br />
      <el-button type="primary" size="small" @click="addModel">新增模型</el-button>
      <div class="form">
        <el-auto-resizer>
          <template #default="{ width }">
            <el-table-v2 :columns="columns" :data="form.vits3?.modelData" :width="width" :height="500" fixed />
          </template>
        </el-auto-resizer>
      </div>
    </el-dialog>
    <el-dialog v-model="visible" title="新增模型" width="80%" align-center>
      <div class="form">
        <el-form inline :modelItem="modelFormData" ref="modelForm">
          <el-form-item label="模型类型">
            <el-select v-model="modelFormData.type">
              <el-option value="single" label="单模型"></el-option>
              <el-option value="multiple" label="多模型"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="配置信息">
            <el-input v-model="modelFormData.config"></el-input>
            <file-manager :multiple="false" seleType='文件' v-model:路径="modelFormData.config" />
          </el-form-item>
          <el-form-item v-if="modelFormData.type === 'multiple'" label="模型信息">
            <el-input v-model="modelFormData.info"></el-input>
            <file-manager :multiple="false" seleType='文件' v-model:路径="modelFormData.info" />
          </el-form-item>
          <el-form-item label="模型名称">
            <el-input v-model="modelFormData.modelsName"></el-input>
          </el-form-item>
        </el-form>
        <el-button type='primary' @click="addModels" size="small">新增模型</el-button>
        <el-auto-resizer>
          <template #default="{ width }">
            <el-table-v2 :columns="modelColumns" :data="modelFormData.models" :width="width" :height="500" fixed />
          </template>
        </el-auto-resizer>
        <div class="footer">
          <el-button @click="visible = false">取消</el-button>
          <el-button type="primary" @click="submitModel">提交</el-button>
        </div>
      </div>
    </el-dialog>
    <el-dialog v-model="modelsVisible" title="添加模型" width="80%" align-center>
      <el-form inline :modelItem="modelsForm" ref="modelForm">
        <el-form-item label="模型名称">
          <el-input v-model="modelsForm.modelName"></el-input>
        </el-form-item>
        <el-form-item label="模型封面图片">
          <el-input v-model="modelsForm.cover"></el-input>
          <file-manager :multiple="false" seleType='文件' v-model:data="modelsForm.cover" />
        </el-form-item>
        <el-form-item label="模型位置">
          <el-input v-model="modelsForm.path"></el-input>
          <file-manager :multiple="false" seleType='文件' v-model:路径="modelsForm.path" />
        </el-form-item>
      </el-form>
      <div class="footer">
        <el-button @click="modelsVisible = false">取消</el-button>
        <el-button type="primary" @click="submitModels">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang='tsx'>
import useForm from './hook/useForm';
import { Column, ElButton, ElForm } from 'element-plus'
import { Delete, Edit } from '@element-plus/icons-vue'
const name = 'vits3'
const form = settingStore().FormData
const visible = ref<boolean>(false)
if (!form.vits3?.modelData) {
  Reflect.set(form, 'vits3', {})
  Reflect.set(form.vits3, 'modelData', [])
}
const { dialogVisible, open } = useForm()
const columns: Column[] = [{
  dataKey: 'index',
  key: 'index',
  width: 200,
  title: '序号',
  cellRenderer: ({ rowIndex }) => <div>{rowIndex + 1}</div>
}, {
  dataKey: 'type',
  key: 'type',
  width: 200,
  title: '类型'
}, {
  dataKey: 'info',
  key: 'info',
  width: 200,
  title: '模型信息文件位置'
}, {
  dataKey: 'config',
  key: 'config',
  width: 200,
  title: '模型配置文件位置'
}, {
  dataKey: 'modelsName',
  key: 'name',
  width: 200,
  title: '模型名称'
}, {
  dataKey: 'operate',
  key: 'operate',
  width: 200,
  title: '操作',
  cellRenderer: ({ rowIndex, rowData }) => <><ElButton onClick={() => {
    form.vits3.modelData.splice(rowIndex, 1)
  }} type='danger' size='small' icon={Delete}></ElButton>
    <ElButton onClick={() => {
      visible.value = true
      modelFormData.value = rowData
    }} type='primary' size='small' icon={Edit}></ElButton></>
}]
const modelFormData = ref<ModelFormData>({
  info: '',
  config: '',
  path: '',
  type: 'single',
  modelsName: '',
  models: []
})
const submitModel = () => {
  form.vits3.modelData.push(modelFormData.value)
  visible.value = false
}
const modelForm = ref<InstanceType<typeof ElForm>>()
const addModel = () => {
  visible.value = true
}
const modelColumns: Column[] = [{
  title: '模型名称',
  width: 200,
  dataKey: 'modelName',
  key: "name"
},
{
  title: '模型位置',
  width: 200,
  dataKey: 'path',
  key: "path"
},
{
  title: '模型封面',
  width: 200,
  dataKey: 'cover',
  key: "cover"
},
{
  title: '操作',
  width: 200,
  dataKey: 'operate',
  key: "operate",
  cellRenderer: ({ rowIndex, rowData }: any) => {
    return (
      <>
        <ElButton type='danger' size='small' icon={Delete} onClick={() => deleModel(rowIndex)}></ElButton>
        <ElButton type='primary' size='small' icon={Edit} onClick={() => {
          modelsVisible.value = true
          modelsForm.value = rowData
        }}></ElButton>
      </>
    )
  },
}
]
const deleModel = (index: number) => {
  modelFormData.value.models.splice(index, 1)
}
const modelsVisible = ref<boolean>(false)
const modelsForm = ref({
  path: '',
  modelName: '',
  cover: ''
})
const submitModels = () => {
  modelFormData.value.models.push(modelsForm.value)
  modelsVisible.value = false
}
const addModels = () => {
  modelsVisible.value = true
}
defineExpose({
  open,
  name
})
</script>
<style lang="scss">
.el-upload-list {
  display: none;
}
</style>