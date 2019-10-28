<template>
  <div id="addBeInDanger">
    <div style="background:#fff">
      <div class="add_title">
        <el-button size="mini" type="primary" icon="el-icon-back" @click="$router.go(-1)">返回</el-button>
        <p>{{pageType=='add'?'新增保养记录':'保养记录详情'}}</p>
      </div>
    </div>
    <div class="addForm">
      <el-row :gutter="60">
        <el-col :span="12" :xl="8">
          <!-- <div class="grid-content bg-purple"></div> -->
          <el-form
            key="carForm1"
            :model="maintainInfo"
            :rules="rules"
            label-position="right"
            class="demo-form-inline"
            ref="maintainInfo1"
            label-width="auto"
          >
            <el-form-item label="车牌号：" prop="licensePlate">
              <el-autocomplete
                v-model="maintainInfo.licensePlate"
                :fetch-suggestions="querySearchAsync"
                placeholder="请输入车牌号"
                size="mini"
                @select="handleSelect"
                :disabled="pageType=='detail'?true:false"
              ></el-autocomplete>
            </el-form-item>
            <el-form-item label="品牌车型：">
              <el-input
                v-model="brandModel"
                class="brand_input"
                size="mini"
                placeholder="品牌车型根据车牌号自动联想"
                disabled
              ></el-input>
            </el-form-item>
            <el-form-item label="客户姓名：">
              <el-select
                size="mini"
                v-model="maintainInfo.userName"
                filterable
                remote
                reserve-keyword
                placeholder="请输入关键词"
                :remote-method="remoteMethod"
                :loading="loading"
                @change="selectName"
                :disabled="pageType=='detail'?true:false"
              >
                <el-option
                  v-for="item in options4"
                  :key="item.id"
                  :label="item.individual?item.individual.name:item.enterprise.name"
                  :value="item.individual?item.individual.name:item.enterprise.name"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="修理厂：" prop="repairCompany">
              <el-input
                v-model="maintainInfo.repairCompany"
                size="mini"
                placeholder="请输入修理厂名称"
                :disabled="pageType=='detail'?true:false"
              ></el-input>
            </el-form-item>

            <el-form-item label="进场日期：" prop="enterTime">
              <el-date-picker
                size="mini"
                v-model="maintainInfo.enterTime"
                type="date"
                placeholder="请选择进场日期"
                value-format="yyyy-MM-dd"
                :disabled="pageType=='detail'?true:false"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="保养金额：" prop="keepCost">
              <el-input
                v-model="maintainInfo.keepCost"
                size="small"
                placeholder="请输入保养金额"
                :disabled="pageType=='detail'?true:false"
              ></el-input>
            </el-form-item>
            <el-form-item label="保养状态：">
              <el-select
                v-model="maintainInfo.keepStatus"
                size="small"
                placeholder="请选择理赔状态"
                :disabled="pageType=='detail'?true:false"
              >
                <el-option label="未完成" value="0"></el-option>
                <el-option label="已完成" value="1"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="进厂公里数：" prop="enterMileage">
              <el-input
                v-model="maintainInfo.enterMileage"
                size="small"
                placeholder="请输入进厂公里数"
                :disabled="pageType=='detail'?true:false"
              ></el-input>
            </el-form-item>
            <el-form-item label="下次保养日期：" prop="nextKeepTime">
              <el-date-picker
                size="mini"
                v-model="maintainInfo.nextKeepTime"
                type="date"
                placeholder="请选择进场日期"
                value-format="yyyy-MM-dd"
                :disabled="pageType=='detail'?true:false"
              ></el-date-picker>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="12">
          <!-- <div class="grid-content bg-purple"></div> -->
          <el-form
            key="carForm2"
            :model="maintainInfo"
            label-position="right"
            class="demo-form-inline"
            ref="maintainInfo2"
            :rules="rules"
            label-width="auto"
          >
            <el-form-item label="出厂日期：" prop="outTime">
              <el-date-picker
                size="mini"
                v-model="maintainInfo.outTime"
                type="date"
                placeholder="请选择出厂时间"
                value-format="yyyy-MM-dd"
                :disabled="pageType=='detail'?true:false"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="下次保养公里数：">
              <el-input
                v-model="maintainInfo.nextKeepMileage"
                size="mini"
                placeholder="请输入下次保养公里数"
                :disabled="pageType=='detail'?true:false"
              ></el-input>
            </el-form-item>
            <el-form-item label="结算状态：">
              <el-select
                v-model="maintainInfo.settleStatus"
                size="small"
                placeholder="请选择结算状态"
                :disabled="pageType=='detail'?true:false"
              >
                <el-option label="未结算" value="0"></el-option>
                <el-option label="已结算" value="1"></el-option>
                <el-option label="已确认" value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="提车状态：">
              <el-select
                v-model="maintainInfo.pickStatus"
                size="small"
                placeholder="请选择提车状态"
                :disabled="pageType=='detail'?true:false"
              >
                <el-option label="未提车" value="0"></el-option>
                <el-option label="已提车" value="1"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="备注：">
              <el-input
                type="textarea"
                v-model="maintainInfo.remarks"
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
      <p class="checkInfo">车辆保养信息</p>
      <el-form
        :model="maintainInfo"
        label-position="right"
        class="demo-form-inline"
        label-width="auto"
      >
        <div v-for="(item,index) in maintainInfo.addKeys" :key="index" style="margin:24px;">
          <el-form-item label="验车照片：">
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
            <el-dialog></el-dialog>
          </el-form-item>
          <el-form-item label="车辆出险描述：">
            <el-input
              type="textarea"
              v-model="item.picDesc"
              rows="5"
              size="mini"
              placeholder="请输入车辆保养描述"
              :disabled="pageType=='detail'?true:false"
            ></el-input>
          </el-form-item>
        </div>
        <div class="addCheckInfo">
          <el-button type="primary" @click="addCheckInfo">新增车辆保养信息</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import http1 from "@/api/riskManagementApi";
import http from "@/api/carApi";
import contractHttp from "@/api/contractApi";
import deployHttp from "@/api/deployApi";

export default {
  data() {
    return {
      maintainInfo: {
        userPhone: "",
        addKeys: []
      },
      formArr: ["maintainInfo1", "maintainInfo2"],
      resultArr: [], //接受验证返回结果数组
      actions: `http://upload-z1.qiniup.com`,
      formData: { token: "" },
      curRowIndex: "",
      imageUrl: "",
      brandModel: "",
      uploadLoading: false,
      rules: {
        licensePlate: [
          { required: true, message: "请输入车牌号", trigger: "blur" }
        ],
        repairCompany: [
          { required: true, message: "请输入修理厂名", trigger: "blur" }
        ],
        enterTime: [
          { required: true, message: "请选择进厂日期", trigger: "change" }
        ],
        outTime: [
          { required: true, message: "请选择出厂日期", trigger: "change" }
        ],
        keepCost: [
          { required: true, message: "请输入保养费用", trigger: "blur" }
        ],
        enterMileage: [
          { required: true, message: "请输入进厂公里数", trigger: "blur" }
        ],
        nextKeepTime: [
          { required: true, message: "请选择下次保养时间", trigger: "change" }
        ]
      },
      pageType: "add",
      pageStatus: 1, //0为保存  1为詳情
      diffData: null,
      newMotInfo: {
        addKeys: []
      },
      options4: [],
      loading: false,
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
    if (this.$route.query.maintainInfo) {
      let recordInfo = JSON.parse(this.$route.query.maintainInfo);
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
      this.brandModel = recordInfo.brand + "-" + recordInfo.model;
      this.examinePics = recordInfo.pictures;
      this.maintainInfo = {
        id: recordInfo.id, //必填
        licensePlate: recordInfo.licensePlate,
        brand: recordInfo.brand,
        model: recordInfo.model,
        userId: recordInfo.userId,
        userName: recordInfo.userName,
        repairCompany: recordInfo.repairCompany,
        enterTime: recordInfo.enterTime,
        outTime: recordInfo.outTime,
        keepStatus: recordInfo.keepStatus + "",
        keepCost: recordInfo.keepCost,
        enterMileage: recordInfo.enterMileage,
        nextKeepTime: recordInfo.nextKeepTime,
        nextKeepMileage: recordInfo.nextKeepMileage,
        settleStatus: recordInfo.settleStatus + "",
        pickStatus: recordInfo.pickStatus + "",
        remarks: recordInfo.remarks,
        addKeys: addKeys,
        delKeys: [] //删除出险图片，图片记录数据库标识
      };

      let cate = JSON.stringify(this.maintainInfo);
      this.newMotInfo = JSON.parse(cate);
    }
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

        this.maintainInfo.addKeys[this.curRowIndex].picKey = data.data.key;
      });
    },

    // 上传正面身份证成功
    handleDravelSuccess(res) {
      console.log(res);
      this.uploadLoading = false;
      this.$message(`上传成功`);
      // this.imageUrl.push({ url: res.payload.url });
      this.maintainInfo.addKeys[this.curRowIndex].url = res.payload.url;
    },
    //上传失败
    uploadError(error) {
      console.log(error);
      this.$message(`上传失败`);
      this.uploadLoading = false;
    },
    getBeInDangerDetail() {
      let params = { id: this.id };
      let tenantId = this.tenantId;
    },
    addCheckInfo() {
      let info = { picKey: "", picDesc: "", url: "" };
      this.maintainInfo.addKeys.push(info);
    },
    //formName 需要验证的表单  err验证不通过的提示信息
    refForm(formName) {
      let that = this;
      let result = new Promise(function(resolve, reject) {
        that.$refs[formName].validate(valid => {
          if (valid) {
            resolve();
          } else {
            reject(`请输入必填项！`);
          }
        });
      });
      that.resultArr.push(result);
    },
    //新增保养记录
    addMot() {
      let { maintainInfo, tenantId } = this;
      maintainInfo.addKeys = maintainInfo.addKeys.filter(item => {
        return item.picKey != "" || item.picDesc != "";
      });
      let arr = [];
      maintainInfo.addKeys.forEach(item => {
        return arr.push({ picKey: item.picKey, picDesc: item.picDesc });
      });
      maintainInfo.addKeys = arr;
      console.log(maintainInfo.addKeys);
      console.log(maintainInfo);
      this.resultArr = [];
      let that = this;
      this.formArr.forEach((item, index) => {
        //根据表单的ref校验
        this.refForm(item);
      });
      Promise.all(this.resultArr)
        .then(() => {
          http.addMaintainRecord(maintainInfo, tenantId).then(data => {
            console.log(data);
            if (data.code == 0) {
              this.$message(`新增保养记录成功`);
              this.$router.back(-1);
            } else {
              this.$message(data.desc);
            }
          });
        })
        .catch(err => {
          //验证失败 提示reject失败状态的值
          that.$message.error(err);
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
          that.maintainInfo.brand = data.data.brand;
          that.maintainInfo.model = data.data.model;
        }
      });
    },
    remoteMethod(query) {
      let tenantId = this.tenantId;
      let params = { name: query };
      if (query !== "") {
        this.loading = true;
        contractHttp.getCustomerList(params, tenantId).then(data => {
          if (data.code == 0) {
            this.loading = false;
            this.options4 = data.data;
          }
        });
      } else {
        this.options4 = [];
      }
    },
    selectName(name) {
      let userInfo = {};
      // if (userInfo.type == "INDIVIDUAL") {
      userInfo = this.options4.find(item => {
        if (item.individual) {
          return item.individual.name == name;
        } else {
          return item.enterprise.name == name;
        }
      });
      console.log(userInfo);
      this.maintainInfo.userId = userInfo.id;
    },
    clear() {
      this.maintainInfo = {};
    },
    //删除保养记录
    deleteCar(row) {
      let params = { id: maintainInfo.id };
      let tenantId = this.tenantId;
      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          http.editMaintainRecord(params, tenantId).then(data => {
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
        if (this.newMotInfo[k] != this.maintainInfo[k]) {
          if (!this.diffData) {
            this.diffData = {};
          }
          if (this.newMotInfo["addKeys"] != this.maintainInfo["addKeys"]) {
            this.maintainInfo.addKeys.filter(item => {
              this.maintainInfo.delKeys.push(item.id);
            });
          }
          this.diffData[k] = this.maintainInfo[k];
          // this.diffData['licensePlate'] = this.licensePlate
        }
      }
    },

    //修改保养信息
    editMot() {
      console.log(`aaa`);
      this.pageStatus = this.pageStatus == 0 ? 1 : 0;
      let { maintainInfo, tenantId } = this;

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
          this.diffData.id = this.maintainInfo.id;
        }
        let params = !this.diffData ? maintainInfo : this.diffData;
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
        http.editMaintainRecord(params, tenantId).then(data => {
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
#addBeInDanger {
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

  .el-loading-mask {
    width: 104px !important;
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