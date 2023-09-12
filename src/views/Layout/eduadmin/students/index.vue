<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()

import type { FormInstance, ElTable } from 'element-plus'
import { Plus, UploadFilled } from '@element-plus/icons-vue'

import { timeFormater } from '@/utils/format'
import { useStudentStore } from '@/stores/eduadmin/student/list'
const studentStore = useStudentStore()
import { useCommonStore } from '@/stores/common'
const commonStore = useCommonStore()

onMounted(() => {
  studentStore.getStudents()
  studentStore.getCampusList()
})

// 添加/编辑表单的实例
const dialogFormRef = ref<FormInstance>()
// 多选表格实例
const multipleTableRef = ref<InstanceType<typeof ElTable>>()
// 多选框选择回调
const handleSelectionChange = (val: any[]) => {
  studentStore.jcForm.studentIds = val.map((item) => item.id)
}
// 这个是清除表单复选框，到时候会用
// multipleTableRef.value?.clearSelection()
const jcProps = {
  expandTrigger: 'hover' as const,
  label: 'typeName',
  value: 'id'
}
// const AIProps = {
//   expandTrigger: 'hover' as const,
//   label: 'typeName',
//   value: 'id'
// }
</script>

<template>
  <el-card class="students_top">
    <el-form
      inline
      :model="studentStore.studentsForm"
      class="students_top_form"
      label-width="100"
      label-position="left"
    >
      <el-form-item label="校区名称">
        <el-select
          v-model="studentStore.studentsForm.campId"
          placeholder="请选择校区"
        >
          <el-option label="全部校区" value="" />
          <el-option
            v-for="item in studentStore.allCampus"
            :key="item.id"
            :label="item.campName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="教师筛选">
        <el-input
          v-model="studentStore.studentsForm.nameOrPhone"
          placeholder="请输入教师姓名或手机号"
        />
      </el-form-item>
      <el-form-item>
        <el-button color="#2eba78" @click="studentStore.onSearch">
          <span style="color: white"> 搜索 </span>
        </el-button>
      </el-form-item>
    </el-form>
  </el-card>
  <el-card class="students_container">
    <template #header>
      <div class="students_container_header">
        <span>学生列表</span>
        <div>
          <el-button color="#2eba78" @click="studentStore.callHBDialog">
            <span style="color: white">绘本VIP会员</span>
          </el-button>
          <el-button
            color="#2eba78"
            @click="studentStore.addStudentDialogVisible = true"
          >
            <span style="color: white">添加学生</span>
          </el-button>
          <el-button color="#2eba78" @click="studentStore.downloadModal">
            <span style="color: white">下载模板</span>
          </el-button>
          <el-button
            color="#2eba78"
            @click="studentStore.callImportStudentsDialog"
          >
            <span style="color: white">批量导入学生</span>
          </el-button>
          <el-button color="#2eba78" @click="studentStore.callJCDialog()">
            <span style="color: white">批量激活教材</span>
          </el-button>
          <el-button color="#2eba78" @click="studentStore.callAIDialog()">
            <span style="color: white">批量激活AI课</span>
          </el-button>
        </div>
      </div>
    </template>
    <el-table
      :data="studentStore.tableData"
      style="width: 100%"
      ref="multipleTableRef"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="stuName" label="学生姓名" width="110" />
      <el-table-column label="状态" width="100">
        <template #default="{ row }">
          {{ row.status === 1 ? '已注册' : '未注册' }}
        </template>
      </el-table-column>
      <el-table-column prop="phone" label="联系方式" width="150" />
      <el-table-column label="出生日期" width="120">
        <template #default="{ row }">
          {{ timeFormater(row.startDate) }}
        </template>
      </el-table-column>
      <el-table-column label="性别" width="70">
        <template #default="{ row }">
          {{ row.sex === 1 ? '男' : '女' }}
        </template>
      </el-table-column>
      <el-table-column prop="campName" label="所在班级" width="130" />
      <el-table-column label="入校时间" width="120">
        <template #default="{ row }">
          {{ timeFormater(row.enrolTime) }}
        </template>
      </el-table-column>
      <el-table-column prop="name" label="操作">
        <template #default="{ row }">
          <div
            class="form_btn form_btn_primary"
            @click="router.push('/eduadmin/students/' + row.id)"
          >
            查看
          </div>
          <div
            class="form_btn form_btn_primary"
            @click="studentStore.goEditStudent(row.id)"
          >
            编辑
          </div>
          <div
            class="form_btn form_btn_primary"
            @click="studentStore.callJCDialog(row.id)"
          >
            激活序列号
          </div>
          <div
            class="form_btn form_btn_primary"
            @click="studentStore.callAIDialog(row.id)"
          >
            AI课授权
          </div>
          <div
            class="form_btn form_btn_warning"
            @click="studentStore.deleteStudent(row.id)"
          >
            删除
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="paginationbox">
      <el-pagination
        class="commonpagination"
        v-model:current-page="studentStore.studentsQuery.page"
        v-model:page-size="studentStore.studentsQuery.size"
        :page-sizes="[5, 10, 20, 30, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="studentStore.total"
        @size-change="studentStore.paginationhandle"
        @current-change="studentStore.paginationhandle"
      />
    </div>
  </el-card>
  <!-- 添加学生 -->
  <el-dialog
    v-model="studentStore.addStudentDialogVisible"
    width="700"
    title="添加学生"
  >
    <div class="dialogformbox">
      <el-form
        :model="studentStore.dialogForm"
        ref="dialogFormRef"
        :rules="studentStore.dialogFormRules"
        label-width="100"
        size="large"
        label-position="left"
      >
        <el-form-item label="学生姓名" prop="stuName">
          <el-input
            v-model="studentStore.dialogForm.stuName"
            placeholder="请输入教师姓名"
          />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input
            v-model="studentStore.dialogForm.phone"
            placeholder="请输入教师手机号"
          />
        </el-form-item>
        <el-form-item label="出生日期" prop="startDate">
          <el-date-picker
            v-model="studentStore.dialogForm.startDate"
            type="date"
            placeholder="请选择日期"
            style="width: 100%"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-radio-group v-model="studentStore.dialogForm.sex" class="ml-4">
            <el-radio :label="1" size="large">男</el-radio>
            <el-radio :label="2" size="large">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="头像">
          <el-upload
            class="avatar-uploader"
            :action="commonStore.uploadUrl"
            :headers="commonStore.uploadHeader"
            :show-file-list="false"
            :on-success="studentStore.handleAvatarSuccess"
            :before-upload="studentStore.beforeAvatarUpload"
            :on-progress="studentStore.handleAvatarProgress"
            :on-error="studentStore.handleAvatarError"
          >
            <img
              v-if="studentStore.imageUrl"
              :src="studentStore.imageUrl"
              class="avatar"
            />
            <el-icon v-else class="avatar-uploader-icon">
              <Plus />
            </el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="地区">
          <el-input
            v-model="studentStore.dialogForm.address"
            placeholder="请输入地区"
          />
        </el-form-item>
        <el-form-item label="公立校">
          <el-input
            v-model="studentStore.dialogForm.publicSchool"
            placeholder="请输入公立校"
          />
        </el-form-item>
      </el-form>
    </div>

    <template #footer>
      <div class="dialog_footer">
        <el-button
          size="large"
          color="#2eba78"
          @click="studentStore.submitDialogForm(dialogFormRef)"
          :disabled="studentStore.btnDisabled"
        >
          <span style="color: white">确定</span>
        </el-button>
        <el-button
          size="large"
          @click="studentStore.addStudentDialogVisible = false"
        >
          取消
        </el-button>
      </div>
    </template>
  </el-dialog>
  <!-- 批量激活绘本 -->
  <el-dialog
    v-model="studentStore.hbDialogVisible"
    title="绘本激活"
    width="500"
  >
    <el-form :model="studentStore.jcForm" label-width="120px">
      <el-form-item label="科目">
        <el-select
          v-model="studentStore.hbForm.mealId"
          placeholder="请选择绘本套餐"
        >
          <el-option label="Lv 1级绘本阅读套餐" :value="1" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog_footer">
        <el-button
          size="large"
          color="#2eba78"
          @click="studentStore.activePictureBook(multipleTableRef)"
        >
          <span style="color: white">确定</span>
        </el-button>
        <el-button size="large" @click="studentStore.hbDialogVisible = false">
          取消
        </el-button>
      </div>
    </template>
  </el-dialog>
  <!-- 批量激活教材 -->
  <el-dialog
    v-model="studentStore.jcDialogVisible"
    title="教材激活"
    width="500"
  >
    <!-- :before-close="handleClose" -->
    <el-form :model="studentStore.jcForm" label-width="120px">
      <el-form-item label="科目">
        <el-select
          v-model="studentStore.jcForm.subjectId"
          placeholder="请选择科目"
        >
          <el-option label="中文" :value="1" />
          <el-option label="英文" :value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="系列/教材">
        <el-cascader
          v-model="studentStore.jcCascadeValue"
          :options="studentStore.jcOptions"
          :props="jcProps"
          placeholder="请选择系列/教材"
          @change="studentStore.handleJCChange"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog_footer">
        <el-button
          size="large"
          color="#2eba78"
          @click="studentStore.activeMaterials(multipleTableRef)"
        >
          <span style="color: white">确定</span>
        </el-button>
        <el-button size="large" @click="studentStore.jcDialogVisible = false">
          取消
        </el-button>
      </div>
    </template>
  </el-dialog>
  <!-- 批量激活AI课 -->
  <el-dialog
    v-model="studentStore.AIDialogVisible"
    title="AI课激活"
    width="500"
  >
    <!-- :before-close="handleClose" -->
    <el-form :model="studentStore.jcForm" label-width="120px">
      <el-form-item label="科目">
        <el-select
          v-model="studentStore.jcForm.subjectId"
          placeholder="请选择科目"
        >
          <el-option label="中文" :value="1" />
          <el-option label="英文" :value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="系列/教材">
        <el-cascader
          v-model="studentStore.jcCascadeValue"
          :options="studentStore.jcOptions"
          :props="jcProps"
          placeholder="请选择系列/教材"
          @change="studentStore.handleJCChange"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog_footer">
        <el-button
          size="large"
          color="#2eba78"
          @click="studentStore.activateAiTeaching(multipleTableRef)"
        >
          <span style="color: white">确定</span>
        </el-button>
        <el-button size="large" @click="studentStore.AIDialogVisible = false">
          取消
        </el-button>
      </div>
    </template>
    <!-- <template #footer>
      <div class="dialog_footer">
        <el-button
          size="large"
          color="#2eba78"
          @click="studentStore.AIDialogVisible = false"
        >
          <span style="color: white">确定</span>
        </el-button>
        <el-button size="large" @click="studentStore.AIDialogVisible = false">
          取消
        </el-button>
      </div>
    </template> -->
  </el-dialog>
  <!-- 批量导入学生 -->
  <el-dialog
    v-model="studentStore.importStudentsDialogVisible"
    title="批量导入学生"
    :close-on-click-modal="false"
    width="1000"
  >
    <div
      v-if="studentStore.importStudentsTableData.length === 0"
      class="importstudents"
    >
      <el-upload
        class="upload-demo"
        drag
        :on-change="studentStore.resolveXLSX"
        :auto-upload="false"
        :limit="1"
      >
        <el-icon class="el-icon--upload">
          <upload-filled />
        </el-icon>
        <div class="el-upload__text">
          将文件拖拽至此 或<em>点击这里</em> 进行上传
        </div>
      </el-upload>
    </div>
    <div v-else class="importstudentstable">
      <el-table
        ref="multipleTableRef"
        :data="studentStore.importStudentsTableData"
        style="width: 100%"
      >
        <el-table-column property="stuName" label="学生姓名" />
        <el-table-column property="phone" label="联系方式" />
        <el-table-column property="startDate" label="出生日期" />
        <el-table-column property="sex" label="性别" />
        <el-table-column property="enrolTime" label="入校时间" />
        <el-table-column property="address" label="地区" />
        <el-table-column property="publicSchool" label="公立校" />
        <el-table-column property="campName" label="校区名称" />
        <el-table-column property="wx" label="微信号" />
        <el-table-column property="schoolTime" label="在校时间" />
      </el-table>
    </div>
    <template #footer>
      <div class="dialog_footer">
        <el-button
          size="large"
          color="#2eba78"
          @click="studentStore.importStudents"
        >
          <span style="color: white">批量上传</span>
        </el-button>
        <el-button
          size="large"
          @click="studentStore.importStudentsDialogVisible = false"
        >
          取消
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
.students_top {
  margin-bottom: 15px;

  .students_top_form {
    height: 35px;
  }
}

.students_container {
  .students_container_header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}

.dialogformbox {
  padding: 10px 30px;
}

.dialog_footer {
  text-align: center;

  .el-button {
    width: 130px;
    margin: 0 20px;
  }
}

.avatar-uploader .avatar {
  width: 100px;
  height: 100px;
  display: block;
}
</style>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  text-align: center;
}
</style>
