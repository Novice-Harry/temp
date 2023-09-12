import { reactive, ref } from 'vue'
import { defineStore } from 'pinia'
import { campusApis } from '@/api'
import type { ICamousListItem } from '@/utils/type'

export const useCampListStore = defineStore('campusList', () => {
  // 分页信息
  const pageInfo = reactive({
    page: 1,
    size: 10
  })
  // 数据总数
  const total = ref(0)
  // 表格数据
  const tableData = ref<ICamousListItem[]>([])
  // 获取列表
  const getList = async () => {
    const res = await campusApis.getCampusListApi(pageInfo)
    tableData.value = res.data
    total.value = res.total
  }
  // 删除校区
  const deleteCampus = (data: ICamousListItem) => {
    ElMessageBox.confirm('删除校区后，将无法使用，您确认删除？', '', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      center: true
    })
      .then(async () => {
        // 判断下当前校区是否有老师、学生班级
        if (
          data.classCount > 0 ||
          data.teacherCount > 0 ||
          data.studentCount > 0
        ) {
          ElMessageBox.confirm(
            '当前小区下仍有班级、学生、教师等，删除后将无法使用，是否继续',
            '',
            {
              confirmButtonText: '仍要删除',
              cancelButtonText: '放弃删除',
              center: true
            }
          )
            .then(async () => {
              await campusApis.deleteCampusApi(data.id)
              getList()
            })
            .catch(() => {})
        } else {
          await campusApis.deleteCampusApi(data.id)
          getList()
        }
      })
      .catch(() => {})
  }
  // 翻页
  const paginationhandle = () => {
    getList()
  }

  return { pageInfo, total, tableData, getList, deleteCampus, paginationhandle }
})
