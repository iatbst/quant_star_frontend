import request from '@/utils/request'

export function getBacktestReports(host=null, fields=null, page=null) {
  var url = '/backtest-reports/?'
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

export function getBacktestReportById(host=null, id, fields=null) {
  var url = '/backtest-reports/?id=' + id
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

export function getBacktestReportsByPlanId(host=null, plan_id, fields=null, page=null) {
  var url = '/backtest-reports/?plan_id=' + plan_id
  if (fields != null){
      // 指定fields
      url += '&fields=' + fields
    }
  if (page != null){
    // 指定fields
    url += '&page=' + page
  }
  var req_obj = {
    url: url,
    method: 'get'
  }
  if (host) { req_obj['baseURL'] = host }
  return request(req_obj)
}