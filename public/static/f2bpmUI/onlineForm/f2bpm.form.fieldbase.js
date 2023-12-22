var row_template = {
  type: 'row',
  id: 'row_' + Object.toGuid(false),
  orderNum: 100,
  label: "",
  alias: "",
  alias2: '',
  gutter: 0,
  style: '',
  sectionStyle: '',
  justify: '',
  align: '',
  showLabel: false,
  //折叠状态，true折叠，false展开
  collapse: false,
  //是否留出前置空隙
  showPrefixSpaced: false,
  //是否显示前缀蓝色块
  showPrefixBar: false,
  children: [
    // {
    //   type: 'col',
    //   id: 'col_' + Object.toGuid(false),
    //   label: "col101",
    //   span: 8,
    //   style: '',
    //   children: []
    // }
  ]
};
//字段基础格式
var field_template = {
  id: '',
  fieldId: '',
  type: 'field',
  ctrType: "text",
  label: "",
  alias: "",
  alias2: '',
  labelSuffix: ":",
  orderNum: 10,
  labelWidth: null,
  showLabel: true,
  slot: '',
  style: '',
  vModel: "",
  isRequired: false,
  fieldRemark: '',
  fieldTip:'', // 关联说明
  _oldisRequired: false,
  _oldisShowPower: true,
  _oldisReadOnly: false,
  _isRequired: false,
  _isShowPower: true,
  _isReadOnly: false,
  //其它属性为表单控件表定义的属性
};

//===========扩展容器=================
//页签容器
var tabs_template = {
  isContainer: true,
  type: 'tabs',
  id: 'tabs_' + Object.toGuid(false),
  ctrType: "extend_tabs",
  showLabel: false,
  labelWidth: '0px',
  label: "页签容器",
  labelSuffix: "",
  orderNum: 1,
  style: '',
  tabPosition: '',
  tabType: '',
  tabSelected: '',
  _isShowPower: true,
  _oldisShowPower: true,
  children: [
    {
      type: 'tabpane',
      id: 'tabpane_' + Object.toGuid(false),

      ctrType: "tabpane",
      label: "标签页",
      labelSuffix: "",
      orderNum: 1,

      style: '',
      children: [
        //行容器
      ]
    }
  ]
};
//container div容器：目的是为了可以嵌入行列
var container_template = {
  type: 'container',
  //是否为容器
  isContainer: true,
  id: 'container_' + Object.toGuid(false),
  ctrType: "extend_container",
  showLabel: false,
  labelWidth: '0px',
  label: "布局容器",
  labelSuffix: "",
  orderNum: 1,
  style: '',
  _isShowPower: true,
  _oldisShowPower: true,
  children: [
    {
      type: 'containerPane',
      id: 'containerPane_' + Object.toGuid(false),
      ctrType: "containerPane",
      label: "侧边",
      labelSuffix: "",
      orderNum: 1,
      width: 0,
      height: 0,
      tag: 'aside ',
      style: '',
      children: [
        //行容器
      ]
    }
    , {
      type: 'containerPane',
      id: 'containerPane_' + Object.toGuid(false),
      ctrType: "containerPane",
      label: "内容",
      width: 0,
      height: 0,
      orderNum: 2,
      tag: 'main',
      style: '',
      children: [
        //行容器
      ]
    }
  ]
};
//表格容器,只允许在表格容器中放字段控件或再次放栅格
var table_template = {
  isContainer: true,
  type: 'table',
  id: 'table_' + Object.toGuid(false),
  ctrType: "extend_table",
  showLabel: false,
  labelWidth: '0px',
  label: "表格容器",
  labelSuffix: "",
  _isShowPower: true,
  _oldisShowPower: true,
  orderNum: 1,
  colWidths: [{ colnum: 1, width: "100px" }, { colnum: 2, width: "100px" }],
  //表格统一行高
  rowHeight: '50',
  tableWidth: '100%',
  //标题样式
  sectionStyle: "",
  cellStyle: 'border: 1px solid #DDDDDD;',
  style: 'border: 1px solid #DDDDDD;',
  children: [
    {
      type: 'tr',
      id: 'tr_' + Object.toGuid(false),
      ctrType: "tr",
      label: "第一行",
      labelSuffix: "",
      orderNum: 1,
      height: 0,
      style: '',
      children: [
        {
          type: 'td',
          id: 'td_' + Object.toGuid(false),
          ctrType: "td",
          label: "列",
          labelSuffix: "",
          orderNum: 1,
          width: 150,
          style: '',
          children: [
            //行容器或控件字段

          ]
        }
        , {
          type: 'td',
          id: 'td_' + Object.toGuid(false),
          ctrType: "td",
          label: "列",
          labelSuffix: "",
          orderNum: 1,
          width: 150,
          style: '',
          children: [
            //行容器或控件字段

          ]
        }
      ]
    }

  ]
};

var table_td_RowColTemplate = {
  "type": "row",
  "id": "row_" + Object.toGuid(false),
  "orderNum": 100,
  "label": "",
  "alias": "",
  "alias2": '',
  "showLabel": false,
  "style": "",
  "sectionStyle": "",
  "justify": "",
  "align": "",
  "gutter": 0,
  "children": [
    {
      "type": "col",
      "id": "col_" + Object.toGuid(false),
      "label": "",
      "span": 24,
      "style": "",
      "children": []
    }
  ]
};
//===========页面组件=================
var tabtoolbar_template = {
  type: 'tabtoolbar',
  id: 'tabtoolbar_' + Object.toGuid(false),
  ctrType: "extend_tabtoolbar",
  showLabel: false,
  labelWidth: '0px',
  label: "按钮组工具条",
  alias: "",
  alias2: "",
  labelSuffix: "",
  orderNum: 1,
  style: '',
  tabPosition: '',
  tabType: '',
  //按钮字段名，可用于权限绑定
  vModel: '',
  tabSelected: '',
  _isShowPower: true,
  _oldisShowPower: true,
  children: [
    {
      type: 'tabbtn',
      id: 'tabbtn_' + Object.toGuid(false),
      ctrType: "tabbtn",
      btnType: 'primary',
      label: "按钮1",
      alias: "",
      alias2: "",
      orderNum: 1,
      style: '',
      clickEventName: '',
      icon: 'fa fa-edit',
      _isShowPower: true,
      _oldisShowPower: true,
    }
    , {
      type: 'tabbtn',
      id: 'tabbtn_' + Object.toGuid(false),
      ctrType: "tabbtn",
      btnType: 'primary',
      label: "按钮2",
      alias: "",
      alias2: "",
      orderNum: 1,
      style: '',
      clickEventName: '',
      icon: 'fa fa-search',
      _isShowPower: true,
      _oldisShowPower: true,

    }
  ]
};
//=============子列表控件==========
var subtable_template = {
  type: 'subtable',
  id: 'subtable_' + Object.toGuid(false),
  ctrType: "subtable",
  showLabel: false,
  labelWidth: '0px',
  label: "",
  alias: "",
  alias2: '',
  labelSuffix: "",
  orderNum: 1,
  style: '',
  _isShowPower: true,
  _oldisShowPower: true,
  //必填行数
  requiredNumOfRows:0,
  props: {
    tableId: '',
    tableName: '',
    tableFullName: '',
    removeFooterRow: false,
    hideCheckbox: false,
    hideNumber: false,
    operation: false,
    addWay: 'default'
  },
  operation: [],
  toolbar: [],
  columns: [
    {

    }
  ]
};

var button_template = {
  type: 'button',
  id: 'button_' + Object.toGuid(false),
  ctrType: "extend_button",
  showLabel: false,
  labelWidth: '0px',
  label: "按钮",
  alias: "",
  alias2: "",
  labelSuffix: "：",
  //按钮字段名，可用于权限绑定
  vModel: '',
  orderNum: 1,
  style: '',
  size: 'mini',
  btnType: 'primary',
  btnStyle: '',
  clickEventName: '',
  icon: 'fa fa-edit',
  _isShowPower: true,
  _oldisShowPower: true,
  children: [
  ]
};
var iframe_template = {
  type: 'iframe',
  id: 'iframe_' + Object.toGuid(false),
  ctrType: "extend_iframe",
  showLabel: false,
  labelWidth: '0px',
  label: "iframe",
  alias: "",
  alias2: "",
  orderNum: 1,
  height: 200,
  formFieldParms: "",
  style: '',
  src: '',
  icon: 'fa fa-edit',
  _isShowPower: true,
  _oldisShowPower: true,
  children: [
  ]
};

var divider_template = {
  type: 'divider',
  id: 'divider_' + Object.toGuid(false),
  ctrType: "extend_divider",
  showLabel: false,
  labelWidth: '0px',
  label: "分割线",
  content: "分割线内容",
  alias: "divider engtlish",
  alias2: "",
  orderNum: 1,
  style: '',
  //设置分割线方向
  direction: 'horizontal',
  //设置分割线文案的位置
  contentPosition: 'center',
  icon: 'fa fa-edit',
  _isShowPower: true,
  _oldisShowPower: true
};
