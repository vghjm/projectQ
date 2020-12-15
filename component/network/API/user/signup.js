import React from "react";
import Connection from "../../apiTemplate";
import {SIGNUP} from "../../URL";

export default async function signup(email, password, name){
  const reply = {ok: false, data: null, message: ''};
  const response = await Connection("POST", SIGNUP, {
    email: email,
    password: password,
    name: name
  });

  if(response.ok){
    reply.ok = true;
  }else{
    reply.message = response.message;
  }

  return reply;
}
