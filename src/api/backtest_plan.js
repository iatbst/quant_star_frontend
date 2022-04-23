import request from '@/utils/request'

export function getBacktestPlans(host=null, fields=null, page=null) {
  var url = '/backtest-plans/?'
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

export function getBacktestPlanById(host=null, id, fields=null) {
  var url = '/backtest-plans/?id=' + id
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

export function getBacktestPlanByName(host=null, name, fields=null) {
  var url = '/backtest-plans/?name=' + name
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

export function createBacktestPlan(host=nul, data) {
  var req_obj = {
    url: '/create_backtest_plan/',
    method: 'post',
    data,
  }
  if (host) { req_obj['baseURL'] = host }

  return request(req_obj)
}

export function updateBacktestPlan(host=nul, data) {
  var req_obj = {
    url: '/update_backtest_plan/',
    method: 'post',
    data,
  }
  if (host) { req_obj['baseURL'] = host }

  return request(req_obj)
}

export function deleteBacktestPlan(host=nul, data) {
  var req_obj = {
    url: '/delete_backtest_plan/',
    method: 'post',
    data,
  }
  if (host) { req_obj['baseURL'] = host }

  return request(req_obj)
}

export function runBacktestPlan(host=nul, data) {
  var req_obj = {
    url: '/run_backtest_plan/',
    method: 'post',
    data,
  }
  if (host) { req_obj['baseURL'] = host }

  return request(req_obj)
}