<template>
  <div id="addCustomer">
    <div style="background:#fff">
      <div class="add_title">
        <el-button size="mini" type="primary" icon="el-icon-back" @click="$router.go(-1)">返回</el-button>
        <p>{{pageType=='add'?'新增年检记录':'年检记录详情'}}</p>
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
            <el-form-item label="年检处理人：" prop="handlerName">
              <el-input
                v-model="motInfo.handlerName"
                size="mini"
                placeholder="请输入年检处理人"
                :disabled="pageType=='detail'?true:false"
              ></el-input>
            </el-form-item>
            <el-form-item label="年检日期" prop="motDay">
              <el-date-picker
                size="mini"
                v-model="motInfo.motDay"
                type="date"
                placeholder="请选择年检日期"
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
            :model="motInfo"
            label-position="right"
            class="demo-form-inline"
            ref="motInfo"
            :rules="rules"
            label-width="auto"
          >
            <el-form-item label="年检金额：" prop="motAmount">
              <el-input
                v-model="motInfo.motAmount"
                size="mini"
                placeholder="请输入年检金额"
                :disabled="pageType=='detail'?true:false"
              ></el-input>
            </el-form-item>
            <el-form-item label="下次年检日期" prop="nextDay">
              <el-date-picker
                size="mini"
                v-model="motInfo.nextDay"
                type="date"
                placeholder="请选择下次年检日期"
                value-format="yyyy-MM-dd"
                :disabled="pageType=='detail'?true:false"
              ></el-date-picker>
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
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import http from "@/api/riskManagementApi";
export default {
  data() {
    return {
      motInfo: {
        brand: "",
        model: ""
      },
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
    if (this.$route.query.motInfo) {
      let motInfo = JSON.parse(this.$route.query.motInfo);
      this.motInfo = {
        id: motInfo.id,
        licensePlate: motInfo.licensePlate,
        brand: motInfo.brand,
        model: motInfo.model,
        handlerName: motInfo.handlerName,
        motDay: motInfo.motDay,
        motAmount: motInfo.motAmount,
        nextDay: motInfo.nextDay,
        remarks: motInfo.remarks
      };
      this.newMotInfo = {
        id: motInfo.id,
        licensePlate: motInfo.licensePlate,
        brand: motInfo.brand,
        model: motInfo.model,
        handlerName: motInfo.handlerName,
        motDay: motInfo.motDay,
        motAmount: motInfo.motAmount,
        nextDay: motInfo.nextDay,
        remarks: motInfo.remarks
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
    //查询品牌车型列表
    addMot() {
      let { motInfo, tenantId } = this;
      this.$refs.motInfo.validate(valid => {
        if (valid) {
          http.addMot(motInfo, tenantId).then(data => {
            console.log(data);
            if (data.code == 0) {
              this.$message(`新增年检成功`);
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
    clear() {
      this.motInfo = {};
    },
    //删除年检记录
    deleteMot(row) {
      let params = { id: motInfo.id };
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
        if (this.newMotInfo[k] != this.motInfo[k]) {
          if (!this.diffData) {
            this.diffData = {};
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
          this.diffData.licensePlate = this.motInfo.licensePlate;
        }
        let params = !this.diffData ? motInfo : this.diffData;
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