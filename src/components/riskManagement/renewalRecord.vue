<template>
  <div>
    <div class="customer_list">
      <div class="search">
        <div>
          <span style="font-size:14px;">保单记录</span>
        </div>
        <div>
          <el-button size="mini" type="primary" @click="$router.back(-1)">返回</el-button>
          <el-button
            size="mini"
            type="primary"
            style="margin-top:20px;"
            @click="navigatePage('addPolicy','add')"
          >新增保单记录</el-button>
        </div>
      </div>
      <el-table
        :data="motVehicleList"
        style="width: 98%"
        :header-cell-style="{'background':'#f1f4fb','text-align':'center','font-size':'14px','color':'#222','font-weight':'normal'}"
        :cell-style="{'text-align':'center','font-size':'14px','color':'#222','font-weight':'normal'}"
      >
        <el-table-column prop="licensePlate" label="车牌号"></el-table-column>
        <el-table-column prop="holderCompany.companyName" label="公司名"></el-table-column>
        <el-table-column label="品牌车型">
          <template slot-scope="scope">
            <span>{{scope.row.brand}}-{{scope.row.model}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="compulsoryInsurance.compulsoryStartDay" label="交强险开始日期"></el-table-column>
        <el-table-column prop="compulsoryInsurance.compulsoryEndDay" label="交强险结束日期"></el-table-column>
        <el-table-column prop="commercialInsurance.commercialStartDay" label="商业险开始日期"></el-table-column>
        <el-table-column prop="commercialInsurance.commercialEndDay" label="商业险结束日期"></el-table-column>
        <el-table-column prop="remarks" label="备注"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <span
              style="font-size:14px;color:#256fff;cursor:pointer"
              @click="gotoDetail(scope.row)"
            >详情</span>
            <i class="splitLine"></i>
            <span
              style="font-size:14px;color:#e53935;cursor:pointer"
              @click="deleteMot(scope.row)"
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
import http from "@/api/riskManagementApi";
export default {
  data() {
    return {
      motVehicleList: [],
      searchContent: ``,
      expireStatus: "1",
      licensePlate: "",
      page: 1,
      size: 10,
      total: 0
    };
  },
  computed: {
    ...mapState(`user`, [`tenantId`])
  },
  activated() {
    let licensePlate = this.$route.query.licensePlate;
    this.licensePlate = licensePlate;
    this.getMotRecord();
  },
  methods: {
    //查询车辆年检记录
    getMotRecord() {
      let params = {
        licensePlate: this.licensePlate,
        page: this.page,
        size: this.size
      };
      let tenantId = this.tenantId;
      http.getRenewalRecord(params, tenantId).then(data => {
        console.log(data);
        if (data.code == 0) {
          this.motVehicleList = data.data;
          this.total = data.total;
        }
      });
    },
    navigatePage(page, pageType) {
      this.$router.push({ name: page, query: { pageType } });
    },
    deleteMot(row) {
      let params = { id: row.id };
      let tenantId = this.tenantId;
      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          http.deleteRenewal(params, tenantId).then(data => {
            if (data.code == 0) {
              this.$message(`删除成功`);
              this.getMotRecord();
            } else {
              this.$message(data.desc);
            }
          });
        })
        .catch(() => {
        });
    },
    gotoDetail(row) {
      this.$router.push({
        name: `addPolicy`,
        query: { pageType: "detail", renewalInfo: JSON.stringify(row) }
      });
    },
    handleSizeChange(val) {
      console.log(`每页${val}条`);
      this.size = val;
      this.getMotRecord();
    },
    handleCurrentChange(num) {
      console.log(`当前页: ${num}`);
      this.page = num;
      this.getMotRecord();
    }
  }
};
</script>
<style lang="stylus" scoped>
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
  padding: 8px 12px 8px 12px;
  border-bottom: 1px solid #eee;
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