<template>
    <section class="insure-wrap">
        <headerbox :titleName="payTitle">
        </headerbox>
        <div class="pay-con">
            <div class="pay-top">
                <div class="payTop-tip">请于<span>2020-02-04 23:50</span>前完成支付，<br>否则订单将取消。</div>
                <div class="payTop-money">¥<span>{{billInfo.premium}}</span></div>
                <div class="payTop-name">{{billInfo.insProductName}}</div>
            </div>
            <div class="pay-list">
                <ul>
                    <li>
                        <span class="wx-icon"></span>
                        <div class="payList-type">微信支付</div>
                        <div class="payList-tip">推荐安装微信6.0及以上的版本使用</div>
                        <span class="pay-sel pay-on"></span>
                    </li>
                    <!-- <li>
                        <span class="zfb-icon"></span>
                        <div class="payList-type">支付宝支付</div>
                        <div class="payList-tip">推荐有支付宝账号的用户使用</div>
                        <span class="pay-sel"></span>
                    </li> -->
                </ul>
            </div>
        </div>
        <footer class="pay-footer" @click="toPay(billInfo.billId)">
            确认支付<span class="pay-money">¥<span class="pay-count">{{billInfo.premium}}</span></span>
        </footer>
        <div class="pay-bg" v-show="showQrCode"></div>
        <div class="payCode-area" v-show="showQrCode">
          <span class="pay-close" @click="closeQrCode"></span>
          <div class="code-tips">微信支付二维码</div>
          <img class="code-img" :src="payImg"/>
        </div>
    </section>
</template>
<script>
import Vue from 'vue';
import { Toast } from 'vant';
Vue.use(Toast);
import headerbox from '../components/headerbox'
export default {
  name: 'pay',
  data () {
    return {
      payTitle:'支付',
      billInfo:{},
      showQrCode:false,
      payImg:'',
      timer:'',
      stateCode:''
    }
  },
  components:{
      'headerbox': headerbox
   },
  methods:{
    getOrderDetail(){
      this.$ajax({
        method:'post',
        url:'/insurance/api/order/queryUserBillInfoById/' + this.$route.query.billId
      })
      .then((res)=>{
        if(res.data &&  res.data.code === 1){
           this.billInfo = res.data.outData.billInfo;
           this.stateCode = res.data.outData.billInfo.billState;
           this.timer = setInterval(this.loadOrderState,5000);
        }
      })
       .catch((error)=>{

       })
     },
     loadOrderState(){
         this.$ajax({
             method:'post',
             url:'/insurance/api/order/loadInsBillStateInfo/' + this.$route.query.billId
           })
           .then((res)=>{
              if(res.data &&  res.data.code == 1){
                  var currentCode =  res.data.outData.billState;
                  if( this.stateCode != currentCode){
                      //如果状态发生变化
                      clearInterval(this.timer);
                      //进入订单详情
                      this.$router.push({path: '/orderDetail',query:{ id:this.$route.query.billId}});
                  }
              }
           })
           .catch((error)=>{

           })
      },
     toPay(billId){
       Toast.loading({
          message: '正在生成支付二维码...',
          forbidClick: true,
          loadingType: 'spinner'
      });
       var payRequestUrl = '/insurance/api/pay/qrPayment?billId='+billId;
       this.$ajax({
          headers: { 'Content-Type': 'application/x-www-form-urlencoded'},
          method:'post',
          url:payRequestUrl
        })
        .then((res)=>{
           if(res.data &&  res.data.code == 1){
              Toast.clear();
               this.showQrCode = true;
               var payUrl = res.data.outData.codeUrl;
               var payImg = res.data.outData.codeImgUrl;
               this.payImg = payImg;
           }else if(res.data &&  res.data.code == "-1"){
               Toast(res.data.message);
           }

        })
       .catch((error)=>{

       })
     },
     closeQrCode(){
        this.showQrCode = false;
     }

  },
  mounted () {
      this.getOrderDetail();
  },
  beforeDestroy() {
    clearInterval(this.timer);
  }
}

</script>
