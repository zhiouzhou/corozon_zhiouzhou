<template>
  <div id="addCustomer">
    <div style="background:#fff">
      <div class="add_title">
        <el-button size="mini" type="primary" icon="el-icon-back" @click="$router.go(-1)">返回</el-button>
        <p>{{pageType=='add'?'新增已收记录':'已收记录详情'}}</p>
      </div>
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
    <div class="addForm">
      <el-row :gutter="60">
        <el-col :span="12" :xl="8">
          <!-- <div class="grid-content bg-purple"></div> -->
          <el-form
            key="carForm1"
            :model="acceptedInfo"
            :rules="rules"
            label-position="right"
            class="demo-form-inline"
            ref="acceptedInfo"
            label-width="auto"
          >
            <el-form-item label="收款类型：" prop="recordType">
              <el-select
                v-model="acceptedInfo.recordType"
                size="small"
                placeholder="请选择收款类型"
                :disabled="pageType=='detail'?true:false"
              >
                <el-option
                  v-for="item in typeList"
                  :label="item.lable"
                  :value="item.value"
                  :key="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="车牌号：" prop="licensePlate">
              <el-autocomplete
                v-model="acceptedInfo.licensePlate"
                :fetch-suggestions="querySearchAsync"
                placeholder="请输入车牌号"
                size="mini"
                @select="handleSelect"
                :disabled="pageType=='detail'?true:false"
              ></el-autocomplete>
            </el-form-item>
            <el-form-item label="品牌：" prop="brand">
              <el-input
                v-model="acceptedInfo.brand"
                class="brand_input"
                size="mini"
                placeholder="车辆品牌"
                :disabled="pageType=='detail'?true:false"
              ></el-input>
            </el-form-item>
            <el-form-item label="车型：" prop="model">
              <el-input
                v-model="acceptedInfo.model"
                class="brand_input"
                size="mini"
                placeholder="车辆车型"
                :disabled="pageType=='detail'?true:false"
              ></el-input>
            </el-form-item>
            <el-form-item label="客户姓名：" prop="userName">
              <el-input
                v-model="acceptedInfo.userName"
                class="brand_input"
                size="mini"
                placeholder="客户姓名"
                :disabled="pageType=='detail'?true:false"
              ></el-input>
            </el-form-item>
            <el-form-item label="付款方角色：" prop="payRole">
              <el-radio v-model="acceptedInfo.payRole" label="0">客户</el-radio>
              <el-radio v-model="acceptedInfo.payRole" label="1">合作伙伴</el-radio>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="12">
          <!-- <div class="grid-content bg-purple"></div> -->
          <el-form
            key="carForm2"
            :model="acceptedInfo"
            label-position="right"
            class="demo-form-inline"
            ref="acceptedInfo"
            :rules="rules"
            label-width="auto"
          >
            <el-form-item label="合同编号：">
              <el-input
                v-model="acceptedInfo.contractNo"
                size="mini"
                placeholder="请输入合同编号"
                :disabled="pageType=='detail'?true:false"
              ></el-input>
            </el-form-item>
            <el-form-item label="已收日期：" prop="paidDate">
              <el-date-picker
                size="mini"
                v-model="acceptedInfo.paidDate"
                type="date"
                placeholder="请选择已收日期"
                value-format="yyyy-MM-dd"
                :disabled="pageType=='detail'?true:false"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="已收金额：" prop="paidAmount">
              <el-input
                v-model="acceptedInfo.paidAmount"
                size="mini"
                placeholder="请输入已收金额"
                :disabled="pageType=='detail'?true:false"
              ></el-input>
            </el-form-item>

            <el-form-item label="收款人：">
              <el-select
                v-model="acceptedInfo.payer"
                size="small"
                placeholder="请选择处理人"
                :disabled="pageType=='detail'?true:false"
                @change="selectPay"
              >
                <el-option
                  v-for="item in staffList"
                  :key="item.memberId"
                  :label="item.name"
                  :value="item.memberId"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="备注：">
              <el-input
                type="textarea"
                v-model="acceptedInfo.remarks"
                rows="5"
                size="mini"
                placeholder="请输入备注信息"
                :disabled="pageType=='detail'?true:false"
              ></el-input>
            </el-form-item>
            <el-form-item style="margin-top:30px;" v-if="pageType=='add'">
              <el-button size="mini" type="primary" @click="addMot">确定</el-button>
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
    <div class="checkForm">
      <p class="checkInfo">已收款信息</p>
      <el-form
        key="carForm3"
        :model="acceptedInfo"
        label-position="right"
        class="demo-form-inline"
        label-width="auto"
      >
        <div v-for="(item,index) in acceptedInfo.addKeys" :key="index" style="margin:24px;">
          <el-form-item label="附加照片：">
            <!-- TODO 上传图片的路径要改变 -->
            <el-upload
              class="avatar-uploader"
              :action="actions"
              :data="formData"
              :show-file-list="false"
              :on-success="handleDravelSuccess"
              :before-upload="beforeDravelUpload"
              :on-error="uploadError"
              v-loading="uploadLoading"
              element-loading-spinner="el-icon-loading"
              element-loading-background="rgba(0, 0, 0, 0.8)"
            >
              <img v-if="item.url" :src="item.url" class="avatar" @click="curRowIndex=index" />
              <p v-else class="avatar-uploader-icon" @click="curRowIndex=index">
                <i class="el-icon-plus"></i>
                <span>选择照片</span>
              </p>
            </el-upload>
          </el-form-item>
          <el-form-item label="文字描述：">
            <el-input
              type="textarea"
              v-model="item.picDesc"
              rows="5"
              size="mini"
              placeholder="请输入备注信息"
              :disabled="pageType=='detail'?true:false"
            ></el-input>
          </el-form-item>
        </div>
        <div class="addCheckInfo">
          <el-button type="primary" @click="addCheckInfo">新增已收款信息</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import http1 from "@/api/riskManagementApi";
import http from "@/api/carApi";
import signHttp from "@/api/contractApi";
import deployHttp from "@/api/deployApi";

export default {
  data() {
    return {
      acceptedInfo: {
        brand: "",
        model: "",
        payRole: "0",
        addKeys: [],
        userName: "",
        contractNo: "",
        licensePlate: ""
      },
      actions: `http://upload-z1.qiniup.com`,
      formData: { token: "" },
      curRowIndex: "",
      uploadLoading: false,
      staffList: [],
      contractInfo: {},
      imageUrl: "",
      brandModel: "",
      rules: {
        licensePlate: [
          { required: true, message: "请输入车牌号", trigger: "blur" }
        ],
        recordType: [
          { required: true, message: "请选择应收类型", trigger: "change" }
        ],
        userName: [
          { required: true, message: "请输入客户姓名", trigger: "blur" }
        ],
        brand: [{ required: true, message: "请输入车辆品牌", trigger: "blur" }],
        model: [{ required: true, message: "请输入车辆车型", trigger: "blur" }],
        paidDate: [
          { required: true, message: "请选择应收日期", trigger: "change" }
        ],
        paidAmount: [
          { required: true, message: "请输入应收金额", trigger: "blur" }
        ],
        payRole: [
          { required: true, message: "请选择付款方角色", trigger: "change" }
        ]
      },
      typeList: [
        { value: 0, lable: "租金" },
        { value: 1, lable: "押金" },
        { value: 2, lable: "管理费" },
        { value: 3, lable: "首付款" },
        { value: 4, lable: "尾款" },
        { value: 5, lable: "基础保险费" },
        { value: 6, lable: "不计免赔保险费" },
        { value: 7, lable: "违约金" },
        { value: 8, lable: "维修费" },
        { value: 9, lable: "保险理赔款" },
        { value: 10, lable: "服务费" },
        { value: 11, lable: "违章罚款" },
        { value: 12, lable: "其他" }
      ],
      pageType: "add",
      pageStatus: 1, //0为保存  1为詳情
      diffData: null,
      newMotInfo: {
        addKeys: []
      },
      examinePics: []
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
    this.acceptedInfo = {
      brand: "",
      model: "",
      payRole: "0",
      addKeys: [],
      userName: "",
      contractNo: "",
      licensePlate: ""
    };
    if (this.$route.query.recordInfo) {
      let recordInfo = JSON.parse(this.$route.query.recordInfo);
      let delKeys = [];
      let addKeys = [];
      recordInfo.pictures.forEach(item => {
        let info = {
          picKey: item.picKey,
          picDesc: item.picDesc,
          id: item.id,
          url: item.picPath
        };
        delKeys.push(item.id);
        addKeys.push(info);
      });
      console.log(delKeys);
      this.examinePics = recordInfo.pictures;
      this.acceptedInfo = {
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

      let cate = JSON.stringify(this.acceptedInfo);
      this.newMotInfo = JSON.parse(cate);
    }
    this.getStaffList();
  },
  methods: {
    //   上传正面身份证之前
    beforeDravelUpload(file) {
      this.uploadLoading = true;
      console.log(file);
      let name = file.name;
      let params = { fileName: name };
      let _this = this;
      if (file.type.indexOf("image") < 0) {
        this.$message(`图片格式不正确`);
        this.uploadLoading = false;
        return false;
      }
      return deployHttp.getUploadToken(params).then(data => {
        console.log(data.data.token);
        _this.formData.token = data.data.token;

        this.acceptedInfo.addKeys[this.curRowIndex].picKey = data.data.key;
      });
    },

    // 上传正面身份证成功
    handleDravelSuccess(res) {
      console.log(res);
      this.uploadLoading = false;
      this.$message(`上传成功`);
      // this.imageUrl.push({ url: res.payload.url });
      this.acceptedInfo.addKeys[this.curRowIndex].url = res.payload.url;
    },
    //上传失败
    uploadError(error) {
      console.log(error);
      this.$message(`上传失败`);
      this.uploadLoading = false;
    },
    getStaffList() {
      // TODO   员工需要修改
      let params = { page: 1, size: 20 };
      let qArr = ["com_admin", "com_accountant"];
      let tenantId = this.tenantId;
      deployHttp.getStaffList(params, tenantId, qArr).then(data => {
        console.log(data);
        if (data.code == 0) {
          this.staffList = data.data;
          // this.total = data.total;
        } else {
          this.$message(data.desc);
        }
      });
    },
    selectPay(value) {
      console.log(value);
      let roleInfo = this.staffList.find(item => {
        // console.log(item)
        return item.memberId == value;
      });
      this.acceptedInfo.payer = roleInfo.name;
    },
    addCheckInfo() {
      let info = { picKey: "", picDesc: "" };
      this.acceptedInfo.addKeys.push(info);
    },
    //新增已收记录
    addMot() {
      let { acceptedInfo, tenantId } = this;
      acceptedInfo.addKeys = acceptedInfo.addKeys.filter(item => {
        return item.picKey != "" || item.picDesc != "";
      });
      let arr = [];
      acceptedInfo.addKeys.forEach(item => {
        return arr.push({ picKey: item.picKey, picDesc: item.picDesc });
      });
      acceptedInfo.addKeys = arr;
      console.log(acceptedInfo.addKeys);
      console.log(acceptedInfo);
      this.$refs.acceptedInfo.validate(valid => {
        if (valid) {
          signHttp.addAccepted(acceptedInfo, tenantId).then(data => {
            console.log(data);
            if (data.code == 0) {
              this.$message(`新增已收记录成功`);
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
      let status = ["SIGNED", "FINISH", "TERMINATED_IN_ADVANCE"];
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
      this.acceptedInfo.licensePlate = licensePlate;
      this.acceptedInfo.userName = item.customerName;
      this.acceptedInfo.contractId = item.id;
      let that = this;
      http1.getVehicleModel({ licensePlate }, tenantId).then(data => {
        console.log(data);
        if (data.code == 0) {
          that.brandModel = data.data.brand + "-" + data.data.model;
          that.acceptedInfo.brand = data.data.brand;
          that.acceptedInfo.model = data.data.model;
          //   that.acceptedInfo.model = data.data.model;
        }
      });
      signHttp.getContractDetail(tenantId, contractId).then(data => {
        console.log(data.data);
        if (data.code == 0) {
          this.contractInfo = data.data;
          this.acceptedInfo.contractNo = data.data.contractNo
            ? data.data.contractNo
            : "";
        }
      });
    },
    clear() {
      this.acceptedInfo = {};
    },
    //删除验车记录
    deleteCar(row) {
      let params = { id: acceptedInfo.id };
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
        if (this.newMotInfo[k] != this.acceptedInfo[k]) {
          if (!this.diffData) {
            this.diffData = {};
          }
          if (this.newMotInfo["addKeys"] != this.acceptedInfo["addKeys"]) {
            this.acceptedInfo.addKeys.filter(item => {
              this.acceptedInfo.delKeys.push(item.id);
            });
          }
          this.diffData[k] = this.acceptedInfo[k];
          // this.diffData['licensePlate'] = this.licensePlate
        }
      }
    },

    //修改车检信息
    editMot() {
      console.log(`aaa`);
      this.pageStatus = this.pageStatus == 0 ? 1 : 0;
      let { acceptedInfo, tenantId } = this;

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
          this.diffData.id = this.acceptedInfo.id;
        }
        let params = !this.diffData ? acceptedInfo : this.diffData;
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

  .el-loading-mask {
    width: 104px !important;
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

  .checkForm {
    background: #fff;

    .checkInfo {
      padding: 24px;
      border-bottom: 1px solid #eaeaea;
      font-size: 16px;
      margin: 0;
    }

    .addCheckInfo {
      padding: 24px;
      text-align: center;
    }
  }
}
</style>