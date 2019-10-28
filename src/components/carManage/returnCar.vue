<template>
  <div id="returnCar">
    <div style="background:#fff">
      <div class="add_title">
        <el-button size="mini" type="primary" icon="el-icon-back" @click="$router.go(-1)">返回</el-button>
        <p>{{pageType=='add'?'退车':'退车详情'}}</p>
      </div>
    </div>
    <div class="checkCar">
      <el-autocomplete
        v-model="licensePlate"
        :fetch-suggestions="querySearchAsync"
        placeholder="请输入车牌号"
        @select="handleSelect"
        :disabled="pageType=='detail'?true:false"
      ></el-autocomplete>
      <el-button type="primary" icon="el-icon-search" @click="getContractInfo">快速查询</el-button>
    </div>
    <div class="contractInfo" v-if="contractInfo.customer">
      <p>合同信息</p>
      <div class="contract_detail">
        <div class="contract_detail_one">
          <p>租车类型：{{contractInfo.leaseType=="MONTH"?"月租":'日租'}}</p>
          <p v-if="contractInfo.customer">客户姓名：{{contractInfo.customer.customerName}}</p>
          <p v-if="contractInfo.customer">客户联系方式：{{contractInfo.customer.customerPhone}}</p>
          <p v-if="contractInfo.customer">客户身份证号：{{contractInfo.customer.customerIdCardNo}}</p>
          <p>合同编号：{{contractInfo.contractNo}}</p>
          <p v-if="contractInfo.leaseType=='MONTH'">租期（月）：{{contractInfo.months}}</p>
          <p>提车日期：{{contractInfo.getTime}}</p>
        </div>
        <div class="contract_detail_one">
          <p>车辆信息：</p>
          <el-table :data="contractInfo.motors" style="width: 80%" height="210">
            <el-table-column prop="plateNumber" label="车牌号"></el-table-column>
            <el-table-column prop="brandModel" label="品牌车型"></el-table-column>
            <!-- <el-table-column prop="address" label="地址"></el-table-column> -->
          </el-table>
        </div>
        <div class="contract_detail_one">
          <p>合同开始时间：{{contractInfo.startTime}}</p>
          <p>合同结束时间：{{contractInfo.endTime}}</p>

          <p>押金：{{contractInfo.deposit}}元</p>
          <p>租金：{{contractInfo.rent}}元</p>
          <p>管理费：{{contractInfo.managementFee}}元</p>
          <p>基础保险费：{{contractInfo.basicPremium}}元</p>
          <p>不计免赔保险费：{{contractInfo.aer}}元</p>
          <p v-if="contractInfo.leaseType=='DAY'">租期：{{contractInfo.leaseTerm}}天</p>
        </div>
      </div>
    </div>
    <div class="returnCar">
        <el-button  type="primary" @click="returnCar">确定退车</el-button>
    </div>
    <div class="checkCarRecord" v-if="contractInfo.customer">
      <div class="title">
        <p>验车记录</p>
      </div>
      <el-table
        :data="checkCarList"
        style="width: 98%"
        :header-cell-style="{'background':'#f1f4fb','text-align':'center','font-size':'14px','color':'#222','font-weight':'normal'}"
        :cell-style="{'text-align':'center','font-size':'14px','color':'#222','font-weight':'normal'}"
      >
        <el-table-column prop="licensePlate" label="车牌号"></el-table-column>
        <el-table-column prop="contractNo" label="合同编号"></el-table-column>
        <el-table-column label="行驶证">
          <template slot-scope="scope">
            <span>{{scope.row.vehicleLicense==0?"没有":'有'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="营运证">
          <template slot-scope="scope">
            <span>{{scope.row.operatePermit==0?'没有':'有'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="mileage" label="公里数"></el-table-column>
        <el-table-column prop="examineTime" label="验车时间"></el-table-column>
        <!-- <el-table-column label="操作">
          <template slot-scope="scope">
            <span
              style="font-size:14px;color:#256fff;cursor:pointer"
              @click="gotoRenewal(scope.row)"
            >查看</span>
            <i class="splitLine"></i>
            <span
              style="font-size:14px;color:#e53935;cursor:pointer"
              @click="deleteRecord(scope.row)"
            >删除</span>
          </template>
        </el-table-column>-->
      </el-table>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import http1 from "@/api/riskManagementApi";
import http from "@/api/carApi";
import signHttp from "@/api/contractApi";

export default {
  data() {
    return {
      licensePlate: "",
      contractId: "",
      returnCarInfo: {},
      contractInfo: {},
      pageType: "add",
      checkCarList: [],
      pageStatus: 1, //0为保存  1为詳情
      diffData: null,
      newMotInfo: {
        addKeys: []
      }
    };
  },
  computed: {
    ...mapState(`user`, [`access_token`, `tenantId`])
  },
  activated() {
    console.log(this.$route.query.pageType);
    this.pageType = this.$route.query.pageType;
    this.pageStatus = 1;
    this.pricePageStatus = 1;
    if (this.$route.query.recordInfo) {
      let recordInfo = JSON.parse(this.$route.query.recordInfo);
      let delKeys = [];
      let addKeys = [];
      recordInfo.examinePics.forEach(item => {
        let info = { picKey: item.picKey, picDesc: item.picDesc, id: item.id };
        delKeys.push(item.id);
        addKeys.push(info);
      });
      console.log(delKeys);
      this.examinePics = recordInfo.examinePics;
      this.motInfo = {
        id: recordInfo.id, //数据库标识，必填
        licensePlate: recordInfo.licensePlate, //车牌
        contractNo: recordInfo.contractNo, //合同编号
        handlerId: recordInfo.handlerId, //处理人标识
        handlerName: recordInfo.handlerName, //处理人
        examineTime: recordInfo.examineTime, //验车时间
        examineType: recordInfo.examineType, //验车类型，0-普通验车，1-出租验车，2-退租验车
        vehicleLicense: recordInfo.vehicleLicense + "", //是否有行驶证，0-没有，1-有
        operatePermit: recordInfo.operatePermit + "", //是否有营运证，0-没有，1-有
        mileage: recordInfo.mileage, //公里数，默认0
        remarks: recordInfo.remarks, //备注描述
        addKeys: addKeys, //图片key
        delKeys: [] //数据库中图片标识
      };

      let cate = JSON.stringify(this.motInfo);
      this.newMotInfo = JSON.parse(cate);
    }
  },
  methods: {
    //根据车牌号查询型号品牌
    //根据车牌号查询型号品牌
    querySearchAsync(queryString, cb) {
      let tenantId = this.tenantId;
      let plateNumber = queryString;
      let status = ["SIGNED"];
      if (!queryString) {
        return;
      }
      let addVehicleList = [{}];
      signHttp.getContractCar(tenantId, plateNumber, status).then(data => {
        console.log(data.data);
        addVehicleList = [{ value: "" }];
        data.data.forEach(item => {
          let obj = {
            value: item.plateNumber + "=>" + item.customerName,
            id: item.contractId,
            licensePlate: item.plateNumber,
            customerName: item.customerName
          };
          addVehicleList.push(obj);
        });
        cb(addVehicleList);
      });
    },
    handleSelect(item) {
      console.log(item);
      let tenantId = this.tenantId;
      let licensePlate = item.licensePlate;
      let contractId = item.id;
      this.licensePlate = licensePlate;
      this.contractId = item.id;
    },
    getContractInfo() {
      let { licensePlate, tenantId, contractId } = this;
      if (!licensePlate) {
        this.$message(`请先输入车牌号！`);
        return;
      }
      let that = this;
      http1.getVehicleModel({ licensePlate }, tenantId).then(data => {
        console.log(data);
        if (data.code == 0) {
          that.brandModel = data.data.brand + "-" + data.data.model;
          that.returnCarInfo.brand = data.data.brand;
          that.returnCarInfo.model = data.data.model;
          //   that.returnCarInfo.model = data.data.model;
        }
      });
      signHttp.getContractDetail(tenantId, contractId).then(data => {
        console.log(data.data);
        if (data.code == 0) {
          this.contractInfo = data.data;
          //   this.returnCarInfo.contractNo = data.data.contractNo
          //     ? data.data.contractNo
          //     : "";
        }
      });
      http
        .getContractCheckRecord({ plate: licensePlate, contractId })
        .then(data => {
          if (data.code == 0) {
            console.log(data.data);
            this.checkCarList = data.data;
          }
        });
    },
    returnCar(){
        let {tenantId,licensePlate,contractId} = this
        let params = {licensePlate,contractId}
        http.returnCar(params,tenantId).then(data=>{
            if(data.code==0){
                this.$message(`退车成功`)
                this.$router.back(-1)
            }else {
                this.$message(data.desc)
            }
        })
    },
    //删除验车记录
    deleteCar(row) {
      let params = { id: motInfo.id };
      let tenantId = this.tenantId;
      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          http.deleteCheckRecord(params, tenantId).then(data => {
            if (data.code == 0) {
              this.$message(`删除成功`);
              this.$router.back(-1);
            } else {
              this.$message(data.desc);
            }
          });
        })
        .catch(() => {});
    },
    //比较数据
    diffDevinfo() {
      for (let k in this.newMotInfo) {
        let delKeys = [];
        if (this.newMotInfo[k] != this.motInfo[k]) {
          if (!this.diffData) {
            this.diffData = {};
          }
          if (this.newMotInfo["addKeys"] != this.motInfo["addKeys"]) {
            this.motInfo.addKeys.filter(item => {
              this.motInfo.delKeys.push(item.id);
            });
          }
          this.diffData[k] = this.motInfo[k];
          // this.diffData['licensePlate'] = this.licensePlate
        }
      }
    },

    //修改车检信息
    editMot() {
      console.log(`aaa`);
      this.pageStatus = this.pageStatus == 0 ? 1 : 0;
      let { motInfo, tenantId } = this;

      let that = this;

      // this.pageType = this.pageStatus == 0 ? "detail" : "edit";
      if (this.pageStatus == 1) {
        this.pageType = "detail";
        this.diffDevinfo();
        console.log(this.diffData);
        if (!this.diffData) {
          that.$message(`未修改数据不提交`);
          return;
        } else {
          this.diffData.id = this.motInfo.id;
        }
        let params = !this.diffData ? motInfo : this.diffData;
        let arr = [];
        params.addKeys.filter(item => {
          arr.push({ picDesc: item.picDesc, picKey: item.picKey });
        });
        params.addKeys = arr;
        params.addKeys = params.addKeys.filter(item => {
          return item.picKey != "" || item.picDesc != "";
        });
        // params.licensePlate = this.licensePlate
        // priceForm.licensePlate = this.licensePlate;
        http.editCheckRecord(params, tenantId).then(data => {
          if (data.code == 0) {
            that.$message(`修改成功`);
            that.$router.back(-1);
          } else {
            that.$message(data.desc);
          }
        });

        //保存修改内容
      } else {
        this.pageType = "edit";
      }
    }
  }
};
</script>
<style lang="stylus" scope>
#returnCar {
  margin: 0 24px;

  .add_title {
    padding: 12px 20px;
    border-bottom: 1px solid #eaeaea;
    font-size: 14px;
    display: flex;
    align-items: center;

    p {
      font-size: 16px;
      margin-left: 20px;
    }
  }

  .checkCar {
    background: #fff;
    padding: 24px;
    margin: 12px 0;

    .el-button {
      margin-left: 12px;
    }
  }

  .contractInfo {
    margin-top: 12px;
    background: #fff;
    // padding:24px;
    padding: 12px;

    p {
      padding: 0;
      margin: 0;
      font-size: 16px;
    }
  }

  .contract_detail {
    display: flex;
    justify-content: center;
  }

  .contract_detail_one {
    // margin-right:23px;
    width: 25%;
    line-height: 36px;

    p {
      font-size: 14px;
    }
  }

  .checkCarRecord {
    background: #fff;
    margin: 12px 0;

    .title {
      border-bottom: 1px solid #eaeaea;
      font-size: 14px;
      display: flex;
      align-items: center;

      p {
        font-size: 16px;
        margin-left: 20px;
      }
    }
  }

  .el-table {
    margin: 0 auto;
    width: 98%;
    padding-top: 12px;
  }
  .returnCar{
      text-align:center;
      margin-top:12px;
  }
}
</style>