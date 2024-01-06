import request from '@/utils/request'

export function getTradeList(params) {
  return request({
    // 注意要带上结尾的'/' ！
    url: '/trades/',
    method: 'get',
    params
  })
}

export function getTradesByWorker(worker, host=null) {
  var req_obj = {
    url: '/trades/?ordering=-entry_dt' + '&worker_id=' + worker.id,
    method: 'get'
  }
  if (host) { req_obj['baseURL'] = host }
  return request(req_obj)
}

export function getTradeById(id, host=null) {
  var req_obj = {
    url: '/trades/?id=' + id,
    method: 'get'
  }
  if (host) { req_obj['baseURL'] = host }
  return request(req_obj)
}

export function getTradesByFinalFlag(final_flag, host=null, checked=false) {
  if (final_flag == 'error'){
    // 分为两种情况: checked vs unchecked
    // 注意: 要设置show_worker=true, 否则只能获取worker_id
    var url = '/trades/?show_worker=true&ordering=-entry_dt' + '&final_flag=' + final_flag + '&checked=' + checked
  } else {
    var url = '/trades/?show_worker=true&ordering=-entry_dt' + '&final_flag=' + final_flag
  }
  var req_obj = {
    url: url,
    method: 'get'
  }
  if (host) { req_obj['baseURL'] = host }
  return request(req_obj)
}

export function markTradeFinalFlag(trade_id, mark_obj, host=null) {
  // 标记SP(warn/error/manual/success)
  var url = '/mark_trade_final_flag/?trade_id=' + trade_id
  for (let key in mark_obj){
    if (mark_obj[key]){
      url += '&' + key + '=' + mark_obj[key]
    }
  }
  var req_obj = {
    url: url,
    method: 'get'
  }
  if (host) { req_obj['baseURL'] = host }
  return request(req_obj)
}