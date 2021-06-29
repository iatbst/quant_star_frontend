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
