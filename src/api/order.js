import request from '@/utils/request'

export function getSubOrdersByParentOrder(order, host=null) {
  var req_obj = {
    url: '/orders/' + '?parent_order_id=' + order.id,
    method: 'get'
  }
  if (host) { req_obj['baseURL'] = host }
  return request(req_obj)
}
