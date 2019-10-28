<template>
  <div id="contractDetail">
    <p class="nav_title">合同详情</p>
    <!-- 合同信息 -->
    <div class="contract_status">
      <div class="info">
        <p>
          <span>合同编号：</span>CRZN001
        </p>
        <p>
          <span>合同状态：</span>已签约
        </p>
        <p>
          <span>合同名称：</span>月租车和同龄
        </p>
        <p>
          <span>合同创建时间：</span>2019-08-13
        </p>
      </div>
      <div class="operate">
        <span>操作栏</span>
        <el-button size="mini">合同变更状态</el-button>
      </div>
    </div>
    <!-- 客户信息 -->
    <div class="customer_info">
      <div class="customer">
        <p>
          <span>客户类型：</span>个人
        </p>
        <p>
          <span>客户姓名：</span>杨文浩
        </p>
        <p>
          <span>客户性别：</span>男
        </p>
        <p>
          <span>手机号：</span>18631181992
        </p>
        <p>
          <span>家庭住址：</span>北京市丰台区航丰路1号院4号楼1212
        </p>
        <p>
          <span>身份证号：</span>xxxxxxxxxxxx
        </p>
      </div>
      <div class="customer">
        <p>
          <span>紧急联系人姓名：</span>杨文浩
        </p>
        <p>
          <span>紧急联系人手机号：</span>13659396686
        </p>
        <p>
          <span>准驾类型：</span>C1
        </p>
      </div>
    </div>
    <!-- 车辆信息 -->
    <div class="customer_info">
      <div class="customer">
        <p>
          <span>车牌号：</span>个人
        </p>
        <p>
          <span>车型：</span>杨文浩
        </p>
        <p>
          <span>销售人：</span>男
        </p>
        <p>
          <span>签约时间：</span>18631181992
        </p>
        <p>
          <span>验车人：</span>北京市丰台区航丰路1号院4号楼1212
        </p>
        <p>
          <span>验车时间：</span>xxxxxxxxxxxx
        </p>
        <p>
          <span>里程数：</span>xxxxxxxxxxxx
        </p>
      </div>
      <div class="customer">
        <p>
          <span>剩余油量：</span>杨文浩
        </p>
        <p>
          <span>车锁：</span>13659396686
        </p>
        <p style="display:flex;">
          <span>车辆照片：</span>
          <img src alt style="width:130px;height:80px;background:#eaeaea;display: block" />
        </p>
      </div>
    </div>
    <!-- 合同金额信息 -->
    <div class="customer_info">
      <div class="customer">
        <p>
          <span>合同开始日期：</span>个人
        </p>
        <p>
          <span>合同结束日期：</span>杨文浩
        </p>
        <p>
          <span>提车日期：</span>男
        </p>
        <p>
          <span>押金：</span>18631181992
        </p>
        <p>
          <span>管理费：</span>北京市丰台区航丰路1号院4号楼1212
        </p>
        <p>
          <span>租金：</span>xxxxxxxxxxxx
        </p>
      </div>
      <div class="customer">
        <p>
          <span>租期：</span>杨文浩
        </p>
        <p>
          <span>付款方式：</span>13659396686
        </p>
        <p style="display:flex;">
          <span>付款时间：</span>方式放松放松放松放松
        </p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  }
};
</script>
<style lang="stylus">
#contractDetail {
  margin: 12px;

  .nav_title {
    padding: 12px;
    font-size: 13px;
    color: #000;
    background: #fff;
    font-weight: bold;
  }

  .contract_status {
    background: #fff;
  }

  .info {
    display: flex;
    flex-wrap: wrap;
    border-bottom: 1px solid #eaeaea;
    padding: 12px;
    justify-content: space-around;

    p {
      width: 45%;
      font-size: 13px;
      margin: 0;
      line-height: 24px;
      display: flex;
      align-items: center;

      span {
        display: block;
        min-width: 120px;
        text-align: right;
      }
    }
  }

  .customer_info {
    display: flex;
    flex-wrap: wrap;
    // border-bottom: 1px solid #eaeaea;
    padding: 12px;
    justify-content: space-around;
    background: #fff;
    margin-top: 12px;

    .customer {
      // flex: 45%;
      width: 38%;
      font-size: 13px;
      margin: 0;
      line-height: 24px;

      p {
        margin: 0;

        span {
          display: inline-block;
          min-width: 120px;
          text-align: right;
        }
      }
    }
  }

  .operate {
    padding: 12px;

    span {
      font-size: 13px;
    }

    .el-button {
      margin-left: 16px;
    }
  }
}
</style>