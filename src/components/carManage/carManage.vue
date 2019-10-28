<template>
  <div id="carManage">
    <div>
      <p class="overview_title">
        <i></i>
        <span>数据概览</span>
      </p>
      <div class="check_content">
        <div
          class="check-item"
          v-for="(item,index) in statusOptions"
          :key="index"
          @click="selectStatus(item)"
          :style="item.status==selectStatusValue?'color:#256fff':'color:#2c3e50'"
        >
          <div class="overview-icon">
            <img
              :src="item.status==-1?allCar:item.status==0?tuichuyunying:item.status==1?daiyunying:item.status==2?daizu:item.status==3?yizu:item.status==4?huanche:item.status==5?weixiuzhong:item.status==6?daichuku:''"
              alt
            />
          </div>
          <div class="overview-content">
            <span>{{item.status==-1?staticInfo.total:item.status==0?staticInfo.withdraw:item.status==1?staticInfo.forMotion:item.status==2?staticInfo.forRent:item.status==3?staticInfo.letOut:item.status==4?staticInfo.exchange:item.status==5?staticInfo.underRepair:item.status==6?staticInfo.checkout:""}}</span>
            <p>{{item.label}}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="nav">
      <div class="overview_title">
        <i></i>
        <span>操作栏</span>
      </div>
      <div class="operate_button">
        <el-button type="primary" size="mini" @click="navigatePage('addCar','add')">新增车辆</el-button>
        <el-button type="primary" size="mini" @click="navigatePage('addChangeCar','add')">换车</el-button>
        <el-button type="primary" size="mini" @click="navigatePage('returnCar','add')">退车</el-button>
        <el-button type="primary" size="mini" @click="navigatePage('entryRecord')">录入租车记录</el-button>
        <el-button type="primary" size="mini" @click="navigatePage('addCheckCar','add')">验车</el-button>
        <el-button type="primary" size="mini" @click="navigatePage('addRepair','add')">维修</el-button>
        <el-button type="primary" size="mini" @click="navigatePage('addMaintain','add')">保养</el-button>
        <el-button type="primary" size="mini" @click="navigatePage('addBeInDanger','add')">出险</el-button>
        <!-- <el-button size="mini" @click="navigatePage('addRenewal')">验车</el-button> -->
      </div>
    </div>
    <div class="customer_list">
      <div class="search">
        <div>
          <span style="font-size:12px;display:inline-block;margin-right:12px">快速查询：</span>
          <el-select
            v-model="selectRecord"
            placeholder="请选择车辆记录"
            size="mini"
            @change="selectRecordList"
            style="margin-right:20px"
          >
            <el-option
              v-for="item in recordOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-input placeholder="输入关键字" v-model="carForm.searchContent" size="mini"></el-input>
          <el-button size="mini" type="primary" icon="el-icon-search" @click="getCarList">搜索</el-button>
        </div>
        <el-button size="mini" type="primary" icon="el-icon-search" style="margin-right:20px;">导出</el-button>
      </div>
      <!-- *********************基本数据  车辆列表*****************88 -->
      <div v-show="selectRecord=='carList'">
        <el-table
          :data="carList"
          style="width: 98%"
          :header-cell-style="{'background':'#f1f4fb','text-align':'center','font-size':'14px','color':'#222','font-weight':'normal'}"
          :cell-style="{'text-align':'center','font-size':'14px','color':'#222','font-weight':'normal'}"
        >
          <el-table-column label="序号" width="70">
            <template slot-scope="scope">
              <span>{{indexMethods(scope.$index)}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="licensePlate" label="车牌号" width="120"></el-table-column>
          <el-table-column prop="vehicleModel.brand" label="品牌车型"></el-table-column>
          <el-table-column prop="company.companyName" label="所属公司"></el-table-column>
          <el-table-column prop="owner.ownerName" label="实际车主"></el-table-column>
          <el-table-column prop="bodyColor" label="车身颜色"></el-table-column>
          <el-table-column prop="vin" label="车架号"></el-table-column>
          <el-table-column prop="engineNo" label="发动机号"></el-table-column>
          <el-table-column prop="managerName" label="负责人"></el-table-column>
          <el-table-column label="车辆状态">
            <template slot-scope="scope">
              <span>{{scope.row.vehicleStatus.operStatus==0?'退出运营':scope.row.vehicleStatus.operStatus==1?'待运营':scope.row.vehicleStatus.operStatus==2?'待租':scope.row.vehicleStatus.operStatus==3?'已出租':scope.row.vehicleStatus.operStatus==4?'换车中':scope.row.vehicleStatus.operStatus==5?'维修中':scope.row.vehicleStatus.operStatus==6?'待出库':''}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="remarks" label="备注"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <span
                style="font-size:14px;color:#1890ff;cursor:pointer"
                @click="gotoDetail('addCar','detail',scope.row)"
              >详情</span>
              <i class="splitLine"></i>
              <span
                style="font-size:14px;color:#e53935;cursor:pointer"
                @click="deleteSign(scope.row)"
              >删除</span>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination">
          <span>共{{total}}条数据</span>
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="page"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="size"
            layout=" prev, pager, next, sizes,jumper"
            :total="total"
            background
          ></el-pagination>
        </div>
      </div>
      <!-- *************** 车辆记录列表************************ -->
      <keep-alive>
        <component v-show="selectRecord!==`carList`" :is="selectView"></component>
      </keep-alive>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import http from "@/api/carApi";
import checkCar from "@/components/carManageComponents/checkCar";
import changeCar from "@/components/carManageComponents/changeCar";
import repairCar from "@/components/carManageComponents/repairCar";
import beInDangerCar from "@/components/carManageComponents/beInDanger";
import maintainCar from "@/components/carManageComponents/maintainCar";
import rentAlreadyCar from "@/components/carManageComponents/rentAlreadyCar";
import changeCarList from "@/components/carManageComponents/changeCarList";
import allCar from "../../assets/images/cheliang/ic_cheliang_quanbu.svg";
import yizu from "../../assets/images/cheliang/ic_cheliang_yizu.svg";
import daizu from "../../assets/images/cheliang/ic_cheliang_daizu.svg";
import daichuku from "../../assets/images/cheliang/ic_cheliang_daichuku.svg";
import tuichuyunying from "../../assets/images/cheliang/ic_cheliang_tuichuyunying.svg";
import weixiuzhong from "../../assets/images/cheliang/ic_cheliang_weixiu.svg";
import huanche from "../../assets/images/cheliang/ic_cheliang_huanche.svg";
import daiyunying from "../../assets/images/cheliang/ic_cheliang_daiyunying.svg";

export default {
  name: `customerManage`,
  data() {
    return {
      carList: [],
      page: 1,
      size: 10,
      total: 0,
      search: ``,
      carForm: {},
      staticInfo: {},
      selectStatusValue: -1,
      allCar,
      yizu,
      daizu,
      daichuku,
      tuichuyunying,
      weixiuzhong,
      huanche,
      daiyunying,
      //运营状态，0-退出运营，1-待租，2-已出租，3-换车中，4-维修中，5-待出库
      statusOptions: [
        { status: -1, label: "全部车辆" },
        { status: 3, label: "已租车辆" },
        { status: 2, label: "待租车辆" },
        { status: 4, label: "换车中" },
        { status: 5, label: "维修中车辆" },
        { status: 0, label: "退出运营车辆" },
        { status: 6, label: "待出库" },
        { status: 1, label: "待运营" }
      ],
      recordOptions: [
        { value: "carList", label: "请选择车辆记录" },
        { value: "rentAlreadyCar", label: "已租车辆" },
        { value: "changeCarList", label: "换车中车辆" },
        { value: "checkCar", label: "验车记录" },
        // { value: "returnCar", label: "退车记录" },
        { value: "changeCar", label: "换车记录" },
        { value: "repairCar", label: "维修记录" },
        { value: "beInDangerCar", label: "出险记录" },
        { value: "maintainCar", label: "保养记录" }
      ],
      selectRecord: "carList"
    };
  },
  computed: {
    ...mapState(`user`, [`access_token`, `tenantId`]),
    selectView() {
      return this.selectRecord == "checkCar"
        ? "checkCar"
        : this.selectRecord == "changeCar"
        ? "changeCar"
        : this.selectRecord == "repairCar"
        ? "repairCar"
        : this.selectRecord == "beInDangerCar"
        ? "beInDangerCar"
        : this.selectRecord == "maintainCar"
        ? "maintainCar"
        : this.selectRecord == "rentAlreadyCar"
        ? "rentAlreadyCar"
        : this.selectRecord == "changeCarList"
        ? "changeCarList"
        : "";
    }
  },
  components: {
    checkCar,
    changeCar,
    repairCar,
    beInDangerCar,
    maintainCar,
    rentAlreadyCar,
    changeCarList
  },
  activated() {
    this.getCarList();
    this.getStatics();
  },
  methods: {
    getStatics() {
      let tenantId = this.tenantId;
      http.getStatics(tenantId).then(data => {
        if (data.code == 0) {
          this.staticInfo = data.data;
        }
      });
    },
    handleSizeChange(val) {
      console.log(`每页${val}条`);
      this.size = val;
      this.getCarList();
    },
    handleCurrentChange(num) {
      this.page = num;
      this.getCarList();
    },
    navigatePage(page, pageType) {
      this.$router.push({ name: page, query: { pageType } });
    },
    gotoDetail(page, pageType, row) {
      let licensePlate = row.licensePlate;
      this.$router.push({ name: page, query: { pageType, licensePlate } });
    },
    indexMethods(index) {
      return (this.page - 1) * this.size + index + 1;
    },
    selectStatus(carItem) {
      this.selectStatusValue = carItem.status;
      if (carItem.status == -1) {
        this.carForm = {};
      } else {
        this.carForm.operStatus = carItem.status;
      }
      if (carItem.status == 3) {
        this.selectRecord = "rentAlreadyCar";
      } else if (carItem.status == 4) {
        this.selectRecord = "changeCarList";
      } else {
        this.selectRecord = "carList";
      }
      this.getCarList();
    },
    getCarList() {
      let { page, size, tenantId } = this;
      let params = this.carForm;
      http.getCarList(params, tenantId, page, size).then(data => {
        if (data.code == 0) {
          this.carList = data.data;
          this.total = data.total;
        }
      });
    },
    // 删除
    deleteSign(row) {
      let licensePlate = row.licensePlate;
      let tenantId = this.tenantId;
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
              // that.$router.back(-1)
              this.getCarList();
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
    //快速查询
    selectRecordList(value) {
      console.log(value);
      this.selectRecord = value;
    }
  }
};
</script>
<style lang="stylus" scoped>
#carManage {
  margin: 12px;

  .check_content {
    // padding: 20px;
    background: #fff;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
  }

  .check-item {
    // flex: 1;
    display: flex;
    align-items: center;
    padding: 20px 0 20px 20px;
    cursor: pointer;

    &:hover {
      // background:red
      color: #1890ff;
    }

    span {
      font-size: 12px;
    }

    p {
      font-size: 16px;
      font-weight: bold;
      padding: 0;
      margin: 0;
      margin-top: 18px;
    }

    &:nth-last-child(1) {
      .overview-content {
        border: 0;
      }
    }
  }

  .nav {
    margin-top: 8px;
    // padding: 12px;
    background: #fff;
  }

  .customer_list {
    background: #fff;
    margin-top: 12px;
    // padding-bottom: 12px;
  }

  .el-button--primary {
    color: #FFF;
    background-color: #1890ff;
    border-color: #1890ff;
  }

  .search {
    display: flex;
    align-items: center;
    padding: 8px 12px 8px 12px;
    border-bottom: 1px solid #eee;
    justify-content: space-between;
    // width 100%;
    background: #fff;
  }

  .el-input {
    width: 220px;
    margin: 0 12px;
  }

  .el-table {
    margin: 0 auto;
    width: 98%;
    padding-top: 12px;
  }

  .el-pagination {
    // margin-top: 12px;
    // padding-left: 12px;
  }

  .overview_title {
    display: flex;
    align-items: center;
    border-bottom: 1px solid #dcdfe6;
    padding: 10px;
    margin: 0;
    background: #fff;

    i {
      display: inline-block;
      width: 2px;
      height: 16px;
      background: #256fff;
      margin-right: 12px;
    }

    span {
      font-size: 16px;
    }
  }

  .overview-icon {
    width: 59px;
    height: 59px;
    border-radius: 50px;
    margin-right: 15px;
  }

  .overview-content {
    display: flex;
    align-items: center;
    flex-direction: column;
    border-right: 1px solid #dcdfe6;
    padding-right: 20px;

    span {
      font-size: 28px;
    }

    p {
      font-size: 14px;
    }
  }

  .operate_button {
    padding: 20px;
  }

  .pagination {
    // width: 100%
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 40px;

    span {
      font-size: 12px;
    }
  }

  .splitLine {
    display: inline-block;
    height: 14px;
    width: 1px;
    background: #e4e7ed;
    margin: 0 12px;
  }
}
</style>