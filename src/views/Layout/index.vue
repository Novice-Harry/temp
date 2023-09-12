<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
const route = useRoute()
const router = useRouter()
import { ArrowRight } from '@element-plus/icons-vue'

import { getMenusApi } from '@/api'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

// 菜单列表
// const menuList = ref<any[]>([])
const menuList = [
  {
    name: '校区管理',
    path: '/campus',
    id: '1',
    children: [
      {
        name: '校区列表',
        path: '/campus',
        id: '1-1'
      }
    ]
  },
  {
    name: '教务管理',
    path: '/eduadmin',
    id: '2',
    children: [
      {
        name: '老师管理',
        path: '/teachers',
        id: '2-1'
      },
      {
        name: '学生管理',
        path: '/students',
        id: '2-2'
      },
      {
        name: '班级管理',
        path: '/classes',
        id: '2-3'
      }
    ]
  },
  {
    name: '服务订购',
    path: '/orders',
    id: '3',
    children: [
      {
        name: '合作教材',
        path: '/textbook',
        id: '3-1'
      },
      {
        name: '合作课件',
        path: '/courseware',
        id: '3-2'
      },
      {
        name: '学豆管理',
        path: '/scores',
        id: '3-3'
      },
      {
        name: '序列号订单',
        path: '/serialorders',
        id: '3-4'
      },
      {
        name: '序列号清单',
        path: '/seriallist',
        id: '3-5'
      },
      {
        name: 'AI课授权',
        path: '/AI',
        id: '3-6'
      }
    ]
  },
  {
    name: '绘本课',
    path: '/pictures',
    id: '4',
    children: [
      {
        name: '绘本开通',
        path: '/activate',
        id: '4-1'
      },
      {
        name: '套餐订单',
        path: '/list',
        id: '4-2'
      },
      {
        name: '阅读统计',
        path: '/report',
        id: '4-3'
      }
    ]
  },
  {
    name: '数据统计',
    path: '/report',
    id: '5',
    children: [
      {
        name: '班级统计',
        path: '/report',
        id: '5-1'
      }
    ]
  },
  {
    name: '专属APP设置',
    path: '/setting',
    id: '6',
    children: [
      {
        name: 'LOGO设置',
        path: '/logo',
        id: '6-1'
      },
      {
        name: '关于我们',
        path: '/about',
        id: '6-2'
      }
    ]
  }
]
// 获取菜单

const getMenuList = async () => {
  // let res: any = await getMenusApi()
  // menuList.value = res.data
}
// 退出登录
const logout = () => {
  userStore.logoutSuccess()
  ElMessage.success('退出登录成功')
}
onMounted(() => {
  getMenuList()
})
</script>

<template>
  <el-container class="layout_container">
    <el-header class="layout_header">
      <div class="logobox" @click="router.push('/')">
        <img class="logo" src="../../assets/logo.png" alt="" />
      </div>
      <div class="userfnbox">
        <div class="userinfo">
          <div class="avator">
            <el-avatar
              :size="36"
              src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
            />
          </div>
          <div class="username">{{ userStore.userinfo.username }}</div>
          <div class="userrole">
            <el-tag type="success" effect="dark" disable-transitions>
              {{ userStore.userinfo.rname }}
            </el-tag>
          </div>
        </div>
        <div class="logout">
          <div class="logoutbtn" @click="logout">退出登录</div>
        </div>
      </div>
    </el-header>
    <el-container>
      <el-aside class="layout_aside" width="180px">
        <el-scrollbar>
          <el-menu
            active-text-color="#d9123b"
            background-color="#22364c"
            class="layout_menu"
            :default-active="route.path"
            text-color="#fff"
            unique-opened
            router
          >
            <el-sub-menu
              v-for="menu in menuList"
              :key="menu.id"
              :index="menu.path"
            >
              <template #title>
                <span>{{ menu.name }}</span>
              </template>
              <el-menu-item
                v-for="submenu in menu.children"
                :key="submenu.id"
                :index="menu.path + submenu.path"
              >
                <template #title>
                  <span>{{ submenu.name }}</span>
                </template>
              </el-menu-item>
            </el-sub-menu>
          </el-menu></el-scrollbar
        >
      </el-aside>
      <el-main class="layout_main">
        <el-scrollbar>
          <div class="layout_bread">
            <el-breadcrumb :separator-icon="ArrowRight" v-if="route.meta.bread">
              <el-breadcrumb-item
                v-for="(item, index) in route.meta.bread"
                :key="index"
                :to="(item as any).path ? (item as any).path : ''"
              >
                {{ (item as any).name }}
              </el-breadcrumb-item>
            </el-breadcrumb>
          </div>
          <RouterView />
        </el-scrollbar>
      </el-main>
    </el-container>
  </el-container>
</template>

<style lang="scss" scoped>
.layout_container {
  height: 100%;

  .layout_header {
    background-color: #2eba78;
    color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .logobox {
      .logo {
        width: 200px;
        user-select: none;
        cursor: pointer;
      }
    }

    .userfnbox {
      display: flex;
      align-items: center;

      .userinfo {
        display: flex;
        align-items: center;

        .avator {
          transform: translateY(3px);
          margin-right: 10px;
        }

        .username {
          cursor: pointer;
          user-select: none;
        }

        .userrole {
          margin-left: 10px;
          cursor: pointer;
        }
      }

      .logout {
        margin-left: 20px;

        .logoutbtn {
          cursor: pointer;
          font-size: 14px;
        }
      }
    }
  }

  .layout_aside {
    background-color: #22364c;
    height: calc(100vh - 60px);
  }

  .layout_menu {
    border-right-color: transparent;
  }

  .layout_main {
    background-color: #f2f2f2;
    height: calc(100vh - 60px);
    .layout_bread {
      margin-bottom: 15px;
    }
  }
}
</style>
@/api/index22
