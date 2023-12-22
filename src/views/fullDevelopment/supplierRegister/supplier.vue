<template>
  <div class="cost" id="costId">
    <div class="topBtn">
      <div class="btnBox">
        <el-button type="primary" size="small" @click="submitForm">保存</el-button>
        <el-button size="small" @click="closeForm">关闭</el-button>
      </div>
    </div>
    <div class="formCont">
      <el-form label-width="145px" ref="formRef" :model="data" :rules="formRules">
        <div class="pageTitle">材料供应商自主注册</div>
        <div class="projectInfo">
          <div class="title">项目信息</div>
          <div class="formData">
            <el-row :gutter="24" align="middle" style="padding-right: 15px">
              <el-col :span="8">
                <el-form-item label="供应商类型：" prop="SupplierType">
                  <el-radio-group v-model="data.SupplierType" size="small" @change="changeSupplierType">
                    <el-radio :label="1">标品类</el-radio>
                    <el-radio :label="2">深加工类</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="单据编号：">
                  <el-input v-model="data.BillNo" placeholder="自动填写" disabled size="small"></el-input>
                </el-form-item>
                <el-form-item label="注册资金(万元)：" prop="RegisteredFund">
                  <el-input v-model="data.RegisteredFund" placeholder="请输入" size="small"></el-input>
                </el-form-item>
                <el-form-item label="税务制度：" prop="FiscalSystem">
                  <el-radio-group v-model="data.FiscalSystem">
                    <el-radio :label="1">一般纳税人</el-radio>
                    <el-radio :label="2">小规模纳税人</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="联系人电话：" prop="ContactpsnPhone">
                  <el-input v-model="data.ContactpsnPhone" placeholder="请输入" size="small"></el-input>
                </el-form-item>
                <el-form-item label="联系人邮箱：" prop="ContactpsnEmail">
                  <el-input v-model="data.ContactpsnEmail" placeholder="请输入" size="small"></el-input>
                </el-form-item>
                <el-form-item label="法人身份证号：" prop="LegalPersonIDNumber">
                  <el-input v-model="data.LegalPersonIDNumber" placeholder="请输入" size="small"></el-input>
                </el-form-item>
                <el-form-item label="经营场所面积（㎡）：" prop="AreaofBusinessPremises">
                  <el-input v-model="data.AreaofBusinessPremises" placeholder="请输入" size="small"></el-input>
                </el-form-item>
                <el-form-item label="月度最大产值(万元/月)：" v-show="data.SupplierType === 2">
                  <el-input v-model="data.MonthlyMaximumOutpuValue" placeholder="请输入" size="small"></el-input>
                </el-form-item>
                <el-form-item label="管理_代班人员数量：" v-show="data.SupplierType === 2">
                  <el-input v-model="data.NumberofSubstitutingPersonnel" placeholder="请输入" size="small"></el-input>
                </el-form-item>
                <el-form-item label="推荐单位：" prop="RecommendedUnit">
                  <el-radio-group v-model="data.RecommendedUnit">
                    <el-radio :label="1">推荐</el-radio>
                    <el-radio :label="2">内部开发</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="供应商名称：" prop="NameofSubcontractor">
                  <el-input v-model="data.NameofSubcontractor" placeholder="请输入" size="small"></el-input>
                </el-form-item>
                <el-form-item label="注册成立日期：" prop="RegisterDateTime">
                  <el-date-picker style="width: 100%" size="small"
                                  v-model="data.RegisterDateTime"
                                  type="date"
                                  placeholder="选择日期">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="入库初始评级：">
                  <el-radio-group v-model="data.InitialWarehousingRating" disabled>
                    <el-radio :label="1">A</el-radio>
                    <el-radio :label="2">B</el-radio>
                    <el-radio :label="3">C</el-radio>
                    <el-radio :label="4">D</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="纳税信用等级：" prop="CreditRating">
                  <el-select v-model="data.CreditRating" placeholder="请选择" style="width: 100%" size="small">
                    <el-option
                      v-for="item in ['0','1','2','3','4','5']"
                      :key="item"
                      :label="item | CreditRatingFilter"
                      :value="item">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="联系人职务：" prop="ContactpsnPost">
                  <el-input v-model="data.ContactpsnPost" placeholder="请输入" size="small"></el-input>
                </el-form-item>
                <el-form-item label="法人姓名：" prop="CorporateName">
                  <el-input v-model="data.CorporateName" placeholder="请输入" size="small"></el-input>
                </el-form-item>
                <el-form-item label="办公地址：" prop="OfficeAddress">
                  <el-input v-model="data.OfficeAddress" placeholder="请输入" size="small"></el-input>
                </el-form-item>
                <el-form-item label="经营场所属性：">
                  <el-select v-model="data.PropertyofBusinessSite" placeholder="请选择" style="width: 100%" size="small">
                    <el-option
                      v-for="item in ['1','2']"
                      :key="item"
                      :label="item | BusinessPremisesFilter"
                      :value="item">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="深化设计人员数量：" v-show="data.SupplierType === 2">
                  <el-input v-model="data.DeepentheNumberofDesigners" placeholder="请输入" size="small"></el-input>
                </el-form-item>
                <el-form-item label="推荐人姓名：">
                  <el-input v-model="data.NameofReferrer" placeholder="请输入" size="small"
                            :disabled="data.RecommendedUnit !== 1"></el-input>
                </el-form-item>
                <el-form-item label="推荐部门：">
                  <el-input v-model="data.RecommendDept" placeholder="请选择部门" size="small" disabled>
                    <!--<el-button size="small" slot="append"-->
                    <!--@click="openCustomDialog('3ddedfb0-9b70-47f4-9016-466a4d684ee5' ,'项目编号', 'BPM_XiangMuBianHao_4419' ,'ct_bpm_projectfiles',800,500,0)"-->
                    <!--icon="el-icon-search"></el-button>-->
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="供应商性质：" prop="NatureofSupplier">
                  <el-select v-model="data.NatureofSupplier" placeholder="请选择" style="width: 100%" size="small">
                    <el-option
                      v-for="item in ['0','1']"
                      :key="item"
                      :label="item | SupplierNatureFilter"
                      :value="item">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="社会统一信用代码：" prop="TaxRegistrationNum">
                  <el-input v-model="data.TaxRegistrationNum" placeholder="请输入" size="small"></el-input>
                </el-form-item>
                <el-form-item label="合作过程评级：">
                  <el-radio-group v-model="data.CooperativeProcessRating" disabled>
                    <el-radio :label="1">A</el-radio>
                    <el-radio :label="2">B</el-radio>
                    <el-radio :label="3">C</el-radio>
                    <el-radio :label="4">D</el-radio>
                    <el-radio :label="5">黑名单</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="联系人：" prop="Contactpsn">
                  <el-input v-model="data.Contactpsn" placeholder="请输入" size="small"></el-input>
                </el-form-item>
                <el-form-item label="联系人身份证号：" prop="ContactpsnidentityCard">
                  <el-input v-model="data.ContactpsnidentityCard" placeholder="请输入" size="small"></el-input>
                </el-form-item>
                <el-form-item label="法人电话：">
                  <el-input v-model="data.CorporateTelePhone" placeholder="请输入" size="small"></el-input>
                </el-form-item>
                <el-form-item label="工厂地址：" prop="FactoryAddress">
                  <el-input v-model="data.FactoryAddress" placeholder="请输入" size="small"></el-input>
                </el-form-item>
                <el-form-item label="所有制：" prop="Systemofownership">
                  <el-select v-model="data.Systemofownership" placeholder="请选择" style="width: 100%" size="small">
                    <el-option
                      v-for="item in ['1','2','3','4','5','6']"
                      :key="item"
                      :label="item | OwnershipFilter"
                      :value="item">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="技术人员数量：" v-show="data.SupplierType === 2">
                  <el-input v-model="data.NumberofTechnicalPersonnel" placeholder="请输入" size="small"></el-input>
                </el-form-item>
                <el-form-item label="推荐人电话：">
                  <el-input v-model="data.ReferrerPhone" placeholder="请输入" size="small"
                            :disabled="data.RecommendedUnit !== 1"></el-input>
                </el-form-item>
                <el-form-item label="智链平台注册状态：">
                  <el-select v-model="data.IntellectualChainPlatformType" placeholder="请选择" style="width: 100%" disabled
                             size="small">
                    <el-option
                      v-for="item in ['1','0']"
                      :key="item"
                      :label="item | RegStateFilter"
                      :value="item">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="供应商经营范围：" prop="SuppliersbusinessScope">
                  <el-checkbox-group v-model="data.SuppliersbusinessScope" class="radioList">
                    <el-checkbox :label="3">石材类</el-checkbox>
                    <el-checkbox :label="41">木板材类</el-checkbox>
                    <el-checkbox :label="38">油漆化工类</el-checkbox>
                    <el-checkbox :label="42">皮革布艺墙纸类</el-checkbox>
                    <el-checkbox :label="11">玻璃制品类</el-checkbox>
                    <el-checkbox :label="52">金属材料类</el-checkbox>
                    <el-checkbox :label="26">小五金类</el-checkbox>
                    <el-checkbox :label="44">给排水管材类</el-checkbox>
                    <el-checkbox :label="50">塑料、橡胶制品类</el-checkbox>
                    <el-checkbox :label="6">石膏制品类</el-checkbox>
                    <el-checkbox :label="20">陶瓷类</el-checkbox>
                    <el-checkbox :label="46">保温隔音材料类</el-checkbox>
                    <el-checkbox :label="47">电气材料类</el-checkbox>
                    <el-checkbox :label="13">门窗类</el-checkbox>
                    <el-checkbox :label="9">厨具类</el-checkbox>
                    <el-checkbox :label="10">家具类</el-checkbox>
                    <el-checkbox :label="21">浴洁具类</el-checkbox>
                    <el-checkbox :label="49">土建材料类</el-checkbox>
                    <el-checkbox :label="51">木制品定制类</el-checkbox>
                    <el-checkbox :label="54">园林绿化类</el-checkbox>
                    <el-checkbox :label="45">医疗设备器械类</el-checkbox>
                    <el-checkbox :label="7">智能化</el-checkbox>
                    <el-checkbox :label="48">暖通设备类</el-checkbox>
                    <el-checkbox :label="53">消防器材类</el-checkbox>
                    <el-checkbox :label="60">中装形象材料(工衣，配电箱、安全帽、保护膜)</el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
                <el-form-item label="入库备注：">
                  <el-input
                    type="textarea"
                    :autosize="{ minRows: 2, maxRows: 4}"
                    placeholder="请输入内容"
                    v-model="data.Memo">
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>

          </div>
        </div>
        <div class="costInfo">
          <div
            style="border-bottom: 1px solid #f3f3f3;display:flex;justify-content:space-between;padding-bottom:5px;align-items:center;padding-right: 20px">
            <div class="title" style="border:none;">业务信息
            </div>
          </div>
          <div class="formData" style="padding:0 15px">
            <el-tabs v-model="activeName" @tab-click="handleClick">
              <el-tab-pane name="0">
                <span slot="label"><i class="red">*</i> 银行信息</span>
              </el-tab-pane>
              <el-tab-pane name="1">
                <span slot="label"><i class="red">*</i> 业务覆盖地区</span>
              </el-tab-pane>
              <el-tab-pane name="2">
                <span slot="label"><i class="red">*</i> 主要生产或销售产品</span>
              </el-tab-pane>
              <el-tab-pane label="产品信息" name="3" v-if="data.SupplierType === 1"></el-tab-pane>
              <el-tab-pane label="工厂主要设备/销售门店" name="4" v-else></el-tab-pane>
              <el-tab-pane label="最近三年营业收入" name="5"></el-tab-pane>
              <el-tab-pane label="准入条件" name="6"></el-tab-pane>
              <el-tab-pane name="7">
                <span slot="label"><i class="red">*</i> 附件</span>
              </el-tab-pane>
            </el-tabs>
            <el-row>
              <el-col :span="24" v-show="activeName === '0'">
                <bankInfo ref="bank" @showData="showData"></bankInfo>
              </el-col>
              <el-col :span="24" v-show="activeName === '1'">
                <coverageArea ref="cover" @showData="showData"></coverageArea>
              </el-col>
              <el-col :span="24" v-show="activeName === '2'">
                <main-products ref="main" @showData="showData"></main-products>
              </el-col>
              <el-col :span="24" v-show="activeName === '3'">
                <product-info ref="product" @showData="showData"></product-info>
              </el-col>
              <el-col :span="24" v-show="activeName === '4'">
                <major-equipment ref="major" @showData="showData"></major-equipment>
              </el-col>
              <el-col :span="24" v-show="activeName === '5'">
                <tree-years ref="three"  @showData="showData"></tree-years>
              </el-col>
              <el-col :span="24" v-show="activeName === '6'">
                <entry-criteria ref="entry" @showData="showData" @getScore="getScore"></entry-criteria>
                <el-col :span="24">
                  <el-form-item label="综合得分：">
                    <el-input v-model="data.SynthesizeScore" placeholder="自动计算" style="width: 50%" size="small" disabled></el-input>
                  </el-form-item>
                  <el-form-item label="综合评定：">
                    <el-input v-model="data.SynthesizeEvaluate" placeholder="请输入" style="width: 50%" size="small"></el-input>
                  </el-form-item>
                </el-col>
              </el-col>
              <el-col :span="24" v-show="activeName === '7'">
                <el-col :span="20">
                  <el-form-item label="营业执照：" class="is-required">
                    <uploadFile ref="file1"
                                tip="允许上传的文件类型：*.ppt;*.jpg;*.png;*.pdf；每个文件大小不能超过2G；文件名称请使用中英文或数字，特殊字符不能作为文件名"
                                accept=".jpg,.png,.pdf" @showFile="showFile"></uploadFile>
                  </el-form-item>
                </el-col>
                <el-col :span="20">
                  <el-form-item label="法人身份证正面：" class="is-required">
                    <uploadFile ref="file2"
                                tip="允许上传的文件类型：*.ppt;*.jpg;*.png;*.pdf；每个文件大小不能超过2G；文件名称请使用中英文或数字，特殊字符不能作为文件名"
                                accept=".jpg,.png,.pdf" @showFile="showFile"></uploadFile>
                  </el-form-item>
                </el-col>
                <el-col :span="20">
                  <el-form-item label="联系人身份证正面：" class="is-required">
                    <uploadFile ref="file3"
                                tip="允许上传的文件类型：*.ppt;*.jpg;*.png;*.pdf；每个文件大小不能超过2G；文件名称请使用中英文或数字，特殊字符不能作为文件名"
                                accept=".jpg,.png,.pdf" @showFile="showFile"></uploadFile>
                  </el-form-item>
                </el-col>
                <el-col :span="20">
                  <el-form-item label="近两年的纳税信用评级：" class="is-required">
                    <uploadFile ref="file4"
                                tip="允许上传的文件类型：*.doc;*.docx;*.ppt;*.pptx;*.xls;*.xlsx;*.jpg;*.gif;*.png;*.zip;*.rar;*.pdf;*.vsd;*.ppsx;*.dwt;*.dwg;*.dws;*.dxf;*.mp4;*.bmp;*.vsdx 每个文件大小不能超过2G； 文件名称请使用中英文或数字，特殊字符不能作为文件名"
                                accept="'.wmv,.avi,.rm,.mp4,.ppt,.pptx,.docx,.xlsx,.jpg,.gif,.jpeg,.bmp,.png,.doc,.xls,.pdf,.rar,.zip,.txt,.rtf,.bak,.sql'"
                                @showFile="showFile"></uploadFile>
                  </el-form-item>
                </el-col>
                <el-col :span="20" v-show="data.SupplierType === 1">
                  <el-form-item label="公司门头照片以及办公经营场地照片：" class="is-required">
                    <uploadFile ref="file5"
                                tip="允许上传的文件类型：*.doc;*.docx;*.ppt;*.pptx;*.xls;*.xlsx;*.jpg;*.gif;*.png;*.zip;*.rar;*.pdf;*.vsd;*.ppsx;*.dwt;*.dwg;*.dws;*.dxf;*.mp4;*.bmp;*.vsdx 每个文件大小不能超过2G； 文件名称请使用中英文或数字，特殊字符不能作为文件名"
                                accept="'.wmv,.avi,.rm,.mp4,.ppt,.pptx,.docx,.xlsx,.jpg,.gif,.jpeg,.bmp,.png,.doc,.xls,.pdf,.rar,.zip,.txt,.rtf,.bak,.sql'"
                                @showFile="showFile"></uploadFile>
                  </el-form-item>
                </el-col>
                <el-col :span="20" v-show="data.SupplierType === 2">
                  <el-form-item label="拍摄从厂牌到厂内的短视频：" class="is-required">
                    <uploadFile ref="file6"
                                tip="允许上传的文件类型：*.doc;*.docx;*.ppt;*.pptx;*.xls;*.xlsx;*.jpg;*.gif;*.png;*.zip;*.rar;*.pdf;*.vsd;*.ppsx;*.dwt;*.dwg;*.dws;*.dxf;*.mp4;*.bmp;*.vsdx 每个文件大小不能超过2G； 文件名称请使用中英文或数字，特殊字符不能作为文件名"
                                accept="'.wmv,.avi,.rm,.mp4,.ppt,.pptx,.docx,.xlsx,.jpg,.gif,.jpeg,.bmp,.png,.doc,.xls,.pdf,.rar,.zip,.txt,.rtf,.bak,.sql'"
                                @showFile="showFile"></uploadFile>
                  </el-form-item>
                </el-col>
                <el-col :span="20">
                  <el-form-item label="开户许可证或加盖章的开户信息：" class="is-required">
                    <uploadFile ref="file7"
                                tip="允许上传的文件类型：*.doc;*.docx;*.ppt;*.pptx;*.xls;*.xlsx;*.jpg;*.gif;*.png;*.zip;*.rar;*.pdf;*.vsd;*.ppsx;*.dwt;*.dwg;*.dws;*.dxf;*.mp4;*.bmp;*.vsdx 每个文件大小不能超过2G； 文件名称请使用中英文或数字，特殊字符不能作为文件名"
                                accept="'.wmv,.avi,.rm,.mp4,.ppt,.pptx,.docx,.xlsx,.jpg,.gif,.jpeg,.bmp,.png,.doc,.xls,.pdf,.rar,.zip,.txt,.rtf,.bak,.sql'"
                                @showFile="showFile"></uploadFile>
                  </el-form-item>
                </el-col>
                <el-col :span="20" v-show="data.SupplierType === 2">
                  <el-form-item label="联系人在本企业的社保证明或工资流水单：" class="is-required">
                    <uploadFile ref="file8"
                                tip="允许上传的文件类型：*.doc;*.docx;*.ppt;*.pptx;*.xls;*.xlsx;*.jpg;*.gif;*.png;*.zip;*.rar;*.pdf;*.vsd;*.ppsx;*.dwt;*.dwg;*.dws;*.dxf;*.mp4;*.bmp;*.vsdx 每个文件大小不能超过2G； 文件名称请使用中英文或数字，特殊字符不能作为文件名"
                                accept="'.wmv,.avi,.rm,.mp4,.ppt,.pptx,.docx,.xlsx,.jpg,.gif,.jpeg,.bmp,.png,.doc,.xls,.pdf,.rar,.zip,.txt,.rtf,.bak,.sql'"
                                @showFile="showFile"></uploadFile>
                  </el-form-item>
                </el-col>
                <el-col :span="20">
                  <el-form-item label="其他资料：">
                    <uploadFile ref="file9"
                                tip="允许上传的文件类型：*.doc;*.docx;*.ppt;*.pptx;*.xls;*.xlsx;*.jpg;*.gif;*.png;*.zip;*.rar;*.pdf;*.vsd;*.ppsx;*.dwt;*.dwg;*.dws;*.dxf;*.mp4;*.bmp;*.vsdx 每个文件大小不能超过2G； 文件名称请使用中英文或数字，特殊字符不能作为文件名"
                                accept="'.wmv,.avi,.rm,.mp4,.ppt,.pptx,.docx,.xlsx,.jpg,.gif,.jpeg,.bmp,.png,.doc,.xls,.pdf,.rar,.zip,.txt,.rtf,.bak,.sql'"
                                @showFile="showFile"></uploadFile>
                  </el-form-item>
                </el-col>
              </el-col>
            </el-row>
          </div>

        </div>
        <div class="footer" v-show="false">
          <div
            style="border-bottom: 1px solid #f3f3f3;display:flex;justify-content:space-between;padding-bottom:5px;align-items:center;">
            <div class="title" style="border:none;">编制人信息</div>
          </div>
          <el-row :gutter="24" style="padding-right: 15px">
            <el-col :span="8">
              <el-form-item label="编制人：">
                <el-input disabled size="small"
                          placeholder="保存生成"
                          v-model="data.CreateName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="编制人部门：">
                <el-input disabled size="small"
                          placeholder="保存生成"
                          v-model="data.CreateDept"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="编制时间：">
                <el-input disabled size="small"
                          placeholder="保存生成"
                          v-model="data.CreateTime"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="编制人id：">
                <el-input disabled size="small"
                          placeholder="保存生成"
                          v-model="data.CreateId"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="编制人部门Id：">
                <el-input disabled size="small"
                          placeholder="保存生成"
                          v-model="data.CreateDeptId"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
  import bankInfo from './tabItems/bankInfo'
  import coverageArea from './tabItems/coverageArea'
  import mainProducts from './tabItems/mainProducts'
  import majorEquipment from './tabItems/majorEquipment'
  import productInfo from './tabItems/productInfo'
  import treeYears from './tabItems/threeYears'
  import entryCriteria from './tabItems/entryCriteria'
  import uploadFile from './upload_file'
  import {validAmount} from '@/utils/validate'

  const validateNumber = (rule,value,callback) =>{
    if(!value){
      callback(new Error('金额不能为空'))
    }else{
      var reg = /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/;
      if (!reg.test(value)) {
        callback(new Error('请输入正确格式的内容'))
      }else{
        callback();
      }
    }
  };

  export default {
    components: {
      bankInfo, coverageArea, mainProducts, majorEquipment, productInfo, treeYears, entryCriteria, uploadFile
    },
    data() {
      return {
        isReadOnly: false,
        isAble: false,
        newData: {},
        activeName: '0',
        data: {
          AccountOpeningInformation: [],
          AreaofBusinessPremises: "",
          BiMaterialDepot: "",
          BillNo: "",
          Businesslicense: [],
          ContactIDCardfront: [],
          Contactpsn: "",
          ContactpsnEmail: "",
          ContactpsnPhone: "",
          ContactpsnPost: "",
          ContactpsnidentityCard: '',
          CooperativeProcessRating: '',
          CorporateIdentityCardFront: '',
          CorporateName: '',
          CorporateTelePhone: '',
          CreateCentreDept: '',
          CreateCentreDeptId: '',
          CreateDept: '',
          CreateDeptCentre: "",
          CreateDeptCentreId: "",
          CreateDeptId: '',
          CreateId: '',
          CreateName: '',
          CreateTime: '',
          CreditRating: '',
          DeepentheNumberofDesigners: '',
          FactoryAddress: '',
          FiscalSystem: '',
          InitialWarehousingRating: '',
          IntellectualChainPlatformType: '0',
          LegalPersonIDNumber: '',
          Memo: '',
          MonthlyMaximumOutpuValue: '',
          MyId: '',
          NameofReferrer: '',
          NameofSubcontractor: '',
          NatureofSupplier: '',
          NumberofSubstitutingPersonnel: '',
          NumberofTechnicalPersonnel: '',
          OfficeAddress: '',
          OtherDetails: '',
          PayrollStatement: '',
          PhotoofofficePremises: '',
          PropertyofBusinessSite: '',
          RecommendDept: '',
          RecommendDeptId: '',
          RecommendedUnit: '',
          ReferrerPhone: '',
          RegisterDateTime: '',
          RegisteredFund: '',
          ShortVideo: '',
          SuppliersbusinessScope: [],
          SynthesizeEvaluate: '',
          SynthesizeScore: '',
          Systemofownership: "",
          TaxCreditRating: [],
          TaxRegistrationNum: "",
          SupplierType: 1,
          PromotingProducts:[], // 主要生产或销售产品
          gczysbxsmd: [], //工厂主要设备/销售门店
          OperatingReceipt:[], //最近三年营业收入
          EntryConditions: [], //准入条件
          BankInformation: [], // 银行信息
          CoverageArea: [], // 业务覆盖地区
          ProductInformation: [] // 产品信息
        },
        getInfo: {
          createDept: '',
          createTime: '',
          createName: '',
        },
        addTableData: [], // 子表数据
        fileData: [], // 附件数据
        formRules: {
          SupplierType: [
            {required: true, message: '供应商类型不能为空', trigger: 'change'},
          ],
          RegisteredFund: [
            {required: true, message: '注册资金(万元) 不能为空', trigger: 'blur'},
            {required: true, pattern: /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/, message: '请输入正确格式的金额', trigger: 'blur'}

          ],
          FiscalSystem: [
            {required: true, message: '税务制度不能为空', trigger: 'change'},
          ],
          ContactpsnPhone: [
            {required: true, message: '联系人电话不能为空', trigger: 'blur'},
            {required: true, pattern: /^((13|14|15|16|17|18)[0-9]{1}\d{8})|((166|199|198)[0-9]{1}\d{7})$/, message: '请输入正确格式的电话号码', trigger: 'blur'}
          ],
          ContactpsnEmail: [
            {required: true, message: '联系人邮箱不能为空', trigger: 'blur'},
            {required: true, pattern: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/, message: '请输入正确格式的邮箱', trigger: 'blur'}

          ],
          LegalPersonIDNumber: [
            {required: true, message: '法人身份证号不能为空', trigger: 'blur'},
            {required: true, pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, message: '请输入正确格式的身份证号', trigger: 'blur'}
          ],
          AreaofBusinessPremises: [
            {required: true, message: '经营场所面积(㎡) 不能为空', trigger: 'blur'},
            {required: true, pattern: /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/, message: '请输入正确格式的内容', trigger: 'blur'}

          ],
          RecommendedUnit: [
            {required: true, message: '推荐单位不能为空', trigger: 'change'},
          ],
          NameofSubcontractor: [
            {required: true, message: '供应商名称不能为空', trigger: 'blur'},
          ],
          RegisterDateTime: [
            {required: true, message: '注册成立日期不能为空', trigger: 'change'},
          ],
          CreditRating: [
            {required: true, message: '纳税信用等级不能为空', trigger: 'change'},
          ],
          ContactpsnPost: [
            {required: true, message: '联系人职务不能为空', trigger: 'blur'},
          ],
          CorporateName: [
            {required: true, message: '法人姓名不能为空', trigger: 'blur'},
          ],
          OfficeAddress: [
            {required: true, message: '办公地址不能为空', trigger: 'blur'},
          ],
          NatureofSupplier: [
            {required: true, message: '供应商性质不能为空', trigger: 'change'},
          ],
          TaxRegistrationNum: [
            {required: true, message: '统一社会信用代码不能为空', trigger: 'blur'},
            {required: true, pattern: /^[A-Z0-9]{18}$/, message: '请输入正确格式的统一社会信用代码', trigger: 'blur'}
          ],
          Contactpsn: [
            {required: true, message: '联系人不能为空', trigger: 'blur'},
          ],
          ContactpsnidentityCard: [
            {required: true, message: '联系人身份证不能为空', trigger: 'blur'},
            {required: true, pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, message: '请输入正确格式的身份证号', trigger: 'blur'}
          ],
          FactoryAddress: [
            {required: true, message: '工厂地址不能为空', trigger: 'blur'},
          ],
          Systemofownership: [
            {required: true, message: '所有制不能为空', trigger: 'change'},
          ],
          SuppliersbusinessScope: [
            {required: true, message: '供应商经营范围不能为空', trigger: 'change'},
          ]
        },
        parentId: '',
        id: '',
        type: '',
        submitObj: {}
      }
    },
    mounted() {
      var that = this;
      // window.myvm指向当前页面vue实例 复制粘贴
      window.myvm = that;
      // 自动计算高度
      window.autoPageHeight();
      // window.$urlFormVue指向当前页面vue实例 复制粘贴
      window.$urlFormVue = that;
      that.getSerialNumber();
      that.vaildKey();
    },
    created() {
    },
    methods: {
      // 返回  没用上
      backBtn() {
        FUI.Window.closeEdit();
      },
      // 获取详情
      getProjectData(id) {
        var that = this;
        let res = Object.toExtendAjax('/objectcost', '/queryObjectcost', {'wiid': id}, false, 'get');
        if (res.code === 200) {
          that.data = res.data;
          var arr = res.data.detail;
          var files = res.data.file;
          if (arr.length > 0) {
            that.$refs.treeTab.getObj(arr);
          }
          if (files) {
            that.$refs.file.getObj(files);
          }
        } else {
          that.$message.error(res.msg)
        }

      },
      // 获取单据编号
      getSerialNumber() {
        var that = this;
        var code = Object.toQueryString('code');
        let res = Object.toAjaxJson(FUI.Handlers.supplierOutsideLink, 'getSerialNumber', {'counterCode': 'CLGYS_','secretKey': code});
  		if (res.success) {
          that.data.BillNo = res.msg
        }
      },
      // 弹框调用 获取字段绑定
      // id：自定义对话框id
      // name：自定义对话框名称
      // code：自定义对话框别名
      // ObjName：自定义对话框数据对象名称（数据库表名）
      // width：弹框宽度
      // height：弹框高度
      // radioMultiple：是否多选
      openCustomDialog(id, name, code, ObjName, width, height, radioMultiple) {
        var that = this;
        var multi = radioMultiple == '1';
        CustomDialog(that, {
          customDialog: code,
          isTest: false,
          width: width,
          height: height,
          isMulti: multi,
          data: [
            {
              field: 'projectNo',
              property: 'myId'
            }
          ],
          callBack: function (data) {
            console.log(data);
            //自定义回调函数不是必须的，可删除
            let {ConstructionUnit, ProjectName, ProjectManager, ProjectManagerID, MyId, ConstructionUnitID, ProjectTaxMethod, ProjectNo} = data[0];
            that.data.constructionUnit = ConstructionUnit;
            that.data.projectName = ProjectName;
            that.data.projectManager = ProjectManager;
            that.data.projectManagerID = ProjectManagerID;
            that.data.projectId = MyId;
            that.data.constructionUnitId = ConstructionUnitID;
            that.data.projectProfitMargin = ProjectTaxMethod;
            that.data.projectNo = ProjectNo;
          }
        });
      },
      // 表单提交
      submitForm() {
        var that = this;
        fui_global_richeditorArrValueToInput(that);
        var success = that.validateForm('formRef');
        if (!success) return;
        FUI.Window.confirm("确定要保存吗？", "温馨提示", function (r) {
          if (r) {
            var data = that.data;
            var arr1 = [];
            var obj1 = {
              "mainTable":"SupplierofMaterials",
              "data": {
                "supplierType": data['SupplierType'],
                "BillNo":data['BillNo'],
                "RegisteredFund": data['RegisteredFund'],
                "FiscalSystem":data['FiscalSystem'],
                "ContactpsnPhone":data['ContactpsnPhone'],
                "ContactpsnEmail": data['ContactpsnEmail'],
                "LegalPersonIDNumber": data['LegalPersonIDNumber'],
                "AreaofBusinessPremises": data['AreaofBusinessPremises'],
                "MonthlyMaximumOutpuValue":data['MonthlyMaximumOutpuValue'],
                "NumberofSubstitutingPersonnel":data['NumberofSubstitutingPersonnel'],
                "NameofSubcontractor": data['NameofSubcontractor'],
                "RegisterDateTime":data['RegisterDateTime'],
                "InitialWarehousingRating": data['InitialWarehousingRating'],
                "CreditRating": data['CreditRating'],
                "ContactpsnPost":data['ContactpsnPost'],
                "CorporateName":data['CorporateName'],
                "OfficeAddress":data['OfficeAddress'],
                "PropertyofBusinessSite": data['PropertyofBusinessSite'],
                "DeepentheNumberofDesigners": data['DeepentheNumberofDesigners'],
                "NatureofSupplier": data['NatureofSupplier'],
                "TaxRegistrationNum":data['TaxRegistrationNum'],
                "CooperativeProcessRating": data['CooperativeProcessRating'],
                "Contactpsn": data['Contactpsn'],
                "ContactpsnidentityCard":data['ContactpsnidentityCard'],
                "CorporateTelePhone": data['CorporateTelePhone'],
                "FactoryAddress": data['FactoryAddress'],
                "Systemofownership": data['Systemofownership'],
                "NumberofTechnicalPersonnel": data['NumberofTechnicalPersonnel'],
                "RecommendedUnit": data['RecommendedUnit'],
                "RecommendDept": data['RecommendDept'],
                "NameofReferrer": data['NameofReferrer'],
                "IntellectualChainPlatformType": data['IntellectualChainPlatformType'],
                "ReferrerPhone": data['ReferrerPhone'],
                "CreateCentreDept": data['CreateCentreDept'],
                "SuppliersbusinessScope":data['SuppliersbusinessScope'] ,
                "Memo":data['Memo'],
                "SynthesizeEvaluate":data['SynthesizeEvaluate'],
                "SynthesizeScore":data['SynthesizeScore'],
                "Businesslicense":data['Businesslicense'],
                "CorporateIdentityCardFront":data['CorporateIdentityCardFront'],
                "ContactIDCardfront":data['ContactIDCardfront'],
                "TaxCreditRating":data['TaxCreditRating'],
                "PhotoofofficePremises":data['PhotoofofficePremises'],
                "ShortVideo":data['ShortVideo'],
                "AccountOpeningInformation":data['AccountOpeningInformation'],
                "PayrollStatement":data['PayrollStatement'],
                "OtherDetails":data['OtherDetails'],
                "CreateName":data['CreateName'],
                "CreateId": data['CreateId'],
                "CreateCentreDeptId": data['CreateCentreDeptId'],
                "CreateDept": data['CreateDept'],
                "CreateDeptId": data['CreateDeptId'],
                "CreateTime": data['CreateTime'],
                "RecommendDeptId":data['RecommendDeptId'],
                "BiMaterialDepot":data['BiMaterialDepot'],
                "MyId":data['MyId'],
                "CreateDeptCentre":data['CreateDeptCentre'],
                "CreateDeptCentreId":data['CreateDeptCentreId'],

              },
              "subTables":[
                {
                  "subTable":"BankInformation",
                  "data":data['BankInformation']
                },
                {
                  "subTable":"CoverageArea",
                  "data":data['CoverageArea']
                },
                {
                  "subTable":"PromotingProducts",
                  "data":data['PromotingProducts']
                },{
                  "subTable":"ProductInformation",
                  "data":data['ProductInformation']
                },{
                  "subTable":"gczysbxsmd",
                  "data":data['gczysbxsmd']
                },{
                  "subTable":"OperatingReceipt",
                  "data":data['OperatingReceipt']
                },{
                  "subTable":"EntryConditions",
                  "data":data['EntryConditions']
                }

              ]
            };
            arr1.push(obj1);
            var code = Object.toQueryString('code');
            var obj2 = {
              "secretKey": code,
              "params": arr1
            };
            $.extendAjax("/supplierOutsideLink/stagingSupplierOfMaterials", JSON.stringify(obj2), "post", function(res) {
              if(res.code === 200 ){
                FUI.Window.showMsg(res.msg, "提示", "info", function () {
                  // FUI.Window.closeEdit(true);
                  window.location.reload();
                });
              }else{
                FUI.Window.showMsg(res.msg);
                return false
              }
            });
          } else {
            //取消点击
          }
        });


      },
      // field: 可以是字段名也可以是字段定义的对象
      updateFieldValue(field, newValue, vueDataName, subVueDataName) {
        // 更新控件值
        var that = this;
        var vueDataObj = vueDataName ? that[vueDataName] : that.data;
        if (subVueDataName) vueDataObj = that[vueDataName][subVueDataName];
        if (typeof field === 'string') {
          vueDataObj[field] = newValue;
        } else {
          if (field.fieldName) {
            vueDataObj[field.fieldName] = newValue;
          } else if (field.vModel) {
            vueDataObj[field.vModel] = newValue;
          } else if (field['field']) {
            vueDataObj[field['field']] = newValue;
          }
        }
      },
      // 表单效验
      validateForm(refFormName) {
        var success = false;
        var that = this;
        that.$refs[refFormName].validate(valid => {
          success = valid;
        });
        that.getTableData();
        that.getFileData();
        if (!success) return;
        if (that.data['Businesslicense'].length === 0) {
          FUI.Window.showMsg('营业执照不能为空');
          return false
        }else if (that.data['CorporateIdentityCardFront'].length === 0) {
          FUI.Window.showMsg('法人身份证正面不能为空');
          return false
        }else if (that.data['ContactIDCardfront'].length === 0) {
          FUI.Window.showMsg('联系人身份证正面不能为空');
          return false
        }else if (that.data['TaxCreditRating'].length === 0) {
          FUI.Window.showMsg('近两年的纳税信用评级不能为空');
          return false
        }else if (that.data.SupplierType === 1 && that.data['PhotoofofficePremises'].length === 0) {
          FUI.Window.showMsg('公司门头照片以及办公经营场地照片不能为空');
          return false
        }else if (that.data.SupplierType === 2 && that.data['ShortVideo'].length === 0) {
          FUI.Window.showMsg('拍摄从厂牌到厂内的短视频不能为空');
          return false
        }else if (that.data['AccountOpeningInformation'].length === 0) {
          FUI.Window.showMsg('开户许可证或加盖章的开户信息');
          return false
        }else if (that.data.SupplierType === 2 && that.data['PayrollStatement'].length === 0) {
          FUI.Window.showMsg('联系人在本企业的社保证明或工资流水单不能为空');
          return false
        }
        var state = that.vaildOnlyData(); // 校验唯一性
        if (state === false) {
          return false
        }
        return success;
      },
      getTableData() {
        var that = this;
        that.$refs.bank.setData();
        that.$refs.cover.setData();
        that.$refs.main.setData();
        that.$refs.product.setData();
        that.$refs.major.setData();
        that.$refs.three.setData();
        that.$refs.entry.setData();

      },
      getFileData(){
        this.$refs.file1.returnData(1);
        this.$refs.file2.returnData(2);
        this.$refs.file3.returnData(3);
        this.$refs.file4.returnData(4);
        this.$refs.file5.returnData(5);
        this.$refs.file6.returnData(6);
        this.$refs.file7.returnData(7);
        this.$refs.file8.returnData(8);
        this.$refs.file9.returnData(9);
      },
      showData(type,arr) {
        var that = this;
        if(type === 1){
          that.data.BankInformation = arr;
        }else if(type === 2){
          that.data.CoverageArea = arr
        }else if(type === 3){
          that.data.PromotingProducts = arr
        }else if(type === 4){
          that.data.OperatingReceipt = arr
        }else if(type === 5){
          that.data.ProductInformation = arr
        }else if(type === 6){
          that.data.EntryConditions = arr
        }else if(type === 7){
          that.data.gczysbxsmd = arr
        }
        console.log(type,arr)
      },
      // 接受上次文件
      showFile(oIndex,arr) {
        console.log(arr, '文件');
        var that = this;
        if(oIndex === 1){
          that.data.Businesslicense = arr;
        }else if(oIndex === 2){
          that.data.CorporateIdentityCardFront = arr;
        }else if(oIndex === 3){
          that.data.ContactIDCardfront = arr;
        }else if(oIndex === 4){
          that.data.TaxCreditRating = arr;
        }else if(oIndex === 5){
          that.data.PhotoofofficePremises = arr;
        }else if(oIndex === 6){
          that.data.ShortVideo = arr;
        }else if(oIndex === 7){
          that.data.AccountOpeningInformation = arr;
        }else if(oIndex === 8){
          that.data.PayrollStatement = arr;
        }else if(oIndex === 9){
          that.data.OtherDetails = arr;
        }


      },
      // 接收得分
      getScore(val){
        this.data.SynthesizeScore = val;
      },
      // 校验唯一性
      vaildOnlyData() {
        var isOk = false;
        var that = this;
        var table = 'ct_SupplierofMaterials';
        // 判断唯一数据唯一性
        var taxRegistrationNum = that.data.TaxRegistrationNum;
        var nameofSubcontractor = that.data.NameofSubcontractor;
        var MyId = that.data.myId;

        var data = [
          {
          tableName: table,
          myId: MyId,
          notProcInstState: [3, 99], // 过滤条件
          field: [{
              fieldName: 'NameofSubcontractor',
              value: nameofSubcontractor,
            }]
        },{
            tableName: table,
            myId: MyId,
            notProcInstState: [3, 99], // 过滤条件
            field: [{
                fieldName: 'TaxRegistrationNum',
                value: taxRegistrationNum,
              }]
          }
        ];
        //判断数据唯一性接口
        $.extendAjax("/supplierOutsideLink/GetIsExist", JSON.stringify(data), "post", function (d) {
          var res = d.data;
          if (Number(res[0]) === 1 && Number(res[1]) === 1) {
            FUI.Window.showMsg('供应商名称值,社会统一信用代码值已存在')
            return isOk = false
          } else if (Number(res[0]) === 1) {
            FUI.Window.showMsg('供应商名称值已存在')
            return isOk = false
          } else if (Number(res[1]) === 1) {
            FUI.Window.showMsg('社会统一信用代码值已存在')
            return isOk = false
          } else {
            return isOk = true
          }
        });
        return isOk;

      },
      handleClick(tab, event) {
        console.log(tab, event);
      },
      // 关闭
      closeForm(){
        var that = window;
        this.$confirm('是否关闭当前页面, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          that.open('about:blank','_self').close()
        })
      },
      changeSupplierType(val){
        if(val){
          this.activeName = '0';
        }
      },
      //****************************************秘钥校验*****************************************************************************
      vaildKey() {
        var that = this;
        var code = Object.toQueryString('code');
        $.extendAjax(`/supplierOutsideLink/checkSupplierLinkSecretKey/` + code, '', "get", function (d) {
          if (d.code === 200) {
            that.data['CreateName'] = d.data.createName;
            that.data['CreateDept'] = d.data.createDept;
            that.data['CreateDeptId'] = d.data.createDeptId;
            that.data['CreateId'] = d.data.createId;
            var times = Object.toGetCurrentDateTimeString();
            that.data['CreateTime'] = times
          }else{
            FUI.Window.showMsg(d.msg);
            return false
          }

        });

      }

    }
  }
</script>

<style lang="scss" scoped>
  .cost {
    width: 100%;
    background: rgb(245 246 248);
    height: 100%;
    overflow-y: scroll;

    .formCont {
      width: 80%;
      margin: auto;
    }

    .topBtn {
      min-height: 50px;
      background: white;
      margin-bottom: 10px;

      .btnBox {
        width: 80%;
        margin: 0 auto;
        padding-top: 10px;
      }
    }

    .title {
      vertical-align: middle;
      display: flex;
      align-items: center;
      font-size: 12px;
      font-weight: bold;
      color: #0D1126;
      border-bottom: 1px solid #f3f3f3;
      padding: 5px 0;
    }

    .title::before {
      content: "";
      display: inline-block;
      width: 4px;
      height: 20px;
      margin-right: 15px;
      background-color: #006EFF;
    }

    .projectInfo {
      margin-bottom: 10px;
      padding: 5px 0;
      background-color: #fff;

      .formData {
        padding: 10px 0;
      }
    }

    .costInfo {
      //  min-height: 400px;
      background-color: #fff;
      padding: 5px 0;
      margin-bottom: 10px;

      .formData {
        padding: 10px 0;
      }

    }

    .planCenter {
      // min-height: 600px;
      background-color: #fff;
      padding: 5px 0;
      margin-bottom: 10px;

      .formData {
        padding: 10px 0;
      }
    }

    .footer {
      background-color: #fff;
      padding: 5px 0;
    }

    .pageTitle {
      text-align: center;
      font-size: 26px;
      color: rgb(0, 140, 255);
      height: 48px;
      background: #FFFFFF;
      margin-bottom: 10px;
      line-height: 48px;
    }

    .radioList {
      .el-radio {
        padding: 5px 0;
      }
    }
  }
</style>
