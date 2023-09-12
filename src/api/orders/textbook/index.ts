import { myAxios } from '@/utils/http'
import type { ICommonRes, IGetTextBookListApi } from '@/utils/type'
/**
 * 服务订购模块下序列号清单
 */
export const textBookApis = {
  /**
   * 合作教材
   * @param data
   * @returns
   */
  getTextBookListApi: (data: IGetTextBookListApi) =>
    myAxios.http<ICommonRes>({
      url: `/product/materials/api/v1/findPage`,
      method: 'POST',
      data
    }),
  /**
   * 导出教材excel
   * @returns
   */
  exportExcelApi: () =>
    myAxios.http<ICommonRes>({
      url: `/product/materials/api/v1/export`,
      method: 'GET',
      responseType: 'arraybuffer'
    })
}
