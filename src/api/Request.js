import request from "../utils/request";

// 账号查询
export function getPersonRequestInfo(number) {
  return request({
    url: "/request/" + number,
    method: "get",
  });
}

// id查询
export function getIdRequestInfo(idRequest) {
  return request({
    url: "/request/" + idRequest,
    method: "get",
  });
}

export function postRequest(requestForm, number) {
  const data = {
    requestForm,
    number,
  };
  return request({
    url: "/request",
    method: "post",
    data,
  });
}

export function getRequestInfo(queryInfo) {
  return request({
    url: "/request",
    method: "get",
    params: queryInfo,
  });
}

// 修改表单信息
export function updateRequest(requestForm, number) {
  const data = {
    requestForm,
  };
  return request({
    url: "/request/" + number,
    method: "put",
    data,
  });
}

export function deleteRequestInfo(idRequest) {
  return request({
    url: "/request/" + idRequest,
    method: "delete",
  });
}

// 审批
export function updateRequestById(idRequest, status) {
  const data = {
    status,
  };
  return request({
    url: "/request/" + idRequest,
    method: "put",
    data,
  });
}