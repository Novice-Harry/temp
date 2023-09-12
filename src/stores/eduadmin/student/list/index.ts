import { reactive, ref } from 'vue'
import router from '@/router'
import { defineStore } from 'pinia'

import type {
  FormInstance,
  FormRules,
  UploadFile,
  UploadProps
} from 'element-plus'
import { read, utils } from 'xlsx'

import { eduadminApis } from '@/api'
import type { IAllCampusItem, IStudent } from '@/utils/type'
import { useStudentDetailStore } from '@/stores/eduadmin/student/detail'

export const useStudentStore = defineStore('studentList', () => {
  // 顶部搜索框表单
  const studentsForm = reactive({
    campId: '',
    nameOrPhone: ''
  })
  // 列表请求参数
  const studentsQuery = reactive({
    campId: '',
    nameOrPhone: '',
    page: 1,
    size: 5
  })
  // 学生列表
  const tableData = ref<IStudent[]>([])
  // 列表长度
  const total = ref(0)
  // 获取学生列表
  const getStudents = async () => {
    const res = await eduadminApis.studentsApis.getStudentsApi(studentsQuery)
    tableData.value = res.data
    total.value = res.total
    // console.log(res.data)
  }
  // 搜索
  const onSearch = () => {
    studentsQuery.page = 1
    studentsQuery.campId = studentsForm.campId
    studentsQuery.nameOrPhone = studentsForm.nameOrPhone
    getStudents()
  }
  // 翻页器
  const paginationhandle = () => {
    getStudents()
  }
  // 校区列表
  const allCampus = ref<IAllCampusItem[]>([])
  // 获取校区列表
  const getCampusList = async () => {
    const res = await eduadminApis.getAllCampusApi()
    allCampus.value = res.data
  }
  // 删除
  const deleteStudent = (id: number) => {
    ElMessageBox.confirm(
      '此教师是未结课班级的班主任，请先变更相应班级的班主任后，再进行删除教师操作！',
      '',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        center: true
      }
    )
      .then(async () => {
        await eduadminApis.studentsApis.deleteStydentApi(id)
        getStudents()
      })
      .catch(() => {})
  }
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
    formEl.resetFields()
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
    await eduadminApis.studentsApis.addStudentApi(dialogForm)
    addStudentDialogVisible.value = false
    // 回复表单
    dialogForm.stuName = ''
    dialogForm.sex = ''
    dialogForm.phone = ''
    dialogForm.startDate = ''
    resetForm(dialogFormRef.value)
    dialogForm.address = ''
    dialogForm.publicSchool = ''
    dialogForm.photo = ''
    imageUrl.value = ''
    // 跳到新添加的那条的页面
    studentsQuery.page = Math.ceil((total.value + 1) / studentsQuery.size)
    getStudents()
  }
  // 去详情页并跳转
  const goEditStudent = async (id: number) => {
    const SDStore = useStudentDetailStore()
    SDStore.isFromStudent = true
    router.push('/eduadmin/students/' + id)
  }

  // 获取教材
  const getMaterials = async () => {
    const res = await eduadminApis.studentsApis.getMaterialsApi()
    jcOptions.value = res.data
  }

  // 教材Dialog显示隐藏
  const jcDialogVisible = ref(false)
  // AI课Dialog显示隐藏
  const AIDialogVisible = ref(false)
  // 绘本Dialog显示隐藏
  const hbDialogVisible = ref(false)
  // 呼出绘本dialog
  const callHBDialog = () => {
    hbDialogVisible.value = true
  }
  // 呼出教材dialog
  const callJCDialog = (id?: any) => {
    getMaterials()
    jcForm.value.subjectId = ''
    jcForm.value.materialsId = ''
    jcCascadeValue.value = []
    if (id) {
      jcForm.value.studentIds[0] = id
    }
    jcDialogVisible.value = true
  }
  // 呼出AIdialog
  const callAIDialog = (id?: any) => {
    getMaterials()
    jcForm.value.subjectId = ''
    jcForm.value.materialsId = ''
    jcCascadeValue.value = []
    if (id) {
      jcForm.value.studentIds[0] = id
    }
    AIDialogVisible.value = true
  }
  // 教材dialog表单
  const jcForm = ref({
    subjectId: '',
    materialsId: '',
    studentIds: [] as number[]
  })
  // 教材级联框value
  const jcCascadeValue = ref([])
  // 教材级联框数据源
  const jcOptions = ref([])
  // 教材级联框回调
  const handleJCChange = (value: any) => {
    jcForm.value.materialsId = value.at(-1)
  }
  // 激活教材和ai课的校验
  const commonValidation = () => {
    // 拦截下，确保参数
    if (jcForm.value.studentIds.length === 0) {
      ElMessage.error('未选择学生，无法激活')
      return false
    }
    if (jcForm.value.subjectId === '') {
      ElMessage.error('未选择科目，无法激活')
      return false
    }
    if (jcForm.value.materialsId === '') {
      ElMessage.error('未选择教材，无法激活')
      return false
    }
    return true
  }
  // 教材 批量/单个 激活
  const activeMaterials = async (formref: any) => {
    if (commonValidation()) {
      await eduadminApis.studentsApis.activeMaterialsApi(jcForm.value)
      jcDialogVisible.value = false
      // 这个用来把复选框回复
      formref.clearSelection()
    }
  }
  // 绘本dialog表单
  const hbForm = ref({
    studentIds: [],
    mealId: 1
  })
  // 绘本级联框value
  const hbCascadeValue = ref([])
  // 绘本级联框数据源
  const hbOptions = ref([])
  // 绘本级联框回调
  const handleHBChange = (value: any) => {
    console.log(value)
  }
  // 批量激活绘本
  const activePictureBook = async (formref: any) => {
    if (jcForm.value.studentIds.length === 0) {
      ElMessage.error('未选择学生')
      return
    }
    await eduadminApis.studentsApis.activatePictureBookApi({
      studentIds: jcForm.value.studentIds,
      mealId: hbForm.value.mealId
    })
    // 这个用来把复选框回复
    formref.clearSelection()
    hbDialogVisible.value = false
  }
  // AI课dialog表单
  const AIForm = ref({
    subjectId: '',
    materialsId: '',
    studentIds: [] as number[]
  })
  // AI课级联框value
  const AICascadeValue = ref([])
  // AI课级联框数据源
  const AIOptions = ref([])
  // AI课级联框回调
  const handleAIChange = (value: any) => {
    console.log(value)
  }
  // AI授课 批量/单个 激活
  const activateAiTeaching = async (formref: any) => {
    if (commonValidation()) {
      await eduadminApis.studentsApis.activateAiTeachingApi(jcForm.value)
      AIDialogVisible.value = false
      // 这个用来把复选框回复
      formref.clearSelection()
    }
  }
  // 下载模板
  const downloadModal = async () => {
    const res = await eduadminApis.studentsApis.downloadModalApi()
    // console.log(res)
    const url = window.URL.createObjectURL(
      new Blob([res as unknown as BlobPart])
    )
    const link = document.createElement('a')
    link.style.display = 'none'
    link.href = url
    link.setAttribute('download', 'student.xlsx') // 需要文件名字
    document.body.appendChild(link)
    link.click()
    link.remove()
  }
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
    await eduadminApis.studentsApis.importStudentsApi(
      importStudentsTableData.value
    )
    importStudentsTableData.value = []
    importStudentsDialogVisible.value = false
    // 跳到新添加的那条的页面
    studentsQuery.page = Math.ceil((total.value + 1) / studentsQuery.size)
    getStudents()
  }
  return {
    studentsForm,
    studentsQuery,
    total,
    tableData,
    getStudents,
    onSearch,
    paginationhandle,
    allCampus,
    getCampusList,
    deleteStudent,
    addStudentDialogVisible,
    dialogForm,
    dialogFormRules,
    submitDialogForm,
    goEditStudent,
    imageUrl,
    handleAvatarSuccess,
    beforeAvatarUpload,
    btnDisabled,
    handleAvatarProgress,
    handleAvatarError,
    jcDialogVisible,
    getMaterials,
    AIDialogVisible,
    hbDialogVisible,
    callHBDialog,
    callJCDialog,
    callAIDialog,
    jcForm,
    hbForm,
    AIForm,
    jcCascadeValue,
    hbCascadeValue,
    AICascadeValue,
    jcOptions,
    hbOptions,
    AIOptions,
    handleJCChange,
    handleHBChange,
    handleAIChange,
    activeMaterials,
    activateAiTeaching,
    activePictureBook,
    downloadModal,
    importStudentsDialogVisible,
    callImportStudentsDialog,
    importStudentsTableData,
    resolveXLSX,
    importStudents
  }
})
