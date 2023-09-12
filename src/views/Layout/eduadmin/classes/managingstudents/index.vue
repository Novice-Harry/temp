<script lang="ts" setup>
import { onMounted, ref, reactive, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
const route = useRoute()
const router = useRouter()

import type { CascaderOption, ElTable, UploadFile } from 'element-plus'
import { UploadFilled } from '@element-plus/icons-vue'
import { read, utils } from 'xlsx'

import { eduadminApis } from '@/api'
import type { IAddStudentDataInClass, IClassInfo } from '@/utils/type'
import addStudents from './components/addStudents.vue'
import { timeFormater } from '@/utils/format'
// 当前班级id
const currentClassId = ref(-1)
currentClassId.value = route.params.id as unknown as number

watch(
  () => route.params.id,
  () => {
    if (route.params.id !== undefined) {
      currentClassId.value = route.params.id as unknown as number
      getCurrentClassInfo()
      getStudents()
    }
  }
)
// 班级信息
const currentClassInfo = ref<IClassInfo>({
  campId: 0,
  campName: '',
  classAssistant: '',
  classCode: '',
  classCount: 0,
  classCourse: '',
  classEndingTime: '',
  className: '',
  entryTime: '',
  headTeacherId: 0,
  headTeacherName: '',
  id: 0,
  isDeleted: 0,
  materialsId: 0,
  startTime: '',
  status: 0,
  subjectId: 0,
  subjectName: '',
  teacherId: 0,
  updateTime: ''
})
// 获取班级信息
const getCurrentClassInfo = async () => {
  const res = await eduadminApis.classesApis.getClassInfoById(
    currentClassId.value
  )
  currentClassInfo.value = res.data.data
  getStudentsData.campId = res.data.data.campId
  getStudentsData.classId = currentClassId.value
  getStudents()
}
// 请求班级参数
const getStudentsData = reactive({
  page: 1,
  size: 10,
  classId: -1,
  campId: -1
})

// 当前班级学生列表
const students = ref([])
// 当前班级学生列表总数
const total = ref(0)
// 获取当前班级
const getStudents = async () => {
  const res =
    await eduadminApis.classesApis.getStudentsByClassId(getStudentsData)
  students.value = res.data
  total.value = res.total
  getOtherClassesParams.classId = currentClassId.value
}
// 复选框表格实例
const multipleTableRef = ref<InstanceType<typeof ElTable>>()
// 复选框表格change事件
const handleSelectionChange = (val: any[]) => {
  studentIds.value = val.map((item) => item.id)
}
// 复选学生id列表
const studentIds = ref<number[]>([])
onMounted(() => {
  getCurrentClassInfo()
  getOptions()
  getCampList()
})
// 翻页
const paginationHandle = () => {
  getStudents()
}
// 调班相关
// 单选表格实例
const singleTableRef = ref<InstanceType<typeof ElTable>>()
// 系列/教程级联框配置
const props = {
  expandTrigger: 'hover' as const,
  label: 'typeName',
  value: 'id'
}
// 级联框数据源
const options = ref([])
// 获取教材级联框数据源
const getOptions = async () => {
  const res = await eduadminApis.studentsApis.getMaterialsApi()
  options.value = res.data
}
// 级联框value
const cascaderValue = ref<string[]>([])
// 级联框change事件
const handleChange = () => {
  // 去赋值
  if (cascaderValue.value) {
    searchForm.value.materialsId = cascaderValue.value.at(-1) as string
  }
}
// 校区列表
const campList = ref<any[]>([])
// 获取班级列表
const getCampList = async () => {
  const res = await eduadminApis.getAllCampusApi()
  campList.value = res.data
}
// 选班调班 班级列表 搜索条件表单
const searchForm = ref({
  campId: '',
  subjectId: '',
  materialsId: '',
  className: '',
  status: '',
  headTeacherName: ''
})
// 选班调班 班级列表 搜索条件
const getOtherClassesParams = reactive({
  classId: -1, // 当前班级id
  campId: '',
  subjectId: '',
  materialsId: '',
  className: '',
  status: '',
  headTeacherName: ''
})
// 选班调班 班级列表
const otherClasses = ref<any[]>([])
// 获取 选班调班 班级列表
const getOtherClasses = async () => {
  const res = await eduadminApis.studentsApis.getOtherClassesApi(
    getOtherClassesParams
  )
  otherClasses.value = res.data
}
// 选班调班部分
const changeClaassDialogVisible = ref(false)
// 呼出选班调班
const callChangeClaassDialog = async (studentId?: number) => {
  if (studentId) {
    studentIds.value = [studentId]
  }
  if (studentIds.value.length === 0) {
    ElMessage.error('未选择学生，无法调班')
    return
  }
  await onSearch()
  changeClaassDialogVisible.value = true
}
// 搜索
const onSearch = () => {
  getOtherClassesParams.campId = searchForm.value.campId
  getOtherClassesParams.subjectId = searchForm.value.subjectId
  getOtherClassesParams.materialsId = searchForm.value.materialsId
  getOtherClassesParams.className = searchForm.value.className
  getOtherClassesParams.status = searchForm.value.status
  getOtherClassesParams.headTeacherName = searchForm.value.headTeacherName
  getOtherClasses()
}
// 搜索重置
const resetSearch = () => {
  resetForm()
  onSearch()
}
// 期望转去的班级id
const newId = ref(-1)
// 表格单选事件
const handleCurrentChange = (val: any) => {
  if (val) {
    newId.value = val.id
  }
}
// 调班
const changeClass = async (formRef: any) => {
  if (newId.value === -1) {
    ElMessage.error('未选择班级，无法调班')
    return
  }
  await eduadminApis.classesApis.changeClassApi({
    classId: newId.value,
    studentIds: studentIds.value
  })

  // 选中的清空
  formRef?.setCurrentRow()
  multipleTableRef.value!.clearSelection()
  changeClaassDialogVisible.value = false
  getStudents()
  resetForm()
  // 问下要不要去新班级看看
  ElMessageBox.confirm('调班成功！！！是否立即查看？', '', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    center: true
  })
    .then(async () => {
      setTimeout(() => {
        newId.value = -1
      }, 100)
      router.replace('/eduadmin/managingstudents/' + newId.value)
    })
    .catch(() => {
      newId.value = -1
    })
}
// 重置表单
const resetForm = () => {
  searchForm.value = {
    campId: '',
    subjectId: '',
    materialsId: '',
    className: '',
    status: '',
    headTeacherName: ''
  }
}

// 添加学生相关
// 添加学生弹窗实例
const addStudentsRef = ref()
// 添加方法
const addStudent = async (data: IAddStudentDataInClass) => {
  // console.log(data)
  await eduadminApis.classesApis.addStudentInClassApi(
    data,
    currentClassId.value
  )
  // 跳到新添加的那条的页面
  getStudentsData.page = Math.ceil((total.value + 1) / getStudentsData.size)
  getStudents()
  addStudentsRef.value?.hide()
}

// 批量导入相关
// 批量导入dialog显示隐藏
const importStudentsDialogVisible = ref(false)
// 呼出批量导入dialog
const callImportStudentsDialog = () => {
  importStudentsDialogVisible.value = true
}
// 批量导入表格信息
const importStudentsTableData = ref([])
// 解析excel函数
const resolveXLSX = (uploadFile: UploadFile) => {
  const fileReader = new FileReader()
  fileReader.readAsArrayBuffer(uploadFile.raw as Blob)
  fileReader.onload = async (event) => {
    const fileData = event.target?.result
    const workbook = read(fileData, { type: 'binary' })
    const wsname: string = workbook.SheetNames[0]
    let jsonData = await utils.sheet_to_json(workbook.Sheets[wsname])
    if (jsonData.length <= 1) {
      ElMessage.error('表格无内容或格式有误')
      return
    }
    jsonData = jsonData.splice(1)
    jsonData.forEach((item: any) => {
      item.sex = item.sex === '男' ? 1 : 2
    })
    importStudentsTableData.value = importStudentsTableData.value.concat(
      jsonData as any
    )
    console.log(importStudentsTableData.value)
  }
}
// 上传
const importStudents = async () => {
  await eduadminApis.classesApis.addStudentsInClassApi({
    studentInformations: importStudentsTableData.value,
    classId: currentClassId.value
  })
  importStudentsTableData.value = []
  importStudentsDialogVisible.value = false
  // 这里去触发刷新
  // // 跳到新添加的那条的页面
  getStudentsData.page = Math.ceil((total.value + 1) / getStudentsData.size)
  getStudents()
}

// 模板下载
const downloadModal = async () => {
  const res = await eduadminApis.studentsApis.downloadModalApi()
  const url = window.URL.createObjectURL(new Blob([res as unknown as BlobPart]))
  const link = document.createElement('a')
  link.style.display = 'none'
  link.href = url
  link.setAttribute('download', 'student.xlsx') // 需要文件名字
  document.body.appendChild(link)
  link.click()
  link.remove()
}

// 移出班级
const quitClass = (id: number) => {
  ElMessageBox.confirm('移出班级后所学教材也将被清空', '', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    center: true
  })
    .then(async () => {
      await eduadminApis.classesApis.quitClassApi([id])
      getStudents()
    })
    .catch(() => {})
}
// 移出班级
const quitClassBatch = () => {
  ElMessageBox.confirm(
    '当前正在执行批量移出操作，移出班级后所学教材也将被清空',
    '',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      center: true
    }
  )
    .then(async () => {
      await eduadminApis.classesApis.quitClassApi(studentIds.value)
      multipleTableRef.value!.clearSelection()
      getStudents()
    })
    .catch(() => {})
}
</script>

<template>
  <el-card style="margin-bottom: 15px">
    <template #header>
      <el-skeleton :rows="0" v-if="!currentClassInfo.className" />
      <div class="classname" v-else>{{ currentClassInfo.className }}</div>
    </template>
    <el-skeleton :rows="2" v-if="!currentClassInfo.className" />
    <div class="infolist" v-else>
      <div class="infiitem">
        <el-text truncated>
          邀请码: <span>{{ currentClassInfo.classCode }}</span>
        </el-text>
      </div>
      <div class="infiitem">
        <el-text truncated>
          关联课程: <span>{{ currentClassInfo.classCourse }}</span>
        </el-text>
      </div>
      <div class="infiitem">
        <el-text truncated>
          所属校区: <span>{{ currentClassInfo.campName }}</span>
        </el-text>
      </div>
      <div class="infiitem">
        <el-text truncated>
          班主任: <span>{{ currentClassInfo.headTeacherName }}</span>
        </el-text>
      </div>
      <div class="infiitem">
        <el-text truncated>
          助教: <span>{{ currentClassInfo.classAssistant }}</span>
        </el-text>
      </div>
      <div class="infiitem">
        <el-text truncated>
          班级人数: <span>{{ currentClassInfo.classCount }}</span>
        </el-text>
      </div>
      <div class="infiitem">
        <el-text truncated>
          开课时间: <span>{{ currentClassInfo.startTime }}</span></el-text
        >
      </div>
      <div class="infiitem">
        <el-text truncated>
          结课时间: <span>{{ currentClassInfo.classEndingTime }}</span>
        </el-text>
      </div>
      <div class="infiitem">
        <el-text truncated>
          结课状态:
          <span>{{ currentClassInfo.status === 1 ? '未结课' : '已结课' }}</span>
        </el-text>
      </div>
    </div>
  </el-card>
  <el-card style="margin-bottom: 15px">
    <template #header>
      <div class="top">
        <div>列表</div>
        <div class="btns">
          <el-button color="#13bc75" @click="quitClassBatch">
            <span style="color: white; font-weight: 600">批量移出</span>
          </el-button>
          <el-button color="#13bc75" @click="callChangeClaassDialog()">
            <span style="color: white; font-weight: 600">批量调班</span>
          </el-button>
          <el-button color="#13bc75" @click="addStudentsRef.show()">
            <span style="color: white; font-weight: 600">添加学生</span>
          </el-button>
          <el-button color="#13bc75" @click="callImportStudentsDialog">
            <span style="color: white; font-weight: 600">批量导入</span>
          </el-button>
          <el-button color="#13bc75" @click="downloadModal">
            <span style="color: white; font-weight: 600">模板下载</span>
          </el-button>
        </div>
      </div>
    </template>
    <el-table
      ref="multipleTableRef"
      :data="students"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" />
      <el-table-column label="学生姓名" prop="stuName" width="90" />
      <el-table-column label="学生ID" prop="id" width="70" />
      <el-table-column label="联系方式" prop="phone" />
      <el-table-column label="性别" prop="sex" width="80">
        <template #default="{ row }">
          {{ row.sex === 1 ? '男' : '女' }}
        </template>
      </el-table-column>
      <el-table-column label="出生日期" prop="startDate" />
      <el-table-column label="入班时间" prop="enrolTime">
        <template #default="{ row }">
          {{ timeFormater(row.enrolTime) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" prop="">
        <template #default="{ row }">
          <el-button
            link
            type="success"
            @click="callChangeClaassDialog(row.id)"
          >
            选班调班
          </el-button>
          <el-button link type="danger" @click="quitClass(row.id)">
            移出班级
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div
      style="
        width: 100%;
        display: flex;
        justify-content: flex-end;
        margin-top: 15px;
      "
    >
      <el-pagination
        v-model:current-page="getStudentsData.page"
        v-model:page-size="getStudentsData.size"
        :page-sizes="[10, 20, 30, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="paginationHandle"
        @current-change="paginationHandle"
      />
    </div>
  </el-card>
  <addStudents ref="addStudentsRef" @on-submit="addStudent" />
  <!-- 批量导入学生 -->
  <el-dialog
    v-model="importStudentsDialogVisible"
    title="批量导入学生"
    :close-on-click-modal="false"
    width="1000"
  >
    <div v-if="importStudentsTableData.length === 0" class="importstudents">
      <el-upload
        class="upload-demo"
        drag
        :on-change="resolveXLSX"
        :auto-upload="false"
        :limit="1"
      >
        <el-icon class="el-icon--upload">
          <upload-filled />
        </el-icon>
        <div class="el-upload__text">
          将文件拖拽至此 或<em>点击这里</em> 进行上传
        </div>
      </el-upload>
    </div>
    <div v-else class="importstudentstable">
      <el-table
        ref="multipleTableRef"
        :data="importStudentsTableData"
        style="width: 100%"
      >
        <el-table-column property="stuName" label="学生姓名" />
        <el-table-column property="phone" label="联系方式" />
        <el-table-column property="startDate" label="出生日期" />
        <el-table-column property="sex" label="性别" />
        <el-table-column property="enrolTime" label="入校时间" />
        <el-table-column property="address" label="地区" />
        <el-table-column property="publicSchool" label="公立校" />
        <el-table-column property="campName" label="校区名称" />
        <el-table-column property="wx" label="微信号" />
        <el-table-column property="schoolTime" label="在校时间" />
      </el-table>
    </div>
    <template #footer>
      <div class="dialog_footer">
        <el-button size="large" color="#2eba78" @click="importStudents">
          <span style="color: white">批量上传</span>
        </el-button>
        <el-button size="large" @click="importStudentsDialogVisible = false">
          取消
        </el-button>
      </div>
    </template>
  </el-dialog>
  <!-- 调班 -->
  <!-- 选班调班 -->
  <el-dialog
    v-model="changeClaassDialogVisible"
    :show-close="false"
    width="1000"
  >
    <el-card class="classes_top" style="margin-bottom: 15px">
      <el-form :inline="true" :model="searchForm" label-width="80px">
        <el-form-item label="校区筛选">
          <el-select
            v-model="searchForm.campId"
            placeholder="请选择校区"
            style="width: 177px"
          >
            <el-option label="全部校区" value="" />
            <el-option
              v-for="item in campList"
              :key="item.id"
              :label="item.campName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <template #label><span style="color: red">科目</span></template>
          <el-select
            placeholder="请选择科目"
            style="width: 177px"
            v-model="searchForm.subjectId"
            class="tsinput"
          >
            <el-option label="全部科目" value="" />
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
        </el-form-item>
        <el-form-item label="班级名称">
          <el-input
            v-model="searchForm.className"
            placeholder="请输入班级名称"
          />
        </el-form-item>
        <el-form-item label="结课状态">
          <el-select
            placeholder="请选择节课状态"
            style="width: 177px"
            v-model="searchForm.status"
          >
            <el-option label="未结课" :value="1" />
            <el-option label="已节课" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="班主任">
          <el-input
            v-model="searchForm.headTeacherName"
            placeholder="请输入教师姓名"
          />
        </el-form-item>
        <el-form-item>
          <template #label><span> </span></template>
          <el-button color="#2eba78" @click="onSearch">
            <span style="color: white">搜索</span>
          </el-button>
          <el-button @click="resetSearch"> 重置 </el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="classes_container">
      <el-table
        ref="singleTableRef"
        highlight-current-row
        :data="otherClasses"
        style="width: 100%"
        @current-change="handleCurrentChange"
      >
        <el-table-column prop="className" label="班级姓名" />
        <el-table-column prop="campName" label="所属校区" />
        <el-table-column prop="headTeacherName" label="班主任" />
        <el-table-column prop="classCourse" label="关联课程" />
        <el-table-column prop="subjectName">
          <template #header><span style="color: red">科目</span></template>
        </el-table-column>
        <el-table-column label="结课状态">
          <template #default="{ row }">
            {{ row.status === 1 ? '未结课' : '已结课' }}
          </template>
        </el-table-column>
        <el-table-column prop="classEndingTime" label="结课时间" />
        <el-table-column prop="classCount" label="班级人数" />
      </el-table>
    </el-card>
    <template #footer>
      <div class="dialog_footer">
        <el-button
          size="large"
          color="#2eba78"
          @click="changeClass(singleTableRef)"
        >
          <span style="color: white">确定</span>
        </el-button>
        <el-button size="large" @click="changeClaassDialogVisible = false">
          取消
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
.top {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dialog_footer {
  text-align: center;

  .el-button {
    width: 130px;
    margin: 0 20px;
  }
}

.infolist {
  display: flex;
  flex-wrap: wrap;

  .infiitem {
    width: 200px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    margin-bottom: 10px;
    font-size: 14px;
    padding-left: 20px;
  }
}
</style>
