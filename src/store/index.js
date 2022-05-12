import Vue from "vue";
import Vuex from "vuex";
import login from "./modules/login";
import layout from "./modules/layout";
import permission from "./modules/permission";
import getters from "./getters";

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    login,
    layout,
    permission
  },
  getters,
});
export default store;
