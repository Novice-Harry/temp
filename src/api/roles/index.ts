import { myAxios } from '@/utils/http'
import type { ICommonRes } from '@/utils/type'
/**
 * 获取角色列表
 * @returns
 */
export const getRoleListApi = () =>
  myAxios.http<ICommonRes>({
    url: '/user/role/api/v1/getRole',
    method: 'GET'
  })
