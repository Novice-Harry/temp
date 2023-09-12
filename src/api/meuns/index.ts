import { myAxios } from '@/utils/http'
import type { ICommonRes } from '@/utils/type'
/**
 * 获取获取左侧菜单
 * @returns
 */
export const getMenusApi = () =>
  myAxios.http<ICommonRes>({
    url: '/user/menu/api/v1/findMenu/1',
    method: 'GET'
  })
