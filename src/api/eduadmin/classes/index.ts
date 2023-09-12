import { myAxios } from '@/utils/http'
import type {
  IAddClassData,
  IAddStudentDataInClass,
  IAddTrendsData,
  IChangeClassData,
  ICommonRes,
  IEditClassData,
  IEditTrendsData,
  IGetClassListData,
  IGetStudentsByClassId,
  IGetTrendsListData
} from '@/utils/type'
/**
 * 教务管理下班级管理接口
 */
export const classesApis = {
  /**
   * 获取班级列表
   * @param data
   * @returns
   */
  getClassesListApi: (data: IGetClassListData) =>
    myAxios.http<ICommonRes>({
      url: `/edu/hhlclass/api/v1/findAllClass`,
      method: 'POST',
      data
    }),
  /**
   * 新建班级
   * @param data
   * @returns
   */
  addClassApi: (data: IAddClassData) =>
    myAxios.http<ICommonRes>({
      url: `/edu/hhlclass/api/v1/saveClass`,
      method: 'POST',
      data
    }),
  /**
   * 根据id获取班级信息
   * @param id
   * @returns
   */
  getClassInfoById: (id: number) =>
    myAxios.http<ICommonRes>({
      url: `/edu/hhlclass/api/v1/findById/${id}`,
      method: 'GET'
    }),
  /**
   * 编辑班级
   * @param data
   * @returns
   */
  editClassApi: (data: IEditClassData) =>
    myAxios.http<ICommonRes>({
      url: `/edu/hhlclass/api/v1/updateClass`,
      method: 'PUT',
      data
    }),
  /**
   * 删除班级
   * @param id
   * @returns
   */
  deleteClassApi: (id: number) =>
    myAxios.http<ICommonRes>({
      url: `/edu/hhlclass/api/v1/removeClass/${id}`,
      method: 'DELETE'
    }),
  /**
   * 结课
   * @param id
   * @returns
   */
  endingClassApi: (id: number) =>
    myAxios.http<ICommonRes>({
      url: `/edu/hhlclass/api/v1/class_ending/${id}`,
      method: 'PUT'
    }),
  /**
   * 一键升班
   * @param id
   * @returns
   */
  upgradeClassApi: (data: IEditClassData) =>
    myAxios.http<ICommonRes>({
      url: `/edu/hhlclass/api/v1/upAndDownClass`,
      method: 'PUT',
      data
    }),
  /**
   * 获取当前班级下的学生
   * @param data
   * @returns
   */
  getStudentsByClassId: (data: IGetStudentsByClassId) =>
    myAxios.http<ICommonRes>({
      url: `/edu/hhlclass/api/v1/findStudent`,
      method: 'POST',
      data
    }),
  /**
   * 选班调班
   * @param data
   * @returns
   */
  changeClassApi: (data: IChangeClassData) =>
    myAxios.http<ICommonRes>({
      url: `/edu/hhlclass/api/v1/exchangeClass`,
      method: 'POST',
      data
    }),
  /**
   * 班级中添加学生
   * @param data
   * @param classId
   * @returns
   */
  addStudentInClassApi: (data: IAddStudentDataInClass, classId: number) =>
    myAxios.http<ICommonRes>({
      url: `/edu/hhlclass/api/v1/insertStudent/${classId}`,
      method: 'POST',
      data
    }),
  /**
   * 班级中批量添加学生
   * @param data
   * @param classId
   * @returns
   */
  addStudentsInClassApi: (data: {
    studentInformations: IAddStudentDataInClass[]
    classId: number
  }) =>
    myAxios.http<ICommonRes>({
      url: `/edu/hhledu/api/v1/import`,
      method: 'POST',
      data
    }),
  /**
   * 移除班级
   * @param data
   * @returns
   */
  quitClassApi: (data: number[]) =>
    myAxios.http<ICommonRes>({
      url: `/edu/hhlclass/api/v1/deleteStudent`,
      method: 'POST',
      data
    }),
  /**
   * 发布动态列表展示
   * @param data
   * @returns
   */
  getTrendsListApi: (data: IGetTrendsListData) =>
    myAxios.http<ICommonRes>({
      url: `/edu/dynamic/api/v1/findAllDynamic`,
      method: 'POST',
      data
    }),
  /**
   * 发布动态
   * @param data
   * @returns
   */
  addTrendsApi: (data: IAddTrendsData) =>
    myAxios.http<ICommonRes>({
      url: `/edu/dynamic/api/v1/addDynamic`,
      method: 'POST',
      data
    }),
  /**
   * 获取动态详情
   * @param id
   * @returns
   */
  getTrendsInfoApi: (id: number) =>
    myAxios.http<ICommonRes>({
      url: `/edu/dynamic/api/v1/getByDynamicId/${id}`,
      method: 'GET'
    }),
  /**
   * 编辑动态
   * @param data
   * @returns
   */
  editTrendsApi: (data: IEditTrendsData) =>
    myAxios.http<ICommonRes>({
      url: `/edu/dynamic/api/v1/updateDynamic`,
      method: 'PUT',
      data
    }),
  /**
   * 删除动态
   * @param id
   * @returns
   */
  deleteTrendsApi: (id: number) =>
    myAxios.http<ICommonRes>({
      url: `/edu/dynamic/api/v1/deleteDynamic/${id}`,
      method: 'DELETE'
    })
}
