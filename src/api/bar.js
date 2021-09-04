import request from '@/utils/request'

export function getBarSummaries(host=null) {
  var req_obj = {
    url: '/get_bar_summaries/',
    method: 'get'
  }
  if (host) { req_obj['baseURL'] = host }

  return request(req_obj)
}
