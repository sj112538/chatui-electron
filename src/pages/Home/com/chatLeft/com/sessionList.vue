<template>
  <sider-list :data="search.filter.value">
    <template #search>
      <div class="search-inut">
        <el-input :prefix-icon="Search" v-model="search!.search.value"></el-input>
        <div class="linkItem-new">
          <div class="linkItemBox">
            <div class="addSession" @click="setSession('空白对话')">新建对话</div>
          </div>
        </div>
      </div>
    </template>
    <template #content="{ keyword, data }">
      <div v-if="keyword !== '空白对话'" :class="keyword === nowSessionName ? 'linkItem selectLink' : 'linkItem'">
        <div class="linkItemBox" @click="setSession(keyword as string)">
          <Model @updateTitle="($event) => updateTitle($event, data)" editName :key="+keyword" @delete="deleSession"
            :show-action="keyword === nowSessionName" :modelItem="{ created: +keyword, id: data[0]?.title }" />
        </div>
      </div>
    </template>
  </sider-list>
</template>
<script setup lang='ts'>
import { useSession, useSearch, nowSessionName, saveSession } from '../index'
import { sessionMap } from '../index'
import { Search } from '@element-plus/icons-vue'
const search = useSearch()
search.resetData(sessionMap.value)
watch(() => sessionMap.value, () => {
  search.resetData(sessionMap.value)
})
const { setSession, deleSession } = useSession()
const updateTitle = (e: string, data: any) => {
  data[0].title = e
  saveSession()
}
</script>
<style lang="scss" scoped>
@import './index.scss';

.linkItem {
  display: block !important;
}
</style>
