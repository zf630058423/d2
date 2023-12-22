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
    <el-table :data="tableData" style="width: 100%;" row-key="id" :key="tableKey" border stripe size="small"
              ref="cimsDictTable"
              tooltip-effect="dark" @selection-change="handleSelectionChange" @select="select"
              @select-all="selectAll" header-row-class-name="data-table-header">

      <el-table-column v-if="enableSel" type="selection" width="55"></el-table-column>
      <el-table-column label="序号" type="index" width="50"></el-table-column>
      <el-table-column label="准入条件" width="120px">
        <template slot-scope="scope">
          <span>{{scope.row.EntryConditions}}</span>
        </template>
      </el-table-column>
      <el-table-column label="准入最低要求" class="is-required" min-width="180px" :show-tooltip-when-overflow="true">
        <template slot-scope="scope">
          <span>{{scope.row.MinimumEntryRequirement}}</span>
        </template>
      </el-table-column>
      <el-table-column label="20~25分" class="is-required">
        <template slot-scope="scope">
          <span>{{scope.row.MaximumScore}}</span>
        </template>
      </el-table-column>
      <el-table-column label="15~19分" class="is-required">
        <template slot-scope="scope">
          <span>{{scope.row.MediumScore}}</span>
        </template>
      </el-table-column>
      <el-table-column label="0~14分" class="is-required">
        <template slot-scope="scope">
         <span>{{scope.row.LowestMark}}</span>
        </template>
      </el-table-column>
      <el-table-column label="得分" align="center" width="150px">
        <template slot-scope="scope">
          <el-input style="width: 80%" type="number" v-model="scope.row.Score" @blur="handleBlur(scope.row)" size="small" placeholder="请输入"></el-input>
        </template>
      </el-table-column>
    </el-table>
    <div style="padding: 10px;color: #999999;">
     <p style="padding: 5px"><span class="red">*</span> 备注：</p>
     <p style="padding: 5px"> 1、得分85~100分者为A级优质供应商，可以优先合作并考虑纳入战略供应商。</p>
     <p style="padding: 5px">2、得分70~84分者为B级合格供应商，可以正常采购。</p>
     <p style="padding: 5px">3、得分60~69分者为C级辅导级供应商，需辅导或停止合作</p>
     <p style="padding: 5px">4、得分60分以下者为D级不合格供应商，予以淘汰。</p>
    </div>
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
        form:{
          SynthesizeScore:'',
          SynthesizeEvaluate:''
        },
        dialogVisibleMenu: false,
        ref: "cimsDictTable",
        tableKey: 0,
        enableSel: false,
        tableData: [],
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
      this.setTableData()
    },
    methods: {
      addTool() {
        let addrow = this.setRowData();
        this.tableData.push(addrow);
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
        let saveTableData = JSON.parse(JSON.stringify(this.tableData));

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
          let addrow = this.setRowData(row.MyId);
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
        //保存
        var that = this;
        // debugger
        that.$set(row, "edit", false);
        that.$set(row, "save", false);
        console.log(row, '当前行');

        var arr = that.tableData;

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
        this.cimsDictTable = val;
      },
      // 返回表格数据
      setData(){
        this.$emit('showData', 6, this.tableData)
      },
      // 表格赋值
      setTableData(){
        var arr2 = [{
          EntryConditions: '工厂管理',
          MaximumScore: '各项都符合标准',
          MediumScore: '若质量方针不明确或加工流程不规范',
          MinimumEntryRequirement: '生产制度、财务制度、加工流程、车间管理制度、员工统一着装、企业质量方针标识、产品堆放分区合理化、出厂包装、检验等',
          LowestMark: '着装不统一和出厂包装不完整',
          MyId: '',
          Score: '',
        }, {
          EntryConditions: '生成设备',
          MaximumScore: '设备齐全',
          MediumScore: '部分产品需要外加工',
          MinimumEntryRequirement: '生产设备则根据实际生产所需要用到的设备考虑',
          LowestMark: '大部分需要外加工',
          MyId: '',
          Score: '',
        }, {
          EntryConditions: '生产能力',
          MaximumScore: '均满足',
          MediumScore: '不能满足大批量生产',
          MinimumEntryRequirement: '生产设备、员工人数、厂房面积大小考虑，设备、人员和厂房面积是否满足生产实力',
          LowestMark: '不具备生产实力',
          MyId: '',
          Score: '',
        }, {
          EntryConditions: '检验设备',
          MaximumScore: '有检测设备有持证人员',
          MediumScore: '有检测设备无持证人员',
          MinimumEntryRequirement: '检测设备主要从有检测设备及相关持证人员考虑',
          LowestMark: '无检测设备无持证人员',
          MyId: '',
          Score: '',
        }];
        this.tableData = arr2
      },
      // 求和
      handleBlur(row){
        var arr = this.tableData;
        var sumNum = 0;
        for(var i in arr){
          var score = arr[i].Score;
          sumNum+=Number(score)
        }
        console.log(sumNum);
        this.$emit('getScore',sumNum)

      }
    },
    mounted() {
     // this.initData();
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
