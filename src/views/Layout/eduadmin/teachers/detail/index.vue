<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
import { Plus, Edit } from '@element-plus/icons-vue'
import type { FormInstance } from 'element-plus'

import { timeFormater } from '@/utils/format'
import { useCommonStore } from '@/stores/common'
const commonStore = useCommonStore()
import { useTeacherDetailStore } from '@/stores/eduadmin/teacher/detail'
const teacherDStore = useTeacherDetailStore()

onMounted(() => {
  teacherDStore.resetAll()
  teacherDStore.getTeacherInfo(route.params.id as unknown as number)
  teacherDStore.getCampusList()
  teacherDStore.getRoles()
})

// 添加/编辑表单的实例
const dialogFormRef = ref<FormInstance>()
</script>

<template>
  <el-card>
    <div class="teachers_detail_container">
      <div class="left">
        <div class="teacherinfo">
          <div class="editbtn">
            <el-button
              type="success"
              :icon="Edit"
              link
              @click="teacherDStore.dialogVisible = true"
            >
              编辑
            </el-button>
          </div>
          <div class="avator">
            <el-avatar
              shape="square"
              :size="50"
              :src="
                teacherDStore.info.photo
                  ? teacherDStore.info.photo
                  : 'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png'
              "
            />
          </div>
          <el-skeleton :rows="1" :loading="teacherDStore.loading" animated>
            <template #default>
              <div class="teachername">
                {{ teacherDStore.info.teName }}
              </div>
              <div class="teachertel">{{ teacherDStore.info.tePhone }}</div>
            </template>
          </el-skeleton>
        </div>
        <div class="desc">
          <el-skeleton :rows="5" :loading="teacherDStore.loading" animated>
            <template #default> 简介：{{ teacherDStore.info.info }} </template>
          </el-skeleton>
        </div>
      </div>
      <div class="right">
        <div class="tabs">
          <div class="tab">负责班级</div>
        </div>
        <el-table :data="teacherDStore.tableList" style="width: 100%">
          <el-table-column prop="className" label="班级名称" />
          <el-table-column prop="headTeacherName" label="班主任" />
          <el-table-column prop="classAssistant" label="助教" />
          <el-table-column prop="classCourse" label="关联课程" />
          <el-table-column prop="status" label="节课状态">
            <template #default="{ row }">
              {{ row.status === 1 ? '未结课' : '已结课' }}
            </template>
          </el-table-column>
          <el-table-column prop="classCount" label="班级人数" />
          <el-table-column label="结课时间">
            <template #default="{ row }">
              {{ timeFormater(row.classEndingTime) }}
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </el-card>

  <!-- 编辑教师 -->
  <el-dialog v-model="teacherDStore.dialogVisible" width="700" title="编辑教师">
    <div class="dialogformbox">
      <el-form
        :model="teacherDStore.dialogForm"
        ref="dialogFormRef"
        :rules="teacherDStore.dialogFormRules"
        label-width="100"
        size="large"
        label-position="left"
      >
        <el-form-item label="教师姓名" prop="teName">
          <el-input
            v-model="teacherDStore.dialogForm.teName"
            placeholder="请输入教师姓名"
          />
        </el-form-item>
        <el-form-item label="教师手机号" prop="tePhone">
          <el-input
            v-model="teacherDStore.dialogForm.tePhone"
            placeholder="请输入教师手机号"
          />
        </el-form-item>
        <el-form-item label="登录密码" prop="password">
          <el-input
            v-model="teacherDStore.dialogForm.password"
            placeholder="请输入登录密码"
          />
        </el-form-item>
        <el-form-item label="所属校区" prop="campId">
          <el-select
            v-model="teacherDStore.dialogForm.campId"
            placeholder="请选择校区"
            style="width: 100%"
          >
            <el-option
              v-for="item in teacherDStore.allCampus"
              :key="item.id"
              :label="item.campName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="角色" prop="roleId">
          <el-select
            v-model="teacherDStore.dialogForm.roleId"
            placeholder="请选择角色"
            style="width: 100%"
          >
            <el-option
              v-for="item in teacherDStore.roleList"
              :key="item.id"
              :label="item.rname"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="头像">
          <el-upload
            class="avatar-uploader"
            :action="commonStore.uploadUrl"
            :headers="commonStore.uploadHeader"
            :show-file-list="false"
            :on-success="teacherDStore.handleAvatarSuccess"
            :before-upload="teacherDStore.beforeAvatarUpload"
            :on-progress="teacherDStore.handleAvatarProgress"
            :on-error="teacherDStore.handleAvatarError"
          >
            <img
              v-if="teacherDStore.imageUrl"
              :src="teacherDStore.imageUrl"
              class="avatar"
            />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="简介">
          <el-input
            v-model="teacherDStore.dialogForm.info"
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
          @click="teacherDStore.submitDialogForm(dialogFormRef)"
          :disabled="teacherDStore.btnDisabled"
        >
          <span style="color: white">确定</span>
        </el-button>
        <el-button size="large" @click="teacherDStore.dialogVisible = false">
          取消
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
.teachers_detail_container {
  display: flex;

  .left {
    width: 200px;
    border-right: 1px solid #ccc;
    padding: 5px 20px;
    .teacherinfo {
      position: relative;
      text-align: center;
      border-bottom: 1px solid #333;
      font-size: 14px;
      padding-top: 20px;
      .editbtn {
        position: absolute;
        right: 5px;
        top: 0px;
      }
      .avator {
        width: 50px;
        height: 50px;
        border-radius: 20px;
        overflow: hidden;
        margin: 0 auto;
      }
      .teachername {
        padding: 10px 0;
      }
      .teachertel {
        padding: 0 0 30px;
      }
    }
    .desc {
      padding: 30px 15px 20px 10px;
      font-size: 12px;
      line-height: 28px;
    }
  }
  .right {
    flex: 1;
    padding: 10px;
    padding-left: 30px;
    .tabs {
      border-bottom: solid 1px #ccc;
      display: flex;
      padding-left: 3px;
      margin-bottom: 15px;
      .tab {
        padding: 10px;
        cursor: pointer;
        color: #2eba78;
        border-bottom: solid 3px #2eba78;
        transform: translateY(2px);
      }
    }
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
