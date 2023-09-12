<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'

import { eduadminApis, ordersApis } from '@/api'
import type { CascaderOption } from 'element-plus'

// 请求参数
const getListParams = reactive({
  page: 1,
  size: 10,
  typeId: '',
  subjectId: ''
})
// 获取教材列表
const getList = async () => {
  const res = await ordersApis.textBookApis.getTextBookListApi(getListParams)
  // console.log(res.data)
  list.value = res.data
}
const list = ref([])
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
  searchForm.typeId = cascaderValue.value.at(-1) as string
}
// 级联框数据来源
const options = ref([])
// 获取数据源
const getCascaderOption = async () => {
  const res = await eduadminApis.studentsApis.getMaterialsApi()
  options.value = res.data
  // console.log(res)
}
// 搜索表单
const searchForm = reactive({
  typeId: '',
  subjectId: ''
})
// 搜索
const onSearch = () => {
  getListParams.subjectId = searchForm.subjectId
  getListParams.typeId = searchForm.typeId
  getList()
}
// 重置
const onReset = () => {
  if (searchForm.subjectId || searchForm.typeId) {
    searchForm.subjectId = ''
    searchForm.typeId = ''
    getListParams.subjectId = searchForm.subjectId
    getListParams.typeId = searchForm.typeId
    getList()
  }
}
onMounted(() => {
  getList()
  getCascaderOption()
})
// 导出excel
const exportExcel = async () => {
  const res = await ordersApis.textBookApis.exportExcelApi()
  // console.log(res)
  const url = window.URL.createObjectURL(new Blob([res as unknown as BlobPart]))
  const link = document.createElement('a')
  link.style.display = 'none'
  link.href = url
  link.setAttribute('download', 'textbooks.xlsx') // 需要文件名字
  document.body.appendChild(link)
  link.click()
  link.remove()
}
// 购买
const buyMetiral = () => {
  ElMessageBox({
    title: '提示',
    confirmButtonText: '确认',
    dangerouslyUseHTMLString: true,
    message: `
    暂不支持线上购买教材，请联系您的专属商务人员<br />
    天蓝蓝 13811659410
    `
  })
}
</script>

<template>
  <el-card class="searchbox">
    <el-form inline>
      <el-form-item>
        <template #label><span style="color: red">科目</span></template>
        <el-select class="search-select" v-model="searchForm.subjectId">
          <el-option label="中文" :value="1" />
          <el-option label="英文" :value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="教材/单元">
        <el-cascader
          v-model="cascaderValue"
          :options="options as CascaderOption[]"
          :props="props"
          placeholder="请选择系列/教材"
          style="width: 177px"
          @change="handleChange"
        />
      </el-form-item>
      <el-form-item>
        <el-button color="#2eba78" @click="onSearch">
          <span style="color: white">搜索</span>
        </el-button>
        <el-button @click="onReset">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
  <el-card>
    <template #header>
      <div class="listtop">
        <div class="title">教材列表</div>
        <el-button color="#2eba78" @click="exportExcel">
          <span style="color: white">导出</span>
        </el-button>
      </div>
    </template>
    <el-table :data="list">
      <el-table-column label="教材ID" prop="id" width="90" />
      <el-table-column label="教材封面" prop="">
        <template #default="{ row }">
          <el-image
            style="width: 60px; height: 80px"
            :src="row.materialsPhoto"
            :zoom-rate="1.2"
            :preview-src-list="[row.materialsPhoto]"
            :initial-index="0"
            fit="cover"
          />
        </template>
      </el-table-column>
      <el-table-column label="教材名称" prop="materialsName"></el-table-column>
      <el-table-column label="所属系列" prop="serialNumber"></el-table-column>
      <el-table-column>
        <template #header><span style="color: red">科目</span></template>
        <template #default="{ row }">
          <span style="color: red">
            {{ row.subjectId === 1 ? '中文' : '英文' }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="班级数量" prop="classNum" />
      <el-table-column label="学员数量" prop="studentNum" />
      <el-table-column label="操作">
        <template #default>
          <el-button color="#d7d7d7" @click="buyMetiral">
            <span style="color: white">购买教程</span>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<style lang="scss" scoped>
.searchbox {
  margin-bottom: 15px;
}

.listtop {
  display: flex;
  align-items: center;
  justify-content: space-between;

  .title {
    font-size: 14px;
  }
}

.pagination_box {
  margin-top: 15px;
  display: flex;
  justify-content: end;
}
</style>
<style lang="scss">
.search-select {
  input::placeholder {
    color: red;
  }
}
</style>
