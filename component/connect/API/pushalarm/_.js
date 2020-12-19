import React from "react";
import ApiConnect from "../apiTemplate";
import { SET_PUSH_ALARM } from "../URL";

function requestDataHandler(param){
  return {
    jwt: param.userToken,
    flag: param.isAlarmOn
  }
}

function responseDataHandler(responseData){
  return null;
}

export default async function pushalarm(param){
  return await ApiConnect({
    method: "POST",
    url: SET_PUSH_ALARM,
    data: requestDataHandler(param),
    responseDataHandler: responseData => responseDataHandler(responseData)
  })
}
