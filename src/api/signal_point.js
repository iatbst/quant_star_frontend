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
  var req_obj = {
    url: '/signal-points/?ordering=-sig_ts' + '&worker_id=' + worker.id,
    method: 'get'
  }
  if (host) { req_obj['baseURL'] = host }
  return request(req_obj)
}

export function getSignalPointsByFinalState(final_state, host=null, checked=false) {
  if (final_state == 'error'){
    // 分为两种情况: checked vs unchecked
    // 注意: 要设置show_worker=true, 否则只能获取worker_id
    var url = '/signal-points/?show_worker=true&ordering=-sig_ts' + '&final_state=' + final_state + '&checked=' + checked
  } else {
    var url = '/signal-points/?show_worker=true&ordering=-sig_ts' + '&final_state=' + final_state
  }
  var req_obj = {
    url: url,
    method: 'get'
  }
  if (host) { req_obj['baseURL'] = host }
  return request(req_obj)
}


export function markCurrentSpFinalState(worker_id, mark_obj, host=null) {
  // 标记Worker的current_sp的最终状态(warn/error/manual/success)
  var url = '/mark_sp_final_state/?worker_id=' + worker_id
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

  // 标记信号仓位不正确的原因
  // var req_obj = {
  //   url: '/mark_error_reason/?worker_id=' + worker_id + '&reason=' + reason,
  //   method: 'get'
  // }
  // if (host) { req_obj['baseURL'] = host }
  // return request(req_obj)
}

export function markSpFinalState(sp_id, mark_obj, host=null) {
  // 标记SP(warn/error/manual/success)
  var url = '/mark_sp_final_state/?sp_id=' + sp_id
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