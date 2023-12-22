<template>
  <div class="f2bpm-page-layout">
    <el-container>
      <el-main class="f2bpm-page-right">
        <div style="text-align: center;font-size: 20px;padding: 20px;">排列组合</div>

        <el-form ref="formRef" size="small" :rules="formRules" :model="data" class="f2bpm-editform" label-width="120px">
          <el-form-item label="关键字：" prop="inputKeys">
            <el-input v-model="data.inputKeys" type="textarea" :rows="4" placeholder="多个之间使用统一的“|” “,” “、” 隔开" />
            关键字示例：【数、集、流、算、绘】【数,集,流,算,绘】【数|集|流|算|绘】
          </el-form-item>
          <el-form-item label="长度取m" prop="len">
            <el-input-number v-model="data.len" size="small" :min="1" :max="8" label="组词长度m" />
            <div style="text-align: center;">
              <el-button size="small" title="排列数公式：就是从n个不同元素中，任取m（m≤n）个元素（被取出的元素各不相同），按照一定的顺序排成一列，叫做从n个不同元素中取出m个元素的一个排列。排列与元素的顺序有关" type="primary" @click="submitForm('A')"><i class="fa fa-cogs" />排列数公式计算(An取m)
              </el-button>
              <el-button size="small" title="组合数公式：从n个不同元素中，任取m(m≤n)个元素并成一组，叫做从n个不同元素中取出m个元素的一个组合,组合与顺序无关" type="primary" @click="submitForm('C')"><i class="fa fa-cog" />组合数公式计算(Cn取m)
              </el-button>
              <span style="font-weight: bold;margin-top: 10px;margin-left: 10px;">生成数量：{{ data.result.length }}个</span>
            </div>
          </el-form-item>
          <el-form-item label="只显示包括关键字" prop="len">
            <el-input v-model="data.inputFilter" placeholder="只显示包括此关键字的词组,多个之间使用“、”号隔开" />
          </el-form-item>
          <el-form-item label="结果输出：">
            <div style="height: 400px; overflow: auto;">
              <span v-for="item in data.result" style="display: inline-block;margin-left: 5px;">【{{ item }}】</span>
            </div>
          </el-form-item>
        </el-form>
      </el-main>
    </el-container>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        data: { inputFilter: '', inputKeys: '数、流、算', len: 2, result: [] },
         formRules: {
          inputKeys: [
            { required: true, message: '必填项不能为空' }
          ],
          len: [
            { required: true, message: '必填项不能为空' }
          ]
        }
      }
    },
    computed: {
    },
    created() {
    },
    mounted() {
      window.myvm = this
    },
    methods: {
      // 组合Cm取n
      cmn(m, n, currentIndex = 0, choseArr = [], result = []) {
        var that = this
        const mLen = m.length
        // 可选数量小于项所需元素的个数，则递归终止
        if (currentIndex + n > mLen) {
          return
        }
        for (let i = currentIndex; i < mLen; i++) {
          // n === 1的时候，说明choseArr在添加一个元素，就能生成一个新的完整项了。
          // debugger
          if (n === 1) {
            // 再增加一个元素就能生成一个完整项，再加入到结果集合中
            result.push([...choseArr, m[i]])
            // 继续下一个元素生成一个新的完整项
            i + 1 < mLen && that.cmn(m, n, i + 1, choseArr, result)
            break
          }
          // 执行到这，说明n > 2，choseArr还需要两个以上的元素，才能生成一个新的完整项。则递归，往choseArr添加元素
          that.cmn(m, n - 1, i + 1, [...choseArr, m[i]], result)
        }
        return result
      },
      // 排列Am取n排列组合
      amn(arr, size) {
        if (size > arr.length) { return }
        var allResult = []
        function fun(arr, size, result = []) {
          if (result.length == size) {
            allResult.push(result)
          } else {
            for (var i = 0, len = arr.length; i < len; i++) {
              var newArr = [].concat(arr)
                var curItem = newArr.splice(i, 1)
              fun(newArr, size, [].concat(result, curItem))
            }
          }
        }
        fun(arr, size, [])
        return allResult
      },
       submitForm(type) {
        var that = this
        var arr = []
        var splitChar = ''
        if (that.data.inputKeys.indexOf('|')) {
          splitChar = '|'
        }
        if (that.data.inputKeys.indexOf(',')) {
          splitChar = ','
        }
        if (that.data.inputKeys.indexOf('，')) {
          splitChar = '，'
        }
        if (that.data.inputKeys.indexOf('、')) {
          splitChar = '、'
        }
        arr = that.data.inputKeys.split(splitChar)
        var n = arr.length
        if (that.data.len > n) {
          FUI.Window.showMsg('组词长度不能大于关键字数量')
          return false
        }
        var result = type == 'A' ? that.amn(arr, that.data.len) : that.cmn(arr, that.data.len)
        var arrStr = []
        var filters = that.data.inputFilter.split('、')
        $.each(result, function(index, item) {
          var str = item.join('')
          if (filters && filters.length > 0) {
            var isdone = false
            $.each(filters, function(_, fitem) {
              if (str.indexOf(fitem) != -1) {
                isdone = true
              }
            })
            if (isdone) {
              arrStr.push(str)
            }
          } else {
            arrStr.push(str)
          }
        })
        that.data.result = arrStr
        console.log('结果', result)
      }
    }

  }
</script>
