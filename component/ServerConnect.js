import React from 'react';
import * as Constants from './utils/constants';
import {Alert} from 'react-native';
import _ from 'lodash'; // https://lodash.com/docs
import * as Message from './utils/Message';


export const httpConnection = async (address, data, type, timeout=4000) => {
  console.log('httpConnection: ', address);
  return Promise.race([
    fetch(address, {
      method: type,
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify(data),
    }),
    new Promise((n, reject) => setTimeout(() => reject(new Error('timeout')), timeout))
  ]).catch(e => console.log(e));
}

export async function login(email, password){
  let reply = {ok: false, data: null, message: ''};
  let response = await httpConnection(Constants.LOGIN, {email: email, password: password}, 'POST');

  if(response.ok){ // HTTP 상태 코드가 200~299일 경우
    let json = await response.json();

    if(json.res === 'no email') reply.message = Message.NO_EMAIL_ERROR;
    else if(json.res === 'password mismatch') reply.message = Message.PASSWORD_MISMATCH_ERROR;
    else if(json.res === 'success'){
      reply.ok = true;
      //console.log('json\n', json);
      reply.data = {token: json.token, username: json.name};
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
  console.log('load diary from server\n', reply);

  return reply;
}
export async function loadSubscribeDataFromServer(token){
  let reply = {ok: false, data: null, message: ''};
  let response = await httpConnection(Constants.SUBSCRIBE_LOOKUP, {jwt: token}, 'POST');

  if(response.ok){ // HTTP 상태 코드가 200~299일 경우
    let json = await response.json();

    if(json.res === 'fail') reply.message = Message.FAIL_ERROR;
    else if(json.res === 'noAuth') reply.message = Message.NO_AUTH_ERROR;
    else {
      reply.ok = true;
      //console.log('json\n', json);
      reply.data = json.subscribed;
    }
  }else{
    reply.message = Message.NO_CONNECT_ERROR;
  }
  console.log('load userdata from server\n', reply);

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

export async function downloadDiary(token){
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

  return reply;
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
