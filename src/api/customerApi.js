import axios from 'axios'
import Urls from './baseUrl'
import qs from 'qs'
let baseUrl = Urls.baseUrl
//查询客户列表
export default {
    getCustomerList(params, tenantId) {
        const url = baseUrl + `api/v1/usercenter/company/${tenantId}/customers`
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
    //查询客户数量统计
    getCustomerStatic(tenantId){
        const url = baseUrl + `api/v1/usercenter/company/${tenantId}/customer/statistics`
        return axios({
            method: 'get',
            url: url,
            loading: true,
        }).then((res) => {
            return Promise.resolve(res.data)
        }).catch(function (error) {

        });
    },
    //新增客户
    addCustomer(params, tenantId) {
        const url = baseUrl + `api/v1/usercenter/company/${tenantId}/customer`
        return axios({
            method: 'post',
            url: url,
            loading: true,
            data: params
        }).then((res) => {
            return Promise.resolve(res.data)
        }).catch(function (error) {

        });
    },
    //修改客户
    editCustomer(params, tenantId, id) {
        const url = baseUrl + `api/v1/usercenter/company/${tenantId}/customer/${id}`
        return axios({
            method: 'put',
            url: url,
            loading: true,
            data: params
        }).then((res) => {
            return Promise.resolve(res.data)
        }).catch(function (error) {

        });
    },
    //删除客户
    deleteCustomer(tenantId, id) {
        const url = baseUrl + `api/v1/usercenter/company/${tenantId}/customer/${id}`
        return axios({
            method: 'delete',
            url: url,
            loading: true,
            data: {}
        }).then((res) => {
            return Promise.resolve(res.data)
        }).catch(function (error) {

        });
    },
    //查询企业客户沟通记录
    getIntentionCustomer(params, tenantId) {
        const url = baseUrl + `api/v1/usercenter/company/${tenantId}/customerCommRecords`
        return axios({
            method: 'get',
            url: url,
            loading: true,
            params
        }).then((res) => {
            return Promise.resolve(res.data)
        }).catch(function (error) {

        });
    },
    //新增客户沟通记录
    addIntentionRecord(params, tenantId) {
        const url = baseUrl + `api/v1/usercenter/company/${tenantId}/customerCommRecord`
        return axios({
            method: 'post',
            url: url,
            loading: true,
            data: params
        }).then((res) => {
            return Promise.resolve(res.data)
        }).catch(function (error) {

        });
    },
    //修改沟通记录
    editIntentionRecord(params, tenantId,id) {
        const url = baseUrl + `api/v1/usercenter/company/${tenantId}/customerCommRecord/${id}`
        return axios({
            method: 'put',
            url: url,
            loading: true,
            data: params
        }).then((res) => {
            return Promise.resolve(res.data)
        }).catch(function (error) {

        });
    },
    //删除沟通记录
    deleteRecord(tenantId,id){
        const url = baseUrl + `api/v1/usercenter/company/${tenantId}/customerCommRecord/${id}`
        return axios({
            method: 'delete',
            url: url,
            loading: true,
        }).then((res) => {
            return Promise.resolve(res.data)
        }).catch(function (error) {

        });
    },
    //获取准假车型
    getPermitClass(){
        const url = baseUrl + `api/v1/usercenter/permitClass`
        return axios({
            method: 'get',
            url: url,
            loading: true,
        }).then((res) => {
            return Promise.resolve(res.data)
        }).catch(function (error) {

        });  
    },
}