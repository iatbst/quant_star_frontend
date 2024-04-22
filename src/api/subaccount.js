import request from '@/utils/request'

export function getSubAccounts(host=null, fields=null, all=false) {
  if (all){
    // 获取所有subaccounts(包括已经disabled的pfo的subaccounts)
    var url = '/subaccounts/?'
  } else {
    // 只获取normal状态的subaccounts
    var url = '/subaccounts/?status=normal'
  }
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

export function getSubAccountDatas(host=null, fields=null, all=false) {
    if (all){
      // 获取所有subaccounts(包括已经disabled的pfo的subaccounts)
      var url = '/subaccount-datas/?'
    } else {
      // 只获取normal状态的subaccounts
      var url = '/subaccount-datas/?subaccount__status=normal'
    }
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

export function getSubAccountDataByName(name, host=null, fields=null,) {
  var url = '/subaccount-datas/?subaccount__name=' + name
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