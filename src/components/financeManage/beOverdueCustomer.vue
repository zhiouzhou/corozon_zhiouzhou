<template>
  <div>
    <div class="customer_list">
      <div class="search">
        <p style="font-size:14px">逾期客户</p>
      </div>
      <el-table
        :data="contractList"
        style="width: 98%"
        :header-cell-style="{'background':'#f1f4fb','text-align':'center','font-size':'14px','color':'#222','font-weight':'normal'}"
        :cell-style="{'text-align':'center','font-size':'14px','color':'#222','font-weight':'normal'}"
      >
        <el-table-column prop="customer.customerName" label="客户姓名"></el-table-column>
        <el-table-column prop="customer.customerPhone" label="手机号"></el-table-column>

        <el-table-column prop="startTime" label="合同开始日期"></el-table-column>
        <el-table-column prop="endTime" label="合同结束日期"></el-table-column>
        <el-table-column prop="rent" label="租金"></el-table-column>
        <el-table-column prop="deposit" label="押金"></el-table-column>

        <el-table-column label="签约类型">
          <template slot-scope="scope">
            <span>{{scope.row.leaseType=='DAY'?'日租':'月租'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="签约状态">
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
import { mapState } from "vuex";
import http from "@/api/contractApi";
export default {
  data() {
    return {
      contractList: [],
      searchContent: ``,
      total: 0,
      page: 1,
      size: 10,
      contractNo: ""
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
    this.getContractList(this.plate);
  },
  watch: {},
  methods: {
    //查询客户记录
    getContractList() {
      let params = { page: this.page, size: this.size, q: "expired" };
      let tenantId = this.tenantId;
      http.getContractList(params, tenantId).then(data => {
        if (data.code == 0) {
          this.contractList = data.data;
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