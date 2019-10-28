<template>
  <div id="addSign">
    <div style="background:#fff">
      <div class="add_title">
        <el-button size="mini" type="primary" icon="el-icon-back" @click="$router.go(-1)">返回</el-button>
        <p>新增待签约</p>
      </div>
    </div>
    <div class="addForm">
      <el-form
        :model="signForm"
        :rules="rules"
        label-position="right"
        class="demo-form-inline"
        ref="signForm"
        label-width="auto"
      >
        <el-form-item label="租车类型：">
          <el-select
            v-model="signForm.leaseType"
            size="mini"
            placeholder="请选择租车类型"
            :disabled="pageType=='detail'?true:false"
          >
            <el-option label="月租" value="MONTH"></el-option>
            <el-option label="日租" value="DAY"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="车牌号："
          prop="licensePlate"
          v-if="!carInfoShow&&signForm.motors.length==1"
        >
          <el-autocomplete
            v-model="signForm.motors[0].plateNumber"
            :fetch-suggestions="querySearchAsync"
            placeholder="请输入车牌号"
            size="mini"
            @select="handleSelect"
            :disabled="!licensePlateStatus"
          ></el-autocomplete>
          <el-button
            type="primary"
            size="mini"
            @click="addCarInfo"
            :disabled="!licensePlateStatus"
          >添加</el-button>
        </el-form-item>
        <el-form-item label="品牌车型：" v-if="!carInfoShow">
          <el-input
            v-model="signForm.motors[0].brandModel"
            class="brand_input"
            size="mini"
            placeholder="品牌根据车牌号自动联想"
            disabled
          ></el-input>
        </el-form-item>
        <!-- 车辆信息 -->
        <el-form-item label="车辆信息：" v-if="carInfoShow&&signForm.motors.length>1">
          <el-table
            :data="signForm.motors"
            size="mini"
            :header-cell-style="{'background':'#f1f4fb','text-align':'left','font-size':'14px','color':'#222','font-weight':'normal',}"
          >
            <el-table-column label="车牌号">
              <template slot-scope="scope">
                <el-autocomplete
                  v-model="scope.row.plateNumber"
                  :fetch-suggestions="querySearchAsync"
                  placeholder="请输入车牌号"
                  size="mini"
                  @select="handleSelect(scope.row)"
                  :disabled="pageType=='detail'?true:false"
                ></el-autocomplete>
              </template>
            </el-table-column>
            <el-table-column label="品牌车型">
              <template slot-scope="scope">
                <el-input v-model="scope.row.brandModel" size="mini" placeholder="品牌车型自动联想"></el-input>
              </template>
            </el-table-column>
            <div
              slot="append"
              style="text-align: center;font-size:13px;color:#409EFF;border-bottom:1px solid #eaeaea;cursor:pointer"
              @click="addCarInfo"
            >
              <span>添加</span>
            </div>
          </el-table>
        </el-form-item>
        <el-form-item label="客户姓名：">
          <el-autocomplete
            v-model="signForm.customer.customerName"
            :fetch-suggestions="querySearchCustomer"
            placeholder="请输入客户姓名"
            size="mini"
            @select="handleSelectCustomer"
            :disabled="pageType=='detail'?true:false"
          ></el-autocomplete>
        </el-form-item>
        <el-form-item label="客户联系方式：">
          <el-input
            v-model="signForm.customer.customerPhone"
            size="mini"
            disabled
            placeholder="根据客户姓名自动关联"
          ></el-input>
        </el-form-item>
        <el-form-item label="客户身份证号：">
          <el-input
            v-model="signForm.customer.customerIdCardNo"
            size="mini"
            disabled
            placeholder="根据客户姓名自动关联"
          ></el-input>
        </el-form-item>
        <el-form-item label="合同编号：">
          <el-input
            v-model="signForm.contractNo"
            size="mini"
            placeholder="请输入合同编号"
            :disabled="pageType=='detail'?true:false"
          ></el-input>
        </el-form-item>
        <el-form-item label="租期（月）：" v-if="signForm.leaseType=='MONTH'">
          <el-input
            v-model="signForm.months"
            size="mini"
            placeholder="请输入租车月数"
            :disabled="pageType=='detail'?true:false"
          ></el-input>
        </el-form-item>
        <el-form-item label="提车日期：" prop="resource">
          <el-date-picker
            size="mini"
            v-model="signForm.getTime"
            type="datetime"
            placeholder="请选择提车日期"
            value-format="yyyy-MM-dd HH:mm:ss "
            :disabled="pageType=='detail'?true:false"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="合同开始日期：" prop="resource">
          <el-date-picker
            size="mini"
            v-model="signForm.startTime"
            type="datetime"
            placeholder="请选择合同开始日期"
            value-format="yyyy-MM-dd HH:mm:ss"
            :disabled="pageType=='detail'?true:false"
            @change="calaEndDate"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="合同结束日期：" prop="resource">
          <el-date-picker
            size="mini"
            v-model="signForm.endTime"
            type="datetime"
            placeholder="请选择合同结束日期"
            value-format="yyyy-MM-dd HH:mm:ss"
            :disabled="pageType=='detail'||signForm.leaseType=='MONTH'?true:false"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <el-form
        :model="signForm"
        :rules="rules"
        label-position="right"
        class="demo-form-inline"
        ref="signForm"
        label-width="auto"
      >
        <el-form-item label="押金（元）：">
          <el-input
            v-model="signForm.deposit"
            size="mini"
            placeholder="请输入押金"
            :disabled="pageType=='detail'?true:false"
          ></el-input>
        </el-form-item>
        <el-form-item label="管理费（元）：">
          <el-input
            v-model="signForm.managementFee"
            size="mini"
            placeholder="请输入管理费"
            :disabled="pageType=='detail'?true:false"
          ></el-input>
        </el-form-item>
        <el-form-item label="租金（元）：">
          <el-input
            v-model="signForm.rent"
            size="mini"
            placeholder="请输入租金"
            :disabled="pageType=='detail'?true:false"
          ></el-input>
        </el-form-item>
        <div v-if="signForm.leaseType=='DAY'">
          <el-form-item label="基础保险费（元）：">
            <el-input
              v-model="signForm.basicPremium"
              size="mini"
              placeholder="请输入基础保险费"
              :disabled="pageType=='detail'?true:false"
            ></el-input>
          </el-form-item>
          <el-form-item label="不计免赔保险费（元）：">
            <el-input
              v-model="signForm.aer"
              size="mini"
              placeholder="请输入基础保险费"
              :disabled="pageType=='detail'?true:false"
            ></el-input>
          </el-form-item>
          <el-form-item label="租期（天）：">
            <el-input
              v-model="signForm.leaseTerm"
              size="mini"
              placeholder="请输入租期"
              :disabled="pageType=='detail'?true:false"
            ></el-input>
          </el-form-item>
          <el-form-item label="总额（元）：">
            <el-input
              v-model="signForm.totalFee"
              size="mini"
              placeholder="请输入总计金额"
              :disabled="pageType=='detail'?true:false"
            ></el-input>
          </el-form-item>
        </div>
        <el-form-item label="签约状态：">
          <el-select
            v-model="signForm.status"
            size="mini"
            placeholder="请选择签约状态"
            :disabled="pageType=='detail'?true:false"
          >
            <el-option
              v-for="(item,index) in statusOption"
              :key="index"
              :label="item.label"
              :value="item.status"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注：">
          <el-input
            type="textarea"
            v-model="signForm.remark"
            rows="5"
            size="mini"
            placeholder="请输入备注信息"
            :disabled="pageType=='detail'?true:false"
          ></el-input>
        </el-form-item>
        <el-form-item style="margin-top:30px;" v-if="pageType=='add'">
          <el-button size="mini" type="primary" @click="addSign">确定</el-button>
          <el-button size="mini" type="primary">清空</el-button>
        </el-form-item>
        <el-form-item style="margin-top:30px;" v-else>
          <el-button
            size="small"
            type="primary"
            @click="editContract"
          >{{pageType=='detail'?'编辑信息':'保存'}}</el-button>
          <!-- 跟列表中的删除一样   删成功之后返回列表   弹个确认是否删除的弹框 -->
          <el-button size="small" type="primary">删除</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { regionData, CodeToText } from "element-china-area-data";
import { mapState, mapMutations } from "vuex";
import http from "@/api/riskManagementApi";
import http1 from "@/api/carApi";
import contractHttp from "@/api/contractApi";
export default {
  data() {
    return {
      imageUrl: ``,
      signForm: {
        motors: [{ brandModel: "", motorId: "", plateNumber: "" }],
        customer: {
          customerIdCardNo:'',
          customerPhone:''
        },
        contractNo: "",
        endTime:'',
      },
      licensePlateStatus: true,
      licensePlate: "",
      brandModel: "",
      carInfoShow: false,
      statusOption: [
        { label: "待签约", status: "UNSIGNED" },
        { label: "已签约", status: "SIGNED" },
        { label: "取消", status: "CANCEL" },
        { label: "已完成", status: "FINISH" },
        { label: "提前解除", status: "TERMINATED_IN_ADVANCE" }
      ],
      rules: {},
      options: regionData,
      pageType: "add",
      contractId: "",
      pageStatus: 1 //0为保存  1為詳情
    };
  },
  computed: {
    ...mapState(`user`, [`access_token`, `tenantId`])
  },
  activated() {
    console.log(this.$route.query.pageType);
    this.pageType = this.$route.query.pageType;
    if (this.$route.query.contractId) {
      this.contractId = this.$route.query.contractId;
      this.licensePlateStatus = false;
      this.getContractDetail();
    }
  },
  methods: {
    editContract() {
      console.log(`aaa`);
      this.pageStatus = this.pageStatus == 0 ? 1 : 0;
      let { signForm, tenantId, contractId } = this;
      // this.pageType = this.pageStatus == 0 ? "detail" : "edit";

      if (this.pageStatus == 1) {
        this.pageType = "detail";
        this.licensePlateStatus = false;
        contractHttp.editContract(signForm, tenantId, contractId).then(data => {
          if (data.code == 0) {
            this.$message(`修改成功`);
            this.$router.back(-1)
          } else {
            this.$message(data.desc);
          }
        });
        //保存修改内容
      } else {
        this.pageType = "edit";
      }
    },
    //根据车牌号查询型号品牌
    querySearchAsync(queryString, cb) {
      let tenantId = this.tenantId;
      let params = { plate: queryString };
      if (!queryString) {
        return;
      }
      let addVehicleList = [{}];
      http.getVehicleListl(params, tenantId).then(data => {
        console.log(data.data);
        addVehicleList = [{ value: "" }];
        data.data.forEach(item => {
          let obj = { value: item };
          addVehicleList.push(obj);
        });
        cb(addVehicleList);
      });
    },
    handleSelect(row) {
      console.log(row);
      let tenantId = this.tenantId;
      let licensePlate = row.plateNumber ? row.plateNumber : row.value;
      let that = this;
      http1.getCarInfo({ licensePlate }, tenantId).then(data => {
        console.log(data);
        if (data.code == 0) {
          if (row.plateNumber) {
            row.brandModel =
              data.data.vehicleModel.brand + "-" + data.data.vehicleModel.model;
            row.motorId = data.data.id;
          } else {
            this.signForm.motors[0].brandModel =
              data.data.vehicleModel.brand + "-" + data.data.vehicleModel.model;
            this.signForm.motors[0].motorId = data.data.id;
          }
        }
      });
    },
    //模糊搜索客户列表
    querySearchCustomer(queryString, cb) {
      let tenantId = this.tenantId;
      let params = { name: queryString };
      if (!queryString) {
        return;
      }
      let addVehicleList = [{}];
      contractHttp.getCustomerList(params, tenantId).then(data => {
        console.log(data.data);
        addVehicleList = [{ value: "" }];
        data.data.forEach(item => {
          let obj = {};
          if (item.enterprise) {
            obj = {
              value: item.enterprise.name,
              customerId: item.id,
              customerIdCardNo: item.enterprise.contactIdCardNo,
              customerPhone: item.enterprise.contactMobile,
              customerAddress: item.enterprise.address
            };
          } else if (item.individual) {
            obj = {
              value: item.individual.name,
              customerId: item.id,
              customerIdCardNo: item.individual.idCardNo,
              customerPhone: item.individual.mobile,
              customerAddress: item.individual.homeAddress
            };
          }
          addVehicleList.push(obj);
        });
        cb(addVehicleList);
      });
    },
    //选择客户
    handleSelectCustomer(item) {
      console.log(item);
      this.signForm.customer.customerId = item.customerId;
      this.signForm.customer.customerName = item.value;
      this.signForm.customer.customerIdCardNo = item.customerIdCardNo;
      this.signForm.customer.customerPhone = item.customerPhone;
      this.signForm.customer.customerAddress = item.customerAddress;
    },
    addCarInfo() {
      this.carInfoShow = true;
      this.signForm.motors.push({
        plateNumber: "",
        brandModel: "",
        motorId: ""
      });
    },
    addSign() {
      let params = this.signForm;
      let tenantId = this.tenantId;
      contractHttp.addSignContract(params, tenantId).then(data => {
        if (data.code == 0) {
          this.$message(`新增成功`);
          this.$router.back(-1);
        }else {
          this.$message(`新增失败`)
        }
      });
    },
    getContractDetail() {
      let { tenantId, contractId } = this;
      contractHttp.getContractDetail(tenantId, contractId).then(data => {
        if (data.code == 0) {
          let signForm = data.data;
          console.log(signForm);
          this.signForm = signForm;
        }
      });
    },
    //
    calaEndDate(value) {
      console.log(value);
      // this.addmulMonth(value,1)
      console.log(this.addmulMonth(value, parseInt(this.signForm.months)));
      this.signForm.endTime = this.addmulMonth(
        value,
        parseInt(this.signForm.months)
      )+" "+"00:00:00";
    },
    /**
     * 计算给定日期增加N个自然月后的日期
     *
     * @param dtstr    给定日期，格式 2016-01-30
     * @param n    需要增加的月数
     * @returns
     */
    addmulMonth(dtstr, n) {
      var s = dtstr.split("-");
      console.log(s);
      var yy = parseInt(s[0]);
      var mm = parseInt(s[1] - 1);
      var dd = parseInt(s[2]);
      var dt = new Date(yy, mm, dd);
      dt.setMonth(dt.getMonth() + n);
      if (dt.getFullYear() * 12 + dt.getMonth() > yy * 12 + mm + n) {
        dt = new Date(dt.getFullYear(), dt.getMonth(), 0);
      }
      var year = dt.getFullYear();
      var month = dt.getMonth() + 1;
      var days = dt.getDate();
      var dd = year + "-" + month + "-" + days;
      return dd;
    }
  }
};
</script>
<style lang="stylus">
#addSign {
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

  .el-form {
    // display: flex;
    // flex-wrap: wrap;
    margin-right: 134px;

    &:nth-child(2) {
      margin-right: 0;
    }
  }

  .el-form-item {
    // width: 48%;
    margin-bottom: 0;
  }

  .el-input--mini .el-input__inner {
    height: 30px;
    line-height: 30px;
    width: 390px;
  }

  .el-form-item__label {
    font-size: 14px;
    color: #333;
  }

  .el-input.is-disabled .el-input__inner {
    background: #f1f4fb;
  }

  .el-table {
    .el-table__body-wrapper {
      .el-table__body {
        .cell {
          .el-input {
            .el-input__inner {
              border: 0;
            }
          }
        }
      }
    }
  }
}
</style>