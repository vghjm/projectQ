import React from "react";
import ApiConnect from "../apiTemplate";
import { RECEIVE_PUSH_SUCCESSFUL } from "../URL";

function requestDataHandler(param){
  return {
    log_ID: param.log_id
  }
}

function responseDataHandler(responseData){
  return null;
}

export default async function pushalarmReceieveSuccess(param){
  return await ApiConnect({
    method: "POST",
    url: RECEIVE_PUSH_SUCCESSFUL,
    data: requestDataHandler(param),
    responseDataHandler: responseData => responseDataHandler(responseData)
  })
}
