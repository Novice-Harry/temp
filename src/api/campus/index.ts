import { myAxios } from '@/utils/http'
import type {
  IAddCampus,
  ICommonRes,
  IEditCampus,
  IGetCampusListData
} from '@/utils/type'

/**
 * 校区管理API
 */
export const campusApis = {
  /**
   * 校区列表请求
   * @param data
   * @returns
   */
  getCampusListApi: (data: IGetCampusListData) =>
    myAxios.http<ICommonRes>({
      url: `/camp/hhlcamp/api/v1/findAll/${data.page}/${data.size}`,
      method: 'GET'
    }),
  /**
   * 添加校区
   * @param data
   * @returns
   */
  addCampusApi: (data: IAddCampus) =>
    myAxios.http<ICommonRes>({
      url: '/camp/hhlcamp/api/v1/saveCamp',
      method: 'POST',
      data
    }),
  /**
   * 根据id获取详情
   * @param id
   * @returns
   */
  getCampusById: (id: number) =>
    myAxios.http<ICommonRes>({
      url: `/camp/hhlcamp/api/v1/getByCampId/${id}`,
      method: 'GET'
    }),
  /**
   * 编辑
   * @param data
   * @returns
   */
  editCampusApi: (data: IEditCampus) =>
    myAxios.http<ICommonRes>({
      url: `/camp/hhlcamp/api/v1/updateCamp`,
      method: 'PUT',
      data
    }),
  /**
   * 删除
   * @param id
   * @returns
   */
  deleteCampusApi: (id: number) =>
    myAxios.http<ICommonRes>({
      url: `/camp/hhlcamp/api/v1/remove/${id}`,
      method: 'DELETE'
    })
}
