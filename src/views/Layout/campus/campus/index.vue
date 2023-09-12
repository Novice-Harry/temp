<script lang="ts" setup>
import { onMounted } from 'vue'
import {
  useRouter
  // , useRoute
} from 'vue-router'
const router = useRouter()
// const route = useRoute()

import { useCampListStore } from '@/stores/campus/campus'
const campusStore = useCampListStore()

onMounted(() => {
  campusStore.getList()
})
</script>

<template>
  <el-card class="campus_container">
    <template #header>
      <div class="campus_container_header">
        <span>校区列表</span>
        <el-button color="#2eba78" @click="router.push('/campus/newcampus')">
          <span style="color: white">新建校区</span>
        </el-button>
      </div>
    </template>
    <el-table :data="campusStore.tableData" style="width: 100%" size="large">
      <el-table-column prop="campName" label="校区名称" width="150" />
      <el-table-column prop="username" label="校区负责人" width="110" />
      <el-table-column prop="phone" label="联系方式" width="130" />
      <el-table-column prop="classCount" label="班级数量" width="100" />
      <el-table-column prop="teacherCount" label="老师数量" width="100" />
      <el-table-column prop="studentCount" label="学生数量" width="100" />
      <el-table-column label="操作">
        <template #default="{ row }">
          <div
            class="form_btn form_btn_primary"
            @click="router.push('/campus/campus/' + row.id)"
          >
            进入校区
          </div>
          <div
            class="form_btn form_btn_primary"
            @click="router.push('/campus/editcampus/' + row.id)"
          >
            编辑
          </div>
          <div
            class="form_btn form_btn_warning"
            @click="campusStore.deleteCampus(row)"
          >
            删除
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="paginationbox">
      <el-pagination
        class="commonpagination"
        v-model:current-page="campusStore.pageInfo.page"
        v-model:page-size="campusStore.pageInfo.size"
        :page-sizes="[10, 20, 30, 40, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="campusStore.total"
        @size-change="campusStore.paginationhandle"
        @current-change="campusStore.paginationhandle"
      />
    </div>
  </el-card>
</template>

<style lang="scss" scoped>
.campus_container {
  .campus_container_header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
@/stores/campus/campus
