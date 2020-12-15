import React from "react";
import Connection from "../../apiTemplate";
import {DIARY_BACKUP} from "../../URL";

export default async function diaryBackup({token, backupDiaryList}){
  const reply = {ok: false, data: null, message: ''};
  const response = await Connection("POST", DIARY_BACKUP, {
    jwt: token,
    diary: backupDiaryList
  });

  if(response.ok){
    reply.ok = true;
  }else{
    reply.message = response.message;
  }

  return reply;
}
