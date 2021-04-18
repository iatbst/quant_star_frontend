import request from '@/utils/request'

export function getWorkerList(params) {
  return request({
    // 注意要带上结尾的'/' ！
    url: '/workers/',
    method: 'get',
    params
  })
}

export function getWorkerListByPortfolio(pfo_id) {
  return request({
    // 注意要带上结尾的'/' ！
    url: '/workers/' + '?portfolio_id=' + pfo_id,
    method: 'get'
  })
}
