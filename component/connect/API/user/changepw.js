import React from "react";
import ApiConnect from "../apiTemplate";
import { CHANGE_PW } from "../URL";

function requestDataHandler(param){
  return {
    jwt: param.userToken,
    password: param.password
  }
}

function responseDataHandler(responseData){
  return null;
}

export default async function changepw(param){
  return await ApiConnect({
    method: "POST",
    url: CHANGE_PW,
    data: requestDataHandler(param),
    responseDataHandler: responseData => responseDataHandler(responseData)
  })
}
