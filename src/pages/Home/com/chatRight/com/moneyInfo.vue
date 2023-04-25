<template>
  <div class="moneyInfo">
    <span v-if="info?.total_available"> 余额:{{ (+info?.total_available) }}</span>
  </div>
</template>

<script setup lang='ts'>
import { formData } from '../../setting/hook/useForm';
import { getinfo, info } from './hook/useMoneyInfo'
formData.value.openAi?.isOpen && getinfo()
</script>
<style>
.moneyInfo {
  width: 100%;
  height: 20px;
}
</style>