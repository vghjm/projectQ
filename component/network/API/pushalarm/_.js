import React from "react";
import Connection from "../../apiTemplate";
import {SET_PUSH_ALARM} from "../../URL";

export default async function requestChatReply({userToken, isAlarmOn}){
  const reply = {ok: false, data: null, message: ''};
  const response = await Connection("POST", SET_PUSH_ALARM, {
    jwt: userToken,
    flag: isAlarmOn
  });

  if(response.ok){
    reply.ok = true;
  }else{
    reply.message = response.message;
  }

  return reply;
}
