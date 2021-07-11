import request from '@/utils/request'

export function getSubAccountDatas(host=null, fields=null) {
    var url = '/subaccount-datas/'
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

export function getSubAccountWalletDatas(host=null, fields=null) {
    var url = '/subaccount-datas/'
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