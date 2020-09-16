import React from 'react';
import * as Constants from '../utils/constants';
import {Alert} from 'react-native';
import _ from 'lodash'; // https://lodash.com/docs

const POST = 'POST';
const ERROR_MESSAGE_NO_CONNECT = 'no connect';
const ERROR_MESSAGE_UNKNOWN = 'unknown';
const ERROR_MESSAGE_NO_EMAIL = 'no email';
const ERROR_MESSAGE_PASSWORD_MISMATCHING = 'password mismatching';
const ERROR_MESSAGE_FAIL_SEND_EMAIL = 'fail send email';
const ERROR_MESSAGE_ALREADY_EXIST_EMAIL = 'already exist email';
const ERROR_MESSAGE_FAIL = 'register query fail';
const unkownErrorHandler = (data) => {
  Alert.alert(`Error: ${data}`);
  console.log('unkownErrorHandler\ndata: ', data);
};
const httpConnection = (address, data, type) => {
  return fetch(address, {
    method: type,
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify(data),
  });
}

export async function login(email, password){
  let reply = {ok: false, data: null, message: ''};
  let response = await httpConnection(Constants.LOGIN, {email: email, password: password}, POST);

  if(response.ok){ // HTTP 상태 코드가 200~299일 경우
    let json = await response.json();

    if(json.res === 'no email') reply.message = ERROR_MESSAGE_NO_EMAIL;
    else if(json.res === 'password mismatch') reply.message = ERROR_MESSAGE_PASSWORD_MISMATCHING;
    else if(json.res === 'success'){
      reply.ok = true;
      //console.log('json\n', json);
      reply.data = {token: json.token, username: json.name};
    }
    else reply.message = ERROR_MESSAGE_UNKNOWN;
  }else{
    reply.message = ERROR_MESSAGE_NO_CONNECT;
  }

  return reply;
}

export async function loadProductData(token){
  let response = await httpConnection(Constants.PRODUCT_LOOKUP, {jwt: token}, POST);
  let out = {status: false, data: null};

  const failedLoadProductData = () => {
    Alert.alert('상품정보 로딩에 실패하였습니다.');
  }
  const noAuthError = () => {
    Alert.alert('no AuthError.');
  }

  const loadData = (data) => {
    //Alert.alert('로그인 성공');
    //console.log('loadData - product\n', data);
    out = {
      status: true,
      data: data,
    };
  }

  if(response.ok){ // HTTP 상태 코드가 200~299일 경우
    // 응답 몬문을 받습니다.
    let json = await response.json();
    if(json.res === 'fail') failedLoadProductData();
    else if(json.res === 'noAuth') noAuthError();
    else loadData(json);

    return out;
  }else{
    Alert.alert(['Connection Failed', '서버와 연결이 되지 않습니다.']);
    return out;
  }
}

export async function loadDiaryData(token){
  let response = await httpConnection(Constants.DIARY_LOOKUP, {jwt: token}, POST);
  let out = {status: false, data: null};

  const failedLoadDiaryData = () => {
    Alert.alert('상품정보 로딩에 실패하였습니다.');
  }
  const noAuthError = () => {
    Alert.alert('no AuthError.');
  }

  const loadData = (data) => {
    //Alert.alert('로그인 성공');
    console.log('loadData - diary\n', data);
    out = {
      status: true,
      data: data,
    };
  }

  if(response.ok){ // HTTP 상태 코드가 200~299일 경우
    // 응답 몬문을 받습니다.
    let json = await response.json();
    if(json.res === 'failed') failedLoadDiaryData();
    else if(json.res === 'noAuth') noAuthError();
    else loadData(json);

    return out;
  }else{
    Alert.alert(['Connection Failed', '서버와 연결이 되지 않습니다.']);
    return out;
  }
}

export async function signUp(email, password, username){
  let reply = {ok: false, data: null, message: ''};
  let response = await httpConnection(Constants.SIGNUP, {email: email, password: password, name:username}, POST);

  if(response.ok){ // HTTP 상태 코드가 200~299일 경우
    let json = await response.json();

    if(json.res === 'fail') reply.message = ERROR_MESSAGE_FAIL;
    else if(json.res === 'success'){
      reply.ok = true;
      //console.log('json\n', json);
    }
    else reply.message = ERROR_MESSAGE_UNKNOWN;
  }else{
    reply.message = ERROR_MESSAGE_NO_CONNECT;
  }

  return reply;
}

export async function checkEmail(email){
  let reply = {ok: false, data: null, message: ''};
  let response = await httpConnection(Constants.CHECKEMAIL, {email: email}, POST);

  if(response.ok){ // HTTP 상태 코드가 200~299일 경우
    let json = await response.json();

    if(json.res === 'already existing email') reply.message = ERROR_MESSAGE_ALREADY_EXIST_EMAIL;
    else if(json.res === 'success'){
      reply.ok = true;
    }
    else reply.message = ERROR_MESSAGE_UNKNOWN;
  }else{
    reply.message = ERROR_MESSAGE_NO_CONNECT;
  }

  return reply;
}

export async function findpw(email){
  let reply = {ok: false, data: null, message: ''};
  let response = await httpConnection(Constants.FINDPW, {email: email}, POST);

  if(response.ok){ // HTTP 상태 코드가 200~299일 경우
    let json = await response.json();

    if(json.res === 'fail') reply.message = ERROR_MESSAGE_FAIL_SEND_EMAIL;
    else if(json.res === 'noEmail') reply.message = ERROR_MESSAGE_NO_EMAIL;
    else if(json.res === 'success') {
      reply.ok = true;
    }
    else reply.message = ERROR_MESSAGE_UNKNOWN;
  }else{
    reply.message = ERROR_MESSAGE_NO_CONNECT;
  }

  return reply;
}

export async function changepw(email, token){
  let response = await httpConnection(Constants.CHANGEPW, {email: email, jwt:token}, POST);
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
