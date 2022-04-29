import request from "../utils/request";

export function getShowInfo(queryInfo) {
  return request({
    url: "/sh",
    method: "get",
    params: queryInfo,
  });
}

export function postShowInfo(showForm) {
  return request({
    url: "/sh",
    method: "post",
    data: showForm,
  });
}

export function getPersonShowInfo(id) {
  return request({
    url: "/sh/" + id,
    method: "get",
  });
}

export function UpdateShowInfo(id, editForm) {
  return request({
    url: "/sh/" + id,
    method: "put",
    data: editForm,
  });
}
export function deleteShowInfo(id) {
  return request({
    url: "/sh/" + id,
    method: "delete",
  });
}