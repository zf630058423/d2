
<template>
  <div class="test">
    <el-form label-width="120px" ref="formRef" :model="data" :rules="formRules">
      <div class="projectInfo">
        <div class="formData">
          <el-row :gutter="24" align="middle">
            <el-col>
              <el-form-item label="项目编号：" prop="projectNo">
                <el-input
                  v-model="data.projectNo"
                  disabled
                  style="width: 80%"
                  name="testName"
                >
                  <el-button
                    slot="append"
                    @click="
                      openCustomDialog(
                        '',
                        '项目编号',
                        'BPM_XiangMuBianHao_4419',
                        'ct_bpm_projectfiles',
                        800,
                        500,
                        0
                      )
                    "
                    icon="el-icon-search"
                  ></el-button>
                </el-input>
              </el-form-item>
              <el-form-item label="收支项目:" prop="subjCode">
                <el-input v-model="data.subjCode" disabled style="width: 80%">
                  <el-button
                    slot="append"
                    @click="
                      openCustomDialog2(
                        '',
                        '收支项目:',
                        'BPM_BalanceProject_8833',
                        'ct_bpm_balanceproject',
                        800,
                        500,
                        0
                      )
                    "
                    icon="el-icon-search"
                  ></el-button>
                </el-input>
              </el-form-item>
              <el-form-item label="收款性质:">
                <el-select
                  v-model="data.gatheringNature"
                  placeholder="请选择"
                  style="width: 80%"
                >
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.text"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
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
import { billClaimBank } from "@/Api/financialManagement/claimExpense";
export default {
  data() {
    return {
      isReadOnly: false,
      tableData: [],
      data: {
        projectId: "", //项目id
        myIds: [], //列表id
        projectNo: "", //项目编号
        gatheringNature: "", //收款性质
        subjCode: "", //收支项目
        projectName: "", //项目名称
        subjCodeId: "",
      },

      options: [
        {
          text: "预收款",
          value: "1",
        },
        {
          text: "进度款",
          value: "2",
        },
        {
          text: "完工款",
          value: "3",
        },
        {
          text: "结算款",
          value: "4",
        },
        {
          text: "质保金",
          value: "5",
        },
      ],
      formRules: {
        subjCode: [
          { required: true, message: "请选择收支项目名称", trigger: "change" },
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
    console.log(obj);
    that.data.myIds = obj;
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

    //关闭弹窗
    closeEdit() {
      FUI.Window.closeEdit();
    },
    //提交
    submitForm() {
      var that = this;
      var data = JSON.stringify(that.data);
      that.$refs.formRef.validate(async (valid) => {
        if (valid) {
          const res = await billClaimBank(data);
          if (res.code === 200) {
            FUI.Window.closeEdit(true);
          } else {
            FUI.Window.showMsg(res.msg);
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
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