<template>
    <section class="card-wrap">
         <headerbox :titleName="insureTitle">
        </headerbox>
        <div class="editcard-con setShop-content">
            <div class="shopImage-area">
                <div class="shopImage-tit">微店头像</div>
                <div class="shopImage-wrapper point">
                    <img class="shopImage" :src="shopLogo" v-if="shopLogo">
                    <img class="shopImage" src="../../static/image/default.png" v-else>
                    <van-uploader :after-read="afterRead" />
                </div>
            </div>
            <div class="shopName-area" @click="editShop">
                <div class="shopName-tit">微店名称</div>
                <div class="shopName point">{{shopTitle}}</div>
            </div>
            <div class="look-shop" @click="enterShop">查看微店</div>
        </div>       
    </section>
</template>

<script>
import Vue from 'vue';
import { Uploader } from 'vant';
Vue.use(Uploader);
import { Toast } from 'vant';
Vue.use(Toast);
import headerbox from '../components/headerbox'
export default {
  name: 'setShop',
  components:{
        'headerbox': headerbox
   },
    data () {
        return {
            insureTitle:'微店设置',
            shopLogo:'',
            shopTitle:'',
            shareCode:''
        }
    },
    methods: {
        afterRead(file) {
            // 此时可以自行将文件上传至服务器
            let fileFormData = new FormData();
            fileFormData.append('file', file.file);
            Toast.loading({
                message: '上传中...',
                forbidClick: true,
                loadingType: 'spinner',
                duration: 0
            });
            this.$ajax.post('/insurance/api/weidian/saveOrUpdateWeidianLogo',fileFormData,{headers: {'Content-Type': 'multipart/form-data'}})
            .then((res)=>{
                Toast.clear();
                if(res.data &&  res.data.code === 1){
                    this.shopLogo =  res.data.outData.wdLogo;
                }else{
                    Toast(res.data.message)
              }
            })
            .catch((error)=>{
                Toast.clear();
                Toast(res.data.message)
          })
        },
         //微店信息
        shopIntro(){
            this.$ajax({
                method:'post',
                url:'/insurance/api/weidian/showWeidianInfo'
            })
            .then((res)=>{
                if(res.data &&  res.data.code === 1){
                    this.shopLogo = res.data.outData.wdLogo;
                    this.shareCode =  res.data.shareCode;
                    let name;
                    if(res.data.outData.wdName){
                        name = res.data.outData.wdName;
                    }else if(res.data.outData.realName){
                        name = res.data.outData.realName + '微店'
                    }else{
                        name = res.data.outData.nickName + '微店';
                    }    
                    this.shopTitle = name;
                }
            })
            .catch((error)=>{

            })
        },
        enterShop(){
             //进入我的微店
            this.$router.push({path: '/myShop?uuid='+encodeURIComponent(this.shareCode)});
        },
        editShop(){
            //进入微店名称修改
            this.$router.push({path: '/editShop'});
        }
    },
    mounted () {
        this.shopIntro();
    }
}
</script>
<style>
.card-wrap .van-uploader{
    position: absolute;
    right: 0;
    top:0;
    z-index: 10;
    opacity: 0;
    height: 100%;
}
</style>
