import axios from './axios'

//店铺列表
export function storeList(data) {
  return axios({
    url: '/api/store/list',
    method: 'GET',
    params: data
  })
}
//删除店铺
export function storeDele(data) {
  return axios({
    url: '/api/store/del',
    method: 'POST',
    data: data
  })
}

//店铺编辑
export function storeEdit(data) {
  return axios({
    url: '/api/store/edit',
    method: 'POST',
    data: data
  })
}


//店铺详情
export function detailList(data) {
  return axios({
    url: '/api/store/detail',
    method: 'GET',
    params: data
  })
}

//行业
export function storeTrade() {
  return axios({
    url: '/api/trade/list',
    method: 'POST',
  })
}

//店铺新增（线上 ，线下）
export function storeSave(data) {
  return axios({
    url: '/api/store/save',
    method: 'POST',
    data: data
  })
}

