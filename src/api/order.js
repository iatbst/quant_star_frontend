import request from '@/utils/request'

export function getSubOrdersByParentOrder(order, host=null) {
  var url = ((host == null) ? '' : host + '/api/orders/' + '?parent_order_id=' + order.id)
  return request({
    // 注意要带上结尾的'/' ！
    url: url,
    method: 'get'
  })
}
