import { http } from '@/utils/http/axios';

const requestPath = "api"

//获取主控台信息
export function login() {
  return http.request({
    url: `${requestPath}/`,
    method: 'get',
  });
}
