import React from "react";
import Connection from "../../apiTemplate";
import {FIND_PW} from "../../URL";

export default async function findpw(email){
  const reply = {ok: false, data: null, message: ''};
  const response = await Connection("POST", FIND_PW, {
    email: email
  });

  if(response.ok){
    reply.ok = true;
  }else{
    reply.message = response.message;
  }

  return reply;
}
