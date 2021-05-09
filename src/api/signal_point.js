import request from '@/utils/request'

export function getSignalPointList(params) {
  return request({
    // 注意要带上结尾的'/' ！
    url: '/signal-points/',
    method: 'get',
    params
  })
}

export function getSignalPointsByWorker(worker, host=null) {
  var url = ((host == null) ? '' : host + '/api/signal-points/?ordering=-sig_ts' + '&worker_id=' + worker.id)
  return request({
    // 注意要带上结尾的'/' ！
    url: url,
    method: 'get'
  })
}
