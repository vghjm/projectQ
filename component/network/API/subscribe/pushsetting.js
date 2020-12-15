import React from "react";
import Connection from "../../apiTemplate";
import {PUSH_SET} from "../../URL";

export default async function pushSetting({token, title, p_id, s_id, pushStartTime, pushEndTime, pushType, isSubscribe}){
  const reply = {ok: false, data: null, message: ''};
  const response = await Connection("POST", PUSH_SET, {
    jwt: token,
    p_ID: p_id,
    p_name: title,
    d_ID: s_id,
    start_time: pushStartTime,
    end_time: pushEndTime,
    pushType: pushType,
    subscribe: isSubscribe?1:0
  });

  if(response.ok){
    reply.ok = true;
  }else{
    reply.message = response.message;
  }

  return reply;
}
