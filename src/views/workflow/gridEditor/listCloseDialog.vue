<template>
  <div class="test">
    <el-form label-width="120px" ref="formRef" :model="data" :rules="formRules">
      <div class="projectInfo">
        <div  class="formData">
          <h4>请填写关闭原因</h4>
          <el-row v-if="type != 6 && type != 5 && type != 3 && type != 2">
            <el-col>
                <el-form-item label="关闭原因" label-width="120px">
                  <el-select v-model="data.name" 
                  @change="selectChange($event)"
                  placeholder="请选择" style="width:100%">
                    <el-option
                      v-for="item in options"
                      :key="item.ConfigValue"
                      :label="item.ConfigName"

                      :value="item.ConfigValue"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
             
              <el-form-item
                v-if="type != 6 && type != 5 && type != 3 && type != 2 && data.name == 99"

                label-width="120px"
                prop="closeCause"
              >
                <el-input
                  type="textarea"
                  v-model="data.closeCause"
                  style="width: 100%"
                  minRows="3"
                  clearable
                  :rows="4"
                  minlength='4'
                  placeholder='最少4个汉字'
                  name="closeCause"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="dialogfooter">
        <el-button size="small" type="primary" @click="submitForm()"
          ><i class="fa fa-save" />确认
        </el-button>
        <el-button id="btn_cancel" size="small" @click="closeEdit"
          ><i class="fa fa-minus-circle" />取消
        </el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import { thisTypeAnnotation } from "@babel/types";

export default {
  data() {
    return {
      type: '', // 6 5 3 2开启  其余关闭 
      data: {
        type: "",
        id: "",
        closeCause: "",
        requiredType: "",
        name:'',
      },
     
      formRules: {
        closeCause: [
          {
            required: false,
            message: "请输入关闭原因",
            trigger: "blur",
          },
        ],
      },
      options: [],
    };
  },
  mounted() {
    var that = this;
    var parms = decodeURI(that.$route.query.parms);
    that.obj = JSON.parse(parms);
    that.data.requiredType = that.obj.requiredType
      ? that.obj.requiredType
      : "get";
    that.data.url = that.obj.url;
    that.data.type = that.obj.type;
    that.type = that.obj.type;
    that.data.id = that.obj.id;
    //that.data.closeCause = that.obj.closeCause;
  },

  created() {
    var that = this
    let data = {
      searchtext: "项目主动关闭原因",
      searchfields: "ConfigType,ConfigName",
      ConfigType: "",
      ConfigName: "",
      ConfigValue: "",
      IsEnable: "",
      ConfigKey: "",
      ParentConfigKey: "",
      OrderNo: "",
      Flag: "",
      page: 1,
      rows: 20,
      sort: "",
      order: "",
    };
    let url = `/workflow/fuiFramework/getViewTableListData/?deforder=asc&defsort=ConfigType&viewTable=f2bpm_sys_DataDict&dataSource=&configTableName=&isEnableAuthor=0&defaultWhere=`;
    $.extendAjax(
      url,
      data,
      "post",
      function (d) {
        that.options = d.rows;
      },
      "application/x-www-form-urlencoded"
    );
  },
  methods: {
    //关闭弹窗
    closeEdit() {
      FUI.Window.closeEdit();
    },
    //提交
    submitForm() {
      var that = this;
      that.$refs.formRef.validate((valid) => {
        if (valid) {
            let requiredData = {
              myId: that.data.id,
              closeCause: that.data.name,
              closeMemo:that.data.closeCause
            };
            $.extendAjax(
              that.data.url,
              JSON.stringify(requiredData),
              that.data.requiredType,
              function (res) {
                if (res.code === 200) {
                  FUI.Window.showMsg(
                    `项目${that.type == 6 || that.type == 5 || that.type == 3 || that.type == 2 ? "已开启" : "已关闭"}`
                  );
                  setTimeout(function () {
                    FUI.Window.closeEdit(true);
                  }, 1000);
                } else {
                  FUI.Window.showMsg2(res.msg);
                }
              }
            );
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    selectChange(item){
      if(item == 99){
       this.formRules.closeCause[0].required = true
      }else{
       this.formRules.closeCause[0].required = false
      }
    }
  },
};
</script>

<style lang="scss" scoped>
.dialogfooter {
  position: absolute;
  left: 5%;
  height: 30px;
  width: 90%;
  text-align: center;
  padding: 0;
  display: flex;
  justify-content: flex-end;
  bottom: 20px;
}
.test {
  .layui-layer-btn {
    display: none !important;
  }

  .title {
    vertical-align: middle;
    display: flex;
    align-items: center;
    font-size: 16px;
    color: #0099ff;
    border-bottom: 1px solid #f3f3f3;
    padding-bottom: 5px;
  }

  .title::before {
    content: "";
    display: inline-block;
    width: 4px;
    height: 20px;
    margin-right: 5px;
    background-color: #0099ff;
  }

  .projectInfo {
    margin-bottom: 10px;
    padding: 5px;
    background-color: #fff;

    .formData {
      width: 90%;
      font-size: 15px;
      line-height: 26px;
     
      padding: 5px 0;
      h4 {
        font-size: 14px;
        line-height: 40px;
        color: #333;
        text-align: center;
        margin-bottom: 5px;
      }
    }
  }

  .footer {
    background-color: #fff;
    padding: 5px;
  }
}
</style>