import { menuProvider, XHXmenuProvider } from '@xjjrtz/layout';
import { h } from 'vue';

export const RedirectName = 'Redirect';

// export const ErrorPage = () => import('@/views/exception/404.vue');
export const ErrorPage = () => import('@/views/exception/404.vue');

export const Layout = () => import('@/layout/index.vue');
// export const Layout = () => import('@xjjrtz/layout');
// export const Layout = () => h(XHXmenuProvider, null);
// export const Layout = () =>
//   new Promise((resolve, reject) => {
//     resolve(XHXmenuProvider);
//   });

export const ParentLayout = () => import('@/layout/parentLayout.vue');
