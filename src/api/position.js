import request from '@/utils/request'

export function getPositions(host=null) {
  var req_obj = {
    url: '/positions/',
    method: 'get'
  }
  if (host) { req_obj['baseURL'] = host }

  return request(req_obj)
}