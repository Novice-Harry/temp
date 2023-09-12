import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { campusApis, getRoleListApi } from '@/api'
import type { ICampus, IRoleListItem } from '@/utils/type'

export const useCampDetailStore = defineStore('campusDetail', () => {
  // 校区id
  const id = ref(-1)
  // 数据回显对象
  const campusForm = ref<ICampus>({
    campName: '',
    username: '',
    roleId: undefined,
    phone: '',
    password: '',
    address: '',
    addressInfo: ''
  })
  // 角色列表
  const roleList = ref<IRoleListItem[]>([])
  // 获取角色列表
  const getRoleList = async () => {
    const res = await getRoleListApi()
    roleList.value = res.data
  }
  // 根据角色id返回角色
  const getRoleName = computed(
    () =>
      roleList.value.find((item) => item.id === campusForm.value.roleId)?.rname
  )
  // 地图中心点
  const center = ref('北京')
  // 地图缩放等级
  const zoom = ref(15)

  // 根据id获取详情
  const getCampusById = async (newId: number) => {
    id.value = newId
    const res: any = await campusApis.getCampusById(id.value)
    // 数据回显
    campusForm.value.address = res.data.address
    campusForm.value.addressInfo = res.data.addressInfo
    center.value = campusForm.value.address + campusForm.value.addressInfo
    campusForm.value.campName = res.data.campName
    campusForm.value.password = res.data.password
    campusForm.value.phone = res.data.phone
    campusForm.value.roleId = res.data.roleId
    campusForm.value.username = res.data.username
  }
  return {
    campusForm,
    roleList,
    center,
    zoom,
    getRoleName,
    getRoleList,
    getCampusById
  }
})
