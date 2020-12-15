import React from "react";
import Connection from "../../apiTemplate";
import {CHATLOG_BACKUP} from "../../URL";

export default async function getChatLog({userToken}){
  const reply = {ok: false, data: null, message: ''};
  const response = await Connection("POST", CHATLOG_BACKUP, {
    jwt: userToken
  });

  if(response.ok){
    reply.ok = true;
    reply.data = response.data.logs;
  }else{
    reply.message = response.message;
  }

  return reply;
}
