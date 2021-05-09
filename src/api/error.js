import request from '@/utils/request'

export function getErrorListByPortfolio(pfo_id) {
  return request({
    // 注意要带上结尾的'/' ！
    url: '/errors/',
    method: 'get'
  })
}

