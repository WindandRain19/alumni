import request from "../utils/request";

// 个人用户列表
export function getUserInfo(number) {
  return request({
    url: "/users/" + number,
    method: "get",
  });
}

// 更新个人用户列表
export function UpdateUserInfo(number, infoForm) {
  return request({
    url: "/users/" + number,
    method: "put",
    data: infoForm,
  });
}

// 所有用户列表
export function getUserInfos(queryInfo) {
  return request({
    url: "/users",
    method: "get",
    params: queryInfo,
  });
}

// 添加用户信息
export function postUserInfo(addForm) {
  return request({
    url: "/users",
    method: "post",
    params: addForm,
  });
}

// 删除用户
export function deleteUserInfo(number) {
  return request({
    url: "/users/" + number,
    method: "delete",
  });
}

// 修改权限
export function updateUserRole(number, type) {
  return request({
    url: "/users/role/" + number,
    method: "put",
    data: { type },
  });
}
