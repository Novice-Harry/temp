import { reactive, ref } from 'vue'
import { defineStore } from 'pinia'

import { eduadminApis } from '@/api'
import type { FormInstance, FormRules, UploadProps } from 'element-plus'
import { studentsApis } from '@/api/eduadmin/students'

export const useStudentDetailStore = defineStore('studentDetail', () => {
  // 是否从列表页点击编辑来的
  const isFromStudent = ref(false)
  // 学生id
  const id = ref(-1)
  // 骨架屏加载状态
  const loading = ref(true)
  // 学生详情
  const detailData = reactive({
    data: {
      address: '',
      campId: -1,
      campName: null,
      enrolTime: '10000',
      id: -1,
      isDeleted: -1,
      lastLoginTime: '',
      phone: '',
      photo: '',
      publicSchool: '',
      schoolTime: -1,
      sex: 1,
      startDate: '',
      status: 2,
      stuName: '',
      wx: ''
    }
  })
  // 编辑表单dialog的显示隐藏
  const addStudentDialogVisible = ref(false)
  // 编辑表单
  const dialogForm = reactive({
    stuName: '',
    phone: '',
    startDate: '',
    sex: '',
    address: '',
    publicSchool: '',
    photo: '',
    wx: ''
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
  // 获取学生详情
  const getStudentInfo = async (newId?: number) => {
    if (newId) {
      id.value = newId
    }
    const res = await eduadminApis.studentsApis.getStudentByIdApi(id.value)

    detailData.data = res.data
    // console.log('回显', detailData.data)
    // console.log('res.data:', res.data)
    // 数据回填
    dialogForm.stuName = res.data.stuName
    dialogForm.phone = res.data.phone
    dialogForm.startDate = res.data.startDate
    dialogForm.sex = res.data.sex
    dialogForm.address = res.data.address
    dialogForm.publicSchool = res.data.publicSchool
    dialogForm.photo = res.data.photo
    dialogForm.wx = res.data.wx
    imageUrl.value = res.data.photo
    // 骨架屏结束
    loading.value = false

    if (isFromStudent.value) {
      addStudentDialogVisible.value = true
      isFromStudent.value = false
    }
  }
  const imageUrl = ref('')
  // 上传成功的回调
  const handleAvatarSuccess: UploadProps['onSuccess'] = (
    response,
    uploadFile
  ) => {
    imageUrl.value = URL.createObjectURL(uploadFile.raw!)
    dialogForm.photo = response.data
    btnDisabled.value = false
  }
  // 上传前校验
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
        eduadminApis.studentsApis.editStudentApi({
          ...dialogForm,
          id: id.value
        })
        addStudentDialogVisible.value = false
        setTimeout(() => {
          getStudentInfo()
        }, 1000)
        // console.log(`第1次获取`)
        // getStudentInfo()
        // console.log('三秒后重新获取')
        // setTimeout(() => {
        //   console.log(`第2次获取`)
        //   getStudentInfo()
        // }, 3000)
      }
    })
  }
  // 所在班级列表
  const classlist = ref([])
  // 获取班级列表
  const getClassInfo = async () => {
    const res = await eduadminApis.studentsApis.getClassInfoByStudentApi(
      id.value
    )
    if (res.data.length !== 0) {
      classlist.value = res.data
      getOtherClassesParams.classId = res.data[0].id
    } else {
      classlist.value = []
    }
  }
  // 所学教材
  const materials = ref<any[]>([])
  // 获取所学教材
  const getMateials = async () => {
    const res = await eduadminApis.studentsApis.getMaterialsInfoByStudentApi(
      id.value
    )
    materials.value = []
    if (res.data) {
      materials.value.push(res.data)
    }
  }
  // 绘本
  const meals = ref<any[]>([])
  // 获取绘本
  const getMeals = async () => {
    const res = await eduadminApis.studentsApis.getMealInfoByStudentApi(
      id.value
    )
    meals.value = []
    if (res.data !== null) {
      meals.value.push(res.data)
    }
  }
  // tabs绑定值
  const activeName = ref(1)

  // 选班调班 班级列表 搜索条件表单
  const searchForm = reactive({
    campId: '',
    subjectId: '',
    materialsId: '',
    className: '',
    status: '',
    headTeacherName: ''
  })
  // 校区列表
  const campList = ref<any[]>([])
  // 获取班级列表
  const getCampList = async () => {
    const res = await eduadminApis.getAllCampusApi()
    campList.value = res.data
  }
  // 级联框数据源
  const options = ref([])
  // 获取教材级联框数据源
  const getOptions = async () => {
    const res = await eduadminApis.studentsApis.getMaterialsApi()
    console.log(res)
    options.value = res.data
  }
  // 级联框value
  const cascaderValue = ref<string[]>([])
  // 级联框change事件
  const handleChange = () => {
    // 去赋值
    if (cascaderValue.value) {
      searchForm.materialsId = cascaderValue.value.at(-1) as string
    }
  }
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
  const callChangeClaassDialog = async () => {
    await getCampList()
    await getOptions()
    await getOtherClasses()
    changeClaassDialogVisible.value = true
  }
  // 搜索
  const onSearch = () => {
    getOtherClassesParams.campId = searchForm.campId
    getOtherClassesParams.subjectId = searchForm.subjectId
    getOtherClassesParams.materialsId = searchForm.materialsId
    getOtherClassesParams.className = searchForm.className
    getOtherClassesParams.status = searchForm.status
    getOtherClassesParams.headTeacherName = searchForm.headTeacherName
    getOtherClasses()
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
    await studentsApis.changeClassApi(id.value, newId.value)
    // 选中的清空
    formRef?.setCurrentRow()
    changeClaassDialogVisible.value = false
    newId.value = -1
    getClassInfo()
  }
  // 移出班级
  const quitClass = (classid: number) => {
    ElMessageBox.confirm('移出班级后所学教材也将被清空', '', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      center: true
    })
      .then(async () => {
        await eduadminApis.studentsApis.quitClassApi(id.value, classid)
        getClassInfo()
      })
      .catch(() => {})
  }
  return {
    isFromStudent,
    addStudentDialogVisible,
    detailData,
    loading,
    getStudentInfo,
    dialogForm,
    dialogFormRules,
    handleAvatarSuccess,
    beforeAvatarUpload,
    handleAvatarProgress,
    handleAvatarError,
    imageUrl,
    submitDialogForm,
    btnDisabled,
    classlist,
    getClassInfo,
    activeName,
    changeClaassDialogVisible,
    callChangeClaassDialog,
    getMateials,
    materials,
    meals,
    getMeals,
    otherClasses,
    getOtherClassesParams,
    onSearch,
    searchForm,
    handleCurrentChange,
    changeClass,
    quitClass,
    campList,
    options,
    cascaderValue,
    handleChange
  }
})
