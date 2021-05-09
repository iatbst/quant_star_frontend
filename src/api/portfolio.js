import request from '@/utils/request'

export function getPortfolioList(params) {
  return request({
    // 注意要带上结尾的'/' ！

    url: '/portfolios/',
    method: 'get',
    params
  })
}

export function getPortfolios(host=null) {
  var req_obj = {
    url: '/portfolios/',
    method: 'get'
  }
  if (host) { req_obj['baseURL'] = host }

  return request(req_obj)
}
