import React from 'react';
import * as ADDRESS from '../constant/ADDRESS';
import * as MESSAGE from '../constant/MESSAGE';
import { printStatus } from '../utils/Print';
import httpConnection from './httpConnection';

export default async function findPassword({email, debug=false}){
  let reply = {ok: false, data: null, message: ''};
  let response = await httpConnection(ADDRESS.FINDPW, {email: email}, 'POST');

  if(response.ok){ // HTTP 상태 코드가 200~299일 경우
    let json = await response.json();

    if(json.res === 'fail') reply.message = MESSAGE.FAIL_ERROR;
    else if(json.res === 'noEmail') reply.message = MESSAGE.NO_EMAIL_ERROR;
    else if(json.res === 'success') {
      reply.ok = true;
    }
    else reply.message = MESSAGE.UNKNOWN_ERROR;
  }else{
    reply.message = MESSAGE.NO_CONNECT_ERROR;
  }
  if(debug) printStatus('/connect/findPassword', reply);

  return reply;
}

// export async function findpw(email){
//   let reply = {ok: false, data: null, message: ''};
//   let response = await httpConnection(Constants.FINDPW, {email: email}, 'POST');
//
//   if(response.ok){ // HTTP 상태 코드가 200~299일 경우
//     let json = await response.json();
//
//     if(json.res === 'fail') reply.message = Message.FAIL_ERROR;
//     else if(json.res === 'noEmail') reply.message = Message.NO_EMAIL_ERROR;
//     else if(json.res === 'success') {
//       reply.ok = true;
//     }
//     else reply.message = Message.UNKNOWN_ERROR;
//   }else{
//     reply.message = Message.NO_CONNECT_ERROR;
//   }
//
//   return reply;
// }
