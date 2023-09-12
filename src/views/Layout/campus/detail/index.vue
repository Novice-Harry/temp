<script lang="ts" setup>
import { onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()

import { ArrowLeft } from '@element-plus/icons-vue'

import { useCampDetailStore } from '@/stores/campus/detail'
const campDetailStore = useCampDetailStore()

onMounted(() => {
  campDetailStore.getRoleList()
  campDetailStore.getCampusById(route.params.id as unknown as number)
})
</script>

<template>
  <el-card class="newcampus_container">
    <template #header>
      <div class="card_header">
        <el-button
          class="backbtn"
          :icon="ArrowLeft"
          link
          @click="router.back()"
        >
          返回
        </el-button>
        <span style="font-weight: 600">
          {{ campDetailStore.campusForm.campName }}
        </span>
      </div>
    </template>

    <div style="padding: 20px 40px">
      <el-form
        inline
        class="newcampus_form_require"
        label-width="110"
        label-position="left"
        size="large"
      >
        <el-form-item label="校区名称">
          <div class="item" style="width: 200px">
            {{ campDetailStore.campusForm.campName }}
          </div>
        </el-form-item>
        <el-form-item label="分校区负责人">
          <div class="item" style="width: 200px">
            {{ campDetailStore.campusForm.username }}
          </div>
        </el-form-item>
        <el-form-item label="角色">
          <div class="item" style="width: 200px">
            {{ campDetailStore.getRoleName }}
          </div>
        </el-form-item>
      </el-form>
      <el-form
        inline
        class="newcampus_form_require"
        label-width="110"
        label-position="left"
        size="large"
      >
        <el-form-item label="手机号">
          <div class="item" style="width: 200px">
            {{ campDetailStore.campusForm.phone }}
          </div>
        </el-form-item>
        <el-form-item label="校区地址">
          <div class="item" style="width: 200px">
            {{ campDetailStore.campusForm.address }}
          </div>
        </el-form-item>
        <el-form-item
          label="详细地址"
          v-if="campDetailStore.campusForm.addressInfo !== ''"
        >
          <div class="item" style="width: 200px">
            {{ campDetailStore.campusForm.addressInfo }}
          </div>
        </el-form-item>
      </el-form>
      <el-form
        :inline="true"
        class="newcampus_form_notrequire"
        label-width="110"
        label-position="left"
        size="large"
      >
        <el-form-item label="地图定位">
          <baidu-map
            class="map"
            :scroll-wheel-zoom="true"
            :center="campDetailStore.center"
            :zoom="campDetailStore.zoom"
          />
        </el-form-item>
      </el-form>
    </div>
  </el-card>
</template>

<style lang="scss" scoped>
.newcampus_container {
  .card_header {
    display: flex;
    align-items: center;
    .backbtn {
      margin-right: 120px;
    }
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
