import React from 'react';
import { serverConnect } from './server';
import uuid from 'react-native-uuid';

const quit = () => console.log('connect/server 테스트 종료\n');
const error = message => {
  console.log(' > error : ', message);
  quit();
}
const confirm = message => console.log(' > confirm : ', message);

export default async function start(){
  console.log('connect/server 테스트 시작')
  const testParam = {
    email: `test${uuid.v4().replace(/\-/g, '')}@test.com`,
    password: `${uuid.v4().replace(/\-/g, '')}!!`,
    userName: "테스트계정",
    userToken: null,
    productList: null,
    subscribeList: null
  }
  const chekableEmail = '77eric@naver.com';
  let response;

  // userCheckemail
  console.log(' > userCheckemail 테스트');
  response = await serverConnect.userCheckemail(testParam);
  if(!response.ok) return error(response.message);
  confirm(response.message);

  // userSignup
  console.log(' > userSignup 테스트');
  response = await serverConnect.userSignup(testParam);
  if(!response.ok) return error(response.message);
  confirm(response.message);

  // userLogin
  console.log(' > userLogin 테스트');
  response = await serverConnect.userLogin(testParam);
  if(!response.ok) return error(response.message);
  confirm(response.message);
  testParam.userToken = response.data.userToken;
  testParam.userName = response.data.userName;

  // productLookup
  console.log(' > productLookup 테스트');
  response = await serverConnect.productLookup();
  if(!response.ok) return error(response.message);
  confirm(response.message);
  testParam.productList = response.data;

  // productUserlookup
  console.log(' > productUserlookup 테스트');
  response = await serverConnect.productUserlookup(testParam);
  if(!response.ok) return error(response.message);
  confirm(response.message);
  testParam.subscribeList = response.data;

  // subscribePushsetting

  // subscribeTimesetting

  // diaryLookup

  // diaryBackup

  // diaryDelete


  // makelink

  // chatReply

  // setPushAlarm

  // registPushToken

  // pushalarmSuccess

  // pushalarmChatLogBackUp

  // userChangepw
  console.log(' > userChangepw 테스트');
  response = await serverConnect.userChangepw(testParam);
  if(!response.ok) return error(response.message);
  confirm(response.message);

  // userLogout
  console.log(' > userLogout 테스트');
  response = await serverConnect.userLogout(testParam);
  if(!response.ok) return error(response.message);
  confirm(response.message);

  // userFindpw
  // 이메일 전송
  console.log(' > userFindpw 테스트');
  response = await serverConnect.userFindpw({email: chekableEmail});
  if(!response.ok) return error(response.message);
  confirm(response.message);

  quit();
}
