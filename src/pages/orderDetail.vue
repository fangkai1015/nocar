<template>
<section class="detail-page">
    <headerbox :titleName="orderTitle">
      <div class="home-box" slot="home" @click="returnHome"><van-icon name="wap-home-o"/></div>
    </headerbox>
    <div class="content-detail">
        <div class="detail-topCont">
            <div class="detail-insureName">{{billInfo.insProductName}}</div>
            <div class="detail-companyName">由{{billInfo.insurerFullName}}承保</div>
            <div class="statusSign-wrapper"></div><div  :class="['status-sign',{'small-sign':stateCode == 6}]">{{orderStatus}}</div>
        </div>
        <div class="fail-reason" v-if="stateCode == 6">核保失败原因：{{billInfo.remark}}</div>
        <div class="detail-items">
            <div class="detail-tit">基本信息</div>
            <div class="detail-item"><div class="detailItem-tit">保单号：</div><div  class="detailItem-val">{{billInfo.pfileCode || '暂无'}}</div></div>
            <div class="detail-item"><div class="detailItem-tit">订单号：</div><div  class="detailItem-val">{{billInfo.billCode || '暂无'}}</div></div>
            <div class="detail-item"><div class="detailItem-tit">生效日期：</div><div  class="detailItem-val">{{billInfo.enableDate}}</div></div>
            <div class="detail-item"><div class="detailItem-tit">终止日期：</div><div  class="detailItem-val">{{billInfo.disEnableDate}}</div></div>
            <div class="detail-item"><div class="detailItem-tit">缴费期限：</div><div  class="detailItem-val">{{billInfo.payTime}}</div></div>
            <div  class="detail-item"><div class="detailItem-tit">支付金额：</div><div  class="detailItem-val">{{billInfo.premium}}元</div></div>
        </div>
        <div class="person-info" v-for="billAssuredList in orderDetails.billAssuredList" :key="billAssuredList.id">
            <div class="person-tit">被保人信息</div>
            <div class="person-item"><div class="detailItem-tit">被保人姓名：</div><div  class="detailItem-val">{{billAssuredList.name}}</div></div>
            <div class="person-item"><div class="detailItem-tit">证件类型：</div><div  class="detailItem-val">{{billAssuredList.certificateType | getCredentialsType}}</div></div>
            <div class="person-item"><div class="detailItem-tit">证件号码：</div><div  class="detailItem-val">{{billAssuredList.certificateContent}}</div></div>
        </div>
        <div class="person-info">
            <div class="person-tit">投保人信息</div>
            <div class="person-item"><div class="detailItem-tit">投保人姓名：</div><div  class="detailItem-val">{{billInsure.insName}}</div></div>
            <div class="person-item"><div class="detailItem-tit">证件类型：</div><div  class="detailItem-val">{{billInsure.insCredentialsType | getCredentialsType}}</div></div>
            <div class="person-item"><div class="detailItem-tit">证件号码：</div><div  class="detailItem-val">{{billInsure.insCredentials}}</div></div>
            <div class="person-item"><div class="detailItem-tit">手机号码：</div><div  class="detailItem-val">{{billInsure.insPhone || '暂无'}}</div></div>
        </div>
        <div class="detail-insures" v-if="productShow">
            <div class="insures-tit">保障项目</div>
            <div class="insures-item" v-for="productContentList in orderDetails.productContentList" :key="productContentList.id"><div class="detailItem-tit">{{productContentList.contentName}}</div><div  class="detailItem-val">{{productContentList.price}}</div></div>
        </div>
    </div>
    <div v-if="stateCode == 2" class="pay-btn" @click="toPay(billInfo.billId)">去支付</div>

</section>
</template>
<script>
import headerbox from '../components/headerbox'
import Vue from 'vue';
import { Icon } from 'vant';
Vue.use(Icon);
export default {
  name: 'orderDetail',
   components:{
        'headerbox': headerbox
   },
    data () {
        return {
            orderTitle:'订单详情',
            orderDetails:{},
            billInfo:{},
            billInsure:{},
            orderStatus:'',
            productShow:false,
            stateCode:'',
            timer: ''
        }
    },
    inject:['reload'],
    methods: {
      returnHome(){
           this.$router.push({path: '/'});
        },
      orderIntro(){
          this.$ajax({
            method:'post',
            url:'/insurance/api/order/queryUserBillInfoById/' + this.$route.query.id
          })
          .then((res)=>{
            if(res.data &&  res.data.code === 1){
               this.orderDetails = res.data.outData;
               this.billInfo = res.data.outData.billInfo;
               this.billInsure = res.data.outData.billInsure;
               this.stateCode = this.orderDetails.billInfo.billState;
               if(this.stateCode == '1'){
                   this.timer = setInterval(this.loadOrderState,2000);
               }else if(this.stateCode == '2'){
                  this.timer = setInterval(this.loadOrderState,5000);
               }
               switch(this.orderDetails.billInfo.billState){
                    case 1:
                        this.orderStatus = '待核保';
                        break;
                    case 2:
                        this.orderStatus = '待支付';
                        break;
                    case 3:
                        this.orderStatus = '已支付';
                        break;
                    case 4:
                        this.orderStatus = '已承保';
                        break;
                    case 5:
                        this.orderStatus = '被拒保';
                        break;
                    case 6:
                        this.orderStatus = '核保失败';
                        break;
                    case 9:
                        this.orderStatus = '已失效';
                        break;
                }
                if(this.orderDetails.productContentList.length > 0){
                    this.productShow = true;
                }
            }
          })
          .catch((error)=>{

          })
      },
      loadOrderState(){
         this.$ajax({
             method:'post',
             url:'/insurance/api/order/loadInsBillStateInfo/' + this.$route.query.id
           })
           .then((res)=>{
              if(res.data &&  res.data.code == 1){
                  var currentCode =  res.data.outData.billState;
                  if( this.stateCode != currentCode){
                      //如果状态发生变化
                      clearInterval(this.timer);
                      this.reload();
                  }
              }


           })
           .catch((error)=>{

           })
      },
      toPay(billId){
       //进入支付页面
       this.$router.push({path: '/pay',query:{ billId:billId}});
     }
    },
    filters: {
      getCredentialsType(typeCode){
          if(typeCode === "01"){
            return "居民身份证";
          }else if(typeCode === "02"){
            return "护照";
          }else if(typeCode === "03"){
           return "军人证";
         }else if(typeCode === "07"){
           return "中国护照";
         }else if(typeCode === "08"){
           return "外国人永久居留身份证";
         }else if(typeCode === "09"){
           return "港澳台居民身份证";
         }else if(typeCode === "10"){
           return "港澳同胞回乡证（通行证）";
         }else if(typeCode === "11"){
           return "台湾居民来往大陆通行证";
         }else if(typeCode === "1"){
           return "组织机构代码证";
         }else if(typeCode === "2"){
           return "税务登记证";
         }else if(typeCode === "3"){
           return "营业执照";
         }else if(typeCode === "4"){
           return "执业许可证";
         }else if(typeCode === "99"){
           return "其他";
         }
      }
    },
    mounted () {
        this.orderIntro();
    },
    beforeDestroy() {
      clearInterval(this.timer);
    }
}
</script>
