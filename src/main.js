// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './styles/index.scss' // global css
import router from './router'
import axios from './axios/http'
import VueCookie from 'vue-cookie'
import store from './store'
import lockr from 'lockr'
import './utils/dateFormat'
import './assets/css/iconfont.css'

Vue.use(ElementUI)
Vue.use(VueCookie);

Vue.prototype.$http = axios;

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
  watch:{
    $route (to, from) {
      //检测router 存储meta到store
      if(to.meta.requiresAuth){
        this.checkLogin()
      }
    },
  },

//进入页面时 验证是否登录
  created() {
    if(this.$route.name != 'PassWord'){
      this.checkLogin();
    }
    document.title = '版本发布'
  },
  methods: {
    checkLogin(){
      //检查是否存在Token
      console.log(this.$route)
      if (!this.$cookie.get('oa_adoptToken')) {
        //如果没有登录状态则跳转到登录页 并移除localstorege
        this.$cookie.delete('oa_adoptToken');
        this.$router.push('/login');
      }
    }
  }
})
