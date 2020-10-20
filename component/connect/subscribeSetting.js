import React from 'react';
import * as ADDRESS from '../constant/ADDRESS';
import * as MESSAGE from '../constant/MESSAGE';
import { printStatus } from '../utils/Print';
import httpConnection from './httpConnection';

export default async function subscribeSetting({token, title, p_id, s_id, pushStartTime, pushEndTime, pushType, isSubscribe, debug=false}){
  let reply = {ok: false, data: null, message: ''};
  let response = await httpConnection(ADDRESS.PUSHSET, {
    jwt: token,
    p_ID: p_id,
    p_name: title,
    d_ID: s_id,
    start_time: pushStartTime,
    end_time: pushEndTime,
    pushType: pushType,
    subscribe: isSubscribe?1:0
  }, 'POST');

  if(response.ok){ // HTTP 상태 코드가 200~299일 경우
    let json = await response.json();

    if(json.res === 'fail') reply.message = MESSAGE.FAIL_ERROR;
    else if(json.res === 'noAuth') reply.message = MESSAGE.NO_AUTH_ERROR;
    else if(json.res === 'success'){
      reply.ok = true;
    }
    else reply.message = MESSAGE.UNKNOWN_ERROR;
  }else{
    reply.message = MESSAGE.NO_CONNECT_ERROR;
  }
  if(debug) printStatus('/connect/subscribe', reply);

  return reply;
}
