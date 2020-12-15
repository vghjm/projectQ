import React from "react";
import Connection from "../../apiTemplate";
import {LOGIN} from "../../URL";

function makeReplyParam(data){
  return {
    token: data.token,
    name: data.name
  }
}

export default async function login(email, password){
  const reply = {ok: false, data: null, message: ''};
  const response = await Connection("POST", LOGIN, {
    email: email,
    password: password
  });

  if(response.ok){
    reply.ok = true;
    reply.data = makeReplyParam(response.data);
  }else{
    reply.message = response.message;
  }

  return reply;
}
