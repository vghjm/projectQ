import React from 'react';
import * as ADDRESS from '../constant/ADDRESS';
import * as MESSAGE from '../constant/MESSAGE';
import { printStatus } from '../utils/Print';
import httpConnection from './httpConnection';

export default async function requestChatReply({token, p_id, d_id, message, debug=false}){
  let reply = {ok: false, data: null, message: ''};
  let response = await httpConnection(ADDRESS.CHATREPLY, {token: token, p_ID: p_id, d_ID: d_id, q_ID: message.q_ID, message: message.content}, 'POST');

  if(response.ok){ // HTTP 상태 코드가 200~299일 경우
    let json = await response.json();

    if(json.res === 'success') {
      reply.ok = true;
    }else{
      reply.message = MESSAGE.UNKNOWN_ERROR;
    }
  }else{
    reply.message = MESSAGE.NO_CONNECT_ERROR;
  }
  if(debug) printStatus('/connect/reqestChatReply', reply);

  return reply;
}

// export async function chatReply(token, q_ID, message){
//   let reply = {ok: false, data: null, message: ''};
//   let response = await httpConnection(Constants.CHATREPLY, {token: token, q_ID: q_ID, message: message}, 'POST');
//   console.log('\nconnection chatReply param : ', {token: token, q_ID: q_ID, message: message});
//
//   if(response.ok){ // HTTP 상태 코드가 200~299일 경우
//     let json = await response.json();
//
//     if(json.res === 'success') {
//       reply.ok = true;
//     }else{
//       reply.message = Message.UNKNOWN_ERROR;
//     }
//   }else{
//     reply.message = Message.NO_CONNECT_ERROR;
//   }
//   console.log('\nconnection chatReply reply : ', reply);
//
//   return reply;
// }
