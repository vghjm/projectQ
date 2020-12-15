import React from "react";
import Connection from "../../apiTemplate";
import {SET_PUSH_TOKEN} from "../../URL";

export default async function setPushToken({expoToken, email}){
  const reply = {ok: false, data: null, message: ''};
  const response = await Connection("POST", SET_PUSH_TOKEN, {
    token: {value: expoToken},
    user: {email: email}
  });

  if(response.ok){
    reply.ok = true;
  }else{
    reply.message = response.message;
  }

  return reply;
}
