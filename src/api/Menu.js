import request from "../utils/request";

export function getMenuList(type) {
  return request({
    url: "/menus",
    method: "get",
    params: {
      type,
    },
  });
}
