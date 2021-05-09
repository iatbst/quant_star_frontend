import request from '@/utils/request'

export function getBasicMonitorStatListByPortfolio(pfo_id) {
  return request({
    // 注意要带上结尾的'/' ！
    url: '/monitor-stats/' + '?portfolio_id=' + pfo_id + '&cls=basic',
    method: 'get'
  })
}

export function getPositionMonitorStatListByPortfolio(pfo_id) {
  return request({
  // 注意要带上结尾的'/' ！
    url: '/monitor-stats/' + '?portfolio_id=' + pfo_id + '&cls=position',
    method: 'get'
  })
}
