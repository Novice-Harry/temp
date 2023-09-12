<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
import { Plus, Edit } from '@element-plus/icons-vue'
import type { CascaderOption, ElTable, FormInstance } from 'element-plus'
import { timeFormater } from '@/utils/format'

import { useCommonStore } from '@/stores/common'
const commonStore = useCommonStore()
import { useStudentDetailStore } from '@/stores/eduadmin/student/detail'
const studentDStore = useStudentDetailStore()

onMounted(() => {
  studentDStore.getStudentInfo(route.params.id as unknown as number)
  studentDStore.getClassInfo()
  studentDStore.getMateials()
  studentDStore.getMeals()
})

// 编辑表单的实例
const dialogFormRef = ref<FormInstance>()

// 系列/教程级联框配置
const props = {
  expandTrigger: 'hover' as const,
  label: 'typeName',
  value: 'id'
}

// 单选表格ref
const singleTableRef = ref<InstanceType<typeof ElTable>>()
</script>

<template>
  <el-card>
    <div class="students_detail_container">
      <div class="left">
        <!-- 头像姓名电话 -->
        <div class="teacherinfo">
          <div class="editbtn">
            <el-button
              type="success"
              :icon="Edit"
              link
              @click="studentDStore.addStudentDialogVisible = true"
            >
              编辑
            </el-button>
          </div>
          <div class="avator">
            <el-avatar
              shape="square"
              :size="50"
              :src="
                studentDStore.detailData.data.photo
                  ? studentDStore.detailData.data.photo
                  : 'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png'
              "
            />
          </div>
          <el-skeleton :rows="1" :loading="studentDStore.loading" animated>
            <template #default>
              <div class="teachername">
                {{ studentDStore.detailData.data.stuName }}
              </div>
              <div class="teachertel">
                {{ studentDStore.detailData.data.phone }}
              </div>
            </template>
          </el-skeleton>
        </div>
        <!-- 详情 -->
        <div class="desc">
          <el-skeleton :rows="10" :loading="studentDStore.loading" animated>
            <template #default>
              <div class="line">
                学生ID：{{ studentDStore.detailData.data.id }}
              </div>
              <div class="line">
                性别：{{
                  studentDStore.detailData.data.sex === 1 ? '男' : '女'
                }}
              </div>
              <div class="line">
                出生日期：{{ studentDStore.detailData.data.startDate }}
              </div>
              <div class="line">
                微信：{{ studentDStore.detailData.data.wx }}
              </div>
              <div class="line">
                公立学校：{{ studentDStore.detailData.data.publicSchool }}
              </div>
              <div class="line">
                所在地区：{{ studentDStore.detailData.data.address }}
              </div>
              <div class="line">
                入校时间：{{
                  timeFormater(studentDStore.detailData.data.enrolTime)
                }}
              </div>
              <div class="line">
                在校时长：{{ studentDStore.detailData.data.schoolTime }}天
              </div>
              <div class="line">
                最近登录APP时间：{{
                  studentDStore.detailData.data.lastLoginTime
                }}
              </div>
              <div class="line">
                所在班级：{{ studentDStore.detailData.data.campName }}
              </div>
            </template>
          </el-skeleton>
        </div>
      </div>
      <div class="right">
        <el-tabs v-model="studentDStore.activeName" class="demo-tabs">
          <el-tab-pane label="所在班级" :name="1">
            <el-table :data="studentDStore.classlist">
              <el-table-column prop="className" label="班级名称" />
              <el-table-column prop="headTeacherName" label="班主任" />
              <el-table-column prop="classAssistant" label="助教" />
              <el-table-column prop="classCourse" label="关联课程" />
              <el-table-column width="80">
                <template #header>
                  <span style="color: red">科目</span>
                </template>
                <template #default="{ row }">
                  <span style="color: red">{{ row.subjectName }}</span>
                </template>
              </el-table-column>
              <el-table-column label="节课状态">
                <template #default="{ row }">
                  {{ row.status === 1 ? '未结课' : '已结课' }}
                </template>
              </el-table-column>
              <el-table-column prop="startTime" label="入班时间" />
              <el-table-column prop="address" label="操作" width="180">
                <template #default="{ row }">
                  <div
                    class="form_btn form_btn_primary"
                    @click="studentDStore.callChangeClaassDialog"
                  >
                    选班调班
                  </div>
                  <div
                    class="form_btn form_btn_primary"
                    @click="studentDStore.quitClass(row.id)"
                  >
                    移出班级
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="所学教材" :name="2">
            <el-table :data="studentDStore.materials" width="100%">
              <el-table-column prop="materialsName" label="教材名称" />
              <el-table-column width="80">
                <template #header>
                  <span style="color: red">科目</span>
                </template>
                <template #default="{ row }">
                  <span style="color: red">
                    {{ row.subjectId === 1 ? '中文' : '英文' }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column prop="serialNumber" label="序列号" />
              <el-table-column prop="remainingDate" label="剩余天数" />
              <el-table-column label="AI课">
                <template #default="{ row }">
                  {{ row.aiStatus === 1 ? '未激活' : '已激活' }}
                </template>
              </el-table-column>
              <!-- <el-table-column prop="address" label="操作" width="180">
                <template #default="{ row }">
                  <div class="form_btn form_btn_primary" @click="row.id">
                    选班调班
                  </div>
                  <div class="form_btn form_btn_primary" @click="row.id">
                    移出班级
                  </div>
                </template>
              </el-table-column> -->
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="所得积分" :name="3">
            <el-table :data="[{}]" width="100%">
              <el-table-column label="累计积分">
                <template #default>1000</template>
              </el-table-column>
              <el-table-column label="可用积分">
                <template #default>300</template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="绘本馆" :name="4">
            <el-table :data="studentDStore.meals" width="100%">
              <el-table-column prop="mealName" label="套餐名称" />
              <el-table-column prop="validity" label="有效天数" />
              <el-table-column prop="residue" label="剩余天数" />
              <el-table-column label="开通时间">
                <template #default="{ row }">
                  {{ timeFormater(row.startDate) }}
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </el-card>

  <!-- 编辑学生 -->
  <el-dialog
    v-model="studentDStore.addStudentDialogVisible"
    width="700"
    title="编辑学生"
  >
    <div class="dialogformbox">
      <el-form
        :model="studentDStore.dialogForm"
        ref="dialogFormRef"
        :rules="studentDStore.dialogFormRules"
        label-width="100"
        size="large"
        label-position="left"
      >
        <el-form-item label="学生姓名" prop="stuName">
          <el-input
            v-model="studentDStore.dialogForm.stuName"
            placeholder="请输入教师姓名"
          />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input
            v-model="studentDStore.dialogForm.phone"
            placeholder="请输入教师手机号"
          />
        </el-form-item>
        <el-form-item label="出生日期" prop="startDate">
          <el-date-picker
            v-model="studentDStore.dialogForm.startDate"
            type="date"
            placeholder="请选择日期"
            style="width: 100%"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-radio-group v-model="studentDStore.dialogForm.sex" class="ml-4">
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
            :on-success="studentDStore.handleAvatarSuccess"
            :before-upload="studentDStore.beforeAvatarUpload"
            :on-progress="studentDStore.handleAvatarProgress"
            :on-error="studentDStore.handleAvatarError"
          >
            <img
              v-if="studentDStore.imageUrl"
              :src="studentDStore.imageUrl"
              class="avatar"
            />
            <el-icon v-else class="avatar-uploader-icon">
              <Plus />
            </el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="微信">
          <el-input
            v-model="studentDStore.dialogForm.wx"
            placeholder="请输入微信"
          />
        </el-form-item>
        <el-form-item label="地区">
          <el-input
            v-model="studentDStore.dialogForm.address"
            placeholder="请输入地区"
          />
        </el-form-item>
        <el-form-item label="公立校">
          <el-input
            v-model="studentDStore.dialogForm.publicSchool"
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
          @click="studentDStore.submitDialogForm(dialogFormRef)"
          :disabled="studentDStore.btnDisabled"
        >
          <span style="color: white">确定</span>
        </el-button>
        <el-button
          size="large"
          @click="studentDStore.addStudentDialogVisible = false"
        >
          取消
        </el-button>
      </div>
    </template>
  </el-dialog>
  <!-- 选班调班 -->
  <el-dialog
    v-model="studentDStore.changeClaassDialogVisible"
    :show-close="false"
    width="1000"
  >
    <el-card class="classes_top" style="margin-bottom: 15px">
      <el-form
        :inline="true"
        :model="studentDStore.searchForm"
        label-width="80px"
      >
        <el-form-item label="校区筛选">
          <el-select
            v-model="studentDStore.searchForm.campId"
            placeholder="请选择校区"
            style="width: 177px"
          >
            <el-option label="全部校区" value="" />
            <el-option
              v-for="item in studentDStore.campList"
              :key="item.id"
              :label="item.campName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <template #label><span style="color: red">科目</span></template>
          <el-select
            placeholder="请选择科目"
            style="width: 177px"
            v-model="studentDStore.searchForm.subjectId"
            class="tsinput"
          >
            <el-option label="全部科目" value="" />
            <el-option label="中文" :value="1" />
            <el-option label="英文" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="系列/教材">
          <el-cascader
            v-model="studentDStore.cascaderValue"
            :options="studentDStore.options as CascaderOption[]"
            :props="props"
            placeholder="请选择系列/教材"
            style="width: 177px"
            @change="studentDStore.handleChange"
          />
        </el-form-item>
        <el-form-item label="班级名称">
          <el-input
            v-model="studentDStore.searchForm.className"
            placeholder="请输入班级名称"
          />
        </el-form-item>
        <el-form-item label="结课状态">
          <el-select
            placeholder="请选择节课状态"
            style="width: 177px"
            v-model="studentDStore.searchForm.status"
          >
            <el-option label="未结课" :value="1" />
            <el-option label="已节课" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="班主任">
          <el-input
            v-model="studentDStore.searchForm.headTeacherName"
            placeholder="请输入教师姓名"
          />
        </el-form-item>
        <el-form-item>
          <template #label><span> </span></template>
          <el-button color="#2eba78" @click="studentDStore.onSearch">
            <span style="color: white">搜索</span>
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="classes_container">
      <el-table
        ref="singleTableRef"
        highlight-current-row
        :data="studentDStore.otherClasses"
        style="width: 100%"
        @current-change="studentDStore.handleCurrentChange"
      >
        <el-table-column prop="className" label="班级姓名" />
        <el-table-column prop="campName" label="所属校区" />
        <el-table-column prop="headTeacherName" label="班主任" />
        <el-table-column prop="classCourse" label="关联课程" />
        <el-table-column prop="subjectName">
          <template #header><span style="color: red">科目</span></template>
        </el-table-column>
        <el-table-column label="结课状态">
          <template #default="{ row }">
            {{ row.status === 1 ? '未结课' : '已结课' }}
          </template>
        </el-table-column>
        <el-table-column prop="classEndingTime" label="结课时间" />
        <el-table-column prop="classCount" label="班级人数" />
      </el-table>
    </el-card>
    <template #footer>
      <div class="dialog_footer">
        <el-button
          size="large"
          color="#2eba78"
          @click="studentDStore.changeClass(singleTableRef)"
        >
          <span style="color: white">确定</span>
        </el-button>
        <el-button
          size="large"
          @click="studentDStore.changeClaassDialogVisible = false"
        >
          取消
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
.students_detail_container {
  display: flex;
  justify-content: space-between;

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
    width: calc(100% - 240px);
    padding: 10px;
    padding-left: 30px;
    box-sizing: border-box;
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

.tsinput::placeholder {
  color: red !important;
}
</style>
