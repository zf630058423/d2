<template>
  <div class="mb20">
    <!--<el-calendar class="cal">-->
    <!--<template v-model="timeValue" slot="dateCell" slot-scope="{date, data}">-->
    <!--<div @click="clickCalendar(data)"> &lt;!&ndash;这里原本有动态绑定的class，去掉&ndash;&gt;-->
    <!--{{ data.day.split('-').slice(2).join('-') }}<br />-->

    <!--<div style="font-size: 13px;font-weight: bold;word-break: break-all" :class="'color_'+ my_date(data.day).level">-->
    <!--<span class="el-icon-message-solid" v-show="my_date(data.day).level"></span>-->
    <!--<span> {{(my_date(data.day)).content}}</span>-->
    <!--</div>-->
    <!--</div>-->
    <!--</template>-->
    <!--</el-calendar>-->
    <el-calendar v-model="value" id="calendar">
      <!-- 这里使用的是 2.5 slot 语法，对于新项目请使用 2.6 slot 语法-->
      <template
        slot="dateCell"
        slot-scope="{date, data}">
        <!--自定义内容-->
        <div style="display: flex">
          <div class="calendar-day">{{ data.day.split('-').slice(2).join('-') }}</div>
          <div class="calendar-content">
            <div v-for="(item,index) in calendarDataList" :key="index">
              <div v-if="!item.billNo">
                <div v-if="(((item.calendarDate).split(' ')[0]).split('-')[1]).indexOf(data.day.split('-').slice(1)[0])!=-1">
                  <div v-if="(((item.calendarDate).split(' ')[0]).split('-')[2]).indexOf(data.day.split('-').slice(2).join('-'))!=-1">
                    <div v-if="item.createId === getUserId">
                      <el-tooltip class="item" effect="dark" :content="item.dailyConDailyContenttent" placement="right">
                        <div class="is-selected" @click="clickCalendar(item, '0')">
                          <span class="el-icon-date" :class="'color_'+ item.importantGrade"></span>
                          <span>[{{((item.calendarDate).split(' ')[1]).split(':')[0]+':'+((item.calendarDate).split(' ')[1]).split(':')[1]}}]</span>
                          <span> {{item.dailyConDailyContenttent}}</span>
                        </div>
                      </el-tooltip>
                    </div>
                    <div v-else></div>
                  </div>
                  <div v-else></div>
                </div>
                <div v-else></div>
              </div>
              <div v-else>
                <div v-if="(((item.meetingStartTime).split(' ')[0]).split('-')[1]).indexOf(data.day.split('-').slice(1)[0])!=-1">
                  <div v-if="(((item.meetingStartTime).split(' ')[0]).split('-')[2]).indexOf(data.day.split('-').slice(2).join('-'))!=-1">
                    <el-tooltip class="item" effect="dark" :content="item.meetingTheme" placement="right">
                      <div class="is-selected" @click="clickCalendar(item,'1')" v-if="item.procInstState === '3' || item.procInstState === 3">
                        <span style="color: rgb(40, 191, 123);font-weight: bold">「会议」</span> <!--:class="'color_'+ item.importantGrade" class="el-icon-tickets" -->
                        <span>{{item.meetingTheme}}</span>
                      </div>
                    </el-tooltip>
                  </div>
                  <div v-else></div>
                </div>
                <div v-else></div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </el-calendar>

    <!-- 日程弹窗 -->
    <AddCanlendar ref="canlendarDialog" @handleSuccess="handleSuccess"></AddCanlendar>
  </div>
</template>
<script>
  import AddCanlendar from "./canlendarDialog";
  import api from '@/Api/home/workSpace';

  export default {
    components: {
      AddCanlendar,
    },
    data() {
      return {
        value: new Date(),
        notLabel: [],
        label: [],
        canlendarData: [],
        loading: false,
        val: 0,
        timeValue: new Date(),
        getUserId: null,
        calendarDataList: []

      };
    },
    computed: {},
    created() {
      this.$nextTick(() => {
        // 点击前一个月
        let prevBtn = document.querySelector(
          ".el-calendar__button-group .el-button-group>button:nth-child(1)"
        );
        prevBtn.addEventListener("click", (e) => {
          let resDate = this.getPreMonth();
          this.getCanlendarList(resDate.split('-')[0],resDate.split('-')[1]);
          console.log(resDate, '昨天')
        });
        //点击下一个月
        let nextBtn = document.querySelector(
          ".el-calendar__button-group .el-button-group>button:nth-child(3)"
        );
        nextBtn.addEventListener("click", (e) => {
          let resDate = this.getNextMonth();
          this.getCanlendarList(resDate.split('-')[0],resDate.split('-')[1]);
          console.log(resDate, '明天')
        });
        //点击今天
        let todayBtn = document.querySelector(
          ".el-calendar__button-group .el-button-group>button:nth-child(2)"
        );
        todayBtn.addEventListener("click", (e) => {
          let resDate = this.getNowMonth();
          this.getCanlendarList(resDate.split('-')[0],resDate.split('-')[1]);
          console.log(resDate, '今天')
        });
      });
    },
    mounted() {
      var time = new Date();
      var timeYear = time.getFullYear();
      var timeMonth = time.getMonth() + 1;
      if (timeMonth > 12) {
        timeMonth = 1;
        y++
      }
      this.getCanlendarList(timeYear,timeMonth);
    },
    methods: {
      // 获取日志列表
      async getCanlendarList(timeYear,timeMonth) {
        var monthLastDay = new Date(timeYear, timeMonth, 0).getDate(); //当前月月末日
        var yc = timeYear + "-" + (timeMonth < 10 ? "0" + timeMonth : timeMonth) + "-" + "01";
        var ym = timeYear + "-" + (timeMonth < 10 ? "0" + timeMonth : timeMonth) + "-" + (monthLastDay < 10 ? "0" + monthLastDay : monthLastDay);
        // console.log("月初=>", yc)
        // console.log("月末=>", ym)

        var that = this;
        var isOk = false;
        const data = {
          "meetingStartTime": yc,
          "meetingEndTime": ym,
          "pageSize": "30",
          "pageIndex": "0",
          "sort": ""
        };
        // $.extendAjax("/themeetingtoapplyfor/queryMeetingapplyNo", JSON.stringify(data), "post", function (res) {
        //   if (res.code === 200) {
        //     that.getUserId = that.$store.state.user.author.userId;
        //     that.calendarDataList = res.rows;
        //   } else {
        //     that.calendarDataList = [];
        //     return isOk
        //   }
        // });
       let res = await api.queryMeetingapplyNo(data);
       that.calendarDataList = res.rows || [];
       that.getUserId = that.$store.state.user.author.userId;
      },
      // 添加日程
      handleAdd() {
        this.$refs.canlendarDialog.handleOpen();
      },
      // 添加成功
      handleSuccess(state) {
        if(state === 1){
          this.$message({
            message: '添加成功',
            type: 'success'
          });
        }else {
          this.$message({
            message: '删除成功',
            type: 'success'
          });
        }
        var time = new Date();
        var timeYear = time.getFullYear();
        var timeMonth = time.getMonth() + 1;
        if (timeMonth > 12) {
          timeMonth = 1;
          y++
        }
        this.getCanlendarList(timeYear,timeMonth);
      },
      // 点击
      clickCalendar(item, val) {
        if(item){
          console.log(item);
          this.$refs.canlendarDialog.handleOpen(item,val);
        }
      },
      // 当月
      getNowMonth() {
        var date = new Date(this.value);
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        // month = month > 9 ? month : "0" + month;
        var nowMonth = year + "-" + month;
        return nowMonth;
      },
      // 上月
      getPreMonth() {
        // var arr = this.getNowMonth().split("-");
        // var year = arr[0]; //获取当前日期的年份
        // var month = arr[1]; //获取当前日期的月份
        var date = new Date(this.value);
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var year2 = year;
        var month2 = parseInt(month);
        if (month2 == 0) {
          //1月的上一月是前一年的12月
          year2 = parseInt(year2) - 1;
          month2 = 12;
        }

        // if (month2 < 10) {
        //   //10月之前都需要补0
        //   month2 = "0" + month2;
        // }
        var preMonth = year2 + "-" + month2;
        return preMonth;
      },
      //下月
      getNextMonth() {
        // var arr = this.getNowMonth().split("-");
        // var year = arr[0]; //获取当前日期的年份
        // var month = arr[1]; //获取当前日期的月份
        // var day = arr[2]; //获取当前日期的日
        var date = new Date(this.value);
        var year = date.getFullYear();
        var month = date.getMonth();
        var year2 = year;
        var month2 = parseInt(month) + 1;
        if (month2 == 13) {
          //12月的下月是下年的1月
          year2 = parseInt(year2) + 1;
          month2 = 1;
        }
        // if (month2 < 10) {
        //   //10月之前都需要补0
        //   month2 = "0" + month2;
        // }

        var nextMonth = year2 + "-" + month2;
        return nextMonth;
      }
    }
  };
</script>
<style lang="scss" scoped>
  .cal ::v-deep.el-calendar-day .calendar_nolabel {
    margin: 0 auto;
    padding: 2px;
    text-align: center;
  }

  .cal ::v-deep.el-calendar-day .calendar_label {
    border: 1px solid #F93937;
    border-radius: 50%;
    width: 23px;
    margin: 0 auto;
    padding: 2px;
    text-align: center;
  }

  .add-canlendar {
    width: 90%;
    height: 35px;
    line-height: 13px;
    background: #409eff;
    color: #fff;
    margin-top: 5px;
  }

  .color_1 {
    color: blue;
    padding: 0 3px;


  }

  .color_2 {
    color: orange;
    padding: 0 3px;


  }

  .color_3 {
    color: red;
    padding: 0 3px;
  }

  .calendar-day {
    text-align: left;
    /*color: #202535;*/
    line-height: 30px;
    font-size: 12px;
    height: auto;
    /*display: inline-block;*/
    /*border: 1px solid;*/
    padding: 0 10px;
  }

  .is-selected {
    /*color: #000000;*/
    font-size: 10px;
    padding: 5px;
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    /*border-bottom: 1px solid #EBEEF5;*/

  }

  #calendar .el-button-group > .el-button:not(:first-child):not(:last-child):after {
    content: '当月';
  }

  .calendar-content {
    /*display: inline-block;*/
    width: 100%;
    max-height: 75px;
    overflow: auto;
  }

  #calendar{
    ::v-deep .el-calendar-table__row {
      .prev, .next {
        // 修改非本月
        .el-calendar-day {
          background: #FAFAFA;
          color: #161616;
        }
      }

    }
  }

</style>
