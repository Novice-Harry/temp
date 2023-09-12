import { myAxios } from '@/utils/http'
import type { ICommonRes, ILoginQuery } from '@/utils/type'

/**
 * 登录模块
 */
export const loginApis = {
  /**
   * 登录
   * @param data
   * @returns
   */
  loginApi: (data: ILoginQuery) =>
    myAxios.http<ICommonRes>({
      url: '/user/hhluser/api/v1/login',
      method: 'POST',
      data
    }),
  /**
   * 获取验证码
   */
  getValidationApi: () =>
    myAxios.http<ICommonRes>({
      url: '/user/hhluser/api/v1/captcha',
      method: 'GET',
      responseType: 'arraybuffer'
    })
}
