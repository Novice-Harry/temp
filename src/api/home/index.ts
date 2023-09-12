import { myAxios } from '@/utils/http'
import type { ICommonRes } from '@/utils/type'
/**
 * 获取首页数据
 * @returns
 */
export const getIndexApi = () =>
  myAxios.http<ICommonRes>({
    url: '/edu/hhledu/api/v1/findHome',
    method: 'GET'
  })
