<template>
  <div class="f2bpm-page-layout">
    <el-container>
      <el-aside ref="sideLeft" class="f2bpm-page-left" hide-trigger collapsible :width="isCollapsed?'20px':'240px'">
        <div class="f2bpm-panel-head">
          <div v-if="!isCollapsed" class="f2bpm-left-search-div">
            <el-input v-model="treeFilterTextCategory" style="border: 0px; width: 190px;" size="mini" clearable :placeholder="$t('enterKey')" autocomplete="off" prefix-icon="el-icon-search" />
          </div>
          <div style=" float: right;line-height:35px;padding-right: 5px;">
            <i v-if="!isCollapsed" :title="$t('refresh')" class="fa fa-refresh  cur ml10 font12 mr10 " @click="loadCategoryTree()" />
            <i title="收起/展开" :class="rotateIcon" @click="collapsedSider" />
          </div>
        </div>
        <div v-if="!isCollapsed" class="f2bpm-page-left-content auto-window-height-bigger mt4 ">
          <div class="mytree-cube-box-container">
            <span class="cur  mytree-cube-box " @click="showAllCategory()"><i class="icon icon-quanbu font16"></i> {{$t('all')}}</span>
            <span class="cur  mytree-cube-box" @click="categoryManager"><i class="icon icon-fenlei font16"></i> {{$t('category')}}</span>
          </div>
          <el-tree ref="mytreeCategory" :data="categoryTreeData" highlight-current :filter-node-method="filterTreeNode" :expand-on-click-node="false" default-expand-all @node-click="onCategoryTreeSelected" />
        </div>
      </el-aside>

      <el-aside ref="sideLeft" class="f2bpm-page-left" hide-trigger collapsible width="350px">
        <div class="f2bpm-panel-head f2bpm-panel-head-bg">
          汇报树列表 <span @mouseenter="showAddMenus($event)" class="fa fa-cog cur mt10" style="margin-left:210px;">管理</span>
        </div>

        <ul class="ul-nav">
          <li v-for="def in relationList" :class="currentDef.relationKey==def.relationKey?'selected':''" @mouseenter="treeNodeMouseenter(def.id)" @mouseleave="treeNodeMouseleave(def.id)">
            <div>
              <a style="display: inline-block;width: 80%;" href="javascript:void(0)" @click.stop="selectRelationDef(def)"><i class="fa fa-list"></i> {{def.relationTitle}} <span v-html="rlationPriority(def.relationPriority)"></span> </a>
              <span :id="'edit_'+def.id" style="display:none">
                <span class="mr10 cur" type="text" title="删除" size="mini" @click.stop="deleteRelation(def)">
                  <i class="fa fa-trash-o" />
                </span>
                <span type="text" class="cur mr5" size="mini" title="编辑" @click.stop="editRelation(def)">
                  <i class="fa fa-edit" />
                </span>
                <span type="text" class="cur mr5" size="mini" title="导出" @click.stop="exportXml(def)">
                  <i class="fa  fa-download" />
                </span>
              </span>
            </div>
          </li>
        </ul>
      </el-aside>

      <el-aside ref="sideLeft" class="f2bpm-page-left" width="340px">
        <div class="f2bpm-panel-head" style="height: 35px; ">
          <div class="f2bpm-left-search-div" style="line-height: 35px;width: 300px;">
            <el-input v-model="treeFilterText" style="border:0;height: 35px;" clearable :placeholder="$t('enterKey')" size="mini" autocomplete="off" prefix-icon="el-icon-search" />
          </div>
          <div style="float: right;line-height:35px;padding-right: 5px;">
            <i :title="$t('refresh')" class="fa fa-refresh  cur ml10 font12 " @click="refreshTree()" />
          </div>
        </div>
        <div class="auto-window-height f2bpm-page-left-content mt4" style="width: 99%;min-height: 600px;">
          <div class="pl10">
            <i class="fa fa-user mr10"> 用户 </i>
            <i class="fa fa-users mr10"> 角色 </i>
            <i class="fa fa-university mr5"> 组织</i>
            <i class="fa fa-star  font12  yellow2" title="最高优先级"></i>最高优先级
          </div>
          <el-tree ref="mytree" :data="treeData" :expand-on-click-node="false" highlight-current :filter-node-method="filterTreeNode" default-expand-all @node-click="onTreeSelected">
            <span slot-scope="{ node, data }" class="custom-tree-node" @mouseenter="treeNodeMouseenter(data.id)" @mouseleave="treeNodeMouseleave(data.id)">
              <span>
                <i class="fa fa-home" v-if="data.nodeType=='Root'" title="汇报树"></i>
                <i class="fa fa-user" v-else-if="data.nodeType=='user'" title="用户"></i>
                <i class="fa fa-users" v-else-if="data.nodeType=='role'" title="角色"> </i>
                <i class="fa  fa-university" v-else-if="data.nodeType=='org'" title="组织"></i>
                <i class="fa fa-star  font12  yellow2" v-if="data.nodeType!='Root'&&data.attributes.isHigherPriority" title="最高优先级"></i>
                {{ node.label }} <span v-html="getOwnerFlagText(data.attributes)" class="owner-flag"></span></span>
              <span :id="'edit_'+data.id" class="leadrelation-tree-node-tool">
                <el-button type="text" style="padding-left: 0;padding-right: 0;" size="mini" title="添加子项" @click.stop="() => appendItem(data)">
                  <i class="fa fa-plus" />
                </el-button>
                <el-button type="text" style="padding-left: 0;padding-right: 0;" v-if="data.nodeType!='Root'" size="mini" title="删除子项" @click.stop="() => removeItem(data)">
                  <i class="fa fa-trash-o" />
                </el-button>
              </span>
            </span>
          </el-tree>
        </div>
      </el-aside>
      <el-main class="f2bpm-page-right">
        <el-form v-if="data.id!=''||formAction=='Add'" ref="formRef" :rules="formRules" size="mini" :model="data" class="f2bpm-editform" label-width="120px">
          <h2 class="mb10"><i class="fa fa-edit"></i>{{formAction=='Add'?'新增子节点':'修改当前节点'}}</h2>
          <el-form-item label="身份类型" prop="ownerType">
            <f2bpmui-radio :field="ownerType_def" :fieldvalue="data.ownerType" @updatevalue="updateFieldValue" />
          </el-form-item>
          <el-form-item :label="currOwnerTitle" prop="ownerTitle">
            <el-input v-model="data.ownerTitle" placeholder="请选择" class="textBoxShort" :disabled="true" />
            <a role="button" href="javascript:void(0)" title="选择用户" @click="selectOwner" class="btn btn-sm ml5 btn-default font12"><i class="fa fa-search" />选择</a>
          </el-form-item>
          <el-form-item label="与上级关系" v-if="formAction=='Edit'">
            <span v-for="relItem in relationTypeRelList" class="cube bg-blue mr4">
              <span>{{relItem.typeTitle}} <i class="fa fa-close font12" title="删除关系标签" @click="deleteRelTypeRel(relItem.id,relItem.typeTitle)"></i></span>
            </span>
            <a role="button" href="javascript:void(0)" title="选择关系标签" @click="selectRelationType(data.id)" class="btn btn-sm ml5 btn-default font12"><i class="fa fa-search" />添加关系</a>
          </el-form-item>
          <el-form-item label="标签属性">
            <span v-for="relItem in ownerFlagList" class="cube bg-blue mr4">
              <span>{{relItem.typeTitle}} <i class="fa fa-close font12" title="删除标签" @click="deleteOwnerFlag(relItem.typeCode,relItem.typeTitle)"></i></span>
            </span>
            <a role="button" href="javascript:void(0)" title="选择关系标签" @click="selectOwnerFlag" class="btn btn-sm ml5 btn-default font12"><i class="fa fa-plus" />贴标签</a>
          </el-form-item>
          <el-form-item label="最高优先级">
            <span v-if="data.isHigherPriority" title="点击取消最高优先级" class="fa fa-star  font20 cur mr10 yellow2" @click="isHigherPriorityClick"></span>
            <span v-else class="fa fa-star-o font20 cur mr10" title="点击标记为最高优先级" c @click="isHigherPriorityClick"></span>

            <el-tooltip class="item" effect="dark" content="【我在哪里】将以本节点作为最高优先级。" placement="right">
              <i class="el-icon-question">说明</i>
            </el-tooltip>
          </el-form-item>
          <el-form-item label="备注" prop="remarks">
            <el-input v-model="data.remarks" type="textarea" :rows="4" placeholder="" />
          </el-form-item>
          <div class="dialogfooter2">
            <el-button v-if="formAction!='View'" size="small" type="primary" @click="submitForm()"><i class="fa fa-save" />保存
            </el-button>
          </div>
        </el-form>
        <div v-show="menuVisible" id="treeAddMenus" class="treeRightMenu" @mouseleave="onMenuMouseleave">
          <el-menu id="menu" text-color="#000" @select="onMenuSelect">
            <el-menu-item index="addRelation">
              <i class="fa fa-file-text-o" /> 新建汇报树
            </el-menu-item>
            <el-menu-item index="importRelation">
              <i class="fa fa-upload" /> 导入汇报树
            </el-menu-item>
            <!--  <el-divider><i class="el-icon-more" /></el-divider> -->
            <el-menu-item index="relationTypeList">
              <i class="fa fa-folder-o" /> 管理关系类型
            </el-menu-item>

          </el-menu>
        </div>
      </el-main>

    </el-container>
  </div>
</template>
<script>
  export default {

    data() {
      return {
        currOwnerTitle: "用户",
        formAction: null,
        menuVisible: false,
        currCategoryCode: "",
        treeFilterTextCategory: "",
        treeFilterText: '',
        isCollapsed: false,
        categoryTreeData: [],
        currentDef: { relationKey: "" },
        ownerType_def: { fieldName: 'ownerType', fieldTitle: '身份类型', inputCtrlOption: { "data": [{ "orderNum": 1, "text": "用户", "value": "user" }, { "orderNum": 2, "text": "角色", "value": "role" }, { "orderNum": 3, "text": "组织", "value": "org" }], "type": "custom" }, fieldOptions: null, fieldRemark: '' },
        dg: {},
        tablePage: Object.toClone(FUI.DataGridProperty.tablePage),
        loading: false,
        relationList: [{
          id: "",
          relationTitle: "",
          relationKey: "",
          tenantid: "",
          remarks: ""
        }],
        treeData: [],
        ownerFlagList: [
        ],
        relationTypeRelList: [
          {
            id: "",
            typeTitle: "测试",
            typeCode: "",
            relRelationTypeId: "",
            relRelationItemId: ""

          }
        ],
        data: {
          id: "",
          ownerTitle: "",
          ownerId: "",
          ownerType: null,
          //标签，数组字符串格式
          ownerFlag: "",
          remarks: "",
          parentId: "",
          refRelationKey: "",
          isHigherPriority: false,
          tenantid: ""
        }
        , formRules: {
          ownerId: [{ required: true, message: '必填项不能为空' }],
          ownerTitle: [{ required: true, message: '必填项不能为空' }],
          ownerType: [{ required: true, message: '必填项不能为空' }]
        }
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

      , rlationPriority() {
        return function (v) {
          var result = "";
          if (v) {
            var arrTitle = [];
            var arr = v.split(',');
            $.each(arr, function (i, item) {
              var title = "";
              if (item === "all") {
                title = "所有";
              }
              else if (item === "role") {
                title = "角色";
              }
              else if (item === "org") {
                title = "组织";
              }
              else if (item === "user") {
                title = "用户";
              }
              arrTitle.push(title);
              result += '【' + title + '】';
            });
          }
          return result;
        };
      }
      , getOwnerFlagText() {
        return function (attributes) {
          let that = this;
          if (attributes == null || attributes == undefined) {
            return "";
          }
          var ownerFlag = attributes.ownerFlag || "";
          if (ownerFlag == "") {
            return "";
          }
          var ownerFlagList = eval("(" + ownerFlag + ")");
          var textArr = [];
          if (ownerFlagList.length == 0) {
            return "";
          }
          $.each(ownerFlagList, function (i, flagItem) {
            textArr.push(flagItem.typeTitle);
          });

          return "【" + textArr.toString() + "】";
        };
      }
    },
    watch: {
      treeFilterText(val) {
        this.$refs.mytree.filter(val);
      }
      , treeFilterTextCategory(val) {
        this.$refs.mytreeCategory.filter(val);
      }
    },
    created() {
      var that = this;
      that.loadCategoryTree();
      that.loadrelationList();
      that.loadTree();
      that.getownerTitle();
    },
    mounted() {
      window.myvm = this;
      window.autoPageHeight();
    },
    methods: {
      getownerTitle() {
        var that = this;
        let ownerType = that.data.ownerType;
        let currOwnerTitle = "";
        switch (ownerType) {
          case "user": currOwnerTitle = "用户"; break;
          case "role": currOwnerTitle = "角色"; break;
          case "org": currOwnerTitle = "组织"; break;
          default: currOwnerTitle = "用户"; break;
        }
        that.currOwnerTitle = currOwnerTitle;
      }
      , treeNodeMouseenter(key) {
        $('#edit_' + key).show();
      },
      treeNodeMouseleave(key) {
        $('#edit_' + key).hide();
      },
      collapsedSider() {
        this.isCollapsed = !this.isCollapsed;
      },
      filterTreeNode(value, data) {
        if (!value) return true;
        return data.title.indexOf(value) !== -1;
      },
      //汇报树分类
      categoryManager() {
        var that = this;
        var url = '/workflow/security/category/categoryList_bygroupKey?groupKey=RelationTreeGroup';
        var title = "汇报树分类管理";
        FUI.Window.openEdit(url, title, "Edit", "grid", 700, 500, null, "", "", true);
      }
      , loadCategoryTree() {
        var that = this;
        var treeUrl = FUI.Handlers.CategoryHandler + '?groupKey=RelationTreeGroup';
        Object.toAjaxJson(treeUrl, null, null, true, null, function (res) {
          if (res.success) {
            that.categoryTreeData = res.data;
            var msg = res.msg;
          } else {
            FUI.Window.showMsg(that, res.msg);
          }
        });
      }
      , showAllCategory() {
        this.currCategoryCode = "";
        this.refreshGrid();
      }
      , onCategoryTreeSelected(data, treeNode, thisObj) {
        this.currCategoryCode = treeNode.data.id;
        this.refreshGrid();
      },
      //汇报树列表
      refreshGrid(parentGridId, parm) {
        var that = this;
        that.loadrelationList();
      },
      dataGridReSet() {
        var that = this;
        that.loadrelationList();
      },
      loadrelationList() {
        let that = this;
        var parm = { categoryCode: that.currCategoryCode };
        Object.toAjaxJson("/workflow/security/relation/getRelationList", null, parm, true, null, function (res) {
          if (res.success) {
            that.relationList = res.data;
          } else {
            FUI.Window.showMsg(res.msg);
          }
        });
      },
      selectRelationDef(def) {
        var that = this;
        that.currentDef = def;
        that.loadTree();
        that.clearEditData();
      }
      , deleteRelation(def) {
        let that = this;
        let id = def.id;
        FUI.Window.confirm("您确定要删除“" + def.relationTitle + "”吗？", null, function () {
          Object.toAjaxJson("/workflow/security/relation/delete", null, { keyId: id }, true, null, function (res) {
            if (res.success) {
              that.loadrelationList();
              that.treeData = [];
              that.data.id = "";
              that.formAction = "";
            } else {
              FUI.Window.showMsg(res.msg);
            }
          });
        });
      }
      , onMenuSelect(key) {
        var that = this;
        var fn = that[key];
        fn();
      }
      , showAddMenus(event) {
        this.menuVisible = true;
        const menu = document.querySelector('#treeAddMenus');
        menu.style.left = event.clientX - 210 + 'px';
        menu.style.top = event.offsetY + 5 + 'px';
      },
      onMenuMouseleave() {
        this.menuVisible = false;
      }
      , relationTypeList() {
        var that = this;
        var url = '/workflow/security/relation/relationTypeListByInfotype?infoType=relationTree';
        var title = "管理汇报关联类型";
        FUI.Window.openEdit(url, title, "Edit", "grid", 700, 500, null, "", keyId, true);
      }
      , addRelation() {
        let that = this;
        that.relationEditDialog('Add', "");
       
      }
      , importRelation() {
        let that = this;
        FUI.Window.openEdit('/workflow/security/relation/relationImportXml', '导入汇报树', FUI.FormAction.Edit, '', 550, 380);
      }
      , editRelation(def) {
        this.relationEditDialog(FUI.FormAction.Edit, def["id"], def.relationTitle);
      },
      exportXml(def) {
        var that = this;
        var id = def.id;
        var data = Object.toAjaxDownloadFile('/workflow/security/relation/', 'downloadRelationInfoXml', {
          id: id
        });
      }
      , relationEditDialog(formAction, keyId, title) {
        var that = this;
        var url = '/workflow/security/relation/relationEdit';
        var title = formAction == FUI.FormAction.Add ? '新增汇报树' : '编辑' + title;
        FUI.Window.openEdit(url, title, formAction, "grid", 700, 500, null, "", keyId);
      },
      onTreeSelected(data, treeNode, thisObj) {
        let that = this;
        if (data.nodeType == 'Root') {
          return false;
        }
        let id = treeNode.data.id;
        that.data = Object.toDeepClone(data.attributes);
        console.info(that.data);
        that.formAction = "Edit";
        that.loadOwnerFlagList();
        that.loadRelTypeRelList(id);
        that.getownerTitle();
      },
      refreshTree() {
        var that = this;
        that.loadTree();
      },
      loadTree() {
        var that = this;
        if (that.currentDef == null || !that.currentDef.relationKey) {
          return false;
        }
        var treeUrl = "/workflow/security/relation/getRelationItemTreeJson?relationKey=" + that.currentDef.relationKey;
        Object.toAjaxJson(treeUrl, null, null, true, null, function (res) {
          if (res.success) {
            that.treeData = res.data;
            var msg = res.msg;
          } else {
            FUI.Window.showMsg(res.msg);
          }
        });
      }
      , appendItem(data) {
        let that = this;
        let relationKey = that.currentDef.relationKey;
        let parentId = data.id;
        that.formAction = "Add";
        if (that.data.id != "") {
          that.clearEditData();
        } else {
          that.data.ownerType = "user";
        }
        const currUser = that.$store.state.user.author;
        that.data.tenantid = currUser.tenantId;
        that.data.refRelationKey = relationKey;
        that.data.parentId = parentId;
        that.getownerTitle();
        //var url = '/workflow/security/relation/relationItemEdit?relationKey=' + relationKey + '&parentId=' + id;
        //FUI.Window.openEdit(url, '添加汇报项', 'Add', that.dg.GridId, 800, 500, null, "", '')
      }
      , removeItem(data) {
        let that = this;
        var tip = "删除确定要删除【" + data.label + "】吗？";
        if (data.children) {
          tip = "确定要删除【" + data.title + "】及所有子项吗？";
        }
        var id = data.id;
        FUI.Window.confirm(that, tip, null, function () {
          var data = Object.toAjaxJson('/workflow/security/relation/', 'deleteItemAndAllSubs', { 'id': id });
          if (data.success == true) {
            that.loadTree();
          } else {
            FUI.Window.showMsg(that, data.msg);
          }
        });
      },
      //编辑明细项
      submitForm() {
        var that = this;
        var success = that.validateForm('formRef');
        if (!success) return;
        if (that.data.ownerId == "") {
          FUI.Window.showMsg2(that, "请选择用户");
          return false;
        }
        var saveData = Object.toDeepClone(that.data);
        saveData.formAction = that.formAction;
        saveData.keyId = that.data.id;
        var data = Object.toAjaxJson('/workflow/security/relation/', 'saveItemModel', saveData);
        if (data.success == true) {
          FUI.Window.showMsg(that, data.msg, null, null, function () {
            that.clearEditData();
            that.loadTree();
          });
        } else {
          FUI.Window.showMsg(that, data.msg);
        }
      }
      , isHigherPriorityClick() {
        var that = this;
        that.data.isHigherPriority = !that.data.isHigherPriority;
      }
      , clearEditData() {
        let that = this;
        $.each(that.data, function (key, v) {
          if (key == 'ownerTitle') {
            that.data[key] = "请选择";
          } else if (key == 'ownerType') {
            that.data[key] = null;
          } else if (key == 'tenantid') {
            const currUser = that.$store.state.user.author;
            that.data[key] = currUser.tenantId;
          }
          else {
            that.data[key] = "";
          }
        });
        that.data.ownerType = "user";
      }
      // field: 可以是字段名也可以是字段定义的对象
      , updateFieldValue(field, newValue, vueDataName, subVueDataName) {
        // 更新控件值
        var that = this;
        that.data.ownerId = "";
        that.data.ownerTitle = "";
        var vueDataObj = vueDataName ? that[vueDataName] : that.data;
        if (subVueDataName) {
          vueDataObj = that[vueDataName][subVueDataName];
        }
        vueDataObj[field] = newValue;
        that.getownerTitle();
      },
      validateForm(refFormName) {
        var success = false;
        this.$refs[refFormName].validate(valid => {
          success = valid;
        });
        return success;
      },
      //配置关系类型
      loadRelTypeRelList(itemId) {
        var that = this;
        var treeUrl = "/workflow/security/relation/getRelationTypeRelList?itemId=" + itemId;
        Object.toAjaxJson(treeUrl, null, null, true, null, function (res) {
          if (res.success) {
            that.relationTypeRelList = res.data;
            var msg = res.msg;
          } else {
            FUI.Window.showMsg(res.msg);
          }
        });
      }
      , deleteRelTypeRel(relId, title) {
        let that = this;
        var tip = "删除确定要删除【" + title + "】吗？";
        FUI.Window.confirm(that, tip, null, function () {
          var data = Object.toAjaxJson('/workflow/security/relation/', 'deleteRelationTypeRel', { 'id': relId });
          if (data.success == true) {
            that.loadRelTypeRelList(that.data.id);
          } else {
            FUI.Window.showMsg(that, data.msg);
          }
        });
      }
      , deleteOwnerFlag(typeCode, title) {
        let that = this;
        var tip = "删除确定要删除【" + title + "】标签吗？";
        FUI.Window.confirm(that, tip, null, function () {
          let tem = that.ownerFlagList.filter(a => a.typeCode != typeCode);
          that.ownerFlagList = tem;
          that.data.ownerFlag = that.ownerFlagList.length == 0 ? "" : JSON.stringify(that.ownerFlagList);
        });
      }
      , selectOwner() {
        var that = this;
        var isMutil = that.formAction == "Add";
        if (that.data.ownerType == "user") {
          that.selectorUserTextValue(isMutil);
        } else if (that.data.ownerType == "org") {
          that.selectorTextValue("org", isMutil);
        } else if (that.data.ownerType == "role") {
          that.selectorTextValue("role", isMutil);
        }
      }
      , selectRelationType(itemId, isMutil) {
        var that = this;
        var infoType = "relationTree";
        WF.SelectorDialog.selectRelationType(that, null, null, infoType, null, false, true, function (data) {
          if (data != false) {
            var relationTypeJson = JSON.stringify(data);
            var res = Object.toAjaxJson('/workflow/security/relation/', 'saveItemRelationTypeRel', { 'itemId': itemId, data: relationTypeJson });
            if (res.success == true) {
              FUI.Window.showMsg2(that, res.msg, null, 1);
              that.loadRelTypeRelList(itemId);
            } else {
              FUI.Window.showMsg(that, res.msg);
            }
          }
        });
      }
      , selectOwnerFlag(isMutil) {
        var that = this;
        var infoType = "relationTree";
        WF.SelectorDialog.selectRelationType(that, null, null, infoType, null, false, true, function (data) {
          if (data != false && data.length > 0) {
            $.each(data, function (i, relationTypeItem) {
              let typeCode = relationTypeItem.typeCode;
              let typeTitle = relationTypeItem.typeTitle;
              let item = { "typeCode": typeCode, "typeTitle": typeTitle };
              if (that.ownerFlagList.length == 0) {
                that.ownerFlagList.push(item);
              } else {
                var isexist = that.ownerFlagList.find(a => a.typeCode == typeCode);
                if (!isexist) {
                  that.ownerFlagList.push(item);
                }
              }
            });
            that.data.ownerFlag = JSON.stringify(that.ownerFlagList);
          }
        });
      }
      , loadOwnerFlagList() {
        var that = this;
        var ownerFlag = that.data.ownerFlag || "";
        if (ownerFlag) {
          that.ownerFlagList = eval("(" + ownerFlag + ")");
        } else {
          that.ownerFlagList = [];
        }
      }

      , selectorTextValue(type, isMutil) {
        var that = this;
        let inputKey = 'ownerId';
        let inputName = 'ownerTitle';
        WF.SelectorDialog.selectorTextValue(that, inputKey, inputName, type, null, !isMutil, false);
      }
      , selectorUserTextValue(isMutil) {
        var that = this;
        let inputKey = 'ownerId';
        let inputName = 'ownerTitle';
        WF.SelectorDialog.selectorUserString(that, inputKey, inputName, null, !isMutil, 'userId');
      }
    }
  }
</script>
<style>
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 12px;
    padding-right: 8px;
  }

  .leadrelation-tree-node-tool {
    display: none;
  }

  .owner-flag {
    font-style: italic;
    font-weight: normal;
    color: #c0c4cc;
  }
</style>