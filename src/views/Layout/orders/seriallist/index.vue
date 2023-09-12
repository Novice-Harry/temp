<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
// import { useRouter, useRoute } from 'vue-router'
// const route = useRoute()
// const router = useRouter()

import type { CascaderOption, ElTable } from 'element-plus'

import { eduadminApis, ordersApis } from '@/api'
import { timeFormater } from '@/utils/format'
import type { ISerialListItem } from '@/utils/type'

// 头部搜索表单
const searchForm = reactive({
  subjectId: '',
  materialsId: '',
  status: '',
  type: '',
  code: '',
  serialNumber: '',
  phone: ''
})
// 获取列表请求参数
const listParams = reactive({
  page: 1,
  size: 5,
  subjectId: '',
  materialsId: '',
  status: '',
  type: '',
  code: '',
  serialNumber: '',
  phone: ''
})
// 搜索
const onSearch = () => {
  listParams.page = 1
  listParams.subjectId = searchForm.subjectId
  listParams.materialsId = searchForm.materialsId
  listParams.status = searchForm.status
  listParams.type = searchForm.type
  listParams.code = searchForm.code
  listParams.serialNumber = searchForm.serialNumber
  listParams.phone = searchForm.phone
  getSerlallist()
}
// 重置
const resetForm = () => {
  searchForm.subjectId = ''
  searchForm.materialsId = ''
  searchForm.status = ''
  searchForm.type = ''
  searchForm.code = ''
  searchForm.serialNumber = ''
  searchForm.phone = ''
  onSearch()
}
// 序列号清单列表
const serialList = ref<ISerialListItem[]>([])
// 序列号清单列表长度
const total = ref(0)
// 获取列表
const getSerlallist = async () => {
  let res = await ordersApis.serialListApis.getSerialListApi(listParams)
  serialList.value = res.data
  total.value = res.total
}
// 翻页器
const handlePaginationChange = () => {
  getSerlallist()
}
// 系列/教程级联框配置
const props = {
  expandTrigger: 'hover' as const,
  label: 'typeName',
  value: 'id'
}
// 级联框value
const cascaderValue = ref<string[]>([])
// 级联框change事件
const handleChange = () => {
  // 去赋值
  searchForm.materialsId = cascaderValue.value.at(-1) as string
}
// 级联框数据来源
const options = ref([])
// 获取数据源
const getCascaderOption = async () => {
  const res = await eduadminApis.studentsApis.getMaterialsApi()
  options.value = res.data
  // console.log(res)
}
onMounted(() => {
  getSerlallist()
  getCascaderOption()
})
// 对状态进行过滤
const filStatus = (status: number) => {
  // 状态ID 1.已使用 2.未使用 3.已到期
  switch (status) {
    case 1:
      return '已使用'
    case 2:
      return '未使用'
    case 3:
      return '已到期'
    default:
      return '未知状态'
  }
}
const multipleTableRef = ref<InstanceType<typeof ElTable>>()

const multipleSelection = ref<string>('')
// 表格复选框事件
const handleSelectionChange = (val: ISerialListItem[]) => {
  multipleSelection.value = val.map((item) => item.id).join(',')
}
// 导出
const exportData = async () => {
  if (multipleSelection.value === '') {
    return ElMessage.error('无选中项')
  }
  let res = await ordersApis.serialListApis.exportSerialListSelectedApi(
    multipleSelection.value
  )
  // console.log(res)
  const url = window.URL.createObjectURL(new Blob([res as unknown as BlobPart]))
  const link = document.createElement('a')
  link.style.display = 'none'
  link.href = url
  link.setAttribute('download', 'serialList.xlsx') // 需要文件名字
  document.body.appendChild(link)
  link.click()
  link.remove()
  multipleTableRef.value?.clearSelection()
}
</script>

<template>
  <el-card style="font-size: 14px; margin-bottom: 15px">
    北京展望未来培训学校
    <span style="margin-left: 20px"> 序列号（可用数量200/总数量 1000 ） </span>
  </el-card>
  <el-card>
    <el-form
      :inline="true"
      :model="searchForm"
      class="seriallist_searchform"
      label-width="80"
    >
      <el-form-item>
        <template #label><span style="color: red">科目</span></template>
        <el-select
          v-model="searchForm.subjectId"
          class="tsinput"
          placeholder="请选择科目"
        >
          <el-option label="中文" :value="1" />
          <el-option label="英文" :value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="系列/教材">
        <el-cascader
          v-model="cascaderValue"
          :options="options as CascaderOption[]"
          :props="props"
          placeholder="请选择系列/教材"
          style="width: 177px"
          @change="handleChange"
        />
        <!-- v-model="value"
          :options="options"
          :props="props"
          @change="handleChange" -->
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="searchForm.status" placeholder="请选择状态">
          <el-option label="已使用" :value="1" />
          <el-option label="未使用" :value="2" />
          <el-option label="已到期" :value="3" />
        </el-select>
      </el-form-item>
      <el-form-item label="类型">
        <el-select v-model="searchForm.type" placeholder="请选择类型">
          <el-option label="正式序列号" :value="1" />
          <el-option label="体验序列号" :value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="单号">
        <el-input v-model="searchForm.code" placeholder="请输入单号" />
      </el-form-item>
      <el-form-item label="序列号">
        <el-input
          v-model="searchForm.serialNumber"
          placeholder="请输入序列号"
        />
      </el-form-item>
      <el-form-item label="手机号">
        <el-input v-model="searchForm.phone" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item label="  ">
        <el-button color="#2eba78" @click="onSearch">
          <span style="color: white; font-weight: 600">搜索</span>
        </el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
  <el-card style="margin-top: 15px">
    <template #header>
      <div class="table_top">
        <span>列表</span>
        <div class="btnbox">
          <el-button color="#2eba78">
            <span style="color: white">激活序列号</span>
          </el-button>
          <el-button color="#2eba78" @click="exportData">
            <span style="color: white">导出</span>
          </el-button>
        </div>
      </div>
    </template>
    <el-table
      :data="serialList"
      ref="multipleTableRef"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column label="单号" prop="code"></el-table-column>
      <el-table-column label="序列号" prop="serialNumber"></el-table-column>
      <el-table-column label="教材" prop="materialsName"></el-table-column>
      <el-table-column prop="subjectId" width="80">
        <template #header><span style="color: red">科目</span></template>
        <template #default="{ row }">
          {{ row.subjectId === 1 ? '中文' : '英文' }}
        </template>
      </el-table-column>
      <el-table-column label="类型" prop="type">
        <template #default="{ row }">
          {{ row.type === 1 ? '正式序列号' : '体验序列号' }}
        </template>
      </el-table-column>
      <el-table-column label="学生" prop="studentName"></el-table-column>
      <el-table-column label="手机号" prop="phone"></el-table-column>
      <el-table-column label="状态" prop="status" width="80">
        <template #default="{ row }">
          {{ filStatus(row.status) }}
        </template>
      </el-table-column>
      <el-table-column label="剩余天数" prop="remainingDate" width="80">
      </el-table-column>
      <el-table-column label="操作人" prop="userName"></el-table-column>
      <el-table-column label="激活时间" prop="activationTime">
        <template #default="{ row }">
          {{ timeFormater(row.activationTime) }}
        </template>
      </el-table-column>
    </el-table>
    <div style="overflow: hidden; margin-top: 10px">
      <el-pagination
        style="float: right"
        v-model:current-page="listParams.page"
        v-model:page-size="listParams.size"
        :page-sizes="[5, 10, 20, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handlePaginationChange"
        @current-change="handlePaginationChange"
      />
    </div>
  </el-card>
</template>

<style lang="scss">
.tsinput input::placeholder {
  color: red !important;
}
</style>
<style lang="scss" scoped>
.seriallist_searchform {
  .el-select {
    width: 177px;
  }
}

.table_top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
