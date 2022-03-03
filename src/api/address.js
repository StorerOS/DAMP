
import request from '@/utils/request'

export function addAddress(data) {
  return request({
    url: '/platform/add/address',
    method: 'post',
    data
  })
}
export function editAddress(data) {
  return request({
    url: '/platform/edit/address',
    method: 'post',
    data
  })
}
export function addressList(data) {
  return request({
    url: '/platform/list/address',
    method: 'post',
    data
  })
}
export function deleteAddress(data) {
  return request({
    url: '/platform/delete/address',
    method: 'post',
    data
  })
}

