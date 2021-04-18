import request from '@/utils/request'

export function getSubOrderListByParentOrder(order_id) {
  return request({
    // 注意要带上结尾的'/' ！
    url: '/orders/' + '?parent_order_id=' + order_id,
    method: 'get'
  })
}
