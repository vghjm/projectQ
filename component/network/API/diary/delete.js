import React from "react";
import Connection from "../../apiTemplate";
import {DIARY_DELETE} from "../../URL";

export default async function diaryDelete({token, d_ID}){
  const reply = {ok: false, data: null, message: ''};
  const response = await Connection("POST", DIARY_DELETE, {
    jwt: token,
    d_ID: d_ID
  });

  if(response.ok){
    reply.ok = true;
  }else{
    reply.message = response.message;
  }

  return reply;
}
