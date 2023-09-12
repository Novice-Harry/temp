import { myAxios } from '@/utils/http'
import type { ICommonRes, IGetSerialListData } from '@/utils/type'
/**
 * 服务订购模块下序列号清单
 */
export const serialListApis = {
  /**
   * 获取序列号清单
   * @param data
   * @returns
   */
  getSerialListApi: (data: IGetSerialListData) =>
    myAxios.http<ICommonRes>({
      url: `/product/serialInventory/api/v1/findAll`,
      method: 'POST',
      data
    }),
  /**
   * 导出序列号清单信息
   * @param idList
   * @returns
   */
  exportSerialListSelectedApi: (idList: string) =>
    myAxios.http<ICommonRes>({
      url: `/product/serialInventory/api/v1/export1/${idList}`,
      method: 'GET',
      responseType: 'blob'
    })
}
