import Vue from "nativescript-vue";
import App from "./components/App.vue";

// Prints Vue logs when --env.production is *NOT* set while building
Vue.config.silent = !__DEV__;

new Vue({
  
    render: h => h("frame", [h(App)])
}).$start();
