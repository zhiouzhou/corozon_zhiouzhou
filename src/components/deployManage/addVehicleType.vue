<template>
  <div id="addExchangeRecords">
    <div class="add_title">
      <el-button size="mini" type="primary" icon="el-icon-back" @click="$router.go(-1)">返回</el-button>
      <p>新增车型</p>
    </div>
    <div class="addForm">
      <el-form
        :model="cunstomerForm"
        :rules="rules"
        label-position="right"
        class="demo-form-inline"
        ref="cunstomerForm"
        label-width="auto"
      >
        <el-form-item label="所属品牌：">
          <el-input
            v-model="brand"
            size="mini"
            placeholder="请输入所属品牌"
            :disabled="pageType=='detail'?true:false"
          ></el-input>
        </el-form-item>
        <el-form-item label="所属车型：">
          <el-input
            v-model="model"
            size="mini"
            placeholder="请输入所属车型"
            :disabled="pageType=='detail'?true:false"
          ></el-input>
        </el-form-item>
        <el-form-item style="margin-top:30px;" v-if="pageType=='add'">
          <el-button size="small" type="primary" @click="addVehicleType">确定</el-button>
          <el-button size="small" type="primary" @click="clear">清空</el-button>
        </el-form-item>
        <el-form-item style="margin-top:30px;" v-else>
          <el-button
            size="small"
            type="primary"
            @click="editCustomer"
          >{{pageType=='detail'?'编辑信息':'保存'}}</el-button>
          <!-- 跟列表中的删除一样   删成功之后返回列表   弹个确认是否删除的弹框 -->
          <el-button size="small" type="primary" @click="deleteVehicleType">删除</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import http from "@/api/deployApi";
export default {
  data() {
    return {
      cunstomerForm: {},
      model: "",
      brand: "",
      imageUrl: ``,
      rules: {},
      pageType: "add",
      pageStatus: 1 //0为保存  1为詳情
    };
  },
  activated() {
    this.pageStatus = 1;
    console.log(this.$route.query.pageType);
    this.pageType = this.$route.query.pageType;
    if (this.$route.query.vehicleTypeInfo) {
      let vehicleTypeInfo = JSON.parse(this.$route.query.vehicleTypeInfo);
      this.model = vehicleTypeInfo.model;
      this.brand = vehicleTypeInfo.brand;
      this.cunstomerForm = vehicleTypeInfo;
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
    addVehicleType() {
      let { brand, model, tenantId } = this;
      http.addVehicleType({}, tenantId, brand, model).then(data => {
        if (data.code == 0) {
          this.$message(data.desc);
          this.$router.back(-1);
          this.brand = "";
          this.model = "";
        } else {
          this.$message(data.desc);
        }
      });
    },
    editCustomer() {
      this.pageStatus = this.pageStatus == 0 ? 1 : 0;
      let params = {
        brand: this.brand,
        model: this.model,
        id: this.cunstomerForm.id,
        type: this.cunstomerForm.type
      };
      let tenantId = this.tenantId;
      console.log(this.pageStatus);
      if (this.pageStatus == 1) {
        this.pageType = "detail";
        http.editVehicleType(params, tenantId).then(data => {
          if (data.code == 0) {
            this.$message(`修改成功`);
            this.$router.back(-1);
            this.brand = "";
            this.model = "";
          } else {
            this.$message(data.desc);
          }
        });
        //保存修改内容
      } else {
        this.pageType = "edit";
      }
    },
    deleteVehicleType() {
      let tenantId = this.tenantId;
      let id = this.cunstomerForm.id;
      this.$confirm("此操作将永久删除该客户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          http.deleteVehicleType(tenantId, id).then(data => {
            if (data.code == 0) {
              this.$message(`删除成功`);
              this.$router.back(-1);
            }else {
              this.$message(data.desc);
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    clear() {
      this.brand = "";
      this.model = "";
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
