import React from "react";
import ApiConnect from "../apiTemplate";
import { LOGIN } from "../URL";

function requestDataHandler(param){
  return {
    email: param.email,
    password: param.password
  }
}

function responseDataHandler(responseData){
  return {
    userToken: responseData.token,
    userName: responseData.name
  }
}

export default async function login(param){
  return await ApiConnect({
    method: "POST",
    url: LOGIN,
    data: requestDataHandler(param),
    responseDataHandler: responseData => responseDataHandler(responseData)
  })
}
