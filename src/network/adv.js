import axios from './axios'
import qs from 'qs'

//广告列表
export function advList(data) {
  return axios({
    url: '/api/adv/list',
    method: 'GET',
    params: data
  })
}

//广告管理-删除（批量，单个）
export function deleAdv(data) {
  return axios({
    url: '/api/adv/del',
    method: 'POST',
    data: data
  })
}

//广告 上架
export function putawayAdv(data) {
  return axios({
    url: '/api/adv/putaway',
    method: 'POST',
    data: data
  })
}

//广告详情
export function advDetail(data) {
  return axios({
    url: '/api/adv/detail',
    method: 'GET',
    params: data
  })
}


//店铺列表，视频/图文时长，最低发布金额
export function advLimit() {
  return axios({
    url: '/api/adv/data',
    method: 'GET'
    
  })
}

//广告添加（直接发布，保存为草稿）
export function releaseAdv(data) {
  return axios({
    url: '/api/adv/save',
    method: 'POST',
    data: data
  })
}

//广告编辑
export function editAdv(data) {
  return axios({
    url: 'api/adv/edit',
    method: 'POST',
    data: data
  })
}