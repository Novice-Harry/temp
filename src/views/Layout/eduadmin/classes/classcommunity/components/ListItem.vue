<script lang="ts" setup>
import type { ITrendsItem } from '@/utils/type'

const emit = defineEmits(['callShowTrends', 'callEditTrends', 'deleteTrends'])

const props = defineProps<{ data: ITrendsItem }>()
/**
 * 传id去获取动态详情
 */
const getTrendsInfo = () => {
  emit('callShowTrends', props.data.id)
}
const getEditId = () => {
  emit('callEditTrends', props.data.id)
}
const getDeleteId = () => {
  emit('deleteTrends', props.data.id)
}
</script>

<template>
  <div class="listitem">
    <div class="titlebox">
      <div class="title" :title="data.title">{{ data.title }}</div>
      <div class="btnbox">
        <el-button link type="success" @click="getTrendsInfo">查看</el-button>
        <el-button link type="success" @click="getEditId">修改</el-button>
        <el-button link type="success" @click="getDeleteId">删除</el-button>
      </div>
    </div>
    <div class="info">
      <el-avatar :size="35" :src="data.photo" />
      <div class="teacherName">{{ data.headTeacherName }}</div>
      <el-tag
        type="success"
        :disable-transitions="false"
        effect="plain"
        size="small"
      >
        老师
      </el-tag>
      <div class="time">{{ data.startTime }}</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.listitem {
  border-bottom: 1px solid #ccc;
  padding: 15px 0;

  .titlebox {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .title {
    font-weight: 600;
    width: 300px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
  .info {
    padding: 15px 10px 10px;
    display: flex;
    align-items: center;

    .el-avatar {
      margin-right: 20px;
    }

    .teacherName {
      margin-right: 10px;
      font-size: 14px;
    }

    .time {
      margin-left: 20px;
      font-size: 14px;
    }
  }
}
</style>
