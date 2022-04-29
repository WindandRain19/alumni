import Vue from "vue";
import Vuex from "vuex";
import login from "./modules/login";
import layout from "./modules/layout";
import getters from "./getters";

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    login,
    layout,
  },
  getters,
});
export default store;
