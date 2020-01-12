import axios from './axios'

//订单列表
export function orderList(data) {
  return axios({
    url: '/api/gds/order/list',
    method: 'GET',
    params: data
  })
}

//订单详情
export function orderDetail(id) {
  return axios({
    url: '/api/gds/order/detail',
    method: 'GET',
    params: id
  })
}