<template>
  <div id="customerManage">
    <div>
      <p class="overview_title">
        <i></i>
        <span>数据概览</span>
      </p>
      <div class="check_content">
        <div
          class="check-item"
          v-for="(item,index) in overviewListOne"
          :key="index"
          @click="selectRecordList(item.value)"
          :style="item.value==selectRecord?'color:#256fff':'color:#2c3e50'"
        >
          <div class="overview-icon">
            <img
              :src="item.status==1?yishou:item.status==2?yingshou:item.status==3?yifu:item.status==4?yingfu:''"
              alt
            />
          </div>
          <div class="overview-content">
            <span>{{item.status==1?staticInfo.receivedNum:item.status==2?staticInfo.receivableNum:item.status==3?staticInfo.paidNum:item.status==4?staticInfo.payableNum:0}}</span>
            <p>{{item.status==1?'已收款':item.status==2?'应收款':item.status==3?'已付款':item.status==4?'应付款':''}}</p>
          </div>
        </div>
      </div>
      <div class="check_content" style="margin-top:12px;">
        <div
          class="check-item"
          v-for="(item,index) in overviewList"
          :key="index"
          @click="selectRecordList(item.value)"
          :style="item.value==selectRecord?'color:#256fff':'color:#2c3e50'"
        >
          <div class="overview-icon">
            <img
              :src="item.status==1?daiqianyue:item.status==2?jijiangdaoqi:item.status==3?xujiaozujin:item.status==4?xutui:''"
              alt
            />
          </div>
          <div class="overview-content">
            <span>{{item.status==1?staticInfo.unsignedNum:item.status==2?staticInfo.overdueNum:item.status==3?staticInfo.payableRentNum:item.status==4?staticInfo.payableRefundNum:0}}</span>
            <p>{{item.status==1?'待签约客户':item.status==2?'逾期客户':item.status==3?'需缴租金客户':item.status==4?'需退押金客户':''}}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="nav">
      <div class="overview_title">
        <i></i>
        <span>操作栏</span>
      </div>
      <!-- <span style="font-size:12px;">操作栏</span> -->
      <div class="operate_button">
        <el-button type="primary" size="mini" @click="navigatePage('addSignReceipts','add')">签约收款</el-button>
        <el-button type="primary" size="mini" @click="navigatePage('rentCollection','add')">收租金</el-button>
        <el-button type="primary" size="mini" @click="navigatePage('addAccepted','add')">新增已收</el-button>
        <el-button type="primary" size="mini" @click="navigatePage('addReceivable','add')">新增应收</el-button>
        <!-- <el-button type="primary" size="mini" @click="navigatePage('addCustomer','add')">付租金</el-button> -->
        <el-button type="primary" size="mini" @click="navigatePage('addPaid','add')">新增已付</el-button>
        <el-button type="primary" size="mini" @click="navigatePage('addPayable','add')">新增应付</el-button>
        <el-button type="primary" size="mini" @click="navigatePage('returnDeposit','add')">退押金</el-button>
      </div>
    </div>
    <div class="customer_list">
      <div class="search">
        <div>
          <span style="font-size:14px;">查询：</span>
          <el-select
            v-model="searchInfo.recordType"
            placeholder="请选择"
            size="mini"
            @change="selectType"
            :disabled="selectRecord=='unsignCustomer'||selectRecord=='beOverdueCustomer'||selectRecord=='rentPayableRecord'||selectRecord=='depositRequired'?true:false"
          >
            <el-option
              v-for="item in typeList"
              :key="item.value"
              :label="item.lable"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-input
            placeholder="输入车牌或客户姓名"
            v-model="searchInfo.searchContent"
            size="mini"
            :disabled="selectRecord=='unsignCustomer'||selectRecord=='beOverdueCustomer'||selectRecord=='rentPayableRecord'||selectRecord=='depositRequired'?true:false"
          ></el-input>
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-search"
            @click="selectType"
            :disabled="selectRecord=='unsignCustomer'||selectRecord=='beOverdueCustomer'||selectRecord=='rentPayableRecord'||selectRecord=='depositRequired'?true:false"
          >搜索</el-button>
        </div>
        <el-button size="mini" type="primary" icon="el-icon-search">导出</el-button>
      </div>
      <!-- *********************基本数据  已收款*****************88 -->
      <div v-show="selectRecord=='receivedList'">
        <div class="search">
          <p style="font-size:14px">已收款</p>
        </div>
        <el-table
          :data="customerList"
          style="width: 98%"
          :header-cell-style="{'background':'#f1f4fb','text-align':'center','font-size':'14px','color':'#222','font-weight':'normal'}"
          :cell-style="{'text-align':'center','font-size':'14px','color':'#222','font-weight':'normal'}"
        >
          <el-table-column label="序号" width="70">
            <template slot-scope="scope">
              <span>{{indexMethods(scope.$index)}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="userName" label="客户姓名"></el-table-column>
          <el-table-column prop="arDate" label="应收日期"></el-table-column>
          <el-table-column prop="arAmount" label="应收金额"></el-table-column>
          <el-table-column prop="paidDate" label="收款日期"></el-table-column>
          <el-table-column prop="paidAmount" label="已收金额"></el-table-column>
          <el-table-column prop="licensePlate" label="车牌号"></el-table-column>
          <el-table-column prop="nextArDate" label="下次收款日期"></el-table-column>
          <el-table-column label="收款类型">
            <template slot-scope="scoped">
              <span>{{scoped.row.recordType==0?'租金':scoped.row.recordType==1?'押金':scoped.row.recordType==2?'管理费':scoped.row.recordType==3?'首付款':scoped.row.recordType==4?'尾款':scoped.row.recordType==5?'基础保险费':scoped.row.recordType==6?'不计免赔保险费':scoped.row.recordType==7?'违约金':scoped.row.recordType==8?'维修费':scoped.row.recordType==9?'保险理赔款':scoped.row.recordType==10?'服务费':scoped.row.recordType==11?'违章罚款':scoped.row.recordType==12?'其他':''}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="remarks" label="备注"></el-table-column>
          <el-table-column label="操作" width="160">
            <template slot-scope="scope">
              <span
                style="font-size:14px;color:#1890ff;cursor:pointer"
                @click="gotoDetail(scope.row)"
              >详情</span>
              <i class="splitLine"></i>
              <span
                style="font-size:14px;color:#e53935;cursor:pointer"
                @click="deleteCustomer(scope.row)"
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
      <!-- *************** 其他记录列表************************ -->
      <keep-alive>
        <component
          v-show="selectRecord!==`receivedList`"
          :is="selectView"
          :searchInfo="searchInfo"
          ref="isComponent"
        ></component>
      </keep-alive>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import http from "@/api/contractApi";
import daiqianyue from "../../assets/images/caiwu/ic_caiwu_daiqianyue.svg";
import jijiangdaoqi from "../../assets/images/caiwu/ic_caiwu_yuqi.svg";
import xujiaozujin from "../../assets/images/caiwu/ic_caiwu_xujiaozujin.svg";
import xutui from "../../assets/images/caiwu/ic_caiwu_xutuiyajin.svg";
import yishou from "../../assets/images/caiwu/ic_caiwu_yishoukuan.svg";
import yingshou from "../../assets/images/caiwu/ic_caiwu_yingshoukuan.svg";
import yifu from "../../assets/images/caiwu/ic_caiwu_yifukuan.svg";
import yingfu from "../../assets/images/caiwu/ic_caiwu_yingfukuan.svg";
import receivableRecord from "@/components/financeManage/receivableRecord";
import payableRecord from "@/components/financeManage/payableRecord";
import unsignCustomer from "@/components/financeManage/unsignCustomer";
import paidRecord from "@/components/financeManage/paidRecord";
import beOverdueCustomer from "@/components/financeManage/beOverdueCustomer";
import rentPayableRecord from "@/components/financeManage/rentPayableRecord";
import depositRequired from "@/components/financeManage/depositRequired";
export default {
  name: `customerManage`,
  data() {
    return {
      customerList: [],
      daiqianyue,
      jijiangdaoqi,
      xujiaozujin,
      xutui,
      page: 1,
      size: 10,
      yishou,
      yingshou,
      yifu,
      yingfu,
      search: ``,
      selectRecord: "receivedList",
      selectStatusValue: "receivedList",
      receivableRecord,
      payableRecord,
      unsignCustomer,
      beOverdueCustomer,
      paidRecord,
      rentPayableRecord,
      depositRequired,
      searchInfo: {},
      total: 0,
      staticInfo:{},
      typeList: [
        { value: "", lable: "全部" },
        { value: 0, lable: "租金" },
        { value: 1, lable: "押金" },
        { value: 2, lable: "管理费" },
        { value: 3, lable: "首付款" },
        { value: 4, lable: "尾款" },
        { value: 5, lable: "基础保险费" },
        { value: 6, lable: "不计免赔保险费" },
        { value: 7, lable: "违约金" },
        { value: 8, lable: "维修费" },
        { value: 9, lable: "保险理赔款" },
        { value: 10, lable: "服务费" },
        { value: 11, lable: "违章罚款" },
        { value: 12, lable: "其他" }
      ],
      overviewList: [
        { id: 1, status: 1, value: "unsignCustomer" },
        { id: 2, status: 2, value: "beOverdueCustomer" },
        { id: 3, status: 3, value: "rentPayableRecord" },
        { id: 4, status: 4, value: "depositRequired" }
      ],
      overviewListOne: [
        { id: 1, status: 1, value: "receivedList" },
        { id: 2, status: 2, value: "receivableRecord" },
        { id: 3, status: 3, value: "paidRecord" },
        { id: 4, status: 4, value: "payableRecord" }
      ]
    };
  },
  activated() {
    // this.getuser()
    this.getAcceptedList();
    this.getStatics();
  },
  computed: {
    ...mapState(`user`, [`access_token`, `tenantId`]),
    selectView() {
      return this.selectRecord == "receivableRecord"
        ? "receivableRecord"
        : this.selectRecord == "payableRecord"
        ? "payableRecord"
        : this.selectRecord == "unsignCustomer"
        ? "unsignCustomer"
        : this.selectRecord == "paidRecord"
        ? "paidRecord"
        : this.selectRecord == "beOverdueCustomer"
        ? "beOverdueCustomer"
        : this.selectRecord == "rentPayableRecord"
        ? "rentPayableRecord"
        : this.selectRecord == "depositRequired"
        ? "depositRequired"
        : "";
    }
  },
  components: {
    receivableRecord,
    payableRecord,
    unsignCustomer,
    paidRecord,
    beOverdueCustomer,
    rentPayableRecord,
    depositRequired
  },
  methods: {
    handleSizeChange(val) {
      console.log(`每页${val}条`);
      this.size = val;
      this.getAcceptedList();
    },
    handleCurrentChange(num) {
      console.log(`当前页: ${num}`);
      this.page = num;
      this.getAcceptedList();
    },
    getStatics(){
      let tenantId = this.tenantId
      http.getFinanceStatics(tenantId).then(data=>{
        if(data.code==0){
          this.staticInfo = data.data
        }
      })
    },
    navigatePage(page, pageType) {
      console.log(pageType);
      console.log(page);
      this.$router.push({ name: page, query: { pageType } });
    },
    selectType(value) {
      console.log(value);
      if (this.selectRecord == "receivedList") {
        this.getAcceptedList();
      } else {
        this.$refs.isComponent.getMotRecord();
      }
    },
    gotoDetail(row) {
      this.$router.push({ name: `addAccepted`, query: { pageType: "detail", } });
    },
    indexMethods(index) {
      // return (this.activeForm.page - 1) * this.activeForm.size + index + 1;
    },
    getAcceptedList() {
      let { page, size } = this;
      let tenantId = this.tenantId;
      let params = this.searchInfo;
      // let params = {recordType};
      http.getAccepted(params, tenantId, page, size).then(data => {
        if (data.code == 0) {
          this.customerList = data.data;
          this.total = data.total;
        }
      });
    },
    // 删除
    deleteCustomer(row) {
      this.$confirm("此操作将永久删除该客户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    selectRecordList(value) {
      console.log(value);
      this.selectRecord = value;
      this.searchInfo = {};
    }
  }
};
</script>
<style lang="stylus" scoped>
#customerManage {
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
      // border: 0;
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