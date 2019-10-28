import axios from 'axios'
import Urls from './baseUrl'
import qs from 'qs'
let baseUrl = Urls.baseUrl
export default {
    //查询企业信息
    getCompanyInfo(params) {
        const url = baseUrl + `api/v1/usercenter/company/${params.tenantId}`
        return axios({
            method: 'get',
            url: url,
            loading: true,
        }).then((res) => {
            return Promise.resolve(res.data)
        }).catch(function (error) {

        });
    },
    //修改企业信息
    editCompany(params, tenantId) {
        const url = baseUrl + `api/v1/usercenter/company/${tenantId}`
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
    //查询员工列表
    getStaffList(params, tenantId, qArr) {
        let url = ''
        if (qArr.length == 1) {
            url = baseUrl + `api/v1/usercenter/company/${tenantId}/companyMembers?q=${qArr[0]}`
        } else if (qArr.length == 2) {
            url = baseUrl + `api/v1/usercenter/company/${tenantId}/companyMembers?q=${qArr[0]}&q=${qArr[1]}`

        } else if (qArr.length == 3) {
            url = baseUrl + `api/v1/usercenter/company/${tenantId}/companyMembers?q=${qArr[0]}&q=${qArr[1]}&q=${qArr[2]}`

        }
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
    //查询员工数量
    getStaffStatic(tenantId) {
        const url = baseUrl + `api/v1/usercenter/company/${tenantId}/companyMember/statistics`
        return axios({
            method: 'get',
            url: url,
            loading: true,
        }).then((res) => {
            return Promise.resolve(res.data)
        }).catch(function (error) {

        });
    },
    //新增员工
    addStaff(params, tenantId) {
        const url = baseUrl + `api/v1/usercenter/company/${tenantId}/companyMember`
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
    //修改员工信息
    editStaff(params, tenantId, memberId) {
        const url = baseUrl + `api/v1/usercenter/company/${tenantId}/companyMember/${memberId}`
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
    //删除员工
    deleteStaff(tenantId, memberId) {
        const url = baseUrl + `api/v1/usercenter/company/${tenantId}/companyMember/${memberId}`
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
    //查询品牌车型列表
    getVehicleTypeList(params, tenantId, page, size) {
        const url = baseUrl + `api/v1/motor/vehicle_modle/${tenantId}/queryModels?page=${page}&size=${size}`
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
    //新增车型
    addVehicleType(params, tenantId, brand, model) {
        const url = baseUrl + `api/v1/motor/vehicle_modle/${tenantId}/addVehicleModel?brand=${brand}&model=${model}`
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
    //修改品牌车型
    editVehicleType(params, tenantId) {
        const url = baseUrl + `api/v1/motor/vehicle_modle/${tenantId}/freshVehicleModel`
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
    //删除品牌车型
    deleteVehicleType(tenantId, id) {
        const url = baseUrl + `api/v1/motor/vehicle_modle/${tenantId}/removeVehicleModel?id=${id}`
        return axios({
            method: 'delete',
            url: url,
            loading: true,
            // data: {}
        }).then((res) => {
            return Promise.resolve(res.data)
        }).catch(function (error) {

        });
    },
    //查询省直辖市自治区特别行政区列表
    getProvince() {
        const url = baseUrl + `api/v1/operation/administrative_area/getProvinces`
        return axios({
            method: 'get',
            url: url,
            loading: true,
        }).then((res) => {
            return Promise.resolve(res.data)
        }).catch(function (error) {

        });
    },
    //查询市列表
    getCity(params) {
        const url = baseUrl + `api/v1/operation/administrative_area/getCities`
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
    //查询县区列表
    getDistricts(params) {
        const url = baseUrl + `api/v1/operation/administrative_area/getDistricts`
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
    //查询企业角色
    getRole() {
        const url = baseUrl + `api/v1/usercenter/company/roles`
        return axios({
            method: 'get',
            url: url,
            loading: true,
        }).then((res) => {
            return Promise.resolve(res.data)
        }).catch(function (error) {

        });
    },
    //上传图片Token
    getUploadToken(params) {
        const url = baseUrl + `api/v1/tagua/qiniu/token`
        return axios({
            method: 'get',
            url: url,
            params,
        }).then((res) => {
            return Promise.resolve(res.data)
        }).catch(function (error) {

        });
    },
}