import React from "react";
import ApiConnect from "../apiTemplate";
import { SET_PUSH_TOKEN } from "../URL";

function requestDataHandler(param){
  return {
    token: {value: param.expoToken},
    user: {email: param.email}
  }
}

function responseDataHandler(responseData){
  return null;
}

export default async function setPushToken(param){
  return await ApiConnect({
    method: "POST",
    url: SET_PUSH_TOKEN,
    data: requestDataHandler(param),
    responseDataHandler: responseData => responseDataHandler(responseData)
  })
}
