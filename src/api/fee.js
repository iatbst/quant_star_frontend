import request from '@/utils/request'

// 获取订单
export function getFees(host=null, fields=null, filters=null, page=null) {
  var url = '/fees/?'
  if (fields != null){
      // 指定fields
      url += '&fields=' + fields
  }
  if (filters != null){
      // 指定filters
      url += '&' + filters
  }
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
