import React from "react";
import ApiConnect from "../apiTemplate";
import { DIARY_BACKUP } from "../URL";

function requestDataHandler(param){
  return {
    jwt: param.userToken,
    diary: param.diaryBackupList
  }
}

function responseDataHandler(responseData){
  return null;
}

export default async function backup(param){
  return await ApiConnect({
    method: "POST",
    url: DIARY_BACKUP,
    data: requestDataHandler(param),
    responseDataHandler: responseData => responseDataHandler(responseData)
  })
}
