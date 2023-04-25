<template>
  <div @click="check(item.modeName)"
    :class="!item.status ? 'disabled playItem' : item.modeName === PlayName ? 'checked playItem' : 'playItem'">
    <div class="content">
      <div class="name">{{ item.modeName }}</div>
      <div class="info">{{ item.info }}</div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import randomColor from 'randomcolor';
const { PlayName } = useGamePlay()
const check = (mode: PlayListMode) => {
  if (props.item.status) {
    PlayName.value = mode
  }
}
const color = randomColor() + '60'
const props = defineProps({
  item: {
    type: Object as PropType<PlayItem>,
    required: true
  }
})
</script>

<style lang="scss" scoped>
.playItem {
  padding: 10px;
  max-width: 300px;
  min-width: 200px;
  min-height: 100px;
  border-radius: 10px;
  margin: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: v-bind(color);
  box-sizing: border-box;
  position: relative;
  flex: 1;
  cursor: pointer;
}

.disabled {
  background: #c4c3c32a;
  cursor: not-allowed;
}

.content {
  position: absolute;
  width: 250px;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

}

.name {
  margin-bottom: 10px;
}
</style>