
<template>
  <div class="test">
    <el-form label-width="120px" ref="formRef" :model="data" :rules="formRules">
      <div class="projectInfo">
        <div class="formData">
          <el-row :gutter="24" align="middle">
            <el-col>
              <el-form-item label="选中个数：">
                <span>{{data.selectedNum}}</span>
              </el-form-item>
              <el-form-item label="收款性质:" prop="subjCode">
                <el-select v-model="data.subjCode" placeholder="请选择" style="width: 80%">
                  <el-option v-for="(item,index) in ['22','5','13','99','4','10','14','19','55']" :key="index" :label="item | subjCodeFilter" :value="item">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="dialogfooter">
        <el-button size="small" type="primary" @click="submitForm"><i class="fa fa-save" />确认
        </el-button>
        <el-button id="btn_cancel" size="small" @click="closeEdit"><i class="fa fa-minus-circle" />取消
        </el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import { claimBank, writeBack } from "@/Api/financialManagement/claimExpense";
import {batchClaimBank} from "@/Api/common"
export default {
  data() {
    return {
      isReadOnly: false,
      tableData: [],
      data: {
        myIds: [], //发票信息采集列表id
        selectedNum:'', // 选择个数
        subjCode: "", //收支项目
      },
      formRules: {
        subjCode: [
          { required: true, message: "请选择收支项目", trigger: "change" },
        ],
      },
      parentId: "",
      id: "",
      type: "",
    };
  },
  mounted() {},

  created() {
    var that = this;
    var parms = decodeURI(that.$route.query.parms);
    var obj = JSON.parse(parms);
    that.data.myIds = obj.ids;
    that.data.selectedNum = obj.ids.length;
  },
  methods: {
    // 弹框调用 获取字段绑定
    // id：自定义对话框id
    // name：自定义对话框名称
    // code：自定义对话框别名
    // ObjName：自定义对话框数据对象名称（数据库表名）
    // width：弹框宽度
    // height：弹框高度
    // radioMultiple：是否多选
    openCustomDialog(id, name, code, ObjName, width, height, radioMultiple) {
      var that = this;
      var multi = radioMultiple == "1";
      CustomDialog(that, {
        customDialog: code,
        isTest: false,
        width: width,
        height: height,
        isMulti: multi,
        data: [
          {
            field: "ProjectNo",
            property: "ProjectNo",
          },
          {
            field: "projectId",
            property: "MyId",
          },
        ],
        callBack: function (data) {
          console.log(data);
          //自定义回调函数不是必须的，可删除
          that.data.projectNo = data[0].ProjectNo;
          that.data.projectId = data[0].MyId;
          that.data.projectName = data[0].ProjectName;
        },
      });
    },
    openCustomDialog2(id, name, code, ObjName, width, height, radioMultiple) {
      var that = this;
      var multi = radioMultiple == "1";
      CustomDialog(that, {
        customDialog: code,
        isTest: false,
        width: width,
        height: height,
        isMulti: multi,
        data: [
          {
            field: "expenditureContractNo",
            property: "MyId",
          },
        ],
        varParams: [
          {
            key: "ProjectId",
            value: that.data.projectId,
          },
        ],
        callBack: function (data) {
          console.log(data, 123);
          //自定义回调函数不是必须的，可删除
          that.data.subjCodeId = data[0].MyId;
          that.data.subjCode = data[0].NameBalancePayments;
        },
      });
    },
    openCustomDialog3(id, name, code, ObjName, width, height, radioMultiple) {
      var that = this;
      var multi = radioMultiple == "1";
      CustomDialog(that, {
        customDialog: code,
        isTest: false,
        width: width,
        height: height,
        isMulti: multi,
        data: [
          {
            field: "expenditureContractNo",
            property: "MyId",
          },
        ],
        varParams: [
          {
            key: "ProjectId",
            value: that.data.projectId,
          },
        ],
        callBack: function (data) {
          console.log(data, 123);
          //自定义回调函数不是必须的，可删除
          that.data.voucherNo = data[0].BillNo;
          that.data.voucherNoId = data[0].MyId;
        },
      });
    },
    //关闭弹窗
    closeEdit() {
      FUI.Window.closeEdit(true);
    },
    //求和
    sum(arr) {
      var s = 0;
      for (var i = arr.length - 1; i >= 0; i--) {
        s += arr[i];
      }
      return s;
    },
    max(arr) {
      let result = -Infinity;
      arr.forEach((item) => {
        if (item > result) {
          result = item;
        }
      });
      return result;
    },
    //提交
     submitForm() {
      var that = this;
       that.$refs.formRef.validate(async (valid) => {
         if (valid) {
         var data = {
           myIds: that.data.myIds,
           subjCode: that.data.subjCode
         };

         const res = await batchClaimBank(JSON.stringify(data));
         console.log(res);
         if (res.code === 200) {
           FUI.Window.showMsg('认领成功', "提示", "info", function() {
             that.closeEdit()
           });
         } else {
           FUI.Window.showMsg(res.msg);
         }
          } else {
            console.log('error submit!!');
            return false;
          }
      });

    }

  }
};
</script>

<style lang="scss" scoped>
.test {
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
      padding: 10px 0;
    }
  }

  .planCenter {
    min-height: 600px;
    background-color: #fff;
    padding: 5px;
    margin-bottom: 10px;

    .formData {
      padding: 10px 0;
    }
  }

  .footer {
    background-color: #fff;
    padding: 5px;
  }
}
</style>
