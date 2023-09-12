<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'

const list = ref<any[]>([])
const total = ref(0)
const getListParams = reactive({
  page: 1,
  size: 5
})
const getList = async () => {
  await 1
  list.value = []
}

onMounted(() => {
  getList()
})
</script>

<template>
  <el-card>
    <template #header>
      <div style="font-size: 14px">北京走向未来</div>
    </template>
    <div class="box">
      <div>总学豆 {{ 200 }}</div>
      <div>剩余学豆 {{ 150 }}</div>
      <div>已用学豆 {{ 50 }}</div>
    </div>
  </el-card>
  <el-card class="list">
    <template #header>
      <div class="top">
        <div class="title">列表</div>
      </div>
    </template>
    <el-table :data="list">
      <el-table-column label="序号" type="index" width="70" />
      <el-table-column label="操作人" prop="" />
      <el-table-column label="操作时间" prop="" />
      <el-table-column label="学豆数量" prop="" />
      <el-table-column label="备注" prop="" />
    </el-table>
    <div class="pagination_box">
      <el-pagination
        v-model:current-page="getListParams.page"
        v-model:page-size="getListParams.size"
        :page-sizes="[5, 10, 20, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="getList"
        @current-change="getList"
      />
    </div>
  </el-card>
</template>

<style lang="scss" scoped>
.box {
  display: flex;
  div {
    margin-right: 20px;
    font-size: 15px;
  }
}
.list {
  margin-top: 15px;
  .top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
  }
  .pagination_box {
    margin-top: 15px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
