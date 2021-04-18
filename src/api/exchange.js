import request from '@/utils/request'

export function getExchangeList(params) {
  return request({
    // 注意要带上结尾的'/' ！
    url: '/exchanges/',
    method: 'get',
    params
  })
}
