<template>
  <div class="descriptions">
    <el-dialog title="训练详情" v-model="visible" width="90%">
      <div v-loadings="loading" class="custom-descriptions">
        <el-descriptions v-if="data" :column="size.width.value <= 800 ? 1 : 2">
          <el-descriptions-item label="Object">{{ data.object }}</el-descriptions-item>
          <el-descriptions-item label="ID">{{ data.id }}</el-descriptions-item>
          <el-descriptions-item label="Hyperparams">
            <ul>
              <li>n_epochs: {{ data.hyperparams.n_epochs }}</li>
              <li>batch_size: {{ data.hyperparams.batch_size }}</li>
              <li>prompt_loss_weight: {{ data.hyperparams.prompt_loss_weight }}</li>
              <li>learning_rate_multiplier: {{ data.hyperparams.learning_rate_multiplier }}</li>
            </ul>
          </el-descriptions-item>
          <el-descriptions-item label="Organization ID">{{ data.organization_id }}</el-descriptions-item>
          <el-descriptions-item label="Model">{{ data.model }}</el-descriptions-item>
          <el-descriptions-item label="Training Files">
            <ul>
              <li v-for="file in data.training_files">
                {{ file.filename }}
              </li>
            </ul>
          </el-descriptions-item>
          <el-descriptions-item label="Validation Files">
            <ul>
              <li v-for="file in data.validation_files">
                {{ file.filename }}
              </li>
            </ul>
          </el-descriptions-item>
          <el-descriptions-item label="Result Files">
            <ul>
              <li v-for="file in data.result_files">
                {{ file.filename }}
              </li>
            </ul>
          </el-descriptions-item>
          <el-descriptions-item label="Created At">{{ new Date(data.created_at * 1000).toLocaleString()
          }}</el-descriptions-item>
          <el-descriptions-item label="Updated At">{{ new Date(data.updated_at * 1000).toLocaleString()
          }}</el-descriptions-item>
          <el-descriptions-item label="Status">{{ data.status }}</el-descriptions-item>
          <el-descriptions-item label="Fine-tuned Model">{{ data.fine_tuned_model }}</el-descriptions-item>
          <el-descriptions-item label="Events">
            <ul>
              <li v-for="event in data.events">
                {{ event.message }} ({{ new Date(event.created_at * 1000).toLocaleString() }})
              </li>
            </ul>
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </el-dialog>
  </div>
</template>
<script setup lang='ts'>
const size = useWindowSize()
const loading = ref<boolean>(false)
const visible = ref<boolean>(false)
const data = ref<any>()
const open = async (id: string) => {
  visible.value = true
  data.value = null
  loading.value = true
  try {
    const result = await chatgptApi.retrieveFineTune(id)
    data.value = result
  } finally {
    loading.value = false
  }
}
defineExpose({ open })
</script>
<style lang="scss" scoped>
.custom-descriptions {
  height: 600px;
  overflow: auto;
}
</style>