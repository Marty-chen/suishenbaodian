import axios from './axios'

//商品列表
export function goodsList(data) {
  return axios({
    url: '/api/gds/list',
    method: 'GET',
    params: data
  })
}

//商品详情
export function goodsDetail(data) {
  return axios({
    url: '/api/gds/detail',
    method: 'GET',
    params: data
  })
}

//商品添加
export function goodsSave(data) {
  return axios({
    url: '/api/gds/save',
    method: 'POST',
    data: data
  })
}

//商品删除
export function goodsDel(data) {
  return axios({
    url: '/api/gds/del',
    method: 'POST',
    data: data
  })
}

//商品编辑
export function goodsEdit(data) {
  return axios({
    url: '/api/gds/edit',
    method: 'POST',
    data: data
  })
}
