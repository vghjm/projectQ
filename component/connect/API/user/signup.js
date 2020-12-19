import React from "react";
import ApiConnect from "../apiTemplate";
import { SIGNUP } from "../URL";

function requestDataHandler(param){
  return {
    email: param.email,
    name: param.userName,
    password: param.password
  }
}

function responseDataHandler(responseData){
  return null;
}

export default async function signup(param){
  return await ApiConnect({
    method: "POST",
    url: SIGNUP,
    data: requestDataHandler(param),
    responseDataHandler: responseData => responseDataHandler(responseData)
  })
}
