<template>
  <div class="f2bpm-page-layout">
    <div class="line">

      <div class="fence-box" style="width: 180px;height: 350px;">
        <div class="fence-box-title">
          <a id="addItem" href="javascript:void(0);" role="button" @click="addItem();"><i class="fa fa-plus" />添加属性项</a>
        </div>
        <ul id="listResult">
          <li v-for="item in rightData" :class="item.text==currentItem.text?'selected':''" class="fence-li-item" :text="item.text" :value="item.value" @dblclick="deleteItem(item)" @click="rightSelected(item)">
            <input type="button" disabled="disabled" :value="item.orderNum" class="fence-li-index">{{ item.text }}
          </li>
        </ul>

      </div>
      <div class="fence-box" style="width: 220px;height: 350px;">
        <div class="fence-box-title">
          编辑属性：
        </div>
        <div class="line" style="overflow: hidden">
          <el-form ref="formRef" :rules="formRules" :model="data" style="height: 250px;" label-width="70px">
            <el-form-item label="属性名" prop="text">
              <el-input v-model="data.text" placeholder="属性名" />
            </el-form-item>
            <el-form-item label="属性值" prop="value">
              <el-input v-model="data.value" placeholder="属性值" />
            </el-form-item>
            <el-form-item label="排序号" prop="orderNum">
              <el-input-number v-model="data.orderNum" size="small" :min="1" :max="100" label="排序号" @change="changeOrderNum" />
            </el-form-item>
            <el-form-item>
              <a id="delete" href="javascript:void(0);" role="button" class="btn btn-primary btn-sm mr2" @click="deleteItem()"><i class="fa fa-minus-circle" />移除</a>
            </el-form-item>
          </el-form>
        </div>
        <div id="aggregationDiv" style="text-align: left; display: none">
          多重聚合规则参数类型设置：
          <br>
          <span style="cursor: pointer">
            <el-radio id="Aggregation1" v-model="Aggregation" label="1" @change="setAggregationParm">迁移标识决定</el-radio>
          </span>
          <br>
          <span style="cursor: pointer">
            <el-radio id="Aggregation2" v-model="Aggregation" label="2" @change="setAggregationParm">由到达的活动数量决定</el-radio>
          </span>
        </div>
      </div>
    </div>
    <div class="dialogfooter">
      <a href="javascript:void(0);" role="button" class="btn btn-primary btn-sm mr2" @click="saveAndClose()"><i class="fa fa-save" />确定</a>
      <a href="javascript:void(0);" role="button" class="btn btn-primary btn-sm" @click="closeEdit"><i class="fa fa-minus-circle" />取消</a>
    </div>
  </div>
</template>

<script>
  export default { data() {
      return {
        attrName: '',
        Aggregation: '0',
        // text,value的数据格式
        initailData: null,
        currentItem: {},
        data: {
          text: '',
          value: '',
          orderNum: 1
        },
         leftData: [],
         rightData: [],
         formRules: {
          text: [
            { required: true, message: '必填项不能为空', trigger: 'blur' }
          ],
          value: [
            { required: true, message: '必填项不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    created: function() {
      var that = this
      // 右而标签显示的字段
      var textFileName = 'text'
      var valueFileName = 'value'
      // 当前编辑的Key
      var currentEditKeyValue = ''
      var attrName = null
      var obj
      var wid
      var resultGridData = []
      obj = parent.window.currentWindowTargetObjectValue
      var value = obj.value// Xml格式：
      var title = obj.title
      attrName = obj.name
      wid = obj.otherParm
      var jsonData = that.xmlToJson(value)
      resultGridData = jsonData
      this.attrName = attrName
      this.wid = wid
      that.rightData = resultGridData || []
      that.autoOrderNum()
    },
    mounted() {
      var that = this
      if (that.attrName == 'JoinRuleParam') {
        $('#addItem').hide()
        $('#delete').hide()
        $('#aggregationDiv').show()
        if (that.rightData.length > 0) {
          if (that.rightData[0].value == 'Transition') {
            that.Aggregation = '1'
          } else {
            that.Aggregation = '2'
          }
        }
      }
      window.myvm = that
    },
    methods: {
      closeEdit() {
        // stand:关闭编辑窗口
        FUI.Window.closeEdit()
      },
       validateForm(refFormName) {
        // stand:表单校验
        var success = false
        this.$refs[refFormName].validate(valid => {
          success = valid
        })
        return success
      },
       addEmpty() {
        var that = this
        that.currentAction = 'add'
        that.clearLeft()
      },
       clearLeft() {
        var that = this
        $.each(that.data, function(key, value) {
          if (key != 'Type') {
            that.data[key] = ''
          }
        })
      },
       addItem() {
        var that = this
        var item = {}
        item.text = 'Items' + (that.rightData.length + 1)
        item.value = ''
        item.orderNum = that.rightData.length + 1
        that.data = item
        that.rightData.push(item)
        that.currentItem = item
      },
       selectChange(item) {
        var that = this
        that.data = item
      },
       deleteItem() {
        var that = this
        var delitem = that.currentItem
        if (delitem == null && that.rightData.length > 0) {
          delitem = that.rightData[that.rightData.length - 1]
        } else if (delitem == null) {
          return false
        }
        var tem = []
        $.each(that.rightData, function(index, item) {
          if (item.text != delitem.text) {
            tem.push(item)
          }
        })
        that.rightData = tem

        if (that.rightData.length > 0) {
          that.currentItem = that.rightData[that.rightData.length - 1]
          that.data = that.currentItem
        }
        that.autoOrderNum()
      },
       autoOrderNum() {
        var that = this
        $.each(that.rightData, function(i, item) {
          item.orderNum = i + 1
        })
      },
       rightSelected(item) {
        var that = this
        that.data = item
        that.currentItem = item
      },
      // 设置多重聚合参数
       setAggregationParm(type) {
        var that = this
        if (type == 2) {
          var data = [{ orderNum: 1, text: 'Policydecision', value: 'NActivity' }, { orderNum: 2, text: 'NActivity', value: 1 }]
          that.currentItem = data[1]
          that.data = that.currentItem
          that.rightData = data
        } else {
          var data = [{ orderNum: 1, text: 'Policydecision', value: 'Transition' }]
          that.currentItem = data[0]
          that.data = that.currentItem
          that.rightData = data
        }
      },
       saveAndClose() {
        var that = this
        FUI.Window.confirm(that, '您确定要提交暂存？', '温馨提示', function() {
          var xml = that.jsonToXml(that.rightData)
          parent.setTargetValue(that.attrName, xml)
          FUI.Window.closeEditAll()
        })
      },
       changeOrderNum() {
        var that = this
        that.rightData = Object.dataSort(that.rightData, 'orderNum')
      },
       xmlToJson(xml) {
        var temData = []
        if (xml == '') return temData
        var xmlDoc = Object.toCreateXmlDoc(xml, true)
        $(xmlDoc).find('Root>Item').each(function() {
          var text = $(this).attr('Text')
          var value = $(this).attr('Value')
          temData.push({ 'text': text, value: value })
        })
        return temData
      },
       jsonToXml(data) {
        var xmlTemplate = '<Item Text="{0}" Value="{1}">{0}</Item>'
        var xml = ''
        if (data.length == 0) return xml
        $.each(data, function(i, item) {
          var text = data[i].text
          var value = data[i].value
          xml += Object.toStringFormat(xmlTemplate, text, value)
        })
        return xml
      },
       getResult() {
        var that = this
        return JSON.stringify(that.rightData)
      }
    }
  }
  window.getResult = function() {
    return myvm.getResult()
  }
</script>
