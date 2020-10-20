import React from 'react';
import * as ADDRESS from '../constant/ADDRESS';
import * as MESSAGE from '../constant/MESSAGE';
import { printStatus } from '../utils/Print';
import httpConnection from './httpConnection';
import Moment from 'moment';

async function convertSubscribeType(serverType){

  return await serverType.map(subscribe => {
    return {p_id: subscribe.p_ID, s_id: subscribe.d_ID, pushStartTime: Moment('20200812 ' + subscribe.chatstart_time), pushEndTime: Moment('20200812 ' + subscribe.chatend_time)};
  });
}

export default async function downloadSubscribeData({token, debug=false}){
  let reply = {ok: false, data: null, message: ''};
  let response = await httpConnection(ADDRESS.SUBSCRIBE_LOOKUP, {jwt: token}, 'POST');

  if(response.ok){ // HTTP 상태 코드가 200~299일 경우
    let json = await response.json();

    if(json.res === 'fail') reply.message = MESSAGE.FAIL_ERROR;
    else if(json.res === 'noAuth') reply.message = MESSAGE.NO_AUTH_ERROR;
    else {
      reply.ok = true;
      reply.data = await convertSubscribeType(json.subscribed);
    }
  }else{
    reply.message = MESSAGE.NO_CONNECT_ERROR;
  }
  if(debug) printStatus('/connect/downloadSubscribeData', reply);

  return reply;
}
