import { RouteRecordRaw } from 'vue-router';
import { Layout } from '@/router/constant';
import { CheckCircleOutlined } from '@vicons/antd';
import { renderIcon } from '@/utils/index';

/**
 * @param name 路由名称, 必须设置,且不能重名
 * @param meta 路由元信息（路由附带扩展信息）
 * @param redirect 重定向地址, 访问这个路由时,自定进行重定向
 * @param meta.disabled 禁用整个菜单
 * @param meta.title 菜单名称
 * @param meta.icon 菜单图标
 * @param meta.keepAlive 缓存该路由
 * @param meta.sort 排序越小越排前
 *
 * */
const routes: Array<RouteRecordRaw> = [
  {
    path: '/rmbtrip',
    name: 'rmbtrip',
    redirect: '/rmbtrip/rmbtripList',
    component: Layout,
    meta: {
      title: '报销业务',
      icon: renderIcon(CheckCircleOutlined),
    },
    children: [
      {
        path: 'rmbtripList',
        name: 'rmbtripList',
        meta: {
          title: '个人差旅报销',
        },
        component: () => import('@/views/ebs/rmbtrip/rmbtripList.vue'),
      },
      {
        path: 'rmbtripEdit',
        name: 'rmbtripEdit',
        meta: {
          title: '个人差旅报销编辑(隐藏)',
        },
        component: () => import('@/views/ebs/rmbtrip/rmbtripEdit.vue'),
      },
      {
        path: 'ordinaryMainList',
        name: 'ordinaryMainList',
        meta: {
          title: '个人普通报销',
        },
        component: () => import('@/views/ebs/ordinarymain/ordinaryMainList.vue'),
      },
      {
        path: 'vehicleExpenseList',
        name: 'vehicleExpenseList',
        meta: {
          title: '车辆费用报销',
        },
        component: () => import('@/views/ebs/vehicleExpense/vehicleExpenseList.vue'),
      },
    ],
  },
];

export default routes;
