<template>
  <div>
    <div class="customer_list">
      <!-- <el-button
        style="margin:12px 0 0 22px;"
        size="mini"
        type="primary"
        @click="$router.push({name:'addBeInDanger',query:{pageType:'add'}})"
      >新增出险记录</el-button>-->

      <el-table
        :data="repairList"
        style="width: 98%"
        :header-cell-style="{'background':'#f1f4fb','text-align':'center','font-size':'14px','color':'#222','font-weight':'normal'}"
        :cell-style="{'text-align':'center','font-size':'14px','color':'#222','font-weight':'normal'}"
      >
        <el-table-column prop="licensePlate" label="车牌号"></el-table-column>
        <el-table-column prop="contractNo" label="合同编号"></el-table-column>
        <el-table-column label="租赁类型">
          <template slot-scope="scope">
            <span>{{scope.row.rentType==0?'日租':'月租'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="rentAmount" label="租金"></el-table-column>
        <el-table-column prop="pickupTime" label="提车日期"></el-table-column>
        <el-table-column prop="startTime" label="开始时间"></el-table-column>
        <el-table-column prop="rentStart" label="合同结束时间"></el-table-column>
        <el-table-column prop="rentEnd" label="合同结束时间"></el-table-column>

        <el-table-column label="车辆占用类型">
          <template slot-scope="scope">
            <span>{{scope.row.itemType==0?'出租':scope.row.itemType==1?'换车':'修车'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <span
              style="font-size:14px;color:#256fff;cursor:pointer"
              @click="gotoRenewal(scope.row)"
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
import http from "@/api/carApi";
export default {
  data() {
    return {
      repairList: [],
      searchContent: ``,
      page: 1,
      size: 10,
      total: 0
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
    this.getMotRecord(this.plate);
  },
  watch: {},
  methods: {
    handleSizeChange(val) {
      console.log(`每页${val}条`);
      this.size = val;
      this.getMotRecord();
    },
    handleCurrentChange(num) {
      this.page = num;
      this.getMotRecord();
    },
    //查询已租车辆信息
    getMotRecord(plate) {
      let params = {
        page: this.page,
        size: this.size
      };
      let tenantId = this.tenantId;
      http.getRentAlreadyList(params, tenantId).then(data => {
        console.log(data);
        if (data.code == 0) {
          this.repairList = data.data;
          this.total = data.total;
        }
      });
    },
    gotoRenewal(row) {
      let licensePlate = row.licensePlate;
      this.$router.push({
        name: `addCar`,
        query: { pageType: "detail", licensePlate }
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