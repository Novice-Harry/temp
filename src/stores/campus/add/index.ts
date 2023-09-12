import { reactive, ref } from 'vue'
import router from '@/router'
import { defineStore } from 'pinia'

import type { FormRules } from 'element-plus'
import { useCampListStore } from '@/stores/campus/campus'

import { campusApis, getRoleListApi } from '@/api'
import type { ICampus, IRoleListItem } from '@/utils/type'

export const useNewCampStore = defineStore('addCampus', () => {
  const campusStore = useCampListStore()
  // 级联框value
  const cascaderValue = ref<string[]>([])
  // 级联框配置
  const props = {
    expandTrigger: 'hover' as const
  }
  // 添加表单
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
  const addCampus = async () => {
    await campusApis.addCampusApi(campusForm.value)
    // 确保添加成功后跳转到最后一页
    campusStore.pageInfo.page = Math.ceil(
      (campusStore.total + 1) / campusStore.pageInfo.size
    )
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
    addCampus
  }
})
