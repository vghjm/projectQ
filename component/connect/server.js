import React from 'react';
import userLogin from './API/user/login';
import userSignup from './API/user/signup';
import userCheckemail from './API/user/checkemail';
import userFindpw from './API/user/findpw';
import userChangepw from './API/user/changepw';
import userLogout from './API/user/logout';
import productLookup from './API/product/lookup';
import productUserlookup from './API/product/userlookup';
import subscribePushsetting from './API/subscribe/pushsetting';
import subscribeTimesetting from './API/subscribe/timesetting';
import diaryLookup from './API/diary/lookup';
import diaryBackup from './API/diary/backup';
import diaryDelete from './API/diary/delete';
import makelink from './API/_/makelink';
import chatReply from './API/_/chatting';
import setPushAlarm from './API/pushalarm/_';
import registPushToken from './API/pushalarm/token';
import pushalarmSuccess from './API/pushalarm/success';
import pushalarmChatLogBackUp from './API/pushalarm/chatLogBackUp';


export const serverConnect = {
  // @ Param
  // email
  // password
  // @ Data
  // .userToken
  // .userName
  userLogin: param => userLogin(param),

  // @ Param
  // email
  // userName
  // password
  userSignup: param => userSignup(param),

  // @ Param
  // email
  userCheckemail: param => userCheckemail(param),

  // @ Param
  // email
  userFindpw: param => userFindpw(param),

  // @ Param
  // userToken
  // password
  userChangepw: param => userChangepw(param),

  // @ Param
  // userToken
  userLogout: param => userLogout(param),

  // @ Data
  // productList
  productLookup: () => productLookup(),

  // @ Param
  // userToken
  // @ Data
  // subscribeList
  productUserlookup: param => productUserlookup(param),

  // @ Param
  // userToken
  // p_id 구독 할 상품의 고유 ID
  // title 구독 할 상품의 이름
  // s_id 다이어리의 ID, 신규 구독 시 만들어서 보내줄 것
  // isSubscribe 구독 1 / 취소 0
  // pushStartTime
  // pushEndTime
  // pushType 정시 0 / 랜덤 1
  subscribePushsetting: param => subscribePushsetting(param),

  // @ Param
  // userToken
  // p_ID
  // pushStartTime
  // pushEndTime
  // pushType
  subscribeTimesetting: param => subscribeTimesetting(param),

  // @ Param
  // userToken
  // @ Data
  // diarylist
  diaryLookup: param => diaryLookup(param),

  // @ Param
  // userToken
  // diaryBackupList
  diaryBackup: param => diaryBackup(param),

  // @ Param
  // userToken
  // d_id
  diaryDelete: param => diaryDelete(param),

  // @ Param
  // userToken
  // d_id
  // pdfType link반환 0 / html반환 1
  // @ Data
  //
  makelink: param => makelink(param),

  // @ Param
  // expoToken
  // userToken
  // q_id
  // p_id
  // d_id
  chatReply: param => chatReply(param),

  // @ Param
  // userToken
  // isAlarmOn
  setPushAlarm: param => setPushAlarm(param),

  // @ Param
  // expoToken
  // email
  registPushToken: param => registPushToken(param),

  // @ Param
  // log_id 푸시 알람 시 같이 전송되는 로그 ID. 푸시알람을 정상적으로 수신하였을 시 이 API를 바로 호출해 줘야 됨
  pushalarmSuccess: param => pushalarmSuccess(param),

  // @ Param
  // userToken
  // @ Data
  // LogInfo
  pushalarmChatLogBackUp: param => pushalarmChatLogBackUp(param)
}
