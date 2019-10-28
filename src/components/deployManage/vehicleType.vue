<template>
  <div id="customerManage">
    <div>
      <p class="overview_title">
        <i></i>
        <span>数据概览</span>
      </p>
      <div class="check_content">
        <div class="check-item" @click="getVehicleTypeList()" style="color:#256fff">
          <div class="overview-icon">
            <img :src="allCar" alt="">
          </div>
          <div class="overview-content">
            <span>{{total}}</span>
            <p>全部车型</p>
          </div>
        </div>
      </div>
    </div>
    <div class="nav">
      <div class="overview_title">
        <i></i>
        <span>操作栏</span>
      </div>
      <!-- <span style="font-size:12px;">操作栏</span> -->
      <div class="operate_button">
        <el-button type="primary" size="mini" @click="navigatePage('addVehicleType','add')">新增车型</el-button>
      </div>
    </div>
    <div class="customer_list">
      <div class="search">
        <div>
          <span style="font-size:12px;">全部车型</span>
          <el-input placeholder="客户查询" v-model="search" size="mini"></el-input>
          <el-button size="mini" type="primary" icon="el-icon-search">搜索</el-button>
        </div>
        <el-button size="mini" type="primary" icon="el-icon-search">导出</el-button>
      </div>
      <el-table
        :data="vehicleTypeList"
        style="width: 98%"
        :header-cell-style="{'background':'#f1f4fb','text-align':'center','font-size':'14px','color':'#222','font-weight':'normal'}"
        :cell-style="{'text-align':'center','font-size':'14px','color':'#222','font-weight':'normal'}"
      >
        <el-table-column label="序号" width="70">
          <template slot-scope="scope">
            <span>{{indexMethods(scope.$index)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="brand" label="所属品牌"></el-table-column>
        <el-table-column prop="model" label="所属车型"></el-table-column>
        <el-table-column label="类型">
          <template slot-scope="scope">
            <span>
              {{scope.row.type==0?'内置':'录入'}}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160">
          <template slot-scope="scope">
            <span
              style="font-size:14px;color:#1890ff;cursor:pointer"
              @click="gotoDetail(scope.row)"
            >详情</span>
            <i class="splitLine"></i>
            <!-- <span
              style="font-size:14px;color:#1890ff;cursor:pointer"
              @click="gotoDetail(scope.row)"
            >编辑</span>-->
            <!-- <i class="splitLine"></i> -->
            <span
              style="font-size:14px;color:#e53935;cursor:pointer"
              @click="deleteCustomer(scope.row)"
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
import http from "@/api/deployApi";
import allCar from "../../assets/images/chexing/ic_chexing_quanbu.svg";

export default {
  name: `customerManage`,
  data() {
    return {
      vehicleTypeList: [],
      page: 1,
      size: 10,
      search: ``,
      total: 0,
      allCar,
      vehicleTypeForm: {},
      overviewList: [
        { id: 1, status: 1 },
        { id: 2, status: 2 },
        { id: 3, status: 3 },
        { id: 4, status: 4 },
        { id: 5, status: 5 }
      ]
    };
  },
  activated() {
    this.getVehicleTypeList();
  },
  computed: {
    ...mapState(`user`, [`access_token`, `tenantId`])
  },
  methods: {
    handleSizeChange() {},
    handleCurrentChange() {},
    navigatePage(page, pageType) {
      console.log(pageType);
      console.log(page);
      this.$router.push({ name: page, query: { pageType } });
    },
    gotoDetail(row) {
      this.$router.push({
        name: `addVehicleType`,
        query: { pageType: "detail" ,vehicleTypeInfo:JSON.stringify(row)}
      });
    },
    indexMethods(index) {
      return (this.page - 1) * this.size + index + 1;
    },
    getVehicleTypeList() {
      let { vehicleTypeForm, tenantId, page, size } = this;
      http
        .getVehicleTypeList(vehicleTypeForm, tenantId, page, size)
        .then(data => {
          if (data.code == 0) {
            this.vehicleTypeList = data.data;
            this.total = data.total;
          }
        });
    },
    // 删除
    deleteCustomer(row) {
      let tenantId = this.tenantId
      let id = row.id
      this.$confirm("此操作将永久删除该客户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
           http.deleteVehicleType(tenantId, id).then(data => {
            if (data.code == 0) {
              this.$message(`删除成功`);
              // this.$router.back(-1);
              this.getVehicleTypeList()
            }else {
              this.$message(data.desc);
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
#customerManage {
  margin: 12px;

  .check_content {
    // padding: 20px;
    background: #fff;
    display: flex;
    align-items: center;
    flex-wrap:wrap
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

    // &:nth-last-child(1) {
    //   border: 0;
    // }
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
    // border-right: 1px solid #dcdfe6;
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