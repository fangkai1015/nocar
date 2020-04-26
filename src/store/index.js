import Vue from 'vue'
import Vuex from 'vuex'

//挂载Vuex
Vue.use(Vuex)

//创建VueX对象
export default new Vuex.Store({
    state:{
        healthContent:'',//健康告知内容
        productContent:{}//产品信息传值
    },
    mutations:{
        updateHealth(state,healthChange){
            state.healthContent = healthChange
        },
        updateProduct(state,productChange){
            state.productContent = productChange
        }
    }
})