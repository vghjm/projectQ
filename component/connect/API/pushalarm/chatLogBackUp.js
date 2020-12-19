import React from "react";
import ApiConnect from "../apiTemplate";
import { CHATLOG_BACKUP } from "../URL";

function requestDataHandler(param){
  return {
    jwt: param.userToken
  }
}

function responseDataHandler(responseData){
  return {
    logList: responseData.logs
  };
}

export default async function chatLogBackup(param){
  return await ApiConnect({
    method: "POST",
    url: CHATLOG_BACKUP,
    data: requestDataHandler(param),
    responseDataHandler: responseData => responseDataHandler(responseData)
  })
}
