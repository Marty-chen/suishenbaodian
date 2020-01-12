import axios from './axios'

//店铺列表
export function uploadVideo(data) {
  return axios({
    url: '/api/video/uploadVideo',
    method: 'GET',
    params: data
  })
}