//
import { getAppEnvConfig } from '@/utils/env';

/** 三方页面打开 */
export const doAppStatusFlow = function (title, becomeId, busiFunctionId) {
  const { VITE_GLOB_WEB_URL_1 } = getAppEnvConfig();

  console.log('VITE_GLOB_WEB_URL_1VITE_GLOB_WEB_URL_1', VITE_GLOB_WEB_URL_1);

  layer.open({
    type: 2,
    title: title,
    content:
      VITE_GLOB_WEB_URL_1 +
      '/wf/InterApproveAction.do?method=doforwardApproveView&busiCode=' +
      becomeId +
      '&busiFunctionId=' +
      busiFunctionId,
    fix: true,
    area: ['100%', '100%'],
    //     /*注释部分功能：弹窗后立即最大化*/
    success: function (layerObj) {
      const currLayer = jQuery(layerObj);
      currLayer
        .css({ top: '0px', left: '0px', width: '100%', height: jQuery(window).height() })
        .find('iframe')
        .css('height', jQuery(window).height() - 50);
    },
  });
};
