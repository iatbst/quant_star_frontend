import request from '@/utils/request'


export function getWorkersByPfo(pfo) {
  var req_obj = {
    url: '/workers/?status=normal&portfolio_id=' + pfo.id,
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
  var url = '/worker-datas/?delegate=true'
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
