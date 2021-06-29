import request from '@/utils/request'

export function getErrorsByPortfolio(pfo) {
  var req_obj = {
    url: '/errors/',
    method: 'get'
  }
  if (pfo.host) { req_obj['baseURL'] = pfo.host }
  return request(req_obj)
}

