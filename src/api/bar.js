import request from '@/utils/request'

export function getBarSummaries(host=null, productFilter=null) {
  var url = '/get_bar_summaries/'
  if (productFilter){
    url += '?' + productFilter
  }
  var req_obj = {
    url: url,
    method: 'get'
  }
  if (host) { req_obj['baseURL'] = host }

  return request(req_obj)
}
