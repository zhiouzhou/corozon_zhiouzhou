<template>
  <div id="addExchangeRecords">
    <div class="add_title">
      <!-- <el-button size="mini" type="primary" icon="el-icon-back" @click="$router.go(-1)">返回</el-button> -->
      <p>公司配置</p>
    </div>
    <div class="addForm">
      <el-form
        :model="companyForm"
        :rules="rules"
        label-position="right"
        class="demo-form-inline"
        ref="companyForm"
        label-width="auto"
      >
        <el-form-item label="公司名称：">
          <el-input v-model="companyForm.name" size="mini" placeholder="请输入客户姓名"></el-input>
        </el-form-item>
        <el-form-item label="公司地址：" prop="selectedOptions">
          <el-select
            v-model="companyForm.address.province"
            placeholder="请选择省"
            size="small"
            @change="selectProvince"
            :clearable="true"
          >
            <el-option
              v-for="item in provinceOptions"
              :key="item.id"
              :label="item.areaName"
              :value="item.areaName"
            ></el-option>
          </el-select>
          <el-select
            v-model="companyForm.address.city"
            placeholder="请选择市"
            size="small"
            @change="selectCity"
            :clearable="true"
          >
            <el-option
              v-for="item in CityOptions"
              :key="item.id"
              :label="item.areaName"
              :value="item.areaName"
              :clearable="true"
            ></el-option>
          </el-select>
          <el-select v-model="companyForm.address.district" placeholder="请选择区" size="small">
            <el-option
              v-for="item in districtOptions"
              :key="item.id"
              :label="item.areaName"
              :value="item.areaName"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="详细地址：">
          <el-input v-model="companyForm.address.detailed" size="small" placeholder="请输入详细地址"></el-input>
        </el-form-item>
        <el-form-item label="纬度：">
          <el-input v-model="companyForm.address.latitude" size="small" placeholder="纬度" disabled></el-input>
          <el-button type="primary" size="small" @click="selectAddress">选择位置</el-button>
        </el-form-item>
        <el-form-item label="经度：">
          <el-input v-model="companyForm.address.longitude" size="small" placeholder="经度" disabled></el-input>
        </el-form-item>
        <el-form-item label="联系人：">
          <el-input v-model="companyForm.contact.contactName" size="mini" placeholder="请输入联系人"></el-input>
        </el-form-item>
        <el-form-item label="联系电话：">
          <el-input v-model="companyForm.contact.contactMobile" size="mini" placeholder="请输入联系电话"></el-input>
        </el-form-item>
        <el-form-item label="公司简介：">
          <el-input
            type="textarea"
            v-model="companyForm.briefIntroduction"
            rows="5"
            size="mini"
            placeholder="请输入公司简介"
          ></el-input>
        </el-form-item>
        <el-form-item label="车辆租赁声明：">
          <el-input
            type="textarea"
            v-model="companyForm.leaseStatement"
            rows="5"
            size="mini"
            placeholder="请输入车辆租赁说明"
          ></el-input>
        </el-form-item>

        <el-form-item label="公司图片：">
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
            <img v-if="companyForm.picture" :src="companyForm.picture" class="avatar" />
            <p v-else class="avatar-uploader-icon">
              <i class="el-icon-plus"></i>
              <span>选择照片</span>
            </p>
          </el-upload>
        </el-form-item>

        <el-form-item style="margin-top:30px;">
          <el-button size="mini" type="primary" @click="editCompany">确定</el-button>
          <!-- <el-button size="mini" type="primary">清空</el-button> -->
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { regionData, CodeToText } from "element-china-area-data";
import { mapState, mapMutations } from "vuex";
import http from "@/api/deployApi";
import deployHttp from "@/api/deployApi";
export default {
  data() {
    return {
      companyForm: {
        address: {},
        contact: {},
        picture: ""
      },
      actions: `http://upload-z1.qiniup.com`,
      formData: { token: "" },
      uploadLoading: false,
      imageUrl: ``,
      rules: {},
      addressDetail: ``,
      options: regionData,
      provinceOptions: [],
      CityOptions: [],
      districtOptions: []
    };
  },
  created() {
    this.getCompanyInfo();
  },
  activated() {
    if (this.$route.query.addressInfo) {
      let addressInfo = JSON.parse(this.$route.query.addressInfo);
      this.companyForm.address.latitude = addressInfo.lat;
      this.companyForm.address.longitude = addressInfo.lng;
    }
    this.getProvince();
  },
  computed: {
    ...mapState(`user`, [`access_token`, `tenantId`])
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
      });
    },

    // 上传正面身份证成功
    handleDravelSuccess(res) {
      console.log(res);
      this.uploadLoading = false;
      this.$message(`上传成功`);
      this.companyForm.picture = res.payload.url;
    },
    //上传失败
    uploadError(error) {
      console.log(error);
      this.$message(`上传失败`);
      this.uploadLoading = false;
    },
    selectAddress() {
      this.$router.push({ name: `selectAddress` });
    },
    //查询省列表
    getProvince() {
      http.getProvince().then(data => {
        if (data.code == 0) {
          this.provinceOptions = data.data;
        }
      });
    },
    //选中省列表 查询市
    selectProvince(value) {
      console.log(value);
      let provinceOptions = this.provinceOptions;
      let selectProvinceOptions = provinceOptions.filter(item => {
        return item.areaName == value;
      });
      console.log(selectProvinceOptions);
      let selectId = selectProvinceOptions[0].id;
      this.getCity(selectId);
    },
    //根据省Id查询市列表
    getCity(parentId) {
      let params = { parentId };
      http.getCity(params).then(data => {
        if (data.code == 0) {
          this.CityOptions = data.data;
        }
      });
    },
    //选中市列表 查询县区
    selectCity(value) {
      console.log(value);
      let cityOptions = this.CityOptions;
      let selectCityOptions = cityOptions.filter(item => {
        return item.areaName == value;
      });
      console.log(selectCityOptions);
      let selectId = selectCityOptions[0].id;
      this.getDistricts(selectId);
    },
    //根据市id查询县列表
    getDistricts(parentId) {
      let params = { parentId };
      http.getDistricts(params).then(data => {
        if (data.code == 0) {
          this.districtOptions = data.data;
        }
      });
    },
    //查询企业信息
    getCompanyInfo() {
      let tenantId = this;
      http.getCompanyInfo(tenantId).then(data => {
        if (data.code == 0) {
          this.companyForm = data.data;
          if (this.companyForm.address == null) {
            this.companyForm.address = {};
            this.addressDetail =
              this.companyForm.address.province +
              this.companyForm.address.city +
              this.companyForm.address.county;
          }
          if (this.companyForm.contact == null) {
            this.companyForm.contact = {};
          }
        } else {
          this.$message(data.desc);
        }
      });
    },
    handleChange(value) {
      console.log(value);
      let data =
        CodeToText[value[0]] +
        ", " +
        CodeToText[value[1]] +
        ", " +
        CodeToText[value[2]];
      this.companyForm.address.province = CodeToText[value[0]];
      this.companyForm.address.city = CodeToText[value[1]];
      this.companyForm.address.district = CodeToText[value[2]];
      this.addressDetail = data;
      console.log(data);
    },
    //修改企业名
    editCompany() {
      let params = this.companyForm;
      let tenantId = this.tenantId;
      http.editCompany(params, tenantId).then(data => {
        if (data.code == 0) {
          this.$message(data.desc);
          this.getCompanyInfo();
        } else {
          this.$message(data.desc);
        }
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

  .el-loading-mask {
    width: 120px !important;
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
