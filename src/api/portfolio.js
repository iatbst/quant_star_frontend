import request from '@/utils/request'

export function getPortfolios(host=null) {
  var req_obj = {
    url: '/portfolios/',
    method: 'get'
  }
  if (host) { req_obj['baseURL'] = host }

  return request(req_obj)
}

export function getPortfolioDatas(host=null, fields=null) {
  var url = '/portfolio-datas/'
  if (fields != null){
    // 指定fields
    url += '?fields=' + fields
  }
  var req_obj = {
    url: url,
    method: 'get'
  }
  if (host) { req_obj['baseURL'] = host }
  return request(req_obj)
}

export function getPortfolioDataByName(pfoName, host=null, fields=null) {
  var url = '/portfolio-datas/?portfolio__name=' + pfoName
  if (fields != null){
    // 指定fields
    url += '&fields=' + fields
  }
  var req_obj = {
    url: url,
    method: 'get'
  }
  if (host) { req_obj['baseURL'] = host }
  return request(req_obj)
}
