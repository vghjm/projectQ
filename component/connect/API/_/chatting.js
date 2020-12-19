import React from "react";
import ApiConnect from "../apiTemplate";
import { REQUEST_CHAT_REPLY } from "../URL";

function requestDataHandler(param){
  return {
    expo_token: param.expoToken,
    jwt: param.userToken,
    q_ID: param.q_Id,
    p_ID: param.p_id,
    d_ID: param.d_id,
  }
}

function responseDataHandler(responseData){
  return null;
}

export default async function chatReply(param){
  return await ApiConnect({
    method: "POST",
    url: REQUEST_CHAT_REPLY,
    data: requestDataHandler(param),
    responseDataHandler: responseData => responseDataHandler(responseData)
  })
}
