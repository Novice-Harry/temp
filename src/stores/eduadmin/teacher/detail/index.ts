import { reactive, ref } from 'vue'
import { defineStore } from 'pinia'

import type { FormInstance, FormRules, UploadProps } from 'element-plus'

import { eduadminApis, getRoleListApi } from '@/api'
import type {
  IAllCampusItem,
  IClassesItemByTeacherId,
  IRoleListItem
} from '@/utils/type'

export const useTeacherDetailStore = defineStore('teacherDetail', () => {
  // 教师id
  const id = ref(-1)
  // 教师信息
  const info = ref({
    teName: '',
    tePhone: '',
    photo: '',
    info: ''
  })
  // 骨架屏加载状态
  const loading = ref(true)
  // 是否是从列表页点击编辑来的
  const idFromList = ref(false)
  // 添加/编辑表单dialog的显示隐藏
  const dialogVisible = ref(false)
  // 编辑表单
  const dialogForm = ref({
    teName: '',
    tePhone: '',
    roleId: -1,
    photo: '',
    info: '',
    password: '',
    campId: -1
  })
  // 表单的校验规则
  const dialogFormRules = reactive<FormRules>({
    teName: [{ required: true, message: '请输入教师姓名', trigger: 'blur' }],
    tePhone: [
      { required: true, message: '请输入教师手机号', trigger: 'blur' },
      {
        pattern: /^(?:(?:\+|00)86)?1\d{10}$/,
        message: '手机号格式不合法',
        trigger: 'blur'
      }
    ],
    password: [
      { required: true, message: '请输入登录密码', trigger: 'blur' },
      { min: 5, max: 15, message: '密码长度应为 5 - 15 位', trigger: 'blur' }
    ],
    roleId: [{ required: true, message: '请选择角色', trigger: 'blur' }],
    campId: [{ required: true, message: '请选择校区', trigger: 'blur' }]
  })
  // 校区列表
  const allCampus = ref<IAllCampusItem[]>([])
  // 获取对应id的教师信息
  const getTeacherInfo = async (newId?: number) => {
    if (newId) {
      id.value = newId
    }
    const res = await eduadminApis.teachersApis.getTeacherInfoByIdApi(id.value)
    info.value.teName = res.data.teName
    info.value.tePhone = res.data.tePhone
    info.value.photo = res.data.photo
    info.value.info = res.data.info
    // 数据回填
    dialogForm.value.teName = res.data.teName
    dialogForm.value.tePhone = res.data.tePhone
    dialogForm.value.photo = res.data.photo
    dialogForm.value.info = res.data.info
    dialogForm.value.roleId = res.data.roleId
    dialogForm.value.password = res.data.password
    dialogForm.value.campId = res.data.campId
    imageUrl.value = res.data.photo
    // 骨架屏结束
    loading.value = false
    // 直接获取下负责的班级
    getClassesByTeacherId()
    // 判断下是否是从列表页点击编辑来的
    if (idFromList.value) {
      idFromList.value = false
      dialogVisible.value = true
    }
  }
  // 获取校区列表
  const getCampusList = async () => {
    const res = await eduadminApis.getAllCampusApi()
    allCampus.value = res.data
  }
  // 角色说明
  const roleList = ref<IRoleListItem[]>([])
  // 老师负责班级详情
  const tableList = ref<IClassesItemByTeacherId[]>([])
  // 获取角色说明
  const getRoles = async () => {
    const res = await getRoleListApi()
    roleList.value = res.data
  }
  // 获取老师负责班级详情
  const getClassesByTeacherId = async () => {
    const res = await eduadminApis.teachersApis.getClassesByTeacherIdApi(
      id.value
    )
    tableList.value = res.data
  }
  // 图片展示路径
  const imageUrl = ref('')
  // 上传成功
  const handleAvatarSuccess: UploadProps['onSuccess'] = (
    response,
    uploadFile
  ) => {
    imageUrl.value = URL.createObjectURL(uploadFile.raw!)
    dialogForm.value.photo = response.data
    btnDisabled.value = false
  }
  // 上传前的判断
  const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
    if (rawFile.type !== 'image/jpeg') {
      ElMessage.error('当前只支持 JPG 格式!')
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
  const handleAvatarError = () => {
    btnDisabled.value = false
  }
  // 提交
  const submitDialogForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate(async (valid) => {
      if (valid) {
        // 发送请求
        await eduadminApis.teachersApis.editTeacherApi({
          ...dialogForm.value,
          id: id.value
        })
        dialogVisible.value = false
        getTeacherInfo()
      }
    })
  }
  // 重置页面避免看到上次的内容
  const resetAll = () => {
    tableList.value = []
    loading.value = true
    info.value = {
      teName: '',
      tePhone: '',
      photo: '',
      info: ''
    }
    id.value = -1
    dialogForm.value = {
      teName: '',
      tePhone: '',
      roleId: -1,
      photo: '',
      info: '',
      password: '',
      campId: -1
    }
  }
  return {
    info,
    loading,
    idFromList,
    dialogVisible,
    dialogForm,
    dialogFormRules,
    allCampus,
    getTeacherInfo,
    getCampusList,
    roleList,
    tableList,
    getRoles,
    getClassesByTeacherId,
    imageUrl,
    handleAvatarSuccess,
    beforeAvatarUpload,
    btnDisabled,
    handleAvatarProgress,
    handleAvatarError,
    submitDialogForm,
    resetAll
  }
})
