<template>
  <div id="addCustomer">
    <div class="searchRecord">
      <el-button type="primary" icon="el-icon-back" @click="$router.back(-1)">返回</el-button>
      <el-button
        type="primary"
        plain
        icon="el-icon-search"
        @click="getRecord('checkCar','验车记录')"
      >查看验车记录</el-button>
      <el-button
        type="primary"
        plain
        icon="el-icon-search"
        @click="getRecord('changeCar','换车记录')"
      >查看换车记录</el-button>
      <el-button
        type="primary"
        plain
        icon="el-icon-search"
        @click="getRecord('repairCar','维修记录')"
      >查看维修记录</el-button>
      <el-button
        type="primary"
        plain
        icon="el-icon-search"
        @click="getRecord('beInDanger','出险记录')"
      >查看出险记录</el-button>
      <el-button
        type="primary"
        plain
        icon="el-icon-search"
        @click="getRecord('maintainCar','保养记录')"
      >查看保养记录</el-button>
    </div>
    <!-- <div style="background:#fff">
      <div class="add_title">
        <el-button size="mini" type="primary" icon="el-icon-back" @click="$router.go(-1)">返回</el-button>
        <p>{{pageType=='add'?'新增车辆':'车辆详情'}}</p>
      </div>
    </div>-->
    <el-tabs
      v-model="editableTabsValue"
      :closable="editableTabsValue=='carDetail'?false:true"
      type="card"
      @tab-remove="removeTab"
      @tab-click="handleTabsClick"
    >
      <el-tab-pane
        :key="item.name"
        v-for="(item) in editableTabs"
        :closable="editableTabsValue=='carDetail'?false:true"
        :label="item.title"
        :name="item.name"
      ></el-tab-pane>
    </el-tabs>
    <!-- ******************************* 车辆详情 ********************* -->
    <div v-show="editableTabsValue=='carDetail'">
      <div class="addForm">
        <el-row :gutter="60">
          <el-col :span="12" :xl="8">
            <!-- <div class="grid-content bg-purple"></div> -->
            <el-form
              key="carForm1"
              :model="carForm"
              :rules="rules"
              label-position="right"
              class="demo-form-inline"
              ref="carForm1"
              label-width="auto"
            >
              <el-form-item label="车牌号：" prop="licensePlate">
                <el-input
                  v-model="carForm.licensePlate"
                  size="mini"
                  placeholder="请输入车牌号"
                  :disabled="pageType=='detail'?true:false"
                ></el-input>
              </el-form-item>
              <el-form-item label="品牌车型：" prop="vehicleModel">
                <el-select
                  v-model="carForm.vehicleModel"
                  size="mini"
                  placeholder="请选择品牌车型"
                  :disabled="pageType=='detail'?true:false"
                >
                  <el-option
                    v-for="item in carModelList"
                    :key="item.id"
                    :label="item.brand+'-'+item.model"
                    :value="item.id"
                  ></el-option>
                </el-select>
                <el-button type="primary" size="mini" @click="addVehicleType">添加车型</el-button>
              </el-form-item>
              <el-form-item label="车身颜色：" prop="bodyColor">
                <el-autocomplete
                  popper-class="my-autocomplete"
                  v-model="carForm.bodyColor"
                  :fetch-suggestions="querySearch"
                  placeholder="请选择或输入车身颜色"
                  @select="handleSelect"
                  size="mini"
                >
                  <template slot-scope="{item}">
                    <div class="name">{{ item }}</div>
                  </template>
                </el-autocomplete>
              </el-form-item>
              <el-form-item label="行驶证照片：">
                <!-- TODO 上传图片的路径要改变 -->
                <el-upload
                  class="avatar-uploader"
                  :action="actions"
                  :data="formData"
                  :show-file-list="false"
                  :on-success="handleCarSuccess"
                  :before-upload="beforeCarUpload"
                >
                  <img v-if="carForm.driverLicense" :src="driverLicenseUrl" class="avatar" />
                  <p v-else class="avatar-uploader-icon">
                    <i class="el-icon-plus"></i>
                    <span>选择照片</span>
                  </p>
                </el-upload>
              </el-form-item>
              <el-form-item label="车架号：" prop="vin">
                <el-input
                  v-model="carForm.vin"
                  size="mini"
                  placeholder="请输入车架号"
                  :disabled="pageType=='detail'?true:false"
                ></el-input>
              </el-form-item>
              <el-form-item label="发动机号：" prop="engineNo">
                <el-input
                  v-model="carForm.engineNo"
                  size="mini"
                  placeholder="请输入发动机号"
                  :disabled="pageType=='detail'?true:false"
                ></el-input>
              </el-form-item>
              <el-form-item label="注册日期：" prop="registrationDate">
                <el-date-picker
                  size="mini"
                  v-model="carForm.registrationDate"
                  type="datetime"
                  placeholder="请选择注册日期"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  :disabled="pageType=='detail'?true:false"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="档案编号：" prop="fileNo">
                <el-input
                  v-model="carForm.fileNo"
                  size="mini"
                  placeholder="请输入档案编号"
                  :disabled="pageType=='detail'?true:false"
                ></el-input>
              </el-form-item>
              <el-form-item label="车辆状态：">
                <el-select
                  v-model="carForm.operStatus"
                  size="mini"
                  placeholder="请选择车辆状态"
                  :disabled="pageType=='detail'?true:false"
                >
                  <el-option
                    v-for="item in operStatusOptions"
                    :key="item.status"
                    :label="item.label"
                    :value="item.status"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="所属公司：">
                <el-input
                  v-model="carForm.companyName"
                  size="mini"
                  placeholder="请输入所属公司"
                  :disabled="pageType=='detail'?true:false"
                ></el-input>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="12">
            <!-- <div class="grid-content bg-purple"></div> -->
            <el-form
              key="carForm2"
              :model="carForm"
              label-position="right"
              class="demo-form-inline"
              ref="carForm2"
              label-width="auto"
            >
              <el-form-item label="实际车主：">
                <el-input
                  v-model="carForm.ownerName"
                  size="mini"
                  placeholder="请输入实际车主"
                  :disabled="pageType=='detail'?true:false"
                ></el-input>
              </el-form-item>
              <el-form-item label="车主电话：">
                <el-input
                  v-model="carForm.ownerPhone"
                  size="mini"
                  placeholder="请输入车主电话"
                  :disabled="pageType=='detail'?true:false"
                ></el-input>
              </el-form-item>
              <el-form-item label="车主身份证号：">
                <el-input
                  v-model="carForm.cardId"
                  size="mini"
                  placeholder="请输入车主身份证号"
                  :disabled="pageType=='detail'?true:false"
                ></el-input>
              </el-form-item>
              <el-form-item label="车辆照片：">
                <!-- TODO 上传图片的路径要改变 -->
                <el-upload
                  class="avatar-uploader"
                  list-type="picture-card"
                  :action="actions"
                  :data="formData"
                  :show-file-list="true"
                  :file-list="imageUrl"
                  :on-success="handleDravelSuccess"
                  :before-upload="beforeDravelUpload"
                  :on-remove="handleCarRemove"
                >
                  <!-- <img v-if="imageUrl" :src="imageUrl" class="avatar" /> -->
                  <p class="avatar-uploader-icon">
                    <i class="el-icon-plus"></i>
                    <span>选择照片</span>
                  </p>
                </el-upload>
              </el-form-item>
              <el-form-item label="负责人：">
                <el-select
                  v-model="carForm.managerId"
                  size="mini"
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
                  v-model="carForm.remarks"
                  rows="5"
                  size="mini"
                  placeholder="请输入备注信息"
                  :disabled="pageType=='detail'?true:false"
                ></el-input>
              </el-form-item>
              <el-form-item style="margin-top:30px;" v-if="pageType=='add'">
                <el-button size="mini" type="primary" @click="addCar">确定</el-button>
                <el-button size="mini" type="primary" @click="clear">清空</el-button>
              </el-form-item>
              <el-form-item style="margin-top:30px;" v-else>
                <el-button
                  size="small"
                  type="primary"
                  @click="editCustomer"
                >{{pageType=='detail'?'编辑信息':'保存'}}</el-button>
                <!-- 跟列表中的删除一样   删成功之后返回列表   弹个确认是否删除的弹框 -->
                <el-button size="small" type="primary" @click="deleteCar">删除</el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </div>
      <p
        style="padding:20px;background:#fff;font-size:14px;margin:0;border-bottom:1px solid #eaeaea;"
        v-if="priceStatus"
      >出租参考价格：</p>
      <div class="addForm" v-if="priceStatus" style="margin-top:0;">
        <el-form
          :model="priceForm"
          :rules="rules"
          label-position="right"
          class="demo-form-inline"
          ref="priceForm"
          label-width="auto"
        >
          <el-form-item label="日租价格：">
            <el-input
              v-model="priceForm.dailyRent"
              size="mini"
              placeholder="请输入日租价格"
              :disabled="pageType=='detail'?true:false"
            ></el-input>
          </el-form-item>
          <el-form-item label="月租价格：">
            <el-input
              v-model="priceForm.monthRent"
              size="mini"
              placeholder="请输入月组价格"
              :disabled="pageType=='detail'?true:false"
            ></el-input>
          </el-form-item>
          <el-form-item label="日租押金：">
            <el-input
              v-model="priceForm.dailyDeposit"
              size="mini"
              placeholder="请输入日租押金"
              :disabled="pageType=='detail'?true:false"
            ></el-input>
          </el-form-item>
          <el-form-item label="月租押金：">
            <el-input
              v-model="priceForm.monthDeposit"
              size="mini"
              placeholder="请输入月租押金"
              :disabled="pageType=='detail'?true:false"
            ></el-input>
          </el-form-item>
          <el-form-item label="租赁模式：">
            <el-select
              v-model="priceForm.lease_model"
              size="mini"
              placeholder="请选择租赁模式"
              :disabled="pageType=='detail'?true:false"
            >
              <el-option label="日租" value="1"></el-option>
              <el-option label="月租" value="2"></el-option>
              <el-option label="日租、月租" value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="最小月数：">
            <el-input
              v-model="priceForm.minMonth"
              size="mini"
              placeholder="请输入最小月数"
              :disabled="pageType=='detail'?true:false"
            ></el-input>
          </el-form-item>
          <el-form-item label="最小天数：">
            <el-input
              v-model="priceForm.minDay"
              size="mini"
              placeholder="请输入最小天数"
              :disabled="pageType=='detail'?true:false"
            ></el-input>
          </el-form-item>
          <el-form-item style="margin-top:30px;" v-if="pageType=='add'">
            <el-button size="mini" type="primary" @click="addPrice">确定</el-button>
            <el-button size="mini" type="primary" @click="clearPrice">清空</el-button>
          </el-form-item>
          <el-form-item style="margin-top:30px;" v-else>
            <el-button
              size="small"
              type="primary"
              @click="editPrice"
            >{{pageType=='detail'?'编辑信息':'保存'}}</el-button>
            <!-- 跟列表中的删除一样   删成功之后返回列表   弹个确认是否删除的弹框 -->
            <el-button size="small" type="primary" @click="deletePrice">删除参考价格</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <!-- ****************************** 车辆记录 *********************** -->
    <keep-alive>
      <component v-show="editableTabsValue!==`carDetail`" :is="selectView" :plate="licensePlate"></component>
    </keep-alive>
  </div>
</template>
<script>
import { regionData, CodeToText } from "element-china-area-data";
import { mapState, mapMutations } from "vuex";
import http from "@/api/carApi";
import deployHttp from "@/api/deployApi";

import checkCar from "@/components/carManageComponents/checkCar";
import changeCar from "@/components/carManageComponents/changeCar";
import repairCar from "@/components/carManageComponents/repairCar";
import beInDanger from "@/components/carManageComponents/beInDanger";
import maintainCar from "@/components/carManageComponents/maintainCar";
import https from "@/api/deployApi";
export default {
  data() {
    return {
      imageUrl: [],
      staffList: [],
      driverLicenseUrl: "",
      carForm: {
        borrowStatus: 0,
        driverLicense: null, //行驶证照片
        pictures: [] //车辆照片
      },
      formArr: ["carForm1", "carForm2"],
      resultArr: [], //接受验证返回结果数组
      restaurants: ["白色", "黑色", "蓝色", "灰色", "红色", "绿色"],
      actions: `http://upload-z1.qiniup.com`,
      formData: { token: "" },
      operStatusOptions: [
        { status: 0, label: "停止运营" },
        { status: 1, label: "待运营" },
        { status: 2, label: "待租" },
        { status: 3, label: "已出租" },
        { status: 4, label: "换车中" },
        { status: 5, label: "维修中" },
        { status: 6, label: "待出库" }
      ],
      carModelList: [],
      rules: {
        licensePlate: [
          { required: true, message: "请输入车牌号", trigger: "blur" }
        ],
        vehicleModel: [
          { required: true, message: "请选择品牌车型", trigger: "change" }
        ],
        bodyColor: [
          { required: true, message: "请选择车身颜色", trigger: "change" }
        ],
        vin: [{ required: true, message: "请输入车架号", trigger: "blur" }],
        engineNo: [
          { required: true, message: "请输入发动机号", trigger: "blur" }
        ],
        registrationDate: [
          { required: true, message: "请选择注册日期", trigger: "change" }
        ],
        fileNo: [{ required: true, message: "请输入档案编号", trigger: "blur" }]
      },
      options: regionData,
      pageType: "add",
      pageStatus: 1, //0为保存  1为詳情
      licensePlate: "",
      priceStatus: false, //参考价格表单状态
      priceForm: {},
      newPrice: {}, //记录原始数据
      diffData: null, //记录修改过程的值
      pricePageStatus: 1,
      priceId: ``,
      editableTabsValue: "carDetail",
      editableTabs: [
        {
          title: "车辆信息",
          name: "carDetail"
        }
      ]
    };
  },
  computed: {
    ...mapState(`user`, [`access_token`, `tenantId`, `userInfo`]),
    selectView() {
      return this.editableTabsValue == "checkCar"
        ? "checkCar"
        : this.editableTabsValue == "changeCar"
        ? "changeCar"
        : this.editableTabsValue == "repairCar"
        ? "repairCar"
        : this.editableTabsValue == "beInDanger"
        ? "beInDanger"
        : this.editableTabsValue == "maintainCar"
        ? "maintainCar"
        : "";
    }
  },
  components: {
    checkCar,
    changeCar,
    repairCar,
    beInDanger,
    maintainCar
  },
  activated() {
    console.log(this.$route.query.pageType);
    this.pageType = this.$route.query.pageType;
    this.pageStatus = 1;
    this.pricePageStatus = 1;
    this.editableTabsValue = "carDetail";
    this.carForm.companyName = this.userInfo.company.companyName;
    this.carForm.companyId = this.userInfo.company.tenantId;
    this.editableTabs = [
      {
        title: "车辆信息",
        name: "carDetail"
      }
    ];
    this.getStaffList();
    if (this.$route.query.licensePlate) {
      this.licensePlate = this.$route.query.licensePlate;
      this.priceStatus = true;
      this.getCarInfo();
      this.getPrice();
    }
    this.getCarModelList();
  },
  deactivated() {
    this.carForm = {};
  },
  methods: {
    querySearch(queryString, cb) {
      var restaurants = this.restaurants;
      var results = queryString
        ? restaurants.filter(this.createFilter(queryString))
        : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return restaurant => {
        return (
          restaurant.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        );
      };
    },
    // loadAll() {
    //   return
    // },
    handleSelect(ev) {
      console.log(ev);
      this.carForm.bodyColor = ev;
    },
    //   上传车辆照片成功之前
    beforeDravelUpload(file) {
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
        _this.carForm.pictures.push(data.data.key);
      });
    },

    // 上传车辆照片成功
    handleDravelSuccess(res, file) {
      console.log(res);
      this.$message(`上传成功`);
      this.imageUrl.push({ url: res.payload.url });
    },
    //删除车辆图片
    handleCarRemove(file, fileList) {
      console.log(file);
      console.log(fileList);
    },
    // 上传驾驶证照片
    beforeCarUpload(file) {
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
        _this.carForm.driverLicense = data.data.key;
      });
    },

    handleCarSuccess(res) {
      console.log(res);
      this.$message(`上传成功`);
      this.driverLicenseUrl = res.payload.url;
    },
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
    handleTabsClick() {},
    getStaffList() {
      // TODO   员工需要修改
      let params = { page: 1, size: 20 };
      let qArr = ["com_motor_manager", "com_admin"];
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
      this.carForm.managerName = roleInfo.name;
    },
    //查询品牌车型列表
    getCarModelList() {
      let tenantId = this.tenantId;
      let page = 1,
        size = 0;
      let params = {};
      https.getVehicleTypeList(params, tenantId, page, size).then(data => {
        if (data.code == 0) {
          this.carModelList = data.data;
        }
      });
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
    addCar() {
      let { carForm, tenantId } = this;
      //每次提交前重置验证返回结果的数组
      this.resultArr = [];
      let that = this;
      this.formArr.forEach((item, index) => {
        //根据表单的ref校验
        this.refForm(item);
      });
      Promise.all(this.resultArr)
        .then(() => {
          http.addCar(carForm, tenantId).then(data => {
            console.log(data);
            if (data.code == 0) {
              this.$message(`新增车辆成功`);
              // this.$router.back(-1);
              this.priceStatus = true;
            } else {
              this.$message(data.desc);
            }
          });
        })
        .catch(data => {
          //验证失败 提示reject失败状态的值
          that.$message.error(data);
        });
    },
    clear() {
      this.carForm = {
        borrowStatus: 0,
        driverLicense: "ass2324241", //行驶证照片
        pictures: ["sfsf23423423", "fsf2412424"] //车辆照片
      };
    },
    //查询车辆详情
    getCarInfo() {
      let params = { licensePlate: this.licensePlate };
      let tenantId = this.tenantId;
      http.getCarInfo(params, tenantId).then(data => {
        console.log(data.data);
        let carInfo = data.data;
        let pictures = [];
        carInfo.pictures.forEach(item => {
          return pictures.push(item.picKey);
        });
        console.log(pictures);
        this.carForm = {
          licensePlate: carInfo.licensePlate,
          vehicleModel: carInfo.vehicleModel.id,
          bodyColor: carInfo.bodyColor,
          vin: carInfo.vin,
          engineNo: carInfo.engineNo,
          registrationDate: carInfo.registrationDate,
          fileNo: carInfo.fileNo,
          operStatus: carInfo.vehicleStatus.operStatus,
          companyName: carInfo.company.companyName,
          ownerName: carInfo.owner.ownerName,
          ownerPhone: carInfo.owner.ownerPhone,
          cardId: carInfo.owner.cardId,
          managerName: carInfo.managerName,
          remarks: carInfo.remarks,
          borrowStatus: 0,
          driverLicense: carInfo.driverLicense, //行驶证照片
          pictures: pictures //车辆照片
        };
      });
    },
    editCustomer() {
      console.log(`aaa`);
      this.pageStatus = this.pageStatus == 0 ? 1 : 0;
      let { carForm, tenantId } = this;
      let that = this;
      // this.pageType = this.pageStatus == 0 ? "detail" : "edit";
      if (this.pageStatus == 1) {
        this.pageType = "detail";
        http.editCar(carForm, tenantId).then(data => {
          if (data.code == 0) {
            that.$message(`修改成功`);
            // that.$router.back(-1);
          } else {
            that.$message(data.desc);
          }
        });
        //保存修改内容
      } else {
        this.pageType = "edit";
      }
    },
    addVehicleType() {
      this.$router.push({ name: "addVehicleType", query: { pageType: "add" } });
    },
    deleteCar() {
      let { licensePlate, tenantId } = this;
      let that = this;
      this.$confirm("此操作将永久删除该条数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          http.deleteCar(tenantId, licensePlate).then(data => {
            if (data.code == 0) {
              that.$message(`删除成功`);
              that.$router.back(-1);
            } else {
              that.$message(data.desc);
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
    //查询参考价格
    getPrice() {
      let params = { licensePlate: this.licensePlate };
      let tenantId = this.tenantId;
      http.getPrice(params, tenantId).then(data => {
        if (data.code == 0) {
          this.priceId = data.data.id;
          this.priceForm = {
            dailyRent: data.data.dailyRent,
            monthRent: data.data.monthRent,
            dailyDeposit: data.data.dailyDeposit,
            monthDeposit: data.data.monthDeposit,
            lease_model: data.data.leaseModel,
            minMonth: data.data.minMonth,
            minDay: data.data.minDay
          };
          this.newPrice = {
            // clone 一份数据 当做原始数据
            dailyRent: data.data.dailyRent,
            monthRent: data.data.monthRent,
            dailyDeposit: data.data.dailyDeposit,
            monthDeposit: data.data.monthDeposit,
            lease_model: data.data.leaseModel,
            minMonth: data.data.minMonth,
            minDay: data.data.minDay
          };
        } else {
          this.priceForm = {};
          // this.licensePlate = ``
        }
      });
    },
    //比较数据
    diffDevinfo() {
      for (let k in this.newPrice) {
        if (this.newPrice[k] != this.priceForm[k]) {
          if (!this.diffData) {
            this.diffData = {};
          }
          this.diffData[k] = this.priceForm[k];
          // this.diffData['licensePlate'] = this.licensePlate
        }
      }
    },
    //添加参考价格
    addPrice() {
      let params = this.priceForm;
      params.licensePlate = this.carForm.licensePlate;
      let tenantId = this.tenantId;
      http.addPrice(params, tenantId).then(data => {
        if (data.code == 0) {
          this.$message(`新增成功`);
          this.$router.back(-1);
        }
      });
    },
    //修改价格
    editPrice() {
      console.log(`aaa`);
      this.pageStatus = this.pageStatus == 0 ? 1 : 0;
      let { priceForm, tenantId } = this;

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
          this.diffData.licensePlate = this.licensePlate;
        }
        let params = !this.diffData ? priceForm : this.diffData;
        // params.licensePlate = this.licensePlate
        priceForm.licensePlate = this.licensePlate;
        http.editPrice(params, tenantId).then(data => {
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
    //删除价格
    deletePrice() {
      let { tenantId, priceId } = this;
      let that = this;
      this.$confirm("此操作将永久删除该条数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          http.deletePrice(tenantId, priceId).then(data => {
            if (data.code == 0) {
              that.$message(`删除成功`);
              that.$router.back(-1);
            } else {
              that.$message(data.desc);
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
    //清空参考价格
    clearPrice() {
      this.priceForm = {};
    }
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
    // color: #FFF;
    // background-color: #1890ff;
    // border-color: #1890ff;
  }

  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    margin-right: 24px;
    width: 100px;
    height: 100px;
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
  }

  .el-input.is-disabled .el-input__inner {
    color: #999;
  }

  .el-form-item__label {
    font-size: 14px;
    color: #333;
  }
}
</style>