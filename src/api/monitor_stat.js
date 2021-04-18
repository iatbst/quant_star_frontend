import request from '@/utils/request'

export function getMonitorStatListByPortfolio(pfo_id) {
  return request({
    // 注意要带上结尾的'/' ！
    url: '/monitor-stats/' + '?portfolio_id=' + pfo_id,
    method: 'get'
  })
}
