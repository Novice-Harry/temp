import { myAxios } from '@/utils/http'
import type {
  IActivateAiTeachingData,
  IActiveMaterialsData,
  IAddStudentData,
  ICommonRes,
  IEditStudentData,
  IGetOtherClassesData,
  IGetStudentsData,
  IImportStudentsData,
  IPictureBookData
} from '@/utils/type'

/**
 教务管理 - 学生管理
 */
export const studentsApis = {
  /**
   * 获取学生列表
   * @param data
   * @returns
   */
  getStudentsApi: (data: IGetStudentsData) =>
    myAxios.http<ICommonRes>({
      url: `/edu/hhledu/api/v1/findAll`,
      method: 'POST',
      params: data
    }),
  /**
   * 添加学生
   * @param data
   * @returns
   */
  addStudentApi: (data: IAddStudentData) =>
    myAxios.http<ICommonRes>({
      url: `/edu/hhledu/api/v1/findAdd`,
      method: 'POST',
      data
    }),
  /**
   * 根据id获取学生信息
   * @param id
   * @returns
   */
  getStudentByIdApi: (id: number) =>
    myAxios.http<ICommonRes>({
      url: `/edu/hhledu/api/v1/findById/${id}`,
      method: 'GET'
    }),
  /**
   * 查看功能 所在班级详情
   * @param id
   * @returns
   */
  getClassInfoByStudentApi: (id: number) =>
    myAxios.http<ICommonRes>({
      url: `/edu/hhledu/api/v1/findClassInfo/${id}`,
      method: 'GET'
    }),
  /**
   * 查看功能 所学教材
   * @param id
   * @returns
   */
  getMaterialsInfoByStudentApi: (id: number) =>
    myAxios.http<ICommonRes>({
      url: `/edu/hhledu/api/v1/getMaterialsInfo/${id}`,
      method: 'GET'
    }),
  /**
   * 查看功能 绘本馆
   * @param id
   * @returns
   */
  getMealInfoByStudentApi: (id: number) =>
    myAxios.http<ICommonRes>({
      url: `/edu/hhledu/api/v1/getMeal/${id}`,
      method: 'GET'
    }),
  /**
   * 查看功能 所在班级 选班调班展示
   * @param data
   * @returns
   */
  getOtherClassesApi: (data: IGetOtherClassesData) =>
    myAxios.http<ICommonRes>({
      url: `/edu/hhledu/api/v1/moveClass`,
      method: 'POST',
      data
    }),
  /**
   * 查看功能 所在班级 选班调班
   * @param data
   * @returns
   */
  changeClassApi: (studentId: number, classId: number) =>
    myAxios.http<ICommonRes>({
      url: `/edu/hhledu/api/v1/saveClass/${studentId}/${classId}`,
      method: 'GET'
    }),
  /**
   * 查看功能 所在班级 移除班级
   * @param data
   * @returns
   */
  quitClassApi: (studentId: number, classId: number) =>
    myAxios.http<ICommonRes>({
      url: `/edu/hhledu/api/v1/delClass/${studentId}/${classId}`,
      method: 'DELETE'
    }),
  /**
   * 编辑
   * @param data
   * @returns
   */
  editStudentApi: (data: IEditStudentData) =>
    myAxios.http<ICommonRes>({
      url: `/edu/hhledu/api/v1/findByUpdate`,
      method: 'PUT',
      data
    }),
  /**
   * 删除学生
   * @param id
   * @returns
   */
  deleteStydentApi: (id: number) =>
    myAxios.http<ICommonRes>({
      url: `/edu/hhledu/api/v1/findDelById/${id}`,
      method: 'DELETE'
    }),
  /**
   * 获取教材
   * @returns
   */
  getMaterialsApi: () =>
    myAxios.http<ICommonRes>({
      url: `/edu/hhledu/api/v1/getMaterials`,
      method: 'GET'
    }),
  /**
   * 批量激活教材
   * @param data
   * @returns
   */
  activeMaterialsApi: (data: IActiveMaterialsData) =>
    myAxios.http<ICommonRes>({
      url: `/edu/hhledu/api/v1/putActivateSerial`,
      method: 'POST',
      data
    }),
  /**
   * 批量激活AI课
   * @param data
   * @returns
   */
  activateAiTeachingApi: (data: IActivateAiTeachingData) =>
    myAxios.http<ICommonRes>({
      url: `/edu/hhledu/api/v1/putActivateAiTeaching`,
      method: 'POST',
      data
    }),
  /**
   * 批量激活AI课
   * @param data
   * @returns
   */
  activatePictureBookApi: (data: IPictureBookData) =>
    myAxios.http<ICommonRes>({
      url: `/edu/hhledu/api/v1/putActivatePictureBook`,
      method: 'POST',
      data
    }),
  /**
   * 下载模板
   * @returns
   */
  downloadModalApi: () =>
    myAxios.http<ICommonRes>({
      url: `/edu/hhledu/api/v1/export`,
      method: 'GET',
      responseType: 'blob'
    }),
  /**
   * 批量导入
   * @param data
   * @returns
   */
  importStudentsApi: (data: IImportStudentsData[]) =>
    myAxios.http<ICommonRes>({
      url: `/edu/hhledu/api/v1/import`,
      method: 'POST',
      data
    })
}
