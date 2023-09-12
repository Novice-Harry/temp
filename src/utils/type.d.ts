// 所有接口都在这
/**
 * 统一返回数据
 */
export interface ICommonRes {
  data: any
  [key: string]: any
}
/**
 * 登录
 */
export interface ILoginQuery {
  username: string
  password: string
  captcha: string
}

/**
 * 登录成功返回数据 包括用户信息
 */
export interface ILoginSuccessResponse {
  id: number
  rid: number
  rname: string
  token: string
  username: string
}
/**
 * 角色列表项
 */
export interface IRoleListItem {
  id: number
  rname: string
  roleInfo: string
}
/**
 * 校区列表请求数据
 */
export interface IGetCampusListData {
  page: number
  size: number
}

/**
 * 校区列表项
 */
export interface ICamousListItem {
  address: string
  classCount: number
  cname: string
  detailedAddress: string
  id: number
  phone: string
  studentCount: number
  teacherCount: number
  username: string
}

/**
 * 添加编辑校区表单
 */
export interface ICampus {
  campName: string
  username: string
  roleId: undefined | number
  phone: null | string
  password: string
  address: string
  addressInfo: string
}

/**
 * 添加校区请求数据
 */
export interface IAddCampus extends ICampus {}
/**
 * 编辑校区请求数据
 */
export interface IEditCampus extends ICampus {
  id: number
  userId: number
}

/**
 * 获取教师列表请求参数
 */
export interface IGetTaechersData {
  page: number
  size: number
  campId: number | string
  nameOrPhone: string
}
/**
 * 全部校区列表项 - 用于教务管理
 */
export interface IAllCampusItem {
  address: string
  classCount: number
  campName: string
  detailedAddress: string
  id: number
  phone: string
  studentCount: number
  teacherCount: number
  username: string
}
/**
 * 全部教师列表项 - 用于教务管理
 */
export interface IAllTeachersItem {
  id: number
  headTeacherName: string
}
/**
 * 添加老师
 */
export interface IAddTeacherData {
  teName: string
  tePhone: string
  roleId: number | string
  info: string
  photo: null | string
  campId: number | string
  password: string
}
/**
 * 编辑老师
 */
export interface IEditTeacherData {
  id: number
  teName: string
  tePhone: string
  roleId: number
  info: string
  campId: number
  password: string
}
/**
 * 根据教师id获取班级列表项
 */
export interface IClassesItemByTeacherId {
  campId: number
  classAssistant: string
  classCode: string
  classCount: number
  classCourse: string
  classEndingTime: string
  className: string
  headTeacherId: number
  headTeacherName: string
  id: number
  isDeleted: number
  startTime: string
  status: number
  subjectId: number
  updateTime: null
}
/**
 * 请求学生列表参数
 */
export interface IGetStudentsData {
  page: number
  size: number
  campId: string
  nameOrPhone: string
}
/**
 * 学生列表 列表项
 */
export interface IStudent {
  address: string
  campId: number
  campName: string
  enrolTime: string
  id: number
  isDeleted: number
  lastLoginTime: string
  phone: string
  photo: null | string
  publicSchool: string
  schoolTime: number
  sex: number
  startDate: string
  status: number
  stuName: string
  wx: string
}
/**
 * 添加学生
 */
export interface IAddStudentData {
  stuName: string
  phone: string
  startDate: string
  sex: string
  address: string
  publicSchool: string
  photo: string
}
/**
 * 编辑学生
 */
export interface IEditStudentData extends IAddStudentData {
  id: number
  wx: string
  [other: string]: any
}

/**
 * 批量激活教材
 */
export interface IActiveMaterialsData {
  studentIds: number[]
  subjectId: number | string
  materialsId: number | string
}

/**
 * 批量激活教材
 */
export interface IActivateAiTeachingData {
  studentIds: number[]
  subjectId: number | string
  materialsId: number | string
}

/**
 * 批量激活绘本
 */
export interface IPictureBookData {
  studentIds: number[]
  mealId: number | string
}

/**
 * 批量激活学生
 */
export interface IImportStudentsData {
  stuName: string
  phone: string
  startDate: string
  sex: number
  enrolTime: string
  address: string
  publicSchool: string
  campName: string
  wx: string
  schoolTime: string
}

/**
 * 获取 选班调班 班级列表请求数据
 */
export interface IGetOtherClassesData {
  classId: number
  campId: string | number
  subjectId: string | number
  materialsId: string | number
  className: string | number
  status: string | number
  headTeacherName: string | number
}
/**
 * 获取班级列表请求数据
 */
export interface IGetClassListData {
  page: number
  size: number
  campId: number | string
  className: string
  subjectId: number | string
  status: number | string
  teacherName: string
  materialsId: number | string
}

/**
 * 获取序列号清单请求数据
 */
export interface IGetSerialListData {
  page: number
  size: number
  subjectId: string
  materialsId: string
  status: string
  type: string
  code: string
  serialNumber: string
  phone: string
}

/**
 * 序列号清单列表列表项
 */
export interface ISerialListItem {
  activationTime: string
  code: string
  id: number
  materialsId: number
  materialsName: string
  phone: string
  remainingDate: string
  serialNumber: string
  status: number
  studentId: number
  studentName: string
  subjectId: number
  type: number
  userId: number
  userName: string
}
/**
 * 新建、编辑班级表单
 */
export interface IClassForm {
  className: string
  subjectId: string
  materialsId: string
  headTeacherId: string
  teacherId: string
  campId: string
}
/**
 * 新建班级请求数据
 */
export interface IAddClassData extends IClassForm {}
/**
 * 编辑班级请求数据
 */
export interface IEditClassData extends IClassForm {
  id: number
}

/**
 * 班级详情
 */
export interface IClassInfo {
  campId: number
  campName: string
  classAssistant: string
  classCode: string
  classCount: number
  classCourse: string
  classEndingTime: string
  className: string
  entryTime: string
  headTeacherId: number
  headTeacherName: string
  id: number
  isDeleted: number
  materialsId: number
  startTime: string
  status: number
  subjectId: number
  subjectName: string
  teacherId: number
  updateTime: string
}

/**
 * 班级下学生列表
 */
export interface IGetStudentsByClassId {
  page: number
  size: number
  classId: number
  campId: number
}

/**
 * 选班调班
 */
export interface IChangeClassData {
  classId: number
  studentIds: number[]
}

/**
 * 在班级中添加学生
 */
export interface IAddStudentDataInClass {
  stuName: string
  phone: string
  startDate: string
  sex: number
  address: string
  publicSchool: string
}

/**
 * 获取动态列表
 */
export interface IGetTrendsListData {
  page: number
  size: number
  classId: number
}
/**
 * 添加动态
 */
export interface IAddTrendsData {
  title: string
  content: string
  classId: number
  headTeacherId: number
}

/**
 * 动态列表 - 列表项
 */
export interface ITrendsItem {
  id: number
  title: string
  content: string
  photo: string
  headTeacherName: string
  startTime: string
  classId: number
  className: string
  headTeacherId: number
}

/**
 * 添加动态
 */
export interface IEditTrendsData extends IAddTrendsData {
  id: number
}

/**
 * 获取合作教材
 */
export interface IGetTextBookListApi {
  page: number
  size: number
  typeId: number | string
  subjectId: number | string
}
