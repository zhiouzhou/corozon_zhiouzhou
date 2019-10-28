import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import login from '@/components/login/login'
import customerManage from '@/components/customerManage/customerManage'
import addCustomer from '@/components/customerManage/addCustomer'
import addExchangeRecords from '@/components/customerManage/addExchangeRecords'
import contractManage from '@/components/contractManage/contractManage'
import contractDetail from '@/components/contractManage/contractDetail'
import saleManage from '@/components/saleManage/saleManage'
import addSign from '@/components/saleManage/addSign'
import addRenewal from '@/components/saleManage/addRenewal'
import carManage from '@/components/carManage/carManage'
import addCar from '@/components/carManage/addCar'
import returnCar from '@/components/carManage/returnCar'
import entryRecord from '@/components/carManage/entryRecord'
import financeManage from '@/components/financeManage/financeManage'
import addSignReceipts from '@/components/financeManage/addSignReceipts'
import rentCollection from '@/components/financeManage/rentCollection'
import addReceivable from '@/components/financeManage/addReceivable'
import addAccepted from '@/components/financeManage/addAccepted'
import addPaid from '@/components/financeManage/addPaid'
import addPayable from '@/components/financeManage/addPayable'
import returnDeposit from '@/components/financeManage/returnDeposit'
import companyDeploy from '@/components/deployManage/companyDeploy'
import staffManage from '@/components/deployManage/staffManage'
import addStaff from '@/components/deployManage/addStaff'
import vehicleType from '@/components/deployManage/vehicleType'
import addVehicleType from '@/components/deployManage/addVehicleType'
import selectAddress from '@/components/deployManage/selectAddress'
import riskManagement from '@/components/riskManagement/riskManagement'
import addMot from '@/components/riskManagement/addMot'
import motRecord from '@/components/riskManagement/motRecord'
import addPolicy from '@/components/riskManagement/addPolicy'
import renewalRecord from '@/components/riskManagement/renewalRecord'
import addContract from '@/components/contractManage/addContract'
import addCheckCar from '@/components/carManage/addCheckCar'
import addChangeCar from '@/components/carManage/addChangeCar'
import addRepair from '@/components/carManage/addRepair'
import addBeInDanger from '@/components/carManage/addBeInDanger'
import addMaintain from '@/components/carManage/addMaintain'
//合同模板配置
import contractTemplete from '@/components/deployManage/contractTemplete'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: "/",
      redirect: "/login",
    },
    {
      path: "/login",
      name: "login",
      component: login,
    },
    {
      path: '/HelloWorld',
      name: 'HelloWorld',
      component: HelloWorld,
      meta: {
        keepalive: true
      }
    },{
      path: '/customerManage',
      name: 'customerManage',
      component: customerManage,
      meta: {
        keepalive: true
      }
    },{
      path: '/addCustomer',
      name: 'addCustomer',
      component: addCustomer,
      meta: {
        keepalive: true
      }
    },{
      path: '/addExchangeRecords',
      name: 'addExchangeRecords',
      component: addExchangeRecords,
      meta: {
        keepalive: true
      }
    },{
      path: '/contractManage',
      name: 'contractManage',
      component: contractManage,
      meta: {
        keepalive: true
      }
    },{
      path: '/contractDetail',
      name: 'contractDetail',
      component: contractDetail,
      meta: {
        keepalive: true
      }
    },{
      path: '/saleManage',
      name: 'saleManage',
      component: saleManage,
      meta: {
        keepalive: true
      }
    },{
      path: '/addSign',
      name: 'addSign',
      component: addSign,
      meta: {
        keepalive: true
      }
    },{
      path: '/addRenewal',
      name: 'addRenewal',
      component: addRenewal,
      meta: {
        keepalive: true
      }
    },{
      path: '/carManage',
      name: 'carManage',
      component: carManage,
      meta: {
        keepalive: true
      }
    },{
      path: '/addCar',
      name: 'addCar',
      component: addCar,
      meta: {
        keepalive: true
      }
    },{
      path: '/entryRecord',
      name: 'entryRecord',
      component: entryRecord,
      meta: {
        keepalive: true
      }
    },{
      path: '/financeManage',
      name: 'financeManage',
      component: financeManage,
      meta: {
        keepalive: true
      }
    },{
      path: '/companyDeploy',
      name: 'companyDeploy',
      component: companyDeploy,
      meta: {
        keepalive: true
      }
    },{
      path: '/staffManage',
      name: 'staffManage',
      component: staffManage,
      meta: {
        keepalive: true
      }
    },{
      path: '/addStaff',
      name: 'addStaff',
      component: addStaff,
      meta: {
        keepalive: true
      }
    },{
      path: '/vehicleType',
      name: 'vehicleType',
      component: vehicleType,
      meta: {
        keepalive: true
      }
    },{
      path: '/addVehicleType',
      name: 'addVehicleType',
      component: addVehicleType,
      meta: {
        keepalive: true
      }
    },{
      path: '/selectAddress',
      name: 'selectAddress',
      component: selectAddress,
      meta: {
        keepalive: true
      }
    },{
      path: '/riskManagement',
      name: 'riskManagement',
      component: riskManagement,
      meta: {
        keepalive: true
      }
    },{
      path: '/addMot',
      name: 'addMot',
      component: addMot,
      meta: {
        keepalive: true
      }
    },{
      path: '/motRecord',
      name: 'motRecord',
      component: motRecord,
      meta: {
        keepalive: true
      }
    },{
      path: '/addPolicy',
      name: 'addPolicy',
      component: addPolicy,
      meta: {
        keepalive: true
      }
    },{
      path: '/renewalRecord',
      name: 'renewalRecord',
      component: renewalRecord,
      meta: {
        keepalive: true
      }
    },{
      path: '/addContract',
      name: 'addContract',
      component: addContract,
      meta: {
        keepalive: true
      }
    },{
      path: '/addCheckCar',
      name: 'addCheckCar',
      component: addCheckCar,
      meta: {
        keepalive: true
      }
    },{
      path: '/addChangeCar',
      name: 'addChangeCar',
      component: addChangeCar,
      meta: {
        keepalive: true
      }
    },{
      path: '/contractTemplete',
      name: 'contractTemplete',
      component: contractTemplete,
      meta: {
        keepalive: true
      }
    },{
      path: '/addRepair',
      name: 'addRepair',
      component: addRepair,
      meta: {
        keepalive: true
      }
    },{
      path: '/addBeInDanger',
      name: 'addBeInDanger',
      component: addBeInDanger,
      meta: {
        keepalive: true
      }
    },{
      path: '/addMaintain',
      name: 'addMaintain',
      component: addMaintain,
      meta: {
        keepalive: true
      }
    },{
      path: '/addSignReceipts',
      name: 'addSignReceipts',
      component: addSignReceipts,
      meta: {
        keepalive: true
      }
    },{
      path: '/addReceivable',
      name: 'addReceivable',
      component: addReceivable,
      meta: {
        keepalive: true
      }
    },{
      path: '/addAccepted',
      name: 'addAccepted',
      component: addAccepted,
      meta: {
        keepalive: true
      }
    },{
      path: '/addPaid',
      name: 'addPaid',
      component: addPaid,
      meta: {
        keepalive: true
      }
    },{
      path: '/addPayable',
      name: 'addPayable',
      component: addPayable,
      meta: {
        keepalive: true
      }
    },{
      path: '/returnCar',
      name: 'returnCar',
      component: returnCar,
      meta: {
        keepalive: true
      }
    },{
      path: '/rentCollection',
      name: 'rentCollection',
      component: rentCollection,
      meta: {
        keepalive: true
      }
    },{
      path: '/returnDeposit',
      name: 'returnDeposit',
      component: returnDeposit,
      meta: {
        keepalive: true
      }
    }
  ]
})
