import { request } from 'umi';
import config from './config';
/** Create user This can only be done by the logged in user. POST /user */

export function getSearchRes(params, options) {
  return request(config.path_head + '/get_address', {
    method: 'GET',
    params: { ...params },
    ...(options || {}),
  }).then(
    // 成功回调
    (res) => {
        console.log('getSearchRes',res)
        return res;
    },
    // 失败回调
    () => {
        return [];
    },
  );
}
