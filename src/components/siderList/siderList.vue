<template>
  <div class="siderList">
    <div class="searchTop">
      <slot name="search" />
    </div>
    <div class="linkMan">
      <div class="linkBox" ref="siderList">
        <template v-if="data">
          <template v-if="dataType === '[object Object]'">
            <template v-for="( value, key ) in data">
              <slot :data="value" :keyword="key" name="content" />
            </template>
          </template>
          <template v-if="dataType === '[object Array]'">
            <template v-for="item, index in data">
              <slot :data="item" :keyword="index" name="content" />
            </template>
          </template>
        </template>
      </div>
    </div>
  </div>
</template>
<script setup lang='ts'>
const props = defineProps({
  data: {
    type: Object,
    require: true
  }
})
const dataType = Object.prototype.toString.call(props.data)
</script>

<style lang="scss" scoped>
.siderList {
  display: flex;
  width: 300px;
  flex-direction: column;
  background-image: linear-gradient(to bottom right, rgb(241, 213, 213), rgb(255, 255, 255));

  .linkMan {
    height: calc(100% - 200px);
    flex: 1;
  }

  .linkBox {
    overflow-y: auto;
    overflow-x: hidden;
    height: 100%;
  }

  .searchTop {
    padding-top: 40px;
    padding-bottom: 10px;
    display: flex;
    place-items: center;
    flex-direction: column;
    position: sticky;
    top: 0;
  }

  .search-inut {
    width: 80%;
    margin: 0 auto;
    padding-bottom: 10px;
  }

  .linkItem {
    height: 80px;
    margin: 10px;
    padding-left: 10px;
    display: flex;
    justify-content: center !important;
    box-sizing: border-box;

    &:hover {
      background: #FFF;
      border-radius: 5px;
    }

    .linkItemBox {
      display: flex;
      place-items: center;
      padding-left: 30px;
      padding-right: 20px;
      cursor: pointer;
      width: 100%;
    }

    .linkItemAva {
      width: 40px;
    }

    .modelName {
      padding-left: 20px;
      display: inline-block;
      white-space: nowrap;
      text-overflow: ellipsis;
      width: 180px;
      overflow: hidden;
    }
  }

  .linkItem-new {
    height: 30px !important;
    @extend .linkItem;
    display: block;

    &:hover {
      background: none;
    }

    margin: 0 !important;
    padding-top: 10px !important;
    position: sticky;
    top: 0;
  }

  .selectLink {
    background: #FFF;
    border-radius: 5px;
  }
}
</style>