<template>
    <section class="shop-wrap">
         <headerbox :titleName="insureTitle">
        </headerbox>
        <div class="shop-con">
            <div class="shop-box">
                <img src="../../static/image/shop_banner.jpg" alt="我的微店" class="shop-banner">
                <div class="shop-content">
                    <div class="shop-user">
                        <div class="shopUser-pic" v-if="shopContent.wdLogo"><img :src="shopContent.wdLogo" alt="头像" class="shopUser-img"></div>
                        <div class="shopUser-pic" v-else><img src="../../static/image/default.png" alt="头像" class="shopUser-img"></div>
                        <div class="shopUser-intro">
                            <div class="shopUser-name">{{shopName}}<span class="shareCount">分享次数：{{shopContent.shareNum}}</span><span class="lookCount">访问量：{{shopContent.visitNum}}</span></div>
                            <div class="shopUser-count">
                                <span class="seekBtn" @click="seekIntro">保险咨询</span>
                                <span class="shareBtn" @click="shareIntro">分享店铺</span>
                            </div>
                        </div>
                    </div>

                    <div class="shop-produce">
                        <nav class="shop-nav">
                            <span v-for="(proTypeLists,index) in shopContent.proTypeList" :key="index" :class="{'on':current == index}" @click="proList(index,proTypeLists.level1_name)">{{proTypeLists.level1_name}}</span>
                        </nav>
                        <div class="produce-list">
                            <ul>
                                <li v-for="product in products" :key="product.id" @click="productEnter(product.id)">
                                    <img v-lazy="product.proPicUrl" alt="产品图" class="produce-img">
                                    <div class="produce-name">{{product.name}}</div>
                                    <div class="produce-tip">{{product.productAdv}}</div>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div class="produce-empty" v-if="emptyShow">
                        <span class="produceNone-icon"></span>
                        <div class="produceNone-txt">您暂未收藏产品</div>
                        <div class="produceEnter" @click="collect">去收藏</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="insure-bg" v-show="fixBg"></div>
        <!---分享提示层-->
        <div class="inviteShare-weebox" v-show="shareShow">
            <div class="inviteShare-bg2"></div>
            <div class="inviteShare-know" @click="shareClose">我知道了</div>
        </div>

        <!--咨询弹窗-->
        <div class="seek-weebox" v-show="seekShow">
            <div class="seek-close" @click="seekClose"></div>
            <div class="seek-user">
                <div class="seekUser-pic"><img :src="shopContent.wdLogo || '/static/image/default.png'"></div>
                <div class="seekUser-name">{{userName}}</div>
            </div>
            <div class="seek-item">
                <ul>
                    <li>
                        <span class="seek-icon1"></span><span class="seek-sum">{{companyName}}</span>
                    </li>
                    <li>
                        <span class="seek-icon2"></span><span class="seek-sum">{{phone}}</span><span class="seek-enter"><a :href="'tel:' + phone">保险咨询</a></span>
                    </li>
                    <li>
                        <span class="seek-icon3"></span><span class="seek-sum">{{wxCon}}</span>
                    </li>
                </ul>
            </div>
        </div>
    </section>
</template>

<script>
import Vue from 'vue';
import { Lazyload } from 'vant';
Vue.use(Lazyload);
import headerbox from '../components/headerbox'
export default {
  name: 'myShop',
  components:{
        'headerbox': headerbox
   },
    data () {
        return {
            insureTitle:'我的微店',
            proName:'',
            current:0,
            shopContent:{},//微店信息
            userContent:{},//用户信息
            shopName:'',//微店名称
            products:[],//产品列表
            fixBg:false,
            shareShow:false,
            seekShow:false,
            emptyShow:false,
            userName:'',//用户姓名
            companyName:'',//公司姓名
            phone:'',//手机号码
            wxCon:''//微信号
        }
    },
    methods: {
        //进去产品列表
        collect(){
            this.$router.push({path: '/'});
        },
        shopIntro(){
            this.$ajax({
                method:'post',
                url:'/insurance/api/weidian/weidianIndex'
            })
            .then((res)=>{
                if(res.data &&  res.data.code === 1){
                    this.shopContent = res.data.outData;
                    let name;
                    if(res.data.outData.wdName){
                        name = res.data.outData.wdName;
                    }else if(res.data.outData.realName){
                        name = res.data.outData.realName + '微店'
                    }else{
                        name = res.data.outData.nickName + '微店';
                    }
                    this.shopName = name;
                    if(!this.shopContent.proTypeList){
                        this.emptyShow = true;
                    }
                    this.shopContent.proTypeList.map((data,i) => {
                        if(i===0){
                            this.proName = data.level1_name;
                            this.listIntro(this.proName);//默认加载第一条险种数据
                        }
                    })
                }
            })
            .catch((error)=>{

            })
        },
        proList(id,name){
            this.current = id;
            this.listIntro(name);
        },
        //产品列表
        listIntro(name){
             this.$ajax({
                method:'post',
                url:'/insurance/api/weidian/productList',
                data:{
                    pageNo:0,
                    pageSize:50,
                    proTypeId:name
                }
            })
            .then((res)=>{
                if(res.data &&  res.data.code === 1){
                   this.products = res.data.outData.products;
                }
            })
            .catch((error)=>{

            })
        },
        //用户名片信息
        userIntro(){
            this.$ajax({
                method:'post',
                url:'/insurance/api/weidian/queryCallingInfoByUserId'
            })
            .then((res)=>{
                if(res.data &&  res.data.code === 1){
                   this.userContent = res.data.outData;
                   this.userName = this.userContent.callingInfo.name || this.userContent.realName || this.userContent.nickName;
                   this.companyName = this.userContent.callingInfo.company || '燕赵财产保险股份有限公司';
                   this.phone = this.userContent.callingInfo.mobile || this.userContent.username;
                   this.wxCon = this.userContent.callingInfo.wxAccount || '暂无';
                }
            })
            .catch((error)=>{

            })
        },
        //咨询弹窗
        seekIntro(){
            this.fixBg = true;
            this.seekShow = true;
        },
        seekClose(){
            this.fixBg = false;
            this.seekShow = false;
        },
        shareIntro(){
            this.fixBg = true;
            this.shareShow = true;
        },
        shareClose(){
            this.fixBg = false;
            this.shareShow = false;
        },
        productEnter(productId){
             //进入投保页面
            this.$router.push({path: `/detail/${productId}`});
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
        this.shopIntro();//加载微店信息
        this.userIntro();//用户名片信息
        this.wxShare();
        this.userCheck();
    }
}
</script>
<style>
    .shop-wrap .insure-bg{
        z-index: 100;
    }
</style>
