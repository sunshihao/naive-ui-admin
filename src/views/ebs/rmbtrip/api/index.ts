import { http } from '@/utils/http/axios';

const requestPath = 'Knife4j';

//获取主控台信息
export function getDetail(params) {
  return http.request({
    url: `${requestPath}/portal/codeAction/detail`,
    method: 'get',
    params,
  });
}
