import { myAxios } from '@/utils/http'
import type {
  IAddTeacherData,
  ICommonRes,
  IEditTeacherData,
  IGetTaechersData
} from '@/utils/type'
/**
 * 教务管理下教师管理接口
 */
export const teachersApis = {
  /**
   * 获取教师列表
   * @param data
   * @returns
   */
  getTaechersApi: (data: IGetTaechersData) =>
    myAxios.http<ICommonRes>({
      url: `/edu/teacher/hhlTeacher/api/v1/findAll`,
      method: 'POST',
      data
    }),
  /**
   * 添加教师
   * @param data
   * @returns
   */
  addTeacherApi: (data: IAddTeacherData) =>
    myAxios.http<ICommonRes>({
      url: `/edu/teacher/hhlTeacher/api/v1/saveTeacher`,
      method: 'POST',
      data
    }),
  /**
   * 根据id获取教师详情
   * @param id
   * @returns
   */
  getTeacherInfoByIdApi: (id: number) =>
    myAxios.http<ICommonRes>({
      url: `/edu/teacher/hhlTeacher/api/v1/detail/${id}`,
      method: 'GET'
    }),
  /**
   * 老师负责班级详情
   * @param id
   * @returns
   */
  getClassesByTeacherIdApi: (id: number) =>
    myAxios.http<ICommonRes>({
      url: `/edu/teacher/hhlTeacher/api/v1/findTeacherClass/${id}`,
      method: 'GET'
    }),
  /**
   * 编辑教师
   * @param data
   * @returns
   */
  editTeacherApi: (data: IEditTeacherData) =>
    myAxios.http<ICommonRes>({
      url: `/edu/teacher/hhlTeacher/api/v1/updateTeacher`,
      method: 'PUT',
      data
    }),
  /**
   * 删除教师
   * @param id
   * @returns
   */
  deleteTeacherApi: (id: number) =>
    myAxios.http<ICommonRes>({
      url: `/edu/teacher/hhlTeacher/api/v1/delTeacher/${id}`,
      method: 'DELETE'
    })
}
