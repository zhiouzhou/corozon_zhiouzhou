import axios from 'axios'
import Urls from './baseUrl'
import qs from 'qs'
let baseUrl = Urls.baseUrl
// 登录
// export function 
export default {
    //登录
    getUserInfo(params) {
        const url = baseUrl + `api/v1/usercenter/authentication/login`
        return axios({
            method: 'post',
            url: url,
            loading: true,
            data: qs.stringify(params),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then((res) => {
            return Promise.resolve(res.data)
        }).catch(function (error) {

        });
    },
    //获取短信验证码
    getCode(params) {
        const url = baseUrl + `api/v1/auth/code/SMS`
        return axios({
            method: 'get',
            url: url,
            loading: true,
            params,
        }).then((res) => {
            return Promise.resolve(res.data)
        }).catch(function (error) {

        });
    },
    //注册
    register(params) {
        const url = baseUrl + `api/v1/usercenter/company`
        return axios({
            method: 'post',
            url: url,
            loading: true,
            data: qs.stringify(params),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then((res) => {
            return Promise.resolve(res.data)
        }).catch(function (error) {

        });
    },
}