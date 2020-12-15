import React from "react";
import Connection from "../../apiTemplate";
import {REQUEST_CHAT_REPLY} from "../../URL";

export default async function requestChatReply({expoToken, userToken, q_ID, p_ID, d_ID}){
  const reply = {ok: false, data: null, message: ''};
  const response = await Connection("POST", REQUEST_CHAT_REPLY, {
    expo_token: expoToken,
    jwt: userToken,
    q_ID: q_ID,
    p_ID: p_id,
    d_ID: d_id,
  });

  if(response.ok){
    reply.ok = true;
  }else{
    reply.message = response.message;
  }

  return reply;
}
