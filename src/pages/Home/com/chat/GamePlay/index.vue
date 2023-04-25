<template>
  <div class="GamePlay">
    <div class="playIcon">
      <svg class="playSvg" @click="PlayCheckRef.open()" t="1680665248989" viewBox="0 0 1024 1024" version="1.1"
        xmlns="http://www.w3.org/2000/svg" p-id="4545" width="20" height="20">
        <path
          d="M734.56 576.032a29.344 29.344 0 0 1 17.44 4.736c7.68 4.928 12.832 12.896 14.944 21.728a38.56 38.56 0 0 1-3.2 26.88l-96 120.832c-8.864 17.024-28.448 22.848-43.744 13.024s-20.544-31.584-11.712-48.608l54.4-68.48H291.104a35.072 35.072 0 1 1 0-70.144h441.856l1.632 0.032zM289.44 448a29.344 29.344 0 0 1-17.44-4.736 35.264 35.264 0 0 1-14.944-21.728 38.56 38.56 0 0 1 3.2-26.88l96.032-120.832c8.832-17.024 28.416-22.848 43.712-13.024 15.296 9.824 20.544 31.584 11.712 48.608l-54.4 68.48h375.616a35.072 35.072 0 1 1 0 70.144H291.072l-1.6-0.032zM64 127.68C64 92.512 92.8 64 127.712 64H896.32C931.488 64 960 92.8 960 127.712V896.32c0 35.2-28.8 63.712-63.712 63.712H127.68C92.512 960 64 931.2 64 896.288V127.68z m64 32.32v703.936A32 32 0 0 0 160 896h704a32 32 0 0 0 32-32V160a32 32 0 0 0-32-32H160a32 32 0 0 0-32 32z"
          fill="#1196db" p-id="4546" data-spm-anchor-id="a313x.7781069.0.i0" class="selected"></path>
      </svg>
    </div>
    <div class="playName">
      {{ PlayName }}
    </div>
  </div>
  <PlayCheck ref="PlayCheckRef" />
</template>

<script setup lang='ts'>
const { PlayName } = useGamePlay()
const PlayCheckRef = ref()
</script>

<style lang="scss" scoped>
.GamePlay {
  display: flex;
  justify-content: center;
  align-items: center;

  .playIcon {
    width: 20px;
    height: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .playSvg {
    cursor: pointer;
  }

  .playName {
    margin-left: 10px;
    width: 70px;
    font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
  }
}
</style>