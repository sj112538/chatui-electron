<template>
  <sider-list :data="search?.filter.value">
    <template #search>
      <div class="search-inut">
        <el-input :prefix-icon="Search" v-model="search!.search.value"></el-input>
      </div>
    </template>
    <template #content="{ data }">
      <div :class="data?.id === Models?.id ? 'linkItem selectLink' : 'linkItem'">
        <div class="linkItemBox" @click="setModel(data)">
          <template v-if="info">
            <Model @delete="deleteModel(data.id)" :show-action="Boolean(data.parent)"
              :pop-content="info[data.id]?.info.zh" :modelItem="data" />
          </template>
        </div>
      </div>
    </template>
  </sider-list>
</template>
<script setup async lang='ts'>
import { useSearch } from '../index'
import { Search } from '@element-plus/icons-vue'
const { deleteModel } = chatgptApi
const search = useSearch()
const useAiMap = {
  'openai': (item: Model) => useOpenAi.setModel(item),
  'system': (item: Model) => useOpenAi.setModel(item),
  'openai-dev': (item: Model) => useOpenAi.setModel(item),
  'openai-internal': (item: Model) => useOpenAi.setModel(item),
  'stableDiffusion': (item: Model) => useStableDiffion.setModel(item),
  'vits': (item: Model) => useVits.setModel(item),
}
type useAiMapKey = keyof typeof useAiMap
// setModel
const setModel = (item: Model) => {
  if (useAiMap[item.owned_by as useAiMapKey]) {
    useAiMap[item.owned_by as useAiMapKey](item)
  } else {
    useOpenAi.setModel(item)
  }
}
// 获取模型
useAiHandler().listModels(search.setData)
const Models = ref()
const getModels = async () => {
  Models.value = await useOpenAi.getModel()
}
getModels()
const info = ref()
watchEffect(() => {
  info.value = modelsInfo.value
})

</script>
<style lang="scss" scoped>
@import './index.scss';
</style>