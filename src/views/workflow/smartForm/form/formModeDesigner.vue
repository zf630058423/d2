<template>
  <div class="p10">
    <el-card class="box-card">
      <div class="flex">
        <div class="pr5">
          <span>模型名称：</span>
          <el-input v-model="formDefData.formDefName" :disabled="true" size="small" class="w200" placeholder="模型名称" />
        </div>
        <div class="pr5">
          <span>模型编码：</span>
          <el-input v-model="formDefData.formDefKey" :disabled="true" size="small" class="w200" placeholder="模型编码" />
        </div>
        <div class="pr5">
          <span>备注：</span>
          <el-input v-model="formDefData.remart" :disabled="true" size="small" class="w200" placeholder="备注" />
        </div>
        <div class="pr5">
          <el-button type="primary" size="mini" @click="formDefEdit"><i class="icon icon-a-tianxiexiangqing" /> 修改</el-button>
          <el-button type="warning" size="mini" @click="closeEdit"><i class="icon icon-guanbi" />关闭</el-button>
        </div>
      </div>
    </el-card>
    <el-container class="mt5">
      <el-aside width="320px">
        <el-card class="box-card  table-card-list auto-window-height">
          <div slot="header" class="clearfix">
            <span>
              <el-tooltip class="el-tooltip el-icon-question m-l-10 item" effect="dark" content="业务模型必须有且仅有一个主表，可以添加任意多的子表。" placement="right">
                <span class="font12">数据表</span>
              </el-tooltip>
            </span>
            <div style="display:inline-block; margin-left:4px;margin-top: 2px;">
              <el-button title="创建一个新的表" type="primary" plain size="mini" @click="addTable"><i class="fa fa-plus" />添加表</el-button>
              <el-button v-if="!isSimple" title="选择并并联一个已定义的表" type="default" size="mini" @click="selectRelTableDef">选择已有表</el-button>
              <el-button v-if="!isSimple" title="导入一个已存在的数据库物理表，注意导入后将会在物理表中自动添加下面字段供流程关联使用：MyId，Wiid，MyParentId，BusinessKey，FormId" type="default" size="mini" @click="importExistTableDef">导入外部表</el-button>
            </div>
          </div>
          <div :key="tableListKey">
            <el-card v-for="table in tableBusObjectList" :class="table.tableId==currTable.tableId?'table-def-card table-def-card-selected':'table-def-card'">
              <div slot="header" class="clearfix table-def-card-title" @click.stop="cardSelected(table)">
                <span v-if="table.isMain"><i class="icon icon-biaoge font12"></i> 主实体表 </span>
                <span v-else="table.isMain"><i class="icon icon-biaoge font12"></i> 子实体表</span>
                <span v-if="table.isMain==false" class="card-head-btn mr4" @click.stop="editBusObject(table.tableId,table.tableTitle,table.isMain,table.busObjectId)"><i class="icon icon-jihuaweihu font12"></i>属性</span>
                <span v-if="table.isCreateTable == false" title="此删除为物理删除表定义（如有复用情况请再三谨慎操作）" class="fa fa-trash-o card-head-btn mr4  " @click.stop="deleteTable(table.tableId,table.tableTitle,table.busObjectId,table.isMain,true)"> 删表定义</span>
                <span class="card-head-btn  mr4" @click.stop="editTable(table.tableId,table.tableTitle,table.busObjectId)"><i class="icon icon-bianji1 font12"></i>编辑</span>
                <span title="仅删除对此表的关联关系，可通过“选择已有表”添加回来。" class="fa fa-trash-o card-head-btn mr4 " @click.stop="deleteTable(table.tableId,table.tableTitle,table.busObjectId,table.isMain,false)">删表引用</span>
              </div>
              <div class="table-def-card-content cur" @click.stop="cardSelected(table)">
                <div class="flex"><label>表状态： </label>
                  <span v-if="table.isCreateTable == 1" class="btn btn-success btn-minier">已发布</span>
                  <span v-else class="btn btn-grey btn-minier">未发布</span>
                  <span v-if="table.isOuterTable" class="btn btn-success btn-minier ml2">外部</span>
                  <span v-if="table.dbSourceCode!=''&&table.dbSourceCode!=null" class="btn btn-success btn-minier ml2" :title="'DB数据源：'+table.dbSourceCode">DB:{{table.dbSourceCode.length>13?table.dbSourceCode.substring(0,13)+'..':table.dbSourceCode}}</span>
                </div>
                <div class="flex"><label>表标题：</label>
                  <el-input v-model="table.tableTitle" :disabled="true" class="textBoxShort" size="mini" placeholder="表标题" @blur.native.capture="toPinYin(table,'tableTitle','tableName')" />
                </div>
                <div class="flex"><label>实体名：</label>
                  <el-input v-model="table.tableName" :disabled="true" class="textBoxShort" size="mini" placeholder="表名称" />
                </div>
                <div class="flex"><label>数据表：</label>
                  <el-input v-model="table.dbTableName" :disabled="true" class="textBoxShort" size="mini" placeholder="实体名" />
                </div>
              </div>
            </el-card>
          </div>
        </el-card>
      </el-aside>
      <el-main class="f2bpm-page-right">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>
              <span class="font12"><span v-html="currTable.tableTitle" />--字段列表</span>
            </span>
            <div style="display:inline-block; margin-left: 25px;">
              <el-button v-if="currTable.isCreateTable == false" :disabled="currTable.isOuterTable==true" type="primary" size="mini" @click="createTable"><i class="fa fa-table" />发布物理表</el-button>
              <el-button v-if="currTable.isCreateTable == true" :disabled="currTable.isOuterTable==true" type="danger" size="mini" @click="deleteDBTable"><i class="fa fa-trash-o" />删除物理表</el-button>
              <el-button :disabled="currTable.tableId==''" title="刷新表是否已创建的状态" type="default" size="mini" @click="refreshTableStatus"><i class="icon icon-shuaxin" />刷新表状态</el-button>
              <el-button :disabled="currTable.tableId==''" style="margin-right: 10px;" type="default" size="mini" @click="selectCreateGenFieldColumn"><i class="icon icon-beifen" />从标准库中选取</el-button>



              <el-dropdown size="mini">
                <el-button type="default" size="mini">
                  更多菜单<i class="el-icon-arrow-down el-icon--right" />
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item title="字段控件定义，也可在表单设计器中配置字段的控件" @click.native="formFieldList"><i class="icon icon-daibanshixiang" />字段控件定义</el-dropdown-item>
                  <el-dropdown-item v-if="!isSimple" title="检查数据库表字段是否已发布" @click.native="checklistDbfieldIsCreatedInDB"><i class="icon icon-jiekuan_chulichenggong2" />检查字段状态</el-dropdown-item>
                  <el-dropdown-item v-if="!isSimple" title="导出表定义SQL" @click.native="downLoadTableDef"><i class="icon icon-xiazai" />导出表定义SQL</el-dropdown-item>
                  <el-dropdown-item title="快速添加创建人和创建时间字段" @click.native="createColumnByColumnNames('creatorId,createdTime','创建人，创建时间')"><i class="icon icon-duodingdan" />添加日期/创建人字段</el-dropdown-item>
                  <el-dropdown-item title="快速添加租户号TenantId字段" @click.native="createColumnByColumnNames('TenantId','租户号')"><i class="icon icon-duodingdan" />添加租户号字段</el-dropdown-item>
                  <el-dropdown-item v-if="!isSimple" title="如何对已发布的字段进行字段删除。" @click.native="question1"><i class="icon icon-help" />如何删除字段</el-dropdown-item>
                  <el-dropdown-item v-if="!isSimple" title="管理关联表" @click.native="goFormDefTableRelList"><i class="fa fa-table" />管理关联表</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>


            </div>
          </div>
          <div class="table-field-list auto-window-height-full-250">
            <table :key="columnListKey" class="common-grid">
              <tr>
                <th>序号</th>
                <th><span class="mr5">字段标题</span> <i :class="'fa  fa-caret-down font16   cur desc '+(sort=='columnTitle'&&order=='desc'?'ordered':'') " @click="onOrderBy('columnTitle','desc')"> </i><i :class="'fa  fa-caret-up font16 cur asc '+(sort=='columnTitle'&&order=='asc'?'ordered':'')  " @click="onOrderBy('columnTitle','asc')"> </i></th>
                <th><span class="mr5">字段名称</span> <i :class="'fa  fa-caret-down font16   cur desc '+ (sort=='columnName'&&order=='desc'?'ordered':'') " @click="onOrderBy('columnName','desc')"> </i><i :class="'fa  fa-caret-up font16 cur asc '+(sort=='columnName'&&order=='asc'?'ordered':'')  " @click="onOrderBy('columnName','asc')"> </i> </th>
                <th style="width: 370px;">数据类型 </th>
                <th>小数位</th>
                <th>备注 </th>
                <th>状态</th>
                <th style="width: 164px;">操作</th>
              </tr>
              <tr :key="indexNo" v-for="(col,indexNo) in tableColumnList">
                <td class="numberNo">{{ indexNo+1 }}</th>
                </td>
                <td>
                  <el-input v-model="col.columnTitle" :disabled="col._disabled" size="mini" placeholder="字段标题" @blur.native.capture="toPinYin(col,'columnTitle','columnName')" />
                </td>
                <td>
                  <el-input v-model="col.columnName" :disabled="col._disabled||col.isCreatedInDB" size="mini" placeholder="不能超过30字符" />
                </td>
                
                <td style="text-align: left;">
                  <el-select style="width: 130px;" v-model="col.dataType" @change="dataTypeChange(col)" :disabled="col._disabled" size="mini" placeholder="请选择">
                    <el-option v-for="item in dataTypeOptions" :key="item.value" :label="item.text" :value="item.value" />
                  </el-select>
                  <el-select v-model="col.columnType" style="width: 100px;margin-left: 3px;" :disabled="col._disabled" size="mini" placeholder="请选择">
                    <el-option label="物理字段" value="base" />
                    <el-option label="虚拟字段" value="virtual" />
                  </el-select>
                  <el-input-number class="ml4" v-if="col.columnType =='base' && (col.dataType == 'string' || col.dataType === 'double' || col.dataType === 'decimal')" v-model="col.attrLength" :disabled="col._disabled" size="mini" :step="10" :min="0" :max="4000" placeholder="" style="width: 120px;" />
                </td>
                 <td>
                  <el-input v-if="col.dataType === 'double' || col.dataType === 'decimal'" v-model="col.decimalLen" :disabled="col._disabled" size="mini" style="width: 80px;"  />
                </td>
                <td>
                  <el-input style="width: 80px;" v-model="col.columnRemark" :disabled="col._disabled" size="mini" placeholder="" />
                </td>
                <td style="min-width:80px">
                  <span v-if="col.isCreatedInDB" class="cube bg-gree ">已发布</span>
                  <span v-else-if="col.columnType=='virtual'" class="cube bg-grey ">虚拟字段</span>
                  <span v-else class="cube bg-grey2 black">未发布</span>
                </td>
                <td>
                  <a v-if="col._disabled==false" class="btn btn-primary-pain btn-minier fa fa-edit mr2" @click="operationSave(col,false,-1)">保存</a>
                  <a v-if="col._disabled==false" class="btn btn-default btn-minier icon icon-KHCFDC_zuofei mr2 m2" @click="operationCancel(col)">取消</a>
                  <a v-if="col._disabled" class="btn btn-default btn-minier fa fa-edit mr2" @click="operationEdit(col)">修改</a>
                  <a v-if="col._disabled&&col.isCreatedInDB==false||!col.columnId" class="btn btn-default btn-minier fa fa-trash-o mr2" @click="operationDelete(col)">删除</a>
                  <a v-if="currTable.isCreateTable&&col._disabled==true&&col.isCreatedInDB==0&&col.columnType!='virtual'" class="btn btn-primary btn-minier fa fa-save mr2" title="将字段发布生成到物理表" @click="generateOneDBColumn(col.columnId)">发布</a>
                </td>
              </tr>
            </table>
            <div class="tl mt10 pr20">
              <el-button :disabled="currTable.tableId==''" plain size="mini" @click="addColumn">
                <span v-if="currTable.tableId==''">请先在左侧选中表或添加表</span>
                <span v-else><i class="icon icon-xinzeng"></i>新增字段</span>
              </el-button>
              <el-button v-if="currTable.tableId" plain size="mini" @click="bathSaveColumn">
                <i class="icon icon-wenjianxinzeng"></i>批量保存
              </el-button>
              <span style="height: 20px;display: inline-block;color: #666666;margin-left: 10px;">“附件”或“图片”字段需要设置字段长度至少为1024;"枚举数字使用“整型”</span>

            </div>

          </div>

        </el-card>
      </el-main>
    </el-container>
  </div>

</template>

<script>
  // 数据建模
  export default {
    data() {
      return {
        //排序字段，默认字段名称
        sort: "columnName",
        //排序方向  asc desc
        order: "asc",
        // 必传
        formDefId: '',
        // 非必传
        solutionId: '',
        // 是否为简约模式
        isSimple: false,
        // 左边表列表
        tableListKey: '101',
        // 右边列列表
        columnListKey: '201',

        currTable: { tableTitle: '', tableId: '' },

        dataTypeOptions: [],
        treeData: [],
        columnTemplate: {
          columnId: '',
          tableId: '',
          columnName: '',
          dbColumnName: '',
          columnTitle: '',
          columnRemark: '',
          columnType: 'base',
          dataType: 'string',
          defaultValue: '',
          attrLength: 64,
          decimalLen: null,
          isSysField: 0,
          isCreatedInDB: false,
          isRequired: 0,
          tenantId: '',
          createdTime: Object.toGetCurrentDateTimeString(),

          _disabled: false
        },
        formDefData: {
          formDefName: '',
          formDefKey: '',
          categoryCode: null,
          tenantId: '',
          lastUpdateTime: '',
          lastUpdateActor: '',
          createdTime: '',
          creatorId: '',
          creatorRealName: '',
          formDefId: ''
        },
        tableBusObjectList: [],
        tableColumnList: [],
        tableColumnList_oldtempData: [],

      };
    },
    computed: {
      countGridHeight() {
        return $(document).height() - global_datagridHeightDiff;
      },
      rotateIcon() {
        return this.isCollapsed ? 'icon icon-arrow-right-bold cur' : 'icon icon-arrow-left-bold cur';
      },
      positionIcon() {
        return this.isCollapsed ? 'cursor:pointer; position: relative;left: -5px;' : 'cursor:pointer; position: relative;left: 100px;';
      }
    },
    mounted() {
      window.autoPageHeight();
    },
    created() {
      var that = this;
      var formDefId = Object.toQueryString('formDefId');
      // 存在方案ID时则为简约方式
      var solutionId = Object.toQueryString('solutionId') || '';
      that.formDefId = formDefId;
      that.solutionId = solutionId;
      if (solutionId != '') {
        that.isSimple = true;
      }
      var arr = Object.toDeepClone(FUI.Data.baseDataTypeDic);
      arr.push({ text: "虚拟字段", value: "virtual" });
      that.dataTypeOptions = arr;


      that.loadTreeSelect();
      that.loadFormDefInfo();
      that.loadTableList();
      window.myvm = this;
    },

    methods: {
      closeEdit() {
        // stand:关闭编辑窗口
        FUI.Window.closeEdit(true);
      },
      loadFormDefInfo() {
        var that = this;
        // 获取表单定义信息
        var formDefData = Object.toAjaxJson(FUI.Handlers.SmartFormHandler, 'getModelFormDef', { keyId: that.formDefId });
        if (formDefData) {
          that.formDefData = formDefData;
        }
      },
      loadTreeSelect() {
        var that = this;
        var treeUrl = FUI.Handlers.CategoryHandler + '?groupKey=BusinessObject&needRoot=false';
        Object.toAjaxJson(treeUrl, null, null, true, null, function (res) {
          if (res.success) {
            that.treeData = res.data;
          } else {
            that.$message.error(
              res.msg
            );
          }
        });
      },
      loadTableList() {
        var that = this;
        // 获取表关系列表
        var formDefId = that.formDefId;
        var res = Object.toAjaxJson(FUI.Handlers.SmartFormHandler, 'getBusObjectListByFormDefId', { formDefId: formDefId });
        if (res.success) {
          that.tableBusObjectList = res.data;
          if (that.tableBusObjectList && that.tableBusObjectList.length > 0) {
            if (that.currTable == null || that.currTable.tableId == '') {
              that.currTable = that.tableBusObjectList[0];
              that.loadTableColumnList(that.currTable.tableId);
            }
          }
          else if (that.currTable == null || that.currTable.tableId == '') {
            that.tableColumnList = [];
            that.tableColumnList_oldtempData = [];
          }
        }
      },
      loadTableColumnList(tableId) {
        var that = this;
        var res = Object.toAjaxJson(FUI.Handlers.SmartFormHandler, 'getTableColumnList', { tableId: tableId, sort: that.sort, order: that.order });
        if (res.success) {
          that.tableColumnList = res.data;
          $.each(that.tableColumnList, function (_, c) {
            c._disabled = true;
            c._key = Object.toGuid();
            c._id = Object.toGuid();
          });
        }
      },
      loadTableColumnList_oldTempData(tableId) {
        var that = this;
        var res = Object.toAjaxJson(FUI.Handlers.SmartFormHandler, 'getTableColumnList', { tableId: tableId });
        if (res.success) {
          that.tableColumnList_oldtempData = res.data;
        }
      },
      cardSelected(table) {
        var that = this;
        //检查当前表是否有未保存的字段
        var isExist = false;
        $.each(that.tableColumnList, function (i, col) {
          if (col._disabled == false) {
            isExist = true;
            return false;
          }
        });
        if (isExist) {
          FUI.Window.showMsg("当前表【" + that.currTable.tableTitle + "】存在在未保存字段,请先保存或取消");
          return false;
        }
        that.currTable = Object.toDeepClone(table);
        that.loadTableColumnList(that.currTable.tableId);
      },
      cardSelectedByTableId(tableId) {
        var that = this;
        var table = that.tableBusObjectList.find(c => c.tableId == tableId);
        that.currTable = Object.toDeepClone(table);
        that.loadTableColumnList(that.currTable.tableId);
      },
      onOrderBy(sort, order) {
        var that = this;
        that.sort = sort;
        that.order = order;
        that.loadTableColumnList(that.currTable.tableId);
      }
      , addColumn() {
        var that = this;
        var item = Object.toDeepClone(that.columnTemplate);
        item.tableId = that.currTable.tableId;
        item._id = Object.toGuid();
        that.tableColumnList.push(item);
      },
      changeWidthRadio(val) {

      },
      dropMenuClick(a) {
        console.info(a);
      },
      checklistDbfieldIsCreatedInDB() {
        var that = this;
        if (that.currTable.isCreateTable == 0) {
          FUI.Window.showMsg(that, '物理表未发布，无需检查');
          return;
        }
        if (!that.currTable.tableId) {
          FUI.Window.showMsg(that, '请先添加表及字段');
          return;
        }
        FUI.Window.confirm(that, '您确定要执行“表字段定义与数据库表字段”的对比检查吗？', null, function (r) {
          var param = {
            tableId: that.currTable.tableId
          };
          var result = Object.toAjaxJson(FUI.Handlers.SmartFormHandler, 'checklistDbfieldIsCreatedInDB', param);
          FUI.Window.showMsg2(that, result.msg, null, 1);
          that.loadTableColumnList(that.currTable.tableId);
        });
      },
      //发布指定的字段
      generateOneDBColumn(columnId) {
        var that = this;
        if (that.isCreateTable == 0) {
          FUI.Window.showMsg(that, '请先发布物理表。');
          return;
        }
        FUI.Window.confirm(that, '您确定要发布物理字段吗？', null, function () {
          var param = {
            'tableId': that.currTable.tableId,
            'columnId': columnId
          };
          var result = Object.toAjaxJson(FUI.Handlers.SmartFormHandler, 'generateOneDBColumn', param);
          FUI.Window.showMsg(that, result.msg, null, result.success ? 1 : 7);
          if (result.success) {
            that.loadTableColumnList(that.currTable.tableId);
          }
        });
      },
      generateDBColumn(value, row, index) {
        var that = this;
        if (that.isCreateTable == 0) {
          FUI.Window.showMsg(that, '请先发布物理表。');
          return;
        }
        FUI.Window.confirm(that, '你确定要尝试重新发布在数据表中创建的字段吗？', null, function (r) {
          var param = {
            tableId: that.currTable.tableId
          };
          Object.toAjaxJson(FUI.Handlers.SmartFormHandler, 'generateDBColumn', param, true, null, function (result) {
            FUI.Window.showMsg(that, result.msg);
            that.dg.Reload();
          });
        });
      },
      createDefaultColumn() {
        var that = this;
        if (that.isCreateTable == 0) {
          FUI.Window.showMsg(that, '请先发布物理表');
          return;
        }
        FUI.Window.confirm(that, '确定尝试重新发布系统字段吗？', null, function (r) {
          var param = {
            tableId: that.tableId
          };
          var result = Object.toAjaxJson(FUI.Handlers.SmartFormHandler, 'createFixedcolumnByTableId', param);
          FUI.Window.showMsg(that, result.msg);
        });
      },
      createColumnByColumnNames(columnNmaes, titles) {
        var that = this;
        var currentBoId = that.currTable.busObjectId;
        var res = Object.toAjaxJson("/workflow/smartForm/", "getMaxFieldOrderNoByBusObjectId", { "busObjectId": currentBoId, "formDefId": that.formDefId });
        var maxFieldOrderNo = parseInt(res.data);
        FUI.Window.confirm(that, '确定添' + titles + '字段吗？', null, function (r) {
          var param = {
            tableId: that.currTable.tableId,
            busObjectId: currentBoId,
            formDefId: that.formDefId,
            columnNames: columnNmaes,
            maxFieldOrderNo: maxFieldOrderNo
          };
          var result = Object.toAjaxJson(FUI.Handlers.SmartFormHandler, 'createColumnByColumnNames', param);
          that.loadTableColumnList(that.currTable.tableId);
          FUI.Window.showMsg2(that, result.msg, null, 1);
        });
      },
      saveAsToGenField() {
        var that = this;
        var colIds = that.dg.getChecked();
        if (colIds == '') {
          FUI.Window.showMsg(that, '请选择要另存到字段库的字段。');
          return false;
        }
        // 选择分类
        var parm = { 'needRoot': false, singleSelect: true, groupKey: 'GeneralFieldGroup', data: [] };
        FUI.dialog('/workflow/selector/selectCategory/', '选择分类', parm, 450, 450, function (objectData, index, layerObject) {
          if (objectData.length > 0) {
            var ids = [];
            var titles = [];
            $.each(objectData, function (i, item) {
              ids.push(item.value);
              titles.push(item.text);
            });
            var setToCategoryCodes = ids.toString();
            var setToCategoryTitles = titles.toString();
            var data = Object.toAjaxJson(FUI.Handlers.SmartFormHandler, 'saveAsToGenField', {
              columnIds: colIds,
              categoryCode: setToCategoryCodes
            });
            if (data.success) {
              FUI.Window.showMsg(data.msg, null, 1);
            } else {
              FUI.Window.showMsg2(data.msg);
            }
            layerObject.close(index);
          } else {
            FUI.Window.showMsg('请选择字段的分类 ');
          }
        });
      },
      selectCreateGenFieldColumn() {
        var that = this;
        var tableId = that.currTable.tableId;
        var parm = {
          customDialog: 'GeneralFieldSelect', isMulti: true, width: 800, height: 450,
          data: [],
          callBack: function (data, index, layerObject) {
            var fieldDataJson = JSON.stringify(data);
            var param = {
              formDefId: that.formDefId,
              busObjectId: that.currTable.busObjectId,

              tableId: tableId,
              dataJson: fieldDataJson
            };
            var result = Object.toAjaxJson(FUI.Handlers.SmartFormHandler, 'saveSelectGenFields', param);
            if (result.success) {
              that.loadTableColumnList(tableId);
              layerObject.close(index);
            } else {
              FUI.Window.showMsg(that, result.msg, null, result.success ? 1 : 7);
            }
          }
        };
        CustomDialog(that, parm);
      },
      loadf2bpmSysConfig() {
        var that = this;
        var f2bpmSysConfig = sessionStorage.getItem("f2bpmSysConfig");
        if (!f2bpmSysConfig) {
          var resData = Object.toAjaxJson('/login/', 'getLoginPageData', null, false, null,
            function (resData) {
              if (resData.success) {
                that.sys = resData.data;
                that.sys.logoUrl = that.sys.logoUrl;
                if (that.sys.logoUrl) {
                  var arr = eval('(' + that.sys.logoUrl + ')');
                  var item = arr[0];
                  that.custLogUrl = __serverpath + FUI.Handlers.Common + 'getShowImage/?pathType=logo&groupName=' + item.groupName + '&filePath=' + item.filePathName;
                }
                f2bpmSysConfig = JSON.stringify(that.sys);
                sessionStorage.setItem('f2bpmSysConfig', f2bpmSysConfig);
                that.$store.dispatch('app/setSysConfig', f2bpmSysConfig);
              } else {
                FUI.Window.showMsg(resData.msg);
              }
            }
          );
        }
      }
      , deleteDBTable() {
        var that = this;
        var sysConfig = that.$store.state.app.sysConfig;
        if (sysConfig == null) {
          that.loadf2bpmSysConfig();
          sysConfig = that.$store.state.app.sysConfig;
        }
        var sysName = sysConfig == null ? "系统" : that.$store.state.app.sysConfig.sysName;
        if (that.currTable.isOuterTable == 1) {
          FUI.Window.showMsg(that, '不允许删除外部导入的物理表');
          return false;
        }
        if (!that.currTable.isCreateTable || that.currTable.isCreateTable == 0) {
          FUI.Window.showMsg2(that, '物理表未发布');
          return false;
        }
        var tableId = that.currTable.tableId;
        FUI.Window.confirm('注意当前系统是：《' + sysName + '》，<em>严重警告！严重警告！严重警告！</em>删除后将导致此表已有<em>数据丢失</em>，请谨慎操作,您确定要删除此物理表吗？', '删除警告', function (r) {
          FUI.Window.confirm('<em>再次严重警告！再次严重警告！</em>,注意当前系统是：《' + sysName + '》，删除后将导致此表已有<em>数据丢失</em>，数据丢后失将无法挽回，请谨慎操作,您再次确定要删除此物理表吗？', '删除警告', function (r) {
            var data = Object.toAjaxJson(FUI.Handlers.SmartFormHandler, 'deleteDbTableByTableId', {
              'tableId': tableId
            });
            if (data.success) {
              that.loadTableColumnList(tableId);
              that.currTable.isCreateTable = 0;
              FUI.Window.showMsg(that, data.msg, null, 1, function () {
                $.each(that.tableBusObjectList, function (i, t) {
                  if (t.tableId == tableId) {
                    t.isCreateTable = 0;
                  }
                });
              });
            } else {
              FUI.Window.showMsg(that, data.msg);
            }
          });
        });
      },
      refreshTableStatus() {
        var that = this;
        var tableId = that.currTable.tableId;
        var res = Object.toAjaxJson(FUI.Handlers.SmartFormHandler, 'refreshTableStatus', {
          'tableId': tableId
        });
        if (res.success) {
          that.currTable.isCreateTable = res.msg == "1" ? true : false;
        }
        FUI.Window.showMsg2(that, "刷新成功", null, 1);
      }
      , deleteTable(tableId, busObjectTitle, busObjectId, isMain, isDeleteTableDef) {
        const that = this;
        if (isMain && that.tableBusObjectList.length > 1) {
          FUI.Window.showMsg('当前主表存在子表时不允许删除');
          return false;
        }
        if (isDeleteTableDef) {
          var res = Object.toAjaxJson(FUI.Handlers.SmartFormHandler, 'isTableExistManyFormDefRef', { tableId: tableId });
          if (res.success == true) {
            FUI.Window.showMsg('表定义被多个数据建模引用，若要删除定义请先解绑');
            return false;
          }
        }
        let tip = isDeleteTableDef ? "<span class='red'>同时将删除表定义【请再三警慎操作】</span>" : "";
        FUI.Window.confirm(that, '确定要删除【' + busObjectTitle + '】表的引用，' + tip + '如果已正式使用请慎重？', null, function (r) {
          var data = Object.toAjaxJson(FUI.Handlers.SmartFormHandler, 'deleteBusObjectAndAllCascade', {
            busObjectId: busObjectId,
            busObjectTitle: busObjectTitle,
            isDeleteFormdeftablerel: true,
            //是否同时删除表定义
            isDeleteTableDef: isDeleteTableDef
          });
          that.currTable = { tableTitle: '', tableId: '' };
          that.loadTableList();
        });
      },
      editBusObject(tableId, busObjectTitle, isMain, busObjectId) {
        const that = this;
        if (that.currTable.tableId != tableId) {
          that.cardSelectedByTableId(tableId);
        }
        var leveltype = isMain ? 'main' : 'sub';
        var url = '/workflow/smartForm/formBusObjectEdit/?leveltype=' + leveltype + '&formAction=Edit&keyId=' + busObjectId + '&mainTable=f2bpm_form_BusObject';
        var title = formAction == FUI.FormAction.Add ? '属性' : '编辑属性';
        FUI.Window.openEdit(url, title, formAction, 'grid', 800, 500, null, null, null, true);
      },
      editTable(tableId, busObjectTitle, busObjectId) {
        const that = this;
        if (that.currTable.tableId != tableId) {
          that.cardSelectedByTableId(tableId);
        }
        that.showDialogEdit('Edit', busObjectId);
      },
      addTable() {
        var that = this;
        that.showDialogEdit('Add', null);
      },
      selectRelTableDef() {
        // 选择并添加关联表
        var that = this;
        var parm = null;
        FUI.dialog(__webpath + '/workflow/smartForm/tableDefinitionSelect', '选择表定义', parm, 900, 560, function (objectData, index, layer) {
          if (objectData.length > 0) {
            var tableId = objectData[0].TableId;
            var tableTitle = objectData[0].TableTitle;
            var tableName = objectData[0].TableName;
            if (that.tableBusObjectList && that.tableBusObjectList.length > 0 && that.tableBusObjectList.find(a => a.tableName == tableName) != null) {
              FUI.Window.showMsg("所选表已存在");
              layer.close(index);
              return false;
            }
            var res = Object.toAjaxJson(FUI.Handlers.SmartFormHandler, 'saveFormDefTableRel',
              { isAddTableBusObject: true, isAddFormField: true, refTableTitle: tableTitle, refFormDefId: that.formDefId, refTableId: tableId });
            if (res.success) {
              that.refreshGrid();
            } else {
              FUI.Window.showMsg(res.msg);
            }
          }
          layer.close(index);
        }, true);
      },
      importExistTableDef() {
        var that = this;
        FUI.Window.openEdit(__webpath + '/workflow/smartForm/table/tableDefinitionImprot/?isAddTableBusObject=true&&formDefId=' + that.formDefId, '导入外部表', 'Add', 'grid', 650, 500, null, null, null);
      },
      refreshGrid(parentGridId, parm) {
        var that = this;
        that.loadTableList();
      },
      showDialogEdit(formAction, busObjectId) {
        var that = this;
        // 添加表时会同时添加业务对象
        var url = '/workflow/smartForm/table/tableModeEdit?formDefId=' + that.formDefId;
        if (formAction == 'Edit') {
          url = '/workflow/smartForm/table/tableModeEdit?busObjectId=' + busObjectId + '&&formDefId=' + that.formDefId;
        }
        var title = formAction == FUI.FormAction.Add ? '新增表' : '编辑表';
        FUI.Window.openEdit(url, title, formAction, 'grid', 800, 500, null, null, null);
      },
      createTable() {
        var that = this;
        if (that.currTable.isCreateTable == true || that.currTable.isCreateTable == 1) {
          FUI.Window.showMsg(that, '物理表已发布，如果重新执行，请先删除物理表！');
          return false;
        }
        var tableId = that.currTable.tableId;
        FUI.Window.confirm(that, '您确定要发布【' + that.currTable.tableTitle + '】物理表吗？', '温馨提示', function (r) {
          var data = Object.toAjaxJson(FUI.Handlers.SmartFormHandler, 'createDbTableByTableId', {
            tableId: tableId
          }, true, null, function (data) {
            if (data.success) {
              that.currTable.isCreateTable = 1;
              that.loadTableColumnList(tableId);
              FUI.Window.showMsg2(that, data.msg, null, 1, function () {
                $.each(that.tableBusObjectList, function (i, t) {
                  if (t.tableId == tableId) {
                    t.isCreateTable = 1;
                  }
                });
              });
            } else {
              FUI.Window.showMsg(data.msg);
            }
          });
        });
      },
      operationEdit(col) {
        var that = this;
        col._disabled = false;
        that.columnListKey = Object.toGuid(false);
      },
      operationCancel(col) {
        var that = this;
        col._disabled = true;
        var columnId = col.columnId;
        var _id = col._id;
        if (!columnId && _id) {
          //新增未保存的
          that.tableColumnList = that.tableColumnList.filter(c => c._id != _id);
          return false;
        }
        //还原回修改前数据
        that.loadTableColumnList_oldTempData(that.currTable.tableId);
        var theOleRow = that.tableColumnList_oldtempData.find(c => c.columnId == columnId);
        if (theOleRow) {
          col.columnName = theOleRow.columnName;
          col.attrLength = theOleRow.attrLength;
          col.dataType = theOleRow.dataType;
          col.columnTitle = theOleRow.columnTitle;
          col.columnRemark = theOleRow.columnRemark;
          col.decimalLen = theOleRow.decimalLen;

        }
        that.columnListKey = Object.toGuid(false);
      },
      bathSaveColumn() {
        var that = this;
        var currentBoId = that.currTable.busObjectId;
        var isValidatePass = true;
        var fieldNameArr = [];
        //检查
        $.each(that.tableColumnList, function (i, col) {
          if (col.columnTitle == '') {
            FUI.Window.showMsg2('请填写字段标题');
            isValidatePass = false;
            return false;
          }
          if (col.columnName == '') {
            FUI.Window.showMsg2('请填写字段名称');
            isValidatePass = false;
            return false;
          }
          if (col.columnName.length > 30) {
            FUI.Window.showMsg2('请填写字段名不能超过30个字符');
            isValidatePass = false;
            return false;
          }
          var msg = FUI.ValidValue(col.columnName, 'englishchar');
          if (msg) {
            FUI.Window.showMsg('字段名称' + msg);
            isValidatePass = false;
            return false;
          }
          if ($.inArray(col.columnName, fieldNameArr) != -1) {
            FUI.Window.showMsg('字段名“' + col.columnName + '”存在重复');
            isValidatePass = false;
            return false;
          } else {
            fieldNameArr.push(col.columnName);
          }
        });
        if (isValidatePass) {
          //获取当前最大序号
          var res = Object.toAjaxJson("/workflow/smartForm/", "getMaxFieldOrderNoByBusObjectId", { "busObjectId": currentBoId, "formDefId": that.formDefId });
          var maxFieldOrderNo = parseInt(res.data);
          $.each(that.tableColumnList, function (i, col) {
            if (col._disabled == false) {
              that.operationSave(col, true, maxFieldOrderNo + (i * 3));
            }
          });
        }
      }
      , dataTypeChange(col){
        if(col.dataType === 'decimal'){
          col.attrLength=20;
          col.decimalLen=4;
        }
      }
      , operationSave(col, isBathSave, maxFieldOrderNo) {
        console.log(col,666)
        
        isBathSave = isBathSave == undefined ? false : isBathSave;
        var that = this;
        var currentBoId = that.currTable.busObjectId;
        if (col.columnTitle == '') {
          FUI.Window.showMsg2('请填写字段标题');
          return false;
        }
        if (col.columnName == '') {
          FUI.Window.showMsg2('请填写字段名称');
          return false;
        }
        if (col.columnName.length > 30) {
          FUI.Window.showMsg2('请填写字段名不能超过30个字符');
          return false;
        }
        var msg = FUI.ValidValue(col.columnName, 'englishchar');
        if (msg) {
          FUI.Window.showMsg('字段名称' + msg);
          return false;
        }
        if (col.columnTitle.indexOf('/') > -1 || col.columnTitle.indexOf('&') > -1 || col.columnTitle.indexOf('@') > -1 || col.columnTitle.indexOf('#') > -1 || col.columnTitle.indexOf('!') > -1) {
          FUI.Window.showMsg(col.columnTitle + ',不能含有特殊字符');
          return;
        }
        if(col.dataType === 'double' || col.dataType === 'decimal'){
          col.decimalLen = col.decimalLen
        }
        col.busObjectId = currentBoId;
        col.formDefId = that.formDefId;
        col.maxFieldOrderNo = maxFieldOrderNo;
        FUI.Form.submitForm(that, col, FUI.Handlers.SmartFormHandler, 'saveTableColumn', null, null, null, null, null, null, null, function (obj) {
          if (isBathSave == false) {
            if (obj.success) {
              FUI.Window.showMsg2(that, obj.msg, null, 1, function () {
                col._disabled = true;
                col.columnId = obj.data.columnId;
                col.isCreatedInDB = obj.data.isCreatedInDB;
                that.columnListKey = Object.toGuid();
              });
            } else {
              FUI.Window.showMsg(obj.msg);
            }
          } else {
            if (obj.success) {
              col._disabled = true;
              col.columnId = obj.data.columnId;
              col.isCreatedInDB = obj.data.isCreatedInDB;
              that.columnListKey = Object.toGuid();
            }
          }
        });
      },
      // 关联表
      goFormDefTableRelList() {
        var that = this;
        var url = __webpath + '/workflow/smartForm/table/formDefTableRelList/?formDefId=' + this.formDefId + '&categoryCode=' + that.categoryCode;
        FUI.Window.openEdit(url, '【' + that.formDefData.formDefName + '】关联表', 'Edit', 'grid', 800, 500, null, null, null, true);
      },
      formFieldList() {
        // 控件定义
        var that = this;
        var url = __webpath + '/workflow/smartForm/formFieldList?formDefId=' + that.formDefId;
        FUI.Window.openEdit(url, '【' + that.formDefData.formDefName + '】表单字段控件', 'Edit', 'grid', 800, 500, null, null, null, true);
      },
      formDefEdit() {
        // 模型基本信息修改
        var that = this;
        var url = __webpath + '/workflow/smartForm/formDefEdit?parentGridId=grid&formAction=Edit&mainTable=f2bpm_form_FormDef&keyId=' + that.formDefId;
        FUI.Window.openEdit(url, that.formDefData.formDefName, 'Edit', 'grid', 800, 500, null, null, null);
      },
      operationDelete(col) {
        var that = this;
        var tableId = col.tableId;
        var columnId = col.columnId;
        var _id = col._id;
        if (!columnId && _id) {
          that.tableColumnList = that.tableColumnList.filter(c => c._id != _id);
          return false;
        }
        var param = { columnId: col.columnId };
        FUI.Window.confirm(that, '您确定要删除' + col.columnName + '吗？', '温馨提示', function (r) {
          var result = Object.toAjaxJson(FUI.Handlers.SmartFormHandler, 'deleteColumnById', param);
          if (result.success) {
            FUI.Window.showMsg2(result.msg, null, result.success ? 1 : 7);
            that.loadTableColumnList(tableId);
          } else {
            FUI.Window.showMsg(result.msg);
          }
        });
      },
      downLoadTableDef() {
        var that = this;
        var ids = this.currTable.tableId;
        if (ids == '') {
          FUI.Window.showMsg(that, '请选择要导出的表！');
          return false;
        }
        var data = Object.toAjaxDownloadFile(FUI.Handlers.SmartFormHandler, 'downLoadTableDef', {
          tableIds: ids
        });
      },
      question1() {
        FUI.Window.showMsg(this, '删除已创建到数据库中的字段，此操作一般应用于测试平台上使用，正式生产环境时请警慎操作 。</br>第1：使用数据库工具打开数据库物理表,手工删除字段。</br>第2步：点击本页面上的“检查物理表字段是否已创建”；</br>第3步：查看“字段是否已创建”的列显示为红色“否”；</br>第4步： 若要修改：通过操作列修改字段定义，若要删除时：通过操作列删除按钮进行删除。</br>第5步：若想重新发布此字段，修改完后则点击操作列的发布物理字段按钮。（完）');
      },
      toPinYin(dataObj, sourceField, targetField) {
        if (!dataObj[targetField]) {
          const source = dataObj[sourceField];
          dataObj[targetField] = Object.toPinYin(source, true);
        }
      }
    }

  }
</script>
<style>
  .table-card-list .el-card__header {
    padding-left: 10px;
    padding-right: 4px;
  }

  .table-card-list .el-card__body {
    padding: 10px;
  }

  .table-def-card {
    margin-bottom: 15px;

    background: #006EFF;
    border-color: #006EFF;
    padding: 1px;
    cursor: pointer;
  }

  .table-def-card-selected {
    background: rgb(255, 106, 0);
    border-color: rgb(255, 106, 0);

  }

  .table-def-card .el-card__header {
    padding: 0px;
    padding-left: 5px;
    font-weight: bold;
    color: #FFFFFF;
    line-height: 30px;
    height: 30px !important;
  }

  .table-def-card-selected .el-card__header {
    color: #FFFFFF !important;
  }

  .table-def-card .el-card__body {
    background: #FFFFFF;
    height: 160px;
    padding: 10px 5px 5px 8px;
    border-bottom-left-radius: 2px;
    border-bottom-right-radius: 2px;
  }

  .table-def-card .el-card__body label {
    font-weight: normal;
  }

  .table-def-card .el-card__body .textBoxShort {
    width: 220px;
  }

  .table-def-card .table-def-card-content div {
    padding: 3px 0;
  }

  .table-def-card .card-head-btn {
    cursor: pointer;
    position: relative;
    right: -8px;
  }

  .table-field-list {
    overflow-y: auto;
  }

  .table-field-list .asc {
    position: relative;
    top: -5px;
    left: -11px;
    color: #C0C4CC;
  }

  .table-field-list .desc {
    position: relative;
    bottom: -3px;
    color: #C0C4CC;
  }
  .table-field-list .ordered{
    color: #000000;
  }
</style>