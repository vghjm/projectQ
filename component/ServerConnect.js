import React from 'react';
import * as Constants from '../utils/constants';
import {Alert} from 'react-native';
import _ from 'lodash'; // https://lodash.com/docs

const POST = 'POST';
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
    // 응답 몬문을 받습니다.
    let json = await response.json();
    if(json.res === 'no email') reply.message = 'noEmail';
    else if(json.res === 'password mismatch') reply.message = 'passwordMismatching';
    else if(json.res === 'success'){
      reply.ok = true;
      reply.data = {token: json.token, username: json.username};
    }
    else reply.message = 'unkown';
  }else{
    reply.message = 'noConnect';
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
  let response = await httpConnection(Constants.SIGNUP, {email: email, password: password, name:username}, POST);
  let out = {status: false, data: null};

  const fail = () => {
    Alert.alert('회원가입에 실패하였습니다.');
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
    else if(json.res === 'fail') fail();
    else unkownErrorHandler(json);

    return out;
  }else{
    Alert.alert(['Connection Failed', '서버와 연결이 되지 않습니다.']);
    return out;
  }
}

export async function checkmail(email){
  let response = await httpConnection(Constants.CHECKEMAIL, {email: email}, POST);
  let out = {status: false, data: null};

  const fail = () => {
    Alert.alert('이미 있는 이메일입니다.');
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
    else if(json.res === 'already existing email') fail();
    else unkownErrorHandler(json);

    return out;
  }else{
    Alert.alert(['Connection Failed', '서버와 연결이 되지 않습니다.']);
    return out;
  }
}

export async function findpw(email){
  let response = await httpConnection(Constants.FINDPW, {email: email}, POST);
  let out = {status: false, data: null};

  const fail = () => {
    Alert.alert('이메일 인증에 실패했습니다.');
  }

  const noEmail = () => {
    Alert.alert('없는 이메일 입니다.\n이메일 형식을 다시 확인해주세요.');
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
    else if(json.res === 'fail') fail();
    else if(json.res === 'noEmail') noEmail();
    else unkownErrorHandler(json);

    return out;
  }else{
    Alert.alert(['Connection Failed', '서버와 연결이 되지 않습니다.']);
    return out;
  }
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
