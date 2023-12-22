<template>
  <el-input v-show="isShow" v-model="value" size="small" :name="field.vModel" :clearable="clearable" :disabled="isDisabled" :placeholder="field.fieldRemark" class="input-with-select">
    <el-button v-if="!isReadOnly" id="selectId" slot="append" type="primary" icon="el-icon-search" @click="openDialogClick()" />
  </el-input>
</template>
<script>
  export default {
    name: 'f2bpm-map-address',
    components: {},
    props: ['field', 'fieldvalue', 'rowindex', 'colindex'],
    data: function () {
      return {
        clearable: true,
        isDisabled: false,
        amapAccessKey: '',
        isView: false,
        isShow: true,
        isReadOnly: false,
        value: '',
        data: {
          addr: '',
          //经度
          lon: '',
          //纬度
          lat: ''
        }
      };
    }, watch: {
      value(val, oleV) {
        var that = this;
        if (val != undefined && oleV != undefined && f2grid_global_mainVueLoadComplated) {
          that.data.addr = val;
          this.$emit('updatevalue', that.field, val);
        }
      },
      fieldvalue: {
        handler(newV, oleV) {
          var that = this;
          if (newV != undefined && oleV != undefined && f2grid_global_mainVueLoadComplated) {
            that.value = newV;
          }
        },
        immediate: false
      }
    },
    created: function () {
      var that = this;
      that.initailFieldOption();
      that.value = that.fieldvalue;
      if (that.value) {
        that.data.addr = that.value;
      }
      var formAction = WFContext.WorkflowformAction;
      that.isView = formAction > 2;
      if (that.isView) {
        that.isReadOnly = true;
      }
      that.isView = formAction > 2;
      if (that.isView) {
        that.isReadOnly = true;
      }
    },
    mounted() {
      var that = this;
      FUI.F2Grid.excuteFieldWritePowerByVueFormItem(that);
      if (that.isReadOnly == true) {
        that.isDisabled = true;
      }
    },
    methods: {
      initailFieldOption() {
        var that = this;
        if (that.field.fieldOptions && that.field.fieldOptions != '') {
          var fieldOptionsObj = typeof that.field.fieldOptions === 'string' ? eval(that.field.fieldOptions) : that.field.fieldOptions;
          var general = fieldOptionsObj.find(a => a.opttype == 'general');
          var generalobj = {};
          if (general) {
            var kvData = general.params.kvData;
            $.each(kvData, function (index, item) {
              generalobj[item.key] = item.value;
            });
            var item = kvData.find(a => a.key == 'clearable');
            if (item) {
              that.clearable = item.value;
            }
            item = kvData.find(a => a.key == 'amapAccessKey');
            if (item) {
              that.amapAccessKey = item.value;
            }
            that.lonBindToFields = generalobj.lonBindToFields || "";
            that.latBindToFields = generalobj.latBindToFields || "";
          }
        }
      },
      openDialogClick() {
        var that = this;
        WF.SelectorDialog.getMapAddress(that, that.amapAccessKey, 'addr', 'lon', 'lat', function (json) {
          that.data.address = json[0].addr;
          that.data.lon = json[0].lon;
          that.data.lat = json[0].lat;
          that.value = that.data.address;
          that.bindToOtherFields();

        });
        return false;
      },
      bindToOtherFields() {
        var that = this;
        //经度回填
        if (that.lonBindToFields) {
          var arr = that.lonBindToFields.split(',');
          $.each(arr, function (i, tofieldName) {
            if (tofieldName) {
              that.$emit('updatevalue', tofieldName, that.data.lon);
            }
          });
        }
        //纬度回填
        if (that.latBindToFields) {
          var arr = that.latBindToFields.split(',');
          $.each(arr, function (i, tofieldName) {
            if (tofieldName) {
              that.$emit('updatevalue', tofieldName, that.data.lat);
            }
          });
        }
      }
    }
  }
</script>