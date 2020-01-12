import axios from './axios'


export function getMenuList() {
  return axios({
    url: '/api/menu/list',
    method: 'GET',
  })
}

export function getHomeData() {
  return axios({
    url: '/api/home',
    method: 'GET',
  })
}