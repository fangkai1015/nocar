<template>
  <section class="insure-con">
        <header class="insure-title">非车险产品<span class="openFei" :class="{'closeFei':feiShow}" @click="feiAct"></span></header>
        <div class="banner-box">
            <img src="../../static/image/banner.jpg" alt="非车险种">
        </div>
        <van-swipe :autoplay="3000">
            <van-swipe-item v-for="(image, index) in images" :key="index">
                <img v-lazy="image.imgUrl" />
            </van-swipe-item>
        </van-swipe>
        <div class="insure-main">
            <nav class="insure-nav">
                <span  :class="active == 0 ? 'on':''"  v-on:click="changeTypeTab(0,'')" >推荐</span>
                <span :class="active == index+1 ? 'on':''"  v-for="(prodType,index) in  prodTypes"   v-on:click="changeTypeTab(index + 1,prodType)" :key="index">{{prodType}}</span>
            </nav>
            <div class="insure-list">
                <ul>
                    <li v-for="product in products" class="clearfix" v-on:click="toInsure(product.id)" :key="product.id">
                      <div class="insureList-left">
                          <img v-lazy="product.proPicUrlIndexSmall" alt="保险图片" class="insureList-img">
                          <div class="insureList-companyname">燕赵财险</div>
                        </div>
                        <div class="insureList-right">
                          <div class="insureList-name">{{product.name}}</div>
                          <div class="insureList-sum">{{product.productAdv}}</div>
                          <div class="insureList-tab">
                              <span v-for="proLabelList in product.proLabelList" :key="proLabelList.id">{{proLabelList.labelName}}</span>
                          </div>
                          <div class="insureList-action">
                              <div class="insureList-money"><span>{{product.price}}</span>元起</div>
                              <div class="insureList-btn" v-if="product.isShowFees == '1'" v-show="sxShow">手续费{{product.commissionRate}}</div>
                          </div>
                        </div>
                    </li>
                </ul>
                <div class="insureList-none">
                    <div class="none-intro">没有更多了</div>
                </div>
            </div>
        </div>

        <footer class="footer-nav">
          <div class="footerNav-item" @click="urlEnter('/entering/index.shtml')">
              <i class="footerNav-icon1"></i>
              <span class="footerNav-txt">首页</span>
          </div>
          <div class="footerNav-item"  @click="urlEnter('/entering/index_car.shtml')">
              <i class="footerNav-icon2"></i>
              <span class="footerNav-txt">车险</span>
          </div>
          <div class="footerNav-item select">
              <i class="footerNav-icon3"></i>
              <span class="footerNav-txt">非车</span>
          </div>
          <div class="footerNav-item"  @click="urlEnter('/myInfo/index.shtml')">
              <i class="footerNav-icon4"></i>
              <span class="footerNav-txt">我的</span>
          </div>
        </footer>
    </section>
</template>

<script>
import Vue from 'vue';
import { Swipe, SwipeItem } from 'vant';
import { Lazyload } from 'vant';
Vue.use(Swipe);
Vue.use(SwipeItem);
Vue.use(Lazyload);
export default {
  name: 'index',
  data () {
    return {
      images: [],
      prodTypes:[],
      products:[],
      active:0,
      feiShow:false,
      sxShow:true,
      shareCode:''
    }
  },
  methods:{
      //url判断
      urlEnter(url){
        let host = window.location.host,
        protocol = window.location.protocol;
        window.location.href = protocol +'//'+ host + url;
      },
      feiAct(){
        if(this.feiShow){
          this.feiShow = false;
          this.sxShow = true;
        }else{
          this.feiShow = true;
          this.sxShow = false;
        }
      },
      //获取轮播图
      getBanners(){
        this.$ajax({
          method:'post',
          url:'/insurance/api/index/queryBanners',
        })
        .then((res)=>{
           //console.log(res);
           if(res.data &&  res.data.code == "1"){
              this.images = res.data.outData.banners;
           }
      })
        .catch((error)=>{

        })
      },
      getProductTypes(){
        //获取产品类型tab
        this.$ajax({
        method:'post',
        url:'/insurance/api/index/productTypes'
        })
        .then((res)=>{
              if(res.data &&  res.data.code == "1"){
                 var types = res.data.outData.productTypes;
                  this.prodTypes = types;
              }
        })
        .catch((error)=>{

        })
      },
      queryInsureList(typeId){
        //获取产品列表
        var queryParams ;
        if(typeId == ''){
            queryParams = {pageNo:0,pageSize:50};
        }else{
            queryParams = {pageNo:0,pageSize:50,proTypeId:typeId};
        }
        this.$ajax({
        method:'post',
        url:'/insurance/api/index/productList',
        data:queryParams
        })
        .then((res)=>{
            if(res.data &&  res.data.code == "1"){
                this.products =  res.data.outData.products;
                this.shareCode = res.data.shareCode;
            }


        })
        .catch((error)=>{

        })
      },
      changeTypeTab(activeVal,typeId){
          this.active = activeVal;
          this.queryInsureList(typeId);

      },
      toInsure(productId){
        let uuid = encodeURIComponent(this.shareCode);
        //进入投保页面
        this.$router.push({path: `/detail/${productId}?uuid=${uuid}`});
      }
  },
  mounted() {
    this.$store.commit('updateCode','');
    this.$ajax.defaults.headers.common['visitCode'] = this.$store.state.code;
    this.getBanners();
    this.getProductTypes();
    this.queryInsureList('');
  }
}
</script>
<style>
.van-swipe-item img{
    width: 100%;
  height: 3.733rem;
}
.van-swipe__indicator{
    width: .16rem;
    height: .08rem;
    background: rgba(255,255,255);
    opacity: 0.5;
    border-radius: .04rem;
}
.van-swipe__indicator--active{
    width: .24rem;
    opacity: 1;
}
</style>
