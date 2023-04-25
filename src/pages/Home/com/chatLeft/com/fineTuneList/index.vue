<template>
  <sider-list :data="search?.filter.value">
    <template #search>
      <div class="search-inut">
        <el-input :prefix-icon="Search" v-model="search!.search.value"></el-input>
      </div>
    </template>
    <template #content="{ data }">
      <div @click="selectFineTune(data.id)" :class="data?.id === nowfineTune ? 'linkItem selectLink' : 'linkItem'">
        <div class="linkItemBox">
          <Model :showDelete="data.status !== 'pending'" @delete="cancel(data.id)" @edit="RetrieveFineTune(data.id)"
            :show-action="data?.id === nowfineTune" :pop-content="data.training_files[0].status_details" :modelItem="{
              owned_by:
                data.status === 'failed' ? 'error' :
                  data.status === 'pending' ? 'pending' :
                    data.status === 'succeeded' ? 'success' :
                      data.status === 'cancelled' ? 'cancel' : undefined,
              id:
                data.status === 'failed' ? '训练失败' :
                  data.status === 'pending' ? '进行中' :
                    data.status === 'cancelled' ? '训练取消' :
                      data.fine_tuned_model, type: data.model, version: data.status
            }" />
        </div>
      </div>
    </template>
  </sider-list>
  <Descriptions ref="descriptionsRef" />
</template>
<script setup async lang='ts'>
import { useSearch } from '../../index'
import { Search } from '@element-plus/icons-vue'
import { fineTuneList, nowfineTune } from '@/composables/useOpenAi';
import Descriptions from './descriptions/index.vue'
const descriptionsRef = ref<InstanceType<typeof Descriptions>>()
const search = useSearch()
watchEffect(() => {
  search.resetData(fineTuneList.value)
})
const selectFineTune = (id: string) => {
  nowfineTune.value = id
}
const RetrieveFineTune = async (id: string) => {
  descriptionsRef.value!.open(id)
}
const cancel = async (id: string) => {
  const data = chatgptApi.cancelFineTune(id)
}
</script>
<style lang="scss" scoped>
@import '../index.scss';
</style>
