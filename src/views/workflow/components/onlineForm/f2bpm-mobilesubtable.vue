<template>
	<div class="f2bpm-online-subtable-divcontainer" :style="field.style">
		<div class="f2bpm-online-subtable" :tablename="props.tableName" cellpadding="0" cellspacing="0">
			<div v-for="(r,rowno) in rows" :myid="r[primaryKey]">
				<!--明细标题及删除按钮-->
				<div class="mobile-item-head-box">
					<div class="mobile-item-head-title cur" title="收缩/展开" onclick="expansionItem(this)">
						<i class="fa fa-angle-double-up font20"></i>{{field.label}}({{rowno+1}})
					</div>
					<div class="mobile-item-head-toolbar">
						<i class="fa fa-times cur" actionname="deleteRow" :maintablename="props.mainTableName"
							v-if="buttonIsHaveWritePower(props.tableName+'.deleteRow')&&!isView"
							:field="props.tableName+'.deleteRow'" @click="delRow(r.tempid)">删除</i>
						<i v-for="btn in operation" :class="'cur fa '+ btn.faClass"
							v-if="buttonIsHaveWritePower(props.tableName+'.'+btn.buttonName)"
							:actionname="props.tableName+'.'+btn.buttonName" :maintablename="props.mainTableName"
							:field="props.tableName+'.'+btn.buttonName"
							@click="operationCustBtnOnClick(btn,props.tableName,r)">{{btn.buttonTitle}}</i>
					</div>
				</div>
				<!--明细项-->
				<div :key="subtableKey">
					<div class="subtable-mobile-item-field" v-for="col in colunms" v-if="isHaveShowPower(col)"
						v-show="col.ctrType!='hidden'">
						<span :style="col.style" v-show="col.showLabel&&col.ctrType!='hidden'">
							<span class="item-label" v-html="col.label"></span>
							<span v-if="col.helperArticle!=''&&col.helperArticle!=undefined"
								@click='openHelperArticle(col.helperArticle)' class="fa fa-question-circle-o"
								title="点击查看说明"></span>
							<em class="red" v-if="col.isRequired">*</em>{{col.labelSuffix}}
						</span>
						<f2bpm-onlineformitem :parentdata="r" :field="col" :fieldvalue="r[col.vModel]"
							@updatevalue="updateFieldValue" @appendfieldvalue="appendFieldValue"></f2bpm-onlineformitem>
					</div>
				</div>

			</div>
			<!--合计统计-->
			<div class="foot" v-if="!props.removeFooterRow">
				<div v-for="(col,colno) in colunms" v-if="col.isColumnCount&&isHaveShowPower(col)"
					v-show="col.ctrType!='hidden'">
					{{col.label}}合计：<span v-html="columnCountData[col.vModel]">
					</span>
				</div>
			</div>
			<!--添加按钮工具栏-->
			<div class="f2bpm-online-subtable-mobile-toolbar">
				<a role="button" v-if="buttonIsHaveWritePower(props.tableName+'.addRow')&&!isView"
					field="props.tableName+'.addRow'" actionname="subAddButton" class="btn btn-primary btn-sm mr5"
					@click="addRow"><span class="fa fa-plus"></span>添加</a>
				<a role="button" v-if="buttonIsHaveWritePower(props.tableName+'.'+btn.buttonName)"
					:field="props.tableName+'.'+btn.buttonName" v-for="btn in toolbar"
					:class="'btn btn-'+ btn.btnColor+'  btn-sm mr5'" :actionname="props.tableName+'.'+btn.buttonName"
					:maintablename="props.mainTableName" @click="toolbarCustBtnOnClick(btn,props.tableName,rows)"><i
						:class="'fa'+btn.faClass"></i>{{btn.buttonTitle}}</a>
			</div>

		</div>
	</div>
</template>

<script>
	export default {
		name: "f2bpm-mobilesubtable",
		components: {},
		props: ['field', 'fieldvalue'],
		watch: {
			rows: {
				handler(n, o) {
					if (o != undefined && f2grid_global_mainVueLoadComplated) {
						this.columnMath();
					}
				},
				deep: true,
				immediate: false
			}
		},
		mounted() {
			var that = this;
		},
		created: function() {
			//JavaScript 中对象和数组是引用类型，指向同一个内存空间，如果 prop 是一个对象或数组
			// 在子组件内部改变它会影响父组件的状态,所以它data的变化会直接影响到父组件的data
			var that = this;
			that.props = that.field.props;
			that.toolbar = that.field.toolbar;
			that.operation = that.field.operation;
			that.colunms = that.field.columns;
			that.primaryKey = that.props.preFix + ".MyId";
			var isView = WFContext.WorkflowformAction > 2;
			that.isView = isView;
			if (that.fieldvalue != undefined) {
				that.rows = that.fieldvalue;
				that.columnMath();
			}
			that.init();
		},
		computed: {
			isHaveShowPower() {
				return function(field) {
					return FUI.F2Grid.isHaveShowPower(field.vModel);
				}
			},
			buttonIsHaveWritePower() {
				return function(fieldName) {
					var result = FUI.F2Grid.isHaveWritePower(fieldName);
					return result;
				}
			},
		},
		data: function() {
			return {
				onlineformKey: '101',
				subtableKey: "201",
				primaryKey: '',
				//还有更多的属性
				props: {
					mainTableName: '',
					tableName: '',
					preFix: '',
					hideCheckbox: false,
					hideNumber: false,
          hideOperate: false,
					addWay: 'default'
				},
				toolbar: [],
				operation: [],
				colunms: [],
				isView: false,

				isCheckAll: false,
				checkList: [],
				//所有行数据
				rows: [],
				//列合计结果数据
				columnCountData: {}
			}
		},
		methods: {
			init() {
				var that = this;
				$.each(that.rows, function(index, row) {
					row.tempid = "temp_" + Object.toGuid();
				});

			},
			columnMath() {
				console.info("columnMath")
				var that = this;
				if (WFContext.isDesign == true || that.colunms.length == 0) {
					return false;
				}
				//列合计
				var needCountCols = that.colunms.filter(c => c.isColumnCount);
				if (needCountCols.length == 0) {
					return false;
				}
				//初始化
				$.each(needCountCols, function(index, c) {
					var name = c.vModel;
					that.columnCountData[name] = 0;
					f2grid_global_columnCountData[name] = 0;
				});
				//遍历行进行合计
				$.each(that.rows, function(index, r) {
					$.each(needCountCols, function(index, c) {
						var name = c.vModel;
						var value = r[name] || 0;
						//that.columnCountData[name]+=Number(value);
						f2grid_global_columnCountData[name] += Number(value);
					});
				});
				//保留小数位
				$.each(needCountCols, function(index, c) {
					var name = c.vModel;
					var digitlen = 2;
					var countRule = c.countRule;
					if (countRule && countRule.digitlen != undefined) {
						digitlen = countRule.digitlen;
					}
					var result = (Number(f2grid_global_columnCountData[name])).toFixed(digitlen);
					f2grid_global_columnCountData[name] = result;
					that.columnCountData[name] = result;
				});
			},
			checkBox() {
				console.info(this.checkList);
			},
			checkAll(val) {
				var that = this;
				this.isCheckAll = val;
				that.checkList = [];
				if (val == true) {
					$.each(that.rows, function(index, r) {
						that.checkList.push(r.tempid);
					})
				}
			},
			delBathRow() {
				var that = this;
				FUI.F2Grid.delBathRow(that);
			},
			delRow(tempid) {
				var that = this;
				FUI.F2Grid.delRow(that, tempid);
			},
			addRow() {
				var that = this;
				FUI.F2Grid.addRow(that);
			},
			toolbarCustBtnOnClick(btn, tableName, rows) {
				var that = this;
				if (btnType == "customdialog") {
					that.onToolBarCustCustomDialogClick(btn.buttonOptions, "ToolBar");
					//调用自定义对话框
					//FUI.F2Grid.addRowData('CostPayItem', 'cost_pay', rowData);
				} else {
					//工具栏自定义按钮事件
					//btn:按钮本身
					//tableName：实体对象名
					//rows:子表所有行数据
					FUI.F2Grid.toolBarCustbtnOnClick(that, btn, tableName, rows)
				}
			},
			operationCustBtnOnClick(btn, tableName, row) {
				console.info(btn);
				//操作列自定义按钮事件
				var that = this;
				FUI.F2Grid.custbtnOnClick(that, btn, tableName, row)
			},
			onToolBarCustCustomDialogClick(inputCtrlOption, tableName, openType) {
				var that = this;
				console.info(tableName);
				if (inputCtrlOption) {
					var customJSON = inputCtrlOption.data;
					customJSON.backBindIsdetail = true;
					if (customJSON.isMulti == 'true') {
						customJSON.isMulti = true;
					}
					if (customJSON.isMulti == 'false') {
						customJSON.isMulti = false;
					}
					var customDialogName = customJSON.customDialog;
					var customDialog = eval(CustomDialog);
					customJSON.isSubTableAdd = true;
					customDialog(that, customJSON);
				}
				return false;
			},
			updateParentSubData(actionType) {
				//添加或删除时修改主Vue的子表数据结果
				var that = this;
				that.$emit('updatevalue', "subtable." + that.props.tableName, that.rows);
				if (actionType == "delete" || actionType == "add") {
					//让子控件重新渲染
					that.subtableKey = Object.toGetTimeRandomNum();
				}
			}
			//field: 可以是字段名也可以是字段定义的对象
			,
			updateFieldValue(field, newValue, vueDataName, subVueDataName) {
				//因数是对象引用，所以不需要使用此方法
				//console.info("updateFieldValue")
				var that = this;
			},
			appendFieldValue(fieldName, newValue, vueDataName, subVueDataName) {
				//因数是对象引用，所以不需要使用此方法
				var that = this;
			},
			listens() {

			}

		}
	};
</script>
