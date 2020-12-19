import React from "react";
import ApiConnect from "../apiTemplate";
import { CHECK_EMAIL } from "../URL";

function requestDataHandler(param){
  return {
    email: param.email
  }
}

function responseDataHandler(responseData){
  return null;
}

export default async function checkemail(param){
  return await ApiConnect({
    method: "POST",
    url: CHECK_EMAIL,
    data: requestDataHandler(param),
    responseDataHandler: responseData => responseDataHandler(responseData)
  })
}
