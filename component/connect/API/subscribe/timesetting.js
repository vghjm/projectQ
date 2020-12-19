import React from "react";
import ApiConnect from "../apiTemplate";
import { PUSH_TIME_SET } from "../URL";

function requestDataHandler(param){
  return {
    jwt: param.userToken,
    p_ID: param.p_ID,
    start_time: param.pushStartTime,
    end_time: param.pushEndTime,
    pushType: param.pushType,
  }
}

function responseDataHandler(responseData){
  return null;
}

export default async function timesetting(param){
  return await ApiConnect({
    method: "POST",
    url: PUSH_TIME_SET,
    data: requestDataHandler(param),
    responseDataHandler: responseData => responseDataHandler(responseData)
  })
}
