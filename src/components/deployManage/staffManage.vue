<template>
  <div id="customerManage">
    <div>
      <p class="overview_title">
        <i></i>
        <span>数据概览</span>
      </p>
      <div class="check_content">
        <div
          class="check-item"
          v-for="(item,index) in overviewList"
          :key="index"
          @click="selectStaff(item)"
          :style="q==item.status?'color:#256fff':''"
        >
          <div class="overview-icon">
            <img
              :src="item.status=='on'?onStaff:item.status=='leave'?leaveStaff:item.status=='com_motor_manager'?cheguan:item.status=='com_admin'?guanliyuan:item.status=='com_salesman'?saleMan:item.status=='com_accountant'?accountant:item.status=='com_insurance_manager'?insurance:item.status=='com_maintainance_manager'?maintainance:item.status=='com_risk_manager'?risk:''"
              alt
            />
          </div>
          <div class="overview-content">
            <span>{{item.status=='on'?staffStaticInfo.on:item.status=='leave'?staffStaticInfo.leave:item.status=='com_motor_manager'?staffStaticInfo.com_motor_manager:item.status=='com_admin'?staffStaticInfo.com_admin:item.status=='com_salesman'?staffStaticInfo.com_salesman:item.status=='com_accountant'?staffStaticInfo.com_accountant:item.status=='com_insurance_manager'?staffStaticInfo.com_insurance_manager:item.status=='com_maintainance_manager'?staffStaticInfo.com_maintainance_manager:item.status=='com_risk_manager'?staffStaticInfo.com_risk_manager:''}}</span>
            <p>{{item.label}}</p>
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
        <el-button type="primary" size="mini" @click="navigatePage('addStaff','add')">新增员工</el-button>
      </div>
    </div>
    <div class="customer_list">
      <div class="search">
        <div>
          <span style="font-size:12px;">全部员工</span>
          <el-input placeholder="客户查询" v-model="search" size="mini"></el-input>
          <el-button size="mini" type="primary" icon="el-icon-search">搜索</el-button>
        </div>
        <el-button size="mini" type="primary" icon="el-icon-search">导出</el-button>
      </div>
      <el-table
        :data="staffList"
        style="width: 98%"
        :header-cell-style="{'background':'#f1f4fb','text-align':'center','font-size':'14px','color':'#222','font-weight':'normal'}"
        :cell-style="{'text-align':'center','font-size':'14px','color':'#222','font-weight':'normal'}"
      >
        <el-table-column label="序号" width="70">
          <template slot-scope="scope">
            <span>{{indexMethods(scope.$index)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="员工姓名"></el-table-column>
        <el-table-column prop="mobile" label="手机号"></el-table-column>
        <el-table-column label="员工角色">
          <template slot-scope="scope">
            <p
              v-for="(item,index) in scope.row.role"
              :key="index"
            >{{item=='com_admin'?'企业管理员':item=='com_motor_manager'?'车管':item=='com_salesman'?'企业销售':item=='com_accountant'?'企业财会':''}}</p>
          </template>
        </el-table-column>
        <!-- <el-table-column label="状态">
          <template slot-scope="scope">
            <span>{{scope.row.status=='NORMAL'?'启用':'停用'}}</span>
          </template>
        </el-table-column>-->
        <el-table-column prop="gmtCreate" label="创建时间" width="200"></el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <span
              style="font-size:14px;color:#1890ff;cursor:pointer"
              @click="gotoDetail(scope.row)"
            >详情</span>
            <i class="splitLine" v-if="q!=='leave'"></i>
            <span
              v-if="q!=='leave'"
              style="font-size:14px;color:#e53935;cursor:pointer"
              @click="deleteCustomer(scope.row)"
            >离职</span>
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
import http from "@/api/deployApi";
import onStaff from "../../assets/images/yuangong/ic_yuangong_zaizhi.svg";
import leaveStaff from "../../assets/images/yuangong/ic_yuangong_lizhi.svg";
import cheguan from "../../assets/images/yuangong/ic_yuangong_cheguan.svg";
import guanliyuan from "../../assets/images/yuangong/ic_yuangong_guanliyuan.svg";
import saleMan from "../../assets/images/yuangong/ic_yuangong_xiaoshou.svg";
import accountant from "../../assets/images/yuangong/ic_yuangong_caiwu.svg";
import insurance from "../../assets/images/yuangong/ic_yuangong_baoxianzhuanyuan.svg";
import maintainance from "../../assets/images/yuangong/ic_yuangong_weixiu.svg";
import risk from "../../assets/images/yuangong/ic_yuangong_fengkong.svg";
export default {
  name: `customerManage`,
  data() {
    return {
      staffList: [],
      page: 1,
      size: 10,
      search: ``,
      total: 0,
      staffStaticInfo: {},
      q: "on",
      onStaff,
      leaveStaff,
      cheguan,
      guanliyuan,
      saleMan,
      accountant,
      insurance,
      maintainance,
      risk,
      overviewList: [
        { id: 1, status: "on", label: "在职员工" },
        { id: 2, status: "leave", label: "离职员工" },
        { id: 3, status: "com_motor_manager", label: "车管" },
        { id: 4, status: "com_admin", label: "管理员" },
        { id: 5, status: "com_salesman", label: "销售" },
        { id: 6, status: "com_accountant", label: "财务" },
        { id: 7, status: "com_insurance_manager", label: "保险专员" },
        { id: 8, status: "com_maintainance_manager", label: "维修" },
        { id: 9, status: "com_risk_manager", label: "风控" }
      ]
    };
  },
  computed: {
    ...mapState(`user`, [`access_token`, `tenantId`])
  },
  activated() {
    this.getStaffStatics();
    this.getStaffList();
  },
  methods: {
    handleSizeChange(val) {
      console.log(`每页${val}条`);
      this.size = val;
      this.getStaffList();
    },
    handleCurrentChange(num) {
      console.log(`当前页: ${num}`);
      this.page = num;
      this.getStaffList();
    },
    navigatePage(page, pageType) {
      console.log(pageType);
      console.log(page);
      this.$router.push({ name: page, query: { pageType } });
    },
    gotoDetail(row) {
      this.$router.push({
        name: `addStaff`,
        query: { pageType: "detail", staffInfo: JSON.stringify(row) }
      });
    },
    indexMethods(index) {
      return (this.page - 1) * this.size + index + 1;
    },
    selectStaff(item) {
      let staffStaticInfo = this.staffStaticInfo;
      this.q = item.status;
      this.getStaffList();
    },
    getStaffList() {
      let qArr = [this.q]
      let params = { page: this.page, size: this.size };
      let tenantId = this.tenantId;
      http.getStaffList(params, tenantId,qArr).then(data => {
        console.log(data);
        if (data.code == 0) {
          this.staffList = data.data;
          this.total = data.total;
        } else {
          this.$message(data.desc);
        }
      });
    },
    //查询员工状态数量
    getStaffStatics() {
      let tenantId = this.tenantId;
      http.getStaffStatic(tenantId).then(data => {
        if (data.code == 0) {
          this.staffStaticInfo = data.data;
        }
      });
    },
    // 删除
    deleteCustomer(row) {
      let tenantId = this.tenantId;
      let memberId = row.memberId;
      this.$confirm("此操作将永久删除该员工, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          http.deleteStaff(tenantId, memberId).then(data => {
            if (data.code == 0) {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              // this.$router.back(-1)
              this.getStaffList();
            } else {
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
    flex-wrap: wrap;
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

   &:nth-last-child(1) {
      .overview-content {
        border: 0;
      }
    }
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
}
</style>