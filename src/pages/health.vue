<template>
    <section class="insure-wrap">
        <headerbox :titleName="insureTitle">
        </headerbox>
        <div class="health-con">
            <div class="health-tip">为保证投、被保人的保险合同权益不受影响，请如实告知，确认被保险人是否符合以下投保条件。</div>
            <article class="health-article" v-html="healthVal">
            </article>
        </div>
        <footer class="health-footer">
            <div class="health-no" @click="noHealth">部分情况有</div>
            <div class="health-yes" @click="yesHealth">以上情况全无</div>
        </footer>
        <div class="insure-bg" v-show="bgShow"></div>

        <!--无法购买提示--->
        <div class="insure-tc" v-show="weeboxShow">
            <div class="tanc-title">不满足投保要求</div>
            <div class="tanc-con">您的情况不满足此产品的投保要求，暂无法购买。</div>
            <div class="tanc-btn" @click="weeboxClose">取消</div>
        </div>
    </section>
</template>
<script>
import headerbox from '../components/headerbox'
export default {
  name: 'health',
    data () {
        return {
            insureTitle:'健康告知',
            bgShow:false,
            weeboxShow:false,
            healthVal:''
        }
    },
    components:{
        'headerbox': headerbox
   },
    methods: {
        //点击部分情况有
        noHealth(){
            this.bgShow = true;
            this.weeboxShow = true;
        },
        //关闭提示信息
        weeboxClose(){
            this.bgShow = false;
            this.weeboxShow = false;
        },
        yesHealth(){
           this.$router.push({path: '/insureIntro',query:{ id:this.$route.query.id}});
        },
        //健康告知内容
        healthCon(){
            let healthV = localStorage.getItem('healthContent');
            this.healthVal = healthV;
        }
    },
    mounted () {
        this.healthCon();
    }
}
</script>

<style scoped>

</style>
