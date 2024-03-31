import request from '@/utils/request'

// 获取订单
export function getReport(host=null, fields=null, filters=null) {
  var url = '/reports/?'
  if (fields != null){
      // 指定fields
      url += '&fields=' + fields
  }
  if (filters != null){
      // 指定filters
      url += '&' + filters
  }
  var req_obj = {
    url: url,
    method: 'get'
  }
  if (host) { req_obj['baseURL'] = host }
  return request(req_obj)
}
