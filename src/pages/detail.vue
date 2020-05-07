<template>
    <section class="insure-wrap">
        <headerbox :titleName="prodDetail.name">
            <span class="insure-collect" slot="collect" :class="{'collect-on':collectOk}" @click="collectOver">收藏</span>
        </headerbox>
        <div   :class="[ 'insure-detail',{ insureDetailWraper: searchBarFixed }]" >
            <img :src="prodDetail.proPicUrlIndexBig" alt="险种图" class="detail-banner">
            <div class="detail-company clearfix">
                <div class="companyLogo"><img src="../../static/image/yanz_logo.png" alt="保险公司"></div>
                <div class="companyIntro">该产品由{{insurerCompany.insurerName}}承保并负责理赔</div>
            </div>

            <div class="detail-insureBox">
                <div class="insureBox-name">{{prodDetail.name}}</div>
                <div class="insureBox-tips">适用年龄：{{prodDetail.insureAge}}</div>
                <div class="insureBox-tips">保障期限：{{prodDetail.insureTime}}</div>
            </div>

            <div class="bz-plan">
                <div class="plan-title">保障计划</div>
                <div class="plan-tab">
                    <div class="planTab-box" v-for="(combo,index) in combos" :key="combo.comboId" :class="{select:select==index}" @click="toggleTab(index,combo.comboId,combo.viewPrice,combo.priceCalcuFlag)" v-show="tabShow">{{combo.comboName}}</div>
                </div>
                <div class="plan-main" v-for="(combo,index) in combos" :key="combo.comboId" v-show="select==index">
                    <div class="plan-item">
                        <div class="plan-list" v-for="content in combo.contents" :key="content.contentId"><div class="plan-left">{{content.contentName}}</div><div class="plan-money">{{content.price}}</div></div>
                    </div>
                    <div class="plan-jb">
                        <div class="plan-allMoney">¥<span>{{priceAll}}</span></div>
                        <div class="plan-btn" @click="toConfirmInsure">立即投保</div>
                    </div>
                </div>
            </div>

            <!--悬浮导航-->
            <div id="searchBar">
              <nav :class="[{isFixed:searchBarFixed},'detail-nav']">
                  <span :class="active == 1 ? 'on':''"  @click = selectLookInfo(1)>产品介绍</span>
                  <span  :class="active == 2 ? 'on':''"  @click = selectLookInfo(2)>投保须知</span>
                  <span :class="active == 3 ? 'on':''" @click = selectLookInfo(3)>常见问题</span>
                  <span :class="active == 4 ? 'on':''" @click = selectLookInfo(4)>理赔服务</span>
              </nav>
            </div>

            <!--产品介绍-->
            <div class="produce-intro contentItem">
                <div class="intro-title title-no">产品介绍</div>
                <div class="produce-main" v-html="informations.productIntroduce">
                </div>
            </div>

            <!--投保须知-->
            <div class="insure-know contentItem">
                <div class="intro-title">投保须知</div>
                <div class="intro-box">
                    <div class="know-article" v-html="informations.hint" :class="{boxauto:autoOk}">

                    </div>
                     <div class="more-btn" ref="more1" @click="moreLook1">查看更多</div>
                </div>
            </div>

            <!--常见问题-->
            <div class="insure-question contentItem">
                <div class="intro-title">常见问题</div>
                <div class="question-con">
                    <ul class="question-list">
                        <li v-for="(questionList,index) in questionLists" :key="questionList.id" v-show="index <= listLen">
                            <div class="question-title">{{questionList.clauseQuestion}}</div>
                            <div class="question-answer">
                               {{questionList.clauseAnswer}}
                            </div>
                        </li>
                    </ul>
                    <div class="more-btn" ref="more2" @click="moreLook2">查看更多</div>
                </div>
            </div>

            <!--理赔服务-->
            <div class="insure-service contentItem">
                <div class="intro-title">理赔服务</div>
                <div class="service-box">
                    <article class="service-article" v-html="informations.compensationHint" :class="{boxauto:autoOk1}">
                    </article>
                    <div class="more-btn" ref="more3" @click="moreLook3">查看更多</div>
                </div>
            </div>
        </div>

        <footer class="detail-footer">
            <div class="detail-agress"><i class="agress-btn"  :class="{'agress-yes':agressYes}" @click="agressAct"></i><span>我已经确认并同意<a href="javascript:;" @click="tbOpen">《投保声明》</a><a href="javascript:;" @click="insureRules">《保险条款》</a></span></div>
            <div class="footer-content">
                <div class="footer-bf">¥<span>{{priceAll}}</span></div>
                <div class="tb-btn" @click="toConfirmInsure">立即投保</div>
                <div class="tb-share" @click="shareTip">
                    <i class="share-icon"></i>
                    <div class="tb-name">分享</div>
                </div>
                <div class="tb-service">
                    <a :href="phoneIntro">
                        <i class="service-icon"></i>
                        <div class="tb-name">客服</div>
                    </a>
                </div>
            </div>
        </footer>

        <div class="insure-bg" v-show="weeboxBg"></div>
        <!--弹层信息--->
        <div class="insure-weebox" :class="{'insureShow':rulesShow}">
          <div class="weebox-header">
              <!-- <span class="weebox-return"></span> -->
              <div class="weebox-title">保险条款</div>
              <span class="weebox-close" @click="rulesClose"></span>
          </div>
          <div class="weebox-con">
              <div class="weebox-list">
                  <ul>
                      <li v-for="bookList in bookLists" :key="bookList.id" @click="pdfOpen(bookList.docLink,bookList.docName)">《{{bookList.docName}}》</li>
                  </ul>
              </div>
          </div>
        </div>

        <!--投保声明-->
        <div class="insure-weebox" :class="{'insureShow':tbShow}">
          <div class="weebox-header">
              <div class="weebox-title">投保声明</div>
              <span class="weebox-close" @click="tbClose"></span>
          </div>
          <div class="weebox-con">
              <article class="weebox-article" v-html="prodDetail.declareContent">
              </article>
          </div>
        </div>

        <!--pdf样本-->
        <div class="insure-yb" :class="{'insureShow':pdfShow}">
            <header class="insure-header">
                <h3 class="insure-subtitle">{{docName}}</h3>
                <div class="yb-close" @click="pdfClose"></div>
            </header>
            <div class="yb-content">
                <pdf ref="pdf" :src="pdfUrl" v-for="i in numPages" :key="i" :page="i"></pdf>
            </div>
        </div>
        <!--投保确认--->
        <div  :class="[ 'insure-info',{ insureShow: insureConfirm}]" >
            <div class="weebox-header">
                <div class="weebox-title tb-sure">{{prodDetail.name}}</div>
                <span class="weebox-close" @click="cancelInsure"></span>
            </div>
            <div class="tbSure-box">
                <div class="tbSure-item">
                    <div class="tbSure-label">当前计划套餐：</div>
                    <div class="tbSure-right">
                        <div class="tbSure-t1">{{insureName}}</div>
                    </div>
                </div>
                <div class="tbSure-item" v-if="insureTime">
                    <div class="tbSure-label">保障期限：</div>
                    <div class="tbSure-right">
                        <span class="tbSure-btn" v-for="(insureD,index) in insureDate" :key="index" :class="{'btn-current':select1==index}" @click="sel1(index,insureD.view_time)">{{insureD.view_time}}</span>
                    </div>
                </div>
                <div class="tbSure-item" v-if="ageBelong">
                    <div class="tbSure-label">被保人年龄：</div>
                    <div class="tbSure-right">
                       <span class="tbSure-btn" v-for="(ageIntro,index) in ageList" :key="index" :class="{'btn-current':select2==index}" @click="sel2(index,ageIntro.view_age_belong)">{{ageIntro.view_age_belong}}</span>
                    </div>
                </div>
                <div class="tbSure-item" v-if="sexShow">
                    <div class="tbSure-label">性别：</div>
                    <div class="tbSure-right">
                        <span class="tbSure-sex" v-for="(sexIntro,index) in sexList" :key="index" @click="sel3(index,sexIntro.sex)"><i class="sex-sel" :class="{'sex-on':select3==index}"></i><span class="sex-name">{{sexIntro.sex}}</span></span>
                    </div>
                </div>
                <div class="tbSure-item" v-if="ele1">
                    <div class="tbSure-label">{{ele1Title}}</div>
                    <div class="tbSure-right">
                       <span class="tbSure-btn" v-for="(ele1Intro,index) in ele1List" :key="index" :class="{'btn-current':select4==index}" @click="sel4(index,ele1Intro.ele_view_1)">{{ele1Intro.ele_view_1}}</span>
                    </div>
                </div>
                <div class="tbSure-item" v-if="ele2">
                    <div class="tbSure-label">{{ele2Title}}</div>
                    <div class="tbSure-right">
                       <span class="tbSure-btn" v-for="(ele2Intro,index) in ele2List" :key="index" :class="{'btn-current':select5==index}" @click="sel5(index,ele2Intro.ele_view_2)">{{ele2Intro.ele_view_2}}</span>
                    </div>
                </div>
                <!-- <div class="tbSure-item">
                    <div class="tbSure-label">承保职业：</div>
                    <div class="tbSure-right">
                        <div class="tbSure-t1">1-3类<span class="job-enter">查询职业</span></div>
                    </div>
                </div> -->
            </div>
            <div class="tbSure-footer">
                <div class="footer-bf">¥<span>{{priceAll}}</span></div>
                <div class="tb-btn" @click="tbEnter">立即投保</div>
            </div>
        </div>

        <div class="insure-bg" v-show="fixBg"></div>
        <!---分享提示层-->
        <div class="inviteShare-weebox" v-show="shareShow">
            <div class="inviteShare-bg1"></div>
            <div class="inviteShare-know" @click="shareClose">我知道了</div>
        </div>
    </section>
</template>
<script>
import Vue from 'vue';
import pdf from 'vue-pdf'
import { Toast } from 'vant';
Vue.use(Toast);
import headerbox from '../components/headerbox'
export default {
  name:'detail',
  data(){
    return{
      searchBarFixed:false,
      active:1,
      select:0,
      select1:0,
      select2:0,
      select3:0,
      select4:0,
      select5:0,
      insureConfirm:false,
      weeboxBg:false,
      autoOk:false,
      autoOk1:false,
      collectOk:false,
      prodDetail:{},
      insurerCompany:{},
      informations:{},
      questionLists:[],
      defaulePrice:{},
      phoneIntro:'',
      combos:[],
      listLen:1,
      listAll:'',
      comboId:'',
      insureName:'',
      priceAll:'',
      agressYes:true,//是否同意协议
      rulesShow:false,//条款弹层
      insureTime:false,//保证日期显示
      insureDate:[],//保证期限
      ageBelong:false,//被保人年龄
      ageList:[],//被保人年龄范围
      sexList:[],//性别
      sexShow:false,//性别显示
      ele1:false,//模块一显示
      ele1Title:'',//模块一名字
      ele1List:[],//模块一内容
      ele2:false,//模块一显示
      ele2Title:'',//模块一名字
      ele2List:[],//模块一内容
      viewTime:'',//期限传值
      viewAgeBelong:'',//年纪传值
      sex:'',//性别传值
      eleView1:'',//模块一传值
      eleView2:'',//模块二传值
      tabShow:false,//是否显示tab
      bookLists:[],//保险条款
      hostUrl:'',//host地址
      docName:'',//文档题目
      pdfShow:false, //pdf文档显示
      pdfUrl:'',//pdf路径
      numPages:'',//pdf页数
      tbShow:false,//投保声明
      priceCalcuFlag:true,//保费对比是否显示
      health:false,//需健康告知提示
      priceId:'',//价格id号
      fixBg:false,
      shareShow:false
    }
  },
  components:{
        'headerbox': headerbox,
        'pdf':pdf
   },
  methods:{
      //tab切换
      toggleTab(index,comboId,price,priceCalcuFlag){
          this.select=index;
          this.priceAll = price;
          this.priceCalcuFlag = priceCalcuFlag;
          this.comboId = comboId;
          this.insureIntro(comboId);
      },
      //协议确定
      agressAct(){
          if(this.agressYes){
              this.agressYes = false;
          }else{
              this.agressYes = true;
          }
      },
      //保险条款弹层
      insureRules(){
          this.rulesShow = true;
          this.weeboxBg = true;
      },
      //保险条款关闭
      rulesClose(){
          this.rulesShow = false;
          this.weeboxBg = false;
      },
      //打开对应pdf
      pdfOpen(url,name){
          this.pdfShow = true;
          this.docName = name;
          let loadingTask = pdf.createLoadingTask(this.hostUrl + url)
          this.pdfUrl = loadingTask;
          this.pdfUrl.then(pdf => {
            this.numPages = pdf.numPages;
        });
      },
      //关闭pdf
      pdfClose(){
          this.pdfShow = false;
      },
      //投保声明打开
      tbOpen(){
          this.tbShow = true;
          this.weeboxBg = true;
      },
      //投保声明关闭
      tbClose(){
          this.tbShow = false;
          this.weeboxBg = false;
      },
      shareTip(){
          this.fixBg = true;
          this.shareShow = true;
      },
      shareClose(){
          this.fixBg = false;
          this.shareShow = false;
      },
    //投保确认
    toConfirmInsure(){
        if(!this.agressYes){
            Toast('请先确认协议再投保');
            return;
        }
        let productIntro = {
              comboId: this.comboId,
              eleView1: this.eleView1,
              eleView2: this.eleView2,
              proId: parseInt(this.$route.params.id),
              sex: this.sex,
              viewAgeBelong: this.viewAgeBelong,
              viewTime: this.viewTime,
              priceId: this.priceId
          }
        localStorage.setItem('productVal',JSON.stringify(productIntro));
        if(this.agressYes && this.priceCalcuFlag){
            this.insureConfirm = true;
            this.weeboxBg = true;
        }else if(this.health){
            //进入健康告知页面
            this.$router.push({path: '/health',query:{ id:this.$route.params.id}});
        }else{         
          //进入填写投保信息页面
          this.$router.push({path: '/insureIntro',query:{ id:this.$route.params.id}});
        }
    },
    //立即投保
    tbEnter(){
        if(this.priceAll === ''){
            Toast('未匹配到价格无法进行投保');
            return;
        }
        let productIntro = {
                comboId: this.comboId,
                eleView1: this.eleView1,
                eleView2: this.eleView2,
                proId: parseInt(this.$route.params.id),
                sex: this.sex,
                viewAgeBelong: this.viewAgeBelong,
                viewTime: this.viewTime,
                priceId: this.priceId
            }
        localStorage.setItem('productVal',JSON.stringify(productIntro));
        if(this.health){
            //进入健康告知页面
            this.$router.push({path: '/health',query:{ id:this.$route.params.id}});
        }else{        
        //进入填写投保信息页面
          this.$router.push({path: '/insureIntro',query:{ id:this.$route.params.id}});
        }
    },
    cancelInsure(){
      this.insureConfirm = false;
      this.weeboxBg = false;
    },
    //投保须知展开
    moreLook1(){
        if(!this.autoOk){
            this.autoOk = true;
            this.$refs.more1.innerHTML = '收起更多';
        }else{
           this.autoOk = false;
            this.$refs.more1.innerHTML = '查看更多';
        }
    },
    //常见问题展开
    moreLook2(){
        if(this.listLen == 1){
            this.listLen = this.listAll;
            this.$refs.more2.innerHTML = '收起更多';
        }else{
            this.listLen = 1;
            this.$refs.more2.innerHTML = '查看更多';
        }
    },
    //理赔须知展开
    moreLook3(){
        if(!this.autoOk1){
            this.autoOk1 = true;
            this.$refs.more3.innerHTML = '收起更多';
        }else{
           this.autoOk1 = false;
            this.$refs.more3.innerHTML = '查看更多';
        }
    },
    //点击收藏险种
    collectOver(){
        if(!this.collectOk){
            //收藏险种
            this.$ajax({
                method:'post',
                url:'/insurance/api/userCollect/addUserCollect/'+ this.$route.params.id
            })
            .then((res)=>{
                if(res.data &&  res.data.code === 1){
                    this.collectOk = true;
                    Toast('收藏成功');
                }else{
                    Toast(res.data.message);
                }
            })
            .catch((error)=>{
                 Toast('收藏功能异常');
            })
        }else{
            //取消收藏
             this.$ajax({
                method:'post',
                url:'/insurance/api/userCollect/delUserCollect/'+ this.$route.params.id
            })
            .then((res)=>{
                if(res.data &&  res.data.code === 1){
                    this.collectOk = false;
                    Toast('取消成功');
                }else{
                    Toast(res.data.message);
                }
            })
            .catch((error)=>{
                 Toast('收藏功能异常');
            })
        }
    },
    //保障期限选择
    sel1(index,time){
        this.select1 = index;
        this.viewTime = time;
        this.priceChange(time,'','','','')
    },
    //年纪选择
    sel2(index,age){
        this.select2 = index;
        this.viewAgeBelong = age;
        this.priceChange('',age,'','','')
    },
    //性别选择
    sel3(index,sex){
        this.select3 = index;
        this.sex = sex;
        this.priceChange('','',sex,'','')
    },
    //模块一选择
    sel4(index,ele1){
        this.select4 = index;
        this.eleView1 = ele1;
        this.priceChange('','','',ele1,'')
    },
    //模块二选择
    sel5(index,ele2){
        this.select5 = index;
        this.eleView2 = ele2;
        this.priceChange('','','','',ele2)
    },
    //页面滚动触发的方法
    handleScroll () {
      // windowHeight是可视区的高度
      var windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
      // scrollHeight是滚动条的总高度
      var scrollHeight = document.documentElement.scrollHeight||document.body.scrollHeight;
      // scrollTop是滚动条滚动时，距离顶部的距离
      var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;


      var offsetTop = document.querySelector('#searchBar').offsetTop;
      if (scrollTop >= offsetTop) {
      this.searchBarFixed = true
      } else {
      this.searchBarFixed = false
      }
      var arrDom = document.getElementsByClassName("contentItem");
       for (var i = 0; i < arrDom.length; i++) {
           //因为下面使用到了i+1，所以需要把最后一个分离出来判断,还有最后一个内容量小，滚动条到底部
           if( arrDom[arrDom.length-1].offsetTop-scrollTop <=0 ||  scrollTop+windowHeight==scrollHeight){
              this.active = arrDom.length;
           }else{
              if(arrDom[i].offsetTop-scrollTop<=0 && arrDom[i+1].offsetTop-scrollTop>0){
                this.active = i+1;
             }
           }
       }
    },
    //保险详情页产品及案例介绍等tab切换
    selectLookInfo(index){
      this.searchBarFixed = true;
      this.active  = index;
      var arrDom = document.getElementsByClassName("contentItem");
      document.documentElement.scrollTop = arrDom[index -1].offsetTop;
    },
    //查询产品详情
    queryProductDetail(id){
      this.$ajax({
          headers: { 'Content-Type': 'application/json'},
          method:'get',
          url:'/insurance/api/product/details',
          params:{
              productId:id
            }
        })
        .then((res)=>{
          if(res.data &&  res.data.code === 1){
              this.prodDetail = res.data.outData.product;
              this.bookLists = res.data.outData.bookList;
              this.hostUrl = res.data.outData.productFileServer;
              this.insurerCompany = res.data.outData.insurer;
              this.combos = res.data.outData.combos;
              this.informations = res.data.outData.information;
              this.questionLists = res.data.outData.questionList;
              this.listAll = res.data.outData.questionList.length;
              this.phoneIntro = 'tel:' + this.insurerCompany.telephone;
              if(res.data.outData.preContent){
                  this.health = true;
                  localStorage.setItem('healthContent',res.data.outData.preContent);
              }else{
                   this.health = false;
              }
              this.combos.map((data,i) =>{
                  if(i === 0){
                      this.comboId = data.comboId
                     this.insureIntro(this.comboId);
                     this.priceAll = data.viewPrice;
                     this.priceCalcuFlag = data.priceCalcuFlag;
                  }
              })
              if(this.combos.length > 1){
                  this.tabShow = true;
              }
              //收藏显示
              if(res.data.outData.collectFlag){
                  this.collectOk = true;
              }
          }
        })
        .catch((error)=>{

        })
    },
    //获取套餐联动价格字段配置
    insureIntro(cId){
        this.$ajax({
            method:'post',
            url:'/insurance/api/insure/queryInsProductPriceDistinctItemByCombId/'+ this.$route.params.id + '/' + cId
        })
        .then((res)=>{
            if(res.data &&  res.data.code === 1){
                 this.defaulePrice = res.data.outData.defaulePrice;
                 this.insureName = res.data.outData.comboInfo.comboName;
                 this.viewTime = this.defaulePrice.viewTime || '';
                 this.viewAgeBelong = this.defaulePrice.viewAgeBelong || '';
                 this.sex = this.defaulePrice.sex || '';
                 this.eleView1 = this.defaulePrice.eleView1 || '';
                 this.eleView2 = this.defaulePrice.eleView2 || '';
                 this.comboId = this.defaulePrice.comboId;
                 //保障期限
                 if(res.data.outData.insureTimeList){
                     this.insureTime = true;
                     this.insureDate = res.data.outData.insureTimeList;
                     this.insureDate.map((data,i) => {
                         if(data.view_time == this.defaulePrice.viewTime){
                             this.select1 = i;
                         }
                     })
                 }else{
                      this.insureTime = false;
                 }
                 //投保人年龄
                 if(res.data.outData.ageBelongList){
                     this.ageBelong = true;
                     this.ageList = res.data.outData.ageBelongList;
                     this.ageList.map((data,i) => {
                         if(data.view_age_belong == this.defaulePrice.viewAgeBelong){
                             this.select2 = i;
                         }
                     })
                 }else{
                      this.ageBelong = false;
                 }
                //性别
                if(res.data.outData.sexList){
                    this.sexShow = true;
                    this.sexList = res.data.outData.sexList;
                    this.sexList.map((data,i) => {
                         if(data.sex == this.defaulePrice.sex){
                             this.select3 = i;
                         }
                    })
                }else{
                   this.sexShow = false;
                }
                //模块1
                if(res.data.outData.ele1List){
                    this.ele1 = true;
                    this.ele1List = res.data.outData.ele1List;
                    this.ele1List.map((data,i) => {
                         if(data.ele_view_1 == this.defaulePrice.eleView1){
                             this.select4 = i;
                             this.ele1Title = data.ele_1;
                         }
                    })
                }else{
                    this.ele1 = false;
                }
                //模块2
                if(res.data.outData.ele2List){
                    this.ele2 = true;
                    this.ele2List = res.data.outData.ele2List;
                    this.ele2List.map((data,i) => {
                         if(data.ele_view_2 == this.defaulePrice.eleView2){
                             this.select5 = i;
                             this.ele2Title = data.ele_2;
                         }
                    })
                }else{
                    this.ele2 = false;
                }
            }
        })
        .catch((error)=>{
        })
    },
    priceChange(time,age,sex,ele1,ele2){

        time = time || this.viewTime;
        age = age || this.viewAgeBelong;
        sex = sex || this.sex;
        ele1 = ele1 || this.eleView1;
        ele2 = ele2 || this.eleView2;
        this.$ajax({
            method:'post',
            url:'/insurance/api/insure/findProductPriceByKeys',
            data:{
                comboId:this.comboId,
                proId:this.defaulePrice.proId,
                viewTime:time,
                viewAgeBelong:age,
                sex:sex,
                eleView1:ele1,
                eleView2:ele2
            }
        })
        .then((res)=>{
            if(res.data &&  res.data.code === 1){
                let priceCon = res.data.outData.priceInfo;
                if(priceCon){
                    this.priceAll =  priceCon.price;
                    this.priceId = priceCon.id;
                }else{
                     this.priceAll =  '';
                     this.priceId = '';
                     Toast(res.data.message);
                }
            }
        })
        .catch((error)=>{
        })
    },
    //分享接口
    wxShare(){
        this.$ajax({
            method:'post',
            url:'/insurance/api/weidian/wxShare',
            params:{
                url:window.location.href
            }
        })
        .then((res)=>{
            if(res.data &&  res.data.code === 1){
                this.wxBox(res.data.outData);
            }
        })
        .catch((error)=>{

        })
    },
    //分享信息
    wxBox(data){
        let shareTitle = '燕赵财险',
            shareDesc = '燕赵财险为您提供一份保障、一份健康';
        this.wx.config({
        debug: false, 
        appId: data.appId, // 必填，公众号的唯一标识
        timestamp: data.timeStamp, // 必填，生成签名的时间戳
        nonceStr: data.nonceStr, // 必填，生成签名的随机串
        signature: data.signature,// 必填，签名
        jsApiList: ['updateAppMessageShareData','updateTimelineShareData'] // 必填，需要使用的JS接口列表
        });
        this.wx.ready(function () { 
            this.wx.updateAppMessageShareData({ 
                title: shareTitle, // 分享标题
                desc: shareDesc, // 分享描述
                link: data.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                imgUrl: '../../static/image/company_logo.png', // 分享图标
                success: function () {
                // 设置成功
                }
            })
            this.wx.updateTimelineShareData({ 
                title: shareTitle, // 分享标题
                link: data.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                imgUrl: '../../static/image/company_logo.png', // 分享图标
                success: function () {
                // 设置成功
                }
            })
        });
    },
    userCheck(){
        if(this.$route.query.uuid){
            let uuid = this.$route.query.uuid
            this.$ajax({
                method:'post',
                url:'/insurance/api/user/queryShareSign',
                headers: {
                    'uuid': uuid
                }
            })
            .then((res)=>{
                if(res.data &&  res.data.code === 1){
                }
            })
            .catch((error)=>{

            })
        }
    }
  },
  mounted () {
    window.addEventListener('scroll', this.handleScroll);
    this.queryProductDetail(this.$route.params.id);
    this.wxShare();
    this.userCheck();
  },
  destroyed(){
    window.removeEventListener('scroll', this.handleScroll);
   }

}


</script>
