// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import axios from 'axios'
import wx from 'weixin-js-sdk'
Vue.prototype.$ajax = axios
Vue.prototype.wx = wx
Vue.config.productionTip = false
const ENV = process.env.NODE_ENV;
if(ENV === 'development'){
  axios.defaults.baseURL = '/api'
}else if(ENV === 'production'){
  axios.defaults.baseURL = ''
}

// http response 拦截器
axios.interceptors.response.use(
  response => {
    if(response.data.code == 9){
      let hostname = window.location.hostname;
      window.location.href = 'http://' + hostname + '/mine/login2.shtml';
    }
    return response;
},
error => {
if (error.response) {
  switch (error.response.status) {
    case 401:
      let hostname = window.location.hostname;
      window.location.href = 'http://' + hostname + '/mine/login2.shtml';
  }
}
});

//微信端输入框弹起页面高度变化bug处理
Vue.directive('blur',{
  bind:function(el, binding, vnode, oldVnode){
      el.onblur = function(){
        setTimeout(function() {
                let scrollHeight = document.documentElement.scrollTop || document.body.scrollTop || 0;
                window.scrollTo(0, Math.max(scrollHeight - 1, 0));
            }, 100);
      }
  }
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
