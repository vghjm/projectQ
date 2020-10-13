import React from 'react';
import Moment from 'moment';

export const userDataType = {
  token: 'tempTokenStr',
  pushToken: 'EXP[TempPushToken]',
  email: 'temp@naver.com',
  password: 'tempPassword!@#',
  username: 'user',
  userImg: 0,
};
export const productDataType = [
  {
    p_id: 0, isAvailable: true,
    title: '제목', text: '설명글',
    thumbnailImg: require('../../assets/product/new땡Q노트/thumbnail.png'),
    logoImg: require('../../assets/product/new땡Q노트/logo.png'),
    mainImg: require('../../assets/product/new땡Q노트/main.png'),
    pushType: 1,
    defaultStartTime: Moment(),
    defaultEndTime: Moment(),
    questionList: [
      {q_ID: 1, content: "지금 문득 감사하고 싶은 사람이 있어?"},
      {q_ID: 2, content: "너가 감사함을 느끼는 추억은 어떤거야?"},
    ],
    ansList: [
      {q_ID: 1, content: "지금 문득 감사하고 싶은 사람이 있어?"},
      {q_ID: 2, content: "너가 감사함을 느끼는 추억은 어떤거야?"},
    ]
  },
];
export const subscribeDataType = [
  {p_id: 0, pushStartTime: Moment(), pushEndTime: Moment()},
];
export const chatroomDataType = [
  {
    p_id: 0, getPushAlarm: false, lastCheckedTime: Moment(), newItemCount: 0, lastPushed: {pushTime: Moment(), questIndex: 1, solved:true},
    chatMessageList: [
      {
        _id: 3, text: '나랑 함께 일하는 사람들에게 감사해. 나 혼자였다면 하지', createdAt: Moment('20200703 0802'),
        user: { _id:1,},
      },
      { _id: 2, text: '지금 문득 감사하고 싶은 사람이 있어?', createdAt: Moment('20200703 0800'),
        user: { _id:2, avatar: require('../../assets/product/new땡Q노트/thumbnail.png')},
      },
      {
        _id: 1, text: '이제 THANK Q 감사노트 구독이 시작됩니다.\n오전 8시가 되면 질문 드릴게요.', createdAt: Moment('20200702 211034'),
        user: { _id:2, avatar: require('../../assets/product/new땡Q노트/thumbnail.png')},
      },
    ]
  },
];
export const diaryDataType = [
  {
    p_id: 0, d_id: 0, color: 0, pos: 1, makeTime: Moment(), totalUpdateCount: 0,
    diarymessageList: [
      { _id: 1, text: '오늘은 바빠서 점심에 후딱 샐러드를 먹긴 했는데,', createdAt: Moment('20200810 2110'), islagacy: true, linkedMessageList: []},
      { _id: 2, text: '오늘은 집에 왔는데', createdAt: Moment('20200811 2108'), islagacy: false, linkedMessageList: [{id: 1, text: '~~~~'}]},
    ]
  },
];
export const informDataType = {
  introduction: [],
  help: [],
  notice: [],
};
