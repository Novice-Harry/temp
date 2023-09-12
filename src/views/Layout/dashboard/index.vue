<script lang="ts" setup>
import { ref, onMounted } from 'vue'

import { getIndexApi } from '@/api'

const indexData = ref({
  studentCount: 0,
  classCount: 0,
  campCount: 0,
  teacherCount: 0,
  notice: []
})
// 获取首页数据
const getIndex = async () => {
  let res = await getIndexApi()
  indexData.value = res.data
}
onMounted(getIndex)
</script>

<template>
  <el-card class="dashboard_container">
    <el-row class="dashboard_info_display" :gutter="20">
      <el-col :span="12">
        <div class="dashboard_info_item">
          <div class="inner_item showline">
            <div class="detail">
              <img src="../../../assets/icons/book.svg" alt="" />
              {{ indexData.campCount }}
            </div>
            <div class="desc">校区</div>
          </div>
          <div class="inner_item">
            <div class="detail">
              <img src="../../../assets/icons/caidan.svg" alt="" />
              {{ indexData.classCount }}
            </div>
            <div class="desc">班级</div>
          </div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="dashboard_info_item" style="background-color: #40baff">
          <div class="inner_item showline">
            <div class="detail">
              <img src="../../../assets/icons/jiaoshi.svg" alt="" />
              {{ indexData.teacherCount }}
            </div>
            <div class="desc">在职教师</div>
          </div>
          <div class="inner_item">
            <div class="detail">
              <img src="../../../assets/icons/renyuan.svg" alt="" />
              {{ indexData.studentCount }}
            </div>
            <div class="desc">学生</div>
          </div>
        </div>
      </el-col>
    </el-row>
    <div class="dashboard_publicmsg">
      <div class="title">公告</div>
      <div class="msglist">
        <div
          class="msgitem"
          v-for="(item, index) in indexData.notice"
          :key="index"
        >
          {{ item }}
        </div>
      </div>
    </div>
  </el-card>
</template>

<style lang="scss" scoped>
.dashboard_container {
  min-height: calc(100% - 2px);

  .dashboard_info_display {
    background-color: #fff;

    .dashboard_info_item {
      background-color: #2eba78;
      border-radius: 5px;
      box-sizing: border-box;
      padding: 20px;
      color: white;
      display: flex;
      align-items: center;

      .inner_item {
        width: 50%;
        height: 80px;
        text-align: center;
        display: flex;
        flex-direction: column;
        justify-content: center;

        .detail {
          font-size: 22px;
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          justify-content: center;

          img {
            width: 30px;
            margin-right: 10px;
          }
        }

        .desc {
          font-size: 16px;
        }
      }

      .showline {
        border-right: 1px solid #fff;
      }
    }
  }

  .dashboard_publicmsg {
    margin-top: 20px;
    font-size: 14px;

    .title {
      border-bottom: 1px solid #e2e2e2;
      padding: 10px;
    }

    .msglist {
      .msgitem {
        padding: 20px 10px;
        border-bottom: 1px solid #e2e2e2;
      }
    }
  }
}
</style>
@/api/index22
