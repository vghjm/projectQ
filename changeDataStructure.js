import React from 'react';
import Moment from 'moment';

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



NEW NEW NEW NEW NEW NEW NEW NEW NEW NEW NEW NEW NEW NEW NEW NEW NEW NEW NEW NEW NEW NEW NEW NEW NEW NEW NEW NEW NEW NEW


const productData = {
  id: {
    title: '제목', text: '설명', isAvailable: false,
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
    ],
    ansList: [
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
    push: {isRandomType: false, pushStartTime: Moment('20200916 0830'), pushEndTime: Moment('20200916 1030')},
  }
}
let userData = {
  token: 'asfnjk436k3b46jh346bk',
  username: '테스트 계정',
  email: 'test@naver.com',
  password: '1234567!!',
  userImg: null,
  mySubscribe: {
    id: {getPushAlarm: true, pushStartTime: Moment('20200916 0830'), pushEndTime: Moment('20200916 1030')},
  },
  myChatroomList: {
    id: {
      lastMessageTime: Moment(), newItemCount: 0, chatmessageList: , lastPushed: {pushTime: Moment(), questIndex: 1, solved:true},
      chatmessageList: [
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
      ],
    }
  },
  myDiaryList: {
    id: {
      makeTime: Moment('20200809 233834'), totalUpdateCount: 4,
      diarymessageList: [
        { _id: 1, text: '오늘은 바빠서 점심에 후딱 샐러드를 먹긴 했는데,\n저녁에는 그래도 든든하게 챙겨 먹었어.\n정신없이 지나간 하루였어ㅠㅠ', createdAt: Moment('20200810 2110'), islagacy: true, linkedMessageList: []},
        { _id: 2, text: '오늘은 집에 왔는데 너무 귀찮아서 놀았어.\n재밌는 영상 보면서 뒹굴거리니깐 안락해ㅋㅋ\n너무 생각없이 놀았나 싶기도 하고 ㅠㅠ', createdAt: Moment('20200811 2108'), islagacy: true, linkedMessageList: []},
        { _id: 3, text: '오늘은 동료들끼리 고기를 좀 구웠어~\n우리가 갔던 곳이 정말 맛있는 집이여서 기분이 좋았어.\n같이 얘기도 하고 고기도 먹으니 신났어', createdAt:Moment('20200812 2110'), islagacy: true, linkedMessageList: []},
        { _id: 4, text: '오늘 특별한 일이 없었던거 같아.\n그냥 열심히 일하고, 기분도 딱히 나쁘지 않았던거 같아.\n하루를 끝내기는 조금 아쉬우니 집 앞에\n산책이나 다녀오려고 해.', createdAt: Moment('20200813 2105'), islagacy: true, linkedMessageList: []},
      ],
    },
  },
}
