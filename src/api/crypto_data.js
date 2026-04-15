import request from '@/utils/request'

// 获取订单
export function getCryptoDatas(host=null, filters=null) {
  var url = '/crypto-datas/?'
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
