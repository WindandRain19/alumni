import request from "../utils/request";

// 点赞
export function getForumFive(give, time) {
  return request({
    url: "/fo/give",
    method: "post",
    data: {
      give,
      time,
    },
  });
}

// 获取Forum
export function getForumInfo() {
  return request({
    url: "/fo",
    method: "get",
  });
}

// 发布文字
export function postFontForum(editForm, number) {
  return request({
    url: "/fo/fontForum",
    method: "post",
    data: {
      editForm,
      number,
    },
  });
}

// 发布图片
export function postPicForum(picForm, number) {
  return request({
    url: "/fo/picForum",
    method: "post",
    data: {
      picForm,
      number,
    },
  });
}

// 删除留言
export function deleteForum(idForum) {
  return request({
    url: "/fo/Forum/"+idForum,
    method: "delete",
  });
}
