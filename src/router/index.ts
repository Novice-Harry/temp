import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/views/Layout/index.vue'
import { useUserStore } from '@/stores/user'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'layout',
      component: Layout,
      redirect: '/dashboard',
      children: [
        {
          path: 'dashboard',
          name: 'dashboard',
          component: () => import('@/views/Layout/dashboard/index.vue')
        },
        {
          path: 'campus',
          children: [
            {
              path: 'campus',
              name: 'campus',
              component: () => import('@/views/Layout/campus/campus/index.vue'),
              meta: {
                bread: [{ name: '校区管理', path: '/campus/campus' }]
              }
            },
            {
              path: 'campus/:id',
              name: 'campusDetail',
              component: () => import('@/views/Layout/campus/detail/index.vue'),
              meta: {
                bread: [
                  { name: '校区管理', path: '/campus/campus' },
                  { name: '校区详情' }
                ]
              }
            },
            {
              path: 'newcampus',
              name: 'newcampus',
              component: () => import('@/views/Layout/campus/add/index.vue'),
              meta: {
                bread: [
                  { name: '校区管理', path: '/campus/campus' },
                  { name: '新建校区' }
                ]
              }
            },
            {
              path: 'editcampus/:campId',
              name: 'editcampus',
              component: () => import('@/views/Layout/campus/edit/index.vue'),
              meta: {
                bread: [
                  { name: '校区管理', path: '/campus/campus' },
                  { name: '编辑校区' }
                ]
              }
            }
          ]
        },
        {
          path: 'eduadmin',
          children: [
            {
              path: 'teachers',
              name: 'teachers',
              component: () =>
                import('@/views/Layout/eduadmin/teachers/index.vue'),
              meta: {
                bread: [{ name: '教务管理' }, { name: '教师管理' }]
              }
            },
            {
              path: 'teachers/:id',
              name: 'teacherdetail',
              component: () =>
                import('@/views/Layout/eduadmin/teachers/detail/index.vue'),
              meta: {
                bread: [
                  { name: '教务管理' },
                  { name: '教师管理', path: '/eduadmin/teachers' },
                  { name: '教师详情' }
                ]
              }
            },
            {
              path: 'students',
              name: 'students',
              component: () =>
                import('@/views/Layout/eduadmin/students/index.vue'),
              meta: {
                bread: [{ name: '教务管理' }, { name: '学生管理' }]
              }
            },
            {
              path: 'students/:id',
              name: 'studentdetail',
              component: () =>
                import('@/views/Layout/eduadmin/students/detail/index.vue'),
              meta: {
                bread: [
                  { name: '教务管理' },
                  { name: '学生管理', path: '/eduadmin/students' },
                  { name: '学生详情' }
                ]
              }
            },
            {
              path: 'classes',
              name: 'classes',
              component: () =>
                import('@/views/Layout/eduadmin/classes/index.vue'),
              meta: {
                bread: [{ name: '教务管理' }, { name: '班级管理' }]
              }
            },
            {
              path: 'classcommunity/:id',
              name: 'classcommunity',
              component: () =>
                import(
                  '@/views/Layout/eduadmin/classes/classcommunity/index.vue'
                ),
              meta: {
                bread: [
                  { name: '教务管理' },
                  { name: '班级管理', path: '/eduadmin/classes' },
                  { name: '班级圈' }
                ]
              }
            },
            {
              path: 'managingstudents/:id',
              name: 'managingstudents',
              component: () =>
                import(
                  '@/views/Layout/eduadmin/classes/managingstudents/index.vue'
                ),
              meta: {
                bread: [
                  { name: '教务管理' },
                  { name: '班级管理', path: '/eduadmin/classes' },
                  { name: '学生管理' }
                ]
              }
            },
            {
              path: 'upgrateclass/:id',
              name: 'upgrateclass',
              component: () =>
                import(
                  '@/views/Layout/eduadmin/classes/upgrateclass/index.vue'
                ),
              meta: {
                bread: [
                  { name: '教务管理' },
                  { name: '班级管理', path: '/eduadmin/classes' },
                  { name: '一键升班' }
                ]
              }
            }
          ]
        },
        {
          path: 'orders',
          children: [
            {
              path: 'textbook',
              name: 'textbook',
              component: () =>
                import('@/views/Layout/orders/textbook/index.vue'),
              meta: {
                bread: [{ name: '服务订购' }, { name: '合作教材' }]
              }
            },
            {
              path: 'courseware',
              name: 'courseware',
              component: () =>
                import('@/views/Layout/orders/courseware/index.vue'),
              meta: {
                bread: [{ name: '服务订购' }, { name: '合作课件' }]
              }
            },
            {
              path: 'scores',
              name: 'scores',
              component: () => import('@/views/Layout/orders/scores/index.vue'),
              meta: {
                bread: [{ name: '服务订购' }, { name: '学豆统计' }]
              }
            },
            {
              path: 'scores/record',
              name: 'record',
              component: () =>
                import('@/views/Layout/orders/scores/record/index.vue'),
              meta: {
                bread: [
                  { name: '服务订购' },
                  { name: '学豆统计', path: '/orders/scores' },
                  { name: '购买记录' }
                ]
              }
            },
            {
              path: 'serialorders',
              name: 'serialorders',
              component: () =>
                import('@/views/Layout/orders/serialorders/index.vue'),
              meta: {
                bread: [{ name: '服务订购' }, { name: '序列号订单' }]
              }
            },
            {
              path: 'seriallist',
              name: 'seriallist',
              component: () =>
                import('@/views/Layout/orders/seriallist/index.vue'),
              meta: {
                bread: [{ name: '服务订购' }, { name: '序列号清单' }]
              }
            },
            {
              path: 'AI',
              name: 'AI',
              component: () => import('@/views/Layout/orders/AI/index.vue'),
              meta: {
                bread: [{ name: '服务订购' }, { name: 'AI课授权' }]
              }
            }
          ]
        },
        {
          path: 'pictures',
          children: [
            {
              path: 'activate',
              name: 'activate',
              component: () =>
                import('@/views/Layout/pictures/activate/index.vue'),
              meta: {
                bread: [{ name: '绘本课' }, { name: '绘本开通' }]
              }
            },
            {
              path: 'list',
              name: 'activatelist',
              component: () => import('@/views/Layout/pictures/list/index.vue'),
              meta: {
                bread: [{ name: '绘本课' }, { name: '套餐订单' }]
              }
            },
            {
              path: 'report',
              name: 'report',
              component: () =>
                import('@/views/Layout/pictures/report/index.vue'),
              meta: {
                bread: [{ name: '绘本课' }, { name: '阅读统计' }]
              }
            }
          ]
        },
        {
          // 404页面
          path: '/:catchAll(.*)',
          name: 'NotFoundPage',
          component: () => import('@/views/Layout/404/index.vue')
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Login/index.vue')
    }
  ]
})

router.beforeEach((to, from) => {
  const userStore = useUserStore()

  if (userStore.token && to.path === '/login') {
    return from.path
  }

  if (!userStore.token && to.path !== '/login') {
    return '/login'
  }
})
export default router
