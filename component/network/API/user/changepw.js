import React from "react";
import Connection from "../../apiTemplate";
import {CHANGE_PW} from "../../URL";

export default async function changepw(userToken, password){
  const reply = {ok: false, data: null, message: ''};
  const response = await Connection("POST", CHANGE_PW, {
    jwt: userToken,
    password: password
  });

  if(response.ok){
    reply.ok = true;
  }else{
    reply.message = response.message;
  }

  return reply;
}
