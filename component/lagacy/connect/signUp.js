import React from 'react';
import * as ADDRESS from '../constant/ADDRESS';
import * as MESSAGE from '../constant/MESSAGE';
import { printStatus } from '../utils/Print';
import httpConnection from './httpConnection';

export default async function signUp({email, password, username, debug=false}){
  let reply = {ok: false, data: null, message: ''};
  let response = await httpConnection(ADDRESS.SIGNUP, {email: email, password: password, name:username}, 'POST');

  if(response.ok){ // HTTP 상태 코드가 200~299일 경우
    let json = await response.json();

    if(json.res === 'fail') reply.message = MESSAGE.FAIL_ERROR;
    else if(json.res === 'success'){
      reply.ok = true;
    }
    else reply.message = MESSAGE.UNKNOWN_ERROR;
  }else{
    reply.message = MESSAGE.NO_CONNECT_ERROR;
  }
  if(debug) printStatus('/connect/signUp', reply);

  return reply;
}

// export async function signUp(email, password, username){
//   let reply = {ok: false, data: null, message: ''};
//   let response = await httpConnection(Constants.SIGNUP, {email: email, password: password, name:username}, 'POST');
//
//   if(response.ok){ // HTTP 상태 코드가 200~299일 경우
//     let json = await response.json();
//
//     if(json.res === 'fail') reply.message = Message.FAIL_ERROR;
//     else if(json.res === 'success'){
//       reply.ok = true;
//       //console.log('json\n', json);
//     }
//     else reply.message = Message.UNKNOWN_ERROR;
//   }else{
//     reply.message = Message.NO_CONNECT_ERROR;
//   }
//
//   return reply;
// }
