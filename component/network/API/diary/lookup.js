import React from "react";
import Connection from "../../apiTemplate";
import {DIARY_LOOKUP} from "../../URL";
import Moment from 'moment';

function diarySortByDate(myDiaryMessageList){
  // 다이어리 메세지들을 시간순으로 정렬
  myDiaryMessageList.sort((a, b) => {
    return a.createdAt > b.createdAt;
  });
}

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

export default async function diaryLookup({token}){
  const reply = {ok: false, data: null, message: ''};
  const response = await Connection("POST", DIARY_LOOKUP, {
    jwt: token
  });

  if(response.ok){
    reply.ok = true;
    reply.data = await convertDiaryType(response.data.diary);
  }else{
    reply.message = response.message;
  }

  return reply;
}
