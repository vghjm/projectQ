import React from 'react';
import * as ADDRESS from '../constant/ADDRESS';
import * as MESSAGE from '../constant/MESSAGE';
import { printStatus } from '../utils/Print';
import httpConnection from './httpConnection';

export default async function login({email, password, debug=false}){
  let reply = {ok: false, data: null, message: ''};
  let response = await httpConnection(ADDRESS.LOGIN, {email: email, password: password}, 'POST');

  if(response.ok){ // HTTP 상태 코드가 200~299일 경우
    let json = await response.json();

    if(json.res === 'no email') reply.message = MESSAGE.NO_EMAIL_ERROR;
    else if(json.res === 'password mismatch') reply.message = MESSAGE.PASSWORD_MISMATCH_ERROR;
    else if(json.res === 'success'){
      reply.ok = true;
      reply.data = {token: json.token, username: json.name};
    }
    else reply.message = MESSAGE.UNKNOWN_ERROR;
  }else{
    reply.message = MESSAGE.NO_CONNECT_ERROR;
  }
  if(debug) printStatus('/connect/login', reply);

  return reply;
}
