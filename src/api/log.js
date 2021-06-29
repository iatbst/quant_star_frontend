import request from '@/utils/request'

export function getLogsByWorkerAndTs(worker, min_ts, max_ts, host=null) {
  var url = ((host == null) ? '' : host + '/logs/' + '?worker_id=' + worker.id + '&ts__gte=' + min_ts + '&ts__lte=' + max_ts)
  return request({
    // 注意要带上结尾的'/' ！
    url: url,
    method: 'get'
  })
}

export function getLogsByProductAndTs(product, min_ts, max_ts, host=null) {
  var url = ((host == null) ? '' : host + '/logs/' + '?product_id=' + product.id + '&ts__gte=' + min_ts + '&ts__lte=' + max_ts)
  return request({
    // 注意要带上结尾的'/' ！
    url: url,
    method: 'get'
  })
}
