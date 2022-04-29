import request from "../utils/request"

export function getOptions(){
    return request({
        url:"/Options",
        method:"get",
    })
}