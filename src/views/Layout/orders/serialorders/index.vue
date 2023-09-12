<script lang="ts" setup>
// import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <el-card class="topbox">
    <template #header>
      <div class="top">
        <div class="left">
          <span>{{ '北京展望未来培训学校' }}</span>
          <span>序列号（可用数量{{ 0 }}/总数量{{ 0 }}）</span>
        </div>
        <el-button color="#13bc75" @click="router.push('/orders/seriallist')">
          <span style="color: white; font-weight: 600">序列号清单</span>
        </el-button>
      </div>
    </template>
    <div class="list">
      <div class="listitem"></div>
    </div>
  </el-card>
</template>

<style lang="scss" scoped>
.topbox {
  .top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .left {
      font-size: 14px;
    }
  }
}
</style>
