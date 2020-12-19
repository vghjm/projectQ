import React from "react";
import ApiConnect from "../apiTemplate";
import { DIARY_DELETE } from "../URL";

function requestDataHandler(param){
  return {
    jwt: param.userToken,
    d_ID: param.d_id
  }
}

function responseDataHandler(responseData){
  return null;
}

export default async function deleteDiary(param){
  return await ApiConnect({
    method: "POST",
    url: DIARY_DELETE,
    data: requestDataHandler(param),
    responseDataHandler: responseData => responseDataHandler(responseData)
  })
}
