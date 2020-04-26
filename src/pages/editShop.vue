<template>
    <section class="card-wrap">
         <headerbox :titleName="insureTitle">
        </headerbox>
        <div class="editcard-con modifyShop-name ">
            <div class="name-wrapper">
                <input type="text" class="shop-name" v-model="shopName" v-blur>
            </div>
            <div class="save" @click="saveShop">保存</div>
        </div>       
    </section>
</template>

<script>
import Vue from 'vue';
import { Toast } from 'vant';
Vue.use(Toast);
import headerbox from '../components/headerbox'
export default {
  name: 'setShop',
  components:{
        'headerbox': headerbox
   },
   inject:['reload'],
    data () {
        return {
            insureTitle:'修改微店名称',
            shopName:''
        }
    },
    methods: {
        //微店信息
        shopIntro(){
            this.$ajax({
                method:'post',
                url:'/insurance/api/weidian/showWeidianInfo'
            })
            .then((res)=>{
                if(res.data &&  res.data.code === 1){
                    let name;
                    if(res.data.outData.wdName){
                        name = res.data.outData.wdName;
                    }else if(res.data.outData.realName){
                        name = res.data.outData.realName + '微店'
                    }else{
                        name = res.data.outData.nickName + '微店';
                    }    
                    this.shopName = name;
                }
            })
            .catch((error)=>{

            })
        },
        //修改微店名称
        saveShop(){
            if(this.shopName === ''){
                Toast('微店名称不能为空');
                return;
            }
            this.$ajax({
                method:'post',
                url:'/insurance/api/weidian/saveOrUpdateWeidianName',
                params:{
                    wdName:this.shopName
                }
            })
            .then((res)=>{
                if(res.data &&  res.data.code === 1){
                   Toast('微店名称修改完成',2000);
                    setTimeout(()=>{
                        this.reload();
                    },2000)
                }
            })
            .catch((error)=>{

            })
        }
    },
    mounted () {
       this.shopIntro();
    }
}
</script>
