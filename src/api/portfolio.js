import request from '@/utils/request'

export function getPortfolioList(params) {
  return request({
    // 注意要带上结尾的'/' ！
    
    url: '/api/portfolios/',
    method: 'get',
    params
  })
}
