import { RouteRecordRaw } from 'vue-router';
import { Layout, ParentLayout } from '@/router/constant';
import { WalletOutlined } from '@vicons/antd';
import { renderIcon } from '@/utils/index';

const routeName = 'comp';

const routes: Array<RouteRecordRaw> = [
    {
        path: '/comp',
        name: routeName,
        component: Layout,
        redirect: '/comp/table',
        meta: {
            title: '组件示例',
            icon: renderIcon(WalletOutlined),
            sort: 8,
        },
        children: [
            {
                path: 'table',
                name: `${routeName}_table`,
                redirect: '/comp/table/basic',
                component: ParentLayout,
                meta: {
                    title: '表格',
                },
                children: [
                    {
                        path: 'basic',
                        name: `${routeName}_table_basic`,
                        meta: {
                            title: '基础表格',
                        },
                        component: () => import('@/views/comp/table/basic.vue'),
                    },
                    {
                        path: 'editCell',
                        name: `${routeName}_table_editCell`,
                        meta: {
                            title: '单元格编辑',
                        },
                        component: () => import('@/views/comp/table/editCell.vue'),
                    },
                    {
                        path: 'editRow',
                        name: `${routeName}_table_editRow`,
                        meta: {
                            title: '整行编辑',
                        },
                        component: () => import('@/views/comp/table/editRow.vue'),
                    },
                ],
            },
            {
                path: 'upload',
                name: `${routeName}_upload`,
                meta: {
                    title: '上传',
                },
                component: () => import('@/views/comp/upload/index.vue'),
            },
        ],
    },
];
export default routes;
