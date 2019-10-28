<template>
  <div id="addExchangeRecords">
    <div class="add_title">
      <el-button size="mini" type="primary" icon="el-icon-back" @click="$router.go(-1)">返回</el-button>
      <p>新增客户沟通记录</p>
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
        <el-form-item label="客户姓名：" prop="customerName">
          <el-input
            v-model="cunstomerForm.customerName"
            size="mini"
            placeholder="请输入客户姓名"
            :disabled="pageType=='detail'?true:false"
          ></el-input>
        </el-form-item>
        <el-form-item label="客户联系方式：" prop="mobile">
          <el-input
            v-model="cunstomerForm.mobile"
            size="mini"
            placeholder="请输入客户联系方式"
            :disabled="pageType=='detail'?true:false"
          ></el-input>
        </el-form-item>

        <el-form-item label="沟通日期：" prop="commDate">
          <el-date-picker
            size="mini"
            v-model="cunstomerForm.commDate"
            type="date"
            placeholder="请选择沟通日期"
            value-format="yyyy-MM-dd"
            :disabled="pageType=='detail'?true:false"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="相关照片：">
          <!-- TODO 上传图片的路径要改变 -->
          <el-upload
            class="avatar-uploader"
            :action="actions"
            :data="formData"
            list-type="picture-card"
            :show-file-list="true"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <p v-else class="avatar-uploader-icon">
              <i class="el-icon-plus"></i>
              <span>选择照片</span>
            </p>
          </el-upload>
        </el-form-item>
        <el-form-item label="备注：">
          <el-input
            type="textarea"
            v-model="cunstomerForm.remark"
            rows="5"
            size="mini"
            :disabled="pageType=='detail'?true:false"
          ></el-input>
        </el-form-item>
        <el-form-item style="margin-top:30px;" v-if="pageType=='add'">
          <el-button size="mini" type="primary" @click="addRecord">确定</el-button>
          <el-button size="mini" type="primary" @click="clear">清空</el-button>
        </el-form-item>
        <el-form-item style="margin-top:30px;" v-else>
          <el-button
            size="small"
            type="primary"
            @click="editCustomer"
          >{{pageType=='detail'?'编辑信息':'保存'}}</el-button>
          <!-- 跟列表中的删除一样   删成功之后返回列表   弹个确认是否删除的弹框 -->
          <el-button size="small" type="primary" @click="removeCustomerInfo">删除</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import http from "@/api/customerApi";
import deployHttp from "@/api/deployApi";

export default {
  data() {
    return {
      cunstomerForm: {
        pic: []
      },
      imageUrl: ``,
      actions: `http://upload-z1.qiniup.com`,
      formData: { token: "" },
      rules: {
        customerName: [
          { required: true, message: "请输入客户姓名", trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "请输入客户联系方式", trigger: "blur" }
        ],
        commDate: [
          { required: true, message: "请选择交流日期", trigger: "change" }
        ]
      },
      pageType: "add",
      pageStatus: 1, //0为保存  1为詳情
      id: 0
    };
  },
  computed: {
    ...mapState(`user`, [`access_token`, `tenantId`])
  },
  activated() {
    this.pageStatus = 1;
    this.pageType = this.$route.query.pageType;
    this.cunstomerForm = { pic: [] };
    if (this.$route.query.customerInfo) {
      let customerInfo = JSON.parse(this.$route.query.customerInfo);
      this.cunstomerForm = {
        customerName: customerInfo.customerName,
        mobile: customerInfo.mobile,
        commDate: customerInfo.commDate,
        remark: customerInfo.remark
      };
      this.id = customerInfo.id;
    }
  },
  methods: {
    //   上传正面身份证之前
    beforeAvatarUpload(file) {
      let name = file.name;
      let params = { fileName: name };
      let _this = this;
      if (file.type.indexOf("image") < 0) {
        this.$message(`图片格式不正确`);
        this.productLoading = false;
        return false;
      }
      return deployHttp.getUploadToken(params).then(data => {
        console.log(data.data.token);
        _this.formData.token = data.data.token;
      });
    },
    // 上传正面身份证成功
    handleAvatarSuccess(res) {
      // console.log(res);
      // if (this.cunstomerForm.type == "INDIVIDUAL") {
      //   this.individual.idA = res.payload.url;
      //   this.$message(`上传成功`);
      // } else {
      //   this.enterprise.contactIdA = res.payload.url;
      // }
      this.cunstomerForm.pic.push({ url: res.payload.url });
    },
    addRecord() {
      let { cunstomerForm, tenantId } = this;
      // let params = {}
      this.$refs.cunstomerForm.validate((valid, object) => {
        if (valid) {
          http.addIntentionRecord(cunstomerForm, tenantId).then(data => {
            if (data.code == 0) {
              this.$message(data.desc);
              this.$router.back(-1);
              this.cunstomerForm = {};
            } else {
              this.$message(data.desc);
            }
          });
        } else {
          this.$message(`请输入必填内容`);
          return false;
        }
      });
    },
    editCustomer() {
      this.pageStatus = this.pageStatus == 0 ? 1 : 0;
      let { cunstomerForm, tenantId, id } = this;
      if (this.pageStatus == 1) {
        this.pageType = "detail";
        this.$refs.cunstomerForm.validate((valid, object) => {
          if (valid) {
            http.editIntentionRecord(cunstomerForm, tenantId, id).then(data => {
              if (data.code == 0) {
                this.$message(data.desc);
                this.$router.back(-1);
              } else {
                this.$message(data.desc);
              }
            });
          } else {
            this.$message(`请输入必填信息`);
            return false;
          }
        });
      } else {
        this.pageType = "edit";
      }
    },
    clear() {
      this.cunstomerForm = {};
    },
    removeCustomerInfo() {
      let tenantId = this.tenantId;
      let id = this.id;
      this.$confirm("此操作将永久删除该沟通记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          http.deleteRecord(tenantId, id).then(data => {
            if (data.code == 0) {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.$router.back(-1);
            } else {
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
    width: 148px;
    height: 148px;
    line-height: 148px;
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
