import React from 'react';




async function loginConnect(email, password){
  let response = await fetch(HTTP+'/user/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify({
      email: username,
      password: password
    }),
  });


}






export const HTTP = 'http://7672cb849f61.ngrok.io';
export const PUSH_REGISTRATION_ENDPOINT = HTTP + '/pushalarm/token';
export const MESSAGE_ENPOINT = HTTP + 'pushalarm/message';
export const LOGIN = HTTP + '/user/login';
export const SIGNUP = HTTP + '/user/signup';
export const CHECKEMAIL = HTTP + '/user/checkemail';
export const FINDPW = HTTP + '/user/findpw';
export const CHANGEPW = HTTP + '/user/changepw';

export const PRODUCT_LOOKUP = HTTP + '/product/lookup';
export const DIARY_LOOKUP = HTTP + '/diary/lookup';
export const DIARY_BACKUP = HTTP + '/diary/backup';
export const DIARY_DELETE = HTTP + '/diary/delete';

export const PUSHSET = HTTP + '/subscribe/pushsetting';
export const TIMESET = HTTP + '/subscribe/timesetting';

export const MAKELINK = HTTP + '/makelink';
export const SETPUSHTOKEN = HTTP + '/token';
export const MESSAGE = HTTP + '/message';
