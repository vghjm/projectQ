import React from "react";
import Connection from "../../apiTemplate";
import {LOGOUT} from "../../URL";

export default async function logout(userToken){
  const reply = {ok: false, data: null, message: ''};
  const response = await Connection("POST", LOGOUT, {
    jwt: userToken
  });

  if(response.ok){
    reply.ok = true;
  }else{
    reply.message = response.message;
  }

  return reply;
}
