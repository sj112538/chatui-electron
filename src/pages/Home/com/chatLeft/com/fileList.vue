<template>
  <sider-list :data="search?.filter.value">
    <template #search>
      <div class="search-inut">
        <el-input :prefix-icon="Search" v-model="search!.search.value"></el-input>
        <div class="linkItem-new">
          <div class="linkItemBox">
            <div class="upload">
              <div class="addSession">上传文件</div>
              <input @change="uploadFile" class="file" type="file" />
            </div>
          </div>
        </div>
      </div>
    </template>
    <template #content="{ data }">
      <div @click="setFile(data.id)" ref="linkItem" class="linkItem"
        :class="data?.id === getNowFile().value ? 'linkItem selectLink' : 'linkItem'">
        <div class="linkItemBox">
          <Model v-loading="data.loading" @delete="deleFile" @edit="edit" :show-action="data?.id === getNowFile().value"
            :modelItem="{ ...data, key: data.id, id: data.filename, type: data.object, owned_by: data.object }" />
        </div>
      </div>
    </template>
  </sider-list>
</template>
<script setup lang='ts'>
import { FilesList } from '@/composables/useOpenAi';
import { Search } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus';
import { OpenAIFile } from 'openai';
import { useSearch } from '../index'
interface OpenAIFileExtends {
  loading: boolean,
  key: string
}
type AIFile = OpenAIFile & OpenAIFileExtends
const search = useSearch()
const { upload, setFile, getFile, getNowFile, deleteFile, editFile } = useOpenAi
search.setData(FilesList.value)
const deleFile = async (file: AIFile) => {
  file.loading = true
  try {
    const result = await deleteFile(file)
    if (result.data.deleted) {
      await getFile()
      search.resetData(FilesList.value)
    }
  } finally {
    file.loading = false
  }
}
const uploadFile = async (e: Event) => {
  const result = await upload(e)
  if (result?.status === 'uploaded') {
    await getFile()
    search.resetData(FilesList.value)
    ElMessage({
      type: 'success',
      message: '上传成功！'
    })
    return
  }
  ElMessage({
    type: 'error',
    message: '上传失败！'
  })
}
const edit = async (file: AIFile) => {
  const result = await editFile(file.key)
}
</script>
<style lang="scss" scoped>
@import './index.scss';

.file {
  position: absolute;
  z-index: 1;
  width: 100%;
  height: 110%;
  cursor: pointer;
  opacity: 0;
}


.linkItem {
  cursor: pointer !important;
}

.upload {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  place-content: center;
}

::file-selector-button {
  display: none;
}

.addSession {
  position: relative;
}
</style>