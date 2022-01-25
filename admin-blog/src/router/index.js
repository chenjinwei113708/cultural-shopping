import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: 'Dashboard', icon: 'dashboard' }
    }]
  },
  {
    path: '/category',
    component: Layout,
    redirect: '/category/index',
    name: 'Category',
    meta: { title: '分类管理', icon: 'tree' },
    children: [
      {
        path: 'index',
        name: 'CategoryList',
        component: () => import('@/views/category/index'),
        meta: { title: '分类列表', icon: 'table' }
      },
      {
        path: 'create',
        name: 'CategoryCreate',
        component: () => import('@/views/category/create'),
        meta: { title: '创建分类', icon: 'el-icon-circle-plus-outline' }
      },
      {
        path: 'edit',
        name: 'CategoryEdit',
        component: () => import('@/views/category/edit')
      }
    ]
  },

  {
    path: '/article',
    component: Layout,
    redirect: '/article/index',
    name: 'Article',
    meta: { title: '文章管理', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'index',
        name: 'ArticleIndex',
        component: () => import('@/views/article/index'),
        meta: { title: '文章列表', icon: 'table' }
      },
      {
        path: 'create',
        name: 'ArticleCreate',
        component: () => import('@/views/article/create'),
        meta: { title: '创建文章', icon: 'tree' }
      },
      {
        path: 'edit',
        name: 'ArticleEdit',
        component: () => import('@/views/article/edit')
      }
    ]
  },
  {
    path: '/good',
    component: Layout,
    redirect: '/good/index',
    name: 'Good',
    meta: { title: '商品管理', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'index',
        name: 'GoodIndex',
        component: () => import('@/views/good/index'),
        meta: { title: '商品列表', icon: 'table' }
      },
      {
        path: 'create',
        name: 'GoodCreate',
        component: () => import('@/views/good/create'),
        meta: { title: '创建商品', icon: 'tree' }
      },
      {
        path: 'edit',
        name: 'GoodEdit',
        component: () => import('@/views/good/edit')
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    redirect: '/user/index',
    name: 'User',
    meta: { title: '用户管理', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'index',
        name: 'UserIndex',
        component: () => import('@/views/user/index'),
        meta: { title: '用户列表', icon: 'table' }
      },
      {
        path: 'edit',
        name: 'UserEdit',
        component: () => import('@/views/user/edit')
      }
    ]
  },
  {
    path: '/comment',
    component: Layout,
    redirect: '/comment/index',
    name: 'Comment',
    meta: { title: '评论管理', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'index',
        name: 'CommentIndex',
        component: () => import('@/views/comment/index'),
        meta: { title: '评论列表', icon: 'table' }
      }
    ]
  },

  {
    path: '/reply',
    component: Layout,
    redirect: '/reply/index',
    name: 'Reply',
    meta: { title: '回复管理', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'index',
        name: 'ReplyIndex',
        component: () => import('@/views/reply/index'),
        meta: { title: '回复列表', icon: 'table' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
