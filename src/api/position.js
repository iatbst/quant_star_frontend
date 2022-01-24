import request from '@/utils/request'

export function getPositions(host=null, worker_status=null) {
  var url = '/positions/'
  if (worker_status){
    url += '?worker__status=' + worker_status
  }
  var req_obj = {
    url: url,
    method: 'get'
  }
  if (host) { req_obj['baseURL'] = host }

  return request(req_obj)
}