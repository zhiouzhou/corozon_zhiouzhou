import axios from 'axios'
import Urls from './baseUrl'
import qs from 'qs'
let baseUrl = Urls.baseUrl
//查询客户列表
export default {
    //查询车辆年检状态
    getVehicleMots(params, tenantId) {
        const url = baseUrl + `api/v1/motor/mot/${tenantId}/getVehicleMots`
        return axios({
            method: 'post',
            url: url,
            loading: true,
            data: params,
        }).then((res) => {
            return Promise.resolve(res.data)
        }).catch(function (error) {

        });
    },
    //按车牌查询年检记录
    getMotList(params, tenantId) {
        const url = baseUrl + `api/v1/motor/mot/${tenantId}/getMotRecords`
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
    //根据车牌号查询车辆品牌车型
    getVehicleModel(params, tenantId) {
        const url = baseUrl + `api/v1/motor/vehicle/${tenantId}/getVehicleModel`
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
    //远程联想车牌列表
    getVehicleListl(params, tenantId) {
        const url = baseUrl + `api/v1/motor/vehicle/${tenantId}/getLicensePlates`
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
    //新增年检
    addMot(params, tenantId) {
        const url = baseUrl + `api/v1/motor/mot/${tenantId}/addMotRecord`
        return axios({
            method: 'post',
            url: url,
            loading: true,
            data: params,
        }).then((res) => {
            return Promise.resolve(res.data)
        }).catch(function (error) {

        });
    },
    //编辑年检信息
    editMot(params, tenantId) {
        const url = baseUrl + `api/v1/motor/mot/${tenantId}/freshMotRecord`
        return axios({
            method: 'post',
            url: url,
            loading: true,
            data: params,
        }).then((res) => {
            return Promise.resolve(res.data)
        }).catch(function (error) {

        });
    },
    //删除年检记录
    deleteMot(params, tenantId) {
        const url = baseUrl + `api/v1/motor/mot/${tenantId}/removeMotRecord`
        return axios({
            method: 'delete',
            url: url,
            loading: true,
            params,
        }).then((res) => {
            return Promise.resolve(res.data)
        }).catch(function (error) {

        });
    },
    //查询车辆保险状态
    getRenewalStatus(params, tenantId) {
        const url = baseUrl + `api/v1/motor/insurance/${tenantId}/getVehicleInsurance`
        return axios({
            method: 'post',
            url: url,
            loading: true,
            data: params,
        }).then((res) => {
            return Promise.resolve(res.data)
        }).catch(function (error) {

        });
    },
    //新增保单
    addPolicy(params, tenantId) {
        const url = baseUrl + `api/v1/motor/insurance/${tenantId}/addRecord`
        return axios({
            method: 'post',
            url: url,
            loading: true,
            data: params,
        }).then((res) => {
            return Promise.resolve(res.data)
        }).catch(function (error) {

        });
    },
    //根据车牌查询保单记录
    getRenewalRecord(params, tenantId) {
        const url = baseUrl + `api/v1/motor/insurance/${tenantId}/getOverdue`
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
    //修改保单
    editRenewalRecord(params, tenantId) {
        const url = baseUrl + `api/v1/motor/insurance/${tenantId}/freshRecord`
        return axios({
            method: 'post',
            url: url,
            loading: true,
            data: params,
        }).then((res) => {
            return Promise.resolve(res.data)
        }).catch(function (error) {

        });
    },
    //删除保单记录
    deleteRenewal(params, tenantId) {
        const url = baseUrl + `api/v1/motor/insurance/${tenantId}/removeRecord`
        return axios({
            method: 'delete',
            url: url,
            loading: true,
            params,
        }).then((res) => {
            return Promise.resolve(res.data)
        }).catch(function (error) {

        });
    },
    //获取风控统计数据
    getRiskStatics( tenantId) {
        const url = baseUrl + `api/v1/motor/risk/${tenantId}/getRiskStatics`
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