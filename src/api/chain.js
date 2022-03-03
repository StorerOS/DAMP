
import request from '@/utils/request'

export function getChainList(data) {
  return request({
    url: '/platform/list/chain/assets',
    method: 'post',
    data
  })
}

export function getAlertLogList(data) {
  return request({
    url: '/platform/list/alert/log',
    method: 'post',
    data
  })
}
export function addAlertRule(data) {
  return request({
    url: '/platform/add/alert/rule',
    method: 'post',
    data
  })
}
export function getAlertRuleList(data) {
  return request({
    url: '/platform/list/alert/rule',
    method: 'post',
    data
  })
}
export function getPredefRuleList(data) {
  return request({
    url: '/platform/list/predef/rule',
    method: 'post',
    data: {}
  })
}
export function delAlertRule(data) {
  return request({
    url: '/platform/delete/alert/rule',
    method: 'post',
    data
  })
}
export function editAlertRule(data) {
  return request({
    url: '/platform/edit/alert/rule',
    method: 'post',
    data
  })
}
