const state = {
    access_token: sessionStorage.getItem(`access_token`) || ``,
    tenantId:sessionStorage.getItem(`tenantId`)||``,
    userInfo: JSON.parse(sessionStorage.getItem(`userInfo`)) || {},
    // roleInfoList:JSON.parse(sessionStorage.getItem(`roleInfoList`))||[],
    // roleArr:JSON.parse(sessionStorage.getItem(`roleArr`))||[],
};
const getters = {

};
const mutations = {
    setToken(state, token) {
        sessionStorage.setItem(`access_token`, token)
        state.access_token = token
    },
    setTenantId(state,tenantId){
        sessionStorage.setItem(`tenantId`, tenantId)
        state.tenantId = tenantId
    },
    setUserInfo(state, userInfo) {
        sessionStorage.setItem(`userInfo`, userInfo)
        console.log(userInfo)
        state.userInfo = JSON.parse(userInfo)
    },
    clearToken(state) {
        sessionStorage.setItem(`access_token`, ``);
        // sessionStorage.setItem(`userInfo`, ``);
        // sessionStorage.setItem(`roleArr`, ``);
        // sessionStorage.setItem(`roleInfoList`,``);

        state.access_token = ``;
        // state.userInfo = {}
        // state.roleArr = []
        // state.roleInfoList = []
    },
    //保存菜单
    setRoleInfoList(state, roleInfoList) {
        sessionStorage.setItem(`roleInfoList`, JSON.stringify(roleInfoList))
        state.roleInfoList = roleInfoList
    },
    setRole(state,roleArr){
        sessionStorage.setItem(`roleArr`, JSON.stringify(roleArr))
        state.roleArr = roleArr
    },
};
const actions = {
    updateUserInfo(context, value) {
        context.commit('setUserInfo', value)
    },
}
export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}