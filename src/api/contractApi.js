import axios from 'axios'
import Urls from './baseUrl'
import qs from 'qs'
let baseUrl = Urls.baseUrl
export default {
    //查询合同列表
    getContractList(params, tenantId) {
        const url = baseUrl + `api/v1/contract/company/${tenantId}/contracts`
        return axios({
            method: 'get',
            url: url,
            params
        }).then((res) => {
            return Promise.resolve(res.data)
        }).catch(function (error) {

        });
    },
    //新增合同模板
    addContractTem(params, tenantId) {
        const url = baseUrl + `api/v1/contract_template/company/${tenantId}/template`
        return axios({
            method: 'post',
            url: url,
            data: params
        }).then((res) => {
            return Promise.resolve(res.data)
        }).catch(function (error) {

        });
    },
    //获取合同模板列表
    getContractTem(params, tenantId) {
        const url = baseUrl + `api/v1/contract_template/company/${tenantId}/templates`
        return axios({
            method: 'get',
            url: url,
            params
        }).then((res) => {
            return Promise.resolve(res.data)
        }).catch(function (error) {

        });
    },
    //获取合同模板变量
    getContractTemStatus() {
        const url = baseUrl + `api/v1/contract_template/templateVariables`
        return axios({
            method: 'get',
            url: url,
        }).then((res) => {
            return Promise.resolve(res.data)
        }).catch(function (error) {

        });
    },
    //修改企业合同模板
    editContractTemplate(params, tenantId, id) {
        const url = baseUrl + `api/v1/contract_template/company/${tenantId}/template/${id}`
        return axios({
            method: 'put',
            url: url,
            data: params
        }).then((res) => {
            return Promise.resolve(res.data)
        }).catch(function (error) {

        });
    },
    //企业合同模板详情
    getTemplateDetail(tenantId, id) {
        const url = baseUrl + `api/v1/contract_template/company/${tenantId}/template/${id}`
        return axios({
            method: 'get',
            url: url,
        }).then((res) => {
            return Promise.resolve(res.data)
        }).catch(function (error) {

        });
    },
    // 删除合同模板
    deleteTemplate(tenantId, id) {
        const url = baseUrl + `api/v1/contract_template/company/${tenantId}/template/${id}`
        return axios({
            method: 'delete',
            url: url,
        }).then((res) => {
            return Promise.resolve(res.data)
        }).catch(function (error) {

        });
    },
    //禁用或启用合同模板
    checkStatus(tenantId, id, enabled) {
        const url = baseUrl + `api/v1/contract_template/company/${tenantId}/template/${id}?enabled=${enabled}`
        return axios({
            method: 'post',
            url: url,
        }).then((res) => {
            return Promise.resolve(res.data)
        }).catch(function (error) {

        });
    },
    //企业客户模糊搜索
    getCustomerList(params, tenantId) {
        const url = baseUrl + `api/v1/usercenter/company/${tenantId}/customer/fuzzy`
        return axios({
            method: 'get',
            url: url,
            params
        }).then((res) => {
            return Promise.resolve(res.data)
        }).catch(function (error) {

        });
    },
    //新增待签约合同
    addSignContract(params, tenantId) {
        const url = baseUrl + `api/v1/contract/company/${tenantId}/contract`
        return axios({
            method: 'post',
            url: url,
            data: params
        }).then((res) => {
            return Promise.resolve(res.data)
        }).catch(function (error) {

        });
    },
    //合同详情
    getContractDetail(tenantId, contractId) {
        const url = baseUrl + `api/v1/contract/company/${tenantId}/contract/${contractId}`
        return axios({
            method: 'get',
            url: url,
        }).then((res) => {
            return Promise.resolve(res.data)
        }).catch(function (error) {

        });
    },
    //修改合同
    editContract(params, tenantId, contractId) {
        const url = baseUrl + `api/v1/contract/company/${tenantId}/contract/${contractId}`
        return axios({
            method: 'put',
            url: url,
            data: params
        }).then((res) => {
            return Promise.resolve(res.data)
        }).catch(function (error) {

        });
    },
    //合同统计
    getContractStatics(tenantId) {
        const url = baseUrl + `api/v1/contract/company/${tenantId}/contract/statistics`
        return axios({
            method: 'get',
            url: url,
        }).then((res) => {
            return Promise.resolve(res.data)
        }).catch(function (error) {

        });
    },
    //销售统计
    saleStatics(tenantId) {
        const url = baseUrl + `api/v1/contract/company/${tenantId}/contract/sales/statistics`
        return axios({
            method: 'get',
            url: url,
        }).then((res) => {
            return Promise.resolve(res.data)
        }).catch(function (error) {

        });
    },
    //模糊查询合同车辆
    getContractCar(tenantId, plateNumber, status) {
        let url = ''
        if (status.length == 1) {
            url = baseUrl + `api/v1/contract/company/${tenantId}/contract/motor/fuzzy?plateNumber=${plateNumber}&contractStatus=${status[0]}`
        } else if (status.length == 2) {
            url = baseUrl + `api/v1/contract/company/${tenantId}/contract/motor/fuzzy?plateNumber=${plateNumber}&contractStatus=${status[0]}&contractStatus=${status[1]}`
        } else if (status.length == 3) {
            url = baseUrl + `api/v1/contract/company/${tenantId}/contract/motor/fuzzy?plateNumber=${plateNumber}&contractStatus=${status[0]}&contractStatus=${status[1]}&contractStatus=${status[2]}`
        } else if (status.length == 4) {
            url = baseUrl + `api/v1/contract/company/${tenantId}/contract/motor/fuzzy?plateNumber=${plateNumber}&contractStatus=${status[0]}&contractStatus=${status[1]}&contractStatus=${status[2]}&contractStatus=${status[3]}`
        } else {
            url = baseUrl + `api/v1/contract/company/${tenantId}/contract/motor/fuzzy?plateNumber=${plateNumber}&contractStatus=${status[0]}&contractStatus=${status[1]}&contractStatus=${status[2]}&contractStatus=${status[3]}&contractStatus=${status[4]}`
        }
        return axios({
            method: 'get',
            url: url,
            // params,
        }).then((res) => {
            return Promise.resolve(res.data)
        }).catch(function (error) {

        });
    },
    //财务  新增签约收款
    addSignReceipts(params, tenantId) {
        const url = baseUrl + `api/v1/finance/signed_receipt/${tenantId}/addRecord`
        return axios({
            method: 'post',
            url: url,
            data: params
        }).then((res) => {
            return Promise.resolve(res.data)
        }).catch(function (error) {

        });
    },
    //收租金
    rentConllection(params, tenantId) {
        const url = baseUrl + `api/v1/finance/pay_rent/${tenantId}/addRecord`
        return axios({
            method: 'post',
            url: url,
            data: params
        }).then((res) => {
            return Promise.resolve(res.data)
        }).catch(function (error) {

        });
    },
    //查看应收记录
    getReceivableRecord(params, tenantId) {
        const url = baseUrl + `api/v1/finance/receipt_payment/${tenantId}/getReceivable`
        return axios({
            method: 'post',
            url: url,
            data: params
        }).then((res) => {
            return Promise.resolve(res.data)
        }).catch(function (error) {

        });
    },
    //新增应收款
    addReceivable(params, tenantId) {
        const url = baseUrl + `api/v1/finance/receipt_payment/${tenantId}/addReceivable`
        return axios({
            method: 'post',
            url: url,
            data: params
        }).then((res) => {
            return Promise.resolve(res.data)
        }).catch(function (error) {

        });
    },

    //新增已收记录
    addAccepted(params, tenantId) {
        const url = baseUrl + `api/v1/finance/receipt_payment/${tenantId}/addReceived`
        return axios({
            method: 'post',
            url: url,
            data: params
        }).then((res) => {
            return Promise.resolve(res.data)
        }).catch(function (error) {

        });
    },

    //查询已收款
    getAccepted(params, tenantId, page, size) {
        const url = baseUrl + `api/v1/finance/receipt_payment/${tenantId}/getReceived?page=${page}&size=${size}`
        return axios({
            method: 'post',
            url: url,
            data: params
        }).then((res) => {
            return Promise.resolve(res.data)
        }).catch(function (error) {

        });
    },

    //新增应付记录
    addPayable(params, tenantId) {
        const url = baseUrl + `api/v1/finance/receipt_payment/${tenantId}/addPayable`
        return axios({
            method: 'post',
            url: url,
            data: params
        }).then((res) => {
            return Promise.resolve(res.data)
        }).catch(function (error) {

        });
    },
    //新增已付记录
    addPaidRecrd(params, tenantId) {
        const url = baseUrl + `api/v1/finance/receipt_payment/${tenantId}/addPaid`
        return axios({
            method: 'post',
            url: url,
            data: params
        }).then((res) => {
            return Promise.resolve(res.data)
        }).catch(function (error) {

        });
    },
    //查看已付记录
    getPaidRecord(params, tenantId, page, size) {
        const url = baseUrl + `api/v1/finance/receipt_payment/${tenantId}/getPaid?page=${page}&size=${size}`
        return axios({
            method: 'post',
            url: url,
            data: params
        }).then((res) => {
            return Promise.resolve(res.data)
        }).catch(function (error) {

        });
    },

    //查询应付记录
    getPayableRecord(params, tenantId) {
        const url = baseUrl + `api/v1/finance/receipt_payment/${tenantId}/getPayable`
        return axios({
            method: 'post',
            url: url,
            data: params
        }).then((res) => {
            return Promise.resolve(res.data)
        }).catch(function (error) {

        });
    },
    //查询应缴租金
    getPayableRent(params, tenantId) {
        const url = baseUrl + `api/v1/finance/pay_rent/${tenantId}/getReceivableRent`
        return axios({
            method: 'get',
            url: url,
            params
        }).then((res) => {
            return Promise.resolve(res.data)
        }).catch(function (error) {

        });
    },
    //查询应退押金
    getDepositPayable(params, tenantId) {
        const url = baseUrl + `api/v1/finance/deposit/${tenantId}/getPayableDeposit`
        return axios({
            method: 'get',
            url: url,
            params
        }).then((res) => {
            return Promise.resolve(res.data)
        }).catch(function (error) {

        });
    },
    //退押金
    returnDeposit(params, tenantId) {
        const url = baseUrl + `api/v1/finance/deposit/${tenantId}/addRecord`
        return axios({
            method: 'post',
            url: url,
            data: params
        }).then((res) => {
            return Promise.resolve(res.data)
        }).catch(function (error) {

        });
    },
    //查询财务收付款统计
    getFinanceStatics( tenantId) {
        const url = baseUrl + `api/v1/finance/receipt_payment/${tenantId}/getStatics`
        return axios({
            method: 'get',
            url: url,
        }).then((res) => {
            return Promise.resolve(res.data)
        }).catch(function (error) {

        });
    },
}