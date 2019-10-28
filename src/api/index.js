import axios from 'axios'
import Vue from 'vue'
import router from '../router/index'
import store from '../assets/data/index'
import qs from 'qs'
console.log(axios)
let loadingInstance = null;

// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';        //配置请求头
axios.interceptors.request.use(function (config) {
	console.log(config)

	const token = sessionStorage.getItem('access_token', '');
	console.log(token)
	if (token) {
		config.headers.Authentication = 'bearer' + ' ' + token
	} else {
		// config.data.cityId = currentSelectCityId
		// config.data.userClassId = 1
		// config.data.userDisplayClass = 0
	}
	//有些接口不需要token,有token会报异常
	if (config.noRequireToken) {
		config.headers.access_token = ''
	}
	//web商城
	if (config.data) {
		// config.data.deviceType = 3
	}
	//TODO:加载中的转圈
	if (config.loading) {
		loadingInstance = Vue.prototype.$loading({
			// lock: true,
			text: '加载中',
			spinner: '',//自定义加载图标类名
			background: 'rgba(255, 255, 255, 0)',
			customClass: ''//	Loading 的自定义类名
		});
	}
	//form提交的方式
	if (config.isForm) {
		config.headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
		config.transformRequest = [function (obj) {
			var str = [];
			for (var p in obj) {
				if (obj.hasOwnProperty(p)) {
					str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
				}
			}
			return str.join("&");
		}];
	}
	return config;
}, function (error) {
	return Promise.reject(error);
});


axios.interceptors.response.use(function (response) {
	console.log(response)
	if (response.config.loading) {
		loadingInstance && loadingInstance.close()
	}
	if (response.data && (response.data.code === '40003'
		|| response.data.desc == 'Token已过期')) {
		Vue.prototype.$message('登录已过期，请重新登录')
		store.commit('user/clearToken')
		console.log(store)
		router.replace({
			path: "/login", query: {
				auto: true
			}
		});
	}
	return response;
}, function (error) {
	if (error.config.loading) {
		// loadingInstance && loadingInstance.close()
	}
	return Promise.reject(error);
});