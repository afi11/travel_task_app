import Vue from "vue";
import App from "./App.vue";
import router from "./config/router";
import VueComp from "@vue/composition-api";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import "./assets/styles.css";
import Auth from "./config/auth";
import store from "./vuex/store/index";

import {
  ValidationObserver,
  ValidationProvider,
  extend,
  localize,
} from "vee-validate";

import id from "vee-validate/dist/locale/id.json";
import * as rules from "vee-validate/dist/rules";

Vue.component("ValidationObserver", ValidationObserver);
Vue.component("ValidationProvider", ValidationProvider);

localize("id", id);

Object.keys(rules).forEach((rule) => {
  extend(rule, rules[rule]);
});

Vue.component("vue-select", vSelect);
Vue.use(VueComp);
Vue.use(Auth);

Vue.config.productionTip = false;

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.forVisitors)) {
    if (Vue.auth.isAdminAuthenticated()) {
      next({
        path: "/",
      });
    } else if (Vue.auth.isPegawaiAuthenticated()) {
      next({
        path: "/daftar_tugas",
      });
    } else next();
  } else if (to.matched.some((record) => record.meta.forAdmin)) {
    if (!Vue.auth.isAdminAuthenticated()) {
      next({
        path: "/login",
      });
    } else next();
  } else if (to.matched.some((record) => record.meta.forEmployer)) {
    if (!Vue.auth.isPegawaiAuthenticated()) {
      next({
        path: "/login",
      });
    } else next();
  } else next();
});

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
