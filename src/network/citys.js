import axios from './axios'



export function getCitys() {
  return axios({
    url: '/api/dis/list',
    method: 'GET',
  })
}