<script lang="ts" setup>
import type { ITrendsItem } from '@/utils/type'
import { ref } from 'vue'

const dialogVisible = ref(false)
// 动态详情
const trendsInfo = ref({
  title: '',
  content: '',
  photo: '',
  startTime: '',
  headTeacherName: ''
})
// 向外暴露的方法
const show = (data: ITrendsItem) => {
  trendsInfo.value = data
  dialogVisible.value = true
}
const hide = () => {
  dialogVisible.value = false
  trendsInfo.value.content = ''
}

defineExpose<{
  show: (data: ITrendsItem) => void
  hide: () => void
}>({
  show,
  hide
})
</script>

<template>
  <el-dialog v-model="dialogVisible" width="800">
    <template #header>
      <div class="title" :title="trendsInfo.title">{{ trendsInfo.title }}</div>
    </template>
    <div class="info">
      <el-avatar :size="35" :src="trendsInfo.photo" />
      <div class="teacherName">{{ trendsInfo.headTeacherName }}</div>
      <el-tag
        type="success"
        :disable-transitions="false"
        effect="plain"
        size="small"
      >
        老师
      </el-tag>
      <div class="time">{{ trendsInfo.startTime }}</div>
    </div>
    <div class="content" v-html="trendsInfo.content"></div>
    <template #footer>
      <div class="dialog_footer">
        <el-button size="large" color="#2eba78" @click="dialogVisible = false">
          <span style="color: white">确定</span>
        </el-button>
        <el-button size="large" @click="hide"> 取消 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
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

.dialog_footer {
  display: flex;
  justify-content: center;
  .el-button {
    margin: 0 30px;
    width: 100px;
  }
}
.content {
  padding: 10px;
  box-sizing: border-box;
  border: 1px solid #ccc;
}
</style>
