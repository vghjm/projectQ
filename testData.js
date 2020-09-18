import React from 'react';
import Moment from 'moment';


let thankQChatmessageListData = [
  {
    _id: 10, text: '그랬구나~!~! 정말 감사한 기억이겠다😌', createdAt: Moment('20200705 0810'),
    user: { _id:2, avatar: require('./assets/product/new땡Q노트/thumbnail.png')},
  },
  {
    _id: 9, text: '어렸을 때 할아버지가 크레파스를 사주셨던 추억이 너무 감사해. 할아버지가 조금 무서웠는데, 크레파스를 통해서 할아버지의 사랑이 느껴져서 좋았어~', createdAt: Moment('20200705 0807'),
    user: { _id:1,},
  },
  {
    _id: 8, text: '너의 어린시절에 감사를 한다면?', createdAt: Moment('20200705 0803'),
    user: { _id:2, avatar: require('./assets/product/new땡Q노트/thumbnail.png')},
  },
  {
    _id: 7, text: '아 그래? 네 곁에 소중한 것이 많아지길 바래..!', createdAt: Moment('20200704 0807'),
    user: { _id:2, avatar: require('./assets/product/new땡Q노트/thumbnail.png')},
  },
  { _id: 6, text: '나는 생일날 선물 받은 무선 이어폰이 감사해. 그 이어폰을 꼽고 지하철을 탈 때마다 너무 편하고 기분이 좋아!!', createdAt: Moment('20200704 0805'),
    user: { _id:1,},
  },
  {
    _id: 5, text: '감사하게 생각하는 물건은 뭐야?', createdAt: Moment('20200704 0801'),
    user: { _id:2, avatar: require('./assets/product/new땡Q노트/thumbnail.png')},
  },
  {
    _id: 4, text: '그렇구나~~ 간단하게 그분께 감사함을 표현해보는 것도 좋겠다😉', createdAt: Moment('20200703 0805'),
    user: { _id:2, avatar: require('./assets/product/new땡Q노트/thumbnail.png')},
  },
  {
    _id: 3, text: '나랑 함께 일하는 사람들에게 감사해. 나 혼자였다면 하지 못했을 일들도, 주변의 사람들과 함께 만들어나가면 해낼 수 있었던 거 같아.', createdAt: Moment('20200703 0802'),
    user: { _id:1,},
  },
  { _id: 2, text: '지금 문득 감사하고 싶은 사람이 있어?', createdAt: Moment('20200703 0800'),
    user: { _id:2, avatar: require('./assets/product/new땡Q노트/thumbnail.png')},
  },
  {
    _id: 1, text: '이제 THANK Q 감사노트 구독이 시작됩니다.\n오전 8시가 되면 질문 드릴게요.', createdAt: Moment('20200702 211034'),
    user: { _id:2, avatar: require('./assets/product/new땡Q노트/thumbnail.png')},
  },
];
let highlightChatmessageListData = [
  {
    _id: 10, text: '좋은데~? 잘 할 수 있을거야! 빠샤~!', createdAt: Moment('20200712 0842'),
    user: { _id:2, avatar: require('./assets/product/newQ하이라이트/thumbnail.png')},
  },
  {
    _id: 9, text: '오! 오늘 중학교 친구에게 연락이나 한번 해봐야겠다. 오랜만에 전화하면 진짜 반가울 거 같아ㅋㅋㅋ', createdAt: Moment('20200712 0840'),
    user: { _id:1,},
  },
  {
    _id: 8, text: '오늘 소소하게 하고 싶은 일이 뭐야? 난 연락을 못했던 친구에게 안부를 물어봐야겠다. 너는?', createdAt: Moment('20200712 0832'),
    user: { _id:2, avatar: require('./assets/product/newQ하이라이트/thumbnail.png')},
  },
  {
    _id: 7, text: '그래~~멋지다😍😍 매일 행동하는 너가 대단해..!', createdAt: Moment('20200711 0807'),
    user: { _id:2, avatar: require('./assets/product/newQ하이라이트/thumbnail.png')},
  },
  { _id: 6, text: '오늘은 저녁에 10분 정도 운동을 해야겠어. 틈날 때마다 조금씩이라도 운동을 해보려고!', createdAt: Moment('20200711 0840'),
    user: { _id:1,},
  },
  {
    _id: 5, text: '오늘 소소하게 하고 싶은 일이 뭐야?', createdAt: Moment('20200711 0835'),
    user: { _id:2, avatar: require('./assets/product/newQ하이라이트/thumbnail.png')},
  },
  {
    _id: 4, text: '좋아! 그거 하나는 끝내버리자고!!! 💪💪', createdAt: Moment('20200710 0837'),
    user: { _id:2, avatar: require('./assets/product/newQ하이라이트/thumbnail.png')},
  },
  {
    _id: 3, text: '오늘은 꼭 밀렸던 집안일을 해치우겠어!!! 빨래도 하고 방도 쓸거야~~', createdAt: Moment('20200710 0834'),
    user: { _id:1,},
  },
  { _id: 2, text: '오늘은 어떤 소소한 일을 해낼까?', createdAt: Moment('20200710 0830'),
    user: { _id:2, avatar: require('./assets/product/newQ하이라이트/thumbnail.png')},
  },
  {
    _id: 1, text: '이제 Q 하이라이트 구독이 시작됩니다.\n오전 8시 30분이 되면 질문 드릴게요.', createdAt: Moment('20200709 221034'),
    user: { _id:2, avatar: require('./assets/product/newQ하이라이트/thumbnail.png')},
  },
];
let qTalkChatmessageListData = [
  {
    _id: 11, text: '오늘 뭐했는지 궁금하다! 오늘 어떻게 보냈어?', createdAt: Moment('20200813 2101'),
    user: { _id:2, avatar: require('./assets/product/newQ톡일기/thumbnail.png')},
  },
  {
    _id: 10, text: '그랬어?? 내가 다 재밌다🤣🤣', createdAt: Moment('20200812 2112'),
    user: { _id:2, avatar: require('./assets/product/newQ톡일기/thumbnail.png')},
  },
  {
    _id: 9, text: '오늘은 동료들끼리 고기를 좀 구웠어~ 우리가 갔던 곳이 정말 맛있는 집이여서 기분이 좋았어. 같이 얘기도 하고 고기도 먹으니 신났어', createdAt: Moment('20200812 2110'),
    user: { _id:1,},
  },
  {
    _id: 8, text: '오늘 재밌는 일은 뭐가 있었어?', createdAt: Moment('20200812 2103'),
    user: { _id:2, avatar: require('./assets/product/newQ톡일기/thumbnail.png')},
  },
  {
    _id: 7, text: '그래? 잘했어, 잘한거야~🤗', createdAt: Moment('20200811 2110'),
    user: { _id:2, avatar: require('./assets/product/newQ톡일기/thumbnail.png')},
  },
  { _id: 6, text: '오늘은 집에 왔는데 너무 귀찮아서 놀았어. 재밌는 영상 보면서 뒹굴거리니깐 안락해ㅋㅋ 너무 생각없이 놀았나 싶기도 하고 ㅠㅠ', createdAt: Moment('20200811 2108'),
    user: { _id:1,},
  },
  {
    _id: 5, text: '오늘 잘지냈어? 뭐하고 지냈어?', createdAt: Moment('20200811 2105'),
    user: { _id:2, avatar: require('./assets/product/newQ톡일기/thumbnail.png')},
  },
  {
    _id: 4, text: '그랬구나! 밥🍚은 꼭꼭 챙겨먹으라구~', createdAt: Moment('20200810 2112'),
    user: { _id:2, avatar: require('./assets/product/newQ톡일기/thumbnail.png')},
  },
  {
    _id: 3, text: '오늘은 바빠서 점심에 후딱 샐러드를 먹긴 했는데, 저녁에는 그래도 든든하게 챙겨 먹었어. 정신없이 지나간 하루였어ㅠㅠ', createdAt: Moment('20200810 2110'),
    user: { _id:1,},
  },
  { _id: 2, text: '오늘 어떻게 보냈어? 밥은 잘 챙겨 먹었어?', createdAt: Moment('20200810 2100'),
    user: { _id:2, avatar: require('./assets/product/newQ톡일기/thumbnail.png')},
  },
  {
    _id: 1, text: '이제 Q TALK 일기 구독이 시작됩니다.\n오후 9시가 되면 질문 드릴게요.', createdAt: Moment('20200809 233834'),
    user: { _id:2, avatar: require('./assets/product/newQ톡일기/thumbnail.png')},
  },
];
let qTalkDiaryMessageListData = [
  { _id: 1, text: '오늘은 바빠서 점심에 후딱 샐러드를 먹긴 했는데,\n저녁에는 그래도 든든하게 챙겨 먹었어.\n정신없이 지나간 하루였어ㅠㅠ', createdAt: Moment('20200810 2110'), islagacy: true, linkedMessageList: []},
  { _id: 2, text: '오늘은 집에 왔는데 너무 귀찮아서 놀았어.\n재밌는 영상 보면서 뒹굴거리니깐 안락해ㅋㅋ\n너무 생각없이 놀았나 싶기도 하고 ㅠㅠ', createdAt: Moment('20200811 2108'), islagacy: true, linkedMessageList: []},
  { _id: 3, text: '오늘은 동료들끼리 고기를 좀 구웠어~\n우리가 갔던 곳이 정말 맛있는 집이여서 기분이 좋았어.\n같이 얘기도 하고 고기도 먹으니 신났어', createdAt:Moment('20200812 2110'), islagacy: true, linkedMessageList: []},
  { _id: 4, text: '오늘 특별한 일이 없었던거 같아.\n그냥 열심히 일하고, 기분도 딱히 나쁘지 않았던거 같아.\n하루를 끝내기는 조금 아쉬우니 집 앞에\n산책이나 다녀오려고 해.', createdAt: Moment('20200813 2105'), islagacy: true, linkedMessageList: []},
];

let realTestData1 = {
  id: 1, isAvailable: true, hasDiary:true, hasChatroom: true, isSubscribe:true,
  product: {
    title: 'THANK Q 감사노트',
    text: '매일 당신에게 질문하는 감사 일기장',
    imageSet: {thumbnailImg: require('./assets/product/new땡Q노트/thumbnail.png'), logoImg: require('./assets/product/new땡Q노트/logo.png'), mainImg: require('./assets/product/new땡Q노트/main.png'), avatarImg: require('./assets/product/new땡Q노트/thumbnail.png')},
    questionList: [
      '지금 문득 감사하고 싶은 사람이 있어?',
      '너가 감사함을 느끼는 추억은 어떤거야?',
      '너가 평소 감사하고 있는 일은 어떤거야?',
      '너가 감사하는 물건은?',
      '자연에 관해 감사한다면, 어떤 것에 감사하고 싶어?',
      '나 자신에게 감사하고 싶은 게 있을까?',
      '너의 가족들에게 어떤 걸 감사하고 싶어?',
      '최근에 친구나 주변사람 중에 누구에게 감사를 느꼈어?',
      '연예인이나 유명인 중에 너가 감동을 받고, 감사한 사람이 있어?',
      '너는 어떤 글귀나 책에 감사한 마음을 느끼고 있어?',
      '지금까지 영화나 영상을 본 것 중에 감사한 것이 있어?',
      '너의 어린시절에 감사를 한다면?',
      '오늘 감사할 것이 있다면, 어떤거야?',
      '음식에 관해 감사할 것이 있을까?',
    ],
    ansList: [],
  },
  chatroom: {
    lastMessageTime: Moment('20200705 0811'), newItemCount: 0, chatmessageList: thankQChatmessageListData, lastPushed: {pushTime: Moment(), questIndex: 1, solved:true},
    noMessage: true,
  },
  diary: {
    makeTime: Moment('20200702 211034'), totalUpdateCount: 0, diarymessageList: []
  },
  push: {
    isRandomPushType: false, pushStartTime: Moment('20200812 0830'), pushEndTime: Moment('20200812 0830'),
  },
};
let realTestData2 = {
  id: 2, isAvailable: true, hasDiary:true, hasChatroom: true, isSubscribe:true,
  product: {
    title: 'Q 하이라이트',
    text: '오늘을 의미있게 만들 순간을, 미리 적는 일기장',
    imageSet: {thumbnailImg: require('./assets/product/newQ하이라이트/thumbnail.png'), logoImg: require('./assets/product/newQ하이라이트/logo.png'), mainImg: require('./assets/product/newQ하이라이트/main.png'), avatarImg: require('./assets/product/newQ하이라이트/thumbnail.png')},
    questionList: [
      '오늘 소소하게 하고 싶은 일이 있어?',
      '오늘 소소하게 하고 싶은 일이 어떤거야? 난 밀렸던 빨래를 할거야. 너는?',
      '오늘 소소하게 하고 싶은 일이 뭐야? 난 글을 써보고 싶어. 너는?',
      '오늘 소소하게 하고 싶은 일이 뭐야? 나는 오늘 일기를 쓸거야. 너는?',
      '오늘 소소하게 하고 싶은 일이 뭐야? 난 조용한 음악을 틀어놓고 명상을 해보고 싶어. 너는?',
      '오늘 소소하게 하고 싶은 일이 뭐야? 난 내가 좋아하는 노래를 들으려고! 너는?',
      '오늘 소소하게 하고 싶은 일이 뭐야? 난 좋아하는 친구에게 전화할거야! 너는?',
      '오늘 소소하게 하고 싶은 일이 뭐야? 난 연락을 못했던 친구에게 안부를 물어봐야겠다. 너는?',
      '오늘의 소소한 하이라이트는 뭐였으면 좋겠어?',
      '오늘 소소하게 하고 싶은 일이 뭐야?',
      '오늘 한 가지 재밌는 일을 뭘로 정하면 좋을 것 같아?',
      '오늘 해내고 싶은 한 가지는 뭐야?',
      '오늘 처리해버리면 시원한, 할 일 한 가지는 뭐야?',
      '오늘의 하이라이트 한 가지는 뭐로 정할래?',
      '오늘은 어떤 소소한 일을 해낼까?',
      '오늘 내가 할 수 있는 일 한 가지를 뭘로 정하면 좋겠어?',
      '오늘 하이라이트로 뭘 하고 싶어?',
      '즐거운 일 한 가지를 오늘의 하이라이트로 정해보는 건 어때? 뭘로 정할래!',
      '오늘 이거 하나는 꼭 해야겠다는 게 뭐야?',
      '오늘을 만족한 하루로 만들, 소소한 할 일 한 가지는 뭐야?',
    ],
    ansList: [],
  },
  chatroom: {
    lastMessageTime:  Moment('20200712 0842'), newItemCount: 0,  chatmessageList: highlightChatmessageListData, lastPushed: {pushTime: Moment(), questIndex: 1, solved:true},
  },
  diary: {
    makeTime:  Moment('20200709 221034'),  totalUpdateCount: 0, diarymessageList: [],
  },
  push: {
    isRandomPushType: false, pushStartTime: Moment('20200812 0830'), pushEndTime: Moment('20200812 0830'),
  },
};
let realTestData3 = {
  id: 3, isAvailable: true, hasDiary:true, hasChatroom: true, isSubscribe:true,
  product: {
    title: 'Q TALK 일기',
    text: '오늘 당신의 감정과 생각을 물어오는 일기장',
    imageSet: {thumbnailImg: require('./assets/product/newQ톡일기/thumbnail.png'), logoImg: require('./assets/product/newQ톡일기/logo.png'), mainImg: require('./assets/product/newQ톡일기/main.png'), avatarImg: require('./assets/product/newQ톡일기/thumbnail.png')},
    questionList: [
      '오늘 어땠어? 만족스러웠어?',
      '오늘 기분은 어때?',
      '오늘은 어떻게 보냈어?',
      '오늘 힘든 일 없었어?',
      '오늘 재밌는 일은 뭐가 있었어?',
      '오늘 잘지냈어? 뭐하고 지냈어?',
      '오늘은 뭐했어?',
      '오늘 뭐했는지 궁금하다! 오늘 어떻게 보냈어?',
      '하루동안 수고 많았어. 만족스러운 하루였어?',
      '오늘 기분은 어때!',
      '하루 잘 보냈어?',
      '오늘 어떻게 보냈어? 밥은 잘 챙겨 먹었어?',
      '오늘 뭐가 제일 재밌는 일이었어?',
      '오늘 어떤 즐거운 일이 있었어?',
      '오늘 하루는 너다웠어?',
      '오늘은 많이 바빴어?',
      '오늘 고민거리는 없었어?',
    ],
    ansList: [],
  },
  chatroom: {
    lastMessageTime: Moment('20200813 2107'), newItemCount: 0,  chatmessageList: qTalkChatmessageListData, lastPushed: {pushTime: Moment(), questIndex: 1, solved:true},
    lastMessage: '',
  },
  diary: {
    makeTime: Moment('20200809 233834'), totalUpdateCount: 4, diarymessageList: qTalkDiaryMessageListData,
  },
  push: {
    isRandomPushType: true, pushStartTime: Moment('20200812 0830'), pushEndTime: Moment('20200812 1130'),
  },
};
export const productTestData = [realTestData1, realTestData2, realTestData3];
export const userTestData = {
  token: 'asfnjk436k3b46jh346bk',
  username: '테스트 계정',
  email: 'test@naver.com',
  password: '1234567!!',
  userImg: null,
  mySubscribeList: [{id:1, pushStartTime:Moment('20200916 0830'), pushEndTime:Moment('20200916 1030')}, {id:2, pushStartTime:Moment('20200916 0830'), pushEndTime:Moment('20200916 1030')}, {id:3, pushStartTime:Moment('20200916 0830'), pushEndTime:Moment('20200916 1030')}],
  myChatroomList: [{id:1, getPushAlarm:false, key:'1'}, {id:2, getPushAlarm:true, key:'2'}, {id:3, getPushAlarm:false, key:'3'}],
  myDiaryList: [{id:1, pos:1, color:1}, {id:2, pos:2, color:2}, {id:3, pos:3, color:3}],
};
export const informTestData = {
  introduction: [],
  help: [],
  notice: [],
};
export const pushTestData = [];
