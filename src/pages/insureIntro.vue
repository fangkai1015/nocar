<template>
    <section class="insure-wrap">
        <headerbox :titleName="insureTitle">
        </headerbox>
        <div class="insureIntro-con">
            <!--起保日期--->
            <div class="insureIntro-box">
                <div class="insureIntro-title">起保日期</div>
                <div class="insureIntro-item">
                    <ul>
                        <li v-for="dataItem in enableDate" :key="dataItem.id" class="insureList">
                            <div v-if="dataItem.displayType == 'datesel' ">
                              <van-cell class="insureDate-line"  :value="insureDate"  @click="show = true" is-link>
                                  <template #title>
                                    <div class="insureIntro-label">{{dataItem.showName}}</div>
                                    <span class="required-icon" v-if="dataItem.required">*</span>
                                  </template>
                              </van-cell>
                              <van-calendar v-model="show"  @confirm="onConfirm" :min-date="minDate" :max-date="maxDate"/>
                            </div>
                        </li>

                    </ul>
                </div>
            </div>

            <!--投保人信息-->
            <div class="insureIntro-box">
                <div class="insureIntro-title">投保人信息</div>
                <div class="insureIntro-item">
                    <ul>
                        <li v-for="insurerItem in insurer"  :key="insurerItem.id" class="insureList">
                            <div v-if="insurerItem.displayType != 'datesel' && insurerItem.displayType != 'profCheck'"  class="insureIntro-label">{{insurerItem.showName}}</div>
                            <span class="required1-icon" v-if="insurerItem.displayType != 'datesel' && insurerItem.displayType != 'profCheck' && insurerItem.required">*</span>
                            <van-cell is-link @click="showPopup2" v-if="insurerItem.displayType == 'profCheck'" :value="jobValue2">
                              <template #title>
                                <div class="insureIntro-label">{{insurerItem.showName}}</div>
                                <span class="required-icon" v-if="insurerItem.required">*</span>
                              </template>
                            </van-cell>
                            <div  v-if="insurerItem.displayType == 'input' "  class="insureIntro-right">
                                <input type="text" class="insureIntro-input"  :placeholder= " '请输入'+insurerItem.showName" v-blur  v-model.trim="insurerItem.value" v-if="insurerItem.fieldName == 'insCredentials'" @blur="setIntro(insurer)">
                                <input type="text" class="insureIntro-input"  :placeholder= " '请输入'+insurerItem.showName" v-blur  v-model.trim="insurerItem.value" v-if="insurerItem.fieldName !== 'insCredentials'">
                            </div>
                            <div  v-else-if="insurerItem.displayType == 'select'"  class="insureIntro-right">
                                <select  class="insureIntro-select" v-if="insurerItem.fieldName == 'insProvince' && insurerItem.validateRules"  v-model="insurerItem.value" @change="changeProvince(insurerItem.validateRules,insurerItem.value,insurerItem.fldgroup)">
                                    <option style="display:none"></option>
                                    <option :value="selectItem.value"  v-for="selectItem in JSON.parse(insurerItem.validateRules).valueLimit" :key="selectItem.value">{{selectItem.name}}</option>
                                </select>
                                <select class="insureIntro-select"  v-else-if="insurerItem.fieldName == 'insCity'"  v-model="insurerItem.value">
                                  <option style="display:none"></option>
                                  <option :value="selectItem.value"  v-for="selectItem in Citys" :key="selectItem.value">{{selectItem.name}}</option>
                                </select>
                                <select  class="insureIntro-select" v-else-if="insurerItem.fieldName != 'insProvince' && insurerItem.fieldName != 'insCity' && insurerItem.validateRules" v-model="insurerItem.value">
                                    <option style="display:none"></option>
                                    <option :value="selectItem.value"  v-for="selectItem in JSON.parse(insurerItem.validateRules).valueLimit" :key="selectItem.value">{{selectItem.name}}</option>
                                </select>
                            </div>
                            <div  v-else-if="insurerItem.displayType == 'singlecheck' && insurerItem.validateRules "  class="insureIntro-right">
                              <van-radio-group v-model="insurerItem.value" direction="horizontal">
                                <van-radio :name="singleItem.value" v-for="singleItem in JSON.parse(insurerItem.validateRules).valueLimit" :key="singleItem.value">{{singleItem.name}}</van-radio>
                              </van-radio-group>
                            </div>
                            <div  v-else-if="insurerItem.displayType == 'multicheck'"  class="insureIntro-right">
                            </div>
                            <div v-else-if="insurerItem.displayType == 'datesel'" >
                                 <van-cell :value="insureBirthDate"  is-link  @click="insureBirthPop = true">
                                   <template #title>
                                    <div class="insureIntro-label">{{insurerItem.showName}}</div>
                                    <span class="required-icon" v-if="insurerItem.required">*</span>
                                  </template>
                                 </van-cell>
                                 <van-popup v-model="insureBirthPop" :label="insurerItem.showName" position="bottom" :overlay="true">
                                      <van-datetime-picker  type="date"   @cancel="insureBirthPop = false" @confirm="confirmInsureBirthDate"   :min-date="minBirthDate"  :max-date="maxBirthDate"/>
                                  </van-popup>
                            </div>

                        </li>

                    </ul>
                </div>
            </div>

            <!--被保人信息-->
            <div class="insureIntro-box">
                <div class="insureIntro-title">被保人信息</div>
                <div class="toub-people">
                    <!-- <div class="toub-for">为谁投保</div>
                    <div class="people-tab">
                        <span class="on">本人</span>
                        <span>配偶</span>
                        <span>父母</span>
                        <span>子女</span>
                    </div> -->
                    <div class="toubao-con">
                        <div class="insureIntro-item">
                            <ul>
                              <li v-for="insuredItem in insured.slice(0,1)" :key="insuredItem.id" class="insureList">
                                  <div class="insureIntro-label" >{{insuredItem.showName}}</div>
                                  <span class="required1-icon" v-if="insuredItem.required">*</span>
                                  <div  v-if="insuredItem.displayType == 'select'"  class="insureIntro-right">
                                      <select class="insureIntro-select" v-if="insuredItem.fieldName == 'relation'"  v-model="insuredItem.value" @change="insuredchange(insuredItem.value)">
                                          <option style="display:none"></option>
                                          <option :value="selectItem.value"  v-for="selectItem in JSON.parse(insuredItem.validateRules).valueLimit" :key="selectItem.value">{{selectItem.name}}</option>
                                      </select>
                                  </div>
                              </li>
                              <template v-if="insuredShow">
                                <li v-for="insuredItem in insured.slice(1)" :key="insuredItem.id" class="insureList">
                                    <div v-if="insuredItem.displayType != 'datesel' && insuredItem.displayType != 'profCheck'" class="insureIntro-label" >{{insuredItem.showName}}</div>
                                    <span class="required1-icon" v-if="insuredItem.displayType != 'datesel' && insuredItem.displayType != 'profCheck' && insuredItem.required">*</span>
                                    <div  v-if="insuredItem.displayType == 'input' "  class="insureIntro-right">
                                        <input type="text" class="insureIntro-input"  :placeholder= " '请输入'+insuredItem.showName" v-blur  v-model.trim="insuredItem.value" v-if="insuredItem.fieldName == 'certificateContent'" @blur="setIntro(insured)">
                                        <input type="text" class="insureIntro-input"  :placeholder= " '请输入'+insuredItem.showName" v-blur  v-model.trim="insuredItem.value" v-if="insuredItem.fieldName !== 'certificateContent'" v-show="insuredShow">
                                    </div>
                                    <div  v-else-if="insuredItem.displayType == 'select'"  class="insureIntro-right">
                                      <select  class="insureIntro-select" v-if="insuredItem.fieldName == 'province' && insuredItem.validateRules"  v-model="insuredItem.value" @change="changeProvince(insuredItem.validateRules,insuredItem.value,insuredItem.fldgroup)">
                                        <option style="display:none"></option>
                                        <option :value="selectItem.value"  v-for="selectItem in JSON.parse(insuredItem.validateRules).valueLimit" :key="selectItem.value">{{selectItem.name}}</option>
                                      </select>
                                      <select class="insureIntro-select"  v-else-if="insuredItem.fieldName == 'city'"  v-model="insuredItem.value">
                                        <option style="display:none"></option>
                                        <option :value="selectItem.value"  v-for="selectItem in insCitys" :key="selectItem.value">{{selectItem.name}}</option>
                                      </select>
                                      <select class="insureIntro-select" v-else-if="insuredItem.fieldName !== 'province' && insuredItem.fieldName !== 'city'  && insuredItem.fieldName !== 'relation' && insuredItem.validateRules"  v-model="insuredItem.value" ref="selectBox">
                                          <option style="display:none"></option>
                                          <option :value="selectItem.value"  v-for="selectItem in JSON.parse(insuredItem.validateRules).valueLimit" :key="selectItem.value">{{selectItem.name}}</option>
                                      </select>
                                    </div>
                                    <div  v-else-if="insuredItem.displayType == 'singlecheck' && insuredItem.validateRules "  class="insureIntro-right">
                                        <van-radio-group  v-model="insuredItem.value"  direction="horizontal">
                                            <van-radio :name="singleItem.value" v-for="singleItem in JSON.parse(insuredItem.validateRules).valueLimit" :key="singleItem.value">{{singleItem.name}}</van-radio>
                                        </van-radio-group>
                                    </div>
                                    <div  v-else-if="insuredItem.displayType == 'multicheck'"  class="insureIntro-right">
                                    </div>
                                    <div v-else-if="insuredItem.displayType == 'datesel'" >
                                         <van-cell :value="insuredBirthDate" is-link  @click="insuredBirthPop = true">
                                            <template #title>
                                              <div class="insureIntro-label">{{insuredItem.showName}}</div>
                                              <span class="required-icon" v-if="insuredItem.required">*</span>
                                            </template>
                                         </van-cell>
                                         <van-popup v-model="insuredBirthPop" :label="insuredItem.showName" position="bottom" :overlay="true">
                                              <van-datetime-picker  type="date" @cancel="insuredBirthPop = false" @confirm="confirmInsuredBirthDate"  :min-date="minBirthDate" :max-date="maxBirthDate"/>
                                          </van-popup>
                                    </div>
                                </li>
                              </template>
                              <li v-if="JSON.stringify(profession) !== '{}'" class="insureList">
                                  <van-cell is-link @click="showPopup1" :value="jobValue1" :title="profession.showName">
                                    <template #title>
                                      <div class="insureIntro-label">{{profession.showName}}</div>
                                      <span class="required-icon" v-if="profession.required">*</span>
                                    </template>
                                  </van-cell>                                 
                              </li>
                            </ul>
                        </div>
                    </div>
                    <!--添加的模块-->
                    <div class="toubao-addBox" style="display: none;">
                        <div class="column-del">删除</div>
                        <div class="addBox-title">第2位被保人</div>
                        <div class="toub-for">为谁投保</div>
                        <div class="people-tab">
                            <span>本人</span>
                            <span class="on">配偶</span>
                            <span>父母</span>
                            <span>子女</span>
                        </div>
                        <div class="toubao-con">
                            <div class="insureIntro-item">
                                <ul>
                                    <li>
                                        <div class="insureIntro-label">姓名</div>
                                        <div class="insureIntro-right">
                                            <input type="text" class="insureIntro-input" placeholder="请输入被保人姓名">
                                        </div>
                                    </li>
                                    <li>
                                        <div class="insureIntro-label">证件类型</div>
                                        <div class="insureIntro-right">
                                            <select class="insureIntro-select">
                                                <option value="0">身份证</option>
                                                <option value="1">护照</option>
                                            </select>
                                        </div>
                                    </li>
                                    <li>
                                        <div class="insureIntro-label">证件号码</div>
                                        <div class="insureIntro-right">
                                            <input type="text" class="insureIntro-input" placeholder="请输入被保人证件号码">
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <!-- <div class="add-btn"><i class="add-icon"></i><span>添加被保人</span></div> -->
                </div>
            </div>

            <!--受益人信息-->
            <div class="insureIntro-box"  v-if="beneficiary">
                <div class="insureIntro-title">受益人信息</div>
            <!--   <div class="people-tab">
                        <span class="on">父母</span>
                        <span>配偶</span>
                        <span>子女</span>
                    </div>  -->
                    <div class="toubao-con">
                        <div class="insureIntro-item">
                            <ul>
                                <li v-for="beneficiaryItem in beneficiary" :key="beneficiaryItem.id" class="insureList">
                                    <div class="insureIntro-label">{{beneficiaryItem.showName}}</div>
                                    <span class="required1-icon" v-if="beneficiaryItem.required">*</span>
                                    <div  v-if="beneficiaryItem.displayType == 'input' "  class="insureIntro-right">
                                        <input type="text" class="insureIntro-input"  :placeholder= " '请输入'+beneficiaryItem.showName" v-model.trim="beneficiaryItem.value"  v-blur>
                                    </div>
                                    <div  v-else-if="beneficiaryItem.displayType == 'select'"  class="insureIntro-right">
                                        <select class="insureIntro-select" v-if="beneficiaryItem.validateRules"  v-model="beneficiaryItem.value">
                                            <option style="display:none"></option>
                                            <option :value="selectItem.value"  v-for="selectItem in JSON.parse(beneficiaryItem.validateRules).valueLimit" :key="selectItem.value">{{selectItem.name}}</option>
                                        </select>
                                    </div>
                                    <div  v-else-if="beneficiaryItem.displayType == 'singlecheck' && beneficiaryItem.validateRules "  class="insureIntro-right">
                                        <label  v-for="singleItem in JSON.parse(beneficiaryItem.validateRules).valueLimit" :key="singleItem.value"><input :name="singleItem.showName"   type="radio" />{{singleItem.name}}</label>
                                    </div>
                                    <div  v-else-if="beneficiaryItem.displayType == 'singlecheck' && beneficiaryItem.validateRules "  class="insureIntro-right">
                                        <van-radio-group  v-model="beneficiaryItem.value"  direction="horizontal">
                                            <van-radio :name="singleItem.value" v-for="singleItem in JSON.parse(beneficiaryItem.validateRules).valueLimit" :key="singleItem.value">{{singleItem.name}}</van-radio>
                                        </van-radio-group>
                                    </div>
                                    <div  v-else-if="beneficiaryItem.displayType == 'multicheck'"  class="insureIntro-right">
                                    </div>
                                    <div  v-else-if="beneficiaryItem.displayType == 'datesel'"  class="insureIntro-right">
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <!-- <div class="add-btn"><i class="add-icon"></i><span>添加受益人</span></div> -->
            </div>

            <!--紧急联系人-->
            <div class="insureIntro-box" v-if="emergency && emergency.length >0">
                <div class="insureIntro-title">紧急联系人</div>
                <div class="insureIntro-item">
                    <ul>
                        <li v-for="emergencyItem in emergency" :key="emergencyItem.id" class="insureList">
                            <div class="insureIntro-label">{{emergencyItem.showName}}</div>
                            <span class="required1-icon" v-if="emergencyItem.required">*</span>
                            <div  v-if="emergencyItem.displayType == 'input' "  class="insureIntro-right">
                                <input type="text" class="insureIntro-input"  :placeholder= " '请输入'+emergencyItem.showName" v-blur  v-model.trim="emergencyItem.value" >
                            </div>
                            <div  v-else-if="emergencyItem.displayType == 'select'"  class="insureIntro-right">
                                <select class="insureIntro-select" v-if="emergencyItem.validateRules" v-model="emergencyItem.value">
                                    <option style="display:none"></option>
                                    <option :value="selectItem.value"  v-for="selectItem in JSON.parse(emergencyItem.validateRules).valueLimit" :key="selectItem.value">{{selectItem.name}}</option>
                                </select>
                            </div>
                            <div  v-else-if="emergencyItem.displayType == 'singlecheck' && emergencyItem.validateRules "  class="insureIntro-right">
                                <van-radio-group  v-model="emergencyItem.value"  direction="horizontal">
                                    <van-radio :name="singleItem.value" v-for="singleItem in JSON.parse(emergencyItem.validateRules).valueLimit" :key="singleItem.value">{{singleItem.name}}</van-radio>
                                </van-radio-group>
                            </div>
                            <div  v-else-if="beneficiaryItem.displayType == 'multicheck'"  class="insureIntro-right">
                            </div>
                            <div  v-else-if="beneficiaryItem.displayType == 'datesel'"  class="insureIntro-right">
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            <!--其它信息-->
            <div class="insureIntro-box" v-if="otherInfo && otherInfo.length >0">
                <div class="insureIntro-title">其它信息</div>
                <div class="insureIntro-item">
                  <ul>
                      <li v-for="otherInfoItem in otherInfo" :key="otherInfoItem.id" class="insureList">
                          <div class="insureIntro-label">{{otherInfoItem.showName}}</div>
                          <span class="required1-icon" v-if="otherInfoItem.required">*</span>
                          <div  v-if="otherInfoItem.displayType == 'input' "  class="insureIntro-right">
                              <input type="text" class="insureIntro-input"  :placeholder= " '请输入'+otherInfoItem.showName" v-blur  v-model.trim="otherInfoItem.value" >
                          </div>
                          <div  v-else-if="otherInfoItem.displayType == 'select'"  class="insureIntro-right">
                              <select class="insureIntro-select" v-if="otherInfoItem.validateRules" v-model="otherInfoItem.value">
                                  <option style="display:none"></option>
                                  <option :value="selectItem.value"  v-for="selectItem in JSON.parse(otherInfoItem.validateRules).valueLimit" :key="selectItem.value">{{selectItem.name}}</option>
                              </select>
                          </div>
                          <div  v-else-if="otherInfoItem.displayType == 'singlecheck' && otherInfoItem.validateRules "  class="insureIntro-right">
                              <van-radio-group  v-model="otherInfoItem.value"  direction="horizontal">
                                  <van-radio :name="singleItem.value" v-for="singleItem in JSON.parse(otherInfoItem.validateRules).valueLimit" :key="singleItem.value">{{singleItem.name}}</van-radio>
                              </van-radio-group>
                          </div>
                          <div  v-else-if="beneficiaryItem.displayType == 'multicheck'"  class="insureIntro-right">
                          </div>
                          <div  v-else-if="beneficiaryItem.displayType == 'datesel'"  class="insureIntro-right">
                          </div>
                      </li>
                  </ul>
                </div>
             </div>
            <div class="syr-intro" v-if="!beneficiary">受益人默认为法定受益人</div>      
        </div>
        <footer class="detail-footer intro-footer">
            <div class="footer-content">
                <div class="tb-btn" @click = "toInsure">立即投保</div>
            </div>
        </footer>
        <!--投保人职业弹层-->
        <van-popup
        v-model="workShow2"
        round
        closeable
        position="bottom"
        >
            <div class="weebox-header">
                <div class="weebox-title">查询职业类别</div>
            </div>
            <div class="job-search">
                <input type="text" placeholder="例如：工程师" class="search-input" v-model.trim="workTxt1" @keyup="workinput1" @keyup.13="searchWork1">
                <span class="inputClear" v-if="workClear1" @click="clearWork1"></span>
            </div>
            <!--搜索内容-->
            <div class="job-content" v-if="searchCon1">
              <div class="jobEmpty" v-show="!searchList1">暂无相关职业类别</div>
                <div class="job-item" v-for="profList in searchList1"  v-show="searchList1" :key="profList.id">
                    <div class="job-title">{{profList.profName}}</div>
                    <div class="job-list">
                        <ul>
                            <li v-for="profListTub in profList.subList" :key="profListTub.id">
                                <div class="job-name" @click="jobSub2(profListTub.id)">{{profListTub.profName}}<span class="up-icon" :class="{'down-icon':jobShow2 == profListTub.id}"></span></div>
                                <div class="job-sublist" v-show="jobShow2 == profListTub.id">
                                    <div class="sublist-con" v-for="subList in profListTub.subList" :key="subList.id" @click="workVal2(subList.profName,subList.profCode)">
                                        <div class="sublist-name">{{subList.profName}}</div>
                                        <div class="sublist-type">{{subList.codeData}}类</div>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <div class="job-content" v-if="jobCon1">
                <div class="job-item" v-for="profList in profLists" :key="profList.id">
                    <div class="job-title">{{profList.profName}}</div>
                    <div class="job-list">
                        <ul>
                            <li v-for="profListTub in profList.subList" :key="profListTub.id">
                                <div class="job-name" @click="jobSub2(profListTub.id)">{{profListTub.profName}}<span class="up-icon" :class="{'down-icon':jobShow2 == profListTub.id}"></span></div>
                                <div class="job-sublist" v-show="jobShow2 == profListTub.id">
                                    <div class="sublist-con" v-for="subList in profListTub.subList" :key="subList.id" @click="workVal2(subList.profName,subList.profCode)">
                                        <div class="sublist-name">{{subList.profName}}</div>
                                        <div class="sublist-type">{{subList.codeData}}类</div>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </van-popup>
        <!--被保人职业弹层-->
        <van-popup
        v-model="workShow1"
        round
        closeable
        position="bottom"
        >
          <div class="weebox-header">
                  <div class="weebox-title">查询职业类别</div>
          </div>
          <div class="job-search">
              <input type="text" placeholder="例如：工程师" class="search-input" v-model.trim="workTxt2" @keyup="workinput2" @keyup.13="searchWork2">
              <span class="inputClear" v-if="workClear2" @click="clearWork2"></span>
          </div>

          <!--搜索内容-->
          <div class="job-content" v-if="searchCon2">
            <div class="jobEmpty" v-show="!searchList2">暂无相关职业类别</div>
              <div class="job-item" v-for="profList in searchList2"  v-show="searchList2" :key="profList.id">
                  <div class="job-title">{{profList.profName}}</div>
                  <div class="job-list">
                      <ul>
                          <li v-for="profListTub in profList.subList" :key="profListTub.id">
                              <div class="job-name" @click="jobSub1(profListTub.id)">{{profListTub.profName}}<span class="up-icon" :class="{'down-icon':jobShow1 == profListTub.id}"></span></div>
                              <div class="job-sublist" v-show="jobShow1 == profListTub.id">
                                  <div class="sublist-con" v-for="subList in profListTub.subList" :key="subList.id" @click="workVal1(subList.profName,subList.profCode)">
                                      <div class="sublist-name">{{subList.profName}}</div>
                                      <div class="sublist-type">{{subList.codeData}}类</div>
                                  </div>
                              </div>
                          </li>
                      </ul>
                  </div>
              </div>
          </div>

          <div class="job-content" v-if="jobCon2">
              <div class="job-item" v-for="profList in profLists" :key="profList.id">
                  <div class="job-title">{{profList.profName}}</div>
                  <div class="job-list">
                      <ul>
                          <li v-for="profListTub in profList.subList" :key="profListTub.id">
                              <div class="job-name" @click="jobSub1(profListTub.id)">{{profListTub.profName}}<span class="up-icon" :class="{'down-icon':jobShow1 == profListTub.id}"></span></div>
                              <div class="job-sublist" v-show="jobShow1 == profListTub.id">
                                  <div class="sublist-con" v-for="subList in profListTub.subList" :key="subList.id" @click="workVal1(subList.profName,subList.profCode)">
                                      <div class="sublist-name">{{subList.profName}}</div>
                                      <div class="sublist-type">{{subList.codeData}}类</div>
                                  </div>
                              </div>
                          </li>
                      </ul>
                  </div>
              </div>
          </div>
      </van-popup>
    </section>
</template>
<script>
import Vue from 'vue';
import { Calendar } from 'vant';
Vue.use(Calendar);
import { Cell } from 'vant';
Vue.use(Cell);
import { DatetimePicker } from 'vant';
Vue.use(DatetimePicker);
import { popup } from 'vant';
Vue.use(popup);
import { RadioGroup, Radio } from 'vant';
Vue.use(Radio);
Vue.use(RadioGroup);
import { Toast } from 'vant';
Vue.use(Toast);
import headerbox from '../components/headerbox'
export default {
  name:'insureIntro',
  data(){
    return{
      insureTitle:'填写投保信息',
      enableDate:[],
      insured:[],
      insurer:[],
      beneficiary:[],
      emergency:[],
      otherInfo:[],
      profLists:[],//职业前二级
      insureDate: '',
      show: false,
      minDate:new Date( new Date().getFullYear(),new Date().getMonth(),new Date().getDate() + 1),
      maxDate:new Date( new Date().getFullYear(),new Date().getMonth(),new Date().getDate() + 30),
      insureBirthPop:false,
      insureBirthDate:'',
      insuredBirthDate:'',
      insuredBirthPop:false,
      minBirthDate: new Date(1900, 0, 1),
      maxBirthDate:new Date(),
      workShow1:false,
      workShow2:false,
      workClear1:false,
      workClear2:false,
      workTxt1:'',
      workTxt2:'',
      jobShow1:'',
      jobShow2:'',
      jobValue1:'',
      jobValue2:'',
      profCode1:'',
      profCode2:'',
      Citys:[],
      insCitys:[],
      jobCon1:true,
      searchCon1:false,
      searchEmpty1:false,
      searchList1:[],
      jobCon2:true,
      searchCon2:false,
      searchEmpty2:false,
      searchList2:[],
      insuredShow:true,
      profession:{}//被保人职业字段
    }
  },
  components:{
        'headerbox': headerbox
   },
  methods:{
    //初始化select的index
    selectIndex(){
          
    },
    formatDate(date) {
      return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    },
    onConfirm(date) {
      this.show = false;
      this.insureDate = this.formatDate(date);
    },
    confirmInsureBirthDate(date){
      this.insureBirthPop = false;
      this.insureBirthDate = this.formatDate(date);
    },
    confirmInsuredBirthDate(date){
      this.insuredBirthPop = false;
      this.insuredBirthDate = this.formatDate(date);
    },
    workinput1(){
      if(this.workTxt1 !== ''){
        this.workClear1 = true
      }else{
        this.workClear1 = false;
        this.jobCon1 = true;
        this.searchCon1 = false;
      }
    },
    workinput2(){
      if(this.workTxt2 !== ''){
        this.workClear2 = true
      }else{
        this.workClear2 = false;
        this.jobCon2 = true;
        this.searchCon2 = false;
      }
    },
    clearWork1(){
      this.workClear1 = false;
      this.jobCon1 = true;
      this.searchCon1 = false;
      this.workTxt1 = '';
    },
    clearWork2(){
      this.workClear2 = false;
      this.jobCon2 = true;
      this.searchCon2 = false;
      this.workTxt2 = '';
    },
    searchWork1(){
      if(this.workTxt1 !== ''){
        this.searchEnter(1,this.workTxt1);
        this.jobCon1 = false;
        this.searchCon1 = true;
      }
    },
    searchWork2(){
      if(this.workTxt2 !== ''){
        this.searchEnter(2,this.workTxt2);
        this.jobCon2 = false;
        this.searchCon2 = true;
      }
    },
    //投保人被保人身份证号失去焦点
    setIntro(val){
      let idCard,valCard;
      let cardType1 = false,cardType2 = false;
      let cardReg = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$|^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$/;
      val.map((data,i)=>{
        let fieldName = data.fieldName;
        if(fieldName == 'insCredentialsType'){
          if(data.value && data.value == '01'){
            cardType1 = true;
          }
        }
        if(fieldName == 'certificateType'){
          if(data.value && data.value == '01'){
            cardType2 = true;
          }
        }
        if(fieldName == 'insCredentials' && cardType1){//投保人身份证号码带出出生日期
          if(data.value && cardReg.test(data.value)){
              idCard = data.value
              this.insureBirthDate = this.getCard(idCard);
          }
        }
        
        if(fieldName == 'certificateContent' && cardType2){//被保人身份证号码带出出生日期
          if(data.value && cardReg.test(data.value)){
              valCard = data.value
              this.insuredBirthDate = this.getCard(valCard);
          }
        }
        if(fieldName == 'insSex' && cardType1){//投保人身份证号码带出性别
          if(idCard && cardReg.test(idCard)){
            let sexVal = this.getSex(idCard);
            data.value = sexVal == '男'?'1':'2';
          }
        }
        if(fieldName == 'sex' && cardType2){//被保人身份证号码带出性别
          if(valCard && cardReg.test(valCard)){
            let sexVal = this.getSex(valCard);
            data.value = sexVal == '男'?'1':'2';
          }
        }
      })
    },
    //被保人选择本人
    insuredchange(index){
      if(index == '01'){
       this.insuredShow = false
      }else{
        this.insuredShow = true;
      }
    },
    searchEnter(num,work){
      let codeDateType = '';
      if(JSON.stringify(this.profession) !== '{}' && this.profession.validateRules !== ''){
        codeDateType = JSON.parse(this.profession.validateRules).profLimit;
      }
      this.$ajax({
            method:'post',
            url:'/insurance/api/insure/findProfessionByInsIdAndName/' + this.$route.query.id,
            params:{
              'profName':work,
              'codeDateType':codeDateType
            }
          })
          .then((res)=>{
            if(res.data &&  res.data.code == "1"){
              if(num == 1){
                this.searchList1 = res.data.outData.profList;
              }
              if(num == 2){
                this.searchList2 = res.data.outData.profList;
              }
            }
          })
          .catch((error)=>{

          })
    },
    //被保人职业弹层
    showPopup1(){
        this.workShow1 = true;
    },
    workVal1(profName,profCode){
        this.jobValue1 = profName;
        this.workShow1 = false;
        this.profCode1 = profCode;
    },
    //投保人职业
    showPopup2(){
        this.workShow2 = true;
    },
    workVal2(profName,profCode){
        this.jobValue2 = profName;
        this.workShow2 = false;
        this.profCode2 = profCode;
    },
    getInsureIntro(){
        var requestUrl = '/insurance/api/insure/findInsureFormList/'+ this.$route.query.id;
        this.$ajax({
            method:'post',
            url:requestUrl
          })
          .then((res)=>{
            if(res.data &&  res.data.code == "1"){
              //被保日期
              this.enableDate = res.data.outData.enableDate;
              //投保人
              this.insurer =  res.data.outData.insurer;
              //受益人
              this.beneficiary = res.data.outData.beneficiary;
              //紧急信息
              this.emergency = res.data.outData.emergency;
              
              //其它信息
              if(res.data.outData.otherInfo){
                this.otherInfo = res.data.outData.otherInfo;
              }
              let ableDate = res.data.outData.enableDate
              if(ableDate[0].validateRules !== ''){
                let allDate = JSON.parse(ableDate[0].validateRules).dateLimit;
                let minNum = parseInt(allDate[0]);
                let maxNum = parseInt(allDate[1]);
                this.minDate = new Date( new Date().getFullYear(),new Date().getMonth(),new Date().getDate() + minNum);
                this.maxDate = new Date( new Date().getFullYear(),new Date().getMonth(),new Date().getDate() + maxNum);
              }
  
              //被保人职业判断过滤
              res.data.outData.insured.map((data,index)=>{
                if(data.displayType == 'profCheck' && data.fieldName == 'profession'){
                  this.profession = data;                 
                }else{
                  this.insured.push(data);
                }
              })
              this.workIntro();
            }
          })
          .catch((error)=>{

          })
    },
    //身份证识别出生日期
    getCard(idCard){
      var birthday = "";  
      if(idCard != null && idCard != ""){  
          if(idCard.length == 15){  
              birthday = "19"+idCard.substr(6,6);  
          } else if(idCard.length == 18){  
              birthday = idCard.substr(6,8);  
          }
          birthday = birthday.replace(/(.{4})(.{2})/,"$1-$2-");
      }           
      return birthday;
    },
    getAge(strBirthday) {
      //根据出生日期计算年龄
      var returnAge;
      var strBirthdayArr = strBirthday.split("-");
      var birthYear = strBirthdayArr[0];
      var birthMonth = strBirthdayArr[1];
      var birthDay = strBirthdayArr[2];
      var d = new Date();
      var nowYear = d.getFullYear();
      var nowMonth = d.getMonth() + 1;
      var nowDay = d.getDate();
      if (nowYear == birthYear) {
        returnAge = 0;//同年 则为0岁  
      } else {
        var ageDiff = nowYear - birthYear; //年之差  
        if (ageDiff > 0) {
          if (nowMonth == birthMonth) {
            var dayDiff = nowDay - birthDay;//日之差  
            if (dayDiff < 0) {
              returnAge = ageDiff - 1;
            } else {
              returnAge = ageDiff;
            }
          } else {
            var monthDiff = nowMonth - birthMonth;//月之差  
            if (monthDiff < 0) {
              returnAge = ageDiff - 1;
            } else {
              returnAge = ageDiff;
            }
          }
        } else {
          returnAge = -1;//返回-1 表示出生日期输入错误 晚于今天  
        }
       }
      return returnAge;//返回周岁年龄  
   },
    getSex(certificateNum){
      //15位身份证号，倒数第一位能看出性别，男单数女双数
      //18位身份证号，倒数第二位能看出性别，男单数女双数
      var sex;
      if(certificateNum.length=='15'){
          if(parseInt(certificateNum.charAt(14)/2)*2!=certificateNum.charAt(14)){
            sex = '男';
          }else{
            sex = '女';
          }
      }else if(certificateNum.length=='18'){
        if(parseInt(certificateNum.charAt(16)/2)*2!=certificateNum.charAt(16)){
          sex = '男'
        }else{
          sex = '女'
        }
      }
      return sex;
    },
    testRules(personType,infor){
       var rule = JSON.parse(infor.validateRules);
       var ruleMsg = JSON.parse(infor.validateMsg);
       //输入值必须相同校验
       if(rule.equalTo && infor.value !=rule.equalTo){
           var toastMsg = ruleMsg.equalTo.replace(/#field/g,rule.equalTo);
           Toast(personType + infor.showName + toastMsg);
           return false;
        }
       //字符长度校验
       if(rule.maxlength && infor.value.length>rule.maxlength){
          var toastMsg = ruleMsg.maxlength.replace(/\{0\}/g,rule.maxlength);
          Toast(personType + infor.showName + toastMsg);
          return false;
       }
      if(rule.minlength && infor.value.length<rule.minlength){
         var toastMsg = ruleMsg.minlength.replace(/\{0\}/g,rule.minlength);
         Toast(personType + infor.showName + toastMsg);
         return false;
      }
      if(rule.rangelength && (infor.value.length>rule.rangelength[1] || infor.value.length<rule.rangelength[0] )){
          var toastMsg = (ruleMsg.rangelength).replace(/\{0\}/g,rule.rangelength[0]).replace(/\{1\}/g,rule.rangelength[1]);
          Toast(personType + infor.showName +  toastMsg);
          return false;
       }
       //数值大小校验
     if(rule.max && parseInt(infor.value) > rule.max){
         var toastMsg = ruleMsg.max.replace(/\{0\}/g,rule.max);
         Toast(personType + infor.showName + toastMsg);
         return false;
      }
     if(rule.min && parseInt(infor.value) <rule.min){
        var toastMsg = ruleMsg.min.replace(/\{0\}/g,rule.min);
        Toast(personType + infor.showName + toastMsg);
        return false;
     }
     if(rule.range && (parseInt(infor.value) > parseInt(rule.range[1]) || parseInt(infor.value) < parseInt(rule.range[0]) )){
         var toastMsg = (ruleMsg.range).replace(/\{0\}/g,rule.range[0]).replace(/\{1\}/g,rule.range[1]);
         Toast(personType + infor.showName + toastMsg);
         return false;
      }
      return true;

    },
    toInsure(){
      //提交信息时，投保页面投保人、被保人、受益人、订单信息这几个对象固定字段，其余的封装在扩展信息中
      //投保人固定字段
      var insurerObj =  { "insAddress": true, "insAddressnum": true,"insBirthday": true, "insCredentials": true,"insCredentialsType": true, "insEmail": true,
                           "insName": true, "insPhone": true, "insProfession": true,"insSex": true, "insWorkplace": true,"insCity":true,"insProvince":true}
      //被保人固定字段
      var insuredObj = { "address":true, "assEmail": true, "birthday": true, "certificateContent":true,"certificateType":true,"isme": true,
                          "mobile":true,"name":true,"profession": true, "relation": true,"salary": true, "sex": true,"workplace": true,"province":true,"city":true}

      //受益人固定字段
      var benefitObj = { "benefName":true, "benBirthday":true, "benCertificateContent": true,"benCertificateType": true,
                        "benMobile": true,"benRelation": true, "benSex": true}
      //订单信息固定字段(对应起保时间和紧急联系人的字段)
      var billObj = { "contactName": true, "contactTel": true, "contantEmail": true,"contantWorkPlace": true, "enableDate":true,"proId":true}
      //设置扩展信息对象
      var extentionValue = [];
      //判断起保日期为不为空
      if(!this.insureDate){
        Toast("起保日期不能为空");
        return;
      }
       //校验正则
      var phoneReg = /^1(3|4|5|6|7|8|9)\d{9}$/;
      var emailReg = /[0-9a-zA-Z_.-]+[@][0-9a-zA-Z_.-]+([.][a-zA-Z]+){1,2}/;
      var cardReg = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$|^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$/;
      //获取投保人信息
      var insurerValue ={};
      var insurerInfo = this.insurer;
      //投保人身份证男女限制
      var insurerSexLimit;
      var insurerSexMsg;
      var insurerIdNum;
      var Credentials1 = false,Credentials2 = false,Credentials3 = false,Credentials4 = false,Credentials5 = false;
      for(var i=0;i<insurerInfo.length;i++){
         if(insurerInfo[i].displayType != 'profCheck' && insurerInfo[i].displayType != 'datesel' ){
            if(insurerObj[insurerInfo[i].fieldName]){
              //如果投保人固定字段含有页面中投保人字段
              insurerValue[insurerInfo[i].fieldName] = insurerInfo[i].value;
            }else{
              extentionValue.push({"colName":insurerInfo[i].fieldName,"colValue":insurerInfo[i].value});
            }
            if(!insurerInfo[i].value && insurerInfo[i].required){
              Toast("投保人"+insurerInfo[i].showName+"不能为空");
              return;
            }
            if(insurerInfo[i].validateRules !== '' && insurerInfo[i].required){
              if(JSON.parse(insurerInfo[i].validateRules).mobile){//投保人手机校验
                if(!(phoneReg.test(insurerInfo[i].value))){
                    Toast("投保人手机号码格式有误");
                    return false;
                }
              }
              if(JSON.parse(insurerInfo[i].validateRules).email){//投保人邮箱
                  if(!(emailReg.test(insurerInfo[i].value))){
                      Toast("投保人电子邮箱格式有误");
                      return false;
                  }
              }
            }
            if(insurerInfo[i].fieldName == 'insCredentialsType'){
              if(insurerInfo[i].value === '01'){
                 Credentials1 = true;
              }
            }
            if(insurerInfo[i].fieldName == 'insCredentials' && Credentials1 && insurerInfo[i].required){//投保人身份证类型
                if(!(cardReg.test(insurerInfo[i].value))){
                    Toast("投保人身份证格式有误");
                    return false;
                }
            }
            //校验后台设定的规则
            if(insurerInfo[i].validateRules && insurerInfo[i].required){
               var testRuleResult = this.testRules('投保人信息',insurerInfo[i]);
               if(!testRuleResult){
                  return;
               }
                //获取身份证性别限制
                if(insurerInfo[i].fieldName == 'insCredentials'){
                     var rule = JSON.parse(insurerInfo[i].validateRules);
                     var ruleMsg = JSON.parse(insurerInfo[i].validateMsg);
                     if(rule.idCardSex){
                        insurerSexLimit = rule.idCardSex;
                        insurerSexMsg = ruleMsg.idCardSex;
                        insurerIdNum = insurerInfo[i].value;
                     }
                }
            }
         }
        if(insurerInfo[i].displayType == 'profCheck' && insurerInfo[i].required){
            insurerValue[insurerInfo[i].fieldName] = this.profCode2;
            if(!this.profCode2){
              Toast("投保人职业不能为空");
              return;
            }
        }
        if(insurerInfo[i].displayType == 'datesel' && insurerInfo[i].required){
            insurerValue[insurerInfo[i].fieldName] = this.insureBirthDate;
            if(!this.insureBirthDate){
              Toast("投保人出生日期不能为空");
              return;
            }
            //校验投保人后台的年龄限制
            if(insurerInfo[i].validateRules){
                var age = this.getAge(this.insureBirthDate);
                var rule = JSON.parse(insurerInfo[i].validateRules);
                var ruleMsg = JSON.parse(insurerInfo[i].validateMsg);
                if(rule.birthLimit && (age > parseInt(rule.birthLimit[1]) || age < parseInt(rule.birthLimit[0]) ) ){
                    if(parseInt(rule.birthLimit[1]) == 200){
                      Toast("投保人年龄必须大于"+parseInt(rule.birthLimit[0])+'岁');
                      return;
                    }else{
                      Toast("投保人"+ (ruleMsg.birthLimit).replace(/\{0\}/g,rule.birthLimit[0]).replace(/\{1\}/g,rule.birthLimit[1]));
                      return;
                    }
                }
            }
        }
      }
      //获取被保人信息
      var insuredValue ={};
      var insuredInfo = this.insured;
      //被保人身份证男女限制
      var insuredSexLimit;
      var insuredSexMsg;
      var insuredIdNum;
      for(var i=0;i<insuredInfo.length;i++){
         if(insuredInfo[i].displayType != 'datesel'){
           if(insuredObj[insuredInfo[i].fieldName]){
             //如果被保人固定字段含有页面中被保人字段
             insuredValue[insuredInfo[i].fieldName] = insuredInfo[i].value;
           }else{
             extentionValue.push({"colName":insuredInfo[i].fieldName,"colValue":insuredInfo[i].value});

           }
            if(!insuredInfo[i].value && this.insuredShow && insuredInfo[i].required){
              Toast("被保人"+insuredInfo[i].showName+"不能为空");
              return;
            }
            if(insuredInfo[i].validateRules !== '' && this.insuredShow && insuredInfo[i].required){
              if(JSON.parse(insuredInfo[i].validateRules).mobile){//被保人手机校验
                if(!(phoneReg.test(insuredInfo[i].value))){
                    Toast("被保人手机号码格式有误");
                    return false;
                }
              }
              if(JSON.parse(insuredInfo[i].validateRules).email){//被保人邮箱
                  if(!(emailReg.test(insuredInfo[i].value))){
                      Toast("被保人电子邮箱格式有误");
                      return false;
                  }
              }
            }
            if(insuredInfo[i].fieldName == 'certificateType'){
              if(insuredInfo[i].value === '01'){
                 Credentials2 = true;
              }
            }
            if(insuredInfo[i].fieldName == 'certificateContent' && Credentials2 && this.insuredShow && insuredInfo[i].required){//被保人身份证类型
                if(!(cardReg.test(insuredInfo[i].value))){
                    Toast("被保人身份证格式有误");
                    return false;
                }
            }
             //校验后台设定的规则
            if(insuredInfo[i].validateRules && this.insuredShow && insuredInfo[i].required){
               var testRuleResult = this.testRules('被保人信息',insuredInfo[i]);
               if(!testRuleResult){
                  return;
                }
                //获取身份证性别限制
                if(insuredInfo[i].fieldName == 'certificateContent'){
                     var rule = JSON.parse(insuredInfo[i].validateRules);
                     var ruleMsg = JSON.parse(insuredInfo[i].validateMsg);
                     if(rule.idCardSex){
                        insuredSexLimit = rule.idCardSex;
                        insuredSexMsg = ruleMsg.idCardSex;
                        insuredIdNum = insuredInfo[i].value;
                     }
                }


            }
         }
        if(insuredInfo[i].displayType == 'datesel' && insuredInfo[i].required){
          if(this.insuredShow){
            insuredValue[insuredInfo[i].fieldName] = this.insuredBirthDate;
            if(!this.insuredBirthDate){
              Toast("被保人出生日期不能为空");
              return;
            }
            //校验被保人后台的年龄限制
            if(insuredInfo[i].validateRules){
                var age = this.getAge(this.insuredBirthDate);
                var rule = JSON.parse(insuredInfo[i].validateRules);
                var ruleMsg = JSON.parse(insuredInfo[i].validateMsg);
                if(rule.birthLimit && (age > parseInt(rule.birthLimit[1]) || age < parseInt(rule.birthLimit[0]) ) ){
                  if(parseInt(rule.birthLimit[1]) == 200){
                      Toast("被保人年龄必须大于"+parseInt(rule.birthLimit[0])+'岁');
                      return;
                    }else{
                      Toast("被保人"+ (ruleMsg.birthLimit).replace(/\{0\}/g,rule.birthLimit[0]).replace(/\{1\}/g,rule.birthLimit[1]));
                      return;
                    }
                }
            }
          }else{
            //被保人是本人后台的年龄限制
            if(insuredInfo[i].validateRules){               
                var age = this.getAge(this.insureBirthDate);
                var rule = JSON.parse(insuredInfo[i].validateRules);
                var ruleMsg = JSON.parse(insuredInfo[i].validateMsg);
                if(rule.birthLimit && (age > parseInt(rule.birthLimit[1]) || age < parseInt(rule.birthLimit[0]) ) ){
                  if(parseInt(rule.birthLimit[1]) == 200){
                      Toast("被保人年龄必须大于"+parseInt(rule.birthLimit[0])+'岁');
                      return;
                    }else{
                      Toast("被保人"+ (ruleMsg.birthLimit).replace(/\{0\}/g,rule.birthLimit[0]).replace(/\{1\}/g,rule.birthLimit[1]));
                      return;
                    }
                }
            }
          }
        }
      }
      if(this.profession.displayType == 'profCheck' && this.profession.required){
            insuredValue[this.profession.fieldName] = this.profCode1;
            if(!this.profCode1){
              Toast("被保人职业不能为空");
              return;
            }
        }
      //获取受益人信息
      var beneficiaryValue ={};
      var beneficiaryInfo = this.beneficiary;
      if(beneficiaryInfo){
        for(var i=0;i<beneficiaryInfo.length;i++){
           if(beneficiaryInfo[i].displayType != 'profCheck' && beneficiaryInfo[i].displayType != 'datesel' ){
              if(benefitObj[beneficiaryInfo[i].fieldName]){
                 //如果受益人固定字段含有页面中受益人字段
                 beneficiaryValue[beneficiaryInfo[i].fieldName] = beneficiaryInfo[i].value;
               }else{
                  extentionValue.push({"colName":beneficiaryInfo[i].fieldName,"colValue":beneficiaryInfo[i].value});
               }
              if(!beneficiaryInfo[i].value && beneficiaryInfo[i].required){
                Toast("受益人"+beneficiaryInfo[i].showName+"不能为空");
                return;
              }
              if(beneficiaryInfo[i].validateRules !== '' && beneficiaryInfo[i].required){
              if(JSON.parse(beneficiaryInfo[i].validateRules).mobile){//受益人手机校验
                if(!(phoneReg.test(beneficiaryInfo[i].value))){
                    Toast("受益人手机号码格式有误");
                    return false;
                }
              }
              if(JSON.parse(beneficiaryInfo[i].validateRules).email){//受益人邮箱
                  if(!(emailReg.test(beneficiaryInfo[i].value))){
                      Toast("受益人电子邮箱格式有误");
                      return false;
                  }
              }
            }
            if(beneficiaryInfo[i].fieldName == 'benCertificateType'){
              if(beneficiaryInfo[i].value === '01'){
                 Credentials5 = true;
              }
            }
            if(beneficiaryInfo[i].fieldName == 'benCertificateContent' && Credentials5 && beneficiaryInfo[i].required){//受益人身份证类型
                if(!(cardReg.test(beneficiaryInfo[i].value))){
                    Toast("受益人身份证格式有误");
                    return false;
                }
            }
              //校验后台设定的规则
              if(beneficiaryInfo[i].validateRules && beneficiaryInfo[i].required){
                 var testRuleResult = this.testRules('受益人信息',beneficiaryInfo[i]);
                 if(!testRuleResult){
                   return;
                 }
              }
           }
        }
      }
      //校验投保人身份证的男女性别是否与后台限制的一致
      if(insurerSexLimit){
        if(insurerValue.insCredentialsType === "01"){
          var insurerSex = this.getSex(insurerValue.insCredentials);
          if(insurerSexLimit != insurerSex){
            Toast("投保人"+ insurerSexMsg.replace(/\{0\}/g,insurerSexLimit));
            return;
          }
        }
      }
      //校验被保人身份证的男女性别是否与后台限制的一致
      if(insuredSexLimit){
        if(insuredValue.certificateType === "01"){
          var insuredSex = this.getSex(insuredValue.certificateContent);
          if(insuredSexLimit != insuredSex){
            Toast("被保人"+ insuredSexMsg.replace(/\{0\}/g,insuredSexLimit));
            return;
          }
        }
      }
      //紧急联系人和起保日期
      var insBillParam = {};
      var emergencyInfo = this.emergency;
      insBillParam["enableDate"] = this.insureDate;
      insBillParam["proId"] = parseInt(this.$route.query.id);
      if(emergencyInfo){
        for(var i=0;i<emergencyInfo.length;i++){
           if(emergencyInfo[i].displayType != 'profCheck' && emergencyInfo[i].displayType != 'datesel' ){
              if(billObj[emergencyInfo[i].fieldName]){
                 //如果订单信息固定字段含有页面中紧急联系人字段
                 insBillParam[emergencyInfo[i].fieldName] = emergencyInfo[i].value;
               }else{
                 extentionValue.push({"colName":emergencyInfo[i].fieldName,"colValue":emergencyInfo[i].value});
               }
              if(!emergencyInfo[i].value && emergencyInfo[i].required){
                Toast("紧急联系人"+emergencyInfo[i].showName+"不能为空");
                return;
              }
              if(emergencyInfo[i].validateRules !== '' && emergencyInfo[i].required){
                if(JSON.parse(emergencyInfo[i].validateRules).mobile){//紧急联系人手机校验
                  if(!(phoneReg.test(emergencyInfo[i].value))){
                      Toast("紧急联系人手机号码格式有误");
                      return false;
                  }
                }
                if(JSON.parse(emergencyInfo[i].validateRules).email){//紧急联系人邮箱
                    if(!(emailReg.test(emergencyInfo[i].value))){
                        Toast("紧急联系人电子邮箱格式有误");
                        return false;
                    }
                }
              }
              // if(emergencyInfo[i].fieldName == 'insCredentialsType'){
              //   if(emergencyInfo[i].value === '01'){
              //     Credentials3 = true;
              //   }
              // }
              // if(emergencyInfo[i].fieldName == 'insCredentials' && Credentials3){//紧急联系人身份证类型
              //     if(!(cardReg.test(emergencyInfo[i].value))){
              //         Toast("紧急联系人身份证格式有误");
              //         return false;
              //     }
              // }
              //校验后台设定的规则
              if(emergencyInfo[i].validateRules && emergencyInfo[i].required){
                 var testRuleResult = this.testRules('紧急联系人',emergencyInfo[i]);
                 if(!testRuleResult){
                    return;
                  }
              }
           }
        }
      }
      //其它信息
      var otherInfo = this.otherInfo;
      if(otherInfo){
        for(var i=0;i<otherInfo.length;i++){
           if(otherInfo[i].displayType != 'profCheck' && otherInfo[i].displayType != 'datesel' ){

              extentionValue.push({"colName":otherInfo[i].fieldName,"colValue":otherInfo[i].value});
              if(!otherInfo[i].value && otherInfo[i].required){
                Toast("其它信息"+otherInfo[i].showName+"不能为空");
                return;
              }
              if(otherInfo[i].validateRules !== '' && otherInfo[i].required){
                if(JSON.parse(otherInfo[i].validateRules).mobile){//其它信息手机校验
                  if(!(phoneReg.test(otherInfo[i].value))){
                      Toast("其它信息手机号码格式有误");
                      return false;
                  }
                }
                if(JSON.parse(otherInfo[i].validateRules).email){//其它信息邮箱
                    if(!(emailReg.test(otherInfo[i].value))){
                        Toast("其它信息电子邮箱格式有误");
                        return false;
                    }
                }
              }
              // if(otherInfo[i].fieldName == 'insCredentialsType'){
              //   if(otherInfo[i].value === '01'){
              //     Credentials4 = true;
              //   }
              // }
              // if(otherInfo[i].fieldName == 'insCredentials' && Credentials4){//其它信息身份证类型
              //     if(!(cardReg.test(otherInfo[i].value))){
              //         Toast("其它信息身份证格式有误");
              //         return false;
              //     }
              // }
              //校验后台设定的规则
              if(otherInfo[i].validateRules && otherInfo[i].required){
                 var testRuleResult = this.testRules('其它信息',otherInfo[i]);
                 if(!testRuleResult){
                   return;
                 }
              }
           }
        }
      }
      //产品信息
      var productInfo = JSON.parse(localStorage.getItem('productVal'));
      var assuredListParam = [];
      assuredListParam.push(insuredValue);
      var insurerParam = {};
      insurerParam = insurerValue;
      var beneficiaryListParam = [];
      beneficiaryListParam.push(beneficiaryValue);
      var productPriceVoParam = productInfo ;
      this.$ajax({
          method:'post',
          url:'/insurance/api/insure/saveBillSubmitForm',
          data:{
                assuredList:assuredListParam,
                insurer:insurerParam,
                beneficiaryList:beneficiaryListParam,
                extentionList:extentionValue,
                insBill:insBillParam,
                productPriceVo:productPriceVoParam}
        })
        .then((res)=>{
          if(res.data &&  res.data.code === 1){
              //提交成功进入订单详情页
              var orderId = res.data.outData.data.id;
              this.$router.push({path: '/orderDetail',query:{ id:orderId}});
          }else if(res.data &&  res.data.message){
              Toast(res.data.message);
          }
        })
        .catch((error)=>{

        })
    },
    //职业信息
    workIntro(){
        let codeDateType = '';
        if(JSON.stringify(this.profession) !== '{}' && this.profession.validateRules !== ''){
          codeDateType = JSON.parse(this.profession.validateRules).profLimit;
        }
        this.$ajax({
            method:'post',
            url:'/insurance/api/insure/queryProfessionByProId/' + this.$route.query.id,
            params:{
              'codeDateType':codeDateType
            }
          })
          .then((res)=>{
            if(res.data &&  res.data.code === 1){
               this.profLists = res.data.outData.profList;
            }
          })
          .catch((error)=>{

          })
    },
    jobSub1(id){
        if(this.jobShow1 == id){
            this.jobShow1 = '';
        }else{
            this.jobShow1 = id
        }
    },
    jobSub2(id){
        if(this.jobShow2 == id){
            this.jobShow2 = '';
        }else{
            this.jobShow2 = id
        }
    },
    changeProvince(validateRules,provinceValue,fldgroup){
      var queryCityData = JSON.parse(validateRules).linkLoadDate;
      var queryUrl = queryCityData[0] + '?insProvince=' + provinceValue;
      this.$ajax({
        method:'post',
        url:queryUrl
      })
      .then((res)=>{
        if(res.data &&  res.data.code === 1){
          console.log(fldgroup);
          if(fldgroup == 'insurer'){//投保人数据
            this.Citys = res.data.outData.data;
          }
          if(fldgroup == 'insured'){//被保人数据
            this.insCitys = res.data.outData.data;
          }
        }
      })
      .catch((error)=>{

      })
    }
  },
  
  mounted(){
    this.getInsureIntro();
  },
  updated(){
    // console.log(this.$refs.selectBox.selectedIndex);
  }



  }

</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.insureIntro-con .van-calendar__selected-day{
  background-color:#1a6cb4;
}
.insureIntro-con  .van-button--danger {
    color: #fff;
    background-color: #1a6cb4;
    border: 1px solid #1a6cb4;
}
.insure-wrap .van-cell{
    font-size: .4rem;
    padding:.267rem 0;
}
.insure-wrap .van-radio-group--horizontal{
    margin-top: .347rem;
}
.insure-wrap .van-radio--horizontal{
    margin:0 0 0 .32rem;
}
.insure-wrap .van-cell:not(:last-child)::after{
    border:none;
}
.insure-wrap .van-picker__cancel,.insure-wrap .van-picker__confirm{
    font-size: 0.4rem;
}
.insure-wrap .van-cell__value{
    color:#333;
}
.insure-wrap .van-cell__value{
    -webkit-box-flex: 2;
    flex: 2;
}
.insure-wrap .van-cell__right-icon{
  color:#999;
  margin-right: -3px;
}
.required-icon,.required1-icon{
  float: left;
  line-height: .68rem;
  color:#fe2f46;
  margin-left: .08rem;
}
.required1-icon{
  margin-top: .347rem;
}
</style>
