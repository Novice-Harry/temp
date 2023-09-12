<script lang="ts" setup>
import { ref, reactive } from 'vue'

import { useCommonStore } from '@/stores/common'
import type { FormInstance, FormRules, UploadProps } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
const commonStore = useCommonStore()

const emit = defineEmits(['onSubmit'])

// 添加表单dialog的显示隐藏
const addStudentDialogVisible = ref(false)
// 添加表单的实例
const dialogFormRef = ref<FormInstance>()
// 添加表单
const dialogForm = reactive({
  stuName: '',
  phone: '',
  startDate: '',
  sex: '',
  address: '',
  publicSchool: '',
  photo: ''
})
// 添加表单的校验规则
const dialogFormRules = reactive<FormRules>({
  stuName: [{ required: true, message: '请输入学生姓名', trigger: 'blur' }],
  phone: [
    { required: true, message: '请输入学生手机号', trigger: 'blur' },
    {
      pattern: /^(?:(?:\+|00)86)?1\d{10}$/,
      message: '手机号格式不合法',
      trigger: 'blur'
    }
  ],
  startDate: [{ required: true, message: '请选择出生日期', trigger: 'blur' }],
  sex: [{ required: true, message: '请选择性别', trigger: 'blur' }],
  campId: [{ required: true, message: '请选择校区', trigger: 'blur' }]
})
// 重置新建表单
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  // 恢复表单
  dialogForm.stuName = ''
  dialogForm.sex = ''
  dialogForm.phone = ''
  dialogForm.startDate = ''
  formEl.resetFields()
  dialogForm.address = ''
  dialogForm.publicSchool = ''
  dialogForm.photo = ''
  imageUrl.value = ''
}
// 表单用于显示的路径
const imageUrl = ref('')
// 上传成功的回调
const handleAvatarSuccess: UploadProps['onSuccess'] = (
  response,
  uploadFile
) => {
  imageUrl.value = URL.createObjectURL(uploadFile.raw!)
  btnDisabled.value = false
  dialogForm.photo = response.data
}
// 图片校验
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (rawFile.type !== 'image/jpeg') {
    ElMessage.error('图片格式只支持JPG')
    return false
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('图片大小不超过 2MB!')
    return false
  }
  return true
}
// 这些是确保图片上传完成前数据被提交上去
const btnDisabled = ref(false)
const handleAvatarProgress = () => {
  btnDisabled.value = true
}
// 上传失败
const handleAvatarError = () => {
  btnDisabled.value = false
}
// 提交
const submitDialogForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid) => {
    if (valid) {
      addStudent()
    }
  })
}
// 添加学生
const addStudent = async () => {
  // await eduadminApis.studentsApis.addStudentApi(dialogForm)
  // 去触发事件submit
  emit('onSubmit', dialogForm)
  // addStudentDialogVisible.value = false
  // // 恢复表单
  // dialogForm.stuName = ''
  // dialogForm.sex = ''
  // dialogForm.phone = ''
  // dialogForm.startDate = ''
  // resetForm(dialogFormRef.value)
  // dialogForm.address = ''
  // dialogForm.publicSchool = ''
  // dialogForm.photo = ''
  // imageUrl.value = ''
  // // 跳到新添加的那条的页面
  // .page = Math.ceil((total.value + 1) / studentsQuery.size)
  // getStudents()
}

// 向外暴露的方法
// 显示弹窗
const show = () => {
  addStudentDialogVisible.value = true
}
// 隐藏
const hide = () => {
  addStudentDialogVisible.value = false
  resetForm(dialogFormRef.value)
}
defineExpose({
  show,
  hide
})
</script>

<template>
  <el-dialog v-model="addStudentDialogVisible" width="600" title="添加学生">
    <div class="dialogformbox">
      <el-form
        :model="dialogForm"
        ref="dialogFormRef"
        :rules="dialogFormRules"
        label-width="100"
        label-position="left"
      >
        <el-form-item label="学生姓名" prop="stuName">
          <el-input v-model="dialogForm.stuName" placeholder="请输入学生姓名" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="dialogForm.phone" placeholder="请输入学生手机号" />
        </el-form-item>
        <el-form-item label="出生日期" prop="startDate">
          <el-date-picker
            v-model="dialogForm.startDate"
            type="date"
            placeholder="请选择日期"
            style="width: 100%"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-radio-group v-model="dialogForm.sex" class="ml-4">
            <el-radio :label="1" size="large">男</el-radio>
            <el-radio :label="2" size="large">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="头像">
          <el-upload
            class="avatar-uploader"
            :action="commonStore.uploadUrl"
            :headers="commonStore.uploadHeader"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            :on-progress="handleAvatarProgress"
            :on-error="handleAvatarError"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon">
              <Plus />
            </el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="地区">
          <el-input v-model="dialogForm.address" placeholder="请输入地区" />
        </el-form-item>
        <el-form-item label="公立校">
          <el-input
            v-model="dialogForm.publicSchool"
            placeholder="请输入公立校"
          />
        </el-form-item>
      </el-form>
    </div>

    <template #footer>
      <div class="dialog_footer">
        <el-button
          size="large"
          color="#2eba78"
          @click="submitDialogForm(dialogFormRef)"
          :disabled="btnDisabled"
        >
          <span style="color: white">确定</span>
        </el-button>
        <el-button size="large" @click="addStudentDialogVisible = false">
          取消
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
.dialogformbox {
  padding: 10px 30px;
}

.dialog_footer {
  text-align: center;

  .el-button {
    width: 130px;
    margin: 0 20px;
  }
}

.avatar-uploader .avatar {
  width: 100px;
  height: 100px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  text-align: center;
}
</style>
