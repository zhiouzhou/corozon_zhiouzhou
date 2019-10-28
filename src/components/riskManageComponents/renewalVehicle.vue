<template>
  <div>
    <div class="customer_list">
      <div class="search">
        <div>
          <span style="font-size:12px;">待续保车辆</span>
          <!--动态变化的值-->
          <el-input placeholder="请输入车牌/公司/品牌车型" v-model="searchContent" size="mini"></el-input>
          <el-button size="mini" type="primary" icon="el-icon-search" @click="getMotRecord">搜索</el-button>
        </div>
        <el-button size="mini" type="primary" icon="el-icon-search" style="margin-right:20px;">导出</el-button>
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
            <span>
              {{scope.row.vehicleModel.brand}}-{{scope.row.vehicleModel.model}}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="compulsoryExpireDate" label="交强险到期时间"></el-table-column>
        <el-table-column prop="commercialExpireDate" label="商业险到期时间"></el-table-column>
        <el-table-column  label="交强险剩余天数">
          <template slot-scope="scope">
            <span>
              {{scope.row.compulsoryExpireStatus==0?'剩余'+scope.row.compulsoryRemainDays:'已逾期'+scope.row.compulsoryRemainDays}}
            </span>
          </template>
        </el-table-column>
        <el-table-column  label="商业险剩余天数">
          <template slot-scope="scope">
            <span>
              {{scope.row.commercialExpireStatus==0?'剩余'+scope.row.commercialRemainDays:'已逾期'+scope.row.commercialRemainDays}}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <span style="font-size:14px;color:#256fff;cursor:pointer" @click="gotoRenewal(scope.row)">查看</span>
            <!-- <i class="splitLine"></i>
            <span
              style="font-size:14px;color:#e53935;cursor:pointer"
              @click="deleteSign(scope.row)"
            >删除</span> -->
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
      total:0,
      page:1,
      size:10,
    };
  },
  computed: {
    ...mapState(`user`, [`tenantId`])
  },
  activated() {
    this.getMotRecord();
  },
  methods:{
    //查询车辆保险记录
    getMotRecord() {
      let params = {
        searchContent: this.searchContent,
        size:this.size,
        page:this.page
      };
      let tenantId = this.tenantId;
      http.getRenewalStatus(params, tenantId).then(data => {
        console.log(data);
        if(data.code==0){
          this.motVehicleList = data.data
          this.total = data.total
        }
      });
    },
    gotoRenewal(row){
      this.$router.push({name:`renewalRecord`,query:{licensePlate:row.licensePlate}})
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
    },
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