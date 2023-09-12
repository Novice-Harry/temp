import axios from 'axios'
import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig
} from 'axios'
import type { LoadingInstance } from 'element-plus/lib/components/loading/src/loading.js'
import { useUserStore } from '@/stores/user'

interface AxiosRequestConfigWithInterceptors extends AxiosRequestConfig {
  interceptor?: Interceptor
}
interface Interceptor {
  requestSuccess?: (
    config: InternalAxiosRequestConfig
  ) => InternalAxiosRequestConfig
  requestError?: (error: any) => any
  responseSuccess?: (result: AxiosResponse) => AxiosResponse
  responseError?: (error: any) => any
}

export class NewAxios {
  serve: AxiosInstance
  interceptor?: Interceptor
  loading?: LoadingInstance

  constructor(config: AxiosRequestConfigWithInterceptors) {
    this.serve = axios.create(config)
    this.interceptor = config.interceptor

    this.serve.interceptors.request.use(
      this.interceptor?.requestSuccess,
      this.interceptor?.requestError
    )
    this.serve.interceptors.response.use(
      this.interceptor?.responseSuccess,
      this.interceptor?.responseError
    )
    this.serve.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        if (config.url !== '/user/hhluser/api/v1/login') {
          const userStore = useUserStore()
          config.headers.Authorization = userStore.token
        }
        this.loading = ElLoading.service({
          lock: true,
          text: '加载中',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )
    this.serve.interceptors.response.use(
      (res: AxiosResponse) => {
        const whiteList = [0, 200, 201, 204, undefined]
        // console.log(res.config.url)
        if (whiteList.includes(res.data.code)) {
          if (res.config.url === '/user/hhluser/api/v1/login') {
            const userStore = useUserStore()
            userStore.loginSuccess(res.data.data)
          }
          if (document.getElementsByClassName('el-message').length === 0) {
            ElMessage.success(res.data.errorMessage)
          }
        } else {
          ElMessage.error(res.data.errorMessage)
        }
        this.loading?.close()
        return res.data
      },
      (error) => {
        this.loading?.close()
        return Promise.reject(error)
      }
    )
  }

  http<T>(config: AxiosRequestConfigWithInterceptors): Promise<T> {
    return new Promise((resolve, reject) => {
      this.serve
        .request<any, T>(config)
        .then((res) => {
          return resolve(res)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }
}
