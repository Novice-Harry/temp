<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

import addTrends from './components/addTrends.vue'
import editTrends from './components/editTrends.vue'
import showTrends from './components/showTrends.vue'
import listItem from './components/ListItem.vue'
import { eduadminApis } from '@/api'
import type { IEditTrendsData, ITrendsItem } from '@/utils/type'
// 班级动态请求参数
const getListParams = reactive({
  page: 1,
  size: 5,
  classId: 1
})
// 获取班级id
getListParams.classId = route.params.id as unknown as number

// 动态条数
const total = ref(0)
// 动态列表
const list = ref<ITrendsItem[]>([])
// 获取动态列表
const getList = async () => {
  const res = await eduadminApis.classesApis.getTrendsListApi(getListParams)
  // console.log(res)
  list.value = res.data
  total.value = res.total
}
// 当前班级信息
const currentClassInfo = reactive({
  classId: getListParams.classId,
  headTeacherId: -1,
  status: 2 // 结课状态
})
// 获取当前班级信息
const getClassInfo = async () => {
  const res = await eduadminApis.classesApis.getClassInfoById(
    getListParams.classId
  )
  // console.log(res.data.data)
  currentClassInfo.headTeacherId = res.data.data.headTeacherId
  currentClassInfo.status = res.data.data.status
}
onMounted(() => {
  getList()
  getClassInfo()
})
const paginationHandle = getList
// 添加动态组件实例
const addTrendsRef = ref<InstanceType<typeof addTrends>>()
// 呼出添加
const callAddTrends = () => {
  addTrendsRef.value?.show()
}
// 添加
const submitNewTrends = async (data: { title: string; content: string }) => {
  await eduadminApis.classesApis.addTrendsApi({
    ...data,
    classId: currentClassInfo.classId,
    headTeacherId: currentClassInfo.headTeacherId
  })
  // 通知组件关闭弹窗并重置
  addTrendsRef.value?.onSuccess()
  // 刷新 到新添加那条的页码
  getListParams.page = Math.ceil((total.value + 1) / getListParams.size)
  getList()
}
// 编辑动态组件实例
const editTrendsRef = ref<InstanceType<typeof editTrends>>()
// 呼出编辑
const callEditTrends = async (id: number) => {
  // 先去获取详情
  const res = await eduadminApis.classesApis.getTrendsInfoApi(id)
  editTrendsRef.value?.show(res.data)
}
// 编辑
const submitEditTrends = async (data: IEditTrendsData) => {
  await eduadminApis.classesApis.editTrendsApi(data)
  // 通知组件关闭弹窗并重置
  editTrendsRef.value?.onSuccess()
  // 刷新
  getList()
}

// 查看动态组件实例
const showTrendsRef = ref<InstanceType<typeof showTrends>>()
// 查看动态
const callShowTrends = async (id: number) => {
  // 先去获取详情
  const res = await eduadminApis.classesApis.getTrendsInfoApi(id)
  showTrendsRef.value?.show(res.data)
}

// 删除动态
const deleteTrends = async (id: number) => {
  console.log(id)
  ElMessageBox.confirm('删除动态不可恢复，是否继续？', '', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    center: true
  })
    .then(async () => {
      await eduadminApis.classesApis.deleteTrendsApi(id)
      // 刷新
      getList()
    })
    .catch(() => {
      ElMessage({ type: 'info', message: '用户取消删除' })
    })
}
</script>

<template>
  <el-card class="classcommunity_container">
    <template #header>
      <div class="classcommunity_container_header">
        <span>动态列表</span>
        <div>
          <el-button
            color="#2eba78"
            @click="callAddTrends"
            :disabled="currentClassInfo.status === 2"
          >
            <span style="color: white">发布班级动态</span>
          </el-button>
        </div>
      </div>
    </template>
    <template v-if="list.length > 0">
      <div class="list">
        <listItem
          v-for="item in list"
          :key="item.id"
          :data="item"
          @callShowTrends="callShowTrends"
          @callEditTrends="callEditTrends"
          @deleteTrends="deleteTrends"
        />
      </div>
      <div class="pager">
        <el-pagination
          v-model:current-page="getListParams.page"
          v-model:page-size="getListParams.size"
          :page-sizes="[5, 10, 20]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="paginationHandle"
          @current-change="paginationHandle"
        />
      </div>
    </template>
    <!-- 空列表 -->
    <el-empty v-else description="当前班级无动态，快来添加几条吧~" />
  </el-card>
  <addTrends ref="addTrendsRef" @on-submit="submitNewTrends" />
  <editTrends ref="editTrendsRef" @on-submit="submitEditTrends" />
  <showTrends ref="showTrendsRef" />
</template>

<style lang="scss" scoped>
.classcommunity_container_header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pager {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  margin-top: 15px;
}
</style>
