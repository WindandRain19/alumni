const layout = {
  state: {
    isCollapse: false,
  },
  mutations: {
    GET_ISCOLLAPSE(state) {
      var isCollapse = window.sessionStorage.getItem("isCollapse");
      if (isCollapse != "") {
        if (isCollapse == "true") {
          isCollapse = true;
        } else {
          isCollapse = false;
        }
        state.isCollapse = isCollapse;
        return;
      }
      window.sessionStorage.setItem("isCollapse", false);
      state.isCollapse = false;
    },
  },
  actions: {},
};
export default layout;
