<script lang="ts" setup>
import { reactive, ref } from 'vue'

import type { CascaderOption, FormInstance, FormRules } from 'element-plus'
import type { IClassForm } from '@/utils/type'

defineProps(['options', 'headTeacherList', 'campList', 'teacherList'])
const emit = defineEmits(['submitForm'])

const dialogVisible = ref(false)
const title = ref('新建班级')
// 系列/教程级联框配置
const props = {
  expandTrigger: 'hover' as const,
  label: 'typeName',
  value: 'id'
}
// 级联框value
const cascaderValue = ref<any[]>([])
// 级联框change事件
const handleChange = () => {
  classForm.materialsId = cascaderValue.value.at(-1)
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
      await emit('submitForm', classForm)
    }
  })
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}

const show = () => {
  dialogVisible.value = true
}
const hide = () => {
  dialogVisible.value = false
  resetForm(classFormRef.value)
}
defineExpose({
  show,
  hide
})
</script>

<template>
  <el-dialog v-model="dialogVisible" :title="title" width="500">
    <el-form
      ref="classFormRef"
      :model="classForm"
      :rules="rules"
      label-width="120px"
      class="demo-classForm"
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
    </el-form>
    <template #footer>
      <div class="dialog_footer">
        <el-button
          size="large"
          color="#2eba78"
          @click="submitForm(classFormRef)"
        >
          <span style="color: white">确定</span>
        </el-button>
        <el-button size="large" @click="dialogVisible = false">
          取消
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
.dialog_footer {
  text-align: center;

  .el-button {
    width: 130px;
    margin: 0 20px;
  }
}
</style>
