<template>
  <div class="canlendar">
    <el-dialog :title="title" :visible.sync="dialogFormVisible" v-if="isShow">
      <el-form :model="form" :rules="rules" ref="ruleForm">
        <el-form-item label="重要等级：" prop="importantGrade" :label-width="formLabelWidth">
          <el-select v-model="form.importantGrade" placeholder="请选择" style="width: 200px">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="日程时间：" prop="calendarDate" :label-width="formLabelWidth">
          <el-date-picker v-model="form.calendarDate" format='yyyy-MM-dd HH:mm' type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日程时间"
                          style="width: 200px">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="日程内容：" prop="dailyConDailyContenttent" :label-width="formLabelWidth">
          <el-input type="textarea" v-model="form.dailyConDailyContenttent" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" v-if="isAdd" class="dialog-footer">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" @click="handleDeterminer">确 定</el-button>
      </div>
      <div slot="footer" v-else-if="!isAdd" class="dialog-footer">
        <el-button class="del-btn" @click="handleRemove">删除日程</el-button>
        <el-button type="primary" @click="handleClose">关闭</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="title" :visible.sync="dialogFormVisible2" v-else>
      <el-form :model="detailObj">
        <el-form-item label="会议主题：" :label-width="formLabelWidth">
          <span>{{detailObj.meetingTheme}}</span>
        </el-form-item>
        <el-form-item label="时间：" :label-width="formLabelWidth">
          <span>{{detailObj.meetingStartTime}}</span>
          <span> 至 </span>
          <span>{{detailObj.meetingEndTime}}</span>
        </el-form-item>
        <el-form-item label="地点：" :label-width="formLabelWidth">
          <span>{{detailObj.meetingRoom}}</span>
        </el-form-item>
        <el-form-item label="主持人：" :label-width="formLabelWidth">
          <span>{{detailObj.conferenceOrganizer}}</span>
        </el-form-item>
        <el-form-item label="发起人：" :label-width="formLabelWidth">
          <span>{{detailObj.createName}}</span>
        </el-form-item>
        <el-form-item label="会议议程：" :label-width="formLabelWidth">
          <el-button plain size="small" @click="handelMeetingDetail">查看</el-button>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  // import {postAddSchedule, deleteSchedule} from "@/api/home";

  export default {
    data() {
      return {
        dialogFormVisible: false,   //日程model
        dialogFormVisible2: false, // 会议model
        form: {
          meetingRoomId: null,
          importantGrade: null,
          dailyConDailyContenttent: null,
          calendarDate: null
        },
        detailObj: {},
        getMettingList: [],
        formLabelWidth: "120px",
        title: "",
        scheId: "",
        isAdd: true,
        isShow: true,
        // optionLabel: ['','一般','重要','很重要'],
        options: [
          {
            value: '1',
            label: "一般",
          },
          {
            value: '2',
            label: "重要",
          },
          {
            value: '3',
            label: "很重要",
          },
        ],
        // 表单校验
        rules: {
          importantGrade: [{required: true, message: "请选择等级", trigger: "change"}],
          dailyConDailyContenttent: [{required: true, message: "请输入内容", trigger: "blur"}],
          calendarDate: [
            {
              required: true,
              message: "请选择日期",
              trigger: "change",
            },
          ],
        },
      };
    },
    methods: {
      // 打开弹窗
      handleOpen(row, val) {
        if (row && val === '0') {
          this.title = "查看日程";
          //弹出日程信息
          this.form = JSON.parse(JSON.stringify(row));
          this.scheId = JSON.parse(JSON.stringify(row)).myId;
          this.isAdd = false;
          this.isShow = true;
          this.dialogFormVisible = true;
        } else if (row && val === '1') {
          this.title = "查看会议";
          //弹出会议信息
          this.detailObj = JSON.parse(JSON.stringify(row));
          this.scheId = JSON.parse(JSON.stringify(row)).myId;
          this.isAdd = false;
          this.isShow = false;
          this.dialogFormVisible2 = true;
        } else {
          this.title = "添加日程";
          this.isAdd = true;
          this.isShow = true;
          this.dialogFormVisible = true;
          this.$nextTick(() => {
            this.form = {};
            this.$refs.ruleForm.resetFields();
          });
        }

      },
      // 删除日程
      handleRemove() {
        var that = this;
        this.$confirm('此操作将删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var myId = this.scheId;
          $.extendAjax(`/themeetingtoapplyfor/delMeetingapply?myId=${myId}`, '', "DELETE", function (res) {
            if (res.code === 200) {
              that.dialogFormVisible = false;
              that.$emit('handleSuccess', 2);
            }
          });
        })
      },
      handleClose() {
        this.dialogFormVisible = false;
      }
      ,
      // 点击取消
      handleCancel() {
        this.form = {};
        this.detailObj = {};
        this.dialogFormVisible = false;
        this.dialogFormVisible2 = false;
        this.$refs.ruleForm.resetFields();
      },
      // 点击确定
      handleDeterminer() {
        var that = this;
        that.$refs.ruleForm.validate((val) => {
          if (val) {
            const data = {
              userId: that.$store.state.user.userId,
              calendarDate: that.form.calendarDate,
              dailyConDailyContenttent: that.form.dailyConDailyContenttent,
              importantGrade: that.form.importantGrade
            };
            $.extendAjax("/themeetingtoapplyfor/addMeetingapply", JSON.stringify(data), "post", function (res) {
              if (res.code === 200) {
                that.dialogFormVisible = false;
                that.$emit('handleSuccess', 1);
              }
            });
          } else {
            that.dialogFormVisible = true;
          }
        });
      },
      // 查看会议详情
      handelMeetingDetail(){
        var val = this.$store.state.user.author.tenantId;
        var table = 'ct_' + val + '_MeetingApply';
        var id = this.scheId;
        this.getWiid(table,id)
      },
      // 超链接
      getWiid(tableName, id) {
        //tableName:需要跳转到的表单的表名
        // id： 需要跳转到的表单的myID
        // 流程表单跳转
        setTimeout(function () {
          var data = [{
            "tableName": tableName,
            "myId": id
          }]
          $.extendAjax("/extend/hyperLink/getHyperLink", JSON.stringify(data), "post", function (res) {
            if (res) {
              var __webpath = '';
              var appId = '';
              var formAction = 3;
              var wiid = res.data[0].wiId;
              var url = __webpath + '/workflow/workflowform/index/?appId=' + appId + '&formAction=' + formAction + '&wiid=' + wiid;
              window.open(url, '_blank');
              console.log(res)
            }
          });
        }, 500)

      }
    },
  }
</script>
