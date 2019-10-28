<template>
  <div id="addExchangeRecords">
    <div class="add_title">
      <el-button size="mini" type="primary" icon="el-icon-back" @click="$router.go(-1)">返回</el-button>
      <p>新增员工</p>
    </div>
    <div class="addForm">
      <el-form
        :model="staffForm"
        :rules="rules"
        label-position="right"
        class="demo-form-inline"
        ref="staffForm"
        label-width="auto"
      >
        <el-form-item label="姓名：">
          <el-input
            v-model="staffForm.name"
            size="mini"
            placeholder="请输入姓名"
            :disabled="pageType=='detail'?true:false"
          ></el-input>
        </el-form-item>
        <el-form-item label="手机号：">
          <el-input
            v-model="staffForm.mobile"
            size="small"
            placeholder="请输入手机号"
            :disabled="pageType=='detail'?true:false"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码：">
          <el-input
            v-model="staffForm.password"
            size="small"
            placeholder="请输入密码"
            :disabled="pageType=='detail'?true:false"
          ></el-input>
        </el-form-item>
        <el-form-item label="角色：">
          <el-select
            multiple
            v-model="staffForm.role"
            size="small"
            placeholder="请选择角色"
            :disabled="pageType=='detail'||staffForm.created?true:false"
          >
            <el-option
              v-for="item in roleList"
              :label="item.description"
              :value="item.name"
              :key="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="员工状态：">
          <el-select
            v-model="staffForm.status"
            size="small"
            placeholder="请选择员工状态"
            :disabled="pageType=='detail'||staffForm.created?true:false"
          >
            <el-option label="启用" value="NORMAL"></el-option>
            <el-option label="停用" value="STOP"></el-option>
          </el-select>
        </el-form-item> -->

        <el-form-item style="margin-top:30px;" v-if="pageType=='add'">
          <el-button size="mini" type="primary" @click="addStaff">确定</el-button>
          <el-button size="mini" type="primary" @click="clear">清空</el-button>
        </el-form-item>
        <el-form-item style="margin-top:30px;" v-else>
          <el-button
            size="small"
            type="primary"
            @click="editStaff"
          >{{pageType=='detail'?'编辑信息':'保存'}}</el-button>
          <!-- 跟列表中的删除一样   删成功之后返回列表   弹个确认是否删除的弹框 -->
          <el-button size="small" type="primary" @click="deleteStaff">删除</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import http from "@/api/deployApi";
export default {
  data() {
    return {
      staffForm: {},
      imageUrl: ``,
      rules: {},
      pageType: "add",
      memberId: ``,
      pageStatus: 1, //0为保存  1为詳情
      roleList: [],
      role: ""
    };
  },
  activated() {
    this.pageStatus = 1;
    console.log(this.$route.query.pageType);
    this.pageType = this.$route.query.pageType;
    if (this.$route.query.staffInfo) {
      let staffInfo = JSON.parse(this.$route.query.staffInfo);
      this.memberId = staffInfo.memberId;
      this.staffForm = {
        role: staffInfo.role, //暂时没作用
        name: staffInfo.name, //员工姓名
        mobile: staffInfo.mobile, //手机号
        password: staffInfo.password, //登录密码
        // status: staffInfo.status //NORMAL-启用，STOP-停用
      };
    }
    this.getRole();
  },
  computed: {
    ...mapState(`user`, [`access_token`, `tenantId`])
  },
  methods: {
    //   上传正面身份证之前
    beforeAvatarUpload(file) {},
    // 上传正面身份证成功
    handleAvatarSuccess() {},
    addStaff() {
      let { staffForm, tenantId } = this;

      http.addStaff(staffForm, tenantId).then(data => {
        if (data.code == 0) {
          this.$message(data.desc);
          this.$router.back(-1);
          this.staffForm = {};
        } else {
          this.$message(data.desc);
        }
      });
    },
    editStaff() {
      this.pageStatus = this.pageStatus == 0 ? 1 : 0;
      let that = this;
      let { staffForm, tenantId, memberId } = this;
      console.log(this.pageStatus);
      if (this.pageStatus == 1) {
        this.pageType = "detail";
        http.editStaff(staffForm, tenantId, memberId).then(data => {
          if (data.code == 0) {
            that.$message(data.desc);
            this.$router.back(-1);
            this.staffForm = {};
          } else {
            that.$message(data.desc);
          }
        });
        //保存修改内容
      } else {
        this.pageType = "edit";
      }
    },
    //查询企业角色
    getRole() {
      http.getRole().then(data => {
        if (data.code == 0) {
          this.roleList = data.data;
        } else {
        }
      });
    },
    clear() {
      this.staffForm = {};
    },
    deleteStaff() {
      let { memberId, tenantId } = this;
      this.$confirm("此操作将永久删除该客户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          http.deleteStaff(tenantId, memberId).then(data => {
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
