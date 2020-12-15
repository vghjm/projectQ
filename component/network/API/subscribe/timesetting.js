import React from "react";
import Connection from "../../apiTemplate";
import {PUSH_TIME_SET} from "../../URL";

export default async function pushTimeSetting({token, p_ID, pushStartTime, pushEndTime, pushType}){
  const reply = {ok: false, data: null, message: ''};
  const response = await Connection("POST", PUSH_TIME_SET, {
    jwt: token,
    p_ID: p_ID,
    start_time: pushStartTime,
    end_time: pushEndTime,
    pushType: pushType,
  });

  if(response.ok){
    reply.ok = true;
  }else{
    reply.message = response.message;
  }

  return reply;
}
