<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()

import type { CascaderOption } from 'element-plus'

import { eduadminApis } from '@/api'
import addDialog from './components/addDialog.vue'
import editDialog from './components/editDialog.vue'
import type {
  IAddClassData,
  IAllCampusItem,
  IAllTeachersItem,
  IEditClassData
} from '@/utils/type'

// 搜索框绑定数据
const searchForm = reactive({
  campId: '',
  className: '',
  subjectId: '',
  status: '',
  teacherName: '',
  materialsId: ''
})
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
  if (cascaderValue.value) {
    searchForm.materialsId = cascaderValue.value.at(-1) as string
  } else {
    searchForm.materialsId = ''
  }
}
// 班级列表请求参数
const classesQuery = reactive({
  page: 1,
  size: 5,
  campId: '',
  className: '',
  subjectId: '',
  status: '',
  teacherName: '',
  materialsId: ''
})
// 班级列表总数
const total = ref(0)
// 班级列表
const tableData = ref([])
// 搜索
const onSearch = () => {
  classesQuery.page = 1
  classesQuery.campId = searchForm.campId
  classesQuery.className = searchForm.className
  classesQuery.subjectId = searchForm.subjectId
  classesQuery.status = searchForm.status
  classesQuery.teacherName = searchForm.teacherName
  classesQuery.materialsId = searchForm.materialsId
  getClassList()
}
// 翻页
const paginationhandle = () => {
  getClassList()
}
// 获取班级列表
const getClassList = async () => {
  let res = await eduadminApis.classesApis.getClassesListApi(classesQuery)
  // console.log(res.data)
  tableData.value = res.data.records
  total.value = res.data.total
}
// 校区列表
const campList = ref<IAllCampusItem[]>([])
// 获取校区列表
const getCampList = async () => {
  let res = await eduadminApis.getAllCampusApi()
  campList.value = res.data
}
// 全部班主任
const headTeacherList = ref<IAllTeachersItem[]>([])
const getHeadTeacherList = async () => {
  let res = await eduadminApis.getAllHeadTeachersApi()
  headTeacherList.value = res.data
}
// 全部老师
const teacherList = ref<IAllTeachersItem[]>([])
const getTeacherList = async () => {
  let res = await eduadminApis.getAllTeachersApi()
  teacherList.value = res.data
}
// 级联框数据来源
const options = ref([])
// 获取级联框数据源
const getCascaderOption = async () => {
  const res = await eduadminApis.studentsApis.getMaterialsApi()
  options.value = res.data
}
onMounted(() => {
  getClassList()
  getCampList()
  getHeadTeacherList()
  getTeacherList()
  getCascaderOption()
})
// 删除
const deleteClass = (id: number) => {
  ElMessageBox.confirm('删除班级后，班级将解散，您确定删除班级？', '', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    center: true
  })
    .then(async () => {
      await eduadminApis.classesApis.deleteClassApi(id)
      getClassList()
    })
    .catch(() => {
      ElMessage({ type: 'info', message: '用户取消删除' })
    })
}
// 一键升班
const fastPromoteHandler = (id: number) => {
  ElMessageBox.confirm('升班后，将无法发布班级动态，您确定结课？', '', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    center: true
  })
    .then(async () => {
      // 跳转路由到 升班页面
      router.push('/eduadmin/upgrateclass/' + id)
    })
    .catch(() => {
      ElMessage({ type: 'info', message: '用户取消操作' })
    })
}
// 一键结课
const fastEndingClassHandler = (id: number) => {
  ElMessageBox.confirm('结课后，将无法发布班级动态，您确定结课？？', '', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    center: true
  })
    .then(async () => {
      await eduadminApis.classesApis.endingClassApi(id)
      getClassList()
    })
    .catch(() => {
      ElMessage({ type: 'info', message: '用户取消操作' })
    })
}
// 添加实例
const addRef = ref()
// 编辑实例
const editRef = ref()
// 添加班级
const addClass = async (data: IAddClassData) => {
  await eduadminApis.classesApis.addClassApi(data)
  addRef.value.hide()
  classesQuery.page = Math.ceil((total.value + 1) / classesQuery.size)
  getClassList()
}
// 呼出编辑
const callEdit = async (id: number) => {
  // 前置 获取信息
  const res = await eduadminApis.classesApis.getClassInfoById(id)
  editRef.value.show(res.data.data)
}
// 编辑班级
const editClass = async (data: IEditClassData) => {
  await eduadminApis.classesApis.editClassApi(data)
  editRef.value.hide()
  getClassList()
}
</script>

<template>
  <el-card class="classes_top">
    <el-form :inline="true" :model="searchForm" label-width="120px">
      <el-form-item label="校区筛选">
        <el-select placeholder="请选择校区" v-model="searchForm.campId">
          <el-option label="全部校区" value="" />
          <el-option
            v-for="item in campList"
            :key="item.id"
            :label="item.campName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="班级名称">
        <el-input v-model="searchForm.className" placeholder="请输入班级名称" />
      </el-form-item>
      <el-form-item>
        <template #label><span style="color: red">科目</span></template>
        <el-select placeholder="请选择科目" v-model="searchForm.subjectId">
          <el-option label="全部科目" value="" />
          <el-option label="中文" :value="1" />
          <el-option label="英文" :value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="系列/教材">
        <el-cascader
          v-model="cascaderValue"
          :options="options as CascaderOption[]"
          clearable
          :props="props"
          placeholder="请选择系列/教材"
          style="width: 177px"
          @change="handleChange"
        />
      </el-form-item>
      <el-form-item label="节课状态">
        <el-select placeholder="请选择节课状态" v-model="searchForm.status">
          <el-option label="全部" value="" />
          <el-option label="未结课" :value="1" />
          <el-option label="已节课" :value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="班主任">
        <el-select
          placeholder="请选择教师姓名"
          v-model="searchForm.teacherName"
        >
          <el-option label="全部" value="" />
          <el-option
            v-for="item in headTeacherList"
            :key="item.id"
            :label="item.headTeacherName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <template #label><span> </span></template>
        <el-button color="#2eba78" @click="onSearch">
          <span style="color: white">搜索</span>
        </el-button>
      </el-form-item>
    </el-form>
  </el-card>
  <el-card class="classes_container">
    <template #header>
      <div class="classes_container_header">
        <span>班级列表</span>
        <div>
          <el-button color="#2eba78" @click="addRef?.show()">
            <span style="color: white">新建班级</span>
          </el-button>
        </div>
      </div>
    </template>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="className" label="班级姓名" width="130" />
      <el-table-column prop="campName" label="所属校区" width="130" />
      <el-table-column prop="headTeacherName" label="班主任" width="100" />
      <el-table-column prop="classAssistant" label="助教" width="150" />
      <el-table-column prop="classCourse" label="关联课程" width="130" />
      <el-table-column prop="subjectName" width="80">
        <template #header><span style="color: red">科目</span></template>
        <template #default="{ row }">
          <span style="color: red">{{ row.subjectName }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="节课状态" width="80">
        <template #default="{ row }">
          {{ row.status === 1 ? '未结课' : '已结课' }}
        </template>
      </el-table-column>
      <el-table-column prop="classCount" label="班级人数" width="100" />
      <el-table-column prop="classCode" label="班级邀请码" width="100" />
      <el-table-column label="操作">
        <template #default="{ row }">
          <div
            class="form_btn form_btn_primary"
            @click="router.push('/eduadmin/managingstudents/' + row.id)"
          >
            学生管理
          </div>
          <el-dropdown>
            <div
              class="form_btn form_btn_primary"
              style="transform: translateY(5px)"
            >
              更多操作
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                  @click="router.push('/eduadmin/classcommunity/' + row.id)"
                >
                  班级动态
                </el-dropdown-item>
                <el-dropdown-item @click="callEdit(row.id)">
                  班级编辑
                </el-dropdown-item>
                <el-dropdown-item @click="fastPromoteHandler(row.id)">
                  一键升班
                </el-dropdown-item>
                <el-dropdown-item @click="fastEndingClassHandler(row.id)">
                  结课
                </el-dropdown-item>
                <el-dropdown-item @click="deleteClass(row.id)">
                  删除
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <div class="paginationbox">
      <el-pagination
        class="commonpagination"
        v-model:current-page="classesQuery.page"
        v-model:page-size="classesQuery.size"
        :page-sizes="[5, 10, 20, 30, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="paginationhandle"
        @current-change="paginationhandle"
      />
    </div>
  </el-card>
  <addDialog
    ref="addRef"
    :options="options"
    :headTeacherList="headTeacherList"
    :teacherList="teacherList"
    :campList="campList"
    @submit-form="addClass"
  />
  <editDialog
    ref="editRef"
    :options="options"
    :headTeacherList="headTeacherList"
    :teacherList="teacherList"
    :campList="campList"
    @submit-form="editClass"
  />
</template>

<style lang="scss" scoped>
.classes_top {
  margin-bottom: 15px;

  .el-select {
    width: 177px;
  }
}

.classes_container {
  .classes_container_header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}

// :deep(:focus-visible) {
//   outline: none;
// }

:deep(.el-tooltip__trigger:focus-visible) {
  outline: unset;
}
</style>
