import React from "react";
import Connection from "../../apiTemplate";
import {RECEIVE_PUSH_SUCCESSFUL} from "../../URL";

export default async function receivePushSuccess({log_ID}){
  const reply = {ok: false, data: null, message: ''};
  const response = await Connection("POST", RECEIVE_PUSH_SUCCESSFUL, {
    log_ID: log_ID
  });

  if(response.ok){
    reply.ok = true;
  }else{
    reply.message = response.message;
  }

  return reply;
}
