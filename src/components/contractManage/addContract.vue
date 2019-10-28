<template>
  <div id="addContract">
    <div style="background:#fff">
      <div class="add_title">
        <el-button size="mini" type="primary" icon="el-icon-back" @click="$router.go(-1)">返回</el-button>
        <p>新增合同模板</p>
      </div>
    </div>
    <div class="search">
      <el-form
        :model="contractInfo"
        :rules="rules"
        label-position="right"
        class="demo-form-inline"
        ref="contractInfo"
        label-width="auto"
      >
        <el-form-item label="合同名称：">
          <el-input v-model="contractInfo.name" class="brand_input" placeholder="请输入合同名称"></el-input>
        </el-form-item>
        <el-form-item label="是否启用：">
          <el-switch v-model="contractInfo.enabled" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
        </el-form-item>
      </el-form>
      <el-button type="danger" plain @click="openDialog">选取字段名</el-button>
    </div>
    <!-- 字段名对话框 -->
    <el-dialog
      title="字段"
      :visible.sync="dialogVisible"
      width="30%"
      :modal-append-to-body="false"
      style="z-index:999"
    >
      <div class="title">
        <div class="button-wrap">
          <div v-for="(val,key) in filedName" :key="key" style="border-bottom:1px solid #eaeaea;">
            <p style="text-align:center">{{key}}</p>
            <el-button
              v-for="item in val"
              :key="item.name"
              type="primary"
              size="mini"
              @click="insert(item.description)"
            >{{item.description}}</el-button>
          </div>
        </div>
      </div>
    </el-dialog>
    <div id="editorMenu" class="editorMenu" ref="singleText"></div>
    <div id="editor" class="editor" ref="content" @click="selectLight"></div>
    <div style="text-align:center;padding:20px">
      <el-button type="primary" @click="addContractTemplete">确定</el-button>
    </div>
  </div>
</template>
<script>
import E from "wangeditor";
import "wangeditor/release/wangEditor.min.css";
import { mapState, mapMutations } from "vuex";
import http from "@/api/contractApi";
export default {
  data() {
    return {
      contractInfo: {
        enabled: true
      },
      rules: {},
      dialogVisible: false,
      exconten: "",
      editor: "",
      info: "",
      selectContent: `aaa`,
      range: {},
      filedName: {},
      pageType: "",
      id: ""
    };
  },
  computed: {
    ...mapState(`user`, [`access_token`, `tenantId`])
  },
  mounted() {
    this.editor = new E("#editor");
    this.editor.customConfig.zIndex = 100;
    console.log(this.editor);
    this.editor.create();
    // this.editor.txt.html();

    this.selectLight();
    this.getContractStatus();
  },
  activated() {
    this.pageType = this.$route.query.pageType;
    if (this.pageType == "add") {
      this.contractInfo = {
        enabled: true
      };
    }
    if (this.$route.query.id) {
      this.id = this.$route.query.id;
      this.getTemplateInfo(this.$route.query.id);
    }
  },
  deactivated() {
    this.editor.txt.clear();
  },
  methods: {
    openDialog() {
      this.dialogVisible = true;
    },
    getTemplateInfo(id) {
      let { tenantId } = this;
      http.getTemplateDetail(tenantId, id).then(data => {
        if (data.code == 0) {
          let templateInfo = data.data
          this.contractInfo = {
            name: templateInfo.name,
            content: templateInfo.content,
            enabled: templateInfo.enabled
          };
          this.editor.txt.html(templateInfo.content);
        }
      });
    },
    // 获取光标位置
    setCursor(textDom, pos) {
      if (textDom.setSelectionRange) {
        textDom.focus();
        textDom.setSelectionRange(pos, pos);
      } else if (textDom.createTextRange) {
        const range = textDom.createTextRange();
        range.collapse(true);
        range.moveEnd("character", pos);
        range.moveStart("character", pos);
        range.select();
      }
    },
    insert(myValue) {
      let newSpan = document.createElement("span");
      newSpan.className = "newSpan";
      newSpan.style.color = "red";
      console.log(document.getElementsByClassName("newSpan"));
      newSpan.setAttribute(
        "data-item",
        document.getElementsByClassName("newSpan").innerHTML
      );

      newSpan.appendChild(document.createTextNode("{{" + myValue + "}}"));
      console.log(newSpan);
      //插到光标处
      this.range.insertNode(newSpan);
      this.dialogVisible = false;
    },
    selectLight() {
      console.log(`aaa`);
      let range = window.getSelection().getRangeAt(0);
      this.range = range;
      console.log(range);
      //新建标签及内容
    },
    //添加合同模板或删除
    addContractTemplete() {
      let content = this.editor.txt.html();
      this.contractInfo.content = content;
      let params = this.contractInfo;
      let tenantId = this.tenantId;
      let id = this.id;
      if (this.pageType == "add") {
        http.addContractTem(params, tenantId).then(data => {
          if (data.code == 0) {
            this.$router.back(-1);
          }
        });
      } else {
        http.editContractTemplate(params, tenantId, id).then(data => {
          if (data.code == 0) {
            this.$message(`修改成功`);
            this.$router.back(-1);
            this.editor.txt.clear();
          }
        });
      }
    },
    getContractStatus() {
      http.getContractTemStatus().then(data => {
        if (data.code == 0) {
          console.log(data.data);
          let variablesInfo = data.data;
          this.filedName = variablesInfo;
        }
      });
    }
  }
};
</script>
<style lang="stylus" scoped>
#addContract {
  margin: 0 24px;

  .add_title {
    padding: 12px 20px;
    border-bottom: 1px solid #eaeaea;
    font-size: 14px;
    display: flex;
    align-items: center;

    p {
      font-size: 16px;
      margin-left: 20px;
    }
  }

  .demo-form-inline {
    display: flex;
    align-items: center;

    .el-form-item {
      margin-right: 24px;
    }
  }

  .search {
    background: #fff;
    display: flex;
    align-items: center;
    padding: 8px 12px 8px 12px;
    border-bottom: 1px solid #eee;
    justify-content: space-between;
  }

  .button-wrap {
    .el-button {
      margin: 8px;
    }
  }

  .editorMenu {
    border: 1px solid #ccc;
  }

  .editor {
    margin-top: -1px; // 将多出来的一像素边框隐藏
    border: 1px solid #ccc;
    min-height: 400px; // 编辑框最小高度
    height: auto; // 编辑框高度超过最小高度会根据内容高度自适应
    background: #fff;
  }
}
</style>