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
  var url = ((pfo.host == null) ? '' : pfo.host + '/api/workers/?portfolio_id=' + pfo.id)
  return request({
    // 注意要带上结尾的'/' ！
    // url: '/workers/' + '?portfolio_id=' + pfo_id,
    url: url,
    method: 'get'
  })
}
