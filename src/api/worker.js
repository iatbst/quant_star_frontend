import request from '@/utils/request'


export function getWorkersByPfo(pfo, status='normal', disable_ts=null) {
  if (disable_ts !== null){
    // 返回下线没多久的workers
    var url = '/workers/?status=disable&disable_ts__gte=' + disable_ts + '&portfolio_id=' + pfo.id
  } else if (status === null){
    var url = '/workers/?portfolio_id=' + pfo.id
  } else {
    var url = '/workers/?status=' + status + '&portfolio_id=' + pfo.id
  }
  var req_obj = {
    url: url,
    method: 'get'
  }
  if (pfo.host) {
    req_obj['baseURL'] = pfo.host
  }
  return request(req_obj)
}

export function getWorkersBySymbol(symbol, host=null) {
  var req_obj = {
    url: '/workers/?status=normal&search=' + symbol,
    method: 'get'
  }
  if (host) {
    req_obj['baseURL'] = host
  }
  return request(req_obj)
}

export function getWorkerDatas(host=null, fields=null) {
  var url = '/worker-datas/'
  if (fields != null){
    // 指定fields
    url += '?fields=' + fields
  }
  var req_obj = {
    url: url,
    method: 'get'
  }
  if (host) { req_obj['baseURL'] = host }
  return request(req_obj)
}

export function getDelegateWorkerDatas(host=null, fields=null) {
  var url = '/worker-datas/?worker__status=normal&delegate=true'
  if (fields != null){
    // 指定fields
    url += '&fields=' + fields
  }
  var req_obj = {
    url: url,
    method: 'get'
  }
  if (host) { req_obj['baseURL'] = host }
  return request(req_obj)
}
