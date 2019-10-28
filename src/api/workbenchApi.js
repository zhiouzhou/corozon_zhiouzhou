import axios from 'axios'
import Urls from './baseUrl'
import qs from 'qs'
let baseUrl = Urls.baseUrl
export default {
     //企业综合统计
     getStatics( tenantId) {
        const url = baseUrl + `api/v1/usercenter/company/${tenantId}/statistics`
        return axios({
            method: 'get',
            url: url,
            loading: true
        }).then((res) => {
            return Promise.resolve(res.data)
        }).catch(function (error) {

        });
    },
}