import store from "./store";

const type = sessionStorage.getItem("type")
if (type) {
    store.commit("SET_PERMISSION_ROUTER", type);
}

