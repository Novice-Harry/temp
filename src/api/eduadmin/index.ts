import { myAxios } from '@/utils/http'
import type { ICommonRes } from '@/utils/type'
import { teachersApis } from './teachers'
import { studentsApis } from './students'
import { classesApis } from './classes'
/**
 * 获取全部校区 == 用于教务模块
 * @returns
 */
const getAllCampusApi = () =>
  myAxios.http<ICommonRes>({
    url: `/edu/teacher/hhlTeacher/api/v1/findCampInfo`,
    method: 'GET'
  })
/**
 * 获取全部班主任 == 用于教务模块
 * @returns
 */
const getAllHeadTeachersApi = () =>
  myAxios.http<ICommonRes>({
    url: `/edu/hhlclass/api/v1/getHeadTeacher`,
    method: 'GET'
  })
/**
 * 获取全部老师 == 用于教务模块
 * @returns
 */
const getAllTeachersApi = () =>
  myAxios.http<ICommonRes>({
    url: `/edu/teacher/hhlTeacher/api/v1/getTeacherInfo`,
    method: 'GET'
  })

/**
 * 教务模块api
 */
export const eduadminApis = {
  getAllCampusApi,
  getAllHeadTeachersApi,
  getAllTeachersApi,
  teachersApis,
  studentsApis,
  classesApis
}
