import React from 'react';
import * as ADDRESS from '../constant/ADDRESS';
import * as MESSAGE from '../constant/MESSAGE';
import { printStatus } from '../utils/Print';
import httpConnection from './httpConnection';
import Moment from 'moment';


export default async function diaryBackup({backupDiaryList, token, debug=false}){
  let reply = {ok: false, data: null, message: ''};
  let response = await httpConnection(ADDRESS.DIARY_BACKUP, {jwt: token, diary: backupDiaryList}, 'POST');

  if(debug) console.log('  > diaryBackup/params\n', backupDiaryList);

  if(response.ok){ // HTTP 상태 코드가 200~299일 경우
    let json = await response.json();

    if(json.res === 'fail') reply.message = MESSAGE.FAIL_ERROR;
    else if(json.res === 'noAuth') reply.message = MESSAGE.NO_AUTH_ERROR;
    else if(json.res === 'success'){
      reply.ok = true;
    }
    else reply.message = MESSAGE.UNKNOWN_ERROR;
  }else{
    reply.message = MESSAGE.NO_CONNECT_ERROR;
  }
  if(debug) printStatus('/connect/diaryBackup', reply);

  return reply;
}

// async function diaryBackup(){
//   if(!userData){
//     console.log('ERROR : 로그인 없는 diary backup 탐지');
//     return -1;
//   }
  // let backupDiary = [];
  // dataList.forEach( data => {
  //   if(data.hasDiary){
  //     let diaryData = data.diary;
  //     let productData = data.product;
  //     let myDiary = userData.myDiaryList[userData.myDiaryList.findIndex(obj => obj.id === data.id)];
  //     let diaryMessage = diaryData.diarymessageList.map(message => {
  //       let content = '';
  //       if(message.islagacy){
  //         content = message.text;
  //       }else{
  //         message.linkedMessageList.forEach(linkedMessage => {
  //           if(content === '') content = linkedMessage.text;
  //           else content += ' ' + linkedMessage.text;
  //         })
  //       }
  //       return {
  //         dm_ID: message._id,
  //         chatcontent: content,
  //         chatedtime: message.createdAt,
  //       }
  //     });
  //     let diaryBackupData = {
  //       d_ID: diaryData.id,
  //       p_ID: data.id,
  //       p_name: productData.title,
  //       chatedperiod_start: diaryData.makeTime.format('YYYYMMDD'),
  //       chatedperiod_end: Moment().format('YYYYMMDD'),
  //       chatedamount: diaryData.totalUpdateCount,
  //       linkname: 'temp',
  //       color: myDiary.color,
  //       position: myDiary.pos,
  //       diaryMessage: diaryMessage,
  //     }
  //     backupDiary.push(_.cloneDeep(diaryBackupData));
  //   }
  // });
  // console.log('diary backup', backupDiary);
  // let response = await Connection.diaryBackUp(userData.token, backupDiary);
  // if(response.ok){
  //   console.log('다이어리 백업 성공!');
  // }else{
  //   console.log('ERROR : 다이어리 백업 실패 , ', response.message);
  // }
// }


// export async function diaryBackUp(token, diaryData){
//   let reply = {ok: false, data: null, message: ''};
//   let data = {
//     jwt: token,
//     diary: diaryData,
//   };
//   console.log('\n@테스트 diaryBackUp 입력값\n', data);
//   let response = await httpConnection(Constants.DIARY_BACKUP, data, 'POST');
//
//   if(response.ok){ // HTTP 상태 코드가 200~299일 경우
//     let json = await response.json();
//
//     if(json.res === 'fail') reply.message = Message.FAIL_ERROR;
//     else if(json.res === 'noAuth') reply.message = Message.NO_AUTH_ERROR;
//     else if(json.res === 'success'){
//       reply.ok = true;
//     }
//     else reply.message = Message.UNKNOWN_ERROR;
//   }else{
//     reply.message = Message.NO_CONNECT_ERROR;
//   }
//
//   return reply;
// }
