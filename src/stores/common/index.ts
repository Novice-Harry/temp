import { ref } from 'vue'
import { defineStore } from 'pinia'

import { useUserStore } from '@/stores/user'

export const useCommonStore = defineStore('common', () => {
  const userStore = useUserStore()
  /**
   * 通用请求头
   */
  const uploadHeader = ref({
    Authorization: userStore.token
  })
  /**
   * 通用上传图片地址
   */
  const uploadUrl = ref(
    'http://hylyoueryuan.v1.idcfengye.com/edu/file/api/v1/fileUpload'
  )
  return { uploadHeader, uploadUrl }
})
