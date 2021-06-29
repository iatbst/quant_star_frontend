import request from '@/utils/request'

export function getSubAccountPositionDatas(host=null) {
  var req_obj = {
    url: '/subaccount-datas/?fields=positions,subaccount,portfolio',
    method: 'get'
  }
  if (host) { req_obj['baseURL'] = host }
  return request(req_obj)
}

export function getSubAccountWalletDatas(host=null) {
    var req_obj = {
      url: '/subaccount-datas/?fields=wallet,subaccount,portfolio',
      method: 'get'
    }
    if (host) { req_obj['baseURL'] = host }
    return request(req_obj)
  }