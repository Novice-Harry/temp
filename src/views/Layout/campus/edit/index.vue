<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()
import { useEditCampStore } from '@/stores/campus/edit'
const editCampStore = useEditCampStore()

import { pcaTextArr as options } from 'element-china-area-data'
import type { CascaderOption, FormInstance } from 'element-plus'

// 第一行表单实例
const campusForm1Ref = ref<FormInstance>()
// 第二行表单实例
const campusForm2Ref = ref<FormInstance>()

// 编辑
const editCampus = async () => {
  let flag = false
  await campusForm1Ref.value?.validate((valid) => (flag = valid))
  await campusForm2Ref.value?.validate((valid) => (flag = valid))
  if (!flag) {
    return
  }
  editCampStore.editCampus()
}
onMounted(() => {
  editCampStore.getRoleList()
  // 根据id去获取校区数据
  editCampStore.getCampusById(route.params.campId as unknown as number)
})
</script>

<template>
  <el-card class="newcampus_container">
    <el-form
      inline
      :model="editCampStore.campusForm"
      ref="campusForm1Ref"
      :rules="editCampStore.campusFormRules"
      class="newcampus_form_require"
      label-width="110"
      label-position="left"
      size="large"
    >
      <el-form-item label="校区名称" prop="campName">
        <el-input
          v-model="editCampStore.campusForm.campName"
          placeholder="请输入校区名称"
        />
      </el-form-item>
      <el-form-item label="分校区负责人" prop="username">
        <el-input
          v-model="editCampStore.campusForm.username"
          placeholder="请输入负责人姓名"
        />
      </el-form-item>
      <el-form-item label="角色" label-width="60" prop="roleId">
        <el-select
          v-model="editCampStore.campusForm.roleId"
          placeholder="请选择角色"
        >
          <el-option
            v-for="role in editCampStore.roleList"
            :key="role.id"
            :label="role.rname"
            :value="role.id"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <el-form
      inline
      :model="editCampStore.campusForm"
      ref="campusForm2Ref"
      :rules="editCampStore.campusFormRules"
      class="newcampus_form_require"
      label-width="110"
      label-position="left"
      size="large"
    >
      <el-form-item label="手机号" prop="phone">
        <el-input
          v-model="editCampStore.campusForm.phone"
          placeholder="请输入手机号"
        />
      </el-form-item>
      <el-form-item label="登录密码" prop="password">
        <el-input
          v-model="editCampStore.campusForm.password"
          placeholder="请输入登录密码"
        />
      </el-form-item>
    </el-form>
    <el-form
      :inline="true"
      :model="editCampStore.campusForm"
      class="newcampus_form_notrequire"
      label-width="110"
      label-position="left"
      size="large"
    >
      <el-form-item label="校区地址">
        <el-cascader
          v-model="editCampStore.cascaderValue"
          :options="options as CascaderOption[]"
          :props="editCampStore.props"
          placeholder="请选择"
          style="width: 250px"
          @change="editCampStore.handleChange"
        />
      </el-form-item>
      <el-form-item label="详细地址">
        <el-input
          v-model="editCampStore.campusForm.addressInfo"
          placeholder="请输入详细地址"
          @change="editCampStore.handleDetailAddressChange"
        />
      </el-form-item>
    </el-form>
    <el-form
      :inline="true"
      :model="editCampStore.campusForm"
      class="newcampus_form_notrequire"
      label-width="110"
      label-position="left"
      size="large"
    >
      <el-form-item label="地图定位">
        <baidu-map
          class="map"
          :scroll-wheel-zoom="true"
          :center="editCampStore.center"
          :zoom="editCampStore.zoom"
        />
      </el-form-item>
    </el-form>
    <p style="text-align: center">
      <el-button
        color="#2eba78"
        size="large"
        style="width: 160px"
        @click="editCampus"
      >
        <span style="color: white">确定</span>
      </el-button>
      <el-button size="large" style="width: 160px" @click="router.back()">
        取消
      </el-button>
    </p>
  </el-card>
</template>

<style lang="scss" scoped>
.newcampus_container {
  padding: 20px 40px;
  .el-input {
    width: 250px !important;
  }

  .map {
    width: 652px;
    height: 340px;
    box-shadow: 0 0 10px #ccc;
  }
  .el-button {
    margin: 0 30px;
  }
}
</style>
@/api/index22
