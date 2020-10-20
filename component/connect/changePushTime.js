import React from 'react';
import * as ADDRESS from '../constant/ADDRESS';
import * as MESSAGE from '../constant/MESSAGE';
import { printStatus } from '../utils/Print';
import httpConnection from './httpConnection';
import Moment from 'moment';

export default async function changePushTime({token, p_ID, pushStartTime, pushEndTime, pushType, debug=false}){
  let reply = {ok: false, data: null, message: ''};
  let data = {
    jwt: token,
    p_ID: p_ID,
    start_time: pushStartTime,
    end_time: pushEndTime,
    pushType: pushType,
  };
  let response = await httpConnection(ADDRESS.TIMESET, data, 'POST');

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
  if(debug) printStatus('/connect/changePushTime', reply);

  return reply;
}
