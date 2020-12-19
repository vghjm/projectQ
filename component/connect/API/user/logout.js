import React from "react";
import ApiConnect from "../apiTemplate";
import { LOGOUT } from "../URL";

function requestDataHandler(param){
  return {
    jwt: param.userToken
  }
}

function responseDataHandler(responseData){
  return null;
}

export default async function logout(param){
  return await ApiConnect({
    method: "POST",
    url: LOGOUT,
    data: requestDataHandler(param),
    responseDataHandler: responseData => responseDataHandler(responseData)
  })
}
