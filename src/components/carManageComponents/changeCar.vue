<template>
  <div>
    <div class="customer_list">
      <div class="search">
          <el-button size="mini" type="primary" @click="$router.push({name:'addChangeCar',query:{pageType:'add'}})">新增换车记录</el-button>
        <div>
          <span style="font-size:12px;">根据合同编号查询：</span>
          <el-input placeholder="请输入合同编号" v-model="contractNo" size="mini"></el-input>
          <el-button size="mini" type="primary" icon="el-icon-search">搜索</el-button>
        </div>
        <el-button size="mini" type="primary" icon="el-icon-search">导出</el-button>
      </div>
      <el-table
        :data="changeCarList"
        style="width: 98%"
        :header-cell-style="{'background':'#f1f4fb','text-align':'center','font-size':'14px','color':'#222','font-weight':'normal'}"
        :cell-style="{'text-align':'center','font-size':'14px','color':'#222','font-weight':'normal'}"
      >
        <el-table-column prop="originalPlate" label="旧车车牌号"></el-table-column>
        <el-table-column prop="replacePlate" label="新车车牌号"></el-table-column>
        <el-table-column prop="userName" label="客户姓名"></el-table-column>
        <el-table-column prop="startTime" label="换车开始时间"></el-table-column>
        <el-table-column prop="endTime" label="换车结束时间"></el-table-column>
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
import http from "@/api/carApi";
export default {
  data() {
    return {
      changeCarList: [],
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
    this.getMotRecord(this.plate);
  },
  watch: {
  },
  methods: {
    //查询验车记录
    getMotRecord(plate) {
      let params = {
        originPlate: plate
      };
      let tenantId = this.tenantId;
      http.getChangeRecord(params, tenantId).then(data => {
        console.log(data);
        if (data.code == 0) {
          this.changeCarList = data.data;
          this.total = data.total;
        }
      });
    },
    gotoChangeRecord(row) {
      this.$router.push({
        name: `addChangeCar`,
        query: { pageType:'detail',recordInfo:JSON.stringify(row) }
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
              that.getMotRecord(this.plate)
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
      this.getMotRecord(this.plate);
    },
    handleCurrentChange(num) {
      console.log(`当前页: ${num}`);
      this.page = num;
      this.getMotRecord(this.plate);
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