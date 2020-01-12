import axios from './axios'


//获取城市数据
export function getCitys() {
  return axios({
    url: '/api/dis/list',
    method: 'GET',
  })
}

//STS临时令牌获取
export function STS(type) {
  return axios({
    url: '/api/oss/ossUploadBatch.pub',
    method: 'GET',
    params: type
  })
}


