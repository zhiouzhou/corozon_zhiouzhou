<template>
  <div id="addCustomer">
    <div style="background:#fff">
      <div class="add_title">
        <el-button size="mini" type="primary" icon="el-icon-back" @click="$router.go(-1)">返回</el-button>
        <p>{{pageType=='add'?'新增验车记录':'验车记录详情'}}</p>
      </div>
    </div>
    <div class="addForm">
      <el-row :gutter="60">
        <el-col :span="12" :xl="8">
          <!-- <div class="grid-content bg-purple"></div> -->
          <el-form
            key="carForm1"
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
            <el-form-item label="合同编号：">
              <el-input
                v-model="motInfo.contractNo"
                size="mini"
                placeholder="请输入合同编号"
                :disabled="pageType=='detail'?true:false"
              ></el-input>
            </el-form-item>
            <el-form-item label="验车类型：">
              <el-select
                v-model="motInfo.examineType"
                size="small"
                placeholder="请选择验车类型"
                :disabled="pageType=='detail'?true:false"
                @change="selectStatus"
              >
                <el-option
                  v-for="(item,index) in examineTypeOptions"
                  :label="item.label"
                  :value="item.value"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="行驶证：">
              <el-select
                v-model="motInfo.vehicleLicense"
                size="small"
                placeholder="是否有行驶证"
                :disabled="pageType=='detail'?true:false"
              >
                <el-option label="有" value="1"></el-option>
                <el-option label="没有" value="0"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="营运证：">
              <el-select
                v-model="motInfo.operatePermit"
                size="small"
                placeholder="是否有营运证"
                :disabled="pageType=='detail'?true:false"
              >
                <el-option label="有" value="1"></el-option>
                <el-option label="没有" value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="12">
          <!-- <div class="grid-content bg-purple"></div> -->
          <el-form
            key="carForm2"
            :model="motInfo"
            label-position="right"
            class="demo-form-inline"
            :rules="rules"
            label-width="auto"
          >
            <el-form-item label="验车时间">
              <el-date-picker
                size="mini"
                v-model="motInfo.examineTime"
                type="datetime"
                placeholder="请选择验车时间"
                value-format="yyyy-MM-dd HH:mm:ss"
                :disabled="pageType=='detail'?true:false"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="公里数" prop="mileage">
              <el-input
                v-model="motInfo.mileage"
                size="mini"
                placeholder="请输入公里数"
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
      <p class="checkInfo">验车信息</p>
      <el-form
        key="carForm3"
        :model="motInfo"
        label-position="right"
        class="demo-form-inline"
        label-width="auto"
      >
        <div v-for="(item,index) in motInfo.addKeys" :key="index" style="margin:24px;">
          <el-form-item label="验车照片：">
            <!-- TODO 上传图片的路径要改变 -->
            <el-upload
              class="avatar-uploader"
              :action="actions"
              :data="formData"
              :show-file-list="false"
              :on-success="handleDravelSuccess"
              :before-upload="beforeDravelUpload"
              v-loading="uploadLoading"
              :on-error="uploadError"
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
          <el-form-item label="验车文字描述：">
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
          <el-button type="primary" @click="addCheckInfo">新增验车信息</el-button>
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
      motInfo: {
        examineType: 0,
        vehicleLicense: "1", //是否有行驶证   1是有  0是没有
        operatePermit: "1", //是否有营运证     1是有  0是没有
        addKeys: []
      },
      uploadLoading: false,
      imageUrls: [],
      curRowIndex: "",
      actions: `http://upload-z1.qiniup.com`,
      formData: { token: "" },
      staffList: [],
      imageUrl: "",
      brandModel: "",
      rules: {
        licensePlate: [
          { required: true, message: "请输入车牌号", trigger: "blur" }
        ],
        mileage: [{ required: false, message: "请输入公里数", trigger: "blur" }]
      },
      pageType: "add",
      pageStatus: 1, //0为保存  1为詳情
      diffData: null,
      newMotInfo: {
        addKeys: []
      },
      examineTypeOptions: [
        { value: 0, label: "普通验车" },
        { value: 1, label: "出租验车" },
        { value: 2, label: "退租验车" }
      ],
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
    this.getStaffList();
    if (this.$route.query.recordInfo) {
      let recordInfo = JSON.parse(this.$route.query.recordInfo);
      let delKeys = [];
      let addKeys = [];
      recordInfo.examinePics.forEach(item => {
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
    //   上传验车信息之前
    beforeDravelUpload(file, event) {
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

        this.motInfo.addKeys[this.curRowIndex].picKey = data.data.key;
      });
    },

    // 上传正面身份证成功
    handleDravelSuccess(res) {
      console.log(res);
      this.uploadLoading = false;
      this.$message(`上传成功`);
      // this.imageUrl.push({ url: res.payload.url });
      this.motInfo.addKeys[this.curRowIndex].url = res.payload.url;
    },
    //上传失败
    uploadError(error) {
      console.log(error);
      this.$message(`上传失败`);
      this.uploadLoading = false;
    },
    handleChange() {},
    addCheckInfo() {
      let info = { picKey: "", picDesc: "", url: "" };
      this.motInfo.addKeys.push(info);
    },
    getStaffList() {
      // TODO   员工需要修改
      let params = { page: 1, size: 20 };
      let qArr = ["com_motor_manager", "com_admin"];
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
    //新增验车记录
    addMot() {
      let { motInfo, tenantId } = this;
      motInfo.addKeys = motInfo.addKeys.filter(item => {
        return item.picKey != "" || item.picDesc != "";
      });
      let arr = [];
      motInfo.addKeys.forEach(item => {
        return arr.push({ picKey: item.picKey, picDesc: item.picDesc });
      });
      motInfo.addKeys = arr;
      console.log(motInfo.addKeys);
      console.log(motInfo);
      this.$refs.motInfo.validate(valid => {
        if (valid) {
          http.addCheckCar(motInfo, tenantId).then(data => {
            console.log(data);
            if (data.code == 0) {
              this.$message(`新增验车信息成功`);
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
      let params = { plate: queryString };
      if (!queryString) {
        return;
      }
      let addVehicleList = [{}];
      http1.getVehicleListl(params, tenantId).then(data => {
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
      http1.getVehicleModel({ licensePlate }, tenantId).then(data => {
        console.log(data);
        if (data.code == 0) {
          that.brandModel = data.data.brand + "-" + data.data.model;
          //   that.motInfo.model = data.data.model;
        }
      });
    },
    selectStatus(value) {
      console.log(value);
      if (value == 1 || value == 2) {
        let tenantId = this.tenantId;
        let plateNumber = this.motInfo.licensePlate;
        let status = ["SIGNED"];
        if (!plateNumber) {
          this.$message(`请输入车牌号`);
          return;
        }
        let addVehicleList = [{}];
        signHttp.getContractCar(tenantId, plateNumber, status).then(data => {
          console.log(data.data);
          if (data.code == 0) {
            if (data.data.length > 0) {
              this.motInfo.contractId = data.data[0].contractId;
            } else {
            }
          }
        });
      }
    },

    clear() {
      this.motInfo = {};
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

  .el-loading-mask {
    width: 104px !important;
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

  .el-input.is-disabled .el-input__inner {
    color: #999;
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