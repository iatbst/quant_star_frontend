import request from '@/utils/request'

export function getPortfolios(host=null) {
  var req_obj = {
    url: '/portfolios/',
    method: 'get'
  }
  if (host) { req_obj['baseURL'] = host }

  return request(req_obj)
}

export function getPortfolioDatas(host=null) {
  var req_obj = {
    url: '/portfolio-datas/',
    method: 'get'
  }
  if (host) { req_obj['baseURL'] = host }

  return request(req_obj)
}
