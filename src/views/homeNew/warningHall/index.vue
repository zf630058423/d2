<template>
  <div id="warningHall" class="auto-window-height-select warningHall-container">
    <div class="ml10 mr10 p15 mb20 mt20 bg-white">
      <span class="demonstration">年 份：</span>
      <el-date-picker
        v-model="value2"
        type="year"
        placeholder="选择年份">
      </el-date-picker>
      <el-button type="primary" style="margin-left: 20px">查 询</el-button>
    </div>
    <div class="ml10 mr10">
      <el-row :gutter="20" class="warningHall-chart">
        <el-col :span="12" class="warningHall-left-content">
          <el-card class="warningHall-chart-card-1 " shadow="never">
            <div slot="header" class="clearfix">
              <span class="card-header-title">年度预警曲线图</span>
              <el-date-picker
                style="float: right;color: #C0C4CC"
                v-model="value2"
                type="daterange"
                align="right"
                unlink-panels
                range-separator="--"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                size="mini"
                :picker-options="pickerOptions">
              </el-date-picker>
            </div>
            <div>
              <line-chart setId="chart-16"></line-chart>
            </div>
          </el-card>

          <el-card class="warningHall-chart-card-3 " shadow="never">
            <div slot="header" class="clearfix">
              <span class="card-header-title">工程管理类预警</span>
            </div>
            <div class=" mt10 warningHall-data">
              <el-row :gutter="20">
                <el-col :span="6" v-for="(item, index) in warningHallList" :key="index">
                  <div class="warningHall-data-item">
                    <div class="warningHall-data-item-title">
                      {{item.label}}
                    </div>
                    <div class="warningHall-data-item-num">
                      <div>
                        <span class="warningHall-icon-class" :class="item.icon"></span>
                        <span class="warningHall-data-item-text">{{item.text}}</span>
                      </div>
                      <div class="warningHall-data-item-num">{{item.value}}</div>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-card>
        </el-col>

        <el-col :span="6" class="warningHall-right-content">
          <el-card class="warningHall-chart-card-1 " shadow="never">
            <div slot="header" class="clearfix">
              <span class="card-header-title">年度预处理率</span>
            </div>
            <div>
              <speed-chart setId="chart-17" data1="400" data2="1000"></speed-chart>
            </div>
            <div class="warningHall-province-data">
              <el-row :gutter="25">
                <el-col :span="8">
                  <div class="warningHall-province-data-item">
                    <div class="warningHall-province-data-item-text">
                      <div class="warningHall-province-data-item-text-num">12</div>
                      <div class="warningHall-province-data-item-text-label" style="color: #FF665F">总预警数(条)</div>
                    </div>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="warningHall-province-data-item">
                    <div class="warningHall-province-data-item-text">
                      <div class="warningHall-province-data-item-text-num">12</div>
                      <div class="warningHall-province-data-item-text-label" style="color: #538EFF">已处理预警(条)</div>
                    </div>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="warningHall-province-data-item">
                    <div class="warningHall-province-data-item-text">
                      <div class="warningHall-province-data-item-text-num">120</div>
                      <div class="warningHall-province-data-item-text-label" style="color: #38B781">待处理预警(条)</div>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </div>

          </el-card>
          <el-card class="warningHall-chart-card-3 " shadow="never">
            <div slot="header" class="clearfix">
              <span class="card-header-title">财务管理类预警</span>
            </div>
            <div class=" mt10 warningHall-data">
              <el-row :gutter="20">
                <el-col :span="12" v-for="(item, index) in warningHallList2" :key="index">
                  <div class="warningHall-data-item">
                    <div class="warningHall-data-item-title">
                      {{item.label}}
                    </div>
                    <div class="warningHall-data-item-num">
                      <div>
                        <span class="warningHall-icon-class" :class="item.icon"></span>
                        <span class="warningHall-data-item-text">{{item.text}}</span>
                      </div>
                      <div class="warningHall-data-item-num">{{item.value}}</div>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6" class="warningHall-right-content">
          <el-card class="warningHall-chart-card-1 " shadow="never">
            <div slot="header" class="clearfix">
              <span class="card-header-title">预警处理动态</span>
            </div>
              <div class="warningHall-announcement-list">
                <div v-for="o in 6" :key="o" class="announcement-item">

                    <div class="el-icon-bell" style="font-size: 15px;color: #F56C6C"></div>

                    <div style="word-break: break-all;overflow:hidden; white-space: nowrap; text-overflow: ellipsis;-o-text-overflow:ellipsis;">
                      <span style="color: #161616;padding: 0 10px">{{'张三' + o }}</span>
                      <span style="color: #538EFF">刚刚处理了清风大厦装饰装修工程 项目竣期30天预警</span>
                    </div>

                </div>
              </div>

          </el-card>
          <el-card class="warningHall-chart-card-3 " shadow="never">
            <div slot="header" class="clearfix">
              <span class="card-header-title">营销投标类预警</span>
            </div>
            <div class=" mt10 warningHall-data">
              <el-row :gutter="20">
                <el-col :span="12" v-for="(item, index) in warningHallList3" :key="index">
                  <div class="warningHall-data-item">
                    <div class="warningHall-data-item-title">
                      {{item.label}}
                    </div>
                    <div class="warningHall-data-item-num">
                      <div>
                        <span class="warningHall-icon-class" :class="item.icon"></span>
                        <span class="warningHall-data-item-text">{{item.text}}</span>
                      </div>
                      <div class="warningHall-data-item-num">{{item.value}}</div>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <div class="ml10 mr10 bg-white">
        <el-row :gutter="20">
          <el-col :span="24">
          <div class="warningHall-table-screen">
            <el-input placeholder="预警标题" v-model="input3" class="warningHall-table-screen-input" style="width: 240px" size="small">
            </el-input>
            <el-input placeholder="立项编号/立项名称" v-model="input3" class="warningHall-table-screen-input" style="width: 240px" size="small">
            </el-input>
            <el-input placeholder="立项编号/立项名称" v-model="input3" class="warningHall-table-screen-input" style="width: 240px" size="small">
            </el-input>
            <el-input placeholder="责任人" v-model="input3" class="warningHall-table-screen-input" style="width: 240px" size="small">
            </el-input>
            <div style="display: inline-block">
              <label style="font-weight: bold;display: inline-block;margin-left: 60px;margin-right: 20px">立项状态:</label>
              <el-checkbox-group v-model="checkList" style="display: inline-block" size="small">
                <el-checkbox label="待处理"></el-checkbox>
                <el-checkbox label="已处理"></el-checkbox>
                <el-checkbox label="全部"></el-checkbox>
              </el-checkbox-group>
            </div>
            <div style="display: inline-block;margin-left: 60px">
              <el-button type="primary" icon="el-icon-search" size="small">搜索</el-button>
              <el-button type="primary" plain size="small">导出<i class="el-icon-download el-icon--right"></i></el-button>
            </div>
          </div>
            <el-divider></el-divider>
          <el-table :data="tableData" style="width: 100%" v-bind:header-cell-style="{background:'#f7f7f7',color:'#000000',fontWeight:'bold'}">
            <el-table-column type="index" width="50" label="序号">
            </el-table-column>
            <el-table-column label="操作" >
              <template slot-scope="scope">
                <el-button type="text">处理</el-button>
                <el-button type="text">查看</el-button>
              </template>
            </el-table-column>
            <el-table-column label="处理状态">
              <template slot-scope="scope">
                <span >待处理</span>
              </template>
            </el-table-column>
            <el-table-column label="预警标题" >
              <template slot-scope="scope">
                <span >{{ scope.row.date }}</span>
              </template>
            </el-table-column>
            <el-table-column label="预警编号" >
              <template slot-scope="scope">
                <span >{{ scope.row.date }}</span>
              </template>
            </el-table-column>
            <el-table-column label="立项/项目编号" >
              <template slot-scope="scope">
                <span >{{ scope.row.date }}</span>
              </template>
            </el-table-column>
            <el-table-column label="营销单位" >
              <template slot-scope="scope">
                <span >{{ scope.row.date }}</span>
              </template>
            </el-table-column>
            <el-table-column label="施工单位" >
              <template slot-scope="scope">
                <span >{{ scope.row.date }}</span>
              </template>
            </el-table-column>
            <el-table-column label="截止当前未处理天数" >
              <template slot-scope="scope">
                <span >{{ scope.row.date }}</span>
              </template>
            </el-table-column>
            <el-table-column label="责任人" >
              <template slot-scope="scope">
                <span >{{ scope.row.date }}</span>
              </template>
            </el-table-column>
            <el-table-column label="发送时间" >
              <template slot-scope="scope">
                <span >{{ scope.row.date }}</span>
              </template>
            </el-table-column>
          </el-table>
            <div class="mb10 mt10 pl20 pr20">
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :page-sizes="[100, 200, 300, 400]"
                :page-size="100"
                layout="total, sizes, prev, pager, next, jumper"
                :total="400">
              </el-pagination>
            </div>
          </el-col>
        </el-row>
    </div>
  </div>
</template>

<script>
  import LineChart from '../projectHall/projectMarketCharts/mLine';
  import SpeedChart from '../projectHall/projectMarketCharts/speed'
  export default {
    name: "warningHall",
    components:{
      LineChart,SpeedChart
    },
    data() {
      return {
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        value1: '',
        value2: '',
        checkList:[],
        input3: null,
        getColor: '#6171FC',
        pieChartData2:{
          color: "#6171FC",
          data1: 300, // 进度条的val
          data2: 400, // 灰色部分val
        },
        warningHallList: [
          {
            icon: 'el-icon-warning',
            label: '项目竣工期',
            text: '≤30天',
            value: '6'
          },
          {
            icon: 'el-icon-warning',
            label: '收支占比≥80%',
            text: '≥30天投标无结果',
            value: '5'
          },
          {
            icon: 'el-icon-warning',
            label: '成本超支',
            text: '超支',
            value: '10'
          },
          {
            icon: 'el-icon-warning',
            label: '项目计划',
            text: '≥30天未填报',
            value: '10'
          },
          {
            icon: 'el-icon-warning',
            label: '开票',
            text: '＞产值+10%',
            value: '5'
          },
          {
            icon: 'el-icon-warning',
            label: '工期',
            text: '异常',
            value: '2'
          },
          {
            icon: 'el-icon-warning',
            label: '未提目标成本',
            text: '≥30天',
            value: '5'
          }
        ],
        warningHallList2:[
          {
            icon: 'el-icon-warning',
            label: '借款逾期',
            text: '逾期',
            value: '6'
          },
          {
            icon: 'el-icon-warning',
            label: '回款逾期',
            text: '逾期',
            value: '5'
          },
          {
            icon: 'el-icon-warning',
            label: '未预缴',
            text: '预警',
            value: '10'
          },
          {
            icon: 'el-icon-warning',
            label: '供应商',
            text: '异常',
            value: '10'
          }
        ],
        warningHallList3:[
          {
            icon: 'el-icon-warning',
            label: '未跟进',
            text: '≥30天',
            value: '6'
          },
          {
            icon: 'el-icon-warning',
            label: '投标无结果',
            text: '≥30天',
            value: '5'
          },
          {
            icon: 'el-icon-warning',
            label: '保证金',
            text: '逾期未退',
            value: '10'
          },
          {
            icon: 'el-icon-warning',
            label: '客户',
            text: '异常',
            value: '10'
          }
        ],
        tableData: [{
          date: '2016-05-02',
          name: '王小虎',
          number: 20,
          tag: '家'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          number: 20,
          tag: '公司'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          number: 20,
          tag: '家'
        }, {
          date: '2016-05-03',
          name: '王小虎',
          number: 20,
          tag: '公司'
        },{
          date: '2016-05-02',
          name: '王小虎',
          number: 20,
          tag: '家'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          number: 20,
          tag: '公司'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          number: 20,
          tag: '家'
        }, {
          date: '2016-05-03',
          name: '王小虎',
          number: 20,
          tag: '公司'
        }]
      }
    },
    methods:{
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
      }
    }
  }
</script>

<style scoped>
  @import "~@/resources/css/warningHall.css";

  .warningHall {
    border: 1px solid;
  }

  .warningHall-left-content, .warningHall-right-content {
    min-height: 756px;
    /*background: #FAFAFA;*/
    border: 1px solid;
  }

  .warningHall-chart-card-1 {
    height: 418px;
    /*background: rgba(255, 255, 255, 0.39);*/
    opacity: 1;
    background: #FFFFFF;
    border-radius: 4px;
    margin-bottom: 20px;
  }

  .warningHall-chart-card-2 {
    height: 856px;
    background: rgba(255, 255, 255, 0.39);
    background: #FFFFFF;
    opacity: 1;
    border-radius: 4px;
    margin-bottom: 20px;
  }
  .warningHall-chart-card-3 {
    height: 318px;
    /*background: rgba(255, 255, 255, 0.39);*/
    opacity: 1;
    background: #FFFFFF;
    border-radius: 4px;
    margin-bottom: 20px;
  }
  .warningHall-data-item {
    border: 1px solid #eaeaea;
    height: 90px;
    padding: 15px 20px;
    margin: 10px auto;
    background: #FFFFFF;
  }

  .warningHall-data-item .warningHall-data-item-title {
    font-size: 16px;
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;;
    font-weight: 600;
    line-height: 22px;
    color: #595959;
    opacity: 1;

  }

  .warningHall-data-item .warningHall-data-item-num {
    margin-top: 5px;
    font-size: 18px;
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;;
    font-weight: 600;
    line-height: 25px;
    color: #FF665F;
    opacity: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .warningHall-data-item .warningHall-data-item-text {
    font-size: 12px;
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;;
    font-weight: 400;
    line-height: 17px;
    color: #777777;
    opacity: 1;
  }
  .warningHall-data-item .warningHall-icon-class {
    font-size: 13px;
    margin-right: 6px;
  }
  .warningHall-table-screen{
    padding: 20px 20px 0 20px;
  }
  .warningHall-table-screen-input{
    margin-right: 20px;
  }
  .warningHall .el-divider--horizontal{
    margin: 10px 0;
  }
</style>
