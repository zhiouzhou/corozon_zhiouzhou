<template>
  <div id="addCustomer">
    <div style="background:#fff">
      <div class="add_title">
        <el-button size="small" type="primary" icon="el-icon-back" @click="$router.go(-1)">返回</el-button>
        <p>{{pageType=='add'?'新增保单':'保单记录'}}</p>
      </div>
    </div>
    <div class="addForm">
      <el-form
        :model="motInfo"
        :rules="rules"
        label-position="right"
        class="demo-form-inline"
        ref="motInfo"
        label-width="auto"
      >
        <el-form-item label="车牌号：" prop="licensePlate">
          <el-autocomplete
            v-model="motInfo.licensePlate"
            :fetch-suggestions="querySearchAsync"
            placeholder="请输入车牌号"
            size="mini"
            @select="handleSelect"
            :disabled="pageType=='detail'?true:false"
          ></el-autocomplete>
        </el-form-item>
        <el-form-item label="品牌：">
          <el-input
            v-model="motInfo.brand"
            class="brand_input"
            size="mini"
            placeholder="品牌根据车牌号自动联想"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="车型：">
          <el-input
            v-model="motInfo.model"
            class="model_input"
            size="mini"
            placeholder="车型根据车牌号自动联想"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="交强险金额：">
          <el-input
            v-model="motInfo.compulsoryInsured"
            size="small"
            placeholder="请输入交强险金额"
            :disabled="pageType=='detail'?true:false"
          ></el-input>
        </el-form-item>
        <el-form-item label="交强险保险单号：" prop="compulsoryPolicyNo">
          <el-input
            v-model="motInfo.compulsoryPolicyNo"
            size="small"
            placeholder="请输入交强险保险单号"
            :disabled="pageType=='detail'?true:false"
          ></el-input>
        </el-form-item>
        <el-form-item label="交强险开始日期：" prop="compulsoryStartDay">
          <el-date-picker
            size="small"
            v-model="motInfo.compulsoryStartDay"
            type="date"
            placeholder="请选择交强险开始日期"
            value-format="yyyy-MM-dd"
            :disabled="pageType=='detail'?true:false"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="交强险结束日期：" prop="compulsoryEndDay">
          <el-date-picker
            size="small"
            v-model="motInfo.compulsoryEndDay"
            type="date"
            placeholder="请选择交强险结束日期"
            value-format="yyyy-MM-dd"
            :disabled="pageType=='detail'?true:false"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="交强险保单照片：">
          <div class="upload-img">
            <el-upload
              class="avatar-uploader"
              :action="actions"
              :data="formData"
              :show-file-list="false"
              :on-success="handleCardASuccess"
              :before-upload="beforeCardAUpload"
              v-loading="uploadLoading"
              :on-error="uploadError"
              element-loading-spinner="el-icon-loading"
              element-loading-background="rgba(0, 0, 0, 0.8)"
            >
              <img v-if="compulsorySlipPic" :src="compulsorySlipPic" class="avatar" />
              <p v-else class="avatar-uploader-icon">
                <i class="el-icon-plus"></i>
                <span>选择照片</span>
              </p>
            </el-upload>
          </div>
        </el-form-item>
        <el-form-item label="交强险组织机构代码：">
          <el-input
            v-model="motInfo.compulsoryOrgCode"
            size="small"
            placeholder="请输入交强险组织机构代码"
            :disabled="pageType=='detail'?true:false"
          ></el-input>
        </el-form-item>
        <el-form-item label="交强险保险公司：">
          <el-input
            v-model="motInfo.compulsoryCompany"
            size="small"
            placeholder="请输入交强险保险公司"
            :disabled="pageType=='detail'?true:false"
          ></el-input>
        </el-form-item>
      </el-form>
      <el-form
        :model="motInfo"
        :rules="rules"
        label-position="right"
        class="demo-form-inline"
        ref="motInfo"
        label-width="auto"
      >
        <el-form-item label="商业险金额：">
          <el-input
            v-model="motInfo.commercialInsured"
            size="small"
            placeholder="请输入商业险金额"
            :disabled="pageType=='detail'?true:false"
          ></el-input>
        </el-form-item>
        <el-form-item label="商业险保险单号：" prop="commercialPolicyNo">
          <el-input
            v-model="motInfo.commercialPolicyNo"
            size="small"
            placeholder="请输入商业险保险单号"
            :disabled="pageType=='detail'?true:false"
          ></el-input>
        </el-form-item>
        <el-form-item label="商业险开始日期：" prop="commercialStartDay">
          <el-date-picker
            size="small"
            v-model="motInfo.commercialStartDay"
            type="date"
            placeholder="请选择商业险开始日期"
            value-format="yyyy-MM-dd"
            :disabled="pageType=='detail'?true:false"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="商业险结束日期：" prop="commercialEndDay">
          <el-date-picker
            size="small"
            v-model="motInfo.commercialEndDay"
            type="date"
            placeholder="请选择商业险结束日期"
            value-format="yyyy-MM-dd"
            :disabled="pageType=='detail'?true:false"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="商业险保单照片：">
          <div class="upload-img">
            <el-upload
              class="avatar-uploader"
              :action="actions"
              :data="formData"
              :show-file-list="false"
              :on-success="handleCommerSuccess"
              :before-upload="beforeCommerUpload"
              :on-error="uploadError"
            >
              <img v-if="commercialSlipPic" :src="commercialSlipPic" class="avatar" />
              <p v-else class="avatar-uploader-icon">
                <i class="el-icon-plus"></i>
                <span>选择照片</span>
              </p>
            </el-upload>
          </div>
        </el-form-item>
        <el-form-item label="商业险组织机构代码：">
          <el-input
            v-model="motInfo.commercialOrgCode"
            size="small"
            placeholder="请输入商业险组织机构代码"
            :disabled="pageType=='detail'?true:false"
          ></el-input>
        </el-form-item>
        <el-form-item label="商业险保险公司：">
          <el-input
            v-model="motInfo.commercialCompany"
            size="small"
            placeholder="请输入商业险保险公司"
            :disabled="pageType=='detail'?true:false"
          ></el-input>
        </el-form-item>
        <el-form-item label="处理人：">
          <el-select
            v-model="motInfo.handlerId"
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
            v-model="motInfo.remarks"
            rows="5"
            size="small"
            placeholder="请输入备注信息"
            :disabled="pageType=='detail'?true:false"
          ></el-input>
        </el-form-item>
        <el-form-item style="margin-top:30px;" v-if="pageType=='add'">
          <el-button size="small" type="primary" @click="addPolicy">确定</el-button>
          <el-button size="small" type="primary" @click="clear">清空</el-button>
        </el-form-item>
        <el-form-item style="margin-top:30px;" v-else>
          <el-button
            size="small"
            type="primary"
            @click="editPolicy"
          >{{pageType=='detail'?'编辑信息':'保存'}}</el-button>
          <!-- 跟列表中的删除一样   删成功之后返回列表   弹个确认是否删除的弹框 -->
          <el-button size="small" type="primary" @click="deleteMot">删除</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
// import { regionData, CodeToText } from "element-china-area-data";
import { mapState, mapMutations } from "vuex";
import http from "@/api/riskManagementApi";
import deployHttp from "@/api/deployApi";

export default {
  data() {
    return {
      imageUrl: ``,
      motInfo: {
        brand: "",
        model: ""
      },
      uploadLoading: false,
      formData: { token: "" },
      staffList: [],
      compulsorySlipPic: "",
      commercialSlipPic: "",
      actions: `http://upload-z1.qiniup.com`,
      diffData: null,
      newMotInfo: {},
      rules: {
        licensePlate: [
          { required: true, message: "请输入车牌号", trigger: "blur" }
        ],
        compulsoryPolicyNo: [
          { required: true, message: "请输入交强保险单号", trigger: "blur" }
        ],
        compulsoryStartDay: [
          {
            required: true,
            message: "请选择交强保险单开始日期",
            trigger: "change"
          }
        ],
        compulsoryEndDay: [
          {
            required: true,
            message: "请选择交强保险单结束日期",
            trigger: "change"
          }
        ],
        commercialPolicyNo: [
          { required: true, message: "请输入商业保险单号", trigger: "blur" }
        ],
        commercialStartDay: [
          {
            required: true,
            message: "请选择商业保险单开始日期",
            trigger: "change"
          }
        ],
        commercialEndDay: [
          {
            required: true,
            message: "请选择商业保险单结束日期",
            trigger: "change"
          }
        ]
      },
      // options: regionData,
      pageType: "add",
      pageStatus: 1, //0为保存  1为詳情
      id: 0
    };
  },
  activated() {
    console.log(this.$route.query.pageType);
    this.pageStatus = 1;
    this.pageType = this.$route.query.pageType;
    this.motInfo = {};
    this.getStaffList();
    if (this.$route.query.renewalInfo) {
      let renewalInfo = JSON.parse(this.$route.query.renewalInfo);
      this.motInfo = {
        id: renewalInfo.id,
        licensePlate: renewalInfo.licensePlate,
        brand: renewalInfo.brand,
        model: renewalInfo.model,
        compulsoryInsured: renewalInfo.compulsoryInsurance.compulsoryInsured,
        compulsoryPolicyNo: renewalInfo.compulsoryInsurance.compulsoryPolicyNo,
        compulsoryStartDay: renewalInfo.compulsoryInsurance.compulsoryStartDay,
        compulsoryEndDay: renewalInfo.compulsoryInsurance.compulsoryEndDay,
        compulsoryOrgCode: renewalInfo.compulsoryInsurance.compulsoryOrgCode,
        compulsoryCompany: renewalInfo.compulsoryInsurance.compulsoryCompany,
        compulsorySlipPic: renewalInfo.compulsoryInsurance.compulsorySlipPic,
        commercialInsured: renewalInfo.commercialInsurance.commercialInsured,
        commercialPolicyNo: renewalInfo.commercialInsurance.commercialPolicyNo,
        commercialStartDay: renewalInfo.commercialInsurance.commercialStartDay,
        commercialEndDay: renewalInfo.commercialInsurance.commercialEndDay,
        commercialOrgCode: renewalInfo.commercialInsurance.commercialOrgCode,
        commercialSlipPic: renewalInfo.commercialInsurance.commercialSlipPic,
        commercialCompany: renewalInfo.commercialInsurance.commercialCompany,
        handlerName: renewalInfo.handlerName,
        remarks: renewalInfo.remarks
      };
      let cate = JSON.stringify(this.motInfo);
      this.newMotInfo = JSON.parse(cate);
      this.compulsorySlipPic =
        renewalInfo.compulsoryInsurance.compulsorySlipPic;
      this.commercialSlipPic =
        renewalInfo.commercialInsurance.commercialSlipPic;
    }
  },
  computed: {
    ...mapState(`user`, [`access_token`, `tenantId`])
  },
  methods: {
    //   交强险照片

    beforeCardAUpload(file) {
      console.log(file);
      this.uploadLoading = true;
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
        _this.motInfo.compulsorySlipPic = data.data.key;
      });
    },
    handleCardASuccess(res) {
      console.log(res);
      this.uploadLoading = false;
      this.$message(`上传成功`);
      // this.imageUrl.push({ url: res.payload.url });
      this.compulsorySlipPic = res.payload.url;
    },
    uploadError(error) {
      console.log(error);
      this.$message(`上传失败`);
      this.uploadLoading = false;
    },

    //   商业保险保单

    beforeCommerUpload(file) {
      console.log(file);
      this.uploadLoading = true;
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
        _this.motInfo.commercialSlipPic = data.data.key;
      });
    },
    handleCommerSuccess(res) {
      console.log(res);
      this.uploadLoading = false;
      this.$message(`上传成功`);
      // this.imageUrl.push({ url: res.payload.url });
      this.commercialSlipPic = res.payload.url;
    },
    uploadError(error) {
      console.log(error);
      this.$message(`上传失败`);
      this.uploadLoading = false;
    },
    //比较数据
    diffDevinfo() {
      for (let k in this.newMotInfo) {
        if (this.newMotInfo[k] != this.motInfo[k]) {
          if (!this.diffData) {
            this.diffData = {};
          }
          this.diffData[k] = this.motInfo[k];
          // this.diffData['licensePlate'] = this.licensePlate
        }
      }
    },
    getStaffList() {
      // TODO   员工需要修改
      let params = { page: 1, size: 20 };
      let qArr = ["com_risk_manager", "com_admin"];
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
      this.motInfo.handlerName = roleInfo.name;
    },
    //修改保单
    editPolicy() {
      this.pageStatus = this.pageStatus == 0 ? 1 : 0;
      console.log(this.pageStatus);
      let { motInfo, tenantId } = this;
      let that = this;
      if (this.pageStatus == 1) {
        this.pageType = "detail";
        this.diffDevinfo();
        console.log(this.diffData);
        if (!this.diffData) {
          that.$message(`未修改数据不提交`);
          return;
        } else {
          this.diffData.id = this.motInfo.id;
          this.diffData.licensePlate = this.motInfo.licensePlate;
        }
        let params = !this.diffData ? motInfo : this.diffData;
        // params.licensePlate = this.licensePlate
        // priceForm.licensePlate = this.licensePlate;
        http.editRenewalRecord(params, tenantId).then(data => {
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
    handleSelect(item) {
      console.log(item);
      let tenantId = this.tenantId;
      let licensePlate = item.value;
      let that = this;
      http.getVehicleModel({ licensePlate }, tenantId).then(data => {
        console.log(data);
        if (data.code == 0) {
          that.motInfo.brand = data.data.brand;
          that.motInfo.model = data.data.model;
        }
      });
    },
    //新增保单
    addPolicy() {
      let that = this;
      let { motInfo, tenantId } = this;
      this.$refs.motInfo.validate(valid => {
        if (valid) {
          http.addPolicy(motInfo, tenantId).then(data => {
            console.log(data);
            if (data.code == 0) {
              this.$message(`新增保单成功`);
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
    //删除保单
    deleteMot() {
      let params = { id: this.motInfo.id };
      let tenantId = this.tenantId;
      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          http.deleteRenewal(params, tenantId).then(data => {
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
    //清空表单
    clear() {
      this.motInfo = {};
    },
    ...mapMutations(`user`, [`clearToken`])
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
    width: 124px !important;
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
    margin-bottom: 14px;

    .el-button {
      // width: 100%;
      // margin-top: 12px;
      // color: #000;
      // font-weight: 600;
    }
  }

  .el-input--small .el-input__inner {
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