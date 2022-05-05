import request from "../utils/request";

export function getStateInfo(queryInfo) {
  return request({
    url: "/state1",
    method: "get",
    params: queryInfo,
  });
}

export function getPersonStateInfo(id) {
  return request({
    url: "/state1/" + id,
    method: "get",
  });
}

export function updateStateInfo(id, pdfName) {
  return request({
    url: "/state1/" + id,
    method: "put",
    data: {
      pdfName,
    },
  });
}
// 删除
export function deleteStateInfo(id) {
  return request({
    url: "/state1/" + id,
    method: "delete",
  });
}
