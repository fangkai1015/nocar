<template>
    <section class="card-wrap">
         <headerbox :titleName="insureTitle">
        </headerbox>
        <div class="editcard-con">
            <div class="modifyCard-content">
                <div class="modify-line">
                    <div class="modify-tit">姓名</div>
                    <div class="modify-val"><input type="text" class="modifyVal-input" v-model="userName" v-blur/></div>
                </div>
                <div class="modify-line">
                    <div class="modify-tit">手机号</div>
                    <div class="modify-val"><input type="tel" class="modifyVal-input" maxlength="11" v-model="phone" v-blur/></div>
                </div>
                <div class="modify-line">
                    <div class="modify-tit">微信号</div>
                    <div class="modify-val"><input type="text" class="modifyVal-input" v-model="wxCon" v-blur/></div>
                </div>
                <div class="modify-line">
                    <div class="modify-tit">公司名称</div>
                    <div class="modify-val"><input type="text" class="modifyVal-input" v-model="companyName" v-blur/></div>
                </div>
                <div class="modify-line">
                    <div class="modify-tit">执业证编号</div>
                    <div class="modify-val"><input type="text" class="modifyVal-input" v-model="occupationCode" v-blur/></div>
                </div>
                <div class="confirm-btn" @click="cardOk">确定</div>
            </div>
        </div>       
    </section>
</template>

<script>
import Vue from 'vue';
import { Toast } from 'vant';
Vue.use(Toast);
import headerbox from '../components/headerbox'
export default {
  name: 'editCard',
  components:{
        'headerbox': headerbox
   },
   inject:['reload'],
    data () {
        return {
            insureTitle:'名片设置',
            userName:'',
            companyName:'',
            phone:'',
            wxCon:'',
            occupationCode:''
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
                    this.wxCon = this.userContent.callingInfo.wxAccount || '';
                    this.occupationCode = this.userContent.callingInfo.occupationCode || '';
                }
            })
            .catch((error)=>{

            })
        },
        //编辑名片
        cardOk(){
            let chineseName = /^([\u4e00-\u9fa5]|\u3007)+([\.\uff0e\u00b7\u30fb]?|\u3007?)+([\u4e00-\u9fa5]|\u3007)+$/,
                mobile = /^1[3456789]\d{1}(\*{4}\d{4}|\d{8})$/;
            if(this.userName === ''){
                Toast('姓名不能为空');
                return;
            }
            if(!chineseName.test(this.userName)){
                Toast('姓名格式不正确');
                return;
            }
            if(this.phone === ''){
                Toast('手机号码不能为空');
                return;
            }
            if(!mobile.test(this.phone)){
                Toast('手机格式不正确');
                return;
            }
            if(this.wxCon === ''){
                Toast('微信号不能为空');
                return;
            }
            if(this.companyName === ''){
                Toast('公司名称不能为空');
                return;
            }
            if(this.occupationCode === ''){
                Toast('执业证编号不能为空');
                return;
            }
            //编辑用户名片信息
            this.$ajax({
                method:'post',
                url:'/insurance/api/weidian/saveOrUpdateUserCalling',
                data:{
                    company: this.companyName,
                    mobile: this.phone,
                    name: this.userName,
                    wxAccount: this.wxCon,
                    occupationCode:this.occupationCode
                }
            })
            .then((res)=>{
                if(res.data &&  res.data.code === 1){
                    Toast('名片设置完成',2000);
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
       this.userIntro();
    }
}
</script>
