<template>
  <div>
    <div class="customer_list">
      <div class="search">
        <p style="font-size:14px">需退押金客户</p>
      </div>
      <el-table
        :data="receivableList"
        style="width: 98%"
        :header-cell-style="{'background':'#f1f4fb','text-align':'center','font-size':'14px','color':'#222','font-weight':'normal'}"
        :cell-style="{'text-align':'center','font-size':'14px','color':'#222','font-weight':'normal'}"
      >
        <el-table-column prop="userName" label="客户姓名"></el-table-column>
        <el-table-column prop="arDate" label="应收日期"></el-table-column>
        <el-table-column prop="arAmount" label="应收金额"></el-table-column>
        <el-table-column prop="licensePlate" label="车牌号"></el-table-column>
        <el-table-column label="收款类型">
          <template slot-scope="scope">
            <span>{{scope.row.recordType==0?'租金':scope.row.recordType==1?'押金':scope.row.recordType==2?'管理费':scope.row.recordType==3?'首付款':scope.row.recordType==4?'尾款':scope.row.recordType==5?'基础保险费':scope.row.recordType==6?'不计免赔管理费':scope.row.recordType==7?'违约金':scope.row.recordType==8?'维修费':scope.row.recordType==9?'保险理赔款':scope.row.recordType==10?'服务费':scope.row.recordType==11?'违章罚款':scope.row.recordType==12?'其他':''}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="remarks" label="状态">
          <template slot-scope="scope">
            <span>{{scope.row.paidStatus==0?'未支付':'已支付'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="remarks" label="备注"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <span
              style="font-size:14px;color:#256fff;cursor:pointer"
              @click="gotoChangeRecord(scope.row)"
            >查看</span>
            <i class="splitLine"></i>
            <span
              style="font-size:14px;color:#e53935;cursor:pointer"
              @click="deleteRecord(scope.row)"
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
import { mapState } from "vuex";
import http from "@/api/contractApi";
export default {
  data() {
    return {
      receivableList: [],
      searchContent: ``,
      total: 0,
      page: 1,
      size: 10,
      contractNo: "",
      recordType:1,
    };
  },
  props: {
    plate: {
      type: String,
      default: ""
    }
  },
  computed: {
    ...mapState(`user`, [`tenantId`])
  },
  activated() {
    // this.plate = this.$route.query.plate ? this.$route.query.plate : "";
    this.getMotRecord(this.plate);
  },
  watch: {},
  methods: {
    //查询应付记录
    getMotRecord(plate) {
      let params = {
        recordType: this.recordType
      };
      let tenantId = this.tenantId;
      http.getPayableRecord(params, tenantId).then(data => {
        console.log(data);
        if (data.code == 0) {
          this.receivableList = data.data;
          this.total = data.total;
        }
      });
    },
    gotoChangeRecord(row) {
      this.$router.push({
        name: `addChangeCar`,
        query: { pageType: "detail", recordInfo: JSON.stringify(row) }
      });
    },
    deleteRecord(row) {
      let tenantId = this.tenantId;
      let params = { id: row.id };
      let that = this;
      this.$confirm("此操作将永久删除该条数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          http.deleteChangeRecord(params, tenantId).then(data => {
            if (data.code == 0) {
              that.$message(`删除成功`);
              that.getMotRecord(this.plate);
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
    handleSizeChange(val) {
      console.log(`每页${val}条`);
      this.size = val;
      //   this.getMotRecord(this.plate);
    },
    handleCurrentChange(num) {
      console.log(`当前页: ${num}`);
      this.page = num;
      //   this.getMotRecord(this.plate);
    }
  }
};
</script>
<style lang="stylus" scoped>
.customer_list {
  background: #fff;
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
  background: #256fff;
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
</style>