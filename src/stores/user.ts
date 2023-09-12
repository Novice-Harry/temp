import { ref } from 'vue'
import { defineStore } from 'pinia'
import router from '@/router'
import type { ILoginSuccessResponse } from '@/utils/type'

export const useUserStore = defineStore(
  'user',
  () => {
    // 用户token
    const token = ref('')
    const userinfo = ref<ILoginSuccessResponse>({
      id: -1,
      rid: -1,
      rname: '',
      token: '',
      username: ''
    })
    // 登录成功
    const loginSuccess = (data: ILoginSuccessResponse) => {
      console.log(data)

      token.value = data.token
      setUserInfo(data)
      router.replace('/')
    }
    // 设置用户信息
    const setUserInfo = (data: ILoginSuccessResponse) => {
      userinfo.value.id = data.id
      userinfo.value.rid = data.rid
      userinfo.value.rname = data.rname
      userinfo.value.username = data.username
    }

    // 退出登录
    const logoutSuccess = () => {
      token.value = ''
      router.replace('/login')
    }
    return { token, userinfo, loginSuccess, logoutSuccess }
  },
  {
    persist: true
  }
)
