import React from "react";
import Connection from "../../apiTemplate";
import {SUBSCRIBE_LOOKUP} from "../../URL";
import Moment from 'moment';

async function convertSubscribeType(serverType){

  return await serverType.map(subscribe => {
    return {p_id: subscribe.p_ID, s_id: subscribe.d_ID, pushStartTime: Moment('20200812 ' + subscribe.chatstart_time), pushEndTime: Moment('20200812 ' + subscribe.chatend_time)};
  });
}

export default async function userlookup(userToken){
  const reply = {ok: false, data: null, message: ''};
  const response = await Connection("POST", SUBSCRIBE_LOOKUP, {
    jwt: userToken
  });

  if(response.ok){
    reply.ok = true;
    reply.data = await convertSubscribeType(response.data.subscribed);
  }else{
    reply.message = response.message;
  }

  return reply;
}
