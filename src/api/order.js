import request from '@/utils/request'

// 获取订单
export function getOrders(host=null, fields=null, filters=null, page=null) {
  var url = '/orders/?'
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

export function getSubOrdersByParentOrder(order, host=null) {
  var req_obj = {
    url: '/orders/' + '?parent_order_id=' + order.id,
    method: 'get'
  }
  if (host) { req_obj['baseURL'] = host }
  return request(req_obj)
}
