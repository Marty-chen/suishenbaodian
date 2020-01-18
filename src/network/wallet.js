import axios from './axios'

//充值列表
export function walletList(data) {
  return axios({
    url: '/api/wallet/topup',
    method: 'GET',
    params: data
  })
}

//货款列表
export function paymentGoods(data) {
  return axios({
    url: '/api/wallet/paymentGoods',
    method: 'GET',
    params: data
  })
}

//套餐
export function setMeal(data) {
  return axios({
    url: '/api/package',
    method: 'GET',
    params: data
  })
}

//支付宝充值
export function alipayOrderIsPc(data,header) {
  return axios({
    url: '/api/alipay/alipayOrderIsPc',
    method: 'POST',
    data: data,
    header: header
  })
}

//微信充值
export function weChatOrderIsPc(data,header) {
  return axios({
    url: '/api/wx/unifiedorder',
    method: 'POST',
    // responseType: 'arraybuffer',
    data: data,
    header: header
  })
}

//支付宝绑定
export function bindAlipay(data) {
  return axios({
    url: '/api/user/bindAlipay',
    method: 'POST',
    data: data
  })
}

//微信绑定
export function bindWechat(data) {
  return axios({
    url: '/api/user/bindWechat',
    method: 'POST',
    data: data
  })
}


//支付宝提现
export function alipayTransfer(data,header) {
  return axios({
    url: '/api/alipay/alipayTransfer',
    method: 'POST',
    data: data,
    header: header
  })
}

//交易查询
export function dealStatus(data) {
  return axios({
    url: '/api/business/status',
    method: 'GET',
    params: data
  })
}