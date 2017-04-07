/**
 * Created by aresn on 16/6/20.
 */
import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './App.vue';
import ElementUI from 'element-ui';

Vue.use(ElementUI);
Vue.use(VueRouter);

// 开启debug模式
Vue.config.debug = true;


// 路由配置
const router = new VueRouter({
        routes: [
                {
                        path: '/test',
                        component: require('./pages/test.vue')
                },{
                        path: '/test2',
                        component: require('./pages/test2.vue')
                }
        ]
});

new Vue({
        el: '#app',
        router: router,
        render: h => h(App)
});
