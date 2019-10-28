<template>
  <div id="entryRecord">
    <div style="background:#fff">
      <div class="add_title">
        <el-button size="mini" type="primary" icon="el-icon-back" @click="$router.go(-1)">返回</el-button>
        <p>录入租车数据</p>
      </div>
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
        <el-form-item label="租车类型：">
          <el-select v-model="cunstomerForm.region" size="mini" placeholder="请选择租车类型">
            <el-option label="月租" value="shanghai"></el-option>
            <el-option label="日租" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <!-- 必填 -->
        <el-form-item label="车牌号：">
          <el-input v-model="cunstomerForm.user" size="mini" placeholder="请输入车牌号"></el-input>
        </el-form-item>
        <el-form-item label="品牌车型：">
          <el-input v-model="cunstomerForm.model" size="mini" disabled placeholder="根据车牌号自动关联"></el-input>
        </el-form-item>
        <!-- 必填 -->
        <el-form-item label="客户姓名：">
          <el-input v-model="cunstomerForm.user" size="mini" placeholder="请输入客户姓名"></el-input>
        </el-form-item>
        <el-form-item label="客户联系方式：">
          <el-input v-model="cunstomerForm.user" size="mini" disabled placeholder="根据客户姓名自动关联"></el-input>
        </el-form-item>
        <el-form-item label="客户身份证号：">
          <el-input v-model="cunstomerForm.user" size="mini" disabled placeholder="根据客户姓名自动关联"></el-input>
        </el-form-item>
        <el-form-item label="合同模板：">
          <el-select v-model="cunstomerForm.region" size="mini" placeholder="请选择合同模板">
            <el-option label="月租车通用合同" value="shanghai"></el-option>
            <el-option label="日租合同" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <!-- 必填 -->
        <el-form-item label="合同编号：">
          <el-input v-model="cunstomerForm.user" size="mini" placeholder="请输入合同编号"></el-input>
        </el-form-item>
        <!-- 必填 -->
        <el-form-item label="提车日期：" prop="resource">
          <el-date-picker
            size="mini"
            v-model="cunstomerForm.certiDate"
            type="date"
            placeholder="请选择提车日期"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>
        <!-- 必填 -->
        <el-form-item label="合同开始日期：" prop="resource">
          <el-date-picker
            size="mini"
            v-model="cunstomerForm.certiDate"
            type="date"
            placeholder="请选择合同开始日期"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>
        <!-- 必填 -->
        <el-form-item label="合同结束日期：" prop="resource">
          <el-date-picker
            size="mini"
            v-model="cunstomerForm.certiDate"
            type="date"
            placeholder="请选择合同结束日期"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <el-form
        :model="cunstomerForm"
        :rules="rules"
        label-position="right"
        class="demo-form-inline"
        ref="cunstomerForm"
        label-width="auto"
      >
        <el-form-item label="押金（元）：">
          <el-input v-model="cunstomerForm.user" size="mini" placeholder="请输入押金"></el-input>
        </el-form-item>
        <el-form-item label="管理费（元）：">
          <el-input v-model="cunstomerForm.user" size="mini" placeholder="请输入车牌号"></el-input>
        </el-form-item>
        <!-- 租金 -->
        <el-form-item label="租金（元）：">
          <el-input v-model="cunstomerForm.user" size="mini" placeholder="请输入车牌号"></el-input>
        </el-form-item>
        <el-form-item label="签约状态：">
          <el-select v-model="cunstomerForm.region" size="mini" placeholder="请选择准驾车型">
            <el-option label="待签约" value="shanghai"></el-option>
            <el-option label="已签约" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注：">
          <el-input
            type="textarea"
            v-model="cunstomerForm.user"
            rows="5"
            size="mini"
            placeholder="请输入备注信息"
          ></el-input>
        </el-form-item>
        <el-form-item style="margin-top:30px;">
          <el-button size="mini" type="primary">确定</el-button>
          <el-button size="mini" type="primary">清空</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { regionData, CodeToText } from "element-china-area-data";
export default {
  data() {
    return {
      imageUrl: ``,
      cunstomerForm: {
        sex: "0", //0为男   1为女
        certiDate: ``,
        selectedOptions: []
      },
      rules: {},
      options: regionData
    };
  },
  methods: {
    //   上传正面身份证之前
    beforeAvatarUpload(file) {},
    // 上传正面身份证成功
    handleAvatarSuccess() {},
    // 上传反面身份证之前
    beforeBackUpload() {},
    // 上传反面身份证成功
    handleBackSuccess() {},
    // 上传驾驶证照片之前
    beforDriverUpload() {},
    // 上传驾驶证照片成功
    handleDriverSuccess() {},
    handleChange() {}
  }
};
</script>
<style lang="stylus">
#entryRecord {
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
    margin-bottom: 0;

    .el-button {
      // width: 100%;
      // margin-top: 12px;
      // color: #000;
      // font-weight: 600;
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