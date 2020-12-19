import React from "react";
import ApiConnect from "../apiTemplate";
import { PUSH_SET } from "../URL";

function requestDataHandler(param){
  return {
    jwt: param.userToken,
    p_ID: param.p_id,
    p_name: param.title,
    d_ID: param.s_id,
    start_time: param.pushStartTime,
    end_time: param.pushEndTime,
    pushType: param.pushType,
    subscribe: param.isSubscribe?1:0
  }
}

function responseDataHandler(responseData){
  return null;
}

export default async function pushsetting(param){
  return await ApiConnect({
    method: "POST",
    url: PUSH_SET,
    data: requestDataHandler(param),
    responseDataHandler: responseData => responseDataHandler(responseData)
  })
}
