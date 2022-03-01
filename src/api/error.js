import request from '@/utils/request'

export function getErrors(host, page=null) {
  var url = '/errors/?'
  if (page != null){
    // 指定page
    url += '&page=' + page
  }
  var req_obj = {
    url: url,
    method: 'get'
  }
  if (host) { req_obj['baseURL'] = host }
  return request(req_obj)
}

export function getErrorsByPortfolio(pfo, page=null) {
  var url = '/errors/?'
  if (page != null){
    // 指定page
    url += '&page=' + page
  }
  var req_obj = {
    url: url,
    method: 'get'
  }
  if (pfo.host) { req_obj['baseURL'] = pfo.host }
  return request(req_obj)
}

