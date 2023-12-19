import { withInstall } from '@xjjrtz/utils/src/vue/install';
import menu from './components/Logo/index.vue';
import logo from './components/Logo/index.vue';

export const menuProvider = withInstall(menu);
export const logoProvider = withInstall(logo);

export { default as XHXmenuProvider } from './index.vue';
export { default as XHXlogo } from './components/Logo/index.vue';
