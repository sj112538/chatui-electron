<template>
  <div class="PlayCheck">
    <el-dialog title="切换模式" v-model="visible" width="90%">
      <div class="playList">
        <template v-for="item in PlayLists">
          <play-item :item="item" />
        </template>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang='ts'>
const { PlayLists } = useGamePlay()
const visible = ref<boolean>(false)
const open = () => {
  visible.value = true
}
defineExpose({
  open
})
</script>

<style lang="scss" scoped>
.PlayCheck {
  .playList {
    width: 100%;
    
    height: auto;
    display: flex;
  }

  @media(max-width: 800px) {
    .playList {
      flex-direction: column !important;
    }
  }

  .checked {
    border: 2px solid #000000;
  }
}
</style>