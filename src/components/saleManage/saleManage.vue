<template>
  <div id="saleManage">
    <div>
      <p class="overview_title">
        <i></i>
        <span>数据概览</span>
      </p>
      <div class="check_content">
        <div
          class="check-item"
          v-for="(item,index) in saleOptions"
          :key="index"
          @click="checkStatus(item.status)"
          :style="item.status==q?'color:rgb(37, 111, 255);':''"
        >
          <div class="overview-icon">
            <img
              :src="item.status=='unSigned'?daiqianyue:item.status=='signed'?yiqianyue:item.status=='finished'?yiwancheng:item.status=='terminated'?tiqian:item.status=='canceled'?yizuofei:''"
              alt
            />
          </div>
          <div class="overview-content">
            <span>{{item.status=='unSigned'?saleStaticInfo.unSigned:item.status=='signed'?saleStaticInfo.signed:item.status=='finished'?saleStaticInfo.finished:item.status=='terminated'?saleStaticInfo.terminated:item.status=='canceled'?saleStaticInfo.canceled:''}}</span>
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
        <el-button type="primary" size="mini" @click="navigatePage('addSign','add')">新增待签约</el-button>
        <el-button type="primary" size="mini" @click="navigatePage('addRenewal','')">新增续租</el-button>
      </div>
    </div>
    <div class="customer_list">
      <div class="search">
        <div>
          <span style="font-size:12px;">待签约</span>
          <!--动态变化的值-->
          <el-input placeholder="待签约查询" v-model="search" size="mini"></el-input>
          <el-button size="mini" type="primary" icon="el-icon-search">搜索</el-button>
        </div>
        <el-button size="mini" type="primary" icon="el-icon-search" style="margin-right:20px;">导出</el-button>
      </div>
      <el-table
        :data="contractList"
        style="width: 98%"
        :header-cell-style="{'background':'#f1f4fb','text-align':'center','font-size':'14px','color':'#222','font-weight':'normal'}"
        :cell-style="{'text-align':'center','font-size':'14px','color':'#222','font-weight':'normal'}"
      >
        <el-table-column label="序号" width="70">
          <template slot-scope="scope">
            <span>{{indexMethods(scope.$index)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="contractNo" label="合同编号"></el-table-column>
        <el-table-column label="租赁类型">
          <template slot-scope="scope">
            <span>{{scope.row.leaseType=='DAY'?'日租':'月租'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="customer.customerName" label="客户姓名"></el-table-column>
        <el-table-column prop="customer.customerPhone" label="手机号"></el-table-column>
        <el-table-column prop="startTime" label="合同开始日期"></el-table-column>
        <el-table-column prop="endTime" label="合同结束日期"></el-table-column>
        <el-table-column label="合同状态">
          <template slot-scope="scope">
            <span>{{scope.row.status=='UNSIGNED'?'待签约':scope.row.status=='SIGNED'?'已签约':scope.row.status=='CANCEL'?'取消':scope.row.status=='FINISH'?'已完成':scope.row.status=='TERMINATED_IN_ADVANCE'?'提前解约':''}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <span
              style="font-size:14px;color:#1890ff;cursor:pointer"
              @click="gotoDetail(scope.row)"
            >编辑</span>
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
  </div>
</template>
<script>
import daiqianyue from "../../assets/images/xiaoshou/ic_xiaoshou_daiqianyue.svg";
import yiqianyue from "../../assets/images/xiaoshou/ic_xiaoshou_yiqianyue.svg";
import yiwancheng from "../../assets/images/xiaoshou/ic_xiaoshou_yiwancheng.svg";
import tiqian from "../../assets/images/xiaoshou/ic_xiaoshou_tiqianjieyue.svg";
import yizuofei from "../../assets/images/xiaoshou/ic_xiaoshou_yizuofei.svg";
import { mapState, mapMutations } from "vuex";
import http from "@/api/contractApi";

export default {
  name: `customerManage`,
  data() {
    return {
      contractList: [],
      page: 1,
      size: 10,
      total: 0,
      search: ``,
      daiqianyue,
      yiqianyue,
      yiwancheng,
      tiqian,
      yizuofei,
      saleStaticInfo: {},
      q: "unSigned",
      saleOptions: [
        { status: "unSigned", label: "待签约" },
        { status: "signed", label: "已签约" },
        { status: "finished", label: "已完成" },
        { status: "terminated", label: "提前解约" },
        { status: "canceled", label: "已作废" }
      ]
    };
  },
  computed: {
    ...mapState(`user`, [`access_token`, `tenantId`])
  },
  activated() {
    this.getContractList();
    this.getSaleStatic();
  },
  methods: {
    handleSizeChange(val) {
      console.log(`每页${val}条`);
      this.size = val;
      this.getContractList();
    },
    handleCurrentChange(num) {
      console.log(`当前页: ${num}`);
      this.page = num;
      this.getContractList();
    },
    navigatePage(page, pageType) {
      this.$router.push({ name: page, query: { pageType } });
    },
    indexMethods(index) {
      return (this.page - 1) * this.size + index + 1;
    },
    checkStatus(status) {
      this.page = 1;
      this.size = 10;
      this.q = status;
      this.getContractList();
    },
    getSaleStatic() {
      let tenantId = this.tenantId;
      http.saleStatics(tenantId).then(data => {
        if (data.code == 0) {
          this.saleStaticInfo = data.data;
        }
      });
    },
    getContractList() {
      let params = { page: this.page, size: this.size, q: this.q };
      let tenantId = this.tenantId;
      http.getContractList(params, tenantId).then(data => {
        if (data.code == 0) {
          this.contractList = data.data;
          this.total = data.total;
        }
      });
    },
    gotoDetail(row) {
      this.$router.push({
        name: `addSign`,
        query: { pageType: "detail", contractId: row.id }
      });
    },
    // 删除
    deleteSign(row) {
      this.$confirm("此操作将永久删除该条数据, 是否继续?", "提示", {
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
    }
  }
};
</script>
<style lang="stylus" scoped>
#saleManage {
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