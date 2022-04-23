import request from '@/utils/request'

export function getProductList(params) {
  return request({
    // 注意要带上结尾的'/' ！
    url: '/products/',
    method: 'get',
    params
  })
}

export function getProductDatas(host=null, fields=null, page=null) {
  var url = '/product-datas/?'
  if (fields != null){
      // 指定fields
      url += '&fields=' + fields
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