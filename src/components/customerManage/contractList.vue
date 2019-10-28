<template>
  <div id="contractList">
    <div class="customer_list">
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
        <el-table-column label="租赁状态">
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
import { mapState, mapMutations } from "vuex";
import http from "@/api/contractApi";
export default {
  data() {
    return {
      contractList: [],
      page: 1,
      size: 10,
      total: 0
    };
  },
  props: {
    customerId: {
      type: Number,
      default: 0
    },
    q: {
      type: String,
      default: ""
    }
  },
  computed: {
    ...mapState(`user`, [`access_token`, `tenantId`])
  },
  activated() {
    this.getContractList();
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
    indexMethods(index) {
      return (this.page - 1) * this.size + index + 1;
    },
    getContractList() {
      let params = {
        page: this.page,
        size: this.size,
        q: this.q,
        customerId: this.customerId
      };
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
#contractList {
  .customer_list {
    background: #fff;
  }

  .el-button--primary {
    color: #FFF;
    background-color: #1890ff;
    border-color: #1890ff;
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
}
</style>