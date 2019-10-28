<template>
  <div>
    <div class="customer_list">
      <el-button
        style="margin:12px 0 0 22px;"
        size="mini"
        type="primary"
        @click="$router.push({name:'addMaintain',query:{pageType:'add'}})"
      >新增保养记录</el-button>

      <el-table
        :data="maintainList"
        style="width: 98%"
        :header-cell-style="{'background':'#f1f4fb','text-align':'center','font-size':'14px','color':'#222','font-weight':'normal'}"
        :cell-style="{'text-align':'center','font-size':'14px','color':'#222','font-weight':'normal'}"
      >
        <el-table-column prop="licensePlate" label="车牌号"></el-table-column>
        <el-table-column label="品牌车型">
          <template slot-scope="scope">
            <span>{{scope.row.brand+"-"+scope.row.model}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="userName" label="客户姓名"></el-table-column>
        <el-table-column prop="repairCompany" label="修理厂"></el-table-column>
        <el-table-column prop="keepCost" label="金额"></el-table-column>
        <el-table-column label="保养状态">
          <template slot-scope="scope">
            <span>{{scope.row.keepStatus==0?'未完成':'已完成'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="enterMileage" label="进厂公里数"></el-table-column>
        <el-table-column prop="enterTime" label="进厂时间"></el-table-column>
        <el-table-column prop="nextKeepMileage" label="下次保养公里数"></el-table-column>
        <el-table-column prop="remarks" label="备注"></el-table-column>
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
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import http from "@/api/carApi";
export default {
  data() {
    return {
      maintainList: [],
      searchContent: ``
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
    //查询保养记录
    getMotRecord(plate) {
      let params = {
        searchContent: plate
      };
      let tenantId = this.tenantId;
      http.getMaintainRecord(params, tenantId).then(data => {
        console.log(data);
        if (data.code == 0) {
          this.maintainList = data.data;
        }
      });
    },
    gotoRenewal(row) {
      this.$router.push({
        name: `addMaintain`,
        query: { pageType: "detail", maintainInfo:JSON.stringify(row) }
      });
    },
    //删除保养记录
    deleteRecord(row) {
      let params = { id: row.id };
      let tenantId = this.tenantId;
      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          http.editMaintainRecord(params, tenantId).then(data => {
            if (data.code == 0) {
              this.$message(`删除成功`);
              this.getMotRecord(this.plate);
            } else {
              this.$message(data.desc);
            }
          });
        })
        .catch(() => {});
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