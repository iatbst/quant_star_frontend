import request from '@/utils/request'

export function getSnapshotByDatetime(dt, scope='system', host=null, fields=null) {
    var url = '/snapshots/?datetime=' + dt + '&scope=' + scope
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
