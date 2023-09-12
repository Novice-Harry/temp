<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()

import { WarningFilled } from '@element-plus/icons-vue'
import type { CascaderOption } from 'element-plus'

import { eduadminApis } from '@/api'
import { onMounted } from 'vue'

// 系列/教程级联框配置
const props = {
  expandTrigger: 'hover' as const,
  label: 'typeName',
  value: 'id'
}
// 级联框value
const cascaderValue = ref<string[]>([])
// 级联框change事件
const handleChange = () => {
  // 去赋值
  // searchForm.typeId = cascaderValue.value.at(-1) as string
}
// 级联框数据来源
const options = ref([])
// 获取数据源
const getCascaderOption = async () => {
  const res = await eduadminApis.studentsApis.getMaterialsApi()
  options.value = res.data
  // console.log(res)
}
const list = ref<any[]>([])
const total = ref(0)
const getListParams = reactive({
  page: 1,
  size: 5
})
const getList = async () => {
  await 1
  list.value = []
}

onMounted(() => {
  getList()
  getCascaderOption()
})
// 搜索
const onSearch = () => {
  getListParams.page = 1

  getList()
}
// 重置搜索表单
const onReset = () => {
  getListParams.page = 1

  getList()
}
// 计费说明
const payDescVisible = ref(false)
</script>

<template>
  <el-card>
    <div class="box">
      <div class="left">
        {{ '北京走向未来' }} （总学豆 {{ 200 }}，剩余学豆{{ 150 }}，已用学豆
        {{ 50 }}）
        <el-button :icon="WarningFilled" link @click="payDescVisible = true">
          查看计费说明
        </el-button>
      </div>
      <div class="right">
        <el-button type="primary" @click="router.push('/orders/scores/record')">
          购买记录
        </el-button>
      </div>
    </div>
  </el-card>
  <el-card style="margin: 15px 0">
    <el-form inline>
      <el-form-item label="选择校区">
        <el-select>
          <el-option :value="1">??</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="系列/教材">
        <el-cascader
          v-model="cascaderValue"
          :options="options as CascaderOption[]"
          :props="props"
          placeholder="请选择系列/教材"
          style="width: 177px"
          @change="handleChange"
        />
      </el-form-item>
      <el-form-item label="班级名称">
        <el-input placeholder="请输入班级名称" />
      </el-form-item>
      <el-form-item label="授课老师">
        <el-input placeholder="请输入老师姓名" />
      </el-form-item>
      <el-form-item label="日期">
        <el-date-picker
          type="daterange"
          range-separator="至"
          start-placeholder="选择日期"
          end-placeholder="选择日期"
          format="YYYY/MM/DD"
          value-format="YYYY-MM-DD"
        />
      </el-form-item>
      <el-form-item label="互动设备">
        <el-select>
          <el-option :value="1">??</el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSearch">搜索</el-button>
        <el-button @click="onReset">搜索</el-button>
      </el-form-item>
    </el-form>
  </el-card>
  <el-card class="list">
    <template #header>
      <div class="top">
        <div class="title">列表</div>
        <el-button type="primary">导出</el-button>
      </div>
    </template>
    <el-table :data="list">
      <el-table-column type="selection" />
      <el-table-column label="校区" prop="" />
      <el-table-column label="班级名称" prop="" />
      <el-table-column label="教材/单元/模块" prop="" />
      <el-table-column label="小号学豆" prop="" />
      <el-table-column label="日期" prop="" />
      <el-table-column label="授课老师" prop="" />
      <el-table-column label="手机" prop="" />
      <el-table-column label="上课人数/总人数">
        <template #default>
          {{}}/{{}}
          <el-button type="primary" link>查看</el-button>
        </template>
      </el-table-column>
      <el-table-column label="互动详情">
        <template #default>
          {{ '答题器' }}
          <el-button type="primary" link>查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination_box">
      <el-pagination
        v-model:current-page="getListParams.page"
        v-model:page-size="getListParams.size"
        :page-sizes="[5, 10, 20, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="getList"
        @current-change="getList"
      />
    </div>
  </el-card>
  <!-- 计费说明 -->
  <el-dialog
    v-model="payDescVisible"
    title="计费说明"
    width="500"
    class="payDescDialog"
  >
    <p>1.答题器/pad版本授课端，只有教学环节中触发互动设备，才会扣学豆；</p>
    <p>2.学豆以模块为单位，扣取对应的学豆；</p>
    <p>3.同一个班级，2.5个小时内使用相同的模块进行授课，不会重复扣学豆！</p>
    <p>
      4.因为网络，断电等意外情况暂时无法继续上课的，在2.5个小时内继续上课的，不会重复计费；
    </p>
    <p>
      5.AI课/AI双师课教学环节，2分钟内未进行互动下发操作并退出本教学环节，则视为误操作不扣费；AI课/AI双师课在第一个互动内容自动下发前退出，则视为误操作不扣费；
    </p>
    <p>6.游戏教学环节，游戏后，自动触发扣费；</p>
  </el-dialog>
  <!-- 上课人员查看 -->
  <el-dialog></el-dialog>
  <!-- 互动详情 -->
  <el-dialog></el-dialog>
</template>

<style lang="scss" scoped>
.box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .left {
    font-size: 14px;
    .el-button {
      vertical-align: middle;
      color: #409eff;
      margin-left: 20px;
    }
  }
}

.list {
  .top {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .title {
      font-size: 14px;
    }
  }
  .pagination_box {
    display: flex;
    margin-top: 15px;
    justify-content: flex-end;
  }
}

.payDescDialog {
  p {
    line-height: 40px;
  }
}
</style>
