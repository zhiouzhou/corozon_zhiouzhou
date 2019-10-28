<template>
  <div id="contractTemplete">
    <div class="nav">
      <div class="overview_title">
        <i></i>
        <span>操作栏</span>
      </div>
      <div class="operate_button">
        <el-button
          type="primary"
          size="mini"
          @click="$router.push({name:`addContract`,query:{pageType:'add'}})"
        >新增合同模板</el-button>
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
        <el-table-column prop="id" label="合同记录编号"></el-table-column>
        <el-table-column prop="name" label="合同名称"></el-table-column>
        <el-table-column prop="address" label="合同状态">
          <template slot-scope="scope">
            <span>{{scope.row.enabled?'启用':'禁用'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="gmtCreate" label="创建时间"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <span
              style="font-size:14px;color:#67C23A;cursor:pointer"
              @click="checkStatus(scope.row)"
            >{{scope.row.enabled?'禁用':'启用'}}</span>
            <i class="splitLine"></i>
            <span
              style="font-size:14px;color:#1890ff;cursor:pointer"
              @click="gotoDetail(scope.row)"
            >详情</span>
            <i class="splitLine"></i>
            <span
              style="font-size:14px;color:#e53935;cursor:pointer"
              @click="deleteTemplate(scope.row)"
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
      page: 1,
      size: 10,
      total: 0,
      contractList: []
    };
  },
  computed: {
    ...mapState(`user`, [`access_token`, `tenantId`])
  },
  activated() {
    this.getContractTem();
  },
  methods: {
    handleSizeChange(val) {},
    handleCurrentChange(num) {},
    indexMethods(index) {
      return (this.page - 1) * this.size + index + 1;
    },
    getContractTem() {
      let params = { page: this.page, size: this.size };
      let tenantId = this.tenantId;
      http.getContractTem(params, tenantId).then(data => {
        if (data.code == 0) {
          this.contractList = data.data;
          this.total  = data.total
        }
      });
    },
    gotoDetail(row) {
      this.$router.push({
        name: "addContract",
        query: { pageType: "detail", id: row.id }
      });
    },
    deleteTemplate(row) {
      let id = row.id;
      let tenantId = this.tenantId;
      let that = this;
      this.$confirm("此操作将删除该合同模板, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          http.deleteTemplate(tenantId, id).then(data => {
            if (data.code == 0) {
              that.$message(`删除成功`);
              that.getContractTem();
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
    checkStatus(row) {
      let enabled = row.enabled ? false : true;
      let tenantId = this.tenantId;
      let id = row.id;
      console.log(enabled);
      this.$confirm(
        `此操作将${row.enabled ? "禁用" : "启用"}该合同模板, 是否继续?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          http.checkStatus(tenantId, id, enabled).then(data => {
            if (data.code == 0) {
              this.$message(`操作成功`);
              this.getContractTem();
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
#contractTemplete {
  margin: 12px;
}

.nav {
  margin-top: 8px;
  // padding: 12px;
  background: #fff;
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

.operate_button {
  padding: 20px;
}

.pagination {
  // width: 100%;
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