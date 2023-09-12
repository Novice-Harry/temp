import { reactive, ref } from 'vue'
import { defineStore } from 'pinia'
import { campusApis, getRoleListApi } from '@/api'
import type { ICampus, IRoleListItem } from '@/utils/type'
import type { FormRules } from 'element-plus'
import router from '@/router'

export const useEditCampStore = defineStore('editCampus', () => {
  // 校区id
  const id = ref(-1)
  const userId = ref(-1)

  // 级联框value
  const cascaderValue = ref<string[]>([])
  // 级联框配置
  const props = {
    expandTrigger: 'hover' as const
  }
  // 编辑表单
  const campusForm = ref<ICampus>({
    campName: '',
    username: '',
    roleId: undefined,
    phone: '',
    password: '',
    address: '',
    addressInfo: ''
  })
  // 表单校验
  const campusFormRules = reactive<FormRules>({
    campName: [{ required: true, message: '请输入校区名称', trigger: 'blur' }],
    username: [
      { required: true, message: '请输入校区负责人信命', trigger: 'blur' }
    ],
    roleId: [{ required: true, message: '请选择角色', trigger: 'blur' }],
    phone: [
      { required: true, message: '请输入手机号', trigger: 'blur' },
      {
        pattern: /^(?:(?:\+|00)86)?1\d{10}$/,
        message: '手机号格式不符',
        trigger: 'blur'
      }
    ],
    password: [
      { required: true, message: '请输入密码', trigger: 'blur' },
      { min: 5, max: 15, message: '密码长度为 5 - 15 位', trigger: 'blur' }
    ]
  })
  // 角色列表
  const roleList = ref<IRoleListItem[]>([])
  // 获取角色列表
  const getRoleList = async () => {
    resetAll()
    const res = await getRoleListApi()
    roleList.value = res.data
  }
  // 地图中心点
  const center = ref('北京')
  // 地图缩放等级
  const zoom = ref(15)
  // 地图级联框改变的回调
  const handleChange = () => {
    campusForm.value.addressInfo = ''
    campusForm.value.address = cascaderValue.value.join('-')
    center.value = campusForm.value.address
  }
  // 地址详情改变触发
  const handleDetailAddressChange = () => {
    center.value = campusForm.value.address + ' ' + campusForm.value.addressInfo
  }
  // 添加校区
  const editCampus = async () => {
    await campusApis.editCampusApi({
      ...campusForm.value,
      id: id.value,
      userId: userId.value
    })
    // 切换路由默认就是那一页，不用判断了
    router.replace({ name: 'campus' })
    // 数据清空
    campusForm.value = {
      campName: '',
      username: '',
      roleId: undefined,
      phone: '',
      password: '',
      address: '',
      addressInfo: ''
    }
    cascaderValue.value = []
    id.value = -1
    userId.value = -1
  }
  // 根据id获取详情
  const getCampusById = async (newId: number) => {
    id.value = newId
    console.log(id.value)
    const res: any = await campusApis.getCampusById(id.value)
    // 数据回显
    campusForm.value.address = res.data.address
    cascaderValue.value = campusForm.value.address.split('-')
    campusForm.value.addressInfo = res.data.addressInfo
    center.value = campusForm.value.address + campusForm.value.addressInfo
    campusForm.value.campName = res.data.campName
    campusForm.value.password = res.data.password
    campusForm.value.phone = res.data.phone
    campusForm.value.roleId = res.data.roleId
    campusForm.value.username = res.data.username
    userId.value = res.data.userId
  }
  const resetAll = () => {
    campusForm.value = {
      campName: '',
      username: '',
      roleId: undefined,
      phone: '',
      password: '',
      address: '',
      addressInfo: ''
    }
    cascaderValue.value = []
    center.value = '北京'
    zoom.value = 15
  }
  return {
    cascaderValue,
    props,
    campusForm,
    campusFormRules,
    roleList,
    center,
    zoom,
    getRoleList,
    handleChange,
    handleDetailAddressChange,
    getCampusById,
    editCampus
  }
})
