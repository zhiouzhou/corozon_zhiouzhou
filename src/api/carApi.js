import axios from 'axios'
import Urls from './baseUrl'
import qs from 'qs'
let baseUrl = Urls.baseUrl
export default {
    //车辆状态统计
    getStatics(tenantId) {
        const url = baseUrl + `api/v1/motor/vehicle/${tenantId}/getStatics`
        return axios({
            method: 'get',
            url: url,
        }).then((res) => {
            return Promise.resolve(res.data)
        }).catch(function (error) {

        });
    },
    //查询车辆信息
    getCarList(params, tenantId, page, size) {
        const url = baseUrl + `api/v1/motor/vehicle/${tenantId}/getVehicles?page=${page}&size=${size}`
        return axios({
            method: 'post',
            url: url,
            data: params
        }).then((res) => {
            return Promise.resolve(res.data)
        }).catch(function (error) {

        });
    },
    //新增车辆
    addCar(params, tenantId) {
        const url = baseUrl + `api/v1/motor/vehicle/${tenantId}/addVehicle`
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
    //查询车辆详情
    getCarInfo(params, tenantId) {
        const url = baseUrl + `api/v1/motor/vehicle/${tenantId}/getVehicle`
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
    //更新车辆信息
    editCar(params, tenantId) {
        const url = baseUrl + `api/v1/motor/vehicle/${tenantId}/freshVehicle`
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
    //删除车辆
    deleteCar(tenantId, licensePlate) {
        const url = baseUrl + `api/v1/motor/vehicle/${tenantId}/removeVehicle?licensePlate=${licensePlate}`
        return axios({
            method: 'delete',
            url: url,
            loading: true,
        }).then((res) => {
            return Promise.resolve(res.data)
        }).catch(function (error) {

        });
    },
    //添加参考价格
    addPrice(params, tenantId) {
        const url = baseUrl + `api/v1/motor/reference_rent/${tenantId}/addReferenceRent`
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
    //查询参考价格
    getPrice(params, tenantId) {
        const url = baseUrl + `api/v1/motor/reference_rent/${tenantId}/getReferenceRent`
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
    //更新价格
    editPrice(params, tenantId) {
        const url = baseUrl + `api/v1/motor/reference_rent/${tenantId}/freshReferenceRent`
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
    //删除参考价格
    deletePrice(tenantId, id) {
        const url = baseUrl + `api/v1/motor/reference_rent/${tenantId}/removeReferenceRent?id=${id}`
        return axios({
            method: 'delete',
            url: url,
            loading: true,
        }).then((res) => {
            return Promise.resolve(res.data)
        }).catch(function (error) {

        });
    },
    //新增验车信息
    addCheckCar(params, tenantId) {
        const url = baseUrl + `api/v1/motor/examine/${tenantId}/addRecord`
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
    //查询验车记录
    getCheckRecord(params, tenantId) {
        const url = baseUrl + `api/v1/motor/examine/${tenantId}/getRecords`
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
    //修改验车信息
    editCheckRecord(params, tenantId) {
        const url = baseUrl + `api/v1/motor/examine/${tenantId}/freshRecord`
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
    //删除验车信息
    deleteCheckRecord(params, tenantId) {
        const url = baseUrl + `api/v1/motor/examine/${tenantId}/removeRecord`
        return axios({
            method: 'delete',
            url: url,
            loading: true,
            params
        }).then((res) => {
            return Promise.resolve(res.data)
        }).catch(function (error) {

        });
    },
    //新增换车记录
    addChangeCar(params, tenantId) {
        const url = baseUrl + `api/v1/motor/exchange/${tenantId}/addRecord`
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
    //查询换车记录
    getChangeRecord(params, tenantId) {
        const url = baseUrl + `api/v1/motor/exchange/${tenantId}/getRecords`
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
    //删除换车记录
    deleteChangeRecord(params, tenantId) {
        const url = baseUrl + `api/v1/motor/exchange/${tenantId}/removeRecord`
        return axios({
            method: 'delete',
            url: url,
            loading: true,
            params
        }).then((res) => {
            return Promise.resolve(res.data)
        }).catch(function (error) {

        });
    },
    //修改换车记录
    editChangeRecord(params, tenantId) {
        const url = baseUrl + `api/v1/motor/exchange/${tenantId}/freshRecord`
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
    // 添加维修记录
    addRepairCar(params, tenantId) {
        const url = baseUrl + `api/v1/motor/maintain/${tenantId}/addRecord`
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
    //查询维修记录
    getRepairCar(params, tenantId) {
        const url = baseUrl + `api/v1/motor/maintain/${tenantId}/getRecords`
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
    //修改维修记录
    editRepairRecord(params, tenantId) {
        const url = baseUrl + `api/v1/motor/maintain/${tenantId}/freshRecord`
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
    //删除维修记录
    deleteRepairRecord(params, tenantId) {
        const url = baseUrl + `api/v1/motor/maintain/${tenantId}/removeRecord`
        return axios({
            method: 'delete',
            url: url,
            loading: true,
            params
        }).then((res) => {
            return Promise.resolve(res.data)
        }).catch(function (error) {

        });
    },
    //新增验车信息
    addBeInDanger(params, tenantId) {
        const url = baseUrl + `api/v1/motor/loss_occurred/${tenantId}/addRecord`
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
    //根据合同查询验车记录
    getContractCheckRecord(params, tenantId) {
        const url = baseUrl + `api/v1/motor/examine/${tenantId}/getRecordByContract`
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
    //查询出险记录
    getBeInDangerRecord(params, tenantId) {
        const url = baseUrl + `api/v1/motor/loss_occurred/${tenantId}/getRecords`
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
    //查询出险详情
    getBeInDangerDetail(params, tenantId) {
        const url = baseUrl + `api/v1/motor/loss_occurred/${tenantId}/getDetailRecord`
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
    //修改出险信息
    editBeInDangerRecord(params, tenantId) {
        const url = baseUrl + `api/v1/motor/loss_occurred/${tenantId}/freshRecord`
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
    //删除出险记录
    deletetBeInDangerRecord(params, tenantId) {
        const url = baseUrl + `api/v1/motor/loss_occurred/${tenantId}/removeRecord`
        return axios({
            method: 'delete',
            url: url,
            loading: true,
            params
        }).then((res) => {
            return Promise.resolve(res.data)
        }).catch(function (error) {

        });
    },
    //新增保养记录
    addMaintainRecord(params, tenantId) {
        const url = baseUrl + `api/v1/motor/upkeep/${tenantId}/addRecord`
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
    //查询保养记录
    getMaintainRecord(params, tenantId) {
        const url = baseUrl + `api/v1/motor/upkeep/${tenantId}/getRecords`
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
    //修改保养记录
    editMaintainRecord(params, tenantId) {
        const url = baseUrl + `api/v1/motor/upkeep/${tenantId}/freshRecord`
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
    //删除保养记录
    editMaintainRecord(params, tenantId) {
        const url = baseUrl + `api/v1/motor/upkeep/${tenantId}/removeRecord`
        return axios({
            method: 'delete',
            url: url,
            loading: true,
            params
        }).then((res) => {
            return Promise.resolve(res.data)
        }).catch(function (error) {

        });
    },
    //退车
    returnCar(params, tenantId) {
        const url = baseUrl + `api/v1/motor/rent/${tenantId}/returnVehicle`
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
    //查询已租车辆
    getRentAlreadyList(params,tenantId) {
        const url = baseUrl + `api/v1/motor/rent/${tenantId}/getVehiclesInRent`
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
    //查询换车车辆
    getchangeList(params,tenantId) {
        const url = baseUrl + `api/v1/motor/rent/${tenantId}/getVehiclesInChange`
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
}