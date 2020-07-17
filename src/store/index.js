import Vue from 'vue'
import Vuex from 'vuex'

//挂载Vuex
Vue.use(Vuex)

//创建VueX对象
export default new Vuex.Store({
    state:{
        code:'',//用户编码
        productContent:{}//产品信息传值
    },
    mutations:{
        updateCode(state,codeChange){
            state.code = codeChange
        },
        updateProduct(state,productChange){
            state.productContent = productChange
        }
    }
})