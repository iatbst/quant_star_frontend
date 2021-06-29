import request from '@/utils/request'

export function getBasicMonitorStatsByPortfolio(pfo) {
  var req_obj = {
    url: '/monitor-stats/' + '?portfolio_id=' + pfo.id + '&cls=basic',
    method: 'get'
  }
  if (pfo.host) { req_obj['baseURL'] = pfo.host }
  return request(req_obj)
}

export function getPositionMonitorStatsByPortfolio(pfo) {
  var req_obj = {
    url: '/monitor-stats/' + '?portfolio_id=' + pfo.id + '&cls=position',
    method: 'get'
  }
  if (pfo.host) { req_obj['baseURL'] = pfo.host }
  return request(req_obj)
}
