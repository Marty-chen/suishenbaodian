import axios from './axios'


//短信登陆
export function phoneLogin(data) {
  return axios({
    url: '/api/phoneLogin.pub',
    method: 'POST',
    data: data
  })
}

//手机密码登陆
export function passWordLogin(data) {
  return axios({
    url: '/api/login.pub',
    method: 'POST',
    data: data
  })
}

//获取验证码
export function sendSms(data) {
  return axios({
    url: '/api/sendSms.pub',
    method: 'GET',
    params: data
  })
}



//退出登陆
export function logout() {
  return axios({
    url: '/api/logout',
    method: 'POST',
  })
}