import request from '@/utils/request'

export function getWorkerList(params) {
  return request({
    // 注意要带上结尾的'/' ！
    url: '/workers/',
    method: 'get',
    params
  })
}

export function getWorkersByPfo(pfo) {
  var req_obj = {
    url: '/api/workers/?portfolio_id=' + pfo.id,
    method: 'get'
  }
  if (pfo.host) {
    req_obj['baseURL'] = pfo.host
  }
  return request(req_obj)
}
