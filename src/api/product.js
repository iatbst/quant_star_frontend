import request from '@/utils/request'

export function getProductList(params) {
  return request({
    // 注意要带上结尾的'/' ！
    url: '/products/',
    method: 'get',
    params
  })
}
