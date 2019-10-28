<template>
  <div id="addRepair">
    <div style="background:#fff">
      <div class="add_title">
        <el-button size="mini" type="primary" icon="el-icon-back" @click="$router.go(-1)">返回</el-button>
        <p>{{pageType=='add'?'新增维修记录':'维修记录详情'}}</p>
      </div>
    </div>
    <div class="addForm">
      <el-row :gutter="60">
        <el-col :span="12" :xl="8">
          <!-- <div class="grid-content bg-purple"></div> -->
          <el-form
            key="carForm1"
            :model="repairInfo"
            :rules="rules"
            label-position="right"
            class="demo-form-inline"
            ref="repairInfo"
            label-width="auto"
          >
            <el-form-item label="车牌号：" prop="licensePlate">
              <el-autocomplete
                v-model="repairInfo.licensePlate"
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
                v-model="repairInfo.userName"
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
            <el-form-item label="进厂时间：" prop="enterTime">
              <el-date-picker
                size="mini"
                v-model="repairInfo.enterTime"
                type="date"
                placeholder="请选择进厂时间"
                value-format="yyyy-MM-dd"
                :disabled="pageType=='detail'?true:false"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="出厂时间：">
              <el-date-picker
                size="mini"
                v-model="repairInfo.outTime"
                type="date"
                placeholder="请选择出厂时间"
                value-format="yyyy-MM-dd"
                :disabled="pageType=='detail'?true:false"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="修理厂名：" prop="repairCompany">
              <el-input
                v-model="repairInfo.repairCompany"
                size="mini"
                placeholder="请输入修理厂名"
                :disabled="pageType=='detail'?true:false"
              ></el-input>
            </el-form-item>
            <el-form-item label="修理内容：" prop="repairContent">
              <el-input
                type="textarea"
                v-model="repairInfo.repairContent"
                rows="5"
                size="mini"
                placeholder="请输入修理内容"
                :disabled="pageType=='detail'?true:false"
              ></el-input>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="12">
          <!-- <div class="grid-content bg-purple"></div> -->
          <el-form
            key="carForm2"
            :model="repairInfo"
            label-position="right"
            class="demo-form-inline"
            label-width="auto"
          >
            <el-form-item label="维修费用：">
              <el-input
                v-model="repairInfo.repairCost"
                size="mini"
                placeholder="请输入维修费用"
                :disabled="pageType=='detail'?true:false"
              ></el-input>
            </el-form-item>
            <el-form-item label="延迟天数：">
              <el-input
                v-model="repairInfo.delayDays"
                size="mini"
                placeholder="请输入延迟天数"
                :disabled="pageType=='detail'?true:false"
              ></el-input>
            </el-form-item>
            <el-form-item label="维修状态：">
              <el-select
                v-model="repairInfo.repairStatus"
                size="small"
                placeholder="请选择维修状态"
                :disabled="pageType=='detail'?true:false"
              >
                <el-option label="修理中" value="0"></el-option>
                <el-option label="已修好" value="1"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="结算状态：">
              <el-select
                v-model="repairInfo.settleStatus"
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
                v-model="repairInfo.pickStatus"
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
                v-model="repairInfo.remarks"
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
        :model="repairInfo"
        label-position="right"
        class="demo-form-inline"
        label-width="auto"
      >
        <div v-for="(item,index) in repairInfo.addKeys" :key="index" style="margin:24px;">
          <el-form-item label="验车照片：">
            <!-- TODO 上传图片的路径要改变 -->
            <el-upload
              class="avatar-uploader"
              :action="actions"
              :data="formData"
              :show-file-list="false"
              :on-success="handleCarSuccess"
              :before-upload="beforeCarUpload"
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
import contractHttp from "@/api/contractApi";
import deployHttp from "@/api/deployApi";

export default {
  data() {
    return {
      repairInfo: {
        addKeys: []
      },
      uploadLoading: false,
      curRowIndex: "",
      actions: `http://upload-z1.qiniup.com`,
      formData: { token: "" },
      options4: [],
      loading: false,
      imageUrl: "",
      brandModel: "",
      rules: {
        licensePlate: [
          { required: true, message: "请输入车牌号", trigger: "blur" }
        ],
        enterTime: [
          { required: true, message: "请选择进厂时间", trigger: "change" }
        ],
        repairCompany:[
          { required: true, message: "请输入修理厂名", trigger: "blur" }
        ]
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
    if (this.$route.query.recordInfo) {
      let recordInfo = JSON.parse(this.$route.query.recordInfo);
      // let delKeys = [recordInfo.id];
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
      //   this.examinePics = recordInfo.examinePics;
      this.repairInfo = {
        id: recordInfo.id, //必填
        licensePlate: recordInfo.licensePlate, //车牌
        brand: recordInfo.brand, //品牌
        model: recordInfo.model, //车型
        userId: recordInfo.userId, //用户标识
        userName: recordInfo.userName, //用户名
        enterTime: recordInfo.enterTime, //进厂时间
        outTime: recordInfo.outTime, //出厂时间
        repairCost: recordInfo.repairCost, //维修费用
        delayDays: recordInfo.delayDays, //延迟天数
        repairCompany: recordInfo.repairCompany, //修理厂名
        repairContent: recordInfo.repairContent, //修理内容
        repairStatus: recordInfo.repairStatus + "", //维修状态，0-修理中，1-已修好
        settleStatus: recordInfo.settleStatus + "", //结算状态，0-未结算，1-已结算，2-已确认
        pickStatus: recordInfo.pickStatus + "", //提车状态，0-未提车，1-已提车
        remarks: recordInfo.remarks, //备注
        addKeys: addKeys,
        delKeys: [] //维修记录数据库标识
      };

      let cate = JSON.stringify(this.repairInfo);
      this.newMotInfo = JSON.parse(cate);
    }
  },
  deactivated() {
    console.log(`我已经离开了`);
    this.repairInfo = {};
    this.brandModel = "";
  },
  methods: {
    //上传维修之前
    beforeCarUpload(file) {
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

        this.repairInfo.addKeys[this.curRowIndex].picKey = data.data.key;
      });
    },
    //上传成功之后
    handleCarSuccess(res) {
      console.log(res);
      this.$message(`上传成功`);
      this.uploadLoading = false;
      // this.imageUrl.push({ url: res.payload.url });
      this.repairInfo.addKeys[this.curRowIndex].url = res.payload.url;
    },
    //上传失败
    uploadError(error) {
      console.log(error);
      this.$message(`上传失败`);
      this.uploadLoading = false;
    },
    addCheckInfo() {
      let info = { picKey: "", picDesc: "", url: "" };
      this.repairInfo.addKeys.push(info);
    },
    //新增维修记录
    addMot() {
      let { repairInfo, tenantId } = this;
      repairInfo.addKeys = repairInfo.addKeys.filter(item => {
        return item.picKey != "" || item.picDesc != "";
      });
      let arr = [];
      repairInfo.addKeys.forEach(item => {
        return arr.push({ picKey: item.picKey, picDesc: item.picDesc });
      });
      repairInfo.addKeys = arr;
      console.log(repairInfo.addKeys);
      console.log(repairInfo);
      this.$refs.repairInfo.validate(valid => {
        if (valid) {
          http.addRepairCar(repairInfo, tenantId).then(data => {
            console.log(data);
            if (data.code == 0) {
              this.$message(`新增维修信息成功`);
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
      if (userInfo.type == "INDIVIDUAL") {
        userInfo = this.options4.find(item => {
          return item.individual.name == name;
        });
      } else {
        userInfo = this.options4.find(item => {
          return item.enterprise.name == name;
        });
      }
      console.log(userInfo);
      this.repairInfo.userId = userInfo.id;
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
          this.repairInfo.brand = data.data.brand;
          this.repairInfo.model = data.data.model;
          //   that.repairInfo.model = data.data.model;
        }
      });
    },
    clear() {
      this.repairInfo = {};
    },
    //删除验车记录
    deleteCar(row) {
      let params = { id: repairInfo.id };
      let tenantId = this.tenantId;
      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          http.deleteRepairRecord(params, tenantId).then(data => {
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
        if (this.newMotInfo[k] != this.repairInfo[k]) {
          if (!this.diffData) {
            this.diffData = {};
          }
          if (this.newMotInfo["addKeys"] != this.repairInfo["addKeys"]) {
            this.repairInfo.addKeys.filter(item => {
              this.repairInfo.delKeys.push(item.id);
            });
          }
          this.diffData[k] = this.repairInfo[k];
          // this.diffData['licensePlate'] = this.licensePlate
        }
      }
    },

    //修改车检信息
    editMot() {
      console.log(`aaa`);
      this.pageStatus = this.pageStatus == 0 ? 1 : 0;
      let { repairInfo, tenantId } = this;

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
          this.diffData.id = this.repairInfo.id;
        }
        let params = !this.diffData ? repairInfo : this.diffData;
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
        http.editRepairRecord(params, tenantId).then(data => {
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
#addRepair {
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