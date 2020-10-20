import React from 'react';
import * as ADDRESS from '../constant/ADDRESS';
import * as MESSAGE from '../constant/MESSAGE';
import { printStatus } from '../utils/Print';
import httpConnection from './httpConnection';

export default async function checkEmail({email, debug=false}){
  let reply = {ok: false, data: null, message: ''};
  let response = await httpConnection(ADDRESS.CHECKEMAIL, {email: email}, 'POST');

  if(response.ok){ // HTTP 상태 코드가 200~299일 경우
    let json = await response.json();

    if(json.res === 'already existing email') reply.message = MESSAGE.ALREADY_EXISTING_EMAIL_ERROR;
    else if(json.res === 'success'){
      reply.ok = true;
    }
    else reply.message = MESSAGE.UNKNOWN_ERROR;
  }else{
    reply.message = MESSAGE.NO_CONNECT_ERROR;
  }
  if(debug) printStatus('/connect/checkEmail', reply);

  return reply;
}

// export async function checkEmail(email){
//   let reply = {ok: false, data: null, message: ''};
//   let response = await httpConnection(Constants.CHECKEMAIL, {email: email}, 'POST');
//
//   if(response.ok){ // HTTP 상태 코드가 200~299일 경우
//     let json = await response.json();
//
//     if(json.res === 'already existing email') reply.message = Message.ALREADY_EXISTING_EMAIL_ERROR;
//     else if(json.res === 'success'){
//       reply.ok = true;
//     }
//     else reply.message = Message.UNKNOWN_ERROR;
//   }else{
//     reply.message = Message.NO_CONNECT_ERROR;
//   }
//
//   return reply;
// }
