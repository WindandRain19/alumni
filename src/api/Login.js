import request from "../utils/request";

export function Login(number, password, img_code, type) {
  const data = {
    number,
    password,
    img_code,
    type,
  };
  return request({
    url: "/Login",
    method: "post",
    data,
  });
}
