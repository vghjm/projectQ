import React from "react";
import ApiConnect from "../apiTemplate";
import { DIARY_LOOKUP } from "../URL";
import Moment from 'moment';

function diarySortByDate(myDiaryMessageList){
  // 다이어리 메세지들을 시간순으로 정렬
  myDiaryMessageList.sort((a, b) => {
    return a.createdAt > b.createdAt;
  });
}

function requestDataHandler(param){
  return {
    jwt: param.userToken
  }
}

function responseDataHandler(responseData){
  return responseData.diary.map(diary => {
    let diarymessageList = [];
    let _id = 1;
    diary.chating.forEach(chat => {
      diarymessageList.push({_id:_id, text:chat.chatcontent, createdAt:Moment(chat.time), islagacy:true, linkedMessageList: []})
      _id += 1;
    });

    diarySortByDate(diarymessageList);

    return {
      p_id: diary.dp_ID, 
      d_id: diary.d_ID,
      title: diary.dp_name,
      color: diary.color,
      pos: diary.position,
      makeTime: Moment(diary.chatedperiod_start),
      totalUpdateCount: diary.chatedamount,
      diarymessageList: diarymessageList
    };
  });
}

export default async function lookup(param){
  return await ApiConnect({
    method: "POST",
    url: DIARY_LOOKUP,
    data: requestDataHandler(param),
    responseDataHandler: responseData => responseDataHandler(responseData)
  })
}
