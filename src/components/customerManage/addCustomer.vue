<template>
  <div id="addCustomer">
    <div class="searchRecord">
      <el-button type="primary" plain icon="el-icon-back" @click="$router.back(-1)">返回</el-button>
      <el-button
        type="primary"
        plain
        icon="el-icon-search"
        @click="getRecord('contractList','签约记录')"
      >查看签约记录</el-button>
    </div>
    <!-- <div style="background:#fff">
      <div class="add_title">
        <el-button size="small" type="primary" icon="el-icon-back" @click="$router.go(-1)">返回</el-button>
        <p>{{pageType=='add'?'新增客户':'客户详情'}}</p>
      </div>
    </div>-->
    <el-tabs
      v-model="editableTabsValue"
      :closable="editableTabsValue=='customerDetail'?false:true"
      type="card"
      @tab-remove="removeTab"
      @tab-click="handleTabsClick"
      v-if="editableTabsValue"
    >
      <el-tab-pane
        :key="item.name"
        v-for="(item) in editableTabs"
        :closable="editableTabsValue=='customerDetail'?false:true"
        :label="item.title"
        :name="item.name"
      ></el-tab-pane>
    </el-tabs>
    <!-- ***********************客户详情****************** -->
    <div v-if="editableTabsValue=='customerDetail'">
      <div class="addForm">
        <el-form
          :model="cunstomerForm"
          :rules="customerRules"
          label-position="right"
          :hide-required-asterisk="true"
          class="demo-form-inline"
          ref="cunstomerForm"
          label-width="auto"
        >
          <el-form-item label="类型：" prop="type">
            <el-select
              v-model="cunstomerForm.type"
              size="small"
              placeholder="请选择客户类型"
              :disabled="pageType=='detail'?true:false"
            >
              <el-option label="个人" value="INDIVIDUAL"></el-option>
              <el-option label="企业" value="ENTERPRISE"></el-option>
            </el-select>
          </el-form-item>
          <!-- **********************客户类型为个人时******************** -->
          <div v-if="cunstomerForm.type=='INDIVIDUAL'">
            <el-form-item label="客户名称：">
              <el-input
                v-model="individual.name"
                size="small"
                placeholder="请输入客户名称"
                :disabled="pageType=='detail'?true:false"
              ></el-input>
            </el-form-item>
            <el-form-item label="身份证照片：">
              <div class="upload-img">
                <el-upload
                  class="avatar-uploader"
                  :action="actions"
                  :data="formData"
                  :show-file-list="false"
                  :on-success="handleCardASuccess"
                  :before-upload="beforeCardAUpload"
                >
                  <img v-if="individual.idA" :src="individual.idA" class="avatar" />
                  <p v-else class="avatar-uploader-icon">
                    <i class="el-icon-plus"></i>
                    <span>正面照片</span>
                  </p>
                </el-upload>
                <el-upload
                  class="avatar-uploader"
                  :action="actions"
                  :data="formData"
                  :show-file-list="false"
                  :on-success="handleCardBSuccess"
                  :before-upload="beforeCardAUpload"
                >
                  <img v-if="individual.idB" :src="individual.idB" class="avatar" />
                  <p v-else class="avatar-uploader-icon">
                    <i class="el-icon-plus"></i>
                    <span>背面照片</span>
                  </p>
                </el-upload>
              </div>
            </el-form-item>
            <el-form-item
              label="性别："
              prop="resource"
              size="small"
              :disabled="pageType=='detail'?true:false"
            >
              <el-radio-group v-model="individual.sex">
                <el-radio label="MALE">男</el-radio>
                <el-radio label="FEMALE">女</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="手机号：">
              <el-input
                v-model="individual.mobile"
                size="small"
                placeholder="请输入手机号"
                :disabled="pageType=='detail'?true:false"
              ></el-input>
            </el-form-item>
            <el-form-item label="身份证号：">
              <el-input
                v-model="individual.idCardNo"
                size="small"
                placeholder="请输入身份证号"
                :disabled="pageType=='detail'?true:false"
              ></el-input>
            </el-form-item>
            <el-form-item label="家庭住址：">
              <el-input
                v-model="individual.homeAddress"
                size="small"
                placeholder="请输入详细地址"
                :disabled="pageType=='detail'?true:false"
              ></el-input>
            </el-form-item>
            <el-form-item label="紧急联系人姓名：">
              <el-input
                v-model="individual.emergencyContactName"
                size="small"
                placeholder="请输入紧急联系人姓名"
                :disabled="pageType=='detail'?true:false"
              ></el-input>
            </el-form-item>
            <el-form-item label="紧急联系人手机号：">
              <el-input
                v-model="individual.emergencyContactMobile"
                size="small"
                placeholder="请输入紧急联系人手机号"
                :disabled="pageType=='detail'?true:false"
              ></el-input>
            </el-form-item>
          </div>
          <!-- *********************88客户类型为企业时 -->
          <div v-else>
            <el-form-item label="公司名称：">
              <el-input
                v-model="enterprise.name"
                size="small"
                placeholder="请输入公司名称"
                :disabled="pageType=='detail'?true:false"
              ></el-input>
            </el-form-item>
            <el-form-item label="联系人：">
              <el-input
                v-model="enterprise.contactName"
                size="small"
                placeholder="请输入联系人姓名"
                :disabled="pageType=='detail'?true:false"
              ></el-input>
            </el-form-item>
            <el-form-item label="身份证照片：">
              <div class="upload-img">
                <el-upload
                  class="avatar-uploader"
                  :action="actions"
                  :data="formData"
                  :show-file-list="false"
                  :on-success="handleCardASuccess"
                  :before-upload="beforeCardAUpload"
                >
                  <img v-if="enterprise.contactIdA" :src="enterprise.contactIdA" class="avatar" />
                  <p v-else class="avatar-uploader-icon">
                    <i class="el-icon-plus"></i>
                    <span>正面照片</span>
                  </p>
                </el-upload>
                <el-upload
                  class="avatar-uploader"
                  :action="actions"
                  :data="formData"
                  :show-file-list="false"
                  :on-success="handleCardBSuccess"
                  :before-upload="beforeCardAUpload"
                >
                  <img v-if="enterprise.contactIdB" :src="enterprise.contactIdB" class="avatar" />
                  <p v-else class="avatar-uploader-icon">
                    <i class="el-icon-plus"></i>
                    <span>背面照片</span>
                  </p>
                </el-upload>
              </div>
            </el-form-item>
            <el-form-item
              label="性别："
              prop="resource"
              size="small"
              :disabled="pageType=='detail'?true:false"
            >
              <el-radio-group v-model="enterprise.contactSex">
                <el-radio label="MALE">男</el-radio>
                <el-radio label="FEMALE">女</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="手机号：">
              <el-input
                v-model="enterprise.contactMobile"
                size="small"
                placeholder="请输入手机号"
                :disabled="pageType=='detail'?true:false"
              ></el-input>
            </el-form-item>
            <el-form-item label="身份证号：">
              <el-input
                v-model="enterprise.contactIdCardNo"
                size="small"
                placeholder="请输入身份证号"
                :disabled="pageType=='detail'?true:false"
              ></el-input>
            </el-form-item>

            <el-form-item label="企业地址：">
              <el-input
                v-model="enterprise.address"
                size="small"
                placeholder="请输入详细地址"
                :disabled="pageType=='detail'?true:false"
              ></el-input>
            </el-form-item>
          </div>
        </el-form>
        <el-form
          :model="cunstomerForm"
          :rules="customerRules"
          label-position="right"
          class="demo-form-inline"
          ref="cunstomerForm"
          label-width="auto"
        >
          <!-- ****************************客户类型为个人时  右侧 -->
          <div v-if="cunstomerForm.type=='INDIVIDUAL'">
            <el-form-item label="驾驶证照片：">
              <!-- TODO 上传图片的路径要改变 -->
              <el-upload
                class="avatar-uploader"
                :action="actions"
                :data="formData"
                :show-file-list="false"
                :on-success="handleDriverSuccess"
                :before-upload="beforeCardAUpload"
              >
                <img
                  v-if="individual.drivingLicensePic"
                  :src="individual.drivingLicensePic"
                  class="avatar"
                />
                <p v-else class="avatar-uploader-icon">
                  <i class="el-icon-plus"></i>
                  <span>选择照片</span>
                </p>
              </el-upload>
            </el-form-item>
            <el-form-item label="准驾车型：">
              <el-select
                v-model="individual.permitClass"
                size="small"
                placeholder="请选择准驾车型"
                :disabled="pageType=='detail'?true:false"
              >
                <el-option
                  v-for="item in permitClassOptions"
                  :label="item.desc"
                  :value="item.code"
                  :key="item.code"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="驾驶证档案编号：">
              <el-input
                v-model="individual.drivingLicenseNo"
                size="small"
                placeholder="请输入驾驶证档案编号"
                :disabled="pageType=='detail'?true:false"
              ></el-input>
            </el-form-item>
            <el-form-item label="初次领证日期：" prop="resource">
              <el-date-picker
                size="small"
                v-model="individual.dateOfFisrtIssue"
                type="date"
                placeholder="请选择领证日期"
                value-format="yyyy-MM-dd"
                :disabled="pageType=='detail'?true:false"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="驾驶证有效日期：" prop="resource">
              <el-date-picker
                v-model="individual.validPeriod"
                size="small"
                type="date"
                placeholder="请选择驾驶证有效日期"
                value-format="yyyy-MM-dd"
                :disabled="pageType=='detail'?true:false"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="负责人：">
              <el-select
                v-model="cunstomerForm.directorMemberId"
                size="small"
                placeholder="请选择负责人"
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
                v-model="cunstomerForm.remarks"
                rows="5"
                size="small"
                placeholder="请输入备注信息"
                :disabled="pageType=='detail'?true:false"
              ></el-input>
            </el-form-item>
          </div>
          <!-- ****************************客户类型为企业时  右侧 -->
          <div v-else>
            <el-form-item label="营业执照图片：">
              <!-- TODO 上传图片的路径要改变 -->
              <el-upload
                class="avatar-uploader"
                :action="actions"
                :data="formData"
                :show-file-list="false"
                :on-success="handleCarSuccess"
                :before-upload="beforeCardAUpload"
              >
                <img
                  v-if="enterprise.businessLicensePic"
                  :src="enterprise.businessLicensePic"
                  class="avatar"
                />
                <p v-else class="avatar-uploader-icon">
                  <i class="el-icon-plus"></i>
                  <span>选择照片</span>
                </p>
              </el-upload>
            </el-form-item>
            <el-form-item>
              <label slot="label">统一社会信用代码：</label>
              <el-input
                v-model="enterprise.uniformCreditCode"
                size="small"
                placeholder="请输入统一社会信用代码"
                :disabled="pageType=='detail'?true:false"
              ></el-input>
            </el-form-item>
            <el-form-item label="负责人：">
              <el-select
                v-model="cunstomerForm.directorMemberId"
                size="small"
                placeholder="请选择负责人"
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
                v-model="cunstomerForm.remarks"
                rows="5"
                size="small"
                placeholder="请输入备注信息"
                :disabled="pageType=='detail'?true:false"
              ></el-input>
            </el-form-item>
          </div>

          <el-form-item style="margin-top:30px;" v-if="pageType=='add'">
            <el-button size="small" type="primary" @click="addCustomer">确定</el-button>
            <el-button size="small" type="primary" @click="clear">清空</el-button>
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
    <!-- ****************************** 车辆记录 *********************** -->
    <keep-alive>
      <component
        v-show="editableTabsValue!==`customerDetail`"
        :is="selectView"
        :customerId="id"
        :q="q"
      ></component>
    </keep-alive>
  </div>
</template>
<script>
// import { regionData, CodeToText } from "element-china-area-data";
import { mapState, mapMutations } from "vuex";
import http from "@/api/customerApi";
import contractList from "@/components/customerManage/contractList";
import deployHttp from "@/api/deployApi";

export default {
  data() {
    return {
      imageUrl: ``,
      cunstomerForm: {
        type: "INDIVIDUAL"
      },
      actions: `http://upload-z1.qiniup.com`,
      formData: { token: "" },
      individual: {
        idA: null,
        idB: null,
        drivingLicensePic: null //驾驶证照片
      }, //个人
      enterprise: {
        contactIdA: null,
        contactIdB: null,
        businessLicensePic: null //营业执照图片URL
      }, //企业
      staffList: [],
      customerRules: {
        type: [
          { required: true, message: "请选择客户类型", trigger: "change" }
        ],
        name: [{ required: true, messgae: "请填写公司名称", trigger: "blur" }]
      },
      permitClassOptions: [],
      // options: regionData,
      pageType: "add",
      pageStatus: 1, //0为保存  1为詳情
      id: 0,
      q: "",
      editableTabsValue: "customerDetail",
      editableTabs: [
        {
          title: "客户信息",
          name: "customerDetail"
        }
      ]
    };
  },
  components: {
    contractList
  },
  activated() {
    console.log(this.$route.query.pageType);
    this.pageStatus = 1;
    this.pageType = this.$route.query.pageType;
    this.editableTabsValue = "customerDetail";
    this.editableTabs = [
      {
        title: "客户信息",
        name: "customerDetail"
      }
    ];
    this.getStaffList();
    if (this.$route.query.customerInfo) {
      let customerInfo = JSON.parse(this.$route.query.customerInfo);
      this.q = this.$route.query.q;
      this.cunstomerForm = {
        type: customerInfo.type,
        directorMemberId: customerInfo.directorMemberId,
        directorName: customerInfo.directorName,
        remarks: customerInfo.remarks
      };
      this.id = customerInfo.id;
      if (customerInfo.enterprise) {
        this.enterprise = customerInfo.enterprise;
        this.individual = {};
      } else {
        this.enterprise = {};
        this.individual = customerInfo.individual;
        this.individual.idA = this.individual.idA ? this.individual.idA : null;
      }
    }
    this.getPermitClass();
  },
  deactivated() {
    this.cunstomerForm = { type: "INDIVIDUAL" };
    this.individual = {};
    this.enterprise = {};
  },
  computed: {
    ...mapState(`user`, [`access_token`, `tenantId`]),
    selectView() {
      return this.editableTabsValue == "contractList" ? "contractList" : "";
    }
  },
  methods: {
    //   上传正面身份证之前

    beforeCardAUpload(file) {
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
    handleCardASuccess(res, file) {
      console.log(res);
      if (this.cunstomerForm.type == "INDIVIDUAL") {
        this.individual.idA = res.payload.url;
        this.$message(`上传成功`);
      } else {
        this.enterprise.contactIdA = res.payload.url;
      }
    },
    // 上传反面身份证成功
    handleCardBSuccess(res, file) {
      console.log(res);
      if (this.cunstomerForm.type == "INDIVIDUAL") {
        this.individual.idB = res.payload.url;
        this.$message(`上传成功`);
      } else {
        this.enterprise.contactIdB = res.payload.url;
      }
    },
    // 上传驾驶证照片成功
    handleDriverSuccess(res, file) {
      console.log(res);
      this.individual.drivingLicensePic = res.payload.url;
      this.$message(`上传成功`);
    },
    //上传营业执照照片
    handleCarSuccess(res, file) {
      console.log(res);
      this.enterprise.businessLicensePic = res.payload.url;
      this.$message(`上传成功`);
    },
    handleTabsClick() {},
    getRecord(name, title) {
      this.editableTabsValue = name;
      let index = this.editableTabs.findIndex(item => item.name === name);
      if (index !== -1) {
        this.editableTabsValue = name;
      } else {
        this.editableTabs.push({
          title: title,
          name: name
        });
        this.editableTabsValue = name;
      }
    },
    getStaffList() {
      // TODO   员工需要修改
      let params = { page: 1, size: 20 };
      let qArr = ["com_salesman", "com_admin"];
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
      this.cunstomerForm.directorName = roleInfo.name;
    },
    removeTab(targetName) {
      console.log(targetName);
      let tabs = this.editableTabs;
      let activeName = this.editableTabsValue;
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            let nextTab = tabs[index + 1] || tabs[index - 1];
            if (nextTab) {
              activeName = nextTab.name;
            }
          }
        });
      }

      this.editableTabsValue = activeName;
      this.editableTabs = tabs.filter(tab => tab.name !== targetName);
    },
    editCustomer() {
      this.pageStatus = this.pageStatus == 0 ? 1 : 0;
      console.log(this.pageStatus);
      let { cunstomerForm, individual, enterprise, tenantId, id } = this;
      let params = {};
      let that = this;
      if (this.pageStatus == 1) {
        this.pageType = "detail";
        if (this.cunstomerForm.type == "ENTERPRISE") {
          //如果类型是企业的话
          params = {
            type: cunstomerForm.type,
            directorMemberId: cunstomerForm.directorMemberId,
            directorName: cunstomerForm.directorName,
            remarks: cunstomerForm.remarks,
            enterprise
          };
        } else {
          //如果类型是个人的话
          params = {
            type: cunstomerForm.type,
            directorMemberId: cunstomerForm.directorMemberId,
            directorName: cunstomerForm.directorName,
            remarks: cunstomerForm.remarks,
            individual
          };
        }
        http.editCustomer(params, tenantId, id).then(data => {
          console.log(data);
          if (data.code == 0) {
            that.$message(data.desc);
            that.$router.back(-1);
            this.pageStatus = 0;
          } else {
            that.$message(data.desc);
          }
        });
        //保存修改内容
      } else {
        this.pageType = "edit";
      }
    },
    //新增客户
    addCustomer() {
      let { cunstomerForm, individual, enterprise, tenantId } = this;
      let params = {};
      let that = this;
      if (this.cunstomerForm.type == "ENTERPRISE") {
        //如果类型是企业的话
        params = {
          type: cunstomerForm.type,
          directorMemberId: cunstomerForm.directorMemberId,
          directorName: cunstomerForm.directorName,
          remarks: cunstomerForm.remarks,
          enterprise
        };
      } else {
        //如果类型是个人的话
        params = {
          type: cunstomerForm.type,
          directorMemberId: cunstomerForm.directorMemberId,
          directorName: cunstomerForm.directorName,
          remarks: cunstomerForm.remarks,
          individual
        };
      }
      http.addCustomer(params, tenantId).then(data => {
        console.log(data);
        if (data.code == 0) {
          that.$message(data.desc);
          that.$router.back(-1);
        } else {
          that.$message(data.desc);
        }
      });
    },
    //删除客户
    removeCustomerInfo() {
      let { tenantId, id } = this;
      this.$confirm("此操作将永久删除该客户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          http.deleteCustomer(tenantId, id).then(data => {
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
    },
    getPermitClass() {
      http.getPermitClass().then(data => {
        if (data.code == 0) {
          this.permitClassOptions = data.data;
        }
      });
    },
    clear() {
      console.log(`ss`);
      this.cunstomerForm = { type: "INDIVIDUAL" };
      this.individual = {};
      this.enterprise = {};
    },
    ...mapMutations(`user`, [`clearToken`])
  }
};
</script>
<style lang="stylus">
#addCustomer {
  margin: 0 24px;

  .searchRecord {
    background: #fff;
    margin-bottom: 12px;
    padding: 24px;
  }

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