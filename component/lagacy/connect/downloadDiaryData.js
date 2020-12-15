import React from 'react';
import * as ADDRESS from '../constant/ADDRESS';
import * as MESSAGE from '../constant/MESSAGE';
import { printStatus } from '../utils/Print';
import httpConnection from './httpConnection';
import Moment from 'moment';
import { diarySortByDate } from '../utils/utils';

async function convertDiaryType(serverType){

  return await serverType.map(diary => {
    let diarymessageList = [];
    let _id = 1;
    diary.chating.forEach(chat => {
      diarymessageList.push({_id:_id, text:chat.chatcontent, createdAt:Moment(chat.time), islagacy:true, linkedMessageList: []})
      _id += 1;
    });
    diarySortByDate(diarymessageList);
    return {
      p_id: diary.dp_ID, d_id: diary.d_ID, title: diary.dp_name, color: diary.color, pos: diary.position, makeTime: Moment(diary.chatedperiod_start), totalUpdateCount: diary.chatedamount,
      diarymessageList: diarymessageList
    };
  });
}

export default async function downloadDiaryData({jwt, debug=false}){
  let reply = {ok: false, data: null, message: ''};
  let response = await httpConnection(ADDRESS.DIARY_LOOKUP, {jwt: jwt}, 'POST');

  if(response.ok){ // HTTP 상태 코드가 200~299일 경우
    let json = await response.json();
    if(json.res === 'fail') reply.message = MESSAGE.FAIL_ERROR;
    else if(json.res === 'noAuth') reply.message = MESSAGE.NO_AUTH_ERROR;
    else {
      reply.ok = true;
      reply.data = await convertDiaryType(json.diary);
      //console.log(' >>> diaryData\n', json.diary);
    }
  }else{
    reply.message = MESSAGE.NO_CONNECT_ERROR;
  }
  if(debug) printStatus('/connect/downloadDiaryData', reply);

  return reply;
}
// export async function loadDiaryDataFromServer(token){
//   let reply = {ok: false, data: null, message: ''};
//   let response = await httpConnection(Constants.DIARY_LOOKUP, {jwt: token}, 'POST');
//
//
//   if(response.ok){ // HTTP 상태 코드가 200~299일 경우
//     let json = await response.json();
//     if(json.res === 'fail') reply.message = Message.FAIL_ERROR;
//     else if(json.res === 'noAuth') reply.message = Message.NO_AUTH_ERROR;
//     else {
//       reply.ok = true;
//       //console.log('json\n', json);
//       reply.data = json.diary;
//     }
//   }else{
//     reply.message = Message.NO_CONNECT_ERROR;
//   }
//   //console.log('load diary from server\n', reply);
//
//   return reply;
// }
