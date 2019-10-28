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
          v-for="(item,index) in overviewList"
          :key="index"
          @click="checkStatus(item.status)"
          :style="item.status==q?'color:#256fff':''"
        >
          <div class="overview-icon">
            <img
              :src="item.status=='all'?allCustomer:item.status=='noSigned'?jieyue:item.status=='expired'?weiqianyue:item.status=='expiring'?jijiang:item.status=='unSigned'?daiqianyue:item.status=='signed'?yiqianyue:item.status=='intention'?yixiang:''"
              alt
            />
          </div>
          <div class="overview-content">
            <span>{{item.status=='all'?customerStaticInfo.all:item.status=='noSigned'?customerStaticInfo.noSigned:item.status=='expiring'?customerStaticInfo.expiring:item.status=='unSigned'?customerStaticInfo.unSigned:item.status=='signed'?customerStaticInfo.signed:item.status=='expired'?customerStaticInfo.expired:item.status=='intention'?customerStaticInfo.commRecords:''}}</span>
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
      <!-- <span style="font-size:12px;">操作栏</span> -->
      <div class="operate_button">
        <el-button type="primary" size="mini" @click="navigatePage('addCustomer','add')">新增客户</el-button>
        <el-button
          type="primary"
          size="mini"
          @click="navigatePage('addExchangeRecords','add')"
        >新增客户沟通记录</el-button>
        <!-- <el-button size="mini" @click="navigatePage('addCustomer')">司机核查</el-button> -->
      </div>
    </div>
    <div class="customer_list">
      <div class="search">
        <div>
          <span style="font-size:12px;">全部客户</span>
          <el-input placeholder="客户查询" v-model="search" size="mini"></el-input>
          <el-button size="mini" type="primary" icon="el-icon-search">搜索</el-button>
        </div>
        <el-button size="mini" type="primary" icon="el-icon-search">导出</el-button>
      </div>
      <div v-show="!intentionStatus">
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
          <el-table-column label="类型">
            <template slot-scope="scope">
              <span>{{scope.row.type=='INDIVIDUAL'?'个人':'企业'}}</span>
            </template>
          </el-table-column>
          <el-table-column label="客户名称">
            <template slot-scope="scope">
              <span>{{scope.row.type=='INDIVIDUAL'?scope.row.individual.name:scope.row.enterprise.name}}</span>
            </template>
          </el-table-column>
          <el-table-column label="手机号">
            <template slot-scope="scope">
              <span>{{scope.row.type=='INDIVIDUAL'?scope.row.individual.mobile:scope.row.enterprise.contactMobile}}</span>
            </template>
          </el-table-column>
          <el-table-column label="身份证号" width="200">
            <template slot-scope="scope">
              <span>{{scope.row.type=='INDIVIDUAL'?scope.row.individual.idCardNo:scope.row.enterprise.contactIdCardNo}}</span>
            </template>
          </el-table-column>
          <el-table-column label="地址" width="200">
            <template slot-scope="scope">
              <span>{{scope.row.type=='INDIVIDUAL'?scope.row.individual.homeAddress:scope.row.enterprise.address}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="remarks" label="备注"></el-table-column>
          <el-table-column label="操作" width="200">
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
      </div>
      <div v-show="intentionStatus">
        <el-table
          :data="intentionCustomerList"
          style="width: 98%"
          :header-cell-style="{'background':'#f1f4fb','text-align':'center','font-size':'14px','color':'#222','font-weight':'normal'}"
          :cell-style="{'text-align':'center','font-size':'14px','color':'#222','font-weight':'normal'}"
        >
          <el-table-column label="序号" width="70">
            <template slot-scope="scope">
              <span>{{indexMethods(scope.$index)}}</span>
            </template>
          </el-table-column>
          <el-table-column label="客户姓名">
            <template slot-scope="scope">
              <span>{{scope.row.customerName}}</span>
            </template>
          </el-table-column>
          <el-table-column label="联系方式">
            <template slot-scope="scope">
              <span>{{scope.row.mobile}}</span>
            </template>
          </el-table-column>
          <el-table-column label="沟通时间" prop="commDate"></el-table-column>
          <el-table-column label="备注">
            <template slot-scope="scope">
              <span>{{scope.row.remark}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200">
            <template slot-scope="scope">
              <span
                style="font-size:14px;color:#1890ff;cursor:pointer"
                @click="gotoRecordDetail(scope.row)"
              >详情</span>
              <i class="splitLine"></i>
              <span
                style="font-size:14px;color:#e53935;cursor:pointer"
                @click="deleteRecord(scope.row)"
              >删除</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
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
  </div>
</template>
<script>
import { mapState } from "vuex";
import http from "@/api/customerApi";
import allCustomer from "../../assets/images/kehu/ic_kehu_quanbu.svg";
import yiqianyue from "../../assets/images/kehu/ic_kehu_yiqianyue.svg";
import jieyue from "../../assets/images/kehu/ic_kehu_weiqianyue.svg";
import weiqianyue from "../../assets/images/kehu/ic_kehu_yuqi.svg";
import daiqianyue from "../../assets/images/kehu/ic_kehu_daiqianyue.svg";
import yixiang from "../../assets/images/kehu/ic_kehu_goutongjilu.svg";
import jijiang from "../../assets/images/kehu/ic_kehu_jijiangdaoqi.svg";
export default {
  name: `customerManage`,
  data() {
    return {
      customerList: [],
      page: 1,
      size: 10,
      search: ``,
      total: 0,
      q: "all",
      allCustomer,
      yiqianyue,
      weiqianyue,
      yixiang,
      jijiang,
      daiqianyue,
      jieyue, //解约
      overviewList: [
        { id: 1, status: "all", label: "全部" },
        { id: 4, status: "signed", label: "已签约客户" },
        { id: 2, status: "noSigned", label: "未签约客户" },
        { id: 3, status: "unSigned", label: "待签约客户" },
        { id: 5, status: "expiring", label: "即将到期客户" },
        { id: 6, status: "expired", label: "逾期客户" },
        { id: 7, status: "intention", label: "沟通记录" }
      ],
      intentionCustomerList: [],
      intentionStatus: false,
      selectIndex: 1,
      customerStaticInfo: {}
      // intentionPage:1,
      // intentionSize:10,
    };
  },
  computed: {
    ...mapState(`user`, [`access_token`, `tenantId`])
  },
  activated() {
    this.getCustomerStatics();
    this.getCustomerList();
    this.getIntentionCustomer();
  },
  methods: {
    handleSizeChange(val) {
      console.log(`每页${val}条`);
      this.size = val;
      this.getCustomerList();
    },
    handleCurrentChange(num) {
      console.log(`当前页: ${num}`);
      this.page = num;
      this.getCustomerList();
    },
    navigatePage(page, pageType) {
      console.log(pageType);
      console.log(page);
      this.$router.push({ name: page, query: { pageType } });
    },
    gotoDetail(row) {
      this.$router.push({
        name: `addCustomer`,
        query: {
          pageType: "detail",
          customerInfo: JSON.stringify(row),
          q: this.q
        }
      });
    },

    gotoRecordDetail(row) {
      this.$router.push({
        name: `addExchangeRecords`,
        query: {
          pageType: "detail",
          customerInfo: JSON.stringify(row)
        }
      });
    },
    indexMethods(index) {
      return (this.page - 1) * this.size + index + 1;
    },
    //查询客户列表
    getCustomerList() {
      let params = { page: this.page, size: this.size, q: this.q };
      let tenantId = this.tenantId;
      http.getCustomerList(params, tenantId).then(data => {
        console.log(data);
        if (data.code == 0) {
          this.customerList = data.data;
          this.total = data.total;
        } else {
          this.$message(data.desc);
        }
      });
    },
    //查询统计
    getCustomerStatics() {
      let tenantId = this.tenantId;
      http.getCustomerStatic(tenantId).then(data => {
        if (data.code == 0) {
          this.customerStaticInfo = data.data;
        }
      });
    },
    // 删除
    deleteCustomer(row) {
      let tenantId = this.tenantId;
      let no = row.id;
      this.$confirm("此操作将永久删除该客户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          http.deleteCustomer(tenantId, no).then(data => {
            if (data.code == 0) {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.getCustomerList();
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
    checkStatus(status) {
      console.log(status);
      this.selectIndex = status;
      this.page = 1;
      this.size = 10;
      this.q = status;
      if (status === "intention") {
        this.intentionStatus = true;
        this.getIntentionCustomer();
      } else {
        this.intentionStatus = false;
        this.getCustomerList();
      }
    },
    //查询客户交流沟通记录
    getIntentionCustomer() {
      let params = { page: this.page, size: this.size };
      let tenantId = this.tenantId;
      http.getIntentionCustomer(params, tenantId).then(data => {
        if (data.code == 0) {
          this.intentionCustomerList = data.data;
          this.total = data.total;
        } else {
          this.$message(data.desc);
        }
      });
    },
    deleteRecord(row) {
      let tenantId = this.tenantId;
      let id = row.id;
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
              this.getIntentionCustomer();
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
    // background: #256fff;
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