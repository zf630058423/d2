<template>
  <div style="width: 100%;min-width: 400px;margin-bottom: 20px">
    <div class="cd-tool" v-if="false">
      <el-input size="mini" style="width:220px" v-model="searchValue" placeholder="请输入地址关键字"></el-input>
      <el-button type size="mini" @click="enableSel=!enableSel">{{enableSel?'关闭':'启用'}}选择</el-button>
      <el-button type size="mini" @click="relDict">关联字典</el-button>
      <el-button type size="mini" @click="addTool">新增</el-button>
      <el-button type size="mini" @click="batchEdit">批量编辑</el-button>
      <el-button type size="mini" @click="batchDel">批量删除</el-button>
      <el-button type size="mini" @click="saveTbale">保存</el-button>
    </div>
    <div style="text-align: right;padding: 5px">
      <!--<el-button type="primary" size="mini" @click="addTool">新 增</el-button>-->
      <!--<el-button type="primary" size="mini" @click="batchDel">删 除</el-button>-->
    </div>
    <el-table :data="tableData7" style="width: 100%;" row-key="id" :key="tableKey" border stripe size="small"
              ref="cimsDictTable"
              tooltip-effect="dark" @selection-change="handleSelectionChange" @select="select"
              @select-all="selectAll" header-row-class-name="data-table-header"
              :show-overflow-tooltip="true">

      <el-table-column v-if="enableSel" type="selection" width="55"></el-table-column>
      <el-table-column label="序号" type="index" width="50"></el-table-column>
      <el-table-column label="年份">
        <template slot-scope="scope">
          <el-input style="width: 80%" v-model="scope.row.AParticularYear" size="small" placeholder="请输入" disabled></el-input>
        </template>
      </el-table-column>
      <el-table-column label="内销金额(万元)" class="is-required">
        <template slot-scope="scope">
          <el-input style="width: 80%" type="number" v-model="scope.row.AmountofDomesticSales" @blur="handleBlurValue(scope.row)" size="small" placeholder="请输入"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="外销金额(万元)" class="is-required">
        <template slot-scope="scope">
          <el-input style="width: 80%" type="number" v-model="scope.row.ExportValue" @blur="handleBlurValue(scope.row)" size="small" placeholder="请输入"></el-input>

        </template>
      </el-table-column>
      <el-table-column label="总销售金额(万元)" class="is-required">
        <template slot-scope="scope">
          <el-input style="width: 80%" type="number" v-model="scope.row.GrossSalesAmount" size="small" placeholder="自动计算" disabled></el-input>
        </template>
      </el-table-column>
      <el-table-column label="环比增长率" class="is-required">
        <template slot-scope="scope">
          <el-input style="width: 80%" type="number" v-model="scope.row.SequentialGrowthRate" size="small" placeholder="请输入"></el-input>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
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
    name: "bankInfo",
    props:['formAction','isAble'],
    data() {
      return {
        dialogVisibleMenu: false,
        ref: "cimsDictTable",
        tableKey: 0,
        enableSel: false,
        tableData7: [],
        cimsDictTable: [],
        searchSource: [],
        searchValue: "",
        menuSource: [],
        defaultProps: {
          children: "details",
          label: "name",
        }, //菜单节点
        sourceData: [],
      };
    },
    created(){
      this.setTableData();
    },
    methods: {
      addTool() {
        let addrow = this.setRowData();
        this.tableData7.push(addrow);
      },
      onMenuSl(obj, node, data) {
        this.id = obj.id;
      },
      cnfAsMenu() {
        if (this.id == null) {
          this.$message({
            message: "请先选择关联菜单! ",
            type: "warning",
          });
        } else {
          let arr = this.getSelectedList();
          let p = arr.map((m) => m.id);
          //关联字典接口
          this.$message({
            message: "关联成功! ",
            type: "success",
          });
          this.dialogVisibleMenu = false;
          this.initData();
          this.id = null;
        }
      },
      Menuclose() {
        this.dialogVisibleMenu = false;
      },
      setRowData(pid) {
        return {
          id: new Date().valueOf(),
          contractAmount: "",
          pid: pid ? pid : null,
          targetCost: "",
          expenseItemType: '',
          hasChildren: true,
          edit: true,
          add: true,
          save: true
        };
      },
      relDict() {
        //关联字典
        if (!this.checkSelected(this.cimsDictTable, "至少选择一项")) {
          return;
        }
        //模仿数据请求接口
        let res = this.sourceData;
        this.menuSource = JSON.parse(JSON.stringify(res));
        this.dialogVisibleMenu = true;
      },
      tableRules(list) {
        /**
         * 验证规则
         * contractAmount不为空
         */
        for (let i in list) {
          if (list[i].contractAmount) {
            return false;
          }
        }
        return true;
      },
      saveTbale() {
        //保存
        let saveList = [];
        let saveTableData = JSON.parse(JSON.stringify(this.tableData7));

        function dg(saveTableData) {
          for (let i in saveTableData) {
            if (saveTableData[i].edit) {
              //设置序号
              saveTableData[i].cdOrderNum = parseInt(i) + 1;
              //2.重置新增数据的id为null
              if (saveTableData[i].add) {
                saveTableData[i].id = null;
              }
              //3.保存编辑的数据
              saveList.push(saveTableData[i]);
            }
            if (saveTableData[i].details) {
              dg(saveTableData[i].details);
            }
          }
        }

        dg(saveTableData);
        if (!this.checkSelected(saveList, "至少编辑一项")) {
          return;
        }
        if (this.tableRules(saveList)) {
          this.$message.error("编辑项中存在空数据,请填写或者删除");
          return;
        }
        this.$confirm(`操作确认,是否继续?`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            //批量保存与更新接口
            this.$message({
              message: "操作成功! ",
              type: "success",
            });
            this.initData();
          })
          .catch(() => {
          });
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
        // tableData7 第一层只要有在 selection 里面就是全选
        const isSelect = this.tableData7.some((item) => selection.includes(item));
        if (isSelect) {
          selection.forEach((item) => {
            this.selectChildren(item, isSelect);
          });
        } else {
          this.tableData7.forEach((item) => {
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
      batchEdit() {
        //批量编辑
        if (!this.checkSelected(this.cimsDictTable, "至少选择一项")) {
          return;
        }
        for (let i in this.cimsDictTable) {
          this.$set(this.cimsDictTable[i], "edit", true);
        }
      },
      batchDel() {
        //批量删除
        if (!this.checkSelected(this.cimsDictTable, "至少选择一项")) {
          return;
        }
        let arr = this.getSelectedList();
        this.$confirm(`删除选中的${arr.length}项目数据?`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            let p = [];
            arr.forEach((d) => {
              if (!d.add) {
                p.push(d.id);
              }
            });
            //删除接口
            //todo:需判断2种状态提示 前端删除 和 需要传回后端
            this.initData();
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

        dg(this.tableData7);
      },
      editRow(row, index) {
        //编辑
        this.$set(row, "edit", true);
        this.$set(row, "save", true);
      },
      saveRow(row, index) {
        //保存
        var that = this;
        // debugger
        that.$set(row, "edit", false);
        that.$set(row, "save", false);
        console.log(row, '当前行');

        var arr = that.tableData7;

        for (var i = 0; i < arr.length; i++) {
          if (arr[i].id === row.pid) {
            console.log(arr[i].details, '获取内容');
            var child = arr[i].details;
            var sum1 = 0;
            var sum2 = 0;
            for (var j = 0; j < child.length; j++) {
              sum1 += Number(child[j].contractAmount);
              sum2 += Number(child[j].targetCost);
            }
            that.$set(arr[i], 'contractAmount', sum1);
            that.$set(arr[i], 'targetCost', sum2);
          }
        }
        //高度撑开
        this.$emit('changeHeight');
      },
      delRow(row, index) {
        console.log(row, '删除当前行')
        var that = this;
        //删除行
        let delArr = [];
        function dg(data) {
          for (let i in data) {
            //过滤当前新增的数据
            if (!data[i].add) {
              delArr.push(data[i].id);
            }
            if (data[i].details) {
              dg(data[i].details);
            }
          }
        }

        dg([row]);
        console.log(delArr,'删除当前行2')
        //删除
        FUI.Window.confirm('是否清空子项数据？', null, function (r) {
          //删除接口
          if(delArr.length>0){
            that.$message({
              message: "删除成功! ",
              type: "success",
            });
            that.initData();
          }else {
            that.$message({
              message: "删除成功! ",
              type: "success",
            });
            that.initData();
          }
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
        let res = JSON.parse(JSON.stringify(this.sourceData));

        //数据处理 添加编辑标识
        this.proTableData(res);
        this.searchSource = JSON.parse(JSON.stringify(res));
        this.tableData7 = res;
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
        this.cimsDictTable = val;
      },
      // 返回表格数据
      setData(){
        this.$emit('showData', 4,this.tableData7)
      },
      // 接收父级回传数据
      getObj(arr){
        var that = this;
        var data = arr.map(x => {
          var item = {
            contractAmount: x.contractAmount === '-1.0000'? '':x.contractAmount === null?'':x.contractAmount === -1?'':x.contractAmount,
            expenseItemType: x.expenseItemType,
            targetCost: x.targetCost === '-1.0000'? '':x.targetCost === null?'':x.targetCost === -1?'':x.targetCost,
            details: x.children,
            id: x.id,
            myId: x.myId,
            myParentId: x.myParentId,
            pid: x.pid,
            hasChildren: true
          };
          return item;
        });
        console.log(data);
        var arr1 = [];
        for(let i=0;i<data.length;i++){
          if(data[i].pid){
            arr1.push(data[i]);
          }
        }
        data = data.filter(item => item.pid === '');
        for(let i = 0;i<arr1.length;i++){
          for(let j = 0;j<data.length;j++){
            if(arr1[i].pid === data[j].id){
              data[j].details.push(arr1[i]);
            }
          }
        }

        console.log(data,'421234');
        that.tableData7 = data;
        //that.initData();
      },
      setTableData(){
        var date = new Date()
        var year = date.getFullYear()
        var arr = [{
          AParticularYear: year - 3,
          AmountofDomesticSales: '',
          ExportValue: '',
          GrossSalesAmount: '',
          MyId: '',
          SequentialGrowthRate: ''
        }, {
          AParticularYear: year - 2,
          AmountofDomesticSales: '',
          ExportValue: '',
          GrossSalesAmount: '',
          MyId: '',
          SequentialGrowthRate: ''
        }, {
          AParticularYear: year - 1,
          AmountofDomesticSales: '',
          ExportValue: '',
          GrossSalesAmount: '',
          MyId: '',
          SequentialGrowthRate: ''
        }];
        this.tableData7 = arr
      },
      //input 失焦事件
      handleBlurValue(row){
        row.GrossSalesAmount = Number(row.AmountofDomesticSales) + Number(row.ExportValue);
      },
    },
    mounted() {
    //  this.initData();
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
  }

  .data-table .cell {

    display: flex;
    align-items: center;

  }
</style>
