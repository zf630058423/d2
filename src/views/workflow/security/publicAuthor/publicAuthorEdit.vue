<template>
  <div class="f2bpm-page-dialog-layout">
    <div style="padding-left: 3px;padding:5px;">
      <span class="label label-warning ">授权发布对象</span>
    </div>
    <table class="common-grid" cellpadding="0" cellspacing="0">
      <tr>
        <td class="bg-gray" style="width: 50px;">发布类型</td>
        <td id="readTitle" class="bg-gray">发布对象</td>
      </tr>
      <tr>
        <td class="bg-gray">发布给所有人</td>
        <td>
          <el-switch v-model="data.readPowerAll" active-color="#87DC48" inactive-color="#DEDEDE" @change="readPowerAllChange" />所有人
        </td>
      </tr>
      <tr>
        <td class="bg-gray">用户授权</td>
        <td>
          <span v-if="false" placeholder="" v-html="data.user_read_value" />
          <span class="power_des_span_content" v-html="data.user_read_des" />
          <button class="btn btn-minier btn-primary mr2 read fr" :disabled="data.readDisabled" title="设置用户“显示”授权" @click="selectorUserTextValue('user_read_value','user_read_des',null,false,'userId');return false;">
            <i class="fa fa-gears bigger-120" />
          </button>
        </td>
      </tr>
      <tr>
        <td class="bg-gray">角色授权</td>
        <td>
          <span v-if="false" placeholder="" v-html="data.role_read_value" />
          <span class="power_des_span_content" v-html="data.role_read_des" />

          <button class="btn btn-minier btn-primary mr2 read fr" :disabled="data.readDisabled" title="设置角色“显示”授权" @click="selectorTextValue('role_read_value','role_read_des','Role');return false;">
            <i class="fa fa-gears bigger-120" />
          </button>
        </td>

      </tr>
      <tr>
        <td class="bg-gray">组织授权</td>
        <td>
          <span v-if="false" placeholder="" v-html="data.org_read_value" />
          <span class="power_des_span_content" v-html="data.org_read_des" />

          <button class="btn btn-minier btn-primary mr2 read fr" :disabled="data.readDisabled" title="设置组织“显示”授权" @click="selectorTextValue('org_read_value','org_read_des','Org');return false;">
            <i class="fa fa-gears bigger-120" />
          </button>
        </td>
      </tr>

    </table>
    <div class="dialogfooter">
      <el-button size="small" type="primary" @click="submitForm()"><i class="fa fa-save" />保存
      </el-button>
      <el-button id="btn_cancel" size="small" @click="closeEdit"><i class="fa fa-minus-circle" />取消
      </el-button>
    </div>
    </el-form>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        powerType: null,
        appId: '',
        rightId: '',
         rightData: { 'read': [] },
         data: {
          readDisabled: false,
          readPowerAll: false,

          user_read_value: '',
          user_read_des: '',

          role_read_value: '',
          role_read_des: '',

          org_read_value: '',
          org_read_des: ''
        }
      }
    },
    created: function() {
      var that = this
      var entityKey = Object.toQueryString('entityKey') || ''
      var authorizeType = Object.toQueryString('authorizeType') || ''
      var url = FUI.Handlers.PublicAuthorHandler
      var data = { 'read': [] }
      var myvm = null
      var permissionType = ['user', 'org', 'role']
      var powerType = ['read']
      var mydata = Object.toAjaxJson(url, 'getPublicAuthorJson', {
        entityKey: entityKey
      })
      data = mydata

      that.entityKey = entityKey
      that.authorizeType = authorizeType
      that.rightData = data
      that.powerType = powerType
      that.permissionType = permissionType
      that.loadData()
    },
    methods: {
      closeEdit() {
        FUI.Window.closeEdit()
      },
       loadData() {
        var that = this
        $.each(that.powerType, function(index, power) {
          var powerData = that.rightData[power]
          $.each(powerData, function(index, theItem) {
            var type = theItem.type
            var valueData = theItem.value
            var targetValue = type + '_' + power + '_value'
            var targetDes = type + '_' + power + '_des'

            that.data[targetValue] = valueData ? JSON.stringify(valueData) : ''
            that.data[targetDes] = valueData ? that.getValueDes(valueData) : ''

            if (type == 'everyone') {
              that.data[power + 'PowerAll'] = true
              that.everyOneControl(true, power)
            }
          })
        })
      },
       getValueDes(data) {
        var des = ''
        var n = data.length
        $.each(data, function(index, item) {
          des += item.text
          if (index != n - 1) {
            des += ','
          }
        })
        return des
      },
       everyOneControl(isEveryOne, powerType) {
        var that = this
        if (isEveryOne == true) {
          that.data[powerType + 'Disabled'] = true
          that.cleanAll(powerType)
        } else {
          that.data[powerType + 'Disabled'] = false
        }
      },
       readPowerAllChange(value) {
        this.everyOneControl(value, 'read')
      },
       cleanAll(powerType) {
        var that = this
        $.each(that.permissionType, function(index, type) {
          var target = type + '_' + powerType + '_value'
          var targetDes = type + '_' + powerType + '_des'
          that.data[target] = ''
          that.data[targetDes] = ''
        })
      },
       collectData() {
        var that = this
        var result = {
          read: []
        }
        // 读权限
        var readData = []
        $.each(that.permissionType, function(index, type) {
          var target = type + '_read_value'
          var value = that.data[target]
          if (value == '') { return true }
          var valueObj = eval(value)
          readData.push({
            'type': type,
            'value': valueObj
          })
        })
        // 所有人
        if (that.data.readPowerAll) {
          readData.push({
            'type': 'everyone',
            'value': [{ value: 'everyone', text: '所有人' }]
          })
        }
        result.read = readData
        var str = JSON.stringify(result)
        return str
      },
       submitForm() {
        var that = this
        var data = {
          'authorizeType': that.authorizeType,
          'entityKey': that.entityKey,
          'authorizeUserJson': that.collectData()
        }
        var result = Object.toAjaxJson(FUI.Handlers.PublicAuthorHandler, 'savePublicAuthor', data)
        FUI.Window.showMsg(that, result.msg, null, 1, function() {
          if (result.success == true) {
            FUI.Window.closeEdit()
          }
        })
      },
       selectorTextValue(inputKey, inputName, type) {
        var that = this
        WF.SelectorDialog.selectorTextValue(that, inputKey, inputName, type)
      },
       selectorUserTextValue(inputKey, inputName, passParm, singleSelect, keyName) {
        var that = this
        WF.SelectorDialog.selectorUserTextValue(that, inputKey, inputName, passParm, singleSelect, keyName)
      }

    }
  }
</script>
