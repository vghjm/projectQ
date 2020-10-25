import React from 'react';
import Moment from 'moment';

export const userDataType = {
  token: 'tempTokenStr',
  pushToken: 'EXP[TempPushToken]',
  email: 'temp@naver.com',
  password: 'tempPassword!@#',
  username: '변희성',
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
  {p_id: 7, s_id: 7, pushStartTime: Moment('20201025 2100'), pushEndTime: Moment('20201025 2100')},
  {p_id: 8, s_id: 8, pushStartTime: Moment('20201025 0800'), pushEndTime: Moment('20201025 0800')},
];
export const chatroomDataType = [
  {
    p_id: 7, getPushAlarm: true, lastCheckedTime: Moment('20200813 2113'), newItemCount: 0,
    lastPushed: {pushTime: Moment(), q_id: 1, solved:true},
    chatMessageList: [
      { _id: 13, text: '그랬구나? 사실 네가 뭘 하든 널 응원할거야😉', createdAt: Moment('20200813 2113'),
        user: { _id:2, avatar: require('../../assets/product/newQ톡일기/thumbnail.png')},
      },
      {
        _id: 12, text: '오늘 특별한 일이 없었던거 같아. 그냥 열심히 일하고, 기분도 딱히 나쁘지 않았던거 같아. 하루를 끝내기는 조금 아쉬우니 집 앞에 산책이나 다녀오려고 해.', createdAt: Moment('20200813 2109'),
        user: { _id:1,},
      },
      { _id: 11, text: '오늘 뭐했는지 궁금하다! 오늘 어떻게 보냈어?', createdAt: Moment('20200813 2104'),
        user: { _id:2, avatar: require('../../assets/product/newQ톡일기/thumbnail.png')},
      },
      { _id: 10, text: '그랬어?? 내가 다 재밌다🤣🤣', createdAt: Moment('20200812 2110'),
        user: { _id:2, avatar: require('../../assets/product/newQ톡일기/thumbnail.png')},
      },
      {
        _id: 9, text: '오늘은 동료들끼리 고기를 좀 구웠어~ 우리가 갔던 곳이 정말 맛있는 집이여서 기분이 좋았어. 같이 얘기도 하고 고기도 먹으니 신났어', createdAt: Moment('20200812 2105'),
        user: { _id:1,},
      },
      { _id: 8, text: '오늘 재밌는 일은 뭐가 있었어?', createdAt: Moment('20200812 2102'),
        user: { _id:2, avatar: require('../../assets/product/newQ톡일기/thumbnail.png')},
      },
      { _id: 7, text: '그래? 잘했어, 잘한거야~🤗', createdAt: Moment('20200811 2113'),
        user: { _id:2, avatar: require('../../assets/product/newQ톡일기/thumbnail.png')},
      },
      {
        _id: 6, text: '오늘은 집에 왔는데 너무 귀찮아서 놀았어. 재밌는 영상 보면서 뒹굴거리니깐 안락해ㅋㅋ 너무 생각없이 놀았나 싶기도 하고 ㅠㅠ', createdAt: Moment('20200811 2109'),
        user: { _id:1,},
      },
      { _id: 5, text: '오늘 잘지냈어? 뭐하고 지냈어?', createdAt: Moment('20200811 2105'),
        user: { _id:2, avatar: require('../../assets/product/newQ톡일기/thumbnail.png')},
      },
      { _id: 4, text: '그랬구나! 밥🍚은 꼭꼭 챙겨먹으라구~', createdAt: Moment('20200810 2111'),
        user: { _id:2, avatar: require('../../assets/product/newQ톡일기/thumbnail.png')},
      },
      {
        _id: 3, text: '오늘은 바빠서 점심에 후딱 샐러드를 먹긴 했는데, 저녁에는 그래도 든든하게 챙겨 먹었어. 정신없이 지나간 하루였어ㅠㅠ', createdAt: Moment('20200810 2106'),
        user: { _id:1,},
      },
      { _id: 2, text: '오늘 어떻게 보냈어? 밥은 잘 챙겨 먹었어?', createdAt: Moment('20200810 2100'),
        user: { _id:2, avatar: require('../../assets/product/newQ톡일기/thumbnail.png')},
      },
      {
        _id: 1, text: '이제 Q TALK 일기 구독이 시작됩니다.\n오후 9시가 되면 질문 드릴게요.', createdAt: Moment('20200810 184034'),
        user: { _id:2, avatar: require('../../assets/product/newQ톡일기/thumbnail.png')},
      },
    ]
  },
  {
    p_id: 8, getPushAlarm: true, lastCheckedTime: Moment('20200704 0813'), newItemCount: 0,
    lastPushed: {pushTime: Moment(), q_id: 1, solved:true},
    chatMessageList: [
      { _id: 10, text: '그랬구나~!~! 정말 감사한 기억이겠다😌', createdAt: Moment('20200704 0811'),
        user: { _id:2, avatar: require('../../assets/product/new땡Q노트/thumbnail.png')},
      },
      {
        _id: 9, text: '어렸을 때 할아버지가 크레파스를 사주셨던 추억이 너무 감사해. 할아버지가 조금 무서웠는데, 크레파스를 통해서 할아버지의 사랑이 느껴져서 좋았어~', createdAt: Moment('20200705 0806'),
        user: { _id:1,},
      },
      { _id: 8, text: '너의 어린시절에 감사를 한다면?', createdAt: Moment('20200705 0803'),
        user: { _id:2, avatar: require('../../assets/product/new땡Q노트/thumbnail.png')},
      },
      { _id: 7, text: '아 그래? 네 곁에 소중한 것이 많아지길 바래..!', createdAt: Moment('20200704 0810'),
        user: { _id:2, avatar: require('../../assets/product/new땡Q노트/thumbnail.png')},
      },
      {
        _id: 6, text: '나는 생일날 선물 받은 무선 이어폰이 감사해. 그 이어폰을 꼽고 지하철을 탈 때마다 너무 편하고 기분이 좋아!!', createdAt: Moment('20200704 0805'),
        user: { _id:1,},
      },
      { _id: 5, text: '감사하게 생각하는 물건은 뭐야?', createdAt: Moment('20200704 0801'),
        user: { _id:2, avatar: require('../../assets/product/new땡Q노트/thumbnail.png')},
      },
      { _id: 4, text: '그렇구나~~ 간단하게 그분께 감사함을 표현해보는 것도 좋겠다😉', createdAt: Moment('20200703 0810'),
        user: { _id:2, avatar: require('../../assets/product/new땡Q노트/thumbnail.png')},
      },
      {
        _id: 3, text: '나랑 함께 일하는 사람들에게 감사해. 나 혼자였다면 하지 못했을 일들도, 주변의 사람들과 함께 만들어나가면 해낼 수 있었던 거 같아.', createdAt: Moment('20200703 0802'),
        user: { _id:1,},
      },
      { _id: 2, text: '지금 문득 감사하고 싶은 사람이 있어?', createdAt: Moment('20200703 0800'),
        user: { _id:2, avatar: require('../../assets/product/new땡Q노트/thumbnail.png')},
      },
      {
        _id: 1, text: '이제 THANK Q 감사노트 구독이 시작됩니다.\n오전 8시가 되면 질문 드릴게요.', createdAt: Moment('20200702 141034'),
        user: { _id:2, avatar: require('../../assets/product/new땡Q노트/thumbnail.png')},
      },
    ]
  },
];
export const diaryDataType = [
  {
    p_id: 7, d_id: 7, title: 'Q TALK 일기', color: 1, pos: 1, makeTime: Moment('20200810 184034'), totalUpdateCount: 4,
    diarymessageList: [
      { _id: 1, text: '', createdAt: Moment('20200810 2106'), islagacy: false, linkedMessageList: [{text: '오늘은 바빠서 점심에 후딱 샐러드를 먹긴 했는데, 저녁에는 그래도 든든하게 챙겨 먹었어. 정신없이 지나간 하루였어ㅠㅠ', id:3}]},
      { _id: 2, text: '', createdAt: Moment('20200811 2109'), islagacy: false, linkedMessageList: [{text: '오늘은 집에 왔는데 너무 귀찮아서 놀았어. 재밌는 영상 보면서 뒹굴거리니깐 안락해ㅋㅋ 너무 생각없이 놀았나 싶기도 하고 ㅠㅠ', id:6}]},
      { _id: 3, text: '', createdAt: Moment('20200812 2105'), islagacy: false, linkedMessageList: [{text: '오늘은 동료들끼리 고기를 좀 구웠어~ 우리가 갔던 곳이 정말 맛있는 집이여서 기분이 좋았어. 같이 얘기도 하고 고기도 먹으니 신났어', id:9}]},
      { _id: 4, text: '', createdAt: Moment('20200813 2109'), islagacy: false, linkedMessageList: [{text: '오늘 특별한 일이 없었던거 같아. 그냥 열심히 일하고, 기분도 딱히 나쁘지 않았던거 같아. 하루를 끝내기는 조금 아쉬우니 집 앞에 산책이나 다녀오려고 해.', id:12}]},
    ]
  },
  {
    p_id: 8, d_id: 8, title: 'THANK Q 노트', color: 2, pos: 2, makeTime: Moment('20200704 0813'), totalUpdateCount: 3,
    diarymessageList: [
      { _id: 1, text: '', createdAt: Moment('20200703 0802'), islagacy: false, linkedMessageList: [{text: '나랑 함께 일하는 사람들에게 감사해. 나 혼자였다면 하지 못했을 일들도, 주변의 사람들과 함께 만들어나가면 해낼 수 있었던 거 같아.', id:3}]},
      { _id: 2, text: '', createdAt: Moment('20200704 0805'), islagacy: false, linkedMessageList: [{text: '나는 생일날 선물 받은 무선 이어폰이 감사해. 그 이어폰을 꼽고 지하철을 탈 때마다 너무 편하고 기분이 좋아!!', id:6}]},
      { _id: 3, text: '', createdAt: Moment('20200705 0806'), islagacy: false, linkedMessageList: [{text: '어렸을 때 할아버지가 크레파스를 사주셨던 추억이 너무 감사해. 할아버지가 조금 무서웠는데, 크레파스를 통해서 할아버지의 사랑이 느껴져서 좋았어~', id:9}]},
    ]
  },
];
// id , title, message, date
export const informDataType = {
  introduction: [],
  help: [],
  notice: [],
};
export const globalDataType = {
  focusChatroomPID: 0, // 보고있는 채팅방 상품명
  diaryPositionEditMode: false, // 다이어리 위치 편집모드
  diaryScreenHeight: 0,
}
