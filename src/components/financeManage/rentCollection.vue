<template>
  <div id="addCustomer">
    <div style="background:#fff">
      <div class="add_title">
        <el-button size="mini" type="primary" icon="el-icon-back" @click="$router.go(-1)">返回</el-button>
        <p>{{pageType=='add'?'收租金':'收租金详情'}}</p>
      </div>
    </div>
    <div class="contractInfo" v-if="contractInfo.customer">
      <p>合同信息</p>
      <div class="contract_detail">
        <div class="contract_detail_one">
          <p>租车类型：{{contractInfo.leaseType=="MONTH"?"月租":'日租'}}</p>
          <p>客户姓名：{{contractInfo.customer.customerName}}</p>
          <p>客户联系方式：{{contractInfo.customer.customerPhone}}</p>
          <p>客户身份证号：{{contractInfo.customer.customerIdCardNo}}</p>
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
    <div class="addForm">
      <el-row :gutter="60">
        <el-col :span="12" :xl="8">
          <!-- <div class="grid-content bg-purple"></div> -->
          <el-form
            key="carForm1"
            :model="recordInfo"
            :rules="rules"
            label-position="right"
            class="demo-form-inline"
            ref="recordInfo"
            label-width="auto"
          >
            <el-form-item label="车牌号：" prop="licensePlate">
              <el-autocomplete
                v-model="recordInfo.licensePlate"
                :fetch-suggestions="querySearchAsync"
                placeholder="请输入车牌号"
                size="mini"
                @select="handleSelect"
                :disabled="pageType=='detail'?true:false"
              ></el-autocomplete>
            </el-form-item>
            <el-form-item label="客户姓名：" prop="userName">
              <el-input
                v-model="recordInfo.userName"
                class="brand_input"
                size="mini"
                placeholder="客户姓名"
                disabled
              ></el-input>
            </el-form-item>
            <el-form-item label="应缴日期：" prop="arDate">
              <el-date-picker
                size="mini"
                v-model="recordInfo.arDate"
                type="date"
                placeholder="应缴日期"
                value-format="yyyy-MM-dd"
                disabled
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="应缴金额：" prop="arAmount">
              <el-input v-model="recordInfo.arAmount" size="mini" placeholder="应收金额" disabled></el-input>
            </el-form-item>
            <el-form-item label="实收日期：" prop="paidDate">
              <el-date-picker
                size="mini"
                v-model="recordInfo.paidDate"
                type="date"
                placeholder="请选择实收日期"
                value-format="yyyy-MM-dd"
                :disabled="pageType=='detail'?true:false"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="实收金额：" prop="paidAmount">
              <el-input v-model="recordInfo.paidAmount" size="mini" placeholder="实收金额" ></el-input>
            </el-form-item>
            <el-form-item label="合同编号：" prop="contractNo">
              <el-input
                v-model="recordInfo.contractNo"
                size="mini"
                placeholder="请输入合同编号"
                :disabled="pageType=='detail'?true:false"
              ></el-input>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="12">
          <!-- <div class="grid-content bg-purple"></div> -->
          <el-form
            key="carForm2"
            :model="recordInfo"
            label-position="right"
            class="demo-form-inline"
            ref="recordInfo"
            :rules="rules"
            label-width="auto"
          >
            <el-form-item label="缴纳状态：" prop="payRole">
              <el-radio v-model="recordInfo.paidStatus" label="0">未付清</el-radio>
              <el-radio v-model="recordInfo.paidStatus" label="1">付清</el-radio>
            </el-form-item>
            <el-form-item label="合同结束日期：" prop="contractEndDate">
              <el-date-picker
                size="mini"
                v-model="recordInfo.contractEndDate"
                type="date"
                placeholder="合同结束日期"
                value-format="yyyy-MM-dd"
                disabled
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="下次应缴日期：" prop="nextArDate">
              <el-date-picker
                size="mini"
                v-model="recordInfo.nextArDate"
                type="date"
                placeholder="下次应缴日期"
                value-format="yyyy-MM-dd"
                :disabled="pageType=='detail'?true:false"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="备注：">
              <el-input
                type="textarea"
                v-model="recordInfo.remarks"
                rows="5"
                size="mini"
                placeholder="请输入备注信息"
                :disabled="pageType=='detail'?true:false"
              ></el-input>
            </el-form-item>
            <el-form-item style="margin-top:30px;" v-if="pageType=='add'">
              <el-button size="mini" type="primary" @click="addMot" :disabled="contractInfo.leaseType=='DAY'">确定</el-button>
              <el-button size="mini" type="primary" @click="clear">清空</el-button>
            </el-form-item>
            <el-form-item style="margin-top:30px;" v-else>
              <el-button
                size="small"
                type="primary"
                @click="editMot"
              >{{pageType=='detail'?'编辑信息':'保存'}}</el-button>
              <!-- 跟列表中的删除一样   删成功之后返回列表   弹个确认是否删除的弹框 -->
              <el-button size="small" type="primary" @click="deleteCar">删除</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import http from "@/api/riskManagementApi";
import signHttp from "@/api/contractApi";
export default {
  data() {
    return {
      recordInfo: {
        paidStatus: '0',
        arDate: "",
        arAmount: "",
        userName:'',
        contractEndDate:''
        // rentType
      },

      contractInfo: {},
      brandModel: "",
      rules: {
        licensePlate: [
          { required: true, message: "请输入车牌号", trigger: "blur" }
        ],
        motAmount: [
          { required: true, message: "请输入年检金额", trigger: "blur" }
        ],
        motDay: [
          { required: true, message: "请选择年检日期", trigger: "change" }
        ],
        nextDay: [
          { required: true, message: "请选择下次年检日期", trigger: "change" }
        ],
        handlerName: [
          { required: true, message: "请输入年检负责人", trigger: "blur" }
        ]
      },
      pageType: "add",
      pageStatus: 1, //0为保存  1为詳情
      diffData: null,
      newMotInfo: {}
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
      this.recordInfo = {
        id: recordInfo.id,
        licensePlate: recordInfo.licensePlate,
        brand: recordInfo.brand,
        model: recordInfo.model,
        handlerName: recordInfo.handlerName,
        motDay: recordInfo.motDay,
        motAmount: recordInfo.motAmount,
        nextDay: recordInfo.nextDay,
        remarks: recordInfo.remarks
      };
      this.newMotInfo = {
        id: recordInfo.id,
        licensePlate: recordInfo.licensePlate,
        brand: recordInfo.brand,
        model: recordInfo.model,
        handlerName: recordInfo.handlerName,
        motDay: recordInfo.motDay,
        motAmount: recordInfo.motAmount,
        nextDay: recordInfo.nextDay,
        remarks: recordInfo.remarks
      };
    }
  },
  methods: {
    //   上传正面身份证之前
    beforeDravelUpload() {},

    // 上传正面身份证成功
    handleDravelSuccess(file) {},
    // 上传驾驶证照片之前
    beforDriverUpload() {},
    // 上传驾驶证照片成功
    handleDriverSuccess() {},
    handleChange() {},
    //新增签约收款
    addMot() {
      let { recordInfo, tenantId } = this;
      this.$refs.recordInfo.validate(valid => {
        if (valid) {
          signHttp.rentConllection(recordInfo, tenantId).then(data => {
            console.log(data);
            if (data.code == 0) {
              this.$message(`收租金成功`);
              this.$router.back(-1);
            } else {
              this.$message(data.desc);
            }
          });
        } else {
          this.$message(`请填写必填项后提交`);
        }
      });
    },
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
      this.recordInfo.licensePlate = licensePlate;
      this.recordInfo.userName = item.customerName;
      this.recordInfo.contractId = item.id;
      let that = this;
      signHttp.getContractDetail(tenantId, contractId).then(data => {
        console.log(data.data);
        if (data.code == 0) {
          this.contractInfo = data.data;
          this.recordInfo.contractNo = data.data.contractNo
          this.recordInfo.contractEndDate = data.data.endTime.split(' ')[0]
        }
      });
      signHttp
        .getPayableRent({ contractId: contractId }, tenantId)
        .then(data => {
          if (data.code == 0) {
            console.log(data.data);
            this.recordInfo.arDate = data.data.arDate; //应交日期
            this.recordInfo.arAmount = data.data.arAmount; //应缴金额
            this.recordInfo.receivableRecordId = data.data.id
          }else {
              this.$message(data.desc)
          }
        });
    },
    clear() {
      this.recordInfo = {};
    },
    //删除年检记录
    deleteMot(row) {
      let params = { id: recordInfo.id };
      let tenantId = this.tenantId;
      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          http.deleteMot(params, tenantId).then(data => {
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
        if (this.newMotInfo[k] != this.recordInfo[k]) {
          if (!this.diffData) {
            this.diffData = {};
          }
          this.diffData[k] = this.recordInfo[k];
          // this.diffData['licensePlate'] = this.licensePlate
        }
      }
    },

    //修改车检信息
    editMot() {
      console.log(`aaa`);
      this.pageStatus = this.pageStatus == 0 ? 1 : 0;
      let { recordInfo, tenantId } = this;

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
          this.diffData.id = this.recordInfo.id;
          this.diffData.licensePlate = this.recordInfo.licensePlate;
        }
        let params = !this.diffData ? recordInfo : this.diffData;
        // params.licensePlate = this.licensePlate
        // priceForm.licensePlate = this.licensePlate;
        http.editMot(params, tenantId).then(data => {
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
<style lang="stylus">
#addCustomer {
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

  .upload {
    display: flex;
    align-items: center;
    padding: 12px;
  }

  .upload_pic {
    display: flex;
    margin-right: 80px;

    .title {
      font-size: 14px;
    }
  }

  .upload-img {
    display: flex;
    align-items: center;
  }

  .el-button--primary {
    color: #FFF;
    background-color: #1890ff;
    border-color: #1890ff;
  }

  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    margin-right: 24px;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    font-size: 24px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
    display: flex;
    align-items: center;
    flex-direction: column;
    margin: 0;
    justify-content: center;

    span {
      font-size: 12px;
      line-height: 18px;
    }
  }

  .avatar {
    width: 120px;
    height: 120px;
    display: block;
  }

  .addForm {
    padding: 24px 48px;
    background: #fff;
    margin: 12px 0;
    display: flex;
    justify-content: center;
  }

  .addForm2 {
    padding: 24px 48px;
    background: #fff;
    margin: 12px 0;
    display: flex;
    justify-content: left;
  }

  .el-form {
    // display: flex;
    // flex-wrap: wrap;
    // margin-right: 134px;
    &:nth-child(2) {
      margin-right: 0;
    }
  }

  .el-form-item {
    // width: 48%;
    margin-bottom: 14px;

    &:nth-child(2) {
      .el-form-item__content {
        display: flex;
        align-items: center;

        .el-button {
          margin-left: 14px;
        }
      }
    }
  }

  .el-input--mini .el-input__inner {
    height: 30px;
    line-height: 30px;
    // width: 390px;
  }

  .el-form-item__label {
    font-size: 14px;
    color: #333;
  }
}
</style>