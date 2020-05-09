<template>
<section class="order-content">
    <headerbox :titleName="orderTitle"></headerbox>
    <div class="orderSelectWrapper">
        <div class="orderSelectTab">
            <div v-for="tabName in tabNames" :key="tabName.status" :class="{'on':tabIndex == tabName.status}" @click.stop="tabGo(tabName.status)">{{tabName.name}}</div>
        </div>
    </div>
    <div class="orderList">
        <van-list v-model="loading" :finished="finished" finished-text="" @load="tabContent()">
            <div class="order-item" v-for="(orderContent,index) in orderContentAll" :key="index">
                <div class="order-des">
                    <div class="left-des">
                        <div class="insurance-name">{{orderContent.proname}}</div>
                    </div>
                    <div class="right-des">
                        <div class="status-name red-color">{{orderStatus[index]}}</div>
                    </div>
                </div>
                <div class="insurance-items">
                    <div class="insurance-item">被保人：{{orderContent.assured}}</div>
                     <div class="insurance-item">订单号：{{orderContent.billcode || '暂无'}}</div>
                    <div class="insurance-item">保障起期：{{orderContent.enabledate}}</div>
                    <div class="insurance-item">保障止期：{{orderContent.disenabledate}}</div>
                    <div class="insurance-item">支付金额：<span class="insurance-fee">{{orderContent.premium}}元</span></div>
                    <div class="logo-wrapper"><img  class="companyLogo" src="../../static/image/company_logo.png" /></div>
                </div>
                <div class="operate-btns">
                    <div class="check-order" @click="orderEnter(orderContent.billid)">订单详情</div>
                    <div class="can-pay" v-if="orderStatus[index] == '待支付'" @click="toPay(orderContent.billid)">立即支付</div>
                </div>
            </div>
        </van-list>
        <div class="order-empty" v-if="empty"><span class="empty-icon"></span><div class="empty-txt">暂无相关订单</div></div>
    </div>


</section>
</template>
<script>
import Vue from 'vue';
import { List } from 'vant';
Vue.use(List);
import headerbox from '../components/headerbox';
import { Toast } from 'vant';
Vue.use(Toast);
export default {
  name: 'orderList',
   components:{
        'headerbox': headerbox
   },
    data () {
        return {
            orderTitle:'非车订单',
            tabIndex:0,
            tabNames:[{name:'全部',status:0},{name:'待核保',status:1},{name:'待支付',status:2},{name:'已支付',status:3},{name:'已承保',status:4},{name:'核保失败',status:6},{name:'已失效',status:9}],
            orderContents:[],
            orderContentAll:[],
            orderStatus:[],
            loading: false,
            finished: false,
            totalPage:1,
            page:1,
            time:'',
            empty:false
        }
    },
    methods: {
      tabGo(status){
          this.page = 1;
          this.tabIndex = status;
          this.orderContentAll = [];
          this.orderStatus =[];
          this.finished = false;
          this.tabContent();
      },
      tabContent(){
          this.empty = false;
          clearTimeout(this.time);
          this.time = setTimeout(() => {
          this.$ajax({
            method:'post',
            url:'/insurance/api/order/queryUserBillListByKeys',
            data:{
                billState:this.tabIndex,
                limit: 10,
                page: this.page
            }
          })
          .then((res)=>{
            if(res.data &&  res.data.code === 1){
              this.orderContents = res.data.outData.rows;
              if(this.orderContents.length === 0){
                  this.empty = true;
              }
              this.orderContents.map((data,i) =>{
                  //暂时没有被拒保的逻辑，tab栏暂时不显示
                  switch(data.billstate){
                    case 1:
                        this.orderStatus.push('待核保');
                        break;
                    case 2:
                        this.orderStatus.push('待支付');
                        break;
                    case 3:
                        this.orderStatus.push('已支付');
                        break;
                    case 4:
                        this.orderStatus.push('已承保');
                        break;
                    case 5:
                        this.orderStatus.push('被拒保');
                        break;
                    case 6:
                        this.orderStatus.push('核保失败');
                        break;
                    case 9:
                        this.orderStatus.push('已失效');
                        break;
                }
              })
              this.orderContents.forEach(data=>{
                this.orderContentAll.push(data);
                })
              this.totalPage = res.data.outData.totalPage;
              this.page++;
              // 加载状态结束
              this.loading = false;

                // 数据全部加载完成
                if (this.page > this.totalPage) {
                    this.finished = true;
                }
            }
          })
          .catch((error)=>{

          })
        },500)
      },
      orderEnter(billid){
          //进入订单详情
          this.$router.push({path: '/orderDetail',query:{ id:billid}});
      },
      toPay(billId){
         //进入支付页面
         this.$router.push({path: '/pay',query:{ billId:billId}});
       }

    },
    mounted () {
    }
}
</script>
