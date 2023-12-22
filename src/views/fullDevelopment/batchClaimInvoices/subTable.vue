<template>
  <div style="width: 100%;min-width: 400px">
    <div class="cd-tool">
      <el-button type="primary" size="small"
                 @click="openCustomDialog('' ,'发票信息(发票认领)', 'FaPiaoXinXiCaiJiFaPiaoRenLingZhuanYong' ,'ct_bpm_invoicecollection',800,500,0)">
        新增
      </el-button>
      <!--<el-button type size="mini" @click="batchEdit">批量编辑</el-button>-->
      <el-button type="danger" size="small" @click="batchDel">批量删除</el-button>
      <!--<el-button type size="mini" @click="saveTbale">保存</el-button>-->
    </div>
    <el-table :data="tableData" style="width: 100%;" row-key="id" :key="tableKey" border size="small" :height="getHeight+'px'"
              ref="cimsDictTable" @selection-change="handleSelectionChange" @select="select" @select-all="selectAll"
              header-row-class-name="data-table-header"  show-summary  :summary-method="getSummaries"
              :show-overflow-tooltip="true">

      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column label="序号" type="index" width="50"></el-table-column>
      <el-table-column label="发票号码" min-width="160px" :show-tooltip-when-overflow="true">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" :content="scope.row.invoiceNo" placement="top-start">
            <el-input style="width: 100%" type="text" v-model="scope.row.invoiceNo" size="small" placeholder="自动带出"
                      disabled></el-input>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="发票代码" class="is-required" min-width="150px" :show-tooltip-when-overflow="true">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" :content="scope.row.invoiceCode" placement="top-start">
            <el-input style="width: 100%" type="text" v-model="scope.row.invoiceCode" size="small" placeholder="自动带出"
                      disabled></el-input>
          </el-tooltip>

          <el-input style="width: 80%" v-model="scope.row.myId" size="small" placeholder="请输入"
                    v-show="false"></el-input>
          <el-input style="width: 80%" v-model="scope.row.invoiceProjectId" size="small" placeholder="请输入"
                    v-show="false"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="销售方名称" class="is-required" min-width="150px" :show-tooltip-when-overflow="true">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" :content="scope.row.sellerName" placement="top-start">
            <el-input style="width: 100%" type="text" v-model="scope.row.sellerName" size="small" placeholder="自动带出"
                      disabled></el-input>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="发票金额(含税)" class="is-required" min-width="150px">
        <template slot-scope="scope">
          <!--<el-input style="width: 100%" type="text" v-model="scope.row.invoiceAmount" size="small" placeholder="自动带出" disabled></el-input>-->
          <div class="el-input el-input__inner divInput">{{scope.row.invoiceAmount | qianfenWeiFormat}}</div>
        </template>
      </el-table-column>
      <el-table-column label="税额" class="is-required" width="150px">
        <template slot-scope="scope">
          <!--<el-input style="width: 100%" type="text" v-model="scope.row.tax" size="small" placeholder="自动带出" disabled></el-input>-->
          <div class="el-input el-input__inner divInput">{{scope.row.tax | qianfenWeiFormat}}</div>
        </template>
      </el-table-column>
      <el-table-column label="认领项目编号" class="is-required" width="170px">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" :content="scope.row.projectNo" placement="top-start">
            <el-input v-model="scope.row.projectNo" placeholder="请选择" disabled name="projectNo" size="small"
                      v-if="scope.row.invoiceProjectId && scope.row.projectNo"></el-input>
            <el-input v-model="scope.row.projectNo" placeholder="请选择" disabled name="projectNo" size="small" v-else>
              <el-button size="small" slot="append"
                         @click="openCustomDialog2('' ,'项目编号', 'BPM_XiangMuBianHao_4419' ,'ct_bpm_projectfiles',800,500,0,scope.row)"
                         icon="el-icon-search"></el-button>
            </el-input>
          </el-tooltip>

          <el-input style="width: 80%" type="text" v-model="scope.row.projectName" size="small" placeholder="请输入"
                    v-show="false"></el-input>
          <el-input style="width: 80%" type="text" v-model="scope.row.projectId" size="small" placeholder="请输入"
                    v-show="false"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="认领支出类合同编号" class="is-required" width="150px" :show-tooltip-when-overflow="true">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" :content="scope.row.expenditureContractNo" placement="top-start">
            <el-input v-model="scope.row.expenditureContractNo" placeholder="请选择" disabled name="expenditureContractNo"
                      size="small" v-if="scope.row.invoiceProjectId && scope.row.inputState"></el-input>
            <el-input v-model="scope.row.expenditureContractNo" placeholder="请选择" disabled name="expenditureContractNo" size="small" v-else>
              <el-button size="small" slot="append"
                         @click="openCustomDialog3('' ,'发票信息支出合同', 'BPM_expenditurecontract_3597','v_expenditurecontract',800,500,0,scope.row)"
                         icon="el-icon-search"></el-button>
            </el-input>
          </el-tooltip>
          <el-input style="width: 80%" type="text" v-model="scope.row.expenditureContractId" size="small"
                    placeholder="请输入" v-show="false"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="认领发票业务类型" class="is-required" width="150px">
        <template slot-scope="scope">
          <el-select v-model="scope.row.invoiceBizType" placeholder="请选择" style="width: 100%" size="small">
            <el-option v-for="item in ['1','2','3','4','5','6','7']" :key="item" :label="item | invoiceBizTypeFilter"
                       :value="item">
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="销售类项目" class="is-required" width="150px">
        <template slot-scope="scope">
          <el-radio-group v-model="scope.row.salesItem" size="small" v-if="scope.row.invoiceProjectId" disabled>
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
          <el-radio-group v-model="scope.row.salesItem" size="small" :disabled="!scope.row.radioState"
                          @change="changeRadio" v-else>
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </template>
      </el-table-column>
      <el-table-column label="认领金额(含税)(元)" class="is-required" width="150px">
        <template slot-scope="scope">
          <div class="el-input el-input__inner divInput" v-if="scope.row.invoiceProjectId">{{scope.row.amountClaimedTax
            | qianfenWeiFormat}}
          </div>
          <el-input style="width: 100%" type="text" v-else @change="getAddNumber(scope.row,'amountClaimedTax')"
                    v-model="scope.row.amountClaimedTax" size="small" placeholder="请输入"
                    :disabled="(scope.row.invoiceProjectId)?true:false"></el-input>

        </template>
      </el-table-column>
      <el-table-column label="认领税额(元)" class="is-required" width="150px">
        <template slot-scope="scope">
          <!--<el-input style="width: 100%" type="text"  v-model="scope.row.taxClaimedRate" size="small" placeholder="自动计算" disabled></el-input>-->
          <div class="el-input el-input__inner divInput">{{scope.row.taxClaimedRate | qianfenWeiFormat}}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="100">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="delRow(scope.row,scope.$index)">
            <span class="el-icon-remove-outline" style="font-size: 25px;color: red"></span>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import {getInvoiceInfo, submitInvoiceInfo} from '../../../Api/batchClaimInvoices'
  import { getMonkeyById } from "../../../Api/financialManagement/claimExpense";
  function filterNodes(nodes, query, filterName) {
    // 条件就是节点的filterName过滤关键字
    let predicate = function (node) {
      if (node[filterName].indexOf(query) > -1) {
        return true;
      } else {
        return false;
      }
    };
    if (!(nodes && nodes.length)) {
      return [];
    }
    let newChildren = [];
    for (let node of nodes) {
      let subs = filterNodes(node.details, query, filterName);

      if (predicate(node)) {
        newChildren.push(node);
      } else if (subs && subs.length) {
        node.details = subs;
        newChildren.push(node);
      }
    }
    return newChildren.length ? newChildren : [];
  }

  export default {
    name: "invoice-table",
    props: {
      setFormData: {
        type: Object,
        default: {}
      },
      isVaild: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        dialogVisibleMenu: false,
        ref: "cimsDictTable",
        tableKey: new Date().getTime(),
        enableSel: false,
        tableData: [],
        options: [],
        cimsDictTable: [],
        searchSource: [],
        searchValue: "",
        menuSource: [],
        defaultProps: {
          children: "details",
          label: "name",
        }, //菜单节点
        sourceData: [],
        getFormObj: this.setFormData,
        getHeight: 500
      };
    },
    created() {
      var h = document.getElementById('app').scrollHeight;
      this.getHeight = h-125-180;
      console.log(this.getHeight,'gaodu')
    },
    methods: {
      addTool() {
        let addrow = this.setRowData();
        this.tableData.push(addrow);
      },
      onMenuSl(obj, node, data) {
        this.id = obj.id;
      },
      search() {
        this.tableData = filterNodes(
          this.searchSource,
          this.searchValue,
          "targetCost"
        );
        this.refTable();
      },
      setRowData(pid) {
        return {
          myId: '',
          invoiceProjectId: "",
          invoiceNo: '',
          invoiceCode: "",
          sellerName: '',
          invoiceAmount: '',
          tax: '',
          projectNo: '',
          projectId: '',
          projectName: '',
          expenditureContractNo: '',
          expenditureContractId: '',
          expenditureContractName: '',
          invoiceBizType: '',
          salesItem: '',
          amountClaimedTax: '',
          taxClaimedRate: '',
          contractAmount: '',
          contractClaimAmount: '', // 合同认领金额
          id: new Date().valueOf(),
          radioState: true,
          inputState:false
        };
      },
      //表格选择操作方法
      // 手动勾选数据行
      select(selection, row) {
        // 判断当前行是否选中
        // 不需要判断 id, 因为引用地址相同
        const selected = selection.some((item) => item === row);
        // 处理所有子级
        this.selectChildren(row, selected);
      },
      selectAll(selection) {
        /*
         * 这里引用别人的代码:
         * selectAll 只有两种状态: 全选和全不选
         * 所以我们只需要判断一种状态即可
         * 而且也不需要判断 id, 因为 selection 和 this.data 中对象引用地址是相同的
         */
        // tableData 第一层只要有在 selection 里面就是全选
        const isSelect = this.tableData.some((item) => selection.includes(item));
        if (isSelect) {
          selection.forEach((item) => {
            this.selectChildren(item, isSelect);
          });
        } else {
          this.tableData.forEach((item) => {
            this.selectChildren(item, isSelect);
          });
        }
      },
      selectChildren(row, selected) {
        if (row["details"] && Array.isArray(row["details"])) {
          row["details"].forEach((item) => {
            this.toggleSelection(item, selected);
            this.selectChildren(item, selected);
          });
        }
      },
      selectionChange(selection) {
        this.debounce(this.tableSelectChange, 100, selection);
      },
      toggleSelection(row, select) {
        row &&
        this.$nextTick(() => {
          this.$refs[this.ref] &&
          this.$refs[this.ref].toggleRowSelection(row, select);
        });
      },
      cancelAll() {
        this.$refs[this.ref] && this.$refs[this.ref].clearSelection();
      },
      // 防抖
      debounce(fun, wait, params) {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(fun, wait, params);
      },
      getSelectedList() {
        //获取选中数据源
        let list = JSON.parse(JSON.stringify(this.cimsDictTable));
        list.forEach((e) => (e.details = null));
        return list;
      },
      checkSelected(data, mange) {
        //批量操作检查
        let v = data.length > 0;
        if (!v) {
          this.$message({
            type: "warning",
            message: mange,
          });
        }
        return v;
      },
      batchDel() {

        //批量删除
        if (!this.checkSelected(this.cimsDictTable, "至少选择一项")) {
          return;
        }
        let arr = this.getSelectedList();
        console.log(arr, '123123');
        this.$confirm(`删除选中的${arr.length}项目数据?`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            var tableData = this.tableData;
            for (let i in arr) {
              for (let j in tableData) {
                if (arr[i].id === tableData[j].id) {
                  tableData.splice(j, 1);
                }

              }
            }
          })
          .catch(() => {
          });
      },
      addRow(row, index) {
        console.log(row, index);
        if (!row.add) {
          //新增行数据
          let addrow = this.setRowData(row.id);
          //新增
          if (row.details) {
            row.details.push(addrow);
          } else {
            //添加数据
            this.$set(row, "details", [addrow]);
          }
          //高度撑开
          this.$emit('changeHeight');
          //展开行
          this.$nextTick(() => {
            //更新后打开节点
            this.$refs.cimsDictTable.toggleRowExpansion(row, true);
            //刷新树
            this.refTable();
          });
        } else {
          this.$message({
            message: "请保存后再继续添加子节点!",
            type: "warning",
          });
        }
      },
      updateTableTree(pid, nodes) {
        //更新需要先更新上级节点
        this.$set(
          this.$refs.cimsDictTable.store.states.lazyTreeNodeMap,
          pid,
          nodes
        );
      },
      refTable() {
        let _this = this;

        function dg(data) {
          for (let i in data) {
            if (data[i].details) {
              _this.updateTableTree(data[i].id, data[i].details);
              dg(data[i].details);
            }
          }
        }

        dg(this.tableData);
      },
      editRow(row, index) {
        //编辑
        this.$set(row, "edit", true);
        this.$set(row, "save", true);
      },
      saveRow(row, index) {
        //高度撑开
        this.$emit('changeHeight');
      },
      delRow(row, index) {
        var that = this;
        //删除
        FUI.Window.confirm('是否删除此项数据？', null, function (r) {
          //删除接口
          var tableData = that.tableData;
          tableData.splice(index, 1);
          //that.initData();
        });

      },
      upRow(scope, row, index) {
        console.info(scope, row, index);
        //上移
      },
      downRow(row, index) {
        //下移
      },
      proTableData(data) {
        let _this = this;

        //处理数据
        function dg(data) {
          for (let i in data) {
            _this.$set(data[i], "edit", false);
            if (data[i].details) {
              //重要:树状节点数据刷新
              _this.updateTableTree(data[i].id, data[i].details);
              dg(data[i].details);
            }
          }
        }

        dg(data);
      },
      initData() {
        //数据加载   模仿数据请求
        let res = JSON.parse(JSON.stringify(this.tableData));

        //数据处理 添加编辑标识
        this.proTableData(res);
        this.searchSource = JSON.parse(JSON.stringify(res));
        this.tableData = res;
        //高度撑开
        this.$emit('changeHeight');
      },
      load(tree, treeNode, resolve) {
        //节点加载
        setTimeout(() => {
          resolve(tree.details);
          //高度撑开
          this.$emit('changeHeight');
        }, 1000);
      },
      handleSelectionChange(val) {
        //全选
        console.log(val, '111')
        this.cimsDictTable = val;
      },
      // 返回表格数据
      getTableData() {
        this.$emit('showData', this.tableData)
      },
      // 接收父级回传数据
      getObj(arr) {
      },
      // 发票选择控件
      openCustomDialog(id, name, code, ObjName, width, height, radioMultiple, row) {
        var that = this;
        if (!that.setFormData.projectId || !that.setFormData.invoiceBizType) {
          FUI.Window.showMsg2('请填写认领信息');
          return false;
        }
        var multi = true;
        CustomDialog(that, {
          customDialog: code,
          isTest: false,
          width: width,
          height: height,
          isMulti: multi,
          data: [
            {
              field: "projectNo",
              property: "ProjectNo",
            },
            {
              field: "projectId",
              property: "MyId",
            },
          ],
          callBack: function (data) {
            console.log(data, '12342341231234123');
            //自定义回调函数不是必须的，可删除
            var myId = [];
            if (data) {
              for (let i in data) {
                myId.push(data[i].MyId)
              }
            }
            getInvoiceInfo(myId).then((res) => {
              if (res.code === 200) {
                console.log(res);
                var data = res.data;
                for (let i in data) {
                  let num = new Date().valueOf();
                  data[i] = Object.fromEntries(Object.entries(data[i]).map(([key, value]) => [key, value === null ? '' : value]));
                  data[i]['id'] = num + '_' + i;
                  data[i]['radioState'] = that.isVaild;
                  data[i]['inputState'] = data[i]['expenditureContractNo'] ? true:false;
                  data[i]['salesItem'] = data[i]['salesItem'] ? Number(data[i]['salesItem']) : '';
                  if(data[i]['expenditureContractId']){
                    let amount = that.getContractClaimAmount(data[i]['expenditureContractId']);
                    data[i]['contractClaimAmount'] = amount?amount:'';
                  }

                  that.tableData.push(data[i]);
                }
                //高度撑开
                that.$emit('changeHeight');
                //  console.log(that.setFormData,'12341234123',that.tableData);

                that.setTableRows()
              }
            });
          },
        });
      },
      // 选择项目
      openCustomDialog2(id, name, code, ObjName, width, height, radioMultiple, row) {
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
              field: "projectNo",
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
            row.projectNo = data[0].ProjectNo;
            row.projectId = data[0].MyId;
            row.projectName = data[0].ProjectName;
            row.expenditureContractNo = '';
            row.expenditureContractId = '';
            row.expenditureContractName = '';
            // scope.row.radioState
            that.getContraType(row.projectId, row)
          },
        });
      },
      // 选择合同
      openCustomDialog3(id, name, code, ObjName, width, height, radioMultiple, row) {
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
              value: row.projectId,
            },
          ],
          callBack: function (data) {
            //自定义回调函数不是必须的，可删除
            row.expenditureContractNo = data[0].BillNo;
            row.expenditureContractId = data[0].MyId;
            row.expenditureContractName = data[0].Contract;
            row.contractAmount = data[0].ContractAmount;
            row.inputState = false;
            getMonkeyById(data[0].MyId).then((res) => {
              if (res) {
                row.contractClaimAmount = res?res:'';
              }
            });
          },
        });
      },
      // 方法弃用
      openCustomDialog4(id, name, code, ObjName, width, height, radioMultiple, row) {
        var that = this;
        if (!that.setFormData.projectId || !that.setFormData.invoiceBizType) {
          FUI.Window.showMsg2('请填写认领信息');
          return false;
        }
        var multi = radioMultiple == "1";
        CustomDialog(that, {
          customDialog: code,
          isTest: false,
          width: width,
          height: height,
          isMulti: multi,
          data: [
            {
              field: "projectNo",
              property: "ProjectNo",
            },
            {
              field: "projectId",
              property: "MyId",
            },
          ],
          callBack: function (data) {
            console.log(data, '12342341231234123');
            row.myId = data[0].MyId;
            row.invoiceProjectId = data[0].InvoiceProjectId;
            row.invoiceNo = data[0].InvoiceNo;
            row.invoiceCode = data[0].InvoiceCode;
            row.sellerName = data[0].SellerName;
            row.invoiceAmount = data[0].InvoiceAmount;
            row.tax = data[0].Tax;
            row.projectNo = data[0].ProjectNo;
            row.projectId = data[0].ProjectId;
            row.projectName = data[0].ProjectName;
            row.expenditureContractNo = data[0].ExpenditureContractNo;
            row.expenditureContractId = data[0].ExpenditureContractId;
            row.expenditureContractName = data[0].ExpenditureContractName;
            row.invoiceBizType = data[0].InvoiceBizType;
            row.salesItem = data[0].SalesItem;
            row.amountClaimedTax = data[0].AmountClaimedTax;
            row.taxClaimedRate = data[0].TaxClaimedRate;
            row.id = new Date().valueOf();
            row.radioState = true;

            that.getContraType(row.projectId, row);
          },
        });
      },
      // 数据填充
      setTableRows() {
        var that = this;
        var rows = that.tableData;
        var data = that.setFormData;
        console.log(data, '111111111111111111111');
        for (let i in rows) {
          if (!rows[i]['invoiceProjectId']) {
            this.$nextTick(() => {
              rows[i].projectId = rows[i].projectId ? rows[i].projectId : data.projectId;
              rows[i].projectName = rows[i].projectName ? rows[i].projectName : data.projectName;
              rows[i].projectNo = rows[i].projectNo ? rows[i].projectNo : data.projectNo;
              rows[i].invoiceBizType = rows[i].invoiceBizType ? rows[i].invoiceBizType : (data.invoiceBizType).toString();
              rows[i].expenditureContractNo = rows[i].expenditureContractNo ? rows[i].expenditureContractNo : data.expenditureContractNo;
              rows[i].expenditureContractId = rows[i].expenditureContractId ? rows[i].expenditureContractId : data.expenditureContractId;
              rows[i].expenditureContractName = rows[i].expenditureContractName ? rows[i].expenditureContractName : data.expenditureContractName;
              rows[i].salesItem = rows[i].salesItem ? Number(rows[i].salesItem) : data.isSaleItem ? Number(data.isSaleItem) : '';
              rows[i].contractClaimAmount = rows[i].contractClaimAmount ? rows[i].contractClaimAmount : data.contractClaimAmount;
              rows[i].contractAmount = rows[i].contractAmount ? rows[i].contractAmount : data.contractAmount?data.contractAmount:'';
              rows[i].inputState = rows[i].expenditureContractNo?true:false;
            });
          }
          if(rows[i]['expenditureContractId']){
            getMonkeyById(rows[i]['expenditureContractId']).then((res) => {
              if (res) {
                rows[i].contractClaimAmount = res?res:'';
              }
            });
          }
        }
        that.tableData = rows;
        that.tableKey = new Date().getTime();
      },
      // 字段格式化
      getFormatterValue(value) {
        if (value) {
          var num = value;
          num = Object.tofixed(num, 2);
          return num;
        } else {
          return '';
        }
      },
      // 金额计算
      getAddNumber(row, name) {
        let temp = row[name];
        row[name] = this.getFormatterValue(temp);
        let rate = row[name] / Number(row['invoiceAmount']) * Number(row['tax'])
        row['taxClaimedRate'] = this.getFormatterValue(rate);
      },
      // radio 事件
      changeRadio(e) {
        console.log(e)

      },
      setDisable(val) {
        if (val) {
          return true
        } else {
          return false
        }
      },
      //获取是否是建安合同
      getContraType(id, row) {
        var that = this;
        $.extendAjax(`/takeAContract/querySaleItemByProjectId?projectId=${id}`, '', "get", function (d) {
          if (d.code) {
            row.radioState = d.data;
          }
        });
      },
      // 合计 amountClaimedTax: '',  taxClaimedRate: '',
      getSummaries(param){
        const { columns, data } = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计';
            return;
          }
          const values = data.map(item => Number(item['amountClaimedTax'])); // 认领金额
          const values2 = data.map(item => Number(item['taxClaimedRate'])); // 认领税额
          const values3 = data.map(item => Number(item['invoiceAmount'])); // 发票金额
          const values4 = data.map(item => Number(item['tax'])); // 税额  invoiceAmount tax
          if (!values.every(value => isNaN(value))) {
            sums[11] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            sums[11] = Object.numberFixed(sums[11],2);
          } else {
            sums[11] = '';
          }
          if (!values2.every(value => isNaN(value))) {
            sums[12] = values2.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            sums[12] = Object.numberFixed(sums[12],2);
          } else {
            sums[12] = '';
          }
          if (!values3.every(value => isNaN(value))) {
            sums[5] = values3.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            sums[5] = Object.numberFixed(sums[5],2);
          } else {
            sums[5] = '';
          }
          if (!values4.every(value => isNaN(value))) {
            sums[6] = values4.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            sums[6] = Object.numberFixed(sums[6],2);
          } else {
            sums[6] = '';
          }
        });

        return sums;
      },
      // 获取历史认领金额
      getContractClaimAmount(id){
        getMonkeyById(id).then((res) => {
          if (res) {
             return res;
          }
        });
      }
    },
    mounted() {
      this.initData();
    },
    beforeMount() {
      //this.tableMaxHeight = document.body.clientHeight;
    },
  };
</script>

<style scoped lang="scss">
  .cd-tool {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
  }

  .data-table .cell {

    display: flex;
    align-items: center;

  }

  .divInput {
    width: 100%;
    line-height: 32px;
    height: 32px;
    background-color: rgb(245 247 250);
    border-color: rgb(228 231 237);
    color: rgb(51 51 51) !important;
    cursor: not-allowed;
  }
</style>
