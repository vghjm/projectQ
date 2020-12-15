import React from 'react';
import * as ADDRESS from '../constant/ADDRESS';
import * as MESSAGE from '../constant/MESSAGE';
import { printStatus } from '../utils/Print';
import httpConnection from './httpConnection';

export default async function makeLink({token, d_ID, pdfType, debug=false}){
  let reply = {ok: false, data: null, message: ''};
  let response = await httpConnection(ADDRESS.MAKELINK, {jwt: token, d_ID: d_ID, pdfType: pdfType}, 'POST');

  if(response.ok){ // HTTP 상태 코드가 200~299일 경우
    let json = await response.json();

    if(json.res === 'fail') reply.message = MESSAGE.FAIL_ERROR;
    else if(json.res === 'noAuth') reply.message = MESSAGE.NO_AUTH_ERROR;
    else{
      reply.ok = true;
      reply.data = {linkname: json.linkname??null, htmls: json.htmls??null};
    }
  }else{
    reply.message = MESSAGE.NO_CONNECT_ERROR;
  }
  if(debug) printStatus('/connect/makeLink', reply);

  return reply;
}

// export async function makeLink(token, d_ID, pdfType){
//   let reply = {ok: false, data: null, message: ''};
//   let response = await httpConnection(Constants.MAKELINK, {jwt: token, d_ID: d_ID, pdfType: pdfType}, 'POST');
//   console.log('\nconnection makeLink param : ', {jwt: token, d_ID: d_ID, pdfType: pdfType});
//
//   if(response.ok){ // HTTP 상태 코드가 200~299일 경우
//     let json = await response.json();
//
//     if(json.res === 'fail') reply.message = Message.FAIL_ERROR;
//     else if(json.res === 'noAuth') reply.message = Message.NO_AUTH_ERROR;
//     else{
//       reply.ok = true;
//       //console.log('json\n', json);
//       reply.data = {linkname: json.linkname??null, htmls: json.htmls??null};
//     }
//   }else{
//     reply.message = Message.NO_CONNECT_ERROR;
//   }
//   console.log('\nconnection makeLink reply : ', reply);
//
//   return reply;
// }
