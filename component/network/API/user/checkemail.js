import React from "react";
import Connection from "../../apiTemplate";
import {CHECK_EMAIL} from "../../URL";

export default async function checkEmail(email){
  const reply = {ok: false, data: null, message: ''};
  const response = await Connection("POST", CHECK_EMAIL, {
    email: email
  });

  if(response.ok){
    reply.ok = true;
  }else{
    reply.message = response.message;
  }

  return reply;
}
