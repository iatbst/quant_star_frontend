import request from '@/utils/request'

export function getLogListByWorkerAndTs(worker_id, min_ts, max_ts) {
  return request({
    // 注意要带上结尾的'/' ！
    url: '/logs/' + '?worker_id=' + worker_id + '&ts__gte=' + min_ts + '&ts__lte=' + max_ts,
    method: 'get'
  })
}
