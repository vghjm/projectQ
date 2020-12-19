import React from "react";
import ApiConnect from "../apiTemplate";
import { FIND_PW } from "../URL";

function requestDataHandler(param){
  return {
    email: param.email
  }
}

function responseDataHandler(responseData){
  return null;
}

export default async function findpw(param){
  return await ApiConnect({
    method: "POST",
    url: FIND_PW,
    data: requestDataHandler(param),
    responseDataHandler: responseData => responseDataHandler(responseData)
  })
}
