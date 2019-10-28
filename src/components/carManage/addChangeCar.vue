<template>
  <div id="addExchangeRecords">
    <div class="add_title">
      <el-button size="mini" type="primary" icon="el-icon-back" @click="$router.go(-1)">返回</el-button>
      <p>{{pageType=='add'?'新增换车记录':'换车记录详情'}}</p>
    </div>
    <div class="addForm">
      <el-form
        :model="changeCarForm"
        :rules="rules"
        label-position="right"
        class="demo-form-inline"
        ref="changeCarForm"
        label-width="auto"
      >
        <el-form-item label="需换车车牌号：" prop="originalPlate">
          <el-autocomplete
            v-model="changeCarForm.originalPlate"
            :fetch-suggestions="querySearchAsync"
            placeholder="请输入需换车车牌号："
            size="mini"
            @select="handleSelect"
            :disabled="pageType=='detail'?true:false"
          ></el-autocomplete>
        </el-form-item>
        <el-form-item label="需换车品牌车型：">
          <el-input v-model="olBbrandModel" size="mini" placeholder="需换车品牌车型" disabled></el-input>
        </el-form-item>
        <el-form-item label="新车车牌号：" prop="replacePlate">
          <el-autocomplete
            v-model="changeCarForm.replacePlate"
            :fetch-suggestions="querySearchAsync"
            placeholder="请输入新车车牌号"
            size="mini"
            @select="handleNewSelect"
            :disabled="pageType=='detail'?true:false"
          ></el-autocomplete>
        </el-form-item>
        <el-form-item label="新车品牌车型：">
          <el-input v-model="newBrandModel" size="mini" placeholder="新车品牌车型" disabled></el-input>
        </el-form-item>
        <el-form-item label="客户姓名：" prop="userName">
          <el-input
            v-model="changeCarForm.userName"
            size="mini"
            placeholder="请输入联系人"
            :disabled="pageType=='detail'?true:false"
          ></el-input>
        </el-form-item>
        <el-form-item label="合同编号：">
          <el-input
            v-model="changeCarForm.contractNo"
            size="mini"
            placeholder="请输入联系电话"
            :disabled="pageType=='detail'?true:false"
          ></el-input>
        </el-form-item>
        <el-form-item label="换车开始日期：" prop="startTime">
          <el-date-picker
            size="mini"
            v-model="changeCarForm.startTime"
            type="datetime"
            placeholder="请选择换车开始日期"
            value-format="yyyy-MM-dd HH:mm:ss"
            :disabled="pageType=='detail'?true:false"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="换车结束日期：" prop="endTime">
          <el-date-picker
            size="mini"
            v-model="changeCarForm.endTime"
            type="datetime"
            placeholder="请选择换车结束日期"
            value-format="yyyy-MM-dd HH:mm:ss"
            :disabled="pageType=='detail'?true:false"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="备注：">
          <el-input
            type="textarea"
            v-model="changeCarForm.remarks"
            rows="5"
            size="small"
            placeholder="请输入备注信息"
            :disabled="pageType=='detail'?true:false"
          ></el-input>
        </el-form-item>
        <el-form-item style="margin-top:30px;" v-if="pageType=='add'">
          <el-button size="small" type="primary" @click="addChangeCar">确定</el-button>
          <el-button size="small" type="primary" @click="clear">清空</el-button>
        </el-form-item>
        <el-form-item style="margin-top:30px;" v-else>
          <el-button
            size="small"
            type="primary"
            @click="editChangeCar"
          >{{pageType=='detail'?'编辑信息':'保存'}}</el-button>
          <!-- 跟列表中的删除一样   删成功之后返回列表   弹个确认是否删除的弹框 -->
          <el-button size="small" type="primary" @click="deleteRecord">删除</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { regionData, CodeToText } from "element-china-area-data";
import { mapState, mapMutations } from "vuex";
import http from "@/api/riskManagementApi";
import https from "@/api/carApi";
export default {
  data() {
    return {
      changeCarForm: {
        userId: "793646587"
      },
      newChangeForm: {},
      diffData: null,
      olBbrandModel: "",
      newBrandModel: "",
      rules: {
        originalPlate: [
          { required: true, message: "请输入需换车车牌号", trigger: "blur" }
        ],
        replacePlate: [
          { required: true, message: "请输入新车车牌号", trigger: "blur" }
        ],
        userName: [
          {
            required: true,
            message: "请输入客户姓名",
            trigger: "blur"
          }
        ],
        startTime: [
          {
            required: true,
            message: "请选择换车开始日期",
            trigger: "change"
          }
        ],
        endTime: [
          { required: true, message: "请选择换车结束日期", trigger: "change" }
        ]
      },
      pageType: "add"
    };
  },
  created() {},
  activated() {
    this.pageType = this.$route.query.pageType;
    if (this.$route.query.recordInfo) {
      let recordInfo = JSON.parse(this.$route.query.recordInfo);
      this.olBbrandModel =
        recordInfo.originalBrand + "-" + recordInfo.originalModel;
      this.newBrandModel =
        recordInfo.replaceBrand + "-" + recordInfo.replaceModel;
      this.changeCarForm = {
        id: recordInfo.id,
        replacePlate: recordInfo.replacePlate,
        replaceBrand: recordInfo.replaceBrand,
        replaceModel: recordInfo.replaceModel,
        contractNo: recordInfo.contractNo,
        userId: recordInfo.userId,
        userName: recordInfo.userName,
        originalPlate: recordInfo.originalPlate,
        originalBrand: recordInfo.originalBrand,
        originalModel: recordInfo.originalModel,
        startTime: recordInfo.startTime,
        endTime: recordInfo.endTime,
        remarks: recordInfo.remarks
      };
      this.newChangeForm = {
        id: recordInfo.id,
        replacePlate: recordInfo.replacePlate,
        replaceBrand: recordInfo.replaceBrand,
        replaceModel: recordInfo.replaceModel,
        contractNo: recordInfo.contractNo,
        userId: recordInfo.userId,
        userName: recordInfo.userName,
        originalPlate: recordInfo.originalPlate,
        originalBrand: recordInfo.originalBrand,
        originalModel: recordInfo.originalModel,
        startTime: recordInfo.startTime,
        endTime: recordInfo.endTime,
        remarks: recordInfo.remarks
      };
    }
  },
  computed: {
    ...mapState(`user`, [`access_token`, `tenantId`])
  },
  methods: {
    //   上传正面身份证之前
    beforeAvatarUpload(file) {},
    // 上传正面身份证成功
    handleAvatarSuccess() {},
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
    //旧车车辆品牌
    handleSelect(item) {
      console.log(item);
      let tenantId = this.tenantId;
      let licensePlate = item.value;
      let that = this;
      http.getVehicleModel({ licensePlate }, tenantId).then(data => {
        console.log(data);
        if (data.code == 0) {
          that.olBbrandModel = data.data.brand + "-" + data.data.model;
          that.changeCarForm.originalBrand = data.data.brand;
          that.changeCarForm.originalModel = data.data.model;
        }
      });
    },
    // 新车车辆品牌
    handleNewSelect(item) {
      console.log(item);
      let tenantId = this.tenantId;
      let licensePlate = item.value;
      let that = this;
      http.getVehicleModel({ licensePlate }, tenantId).then(data => {
        console.log(data);
        if (data.code == 0) {
          that.newBrandModel = data.data.brand + "-" + data.data.model;
          that.changeCarForm.replaceBrand = data.data.brand;
          that.changeCarForm.replaceModel = data.data.model;
        }
      });
    },
    //新增换车记录
    addChangeCar() {
      let { changeCarForm, tenantId } = this;
      this.$refs.changeCarForm.validate(valid => {
        if (valid) {
          https.addChangeCar(changeCarForm, tenantId).then(data => {
            console.log(data);
            if (data.code == 0) {
              this.$message(`新增换车记录成功`);
              this.$router.back(-1);
              //   this.priceStatus = true;
            } else {
              this.$message(data.desc);
            }
          });
        } else {
          this.$message(`请填写必填项后提交`);
        }
      });
    },
    clear() {},
    //比较数据
    diffDevinfo() {
      for (let k in this.newChangeForm) {
        if (this.newChangeForm[k] != this.changeCarForm[k]) {
          if (!this.diffData) {
            this.diffData = {};
          }
          this.diffData[k] = this.changeCarForm[k];
          // this.diffData['licensePlate'] = this.licensePlate
        }
      }
    },
    //修改换车记录
    editChangeCar() {
      this.pageStatus = this.pageStatus == 0 ? 1 : 0;
      let { changeCarForm, tenantId } = this;
      let that = this;
      if (this.pageStatus == 1) {
        this.pageType = "detail";
        this.diffDevinfo();
        if (!this.diffData) {
          that.$message(`未修改数据不提交`);
          return;
        } else {
          this.diffData.id = this.changeCarForm.id;
        }
        let params = !this.diffData ? changeCarForm : this.diffData;
        https.editChangeRecord(params, tenantId).then(data => {
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
    deleteRecord() {
      let tenantId = this.tenantId;
      let params = { id: this.changeCarForm.id };
      let that = this;
      this.$confirm("此操作将永久删除该条数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          https.deleteChangeRecord(params, tenantId).then(data => {
            if (data.code == 0) {
              that.$message(`删除成功`);
              this.$router.back(-1);
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  }
};
</script>
<style lang="stylus" >
#addExchangeRecords {
  margin: 12px;
  background: #fff;

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
    width: 120px;
    height: 120px;
    line-height: 120px;
    text-align: center;
    display: flex;
    align-items: center;
    flex-direction: column;
    margin: 0;
    justify-content: center;

    span {
      font-size: 14px;
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
    margin-right: 24px;
  }

  .el-form-item {
    // width: 48%;
    margin-bottom: 14px;

    &:nth-child(4) {
      .el-form-item__content {
        display: flex;
        align-items: center;
        justify-content: space-between;

        .el-button {
          margin-left: 12px;
        }
      }
    }

    // margin-right: 80px;
    .el-button {
      // width: 100%;
      // margin-top: 24px;
      // color: #000;
      // font-weight: 600;
    }
  }

  .el-input--mini .el-input__inner {
    height: 28px;
    line-height: 28px;
    // width: 390px;
  }

  .el-input.is-disabled .el-input__inner {
    color: #999;
  }

  .el-form-item__label {
    font-size: 14px;
    color: #333;
  }

  .el-button--primary {
    color: #FFF;
    background-color: #1890ff;
    border-color: #1890ff;
  }
}
</style>
