import React from 'react';
import * as ADDRESS from '../constant/ADDRESS';
import * as MESSAGE from '../constant/MESSAGE';
import { printStatus } from '../utils/Print';
import httpConnection from './httpConnection';

export default async function deleteDiaryFromServer({token, d_id, debug=false}){
  let reply = {ok: false, data: null, message: ''};
  let response = await httpConnection(ADDRESS.DIARY_DELETE, {jwt: token, d_ID: d_id}, 'POST');

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
  if(debug) printStatus('/connect/deleteDiaryFromServer', reply);

  return reply;
}
