import React from 'react';
import * as Constants from './utils/constants';
import {Alert} from 'react-native';
import _ from 'lodash'; // https://lodash.com/docs
import * as Message from './utils/Message';


export async function subscribe(data){
  let reply = {ok: false, data: null, message: ''};
  let response = await httpConnection(Constants.PUSHSET, data, 'POST');

  if(response.ok){ // HTTP 상태 코드가 200~299일 경우
    let json = await response.json();

    if(json.res === 'fail') reply.message = Message.FAIL_ERROR;
    else if(json.res === 'noAuth') reply.message = Message.NO_AUTH_ERROR;
    else if(json.res === 'success'){
      reply.ok = true;
      //console.log('json\n', json);
    }
    else reply.message = Message.UNKNOWN_ERROR;
  }else{
    reply.message = Message.NO_CONNECT_ERROR;
  }

  return reply;
}
export async function loadDiaryDataFromServer(token){
  let reply = {ok: false, data: null, message: ''};
  let response = await httpConnection(Constants.DIARY_LOOKUP, {jwt: token}, 'POST');


  if(response.ok){ // HTTP 상태 코드가 200~299일 경우
    let json = await response.json();
    if(json.res === 'fail') reply.message = Message.FAIL_ERROR;
    else if(json.res === 'noAuth') reply.message = Message.NO_AUTH_ERROR;
    else {
      reply.ok = true;
      //console.log('json\n', json);
      reply.data = json.diary;
    }
  }else{
    reply.message = Message.NO_CONNECT_ERROR;
  }
  //console.log('load diary from server\n', reply);

  return reply;
}


export async function signUp(email, password, username){
  let reply = {ok: false, data: null, message: ''};
  let response = await httpConnection(Constants.SIGNUP, {email: email, password: password, name:username}, 'POST');

  if(response.ok){ // HTTP 상태 코드가 200~299일 경우
    let json = await response.json();

    if(json.res === 'fail') reply.message = Message.FAIL_ERROR;
    else if(json.res === 'success'){
      reply.ok = true;
      //console.log('json\n', json);
    }
    else reply.message = Message.UNKNOWN_ERROR;
  }else{
    reply.message = Message.NO_CONNECT_ERROR;
  }

  return reply;
}
export async function checkEmail(email){
  let reply = {ok: false, data: null, message: ''};
  let response = await httpConnection(Constants.CHECKEMAIL, {email: email}, 'POST');

  if(response.ok){ // HTTP 상태 코드가 200~299일 경우
    let json = await response.json();

    if(json.res === 'already existing email') reply.message = Message.ALREADY_EXISTING_EMAIL_ERROR;
    else if(json.res === 'success'){
      reply.ok = true;
    }
    else reply.message = Message.UNKNOWN_ERROR;
  }else{
    reply.message = Message.NO_CONNECT_ERROR;
  }

  return reply;
}
export async function findpw(email){
  let reply = {ok: false, data: null, message: ''};
  let response = await httpConnection(Constants.FINDPW, {email: email}, 'POST');

  if(response.ok){ // HTTP 상태 코드가 200~299일 경우
    let json = await response.json();

    if(json.res === 'fail') reply.message = Message.FAIL_ERROR;
    else if(json.res === 'noEmail') reply.message = Message.NO_EMAIL_ERROR;
    else if(json.res === 'success') {
      reply.ok = true;
    }
    else reply.message = Message.UNKNOWN_ERROR;
  }else{
    reply.message = Message.NO_CONNECT_ERROR;
  }

  return reply;
}
export async function changepw(email, token){
  let response = await httpConnection(Constants.CHANGEPW, {email: email, jwt:token}, 'POST');
  let out = {status: false, data: null};

  const noAuth = () => {
    Alert.alert('권한이 없습니다.');
  }

  const success = () => {
    //Alert.alert('로그인 성공');
    out = {
      status: true,
      data:null,
    };
    //console.log('data: ', data);
    //console.log('out: ', out);
  }

  if(response.ok){ // HTTP 상태 코드가 200~299일 경우
    // 응답 몬문을 받습니다.
    let json = await response.json();
    if(json.res === 'success') success();
    else if(json.res === 'noAuth') noAuth();
    else unkownErrorHandler(json);

    return out;
  }else{
    Alert.alert(['Connection Failed', '서버와 연결이 되지 않습니다.']);
    return out;
  }
}

export async function downloadUserdata(token){
  let reply = {ok: false, data: null, message: ''};
  let response = await httpConnection(Constants.SUBSCRIBE_LOOKUP, {jwt: token}, 'POST');

  if(response.ok){ // HTTP 상태 코드가 200~299일 경우
    let json = await response.json();
    console.log('downloadUserdata\n', json);

    if(json.res === 'fail') reply.message = Message.FAIL_ERROR;
    else if(json.res === 'noAuth') reply.message = Message.NO_AUTH_ERROR;
    else {
      reply.ok = true;
      //console.log('json\n', json);
      reply.data = json.res;
    }
  }else{
    reply.message = Message.NO_CONNECT_ERROR;
  }

  return reply;
}

export async function makeLink(token, d_ID, pdfType){
  let reply = {ok: false, data: null, message: ''};
  let response = await httpConnection(Constants.MAKELINK, {jwt: token, d_ID: d_ID, pdfType: pdfType}, 'POST');
  console.log('\nconnection makeLink param : ', {jwt: token, d_ID: d_ID, pdfType: pdfType});

  if(response.ok){ // HTTP 상태 코드가 200~299일 경우
    let json = await response.json();

    if(json.res === 'fail') reply.message = Message.FAIL_ERROR;
    else if(json.res === 'noAuth') reply.message = Message.NO_AUTH_ERROR;
    else{
      reply.ok = true;
      //console.log('json\n', json);
      reply.data = {linkname: json.linkname??null, htmls: json.htmls??null};
    }
  }else{
    reply.message = Message.NO_CONNECT_ERROR;
  }
  console.log('\nconnection makeLink reply : ', reply);

  return reply;
}
export async function chatReply(token, q_ID, message){
  let reply = {ok: false, data: null, message: ''};
  let response = await httpConnection(Constants.CHATREPLY, {token: token, q_ID: q_ID, message: message}, 'POST');
  console.log('\nconnection chatReply param : ', {token: token, q_ID: q_ID, message: message});

  if(response.ok){ // HTTP 상태 코드가 200~299일 경우
    let json = await response.json();

    if(json.res === 'success') {
      reply.ok = true;
    }else{
      reply.message = Message.UNKNOWN_ERROR;
    }
  }else{
    reply.message = Message.NO_CONNECT_ERROR;
  }
  console.log('\nconnection chatReply reply : ', reply);

  return reply;
}

export async function changeTime(token, p_ID, pushStartTime, pushEndTime, pushType){
  let reply = {ok: false, data: null, message: ''};
  let data = {
    jwt: token,
    p_ID: p_ID,
    start_time: pushStartTime,
    end_time: pushEndTime,
    pushType: pushType,
  };
  let response = await httpConnection(Constants.TIMESET, data, 'POST');

  if(response.ok){ // HTTP 상태 코드가 200~299일 경우
    let json = await response.json();

    if(json.res === 'fail') reply.message = Message.FAIL_ERROR;
    else if(json.res === 'noAuth') reply.message = Message.NO_AUTH_ERROR;
    else if(json.res === 'success'){
      reply.ok = true;
    }
    else reply.message = Message.UNKNOWN_ERROR;
  }else{
    reply.message = Message.NO_CONNECT_ERROR;
  }

  return reply;
}
export async function diaryBackUp(token, diaryData){
  let reply = {ok: false, data: null, message: ''};
  let data = {
    jwt: token,
    diary: diaryData,
  };
  console.log('\n@테스트 diaryBackUp 입력값\n', data);
  let response = await httpConnection(Constants.DIARY_BACKUP, data, 'POST');

  if(response.ok){ // HTTP 상태 코드가 200~299일 경우
    let json = await response.json();

    if(json.res === 'fail') reply.message = Message.FAIL_ERROR;
    else if(json.res === 'noAuth') reply.message = Message.NO_AUTH_ERROR;
    else if(json.res === 'success'){
      reply.ok = true;
    }
    else reply.message = Message.UNKNOWN_ERROR;
  }else{
    reply.message = Message.NO_CONNECT_ERROR;
  }

  return reply;
}
export async function diaryDelete(token, d_ID){
  let reply = {ok: false, data: null, message: ''};
  let data = {
    jwt: token,
    d_ID: d_ID,
  };
  let response = await httpConnection(Constants.DIARY_DELETE, data, 'POST');

  if(response.ok){ // HTTP 상태 코드가 200~299일 경우
    let json = await response.json();

    if(json.res === 'fail') reply.message = Message.FAIL_ERROR;
    else if(json.res === 'noAuth') reply.message = Message.NO_AUTH_ERROR;
    else if(json.res === 'success'){
      reply.ok = true;
    }
    else reply.message = Message.UNKNOWN_ERROR;
  }else{
    reply.message = Message.NO_CONNECT_ERROR;
  }

  return reply;
}
