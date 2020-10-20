import React from 'react';
import * as ADDRESS from '../constant/ADDRESS';
import * as MESSAGE from '../constant/MESSAGE';
import { printStatus } from '../utils/Print';
import httpConnection from './httpConnection';

export default async function changePassword({email, token, debug=false}){
  let reply = {ok: false, data: null, message: ''};
  let response = await httpConnection(ADDRESS.CHANGEPW, {email: email, jwt:token}, 'POST');

  if(response.ok){ // HTTP 상태 코드가 200~299일 경우
    let json = await response.json();

    if(json.res === 'noAuth') reply.message = MESSAGE.NO_AUTH_ERROR;
    else if(json.res === 'success') {
      reply.ok = true;
    }
    else reply.message = MESSAGE.UNKNOWN_ERROR;
  }else{
    reply.message = MESSAGE.NO_CONNECT_ERROR;
  }
  if(debug) printStatus('/connect/changePassword', reply);

  return reply;
}

// export async function changepw(email, token){
//   let response = await httpConnection(Constants.CHANGEPW, {email: email, jwt:token}, 'POST');
//   let out = {status: false, data: null};
//
//   const noAuth = () => {
//     Alert.alert('권한이 없습니다.');
//   }
//
//   const success = () => {
//     //Alert.alert('로그인 성공');
//     out = {
//       status: true,
//       data:null,
//     };
//     //console.log('data: ', data);
//     //console.log('out: ', out);
//   }
//
//   if(response.ok){ // HTTP 상태 코드가 200~299일 경우
//     // 응답 몬문을 받습니다.
//     let json = await response.json();
//     if(json.res === 'success') success();
//     else if(json.res === 'noAuth') noAuth();
//     else unkownErrorHandler(json);
//
//     return out;
//   }else{
//     Alert.alert(['Connection Failed', '서버와 연결이 되지 않습니다.']);
//     return out;
//   }
// }
