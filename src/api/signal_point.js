import request from '@/utils/request'

export function getSignalPointList(params) {
  return request({
    // 注意要带上结尾的'/' ！
    url: '/signal-points/',
    method: 'get',
    params
  })
}

export function getSignalPointListByWorker(worker_id) {
  return request({
    // 注意要带上结尾的'/' ！
    url: '/signal-points/?ordering=-sig_ts' + '&worker_id=' + worker_id,
    method: 'get'
  })
}
