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
    path: '/attribute',
    name: 'attribute',
    redirect: '/attribute/attributeEdit',
    component: Layout,
    meta: {
      title: '基础维护',
      sort: 16,
      icon: renderIcon(CheckCircleOutlined),
    },
    children: [
      {
        path: 'attributeEdit',
        name: 'attributeEdit',
        meta: {
          title: '公司标准属性设置',
        },
        component: () => import('@/views/ebs/attribute/attributeEdit.vue'),
      },
      {
        path: 'bankAccountList',
        name: 'bankAccountList',
        meta: {
          title: '银行账号对应关系设置',
        },
        component: () => import('@/views/ebs/bankaccount/bankAccountList.vue'),
      },
    ],
  },
];

export default routes;
