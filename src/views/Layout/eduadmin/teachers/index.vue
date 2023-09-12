<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
import { Plus } from '@element-plus/icons-vue'
import type { FormInstance } from 'element-plus'

import { useCommonStore } from '@/stores/common'
const commonStore = useCommonStore()
import { useTeacherStore } from '@/stores/eduadmin/teacher/list'
const teacherStore = useTeacherStore()
import { useTeacherDetailStore } from '@/stores/eduadmin/teacher/detail'
const teacherDStore = useTeacherDetailStore()

onMounted(() => {
  teacherStore.getTeachers()
  teacherStore.getCampusList()
  teacherStore.getRoles()
})

// 添加表单的实例
const dialogFormRef = ref<FormInstance>()

const goDetailAndEdit = (id: number) => {
  teacherDStore.idFromList = true
  router.push('/eduadmin/teachers/' + id)
}
</script>

<template>
  <el-card class="teachers_top">
    <el-form
      inline
      :model="teacherStore.teachersForm"
      class="teachers_top_form"
      label-width="100"
      label-position="left"
    >
      <el-form-item label="校区筛选">
        <el-select
          v-model="teacherStore.teachersForm.campusId"
          placeholder="请选择校区"
        >
          <el-option label="全部校区" value="" />
          <el-option
            v-for="item in teacherStore.allCampus"
            :key="item.id"
            :label="item.campName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="教师筛选">
        <el-input
          v-model="teacherStore.teachersForm.teacher"
          placeholder="请输入教师姓名或手机号"
        />
      </el-form-item>
      <el-form-item>
        <el-button color="#2eba78" @click="teacherStore.onSearch">
          <span style="color: white"> 搜索 </span>
        </el-button>
      </el-form-item>
    </el-form>
  </el-card>
  <el-card class="teachers_container">
    <template #header>
      <div class="teachers_container_header">
        <span>教师列表</span>
        <div>
          <el-button
            color="#2eba78"
            @click="teacherStore.callDialog(dialogFormRef)"
          >
            <span style="color: white">添加教师</span>
          </el-button>
          <el-button type="" link @click="teacherStore.showExplain = true">
            角色说明
          </el-button>
        </div>
      </div>
    </template>
    <el-table :data="teacherStore.teacherList" style="width: 100%">
      <el-table-column prop="teName" label="教师姓名" width="150" />
      <el-table-column prop="tePhone" label="联系方式" width="140" />
      <el-table-column label="角色" width="130">
        <template #default="{ row }">
          {{ teacherStore.getRoleName(row.roleId) }}
        </template>
      </el-table-column>
      <el-table-column prop="className" label="负责班级" width="240" />
      <el-table-column prop="classCount" label="班级数量" width="100" />
      <el-table-column label="操作">
        <template #default="{ row }">
          <div
            class="form_btn form_btn_primary"
            @click="router.push('/eduadmin/teachers/' + row.id)"
          >
            查看
          </div>
          <div
            class="form_btn form_btn_primary"
            @click="goDetailAndEdit(row.id)"
          >
            编辑
          </div>
          <div
            class="form_btn form_btn_warning"
            @click="teacherStore.deleteTeacher(row.id)"
          >
            删除
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="paginationbox">
      <el-pagination
        class="commonpagination"
        v-model:current-page="teacherStore.teachersQuery.page"
        v-model:page-size="teacherStore.teachersQuery.size"
        :page-sizes="[10, 20, 30, 40, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="teacherStore.total"
        @size-change="teacherStore.paginationhandle"
        @current-change="teacherStore.paginationhandle"
      />
    </div>
  </el-card>
  <!-- 添加教师 -->
  <el-dialog v-model="teacherStore.dialogVisible" width="700" title="创建教师">
    <div class="dialogformbox">
      <el-form
        :model="teacherStore.dialogForm"
        ref="dialogFormRef"
        :rules="teacherStore.dialogFormRules"
        label-width="100"
        size="large"
        label-position="left"
      >
        <el-form-item label="教师姓名" prop="teName">
          <el-input
            v-model="teacherStore.dialogForm.teName"
            placeholder="请输入教师姓名"
          />
        </el-form-item>
        <el-form-item label="教师手机号" prop="tePhone">
          <el-input
            v-model="teacherStore.dialogForm.tePhone"
            placeholder="请输入教师手机号"
          />
        </el-form-item>
        <el-form-item label="登录密码" prop="password">
          <el-input
            v-model="teacherStore.dialogForm.password"
            placeholder="请输入登录密码"
          />
        </el-form-item>
        <el-form-item label="所属校区" prop="campId">
          <el-select
            v-model="teacherStore.dialogForm.campId"
            placeholder="请选择校区"
            style="width: 100%"
          >
            <el-option
              v-for="item in teacherStore.allCampus"
              :key="item.id"
              :label="item.campName"
              :value="item.id"
            />
            <el-option label="销售" :value="5" />
          </el-select>
        </el-form-item>
        <el-form-item label="角色" prop="roleId">
          <el-select
            v-model="teacherStore.dialogForm.roleId"
            placeholder="请选择角色"
            style="width: 100%"
          >
            <el-option label="老师" :value="3" />
            <el-option label="销售" :value="4" />
          </el-select>
        </el-form-item>
        <el-form-item label="头像">
          <el-upload
            class="avatar-uploader"
            :action="commonStore.uploadUrl"
            :headers="commonStore.uploadHeader"
            :show-file-list="false"
            :on-success="teacherStore.handleAvatarSuccess"
            :before-upload="teacherStore.beforeAvatarUpload"
            :on-progress="teacherStore.handleAvatarProgress"
            :on-error="teacherStore.handleAvatarError"
          >
            <img
              v-if="teacherStore.imageUrl"
              :src="teacherStore.imageUrl"
              class="avatar"
            />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="简介">
          <el-input
            v-model="teacherStore.dialogForm.info"
            type="textarea"
            :rows="4"
          />
        </el-form-item>
      </el-form>
    </div>

    <template #footer>
      <div class="dialog_footer">
        <el-button
          size="large"
          color="#2eba78"
          @click="teacherStore.submitDialogForm(dialogFormRef)"
          :disabled="teacherStore.btnDisabled"
        >
          <span style="color: white">确定</span>
        </el-button>
        <el-button size="large" @click="teacherStore.dialogVisible = false">
          取消
        </el-button>
      </div>
    </template>
  </el-dialog>
  <!-- 角色说明 -->
  <el-dialog v-model="teacherStore.showExplain" title="角色和权限">
    <el-table :data="teacherStore.explainData">
      <el-table-column property="rname" label="角色名称" width="160" />
      <el-table-column property="roleInfo" label="角色权限" />
    </el-table>
  </el-dialog>
</template>

<style lang="scss" scoped>
.teachers_top {
  margin-bottom: 15px;
  .teachers_top_form {
    height: 35px;
  }
}
.teachers_container {
  .teachers_container_header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}

.dialogformbox {
  padding: 0 40px;
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
@/api/index22
