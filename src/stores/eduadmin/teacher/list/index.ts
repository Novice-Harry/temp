import { reactive, ref } from 'vue'
import { defineStore } from 'pinia'

import { eduadminApis, getRoleListApi } from '@/api'
import type {
  IAllCampusItem,
  IGetTaechersData,
  IRoleListItem
} from '@/utils/type'
import type { FormInstance, FormRules, UploadProps } from 'element-plus'

export const useTeacherStore = defineStore('teacherlist', () => {
  // 顶部搜索表单
  const teachersForm = reactive({
    campusId: '',
    teacher: ''
  })
  // 获取教师列表请求数据
  const teachersQuery = reactive<IGetTaechersData>({
    campId: '',
    nameOrPhone: '',
    page: 1,
    size: 10
  })
  // 教师总数
  const total = ref(0)
  // 教师列表
  const teacherList = ref([])
  // 校区列表
  const allCampus = ref<IAllCampusItem[]>([])
  // 搜索
  const onSearch = () => {
    teachersQuery.page = 1
    teachersQuery.campId = teachersForm.campusId
    teachersQuery.nameOrPhone = teachersForm.teacher
    getTeachers()
  }
  // 分页器回调
  const paginationhandle = () => {
    getTeachers()
  }
  // 获取教师列表
  const getTeachers = async () => {
    const res = await eduadminApis.teachersApis.getTaechersApi(teachersQuery)
    total.value = res.total
    teacherList.value = res.data
  }
  // 获取校区列表
  const getCampusList = async () => {
    const res = await eduadminApis.getAllCampusApi()
    allCampus.value = res.data
  }
  // 根据id获取角色名
  const getRoleName = (id: number) => {
    const obj = explainData.value.find((item) => item.id === id)
    return obj?.rname
  }
  // 删除
  const deleteTeacher = (id: number) => {
    ElMessageBox.confirm(
      '此教师是未结课班级的班主任，请先变更相应班级的班主任后，再进行删除教师操作！',
      '',
      {
        confirmButtonText: '仍要删除',
        cancelButtonText: '取消',
        center: true
      }
    )
      .then(async () => {
        await eduadminApis.teachersApis.deleteTeacherApi(id)
        getTeachers()
      })
      .catch(() => {})
  }
  // 角色说明
  const showExplain = ref(false)
  // 角色说明数据
  const explainData = ref<IRoleListItem[]>([])
  // 呼出角色说明
  const getRoles = async () => {
    const res = await getRoleListApi()
    explainData.value = res.data
  }
  // 添加表单dialog的显示隐藏
  const dialogVisible = ref(false)
  // 呼出添加教师
  const callDialog = (formEl: FormInstance | undefined) => {
    resetForm(formEl)
    imageUrl.value = ''
    dialogForm.value = {
      teName: '',
      tePhone: '',
      password: '',
      roleId: '',
      photo: '',
      info: '',
      campId: ''
    }
    dialogVisible.value = true
  }
  // 添加表单
  const dialogForm = ref({
    teName: '',
    tePhone: '',
    password: '',
    roleId: '',
    photo: '',
    info: '',
    campId: ''
  })
  // 添加表单的校验规则
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
    roleId: [{ required: true, message: '请选择角色', trigger: 'change' }],
    campId: [{ required: true, message: '请选择校区', trigger: 'change' }]
  })
  // 提交
  const submitDialogForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate((valid) => {
      if (valid) {
        // 发送请求
        addTeacher()
      }
    })
  }
  // 添加教师
  const addTeacher = async () => {
    await eduadminApis.teachersApis.addTeacherApi(dialogForm.value)
    dialogVisible.value = false
    teachersQuery.page = Math.ceil((total.value + 1) / teachersQuery.size)
    getTeachers()
  }
  // 重置新建表单
  const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.resetFields()
  }
  const imageUrl = ref('')
  const handleAvatarSuccess: UploadProps['onSuccess'] = (
    response,
    uploadFile
  ) => {
    imageUrl.value = URL.createObjectURL(uploadFile.raw!)
    dialogForm.value.photo = response.data
    btnDisabled.value = false
  }
  // 图片校验
  const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
    if (rawFile.type !== 'image/jpeg') {
      ElMessage.error('图片只支持 JPG 格式')
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
  return {
    teachersForm,
    teachersQuery,
    total,
    teacherList,
    allCampus,
    onSearch,
    paginationhandle,
    getTeachers,
    getCampusList,
    getRoleName,
    deleteTeacher,
    dialogVisible,
    showExplain,
    explainData,
    getRoles,
    callDialog,
    dialogForm,
    dialogFormRules,
    submitDialogForm,
    resetForm,
    imageUrl,
    handleAvatarSuccess,
    beforeAvatarUpload,
    btnDisabled,
    handleAvatarProgress,
    handleAvatarError
  }
})
