<script lang="ts" setup>
import { eduadminApis } from '@/api'
import type { IAllCampusItem, IAllTeachersItem, IClassForm } from '@/utils/type'
import type { CascaderOption, FormInstance, FormRules } from 'element-plus'
import { onMounted } from 'vue'
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const route = useRoute()
const router = useRouter()
// 当前班级id
const currentId = route.params.id as unknown as number
// 获取数据回显
const getClassInfo = async () => {
  // 前置 获取信息
  const res = await eduadminApis.classesApis.getClassInfoById(currentId)
  const data = res.data.data
  classForm.campId = data.campId
  classForm.className = data.className
  classForm.headTeacherId = data.headTeacherId
  classForm.materialsId = data.materialsId
  classForm.subjectId = data.subjectId
  classForm.teacherId = data.teacherId
  // 下面这块给级联选择器做回显
  let id = -1
  let pid = -1
  options.value.forEach((item: any) => {
    const target = item.children.find((v: any) => v.id === data.materialsId)
    if (target) {
      id = target.id
      pid = target.pid
    }
  })
  cascaderValue.value = [pid, id]
}

// 校区列表
const campList = ref<IAllCampusItem[]>([])
// 获取校区列表
const getCampList = async () => {
  let res = await eduadminApis.getAllCampusApi()
  campList.value = res.data
}
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
const cascaderValue = ref<any[]>([])
// 级联框change事件
const handleChange = () => {
  classForm.materialsId = cascaderValue.value.at(-1)
}
// 全部班主任
const headTeacherList = ref<IAllTeachersItem[]>([])
const getHeadTeacherList = async () => {
  let res = await eduadminApis.getAllHeadTeachersApi()
  headTeacherList.value = res.data
}
// 全部老师
const teacherList = ref<any[]>([])
const getTeacherList = async () => {
  let res = await eduadminApis.getAllTeachersApi()
  teacherList.value = res.data
}
// 表单实例
const classFormRef = ref<FormInstance>()
// 表单
const classForm = reactive<IClassForm>({
  className: '',
  subjectId: '',
  materialsId: '',
  headTeacherId: '',
  teacherId: '',
  campId: ''
})
// 校验
const rules = reactive<FormRules<IClassForm>>({
  className: [{ required: true, message: '请输入班级名称', trigger: 'blur' }],
  subjectId: [{ required: true, message: '请选择科目', trigger: 'blur' }],
  materialsId: [{ required: true, message: '请选择教材', trigger: 'blur' }],
  headTeacherId: [{ required: true, message: '请选择班主任', trigger: 'blur' }],
  teacherId: [{ required: true, message: '请选择老师', trigger: 'blur' }],
  campId: [{ required: true, message: '请选择校区', trigger: 'blur' }]
})

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid) => {
    if (valid) {
      ElMessageBox.confirm('升班后，将无法发布班级动态，您确定结课？', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        center: true
      })
        .then(async () => {
          // 在这里去提交
          await eduadminApis.classesApis.upgradeClassApi({
            ...classForm,
            id: currentId
          })
          router.back()
        })
        .catch(() => {
          ElMessage({ type: 'info', message: '用户取消操作' })
        })
    }
  })
}

onMounted(() => {
  getClassInfo()
  getCampList()
  getOptions()
  getHeadTeacherList()
  getTeacherList()
})
</script>

<template>
  <el-card>
    <template #header>
      <div class="top">
        <span>升班方向</span>
        <el-button link type="primary" @click="router.back()">返回</el-button>
      </div>
    </template>
    <el-form
      ref="classFormRef"
      :model="classForm"
      :rules="rules"
      label-width="120px"
      class="demo-classForm"
      style="width: 500px"
    >
      <el-form-item label="班级名称" prop="className">
        <el-input
          style="width: 90%"
          v-model="classForm.className"
          :maxlength="18"
          show-word-limit
          placeholder="请输入班级"
        />
      </el-form-item>
      <el-form-item label="所在校区" prop="campId">
        <el-select
          style="width: 90%"
          v-model="classForm.campId"
          placeholder="请选择校区"
        >
          <el-option
            v-for="item in campList"
            :key="item.id"
            :label="item.campName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="科目" prop="subjectId">
        <el-select
          style="width: 90%"
          v-model="classForm.subjectId"
          placeholder="请选择科目"
        >
          <el-option label="中文" :value="1" />
          <el-option label="英文" :value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="教材" prop="materialsId">
        <el-cascader
          style="width: 90%"
          v-model="cascaderValue"
          :options="options as CascaderOption[]"
          :props="props"
          placeholder="请选择系列/教材"
          @change="handleChange"
        />
      </el-form-item>
      <el-form-item label="班主任" prop="headTeacherId">
        <el-select
          style="width: 90%"
          v-model="classForm.headTeacherId"
          placeholder="请选择班主任"
        >
          <el-option
            v-for="item in headTeacherList"
            :key="item.id"
            :label="item.headTeacherName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="老师" prop="teacherId">
        <el-select
          v-model="classForm.teacherId"
          style="width: 90%"
          placeholder="请选择教师"
        >
          <el-option
            v-for="item in teacherList"
            :key="item.id"
            :label="item.teName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button color="#2eba78" @click="submitForm(classFormRef)">
          <span style="color: white">一键升班</span>
        </el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<style lang="scss" scoped>
.top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
