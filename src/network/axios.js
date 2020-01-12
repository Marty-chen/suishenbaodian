import originAxios from 'axios'
import qs from 'qs'
import store from '../store/index.js'
import {
	Message,
	Loading
} from 'element-ui';
import vm from "../main.js"


export default function axios(option) {
	return new Promise((resolve, reject) => {
		// 1.创建axios的实例

		const instance = originAxios.create({
			baseURL: '/api',
			timeout: 100000,
			params: option.params,
			data: option.data,
			responseType: option.responseType,
			// headers: store.state.header
			headers: option.header ? option.header : store.state.header
		});
		// console.log(option)
		//显示加载组件
		// const loading = Loading.service({
		// 	lock: true,
		// 	text: 'Loading',
		// 	spinner: 'el-icon-loading',
		// 	background: 'rgba(0, 0, 0, 0.7)'
		// });

		// 配置请求和响应拦截

		instance.interceptors.request.use(config => {
			// 1.当发送网络请求时, 在页面中添加一个loading组件, 作为动画
			// 2.某些请求要求用户必须登录, 判断用户是否有token, 如果没有token跳转到login页面
			// 3.对请求的参数进行序列化(看服务器是否需要序列化)
			// 4.等等
			// console.log(config)
			return config
		}, err => {

			return err
		})

		instance.interceptors.response.use(response => {
			// console.log(response);
			//获取数据成功，关闭加载弹窗
			// loading.close();
			if (response.data.code == "0000") {
				return response

			}
			//token异常  提示用户重新登陆
			if (response.data.code == "1001" || response.data.code == "1007" || response.data.code == "1008" || response.data.code == "1009") {
				localStorage.removeItem("Flag");
				localStorage.removeItem("userInfo");
				localStorage.removeItem("menuList");
				store.commit("saveMenuList", []);
				store.commit("saveUserInfo", {});
				
				Message.error(response.data.msg + '  ' + '请重新登录');
				vm.$router.push('/login')
			}

			return response
		}, err => {
			// console.log('来到了response拦截failure中');
			console.log(err);
			window.alert('网络开小差了哦，请稍后再试');
			//获取数据成功，关闭加载弹窗
			return err
		})
		// 2.传入对象进行网络请求
		instance(option).then(res => {
			resolve(res)
		}).catch(err => {
			reject(err)
		})
	})
}