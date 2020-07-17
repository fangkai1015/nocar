<template>
    <section class="card-wrap">
         <headerbox :titleName="insureTitle">
        </headerbox>
        <div class="card-con">
            <div class="card-info ">
                <div class="card-name">{{userName}}<div class="modify-btn" @click="editCard">编辑</div></div>
                <div class="com-name">{{companyName}}</div>
                <div class="card-phone">
                    <span class="phone-val">{{phone}}</span>
                </div>
                <div class="card-weixin">{{wxCon}}</div>
                <div class="to-shop" @click="enterShop">进店逛逛</div>
                <div class="card-occupation">执业证编号</div>
                <div class="card-number">{{occupation}}</div>
            </div>
        </div>
        
    </section>
</template>

<script>
import headerbox from '../components/headerbox'
export default {
  name: 'setCard',
  components:{
        'headerbox': headerbox
   },
    data () {
        return {
            insureTitle:'个人名片',
            userName:'',
            companyName:'',
            phone:'',
            wxCon:'',
            occupation:'',
            shareCode:''
        }
    },
    methods: {
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
                    this.occupation =  this.userContent.callingInfo.occupationCode || '请编辑执业证编号';
                    this.shareCode = this.userContent.shareCode;
                }
            })
            .catch((error)=>{

            })
        },
        enterShop(){
           //进入我的微店
            this.$router.push({path: '/myShop?uuid='+encodeURIComponent(this.shareCode)});
        },
        editCard(){
            //进入名片设置
            this.$router.push({path: '/editCard'});
        }
    },
    mounted () {
       this.userIntro();
    }
}
</script>
<style>
    .shop-wrap .insure-bg{
        z-index: 100;
    }
</style>
