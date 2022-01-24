import request from '@/utils/request'

export function runTask(host=nul, data) {
  var req_obj = {
    timeout: 600000,  // 同步的task任务可能运行时间较长
    url: '/run_task/',
    method: 'post',
    data,
  }
  if (host) { req_obj['baseURL'] = host }

  return request(req_obj)
}

export function asyncRunTask(host=nul, data) {
  var req_obj = {
    url: '/async_run_task/',
    method: 'post',
    data,
  }
  if (host) { req_obj['baseURL'] = host }

  return request(req_obj)
}
