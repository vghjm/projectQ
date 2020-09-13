import React, { useState, useCallback, useEffect } from 'react';
import { Clipboard, Dimensions , ActivityIndicator, Platform,TouchableHighlight, TouchableWithoutFeedback, AsyncStorage, ImageBackground, Text, View, StyleSheet, TouchableOpacity, TextInput, CheckBox, KeyboardAvoidingView, Alert, Button, ScrollView, SafeAreaView, Image }
from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, getFocusedRouteNameFromRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem, } from '@react-navigation/drawer';  //  https://reactnavigation.org/docs/drawer-based-navigation/
import { Ionicons, MaterialCommunityIcons, Feather, FontAwesome, EvilIcons, AntDesign, MaterialIcons, Octicons }
from '@expo/vector-icons'; // https://icons.expo.fyi/
import DateTimePicker from '@react-native-community/datetimepicker'; // https://github.com/react-native-community/datetimepicker
import * as Animatable from 'react-native-animatable'; // https://github.com/oblador/react-native-animatable
import * as ImagePicker from 'expo-image-picker';      // https://docs.expo.io/versions/latest/sdk/imagepicker/
// import Constants from 'expo-constants';
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import Moment from 'moment';
import  "moment/locale/ko";
require('dayjs/locale/ko');
Moment.locale("ko");
import _ from 'lodash'; // https://lodash.com/docs
import { SwipeListView } from 'react-native-swipe-list-view'; // https://www.npmjs.com/package/react-native-swipe-list-view
import { GiftedChat, Bubble , Send, InputToolbar, Time, Day, Composer } from 'react-native-gifted-chat' // https://github.com/FaridSafi/react-native-gifted-chat
import Draggable from 'react-native-draggable'; // https://github.com/tongyy/react-native-draggable
import * as Font from 'expo-font';          // https://docs.expo.io/versions/latest/sdk/font/
import uuid from 'react-native-uuid';       // https://www.npmjs.com/package/react-native-uuid
import Hyperlink from 'react-native-hyperlink'; // https://www.npmjs.com/package/react-native-hyperlink
import * as WebBrowser from 'expo-web-browser';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';


// my component
import InlineTextInput from './component/InlineTextInput';
import LoginNavigation from './component/LoginForm';
import {ThemeContext} from './component/context/ThemeContext';
import {AuthContext, authContext} from './component/context/AuthContext';
import {HTTP, PUSH_REGISTRATION_ENDPOINT} from './utils/constants';
import IntroNavigation from './component/IntroForm';
import * as Connection from './component/ServerConnect';
import * as Storage from './component/StorageControll';

// https://velog.io/@max9106/React-Native-%EB%A6%AC%EC%95%A1%ED%8A%B8-%EB%84%A4%EC%9D%B4%ED%8B%B0%EB%B8%8Creact-native-%ED%91%B8%EC%8B%9C%EC%95%8C%EB%9E%8C-expo-jkk16hzg5d

const introImage1 = {uri: "https://cdn.crowdpic.net/detail-thumb/thumb_d_F78FC0AA8923C441588C382B19DF0BF8.jpg"};
const introImage2 = {uri: "https://previews.123rf.com/images/romeolu/romeolu1601/romeolu160100122/50594417-%EB%88%88-%EB%B0%B0%EA%B2%BD.jpg"};
const introImage3 = {uri: "https://previews.123rf.com/images/kittikornphongok/kittikornphongok1505/kittikornphongok150501184/40020410-%EB%8B%A4%EC%B1%84%EB%A1%9C%EC%9A%B4-%EC%88%98%EC%B1%84%ED%99%94%EC%9E%85%EB%8B%88%EB%8B%A4-%EA%B7%B8%EB%9F%B0-%EC%A7%80-%EC%A7%88%EA%B0%90-%EB%B0%B0%EA%B2%BD%EC%9E%85%EB%8B%88%EB%8B%A4-%EB%B6%80%EB%93%9C%EB%9F%AC%EC%9A%B4-%EB%B0%B0%EA%B2%BD%EC%9E%85%EB%8B%88%EB%8B%A4-.jpg"};
const defaultImg = {uri: "https://www.daelim.ac.kr/coming_soon.jpg"};
const dogImg = {uri: "https://t1.daumcdn.net/cfile/tistory/24283C3858F778CA2E"};
const catImg = {uri: 'https://image-notepet.akamaized.net/resize/620x-/seimage/20190816%2Ff07bd9f247293aa0317f2c8faba7e83b.png'};
const carmelImg = {uri: 'https://www.jain.re.kr/file/contents/1/201609/30aade86-7056-4948-86a4-a8003c4498ab.jpg'};
const diaryImg = require('./assets/diary.jpg');
const logo = require('./assets/img/icon.png');
const bookOn = require('./assets/icon/book_on.png');
const bookOff = require('./assets/icon/book_off.png');
const subOn = require('./assets/icon/subOn.png');
const subOff = require('./assets/icon/subOff.png');
const upArrow = require('./assets/icon/up_arrow.png');
const downArrow = require('./assets/icon/down_arrow.png');
const defaultUser = require('./assets/img/default_user.png');
const diaryImgList = [
  require('./assets/icon/diary_1.png'),
  require('./assets/icon/diary_2.png'),
  require('./assets/icon/diary_3.png'),
  require('./assets/icon/diary_4.png'),
  require('./assets/icon/diary_5.png'),
  require('./assets/icon/diary_6.png'),
  require('./assets/icon/diary_7.png'),
  require('./assets/icon/diary_8.png'),
  require('./assets/icon/diary_9.png'),
  require('./assets/icon/diary_10.png'),
];

const ControllContext = React.createContext();
const Tab = createMaterialTopTabNavigator();
const Stack = createStackNavigator();
const MyServiceStack = createStackNavigator();
const ServiceCenterStack = createStackNavigator();
const Drawer = createDrawerNavigator();

// 임시 데이터

const noticeMessage = [
  {
    id: 1,
    title: '위치기반 서비스 이용약관 사전 안내',
    date: '2019-03-26',
    message: '안녕하세요 큐모먼트입니다.\n큐모먼트서비스를 이용해 주셔서 감사합니다. 앞으로도 큐모먼트에 많은 성원 부탁드립니다.\n다이어리 다운로드 방법\n\n1. PDF다운로드 받기\n2. 링크 내보내기'
  }, {
    id: 2,
    title: '제목이 너무 길면 어떻게 되는지 알고 싶어요 제목이 너무 길면 어떻게 되는지 알고 싶어요',
    date: '2020-07-22',
    message: '안녕하세요 큐모먼트입니다.\n큐모먼트서비스를 이용해 주셔서 감사합니다. 앞으로도 큐모먼트에 많은 성원 부탁드립니다.\n다이어리 다운로드 방법\n\n1. PDF다운로드 받기\n2. 링크 내보내기'
  }
];
const helpMessage = [
  {
    id: 1,
    question: '다이어리를 다운받고 싶어요.',
    answer: '안녕하세요 큐모먼트입니다.\n큐모먼트서비스를 이용해 주셔서 감사합니다. 앞으로도 큐모먼트에 많은 성원 부탁드립니다.\n다이어리 다운로드 방법\n\n1. PDF다운로드 받기\n2. 링크 내보내기'
  }, {
    id:2,
    question: '제목이 너무 길면 어떻게 되는지 알고 싶어요 제목이 너무 길면 어떻게 되는지 알고 싶어요',
    answer: '안녕하세요 큐모먼트입니다.\n큐모먼트서비스를 이용해 주셔서 감사합니다. 앞으로도 큐모먼트에 많은 성원 부탁드립니다.\n다이어리 다운로드 방법\n\n1. PDF다운로드 받기\n2. 링크 내보내기'
  }
];

/*
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
  },
  diary: {
    makeTime: Moment('20200809 233834'), totalUpdateCount: 4, diarymessageList: qTalkDiaryMessageListData,
  },
  push: {
    isRandomPushType: true, pushStartTime: Moment('20200812 0830'), pushEndTime: Moment('20200812 1130'),
  },
};
*/
// dataList - id, isAvailable, hasDiary, hasChatroom, isSubscribe, product, diary, push
let dataList = [];

let userData = {
  token: null,
  username: null,
  email: null,
  password: null,
  userImg: null,
  mySubscribeList: [],
  myChatroomList: [],
  myDiaryList: [],
};


let informData = {
  introduction: [],
  help: helpMessage,
  notice: noticeMessage,
};
let pushList = [];

// 기기 화면 사이즈
const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

// 컨트롤 변수
let pressDiaryEditButton = false;  // diary 편집버튼 누름 상태값
let global_p_id = 0;               // 채팅창 사이드 메뉴에서 다른 상품정보로 보내기 위한 상품 id 값
let editDiaryTextMode = false;     // 다이어리 편집모드 상태값
let global_y = 0;         // 다이어리리스트 스크린의 스크롤 값

// 유용한 함수
function chooseRandomIndex(a){
  return Math.floor(Math.random() * a.length);
}
function chooseRandomly(a){
  return a[Math.floor(Math.random() * a.length)];
}
function diarySortByDate(myDiaryMessageList){
  myDiaryMessageList.sort((a, b) => {
    return a.createdAt > b.createdAt;
  });
}
function isEmail(email){
  const emailRegex = /^(([^<>()\[\].,;:\s@"]+(\.[^<>()\[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;

  return emailRegex.test(email);
}


// 인증 페이지
/*
async function loadingProductData() {
  let loadDataFailure = true;

  const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
  if (status !== "granted") {
      Alert.alert('파일 획득 권한을 얻을 수 없습니다.');
      return loadDataFailure;
  }

  const downloadFile = async (url) =>{
    let path = url.split('/');
    let returnUri;
    const file_name = path[path.length-1];

    await FileSystem.downloadAsync(
      url,
      FileSystem.documentDirectory + file_name
    )
    .then(({ uri }) => {
      console.log('Finished downloading to ', uri);
      returnUri = uri;

    })
    .catch(error => {
      console.error(error);
    });

    return returnUri;
  }


  let response = await fetch(HTTP+'/product/lookup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify({
      jwt: userData.token,
    }),
  });

  if (response.ok) { // HTTP 상태 코드가 200~299일 경우
    // 응답 몬문을 받습니다(관련 메서드는 아래에서 설명).
    let json = await response.json();
    //console.log('response\n', json);
    loadDataFailure = false; // 성공

    dataList = [];
    await json.products.reduce( async (last, product, i) =>{
      let myQuestList = [];
      let myAnsList = [];
      // 질문 분류기
      product.question.forEach((questObj, i) => {
        if(i%2 === 0){
          myQuestList.push(questObj.content);
        }else{
          myAnsList.push(questObj.content);
        }
      })

      // 이미지 로딩
      let thumbnailImg = await downloadFile(HTTP + '/files/' + product.img_logo);
      let logoImg = await downloadFile(HTTP + '/files/' + product.img_background);
      let mainImg = await downloadFile(HTTP + '/files/' + product.img_explain);

      let productData = {
        id: product.p_ID, isAvailable: true, hasDiary:false, hasChatroom: false, isSubscribe:false,
        product: {
          title: product.p_name,
          text: product.p_intro,
          imageSet: {thumbnailImg: {uri: thumbnailImg}, logoImg: {uri: logoImg}, mainImg: {uri: mainImg}, avatarImg: {uri: thumbnailImg}},
          questionList: myQuestList,
          ansList: myAnsList,
        },
        chatroom: {
          lastMessageTime: null, newItemCount: 0, chatmessageList: [],
        },
        diary: {
          makeTime: null, totalUpdateCount: 0, diarymessageList: []
        },
        push: {
          isRandomPushType: product.pushType===1, pushStartTime: Moment('20200812 ' + product.start_time), pushEndTime: Moment('20200812 ' + product.end_time),
        },
      };
      console.log('load product\n', productData);
      dataList.push(_.cloneDeep(productData));
      return 1;
    }, 0);

    //console.log('update UserData: ', dataList[0]);

    return loadDataFailure;
  } else {
    // 서버와 연결이 안됨
    Alert.alert('서버와 연결이되지 않습니다.');
  }

  return loadDataFailure;
}
async function loadingDiaryData() {
  let loadDataFailure = true;
  console.log("loadingDiaryData\n");

  let response = await fetch(HTTP+'/diary/lookup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify({
      jwt: userData.token,
    }),
  });

  if (response.ok) { // HTTP 상태 코드가 200~299일 경우
    // 응답 몬문을 받습니다(관련 메서드는 아래에서 설명).
    let json = await response.json();
    console.log('response\n', json);
    loadDataFailure = false; // 성공
    return loadDataFailure;
  } else {
    // 서버와 연결이 안됨
    Alert.alert('서버와 연결이되지 않습니다.');
  }

  return loadDataFailure;
}
function SignInScreen({navigation}){
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [autoLoginChecked, setAutoLoginChecked] = React.useState(true);
  const { signIn } = React.useContext(AuthContext);
  const [pressLoginButton, setPressLoginButton] = useState(false);

  const loginHandler = async () => {
    // email check
    // https://velog.io/@marcus/React-Form-Login-Validation-fpjsepzu0x
    if(pressLoginButton){
      return;
    }
    setPressLoginButton(true);

    if(isEmail(username)){
      console.log(`email: ${username}, password:${password}`);
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

      if (response.ok) { // HTTP 상태 코드가 200~299일 경우
        // 응답 몬문을 받습니다(관련 메서드는 아래에서 설명).
        let json = await response.json();
        //console.log('response\n', json);
        if(json.res === 'no email'){
          Alert.alert('해당하는 이메일의 계정이 없습니다.');
        }else if(json.res === 'password mismatch'){
          Alert.alert('비밀번호가 일치하지 않습니다.');
        }else if(json.res === 'success'){
          userData.token = json.token;
          userData.username = json.name;
          userData.email = username;
          userData.password = password;
          console.log('login success\ntoken: \n', userData.token,'\nusername: ', userData.username);

          let loadProductDataFailure = await loadingProductData();
          let loadingDiaryDataFailure = await loadingDiaryData();
          if(loadProductDataFailure){
            // 실패
            Alert.alert('서버로부터 상품정보를 불러올 수 없습니다.');
          }else if(loadingDiaryDataFailure){
            // 실패
            Alert.alert('서버로부터 사용자정보를 불러올 수 없습니다.');
          }else {
            // 성공
            signIn([username, password, true]);
          }

        }

      } else {
        // 서버와 연결이 안됨
        Alert.alert('서버와 연결이되지 않습니다.');
      }

    }else{
      Alert.alert('이메일 형식이 잘못되었습니다.');
    }
    setPressLoginButton(false);
  }

  return (
      <ScrollView style={{marginTop:30}}>
      <View style={{flex:1, flexDirection: 'column', alignItems: 'center'}}>
        <Image source={q_moment} resizeMode={'contain'} style={{height: 200, width:170, marginTop: 80}}/>
        <View style={{marginTop: 80}}>
          <TextInput value={username} onChangeText={(username)=>setUsername(username)} placeholder={"이메일"} style={[styles.singInInputBox, {marginBottom: 8}]} placeholderTextColor={'#666'}/>
          <TextInput value={password} onChangeText={(password)=>setPassword(password)} placeholder={"비밀번호"} style={styles.singInInputBox} secureTextEntry={true} placeholderTextColor={'#666'}/>
          <View style={{flexDirection: 'row', margin:10}}>
            <CheckBox title="autoLoginCheckBox" value={autoLoginChecked} onValueChange={()=>setAutoLoginChecked(!autoLoginChecked)}/>
            <Text style={{marginTop: 3}}>자동로그인</Text>
          </View>
          <TouchableOpacity style={{alignItems: 'center', padding: 10, backgroundColor: '#BBB'}} onPress={loginHandler}>
            <Text style={{fontSize: 21}}>{pressLoginButton ? '로그인 중...' : '로그인'}</Text>
          </TouchableOpacity>
          <View style={{flexDirection: 'row', justifyContent: 'center'}}>
            <TouchableOpacity onPress={()=>navigation.navigate('FindPassword')}><Text style={{fontSize: 12, margin: 5}}>비밀번호 찾기</Text></TouchableOpacity>
            <Text style={{marginTop: 2}}> | </Text>
            <TouchableOpacity onPress={()=>navigation.navigate('SignUp')}><Text style={{fontSize: 12, margin: 5, marginRight: 30}}>회원 가입</Text></TouchableOpacity>
          </View>
        </View>
      </View>
      </ScrollView>
  )
}
function FindPasswordScreen({navigation}){
  const [email, setEmail] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [emailError, setEmailError] = React.useState(false);
  const [usernameError, setUsernameError] = React.useState(false);
  const [findPasswordError, setFindPasswordError] = React.useState(false);

  const findPasswordHandler = async () => {
    console.log('findPasswordHandler');

    if(!isEmail(email)){
      if(!emailError) setEmailError(true);
      return;
    }

    let response = await fetch(HTTP+'/user/findpw', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify({
        email: email,
      }),
    });

    if (response.ok) { // HTTP 상태 코드가 200~299일 경우
      // 응답 몬문을 받습니다.
      let json = await response.json();
      console.log('response\n', json);
      if(json.res === 'send email success'){
        Alert.alert('이메일로 새로운 임시 비밀번호를 보냈습니다.', '',[{text: '확인', onPress:() => navigation.popToTop()}]);
      }else if(json.res === 'send email failed'){
        Alert.alert('메일 발송이 불가능한 이메일 주소입니다.');
      }else if(json.res === 'No existing email'){
        //Alert.alert('미등록된 이메일 주소입니다.');
        if(!findPasswordError) setFindPasswordError(true);
      }
    } else {
      // 서버와 연결이 안됨
      Alert.alert('서버와 연결이되지 않습니다.');
    }

  }

  return (
    <View style={{flex:1, flexDirection: 'column'}}>
      <TextInput placeholder='이메일' style={{borderWidth: 1, margin: 20, marginTop: 90, padding: 5, backgroundColor: '#DDD'}} value={email} onChangeText={(e)=>setEmail(e)} />
      {emailError && <Text style={{color: 'red', fontSize: 12, marginBottom: 10, marginLeft: 30}}>가입한 이메일 주소를 입력해주세요.</Text>}
      <TextInput placeholder='사용자명' style={{borderWidth: 1, margin: 20, marginTop: 10, padding: 5, backgroundColor: '#DDD'}} value={username} onChangeText={(e)=>setUsername(e)} />
      {usernameError && <Text style={{color: 'red', fontSize: 12, marginBottom: 10, marginLeft: 30}}>해당 사용자명이 존재하지 않습니다.</Text>}
      {findPasswordError && <Text style={{color: 'red', fontSize: 12, marginBottom: 10, marginLeft: 30, marginTop: 20}}>입력하신 정보와 일치하는 계정이 없습니다.</Text>}
      <TouchableOpacity style={{height: 50, margin:20, backgroundColor: '#BBB', alignItems: 'center', justifyContent: 'center'}} onPress={findPasswordHandler}>
        <Text>확인</Text>
      </TouchableOpacity>
    </View>
  );
}
function SignUpScreen({navigation}){
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [password2, setPassword2] = React.useState('');
  const [errorEmailForm, setErrorEmailForm] = React.useState(false);
  const [errorPasswordForm, setErrorPasswordForm] = React.useState(false);
  const [errorPasswordNotCorrect, setErrorPasswordNotCorrect] = React.useState(false);
  const { signIn } = React.useContext(AuthContext);

  const informTermsOfUse = () => {
    // 이용약관
    WebBrowser.openBrowserAsync('https://www.notion.so/c12e0571d8034d83add6d9976cbf4725');
  };
  const personalTerm = () => {
    // 개인정보
    WebBrowser.openBrowserAsync('https://www.notion.so/de2d25d45cb641319df224c4b325df96');
  };
  const signUpHandler = async () => {
    let errorCount = 0;

    // 이메일 형식 확인
    if(isEmail(email)){
      if(errorEmailForm) setErrorEmailForm(false);
    }else{
      errorCount++;
      if(!errorEmailForm) setErrorEmailForm(true);
    }

    // 비밀번호 형식 확인
    if(password.length > 5){
      if(errorPasswordForm) setErrorPasswordForm(false);
    }else{
      errorCount++;
      if(!errorPasswordForm) setErrorPasswordForm(true);
    }

    // 비밀번효 확인
    if(password === password2){
      if(errorPasswordNotCorrect) setErrorPasswordNotCorrect(false);
    }else{
      errorCount++;
      if(!errorPasswordNotCorrect) setErrorPasswordNotCorrect(true);
    }

    if(errorCount === 0){
      // 통과
      console.log(`emailcheck email:${email}`);

      let response = await fetch(HTTP+'/user/checkemail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({
          email: email,
        }),
      });

      if (response.ok) { // HTTP 상태 코드가 200~299일 경우
        // 응답 몬문을 받습니다.
        let json = await response.json();
        console.log('response\n', json);
        if(json.res === 'already existing email'){
          Alert.alert('이미 존재하는 이메일 입니다.');
        }else if(json.res === 'success'){
          console.log('emailcheck success');
          userData.email = email;
          userData.password = password;
          navigation.navigate('SetUsername');
          signIn([email, password, false]);
        }
      } else {
        // 서버와 연결이 안됨
        Alert.alert('서버와 연결이되지 않습니다.');
      }
    }
  }

  return (
    <View>
    <View style={{position:'absolute', left:16, top:30}}>
      <TouchableOpacity onPress={()=>navigation.navigate('SignIn')}>
        <AntDesign name="arrowleft" size={26} color="black" />
      </TouchableOpacity>
    </View>
    <ScrollView  style={{marginTop:60}}>
      <View style={{flex:1, flexDirection: 'column', alignItems: 'center'}}>
        <Image source={logo} resizeMode={'contain'} style={{width:270, height:90, marginBottom: 40}} />
        <View>
          <Text style={{margin:5, fontWeight:'bold', marginLeft: 0}}>이메일</Text>
          <TextInput value={email} onChangeText={(email)=>setEmail(email)} style={styles.singInInputBox} placeholder={"username@example.com"}/>
          <Text style={{padding: 3, marginLeft: 10, fontSize: 10}}>※ 비밀번호 찾기 시 이메일 주소로 임시 비밀번호가 발급됩니다.</Text>
          {errorEmailForm && <Text style={{padding: 3, marginLeft: 16, fontSize: 10, color: '#D00'}}>[필수] 메일 주소 형식으로 입력해주세요.</Text>}
        </View>
        <View>
          <Text style={{margin:5, fontWeight:'bold', marginLeft: 0}}>비밀번호</Text>
          <TextInput value={password} onChangeText={(password)=>setPassword(password)}  style={styles.singInInputBox} secureTextEntry={true}/>
          <Text style={{padding: 3, marginLeft: 10, fontSize: 10}}>※ 6~16자 영문 소문자, 숫자만 사용 가능합니다.</Text>
          {errorPasswordForm && <Text style={{padding: 3, marginLeft: 16, fontSize: 10, color: '#D00'}}>[필수] 비밀번호 형식을 확인해 주세요.</Text>}
        </View>
        <View>
          <Text style={{margin:5, fontWeight:'bold', marginLeft: 0}}>비밀번호 확인</Text>
          <TextInput value={password2} onChangeText={(password2)=>setPassword2(password2)}  style={styles.singInInputBox} secureTextEntry={true}/>
          {errorPasswordNotCorrect && <Text style={{padding: 3, marginLeft: 16, fontSize: 10, color: '#D00'}}>[필수] 비밀번호가 일치하지 않습니다.</Text>}
        </View>
        <View style={{flexDirection: 'row'}}>
          <Text style={styles.smallText}>회원가입 시 </Text>
          <TouchableOpacity onPress={informTermsOfUse}><Text style={[styles.smallText, {color: '#22D'}]}>이용약관</Text></TouchableOpacity>
          <Text style={styles.smallText}>과 </Text>
          <TouchableOpacity onPress={personalTerm}><Text style={[styles.smallText, {color: '#22D'}]}>개인정보 처리방침</Text></TouchableOpacity>
          <Text style={styles.smallText}>을 확인하였으며, 동의합니다. </Text>
        </View>
        <View>
          <TouchableOpacity style={{alignItems: 'center', padding: 10, backgroundColor: '#BBB', width: 300, marginTop: 60}} onPress={signUpHandler}>
            <Text>가입하기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
    </View>
  );
}
function UserNameSettingScreen({navigation}) {
  const [username, setUsername] = React.useState('');
  const { registerUsername } = React.useContext(AuthContext);

  const start = async () => {
    userData.username = username;
    console.log('start');

    let response1 = await fetch(HTTP+'/user/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify({
        email: userData.email,
        name: username,
        password: userData.password,
      }),
    });

    if(response1.ok){
      let json1 = await response1.json();
      console.log('response1\n', json1);

      if(json1.res === "failed"){
        Alert.alert('signup error');
        return;
      }

      // login
      let response2 = await fetch(HTTP+'/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({
          email: userData.email,
          password: userData.password,
        }),
      });

      if(response2.ok){
        let json2 = await response2.json();

        userData.token = json2.jwt;

        registerUsername(username);
      }else{
        Alert.alert('로그인 과정중 에러가 있습니다. 다시 시도하세요');
        return;
      }

    }else{
      Alert.alert('서버에 연결이 되지 않습니다.');
    }

  }

  return (
    <KeyboardAvoidingView style={{flex:1, flexDirection: 'column', alignItems:'center', justifyContent:'space-between'}} behavior="height" enabled>
      <View style={{padding:40}}><Text>유저네임 등록 화면 이미지</Text></View>
      <View style={{justifyContent: 'center'}}>
        <Text style={{fontWeight: 'bold', marginBottom: 50, alignSelf: 'center'}}>당신의 호칭을 정해주세요.</Text>
        <Text style={{margin:5, fontWeight:'bold', marginLeft: 0}}>사용자 이름</Text>
        <TextInput value={username} onChangeText={(username)=>setUsername(username)} style={styles.singInInputBox} placeholder={"'사용자의 이름'"}/>
      </View>
      <View>
        <TouchableOpacity style={{alignItems: 'center', padding: 10, backgroundColor: '#BBB', width: 300, marginTop: 60}} onPress={start}>
          <Text>시작하기</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
*/

// 푸시 테스트
function pushMessage(id){
  // 랜덤한 질문 메시지를 만들어 채팅방에 추가함
  let data = dataList[dataList.findIndex(obj => obj.id===id)];
  let product = data.product;
  let chatroom = data.chatroom;
  let avatar = product.imageSet.avatarImg.uri?? product.imageSet.avatarImg;
  let randomIndex = chooseRandomIndex(product.questionList);
  let newMessage = { _id: uuid.v4(), text: product.questionList[randomIndex], createdAt: Moment(),
    user: { _id:2, avatar: avatar}
  };
  chatroom.newItemCount += 1;
  chatroom.chatmessageList.unshift(_.cloneDeep(newMessage));
  chatroom.lastMessageTime = Moment();
  chatroom.lastPushed = {pushTime: Moment(), questIndex: randomIndex, solved:false};
}

function pushTestHandler(updateScreenHandler){  // 간단한 푸시 테스트함수
  let pushTestId = chooseRandomly(userData.mySubscribeList).id;
  if(pushTestId != null){
    pushMessage(pushTestId);
    updateScreenHandler();  // 화면 강제 업데이트
  }
}

// 드래그 기능 추가
function diaryPosToRealPos(diaryPos){
  let realPos ={x:0, y:0};

  if(diaryPos%2===1){
    // 왼쪽
    realPos.x = 0;
  }else{
    realPos.x = screenWidth-185;
  }
  realPos.y = (Math.ceil(diaryPos/2)-1) * 280;

  return realPos;
}
function realPosToDiaryPos(realPos){
  let diaryPos = 0;
  let numberOfDiary = userData.myDiaryList.length;
  console.log('x, y : ', realPos.x, realPos.y);

  if(realPos.y <= 0){
    diaryPos = 1;
  }else{
    diaryPos = Math.floor(realPos.y/320)*2 + 1;
  }

  if(diaryPos > numberOfDiary){
    diaryPos = numberOfDiary;
    if(numberOfDiary%2 === 0) diaryPos-=1;
  }
  if(realPos.x >= screenWidth/2) diaryPos+=1;

  return diaryPos;
}
function DraggableDiary({id, changePosHandler, nav, updateDiary, cancelDrag}){ // 애니메이션 다이어리에 드래그 기능 추가
  const [z, setZ] = useState(1);
  let diaryIndex = userData.myDiaryList.findIndex(obj => obj.id === id);
  let pos = diaryPosToRealPos(userData.myDiaryList[diaryIndex].pos);

  const zUp = () =>{
    if(z!=10) setZ(10);
  }
  const zDown = () =>{
    if(z!=1) setZ(1);
  }
  return (
    <Draggable x={pos.x} y={pos.y} z={z}  shouldReverse onDragRelease={(event, gestureState) => {zDown();  changePosHandler(userData.myDiaryList[diaryIndex].pos, realPosToDiaryPos({x:gestureState.moveX, y:global_y+gestureState.moveY})); cancelDrag(true)}} onDrag={(event)=>{zUp(); cancelDrag(false);}} >
      <AnimatableDiaryComponent id={id} nav={nav} updateDiary={updateDiary}/>
    </Draggable>
  );
}
function BasiceDiary({id, changePosHandler, nav}){  // 기본 다이어리에 위치를 잡아줌, 드래그 기능은 없음
  const [z, setZ] = useState(1);
  let diaryIndex = userData.myDiaryList.findIndex(obj => obj.id === id);
  let pos = diaryPosToRealPos(userData.myDiaryList[diaryIndex].pos);

  const zUp = () =>{
    if(z!=2) setZ(2);
  }
  const zDown = () =>{
    if(z!=1) setZ(1);
  }
  return (
    <Draggable x={pos.x} y={pos.y} z={z} disabled={true} shouldReverse onDragRelease={(event, gestureState) => {zDown();  changePosHandler(userData.myDiaryList[diaryIndex].pos, realPosToDiaryPos({x:gestureState.moveX, y:global_y+gestureState.moveY}));}} onDrag={(event, gestureState)=>{zUp(); console.log('x, y ~~ : ', gestureState.moveX, global_y+gestureState.moveY); console.log('pos: ', realPosToDiaryPos({x:gestureState.moveX, y:global_y+gestureState.moveY}))}} >
      <DiaryComponent id={id} nav={nav}/>
    </Draggable>
  );
}

// 다이어리 html 생성함수 - 미완
function buildHtml(id) {
    let name = userData.username;
    //let data = dataList[id-1];
    let data = dataList[dataList.findIndex(obj => obj.id===id)];
    let header = '';
    let body = '';

    header += (name + ' 님의 다이어리');
    // for (let i = 0; i < contents.length; i++) {
    //     body += ('<p>' + contents[i] + '</p>')
    // }

    body += '<table>';
    for (let i = 0; i < contents.length; i++) {
        body += '<tr>';
        body += '<td id="date">' + dateToHtml(dates[i]) + '</td>';
        body += '<td id="contents">' + contents[i] +
            '<br><div id = "time">' + timeToHtml(times[i]) + '</div></td>';
        body += '</tr>';
    }
    body += '</table>';

    var fullHTML = '<!DOCTYPE html>' +
        '<html><head>' +
        '<meta name="viewport" content="width=device-width, initial-scale=1.0">' +
        '<link rel="stylesheet" href="http://dc9822522482.ngrok.io/css/link.css" />' +
        '<link rel="stylesheet" media="(max-width: 768px)" href="http://dc9822522482.ngrok.io/css/mobilelink.css" /><h1>' +
        header +
        '</h1></head><body>' +
        body +
        '</body></html>';

    return fullHTML;
}

// 테ㅐ스트 용
function TestScreen({navigation}){
  const [mytext, setMytext] = useState('빈 텍스트 칸');

  const printToPdf = async () => {
      // https://forums.expo.io/t/expo-print-creating-pdf-and-giving-it-a-file-name/36164
      const response = await Print.printToFileAsync({ html: '<h1>Test-Invoice</h1>' });

      // this changes the bit after the last slash of the uri (the document's name) to "invoice_<date of transaction"

      const pdfName = `${response.uri.slice(
          0,
          response.uri.lastIndexOf('/') + 1
      )}testPDF_${Moment()}.pdf`;

      await FileSystem.moveAsync({
          from: response.uri,
          to: pdfName,
      });
      sharePdf(pdfName)
  }

  const sharePdf = (url) => {
      Sharing.shareAsync(url)
  }

  const shareWithLink = () => {
    let url = 'https://comic.naver.com/index.nhn';
    Clipboard.setString(url);
    Alert.alert('링크가 클립보드에 저장됨');
  }

  return (
    <ScrollView>
    <View style={{flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: screenHeight}}>
      <Text>기능 테스트 공간</Text>
      <TouchableOpacity onPress={printToPdf} style={{margin:20, borderWidth: 1, borderRadius: 35, height:70, width: 70, backgroundColor: 'pink', alignItems: 'center', justifyContent: 'center'}}>
        <Text>PDF 생성</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={shareWithLink} style={{margin:20, borderWidth: 1, borderRadius: 35, height:70, width: 70, backgroundColor: '#6495ED', alignItems: 'center', justifyContent: 'center'}}>
        <Text>링크공유</Text>
      </TouchableOpacity>
      <TextInput value={mytext} onChangeText={text => setMytext(text)}/>
    </View>
    </ScrollView>
  );
}

// 메인 페이지
function getAllNewMessageCount(){
  let newCount = 0;
  dataList.forEach(data => {
    newCount += data.chatroom.newItemCount;
  });
  return newCount;
}
function miniBuble(count){

  return (
    <View style={{height:12, width:16, borderRadius:8, backgroundColor: 'red', position:'absolute', right:-7, top:-2, alignItems: 'center', justifyContent: 'center'}}>
      <Text style={{fontSize: 9, color:'white'}}>{count}</Text>
    </View>
  );
}
function MainPageScreen({navigation, route}){
  const [newChatMessage, setNewChatMessage] = useState(0);

  useFocusEffect(() => {
    let newCount = getAllNewMessageCount();
    if(newChatMessage != newCount){
      setNewChatMessage(newCount);
    }
  }, []);

  return (
    <Tab.Navigator
      backBehavior={'initialRoute'} initialRouteName={'MyChatListScreen'}
      swipeEnabled={false}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, tintcolor  }) => {
          let iconName;
          let size = 24;
          if (route.name === 'SubscribeListScreen') {
            iconName = focused ? 'help-circle' : 'help-circle-outline';
            return <MaterialCommunityIcons name={iconName} size={size} color={tintcolor } />;
          } else if (route.name === 'MyChatListScreen') {
            iconName = focused ? 'chat' : 'chat-outline';

            return (
              <View>
                <MaterialCommunityIcons name={iconName} size={size} color={tintcolor} />
                {newChatMessage > 0 ? <View style={{height:12, width:16, borderRadius:8, backgroundColor: 'red', position:'absolute', right:-7, top:-2, alignItems: 'center', justifyContent: 'center'}}>
                  <Text style={{fontSize: 9, color:'white'}}>{newChatMessage}</Text>
                </View> : null}
              </View>);
          } else if (route.name === 'MyDiaryScreen') {
            if (focused) {
              //return <FontAwesome name="bookmark" size={size} color={tintcolor } />;
              return <Image source={bookOff} style={{width: 23, height: 23}}/>
            }else {
              //return <Feather name="bookmark" size={size} color={tintcolor } />;
              return <Image source={bookOn} style={{width: 22, height: 22}}/>
            }
          }
          // You can return any component that you like here!
        },
      })}
      tabBarPosition='bottom'
      tabBarOptions={{
        indicatorStyle: {backgroundColor: '#0000'},
        showIcon: true,
        showLabel: false,
        style: {
          backgroundColor: '#fafafa',
          height: 45,
        },
      }}
    >
      <Tab.Screen name="SubscribeListScreen"  component={SubscribeListScreen} />
      <Tab.Screen name="MyChatListScreen"  component={MyChatListScreen} />
      <Tab.Screen name="MyDiaryScreen"  component={MyDiaryScreen} />
      <Tab.Screen name="testScreen"  component={TestScreen} />
    </Tab.Navigator>
  );
}
function SubscribeListScreen({navigation}){
  const [numberOfSubscribe, setNumberOfSubscribe] = useState(userData.mySubscribeList.length);

  useFocusEffect(()=>{
    if(numberOfSubscribe != userData.mySubscribeList.length) setNumberOfSubscribe(userData.mySubscribeList.length);
  }, []);

  return (
    <View style={{flex:1, flexDirection: 'column', backgroundColor: 'white', alignItems: 'flex-start'}}>
      <ScrollView styles={{marginHorizontal: 20}} >
        <Text style={{margin:10, fontSize: 17}}>내 구독 상품</Text>
          {dataList.map(data => {
            if(data.isSubscribe) return <SubscribeContentLayout key={uuid()} data={data} nav={navigation}/>
          })}
        <View style={{left:10, right:10, backgroundColor: '#f0f0f0', height:1, marginVertical:7, width: screenWidth*0.98}}/>
        <Text style={{margin:10, marginTop:5, borderTopWidth: 1, fontSize: 17, borderColor: '#CCC'}}>구독 가능한 상품</Text>
          {dataList.map(data => {
            if(!data.isSubscribe) return <SubscribeContentLayout key={uuid.v4()} data={data} nav={navigation}/>
          })}
        <View style={{height:200}}/>
      </ScrollView>
    </View>
  );
}
function HiddenLayer({alarmData}){
  const [alarm, setAlarm] = useState(alarmData);

  const alarmOnOffhandler = () => {
    if(alarm) {
      // 알람 끄기
      alarmData = false;
      setAlarm(false);
    } else {
      // 알람 켜기
      alarmData = true;
      setAlarm(true);
    }
  }

  return (
    <TouchableOpacity onPress={alarmOnOffhandler}>
      <View style={{backgroundColor: '#cffffe', padding:11, paddingLeft: 30, justifyContent: 'center'}}>
          {alarm
            ? <Feather name="bell-off" size={34} color="black" />
            : <Feather name="bell" size={34} color="black" />
          }
      </View>
    </TouchableOpacity>
  );
}
function MyChatListScreen({navigation, route}){
  const [noSubscribe, setNoSubscribe] = useState(true);
  const [numberOfChatroom, setNumberOfChatroom] = useState(-1);
  const [listViewData, setListViewData] = useState([]);
  const [updateChatListScreen, setUpdateChatListScreen] = useState(0);

  const getPushMessage = () => {
    setUpdateChatListScreen(updateChatListScreen + 1);
  }

  useFocusEffect(()=>{
    if(userData.mySubscribeList.length === 0 && noSubscribe===false || userData.mySubscribeList.length != 0 && noSubscribe===true) setNoSubscribe(!noSubscribe);
    if(numberOfChatroom != userData.myChatroomList.length) {
      setNumberOfChatroom(userData.myChatroomList.length);
      setListViewData(userData.myChatroomList);
    }
  });

  return (
    <View style={{flex:1, flexDirection: 'column', backgroundColor: 'white'}}>
      {noSubscribe ? NoSubscribeInform(navigation) : <Text/>}
      <SwipeListView
        data={listViewData}
        renderHiddenItem={(data, rowMap)=>(<HiddenLayer key={data.item.id.toString()} alarmData={data.item.getPushAlarm}/>)}
        renderItem={(data, rowMap)=>(
          <ChatroomContentLayout key={data.item.id.toString()} id={data.item.id} nav={navigation}/>
        )}
        onRowOpen={(rowKey, rowMap, toValue)=>setTimeout(()=>rowMap[rowKey].closeRow(), 2000)}
        leftOpenValue={90}
        closeOnRowPress={true}
        closeOnScroll={true}
      />
      <TouchableHighlight onPress={()=>pushTestHandler(getPushMessage)} style={{position:'absolute', width:60, height: 60, right:15, bottom: 15, borderWidth: 1, borderRadius: 30, backgroundColor: 'gray', alignItems: 'center', justifyContent: 'center'}}>
        <Text style={{color: 'white', fontSize: 24}}>푸시</Text>
      </TouchableHighlight>
    </View>
  );
}
function MyDiaryScreen({route, navigation}){
  const [editMode, setEditMode] = React.useState(false);    // 편집모드 중인경우 애니메이션 기능
  const [numberOfDiary, setNumberOfDiary] = useState(-1); // 다이어리의 수
  const [updated, setUpdated] = useState(1);      // 강제 스크린 업데이트
  const [backgroundWidth, setBackgroundWidth] = useState(0); // 배경의 크기
  const [cancelScroll, setCancelScroll] = useState(true);

  const changeCnacelScrollHandler = (value) => {
    if(value !== cancelScroll) setCancelScroll(value);
  }

  const changePosHandler = (start, end) => {
    if(end > userData.myDiaryList.length){
      userData.myDiaryList.forEach((obj) => {
        if(obj.pos > start){
          obj.pos -= 1;
        }else if(obj.pos === start){
          obj.pos = userData.myDiaryList.length;
        }
      })
    }else {
      let startIndex = userData.myDiaryList.findIndex(obj => obj.pos === start);
      let endIndex = userData.myDiaryList.findIndex(obj => obj.pos === end);
      console.log('start, end : ', start, end);
      userData.myDiaryList[startIndex].pos = end;
      userData.myDiaryList[endIndex].pos = start;
    }
    setUpdated(updated+1);
  }; // 다이어리간의 위치를 바꿔주는 기능

  const setBackgroundWidthFunc = () => {
    let size = Math.ceil(userData.myDiaryList.length/2)*300;
    if(size <= screenHeight-90) setBackgroundWidth(screenHeight-90);
    else setBackgroundWidth(size);
    console.log('update backgroundWidth: ', size);
  }

  const updateDiary = (erasePos) => {
    userData.myDiaryList.forEach(obj => {
      if(obj.pos > erasePos) obj.pos -= 1;
    });
    setBackgroundWidthFunc();
    setNumberOfDiary(userData.myDiaryList.length);
    setUpdated(updated+1);
  };

  useFocusEffect(()=>{
    console.log('diary Count: ', numberOfDiary, userData.myDiaryList.length);
    console.log(userData.myDiaryList);
    if(editMode != pressDiaryEditButton) setEditMode(pressDiaryEditButton);
    if(numberOfDiary != userData.myDiaryList.length){
      setNumberOfDiary(userData.myDiaryList.length);
      setBackgroundWidthFunc();
    }
  });

  return (
    <ScrollView canCancelContentTouches={cancelScroll} bounces={false} onScroll={(event) => {global_y = event.nativeEvent.contentOffset.y; console.log('scroll: ', global_y)}}>
      <View style={{width: screenWidth, height: backgroundWidth, backgroundColor: 'white'}}>
        {numberOfDiary < 1 && <View style={{flex:1, flexDirection: 'column',  justifyContent: 'center', alignItems: 'center'}}><Text>생성된 다이어리가 없습니다.</Text></View>}
        {userData.myDiaryList.map((obj) => {
          return editMode ?
            <DraggableDiary key={obj.id} id={obj.id} nav={navigation} changePosHandler={changePosHandler} updateDiary={updateDiary} cancelDrag={changeCnacelScrollHandler}/> :
            <BasiceDiary key={obj.id} id={obj.id} nav={navigation} changePosHandler={changePosHandler}/>
        })}
      </View>
    </ScrollView>
  );
}

// 우측상단 메뉴
function mainHeaderRightHandler(route, navigation){
  var handler = ()=>myButtonHandler();
  var title = getHeaderTitle(route, '채팅');
  var text = 'My';

  if(title === '내 다이어리') {
    if(pressDiaryEditButton){
      text = '완료';
      handler = () => completeDiaryButtonHandler(route, navigation);
    }else{
      text = '편집';
      handler = () => editDiaryButtonHandler(route, navigation);
    }
  }else {
    pressDiaryEditButton = false;
    text = 'My';
    handler = () => myButtonHandler(route, navigation);
  }

  return ()=>(
    <TouchableOpacity onPress={handler}>
      <Text style={{fontWeight: 'bold', marginRight: 20, fontSize: 20, color: 'gray'}}>{text}</Text>
    </TouchableOpacity>
  );
}
function myButtonHandler(route, navigation) {return navigation.navigate('MyServicePage');}
function chatSettingButtonHandler(navigation) {return navigation.openDrawer();}
function editDiaryButtonHandler(route, navigation){
  pressDiaryEditButton = true;

  return navigation.navigate('MyDiaryScreen', {editMode: true});
}
function completeDiaryButtonHandler(route, navigation){
  pressDiaryEditButton = false;

  return navigation.navigate('MyDiaryScreen', {editMode: false});
}

// 화면 구성품
function ChatroomContentLayout(props){
  const id = props.id;
  const data = dataList[dataList.findIndex(obj => obj.id===id)];

  console.log('ChatroomContentLayout\n', data);
  //const data = dataList[id-1];
  const productInfo  = data.product;
  const [lastMessageTime, setLastMessageTime] = useState(data.chatroom.lastMessageTime);  // 최신 메세지 업데이트 시간
  const [newItemCount, setNewItemCount] = useState(data.chatroom.newItemCount);   // 최신 알림 수
  const [fromNowTime, setFromNowTime] = useState(lastMessageTime.fromNow());  // 최신 메세지 업데이트 시간, 자연적인 설명버전
  const [topMessage, setTopMessage] = useState(data.chatroom.chatmessageList[0].text);

  useFocusEffect(()=>{
    if(newItemCount != data.chatroom.newItemCount){
      setNewItemCount(data.chatroom.newItemCount);
    }
    if(lastMessageTime != data.chatroom.lastMessageTime){
      setLastMessageTime(data.chatroom.lastMessageTime);
    }
    if(fromNowTime != lastMessageTime.fromNow()){
      setFromNowTime(lastMessageTime.fromNow());
    }
    if(topMessage != data.chatroom.chatmessageList[0].text){
      setTopMessage(data.chatroom.chatmessageList[0].text);
    }
  });

  return (
    <TouchableHighlight style={{marginBottom: 10}} onPress={()=>props.nav.navigate('chatroom', {id: id})}>
    <View style={{flexDirection: 'row', height: 60, backgroundColor: 'white'}}>
      <Image source={productInfo.imageSet.thumbnailImg} style={{height: 46, width: 46, margin: 5,borderWidth: 1, borderColor: '#f7f7f7', marginLeft: 10, borderRadius: 23, backgroundColor: '#DDD'}}/>
      <View style={{flexDirection: 'column'}}>
        <Text style={{marginLeft: 10, marginTop: 6, fontSize: 17,fontWeight: '400', width: 220}}>{productInfo.title}</Text>
        <Text numberOfLines={1} style={{color: '#AAA', fontSize: 12, marginLeft: 13, marginTop:3, width: 230}}>{topMessage}</Text>
      </View>
      <View style={{flex:1, flexDirection: 'column', alignItems: 'flex-end'}}>
        <Text style={{fontSize: 10, marginRight: 10, marginTop: 0}}>{fromNowTime}</Text>
        {newItemCount > 0 && <View style={{height: 20, width: 20, borderRadius: 10, backgroundColor: '#F66', margin: 6, marginRight: 10, marginBottom: 8, alignItems: 'center', justifyContent: 'center'}}><Text style={{color: 'white', fontSize: 11}}>{newItemCount}</Text></View> }
      </View>
    </View>
    </TouchableHighlight>
  );
}
function SubscribeContentLayout(props){
  let data = props.data;
  let productInfo = data.product;
  //console.log('SubscribeContentLayout\n', productInfo);
  //const productInfo = dataList[id-1].product;

  return (
    <TouchableOpacity onPress={()=>props.nav.navigate('contentScreen', {data: data})}>
    <View style={{flexDirection: 'row', height: 56, margin: 3, marginBottom: 10}}>
      <Image resizeMode='cover' source={productInfo.imageSet.thumbnailImg} style={{height: 46, borderWidth: 1, borderColor: '#f7f7f7', width: 46, margin: 5, borderRadius: 23, backgroundColor: '#DDD'}}/>
      <View style={{flexDirection: 'column'}}>
        <Text style={{marginLeft: 10, marginTop: 6, fontSize: 17,fontWeight: '400', width: 220}}>{productInfo.title}</Text>
        <Text numberOfLines={1} style={{color: '#AAA', fontSize: 12, marginLeft: 13, marginTop:3, width: 230}}>{productInfo.text}</Text>
      </View>
    </View>
    </TouchableOpacity>
  );
}
function getHeaderTitle(route, initialName) {
  // If the focused route is not found, we need to assume it's the initial screen
  // This can happen during if there hasn't been any navigation inside the screen
  // In our case, it's "Feed" as that's the first screen inside the navigator
  const routeName = getFocusedRouteNameFromRoute(route) ?? initialName;

  switch (routeName) {
    case 'MyChatListScreen':
      return '채팅';
    case 'MyDiaryScreen':
      return '내 다이어리'
    case 'SubscribeListScreen':
      return '구독 상품';
  }

  return routeName;
}

// 다이어리와 채팅방 초기화 함수
function diaryInitializeFunction(id){ // 다이어리 초기로 생성 함수
  // 기존의 다이어리 있는지 확인
  //const data = dataList[id-1];
  const data = dataList[dataList.findIndex(obj => obj.id===id)];
  if(data.hasDiary) {
    // 아무것도 하지 않음
    return ;
  } else {
    // 초기버전 다이어리 만듦
    data.hasDiary = true; // 다이어리를 보이게 함
    userData.myDiaryList.push({id:id, pos: userData.myDiaryList.length+1, color: Math.floor(Math.random() * 10)});

    // 다이어리 초기 데이터 구성
    let makeDiaryData = {
      makeTime: Moment(), totalUpdateCount: 0, diarymessageList: [],
    };

    data.diary = _.cloneDeep(makeDiaryData); // 다이어리 데이터 연결
    return ;
  }
}
function chatroomInitializeFunction(id){ // 채팅방 초기로 생성 함수
  // 기존의 채팅창이 있는지 확인함
  //const data = dataList[id-1];
  const data = dataList[dataList.findIndex(obj => obj.id===id)];
  if(data.hasChatroom) {
    // 아무것도 하지 않음
    return ;
  } else {
    // 초기버전 채팅창을 만듦
    userData.myChatroomList.push({id: id, getPushAlarm: true, key:id.toString()});
    data.hasChatroom = true; // 채팅창을 보이게 함

    // 채팅창 초기 데이터 구성
;
    let makeChatmessageListData = [
      {
        _id: 1, text: data.product.title + ' 채팅방입니다.', createdAt: Moment(),
        user: { _id:2, avatar: data.product.imageSet.avatarImg.uri??data.product.imageSet.avatarImg},
      },
    ];
    let makeChatroomData = {
      lastMessageTime: Moment(), newItemCount: 1, chatmessageList: makeChatmessageListData, lastPushed: {pushTime: null, questIndex: null, solved:true},
    };

    data.chatroom = _.cloneDeep(makeChatroomData); // 채팅창 데이터 연결

    return ;
  }
}

// 취소 및 삭제함수
function unSubscribe(id){
  userData.mySubscribeList.splice(userData.mySubscribeList.findIndex(obj => obj.id===id), 1);
  //dataList[id-1].isSubscribe = false;
  const data = dataList[dataList.findIndex(obj => obj.id===id)];
  data.isSubscribe = false;

}
function deleteChatroom(id){
  userData.myChatroomList.splice(userData.myChatroomList.findIndex(obj => obj.id===id), 1);
  //dataList[id-1].hasChatroom = false;
  const data = dataList[dataList.findIndex(obj => obj.id===id)];
  data.hasChatroom = false;
}

// 구독 상품 화면
function SubscribeContentScreen({route, navigation}){
  const data = route.params.data;
  //const data = dataList[id-1];
  //const data = dataList.some(data => data.id===id?data:false);

  const [isSubscribeButton, setIsSubscribeButton] = useState(data.isSubscribe);
  const [pushStartTime, setPushStartTime] = useState(data.push.pushStartTime);
  const [pushEndTime, setPushEndTime] = useState(data.push.pushEndTime);
  let tempTime;
  let thisScrollView = null;
  let goToEnd = route.params.goToEnd??null;


  const [dataTimePickerOption, setDataTimePickerOption] = useState(1);  // 바꿀것
  const [show0, setShow0] = useState(false);
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);
  const [show3, setShow3] = useState(false);
  const [show4, setShow4] = useState(false);

  useEffect(() => {
    if(isSubscribeButton){
      userData.mySubscribeList.some( obj => {
        if(obj.id === data.id){
          setPushStartTime(obj.pushStartTime);
          setPushEndTime(obj.pushEndTime);
          return true;
        }
      })
    }
  }, []);

  const subscribeOffHandler = () => {
    userData.mySubscribeList.splice(userData.mySubscribeList.findIndex(obj => obj.id === data.id), 1);
    data.isSubscribe = false; // false
    setIsSubscribeButton(false);
    setPushStartTime(data.push.pushStartTime);
    setPushEndTime(data.push.pushEndTime);
  };
  const subscribeOnHandler = (startTime, endTime) => {
    // 시간 설정 성공
    userData.mySubscribeList.push({id:data.id, pushStartTime:startTime, pushEndTime:endTime});
    data.isSubscribe = true; // true
    setIsSubscribeButton(true);

    // 채팅창 초기화 준비
    chatroomInitializeFunction(data.id);
    // 다이어리 초기화 준비
    diaryInitializeFunction(data.id);

    // 시간  설정 실패 return
  };
  const onChange0 = (event, selectedDate) => {
    let getTime = Moment(selectedDate);
    setShow0(false); // 시간 선택 종료
    // 취소한 경우

    if(event.type === 'dismissed') return Alert.alert('취소하였습니다.');
    // 시간 등록
    setPushStartTime(getTime);
    setPushEndTime(getTime);
    subscribeOnHandler(getTime, getTime);
  };
  const onChange1 = (event, selectedDate) => {
    let getTime = Moment(selectedDate);
    setShow1(false); // 시간 선택 종료
    // 취소한 경우
    if(event.type === 'dismissed') return Alert.alert('취소하였습니다.');
    setPushStartTime(getTime);
    // 시간 등록

    setTimeout(() => {
      setShow2(true);

    }, 200);
  };
  const onChange2 = (event, selectedDate) => {
    let getTime = Moment(selectedDate);
    setShow2(false);  // 시간 선택 종료

    if(event.type === 'dismissed') {
      setPushStartTime(data.push.pushStartTime);  //   데이터 복구
      return Alert.alert('취소하였습니다.')
    };

    setPushEndTime(Moment(selectedDate));
    subscribeOnHandler(pushStartTime, getTime);
  };

  const subscribeButtonHandler = () => {
    if(data.isSubscribe) {
      // 구독 취소
      Alert.alert('구독을 취소하시겠습니까?', '구독을 취소하여도 채팅기록과 다이어리는 남습니다.', [{text: '취소'}, {text:'구독취소', onPress: subscribeOffHandler}]);
    }else{
      // 구독 신청
      Alert.alert(data.product.title + ' 상품을 구독하시겠습니까?', '푸시 알람설정을 완료하여 구독을 할 수 있습니다.', [{text:'취소'}, {text:'푸시설정', onPress:()=>{thisScrollView.scrollToEnd({animated: true}); data.push.isRandomPushType ?  setShow1(true) : setShow0(true)}}]);
    }
  };

  const pushTimeChanger = (type) => {
    if(show3 || show3) return;
    if(type === 1){
      // start
      setShow3(true);
    }else{
      setShow4(true);
    }
  }
  const changePushTime = (start, end) => {
    let myData = userData.mySubscribeList[userData.mySubscribeList.findIndex(obj => obj.id===data.id)];
    myData.pushStartTime = start;
    myData.pushEndTime = end;
  }
  const pushStartChanger = (event, selectedDate) => {
    let getTime = Moment(selectedDate);
    setShow3(false);  // 시간 선택 종료

    if(event.type === 'dismissed') {
      return Alert.alert('취소하였습니다.')
    };

    setPushStartTime(Moment(selectedDate));
    changePushTime(getTime, pushEndTime);
  };
  const pushEndChanger = (event, selectedDate) => {
    let getTime = Moment(selectedDate);
    setShow4(false);  // 시간 선택 종료

    if(event.type === 'dismissed') {
      return Alert.alert('취소하였습니다.')
    };

    setPushEndTime(Moment(selectedDate));
    changePushTime(pushStartTime, getTime);
  };

  const MyDateTimePicker = ({option}) => {
    console.log('ooption: ', option);
    switch(option){
      case 0:
        return (<View/>);
      case 1:
        return (
          <View style={{flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', borderWidth: 0, borderColor: 'blue', marginTop:10, paddingLeft:5}}>
            <Text style={{fontSize: 19}}>푸시알림 수신시간을 설정해 주세요.</Text>
            <DateTimePicker testID="dateTimePicker" value={pushStartTime.toDate()} mode={'time'} is24Hour={true} display="default" onChange={onChange0}/>
          </View>
        )
      case 2:
        return (
          <View style={{flexDirection: ' row', alignItems: 'flex-start', justifyContent: 'space-between', borderWidth: 0, borderColor: 'blue', marginTop:10, paddingLeft:5}}>
            <Text style={{fontSize: 19}}>푸시알림 시간대를 설정해주세요.</Text>
            <DateTimePicker testID="dateTimePicker" value={pushStartTime.toDate()} mode={'time'} is24Hour={true} display="default" onChange={onChange1}/>
          </View>
        );
      case 3:
        return (
          <View style={{flexDirection: ' row', alignItems: 'flex-start', justifyContent: 'space-between', borderWidth: 0, borderColor: 'blue', marginTop:10, paddingLeft:5}}>
            <Text style={{fontSize: 19}}>푸시알림 시간대를 설정해주세요.</Text>
            <Text style={{color: '#AAA', fontSize: 19, marginTop: 5}}>{pushStartTime.format('LT')} 부터</Text>
            <DateTimePicker testID="dateTimePicker" value={pushStartTime.toDate()} mode={'time'} is24Hour={true} display="default" onChange={onChange2}/>
          </View>
        );
    }

    return (<View/>);
  }

  return (
    <SafeAreaView>
      <ScrollView style={{width:screenWidth}}  ref={ref =>{ thisScrollView = ref}} onContentSizeChange={() =>{goToEnd && thisScrollView.scrollToEnd({animated: true}); goToEnd = null;}}  centerContent={true} onScroll={(event)=>{
        event.nativeEvent.contentOffset.y > 255.0 ? navigation.setOptions({ headerTitle: data.product.title, headerTransparent: false}) : navigation.setOptions({ headerTitle: '', headerTransparent: true})
      }}>
        <Image source={data.product.imageSet.logoImg} style={{height: 200}} resizeMode='stretch'/>
        <View style={{alignItems: 'center', borderWidth: 0, borderColor:'black'}}>
          <Image source={data.product.imageSet.thumbnailImg} resizeMode='cover' style={{position:'absolute', borderWidth: 0, borderColor: '#AAA', alignSelf: 'center', top:-80, height: 100, width: 100, borderRadius: 50}}/>
          <Text style={{fontSize: 21, fontWeight:'bold', marginTop: 35, marginBottom: 10}}>{data.product.title}</Text>
          <Text style={{margin: 20, marginTop:0}}>{data.product.text}</Text>
        </View>
        <Image source={data.product.imageSet.mainImg} style={{ width:screenWidth, height:screenWidth, borderWidth: 0, resizeMode: 'contain'}}/>
        <View style={{flexDirection:'column', paddingVertical: 10, paddingHorizontal: 15, borderTopWidth:0, borderBottomWidth:1, borderColor: '#f0f0f0'}}>
          <Text style={{fontSize: 21}}>구독 상품 설정</Text>
        </View>
        <View style={{width:screenWidth, flexDirection: 'column', paddingHorizontal: 15}}>
          <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginLeft: 10}}>
            {isSubscribeButton ?<Text style={{fontSize: 19}}>구독 중</Text> :  <Text style={{fontSize: 19}}>구독하기</Text>}
            <TouchableOpacity onPress={subscribeButtonHandler} style={{marginRight: 10, marginVertical: 7}}>
                {isSubscribeButton? (
                    <Image source={subOff}  style={{width:65, height:40}}/>
                ):(
                    <Image source={subOn} style={{width:65, height:40}}/>
                )}
            </TouchableOpacity>
          </View>
          {isSubscribeButton &&
            <View style={{flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', borderTopWidth: 1, paddingBottom:10, borderColor: '#f0f0f0', marginLeft: 10}}>
              <Text style={{fontSize: 19, marginTop:17}}>메시지 수신 시간</Text>
              <TouchableOpacity onPress={()=>{Alert.alert('시간 변경')}}>
                {data.push.isRandomPushType
                  ? <View style={{flexDirection: 'column', justifyContent: 'space-around'}}>
                      <TouchableOpacity onPress={() => pushTimeChanger(1)}>
                        <Text style={{color: '#AAA', fontSize: 19, marginTop:10}}>{pushStartTime.format('LT')} 부터</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => pushTimeChanger(2)}>
                        <Text style={{color: '#AAA', fontSize: 19}}>{pushEndTime.format('LT')} 사이</Text>
                      </TouchableOpacity>
                    </View>
                  : <TouchableOpacity onPress={() => pushTimeChanger(1)}><Text style={{fontSize: 19, color: '#AAA', fontSize: 19, marginTop:17, marginBottom:7}}>{pushStartTime.format('LT')}</Text></TouchableOpacity>
                }
              </TouchableOpacity>
            </View>
          }
        </View>
        <View style={{backgroundColor: '#f0f0f0', height:1, width: '100%', marginVertical: 0}}/>
        <View style={{height:290, width: '100%', flexDirection: 'column', paddingVertical: 5, paddingHorizontal: 15, paddingLeft:20}}>
          {show0 &&
            <View style={{flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', borderWidth: 0, borderColor: 'blue', marginTop:10, paddingLeft:5}}>
              <Text style={{fontSize: 19}}>푸시알림 수신시간을 설정해 주세요.</Text>
            </View>
          }
          {show1 &&
            <View style={{flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', borderWidth: 0, borderColor: 'blue', marginTop:10, paddingLeft:5}}>
              <Text style={{fontSize: 19}}>푸시알림 수신시간을 설정해 주세요.</Text>
            </View>
          }
          {show2 &&
            <View style={{flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', borderWidth: 0, borderColor: 'blue', marginTop:10, paddingLeft:5}}>
              <Text style={{fontSize: 19}}>푸시알림 시간대를 설정해주세요.</Text>
              <Text style={{color: '#AAA', fontSize: 19, marginTop: 5}}>{pushStartTime.format('LT')} 부터</Text>
            </View>
          }

          <View style={{marginTop:10}}>
            {show0 && <DateTimePicker testID="dateTimePicker" value={pushStartTime.toDate()} mode={'time'} is24Hour={true} display="default" onChange={onChange0}/>}
            {show1 && <DateTimePicker testID="dateTimePicker" value={pushStartTime.toDate()} mode={'time'} is24Hour={true} display="default" onChange={onChange1}/>}
            {show2 && <DateTimePicker testID="dateTimePicker" value={pushStartTime.toDate()} mode={'time'} is24Hour={true} display="default" onChange={onChange2}/>}
            {show3 && <DateTimePicker testID="dateTimePicker" value={pushStartTime.toDate()} mode={'time'} is24Hour={true} display="default" onChange={pushStartChanger}/>}
            {show4 && <DateTimePicker testID="dateTimePicker" value={pushEndTime.toDate()} mode={'time'} is24Hour={true} display="default" onChange={pushEndChanger}/>}
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

// 채팅 구성품
function NoSubscribeInform(navigation){
  return (
    <TouchableOpacity onPress={()=>{ navigation.navigate('SubscribeListScreen'); Alert.alert('상품을 구독해 보세요', '구독한 상품정보를 받을 수 있습니다.', [{text: '확인'}])}}>
      <View style={{flexDirection: 'row', height: 56, margin: 10, borderWidth: 1, borderRadius: 8, borderColor: 'gray', alignItems: 'center'}}>
        <Image source={null} style={{height: 40, width: 40, margin: 16, borderRadius: 8, backgroundColor: '#DDD'}}/>
        <Text style={{marginLeft: 15, fontSize: 17, width: 220}}>원하는 상품을 구독해보세요!</Text>
      </View>
    </TouchableOpacity>
  );
}
function CustomDrawerContent({navigation}) {

  const getOutChatroom = () => {
    unSubscribe(global_p_id);
    deleteChatroom(global_p_id);
    navigation.navigate('MainPage');
  }

  return (
    <DrawerContentScrollView style={{backgroundColor: '#FFF'}}>
      <TouchableOpacity onPress={()=>navigation.closeDrawer()}>
        <Octicons name="three-bars" style={{marginLeft:20, marginTop:10, marginBottom: 20}} size={20} color="black" />
      </TouchableOpacity>
      <DrawerItem label="다이어리 보기"  icon={()=><Image source={bookOn} resizeMode={'cover'} style={{width:20, height:20}}/>} onPress={() => {navigation.navigate('MyDiaryScreen'); navigation.navigate('Diary', {id:global_p_id, goToEnd: true})}} />
      <DrawerItem label="푸시 메세지 설정" icon={()=><Ionicons name="md-time" style={{marginLeft: 3}} size={20} color="black" />} onPress={() => {navigation.navigate('SubscribeListScreen'); navigation.navigate('contentScreen', {id:global_p_id, goToEnd: true})}} />
      <DrawerItem label="채팅방 나가기" icon={()=><MaterialIcons name="exit-to-app" style={{marginLeft: 1}} size={20} color="black" />}
        onPress={() => {
          Alert.alert('정말 채팅방을 나가시겠습니까?', '채팅방을 나가면 채팅 내용과 채팅 목록은 사라지고 다이어리에서만 기록을 확인할 수 있습니다.', [{text: '나가기', onPress: getOutChatroom}, {text:'취소'}]);}} />
    </DrawerContentScrollView>
  );
}
function makeDiaryMessage(id, message){ // 다이어리 메세지 생성기능
  //let data = dataList[id-1];
  let data = dataList[dataList.findIndex(obj => obj.id===id)];
  let diaryForm = { _id: uuid.v4(), text: '', createdAt: message.createdAt, islagacy: false, linkedMessageList: [{id: message._id, text:message.text}]};
  data.diary.diarymessageList.push(_.cloneDeep(diaryForm));
  data.diary.totalUpdateCount += 1;
}
function deleteMessage(id, messageId){ // 다이어리와 연동중이면 해당하는 메시지를 지운다.
  //let data = dataList[id-1];
  let data = dataList[dataList.findIndex(obj => obj.id===id)];
  //let deleteIndex = null;

  data.diary.diarymessageList.some(message => {
    if(!message.islagacy){
      // 연동중이면
      let deleteIndex = message.linkedMessageList.findIndex(obj => obj.id === messageId);
      if(deleteIndex !== -1){
        message.linkedMessageList.splice(deleteIndex, 1);
        return true;
      }
    }
  });
}
function renderLoading() {
  return (
    <View style={{flex:1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
      <ActivityIndicator size='large' color='#6646ee' />
    </View>
  );
}
function renderSend(props) {
  return (
    <Send
      {...props}
    >
      <View style={{marginBottom:3.5, marginRight:2.5}}>
        <Image source={upArrow} style={{width: 38, height: 38}}/>
      </View>
    </Send>
  );
}
function renderComposer(props){ // textInput style
  return (
    <Composer
      {...props}
      textInputStyle={{borderWidth: 0,marginTop:7, alignSelf: 'center', alignContent: 'center', justifyContent: 'center', paddingTop: 10, borderColor: 'green'}}
    />
  );
}
function renderBubble(props) {
  return (
    // Step 3: return the component
    <Bubble
      {...props}
      wrapperStyle={{
        right: {
          // Here is the color change
          backgroundColor: '#FFD400',
          marginVertical: 3,
          borderRadius: 20,
        },
        left: {
          marginVertical: 9,
          borderRadius: 20,
        }
      }}
      textStyle={{
        right: {
          color: 'black',
          fontSize: 15,
          padding: 3,
        },
        left: {
          fontSize: 15,
          padding: 3,
        }
      }}
      bottomContainerStyle={{
        right: {
          position: 'absolute',
          left: -52,
          bottom: -2,
        },
        left: {
          position: 'absolute',
          right: -52,
          bottom: -2,
        }
      }}
    />
  );
}
function renderTime(props) {
  return (
    <Time {...props}
      timeTextStyle={{
        right: {
          color: 'gray',
          fontSize: 8,
        },
        left: {
          color: 'gray',
          fontSize: 8,
        }
      }}
      containerStyle={{
        right: {
          alignItems: 'flex-start',
          width: 46,
        },
        left: {
          alignItems: 'flex-end',
          width: 46,
        }
      }}
    />
  );
}
function renderInputToolbar(props) {
  return (
    <InputToolbar
      {...props}
      primaryStyle={{borderWidth: 1, borderColor: '#CCC',marginVertical: 6,marginHorizontal:9, borderRadius: 30, backgroundColor: '#f0f0f0'}}
      textInputProps={{autoFocus: true}}
    />
  );
}
function renderDay (props) {
  return (
    <Day {...props}
      wrapperStyle={{
        marginVertical: 10,
      }}
    />
  );
}
function MyChatRoomScreen({route, navigation}) {  // 채팅방 화면
  const [messages, setMessages] = useState([]);
  const id = route.params.id;
  //let data = dataList[id-1];
  let data = dataList[dataList.findIndex(obj => obj.id===id)];
  const [update, setUpdate] = useState(0);

  useEffect(() => {
    setMessages(data.chatroom.chatmessageList);                 // 메세지 로드
    navigation.setOptions({ headerTitle: data.product.title }); // 채팅방 제목 설정
    global_p_id = id;                                           // 전역변수에 현재 관심 id 설정

    // 채팅방 확인
    data.chatroom.newItemCount = 0;
  }, []);

  const updateFunc = () => {
    setUpdate(update+1);
  }; // 화면 업데이트
  console.log('messages last\n', messages[0]);

  const onDelete = useCallback((messageIdToDelete) => {
    console.log('delete message Id: ', messageIdToDelete);
    data.chatroom.chatmessageList.splice(data.chatroom.chatmessageList.findIndex(chatmessage => chatmessage._id === messageIdToDelete), 1); // 데이터에서 지우기
    setMessages(previousMessages => previousMessages.filter(message => message._id !== messageIdToDelete)); // 채팅방에서 지우기
    deleteMessage(id, messageIdToDelete); // 다이어리에서 지우기
  },[]);

  const onSend = useCallback((messages = []) => {
    // 메세지 화면 표시
    setMessages(previousMessages => GiftedChat.append(previousMessages, messages));

    // 메세지 가공
    let message = _.cloneDeep(messages[0]);   // 메세지 복사
    message.createdAt = Moment(message.createdAt);  // 시간정보를 Moment로 커버

    // 채팅방에 저장
    data.chatroom.lastMessageTime = Moment();
    data.chatroom.chatmessageList.unshift(_.cloneDeep(message));

    // 다이어리에 저장
    if(data.diary.diarymessageList.length === 0) {
      // 첫 메세지
      makeDiaryMessage(id, message);
    }else{
      let topMessage = data.diary.diarymessageList[data.diary.diarymessageList.length-1];
      let checkTime = Moment.duration(topMessage.createdAt.diff(message.createdAt)).asMinutes();
      if(-1 <= checkTime && checkTime <= 0 && !topMessage.islagacy){
        // 같은 메세지로 인정 15분 간격
        topMessage.linkedMessageList.push({id: message._id, text: message.text});
      }else{
        // 새로운 메세지 생성
        makeDiaryMessage(id, message);
      }
    }

    // 답변이 필요한 경우
    if(!data.chatroom.lastPushed.solved){
      data.chatroom.lastPushed.solved=true;

      setTimeout(() => {
        let ansMessage = _.cloneDeep({
          _id: uuid.v4(), text: data.product.ansList[data.chatroom.lastPushed.questIndex], createdAt: Moment(),
          user: { _id:2, avatar: data.product.imageSet.avatarImg.uri?? data.product.imageSet.avatarImg},
        });
        data.chatroom.lastMessageTime = Moment();
        data.chatroom.chatmessageList.unshift(ansMessage);
        setMessages(previousMessages => GiftedChat.append(previousMessages, ansMessage));
      }, 5 * 1000);
    }

  }, []);

  const onLongPress = (context, message) => {
    if(message.user._id === 1){
      // 유저 메시지 확인
      let alertMessage = '';
      if(message.text.length > 17){
        alertMessage = message.text.substring(0, 13)+'... 메시지를 삭제하시겠습니까?';
      }else{
        alertMessage = message.text + ' 메시지를 삭제하시겠습니까?';
      }
      Alert.alert('메시지 삭제 확인', alertMessage, [{text: '취소'}, {text:'삭제', onPress:() => onDelete(message._id)}]);
    }
  }

  return (
      <GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}
        user={{ _id: 1}}
        placeholder ={''}
        alwaysShowSend ={true}
        locale={'ko'}
        showAvatarForEveryMessage={true}
        renderBubble={renderBubble}
        renderSend={renderSend}
        renderLoading={renderLoading}
        renderTime ={renderTime}
        renderDay={renderDay}
        bottomOffset ={-15}
        renderInputToolbar={renderInputToolbar}
        renderComposer={renderComposer}
        scrollToBottom ={true}
        alignTop={true}
        maxInputLength={10}
        onLongPress={onLongPress}
      />

  )
}

// 다이어리 구성품
function AnimatableDiaryComponent(props){
  const id = props.id;
  //const data = dataList[id-1];
  let data = dataList[dataList.findIndex(obj => obj.id===id)];
  const [makeTime, setMakeTime] = useState(data.diary.makeTime);
  const [totalUpdateCount, setTotalUpdateCount] = useState(data.diary.totalUpdateCount);
  const [nowTime, setNowTime] = useState(Moment());
  let mydiarySettingIndex = userData.myDiaryList.findIndex(obj => obj.id === id);
  let x, y;

  useFocusEffect(()=>{
    if(makeTime != data.diary.makeTime) setMakeTime(data.diary.makeTime);
    if(totalUpdateCount != data.diary.totalUpdateCount) setTotalUpdateCount(data.diary.totalUpdateCount);
    if(!nowTime.isSameOrAfter(nowTime, 'day')) setNowTime(Moment());
  });

  const eraseDiaryHandler = () => { // 다이어리 삭제 기능
    let thisPos = userData.myDiaryList[userData.myDiaryList.findIndex(obj => obj.id === id)].pos;  // 현재 위치 확인
    userData.mySubscribeList.splice(userData.mySubscribeList.findIndex(obj => obj.id === id), 1);  // 구독 제거
    userData.myChatroomList.splice(userData.myChatroomList.findIndex(obj => obj.id === id), 1);    // 채팅창 제거
    userData.myDiaryList.splice(userData.myDiaryList.findIndex(obj => obj.id === id), 1);          // 다이어리 제거
    data.hasDiary = false;        // 다이어리 없음 셋팅
    data.hasChatroom = false;     // 채팅창 없음 셋팅
    data.isSubscribe = false;     // 구독 없음 셋팅
    data.diary.totalUpdateCount = 0;
    props.updateDiary(thisPos);    // 화면 렌더링 & 현재 다이어리보다 높은 위치의 다이어리를 모두 한 칸 아래로 압축
  }

  const eraseDiaryAlertHandler = () => { // 다이어리 삭제할 건지 더 물어봄
    Alert.alert('정말로 '+data.product.title+'을 삭제하시겠습니까?', '다이어리를 삭제하면 현재 상품에 대한 다이어리와 채팅 기록이 모두 사라지며 구독이 취소됩니다.', [{text: '취소'}, {text: '확인', onPress: eraseDiaryHandler}]);
  };

  return (
    <View style={{margin: 5}} onLayout={(e)=>{x = e.nativeEvent.layout.x; y = e.nativeEvent.layout.y; console.log('x, y : ', x, y)}}>
      <Animatable.View animation='swing' iterationCount={'infinite'}>
      <View style={{margin: 20, marginBottom: 0, marginTop: 10}}>
          <View style={{position:'absolute', left:3, top:5, height: 185, width:130, backgroundColor: '#CCC', borderBottomRightRadius: 8, borderTopRightRadius: 8}}/>
          <Image style={{height: 190, width: 130}} source={diaryImgList[userData.myDiaryList[mydiarySettingIndex].color]} resizeMode='contain'/>
          <View>
            <Text adjustsFontSizeToFit={true} style={{width: 130, fontSize: 16,  color: 'black', fontWeight:'bold', alignSelf: 'center', marginBottom: 3, marginTop:3}}>{data.product.title}</Text>
            <View style={{flexDirection: 'column', marginBottom: 5}}>
              {makeTime.isSameOrAfter(nowTime, 'day')
                ? <View><Text style={{fontSize: 8, color: 'gray'}}>오늘 생성한 다이어리</Text><Text style={{fontSize: 8, color: 'gray', alignSelf: 'flex-end', paddingRight:62}}>총 {totalUpdateCount}회 기록</Text></View>
                : <View><Text style={{fontSize: 8, color: 'gray'}}>{makeTime.format('L')} ~ {nowTime.format('L')}</Text><Text style={{fontSize: 8, color: 'gray', alignSelf: 'flex-end', paddingRight:30}}>총 {totalUpdateCount}회 기록</Text></View>}
            </View>
          </View>
    </View>
    </Animatable.View>
    <TouchableOpacity onPress={eraseDiaryAlertHandler} style={{position: 'absolute', left: 18, top:18, backgroundColor: '#DDD', height: 34, width: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center'}}>
      <Text style={{fontWeight:'bold'}}>X</Text>
    </TouchableOpacity>
  </View>
  );
}
function DiaryComponent(props){
  const id = props.id;
  //const data = dataList[id-1];
  let data = dataList[dataList.findIndex(obj => obj.id===id)];
  const [makeTime, setMakeTime] = useState(data.diary.makeTime);
  const [totalUpdateCount, setTotalUpdateCount] = useState(data.diary.totalUpdateCount);
  const [nowTime, setNowTime] = useState(Moment());
  let mydiarySettingIndex = userData.myDiaryList.findIndex(obj => obj.id === id);

  useFocusEffect(()=>{
    if(makeTime != data.diary.makeTime) setMakeTime(data.diary.makeTime);
    if(totalUpdateCount != data.diary.totalUpdateCount) setTotalUpdateCount(data.diary.totalUpdateCount);
    if(!nowTime.isSameOrAfter(nowTime, 'day')) setNowTime(Moment());
  });

  return (
    <TouchableOpacity style={{margin: 20, marginBottom: 0, marginTop: 10}} onPress={()=>{props.nav.navigate('Diary', {id: id})}}>
      <View style={{margin: 5}}>
        <View style={{position:'absolute', left:3, top:5, height: 185, width:130, backgroundColor: '#CCC', borderBottomRightRadius: 8, borderTopRightRadius: 8}}/>
        <Image style={{height: 190, width: 130}} source={diaryImgList[userData.myDiaryList[mydiarySettingIndex].color]} resizeMode='contain'/>
        <View>
          <Text adjustsFontSizeToFit={true} style={{width: 130, fontSize: 16, color: 'black', fontWeight:'bold', alignSelf: 'center', marginBottom: 3, marginTop:3}}>{data.product.title}</Text>
          <View style={{flexDirection: 'column', marginBottom: 5}}>
            {makeTime.isSameOrAfter(nowTime, 'day')
              ? <View><Text style={{fontSize: 8, color: 'gray'}}>오늘 생성한 다이어리</Text><Text style={{fontSize: 8, color: 'gray', alignSelf: 'flex-end', paddingRight:62}}>총 {totalUpdateCount}회 기록</Text></View>
              : <View><Text style={{fontSize: 8, color: 'gray'}}>{makeTime.format('L')} ~ {nowTime.format('L')}</Text><Text style={{fontSize: 8, color: 'gray', alignSelf: 'flex-end', paddingRight:30}}>총 {totalUpdateCount}회 기록</Text></View>}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
function MyDropList(props){
  const downloadPDFHandler = () => {
    Alert.alert('PDF 다운로드 버튼');
  };
  const shareWithLinkHandler = () => {
    Alert.alert('링크로 공유하기 버튼');
  }

  return (
    <View style={{position: 'absolute', left: 0, top:0, bottom:0, right:0, backgroundColor: '#AAA8'}}>
      <View style={{height: 65, borderBottomWidth: 1, borderColor: '#AAA', backgroundColor: '#FFF', justifyContent: 'center'}}>
        <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', padding: 5}} onPress={downloadPDFHandler}>
          <FontAwesome name="file-pdf-o" size={30} color="black" style={{marginLeft: 10}}/>
          <Text style={{position: 'absolute', left: 50, fontSize: 23}}>PDF 다운로드</Text>
        </TouchableOpacity>
      </View>
      <View style={{height: 65, backgroundColor: '#FFF', justifyContent: 'center'}}>
        <TouchableOpacity style={{flexDirection: 'row',  alignItems: 'center', padding: 5}} onPress={shareWithLinkHandler}>
          <EvilIcons name="external-link" size={40} color="black" />
          <Text style={{position: 'absolute', left: 50, fontSize: 23}}>링크로 공유하기</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={props.handler} style={{flex:1, flexDirection: 'column', backgroundColor: '#AAA7'}}/>
    </View>
  )
}
function NoDataInDiary(){
  return (
    <View style={{flex:1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
      <Text style={{fontSize: 15}}>채팅방에서 글을 작성해보세요.</Text>
    </View>
  );
}
function DiaryYear(props){
  const year = props.year;

  return (
    <View style={{paddingVertical: 5, marginBottom: 20}}>
      <View style={{backgroundColor: '#999', borderRadius: 12, marginLeft: 20, width: 70}}>
        <Text style={{color: 'white', fontSize: 20, marginVertical: 2, alignSelf: 'center'}}>{year}</Text>
      </View>
    </View>
  );
}
function DiaryDate(props){
  const date = props.date;

  return (
      <View style={{flexDirection: 'row', height: 40, alignItems: 'center'}}>
        <View style={{width: 10, height: 10, borderRadius: 5, backgroundColor: '#CCC', marginLeft: 50, marginBottom:3}}/>
        <TouchableOpacity onPress={props.onPressHandler}>
          <Text style={{marginLeft: 20, fontSize: 20, color: 'black', marginBottom:5}}>{date}</Text>
        </TouchableOpacity>
      </View>
  );
}
function DiaryTextWithDate(props){
  // 옵션 셋팅 변수
  const showYear = props.options.first || !props.options.sameYear;
  const showDate = props.options.first || !props.options.sameDate;
  const last = props.options.last;
  const title = props.title;
  const [myMessage, setMyMessage] = useState(props.message.text); // 표시되는 메시지
  const [editMode, setEditMode] = useState(true);                 // 편집모드 확인
  let handler = props.handler;                                    // 우상단 기능 구현함수
  let minusHandler = props.minusHandler;                          // 마지막 항목의 크기를 측정해감
  const [saveLastMessage, setSaveLastMessage] = useState('');     // 초기 메시지 저장 & 변경 확인용

  // 시간 및 날짜 편집용 변수
  const [showTimeChanger, setShowTimeChanger] = useState(false);
  const [showDateChanger, setShowDateChanger] = useState(false);

  const timeChangerHandler = (event, selectedDate) => {
    setShowTimeChanger(false);
    if(event.type === 'dismissed') return Alert.alert('취소하였습니다.');

    props.message.createdAt = Moment(selectedDate);
    props.diarySort();
  }
  const dateChangerHandler = (event, selectedDate) => {
    setShowDateChanger(false);
    if(event.type === 'dismissed') return Alert.alert('취소하였습니다.');

    props.message.createdAt = Moment(selectedDate);
    props.diarySort();
  }


  const onFocusHandler = () => {
    props.nav.setOptions({
      headerTitle: '내 기록편집',
      headerTitleAlign: 'center',
      headerRight: (props) => (
        <TouchableOpacity onPress={onEndEditingHandler}>
          <Text style={{fontSize:20, marginRight: 20, justifyContent: 'center'}}>완료</Text>
        </TouchableOpacity>
      )
    });
  };
  const onEndEditingHandler = () => { // 글쓰기 끝냄 처리
    setEditMode(false);
    //console.log('myMessage\n', myMessage);
    if(myMessage === ''){
      props.data.diary.diarymessageList.splice(props.diaryId, 1);
      props.diarySort();
    }else if(props.message.islagacy){
      // 연동 아님
      if(saveLastMessage != myMessage){
        //console.log('연동중 다름 발생! ', saveLastMessage, myMessage);
        props.message.text = myMessage;
      }
    }else {
      if(saveLastMessage != myMessage){
        //console.log('비 연동중 다름 발생! ', saveLastMessage, myMessage);
        props.message.islagacy = true;
        props.message.text = myMessage;
      }
    }

    props.nav.setOptions({
      headerTitle: title,
      headerTitleAlign: 'left',
      headerRight: (props) => (
        <TouchableOpacity onPress={handler}>
          <Image source={downArrow} style={{width:30, height:30, marginRight:20}}/>
        </TouchableOpacity>
      )
    });
    setTimeout(()=>{
      setEditMode(true);
    }, 500);
  };

  useEffect(() => {
    if(!props.message.islagacy){
      // 연동중
      let sumMessage = '';
      props.message.linkedMessageList.forEach(message => {
        if(sumMessage === '') sumMessage = message.text;
        else sumMessage += ' ' + message.text;
      })
      setMyMessage(sumMessage);
      setSaveLastMessage(sumMessage);
    }else{
      setSaveLastMessage(props.message.text);
    }
  }, []);




  return (
    <View onLayout={(event) => {
        var {x, y, width, height} = event.nativeEvent.layout;
        if(last) minusHandler(y);
    }}>
      {showYear && <DiaryYear year={props.message.createdAt.format('YYYY')} />}
      {showDate && <DiaryDate date={props.message.createdAt.format('MMDD')} onPressHandler={() => setShowDateChanger(true)} />}
      {showDateChanger && <DateTimePicker testID="DiaryDatePicker" value={props.message.createdAt.toDate()} mode={'date'}  display="default" onChange={dateChangerHandler}/>}
      <View style={{paddingLeft: 90, flexWrap:'wrap'}}>
        <TouchableOpacity onPress={()=>setEditMode(true)}>
          <TextInput editable={editMode} onFocus={onFocusHandler} onEndEditing={onEndEditingHandler} style={{fontFamily: 'UhBeeSeulvely', textAlign: 'center', marginLeft: -15, fontSize: 14, padding:3, borderRadius: 5,width:screenWidth *0.76}} multiline value={myMessage} onChangeText={text=>setMyMessage(text)}/>
        </TouchableOpacity>
      </View>
      <View style={{marginBottom: 30, marginRight: 20, alignItems: 'flex-end'}}>
        <TouchableOpacity onPress={()=>setShowTimeChanger(true)}>
          <Text style={{fontSize:10, color: '#AAA'}}>{props.message.createdAt.format('LT')}</Text>
        </TouchableOpacity>
      </View>
      {showTimeChanger && <DateTimePicker testID="DiaryTimePicker" value={props.message.createdAt.toDate()} mode={'time'} is24Hour={true} display="default" onChange={timeChangerHandler}/>}
    </View>
  );
}
function LastDiaryTextWithDate(props){// 마지막 다이어리만위 위해 만들었음, 나중에 통합 필요
  // 옵션 셋팅 변수
  const showYear = props.options.first || !props.options.sameYear;
  const showDate = props.options.first || !props.options.sameDate;
  const last = props.options.last;
  const title = props.title;
  const [myMessage, setMyMessage] = useState(props.message.text); // 표시되는 메시지
  const [editMode, setEditMode] = useState(true);                 // 편집모드 확인
  let handler = props.handler;                                    // 우상단 기능 구현함수
  let minusHandler = props.minusHandler;                          // 마지막 항목의 크기를 측정해감
  const [saveLastMessage, setSaveLastMessage] = useState('');     // 초기 메시지 저장 & 변경 확인용

  // 시간 및 날짜 편집용 변수
  const [showTimeChanger, setShowTimeChanger] = useState(false);
  const [showDateChanger, setShowDateChanger] = useState(false);

  const timeChangerHandler = (event, selectedDate) => {
    setShowTimeChanger(false);
    if(event.type === 'dismissed') return Alert.alert('취소하였습니다.');

    props.message.createdAt = Moment(selectedDate);
    props.diarySort();
  }
  const dateChangerHandler = (event, selectedDate) => {
    setShowDateChanger(false);
    if(event.type === 'dismissed') return Alert.alert('취소하였습니다.');

    props.message.createdAt = Moment(selectedDate);
    props.diarySort();
  }


  const onFocusHandler = () => {
    props.nav.setOptions({
      headerTitle: '내 기록편집',
      headerTitleAlign: 'center',
      headerRight: (props) => (
        <TouchableOpacity onPress={onEndEditingHandler}>
          <Text style={{fontSize:20, marginRight: 20, justifyContent: 'center'}}>완료</Text>
        </TouchableOpacity>
      )
    });
  };
  const onEndEditingHandler = () => { // 글쓰기 끝냄 처리
    setEditMode(false);
    //console.log('myMessage\n', myMessage);
    if(myMessage === ''){
      props.data.diary.diarymessageList.splice(props.diaryId, 1);
      props.diarySort();
    }else if(props.message.islagacy){
      // 연동 아님
      if(saveLastMessage != myMessage){
        //console.log('연동중 다름 발생! ', saveLastMessage, myMessage);
        props.message.text = myMessage;
      }
    }else {
      if(saveLastMessage != myMessage){
        //console.log('비 연동중 다름 발생! ', saveLastMessage, myMessage);
        props.message.islagacy = true;
        props.message.text = myMessage;
      }
    }

    props.nav.setOptions({
      headerTitle: title,
      headerTitleAlign: 'left',
      headerRight: (props) => (
        <TouchableOpacity onPress={handler}>
          <Image source={downArrow} style={{width:30, height:30, marginRight:20}}/>
        </TouchableOpacity>
      )
    });
    setTimeout(()=>{
      setEditMode(true);
    }, 500);
  };

  useEffect(() => {
    if(!props.message.islagacy){
      // 연동중
      let sumMessage = '';
      props.message.linkedMessageList.forEach(message => {
        if(sumMessage === '') sumMessage = message.text;
        else sumMessage += ' ' + message.text;
      })
      setMyMessage(sumMessage);
      setSaveLastMessage(sumMessage);
    }else{
      setSaveLastMessage(props.message.text);
    }
  }, []);




  return (
    <View onLayout={(event) => {
        var {x, y, width, height} = event.nativeEvent.layout;
        if(last) minusHandler(y);
    }}>
      {showYear && <DiaryYear year={props.message.createdAt.format('YYYY')} />}
      {showDate && <DiaryDate date={props.message.createdAt.format('MMDD')} onPressHandler={() => setShowDateChanger(true)} />}
      {showDateChanger && <DateTimePicker testID="DiaryDatePicker" value={props.message.createdAt.toDate()} mode={'date'}  display="default" onChange={dateChangerHandler}/>}
      <View style={{paddingLeft: 90, flexWrap:'wrap'}}>
        <TouchableOpacity onPress={()=>setEditMode(true)}>
          <TextInput editable={editMode} onFocus={onFocusHandler} onEndEditing={onEndEditingHandler} style={{fontFamily: 'UhBeeSeulvely', textAlign: 'center', marginLeft: -15, fontSize: 14, padding:3, borderRadius: 5,width:screenWidth *0.76}} multiline value={myMessage} onChangeText={text=>setMyMessage(text)}/>
        </TouchableOpacity>
      </View>
      <View style={{marginBottom: 30, marginRight: 20, alignItems: 'flex-end'}}>
        <TouchableOpacity onPress={()=>setShowTimeChanger(true)}>
          <Text style={{fontSize:10, color: '#AAA'}}>{props.message.createdAt.format('LT')}</Text>
        </TouchableOpacity>
      </View>
      {showTimeChanger && <DateTimePicker testID="DiaryTimePicker" value={props.message.createdAt.toDate()} mode={'time'} is24Hour={true} display="default" onChange={timeChangerHandler}/>}
    </View>
  );
}
function DynamicDiaryScreen({navigation, route}){ // 다이어리 생성 화면
  const id = route.params.id;
  //let data = dataList[id-1];
  let data = dataList[dataList.findIndex(obj => obj.id===id)];
  let time = false;
  let lastDate = data.diary.diarymessageList.length>0 ? data.diary.diarymessageList[data.diary.diarymessageList.length-1].createdAt : null;
  let goToEnd = route.params.goToEnd;
  let thisScrollView;

  const [showDropbox, setShowDropbox] = useState(false);      // 다이어리 공유 옵션 바
  const [showTime, setShowTime] = useState(false);                  // 시간 선택 표시창
  const [numberOfMessage, setNumberOfMessage] = useState(data.diary.diarymessageList.length);
  const [contentHeight, setContentHeight] = useState(10000);
  const [minusPos, setMinusPos] = useState(0);
  const [updated, setUpdated] = useState(0);

  const diaryOptionBlurHandler = () => {
      setShowDropbox(false);
      navigation.setOptions({
        headerTitle: data.product.title,
        headerRight: (props) => (
          <TouchableOpacity onPress={diaryOptionFocusHandler}>
            <Image source={downArrow} style={{width:30, height:30, marginRight:20}}/>
          </TouchableOpacity>
        )
      });
  };
  const diaryOptionFocusHandler = () => {
      setShowDropbox(true);
      console.log('diaryOptionFocusHandler');
      navigation.setOptions({
        headerRight: (props) => (
          <TouchableOpacity onPress={diaryOptionBlurHandler}>
            <Image source={downArrow} style={{width:30, height:30, marginRight:20}}/>
          </TouchableOpacity>
        )
      });
  };
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: data.product.title,
      headerRight: (props) => (
        <TouchableOpacity onPress={diaryOptionFocusHandler}>
          <Image source={downArrow} style={{width:30, height:30, marginRight:20}}/>
        </TouchableOpacity>
      )
    });
  }, [navigation, route]);

  const getMinusContentPositionHandler = (value) => {
    if(value != minusPos) setMinusPos(value);
    //console.log('setMinusPos: ', minusPos);
  }

  const diarySort = () => {
    //console.log('sorting -------------------------------------- ');
    diarySortByDate(data.diary.diarymessageList);
    lastDate = data.diary.diarymessageList.length>0 ? data.diary.diarymessageList[data.diary.diarymessageList.length-1].createdAt : null;
    //console.log('lastDate: ', lastDate.format('LL'));
    //setUpdated(updated+1);
    setNumberOfMessage(data.diary.diarymessageList.length);
    //navigation.navigate('Diary', {id:id});
  }


  //console.log('diary state \n', data.diary.diarymessageList);

  return (
    <View style={{flex:1, flexDirection: 'column', backgroundColor: 'white'}}>
      {numberOfMessage === 0
        ? <NoDataInDiary/>
        : <KeyboardAvoidingView behavior={'height'}>
          <ScrollView ref={ref=>{thisScrollView = ref}} onLayout={()=>{goToEnd && thisScrollView.scrollToEnd({animated: true}); goToEnd = null;}} onContentSizeChange={(contentWidth, contentHeight)=>setContentHeight(contentHeight)}>
            <View style={{position: 'absolute', flex:1, flexDirection: 'column', left: 54, top:32, width: 1, borderRadius: 1, backgroundColor: '#DDD', height: minusPos-15<40?40:minusPos-15}}/>
            {data.diary.diarymessageList.map((message, i)=>{
                let options = {first: false, last: false, sameDate: false, sameYear: false};

                if(i===0) {
                  options.first = true;
                  time = message.createdAt;
                }
                if(time.isSameOrAfter(message.createdAt, 'year')) {
                  options.sameYear = true;
                } else {
                  time = message.createdAt;
                }
                if(options.sameYear && time.isSameOrAfter(message.createdAt, 'day')) {
                  options.sameDate = true;
                } else {
                  time = message.createdAt;
                }
                if(message.createdAt.isSameOrAfter(lastDate, 'day') && !options.sameDate) {
                  options.last = true;
                  //console.log('last Message: ', message.text);
                  return <LastDiaryTextWithDate data={data} diaryId={i} diarySort={diarySort} options={options} key={i.toString()}  nav={navigation} id={id} message={message} title={data.product.title} handler={diaryOptionFocusHandler} minusHandler={getMinusContentPositionHandler}/>;
                }

                return <DiaryTextWithDate data={data} diaryId={i} diarySort={diarySort} options={options} key={i.toString()}  nav={navigation} id={id} message={message} title={data.product.title} handler={diaryOptionFocusHandler} minusHandler={getMinusContentPositionHandler}/>;
              })
            }
            <View style={{height: 160}}/>
        </ScrollView>
        </KeyboardAvoidingView>
      }
      {showDropbox && <MyDropList handler={diaryOptionBlurHandler}/>}
      {showTime && <DateTimePicker />}
    </View>
  );
}

// 마이페이지
function MyPageScreen({navigation}) {
  const [myDiaryCount, setMyDiaryCount] = useState(10);
  const [totalCount, setTotalCount] = useState(256);
  const [image, setImage] = React.useState(userData.userImg);
  const [username, setUsername] = useState(userData.username);
  const [editMode, setEditMode] = useState(false);
  const { signOut } = React.useContext(AuthContext);

  const [tempText, setTempText] = useState('aaaa');

  const getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert('카메라기능 사용자권한이 필요합니다.');
      }
    }
  };

  const onEndEditingHandler = () => {
    if(username !== ''){
      userData.username = username;
    }else{
      setUsername(userData.username);
    }
    setEditMode(false);
  };

  const startEditModeHandler = () => {
    if(!editMode){
      setEditMode(true);
    }
  };

  useFocusEffect(() => {
    if(!editMode) setEditMode(false);
    setMyDiaryCount(userData.myDiaryList.length);

    let total = 0;
    userData.myDiaryList.forEach(obj => {
      total += dataList[dataList.findIndex(data => data.id === obj.id)].diary.totalUpdateCount;
      //total += dataList[obj.id-1].diary.totalUpdateCount;
    })
    setTotalCount(total);
  });

  const _pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.cancelled) {
        userData.userImg = result;
        setImage(result);
      }

      console.log(result);
    } catch (E) {
      console.log(E);
    }
  };

  return (
    <View style={{flex:1, flexDirection: 'column'}}>
      <View style={{margin:15, marginBottom: 0, alignItems: 'center', borderBottomWidth: 1, height: 170, justifyContent: 'center'}}>
        <TouchableOpacity onPress={()=>getPermissionAsync().then(_pickImage()).catch(e => console.log('getPermissionAsync error: ', e))}>
          {image
            ? <Image source={image} style={{height: 80, width: 80, borderRadius: 40, backgroundColor: '#EEE', marginTop: 20, marginBottom: 12}}/>
            : <Image source={defaultUser} style={{height: 80, width: 80, borderRadius: 40, backgroundColor: '#EEE', marginTop: 20, marginBottom: 12}}/>
          }
        </TouchableOpacity>
        <View style={{flexDirection: 'row', marginLeft:20}}>
          {editMode
          ? <TextInput autoFocus={true} maxLength={10} selectTextOnFocus={true} onEndEditing={onEndEditingHandler} style={{fontSize: 20, height: 30, width:150}} value={username}  onChangeText={text=>setUsername(text)}/>
          : <Text style={{fontWeight: 'bold', fontSize: 20}}>{username}</Text>
          }
          <TouchableOpacity onPress={startEditModeHandler}>
            <EvilIcons name="pencil" size={30} color="black"  style={{marginLeft:5, justifyContent: 'center'}}/>
          </TouchableOpacity>
        </View>
      </View>
      <View style={{}}>
        <View style={{marginHorizontal: 15, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#DDD'}}>
          <EvilIcons name="lock" color="black" size={45} style={{marginVertical: 15, marginLeft: -10}}/>
          <TouchableOpacity onPress={()=>Alert.alert('정말 로그아웃 하시겠습니까?','로그인 페이지로 이동합니다.',[{text:'취소'}, {text:'확인', onPress:signOut}])}>
            <Text style={{fontSize: 22, marginLeft: 3}}>로그아웃</Text>
          </TouchableOpacity>
        </View>
        <View style={{marginHorizontal: 15, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#DDD'}}>
          <AntDesign name="key" color="black" size={30} style={{marginVertical: 15, marginLeft: 0}}/>
          <TouchableOpacity onPress={()=>navigation.navigate('ChangePassword')}>
            <Text style={{fontSize: 22, marginLeft: 9}}>비밀번호 변경</Text>
          </TouchableOpacity>
        </View>
        <View style={{marginHorizontal: 15, borderBottomWidth: 1, borderBottomColor: '#DDD'}}>
          <View style={{ flexDirection: 'row', alignItems: 'center'}}>
            <AntDesign name="filetext1" color="black" size={30} style={{marginVertical: 15, marginLeft: 0}}/>
            <TouchableOpacity onPress={()=>navigation.navigate('UserHistory')}>
              <Text style={{fontSize: 22, marginLeft: 9}}>이용 내역</Text>
            </TouchableOpacity>
          </View>
          <View style={{marginLeft: 45, marginRight: 5, marginHorizontal: 10, marginBottom: 20, borderWidth: 1, borderRadius: 10, alignItems: 'center'}}>
            <Text style={{fontSize: 15, margin: 10}}>내 기록: {totalCount}         내 다이어리: {myDiaryCount}</Text>
          </View>
        </View>
        <View style={{marginHorizontal: 15, flexDirection: 'row', alignItems: 'center'}}>
          <Feather name="info" color="black" size={30} style={{marginVertical: 15, marginLeft: 0}}/>
          <TouchableOpacity onPress={()=>navigation.navigate('ServiceCenter')}>
            <Text style={{fontSize: 22, marginLeft: 9}}>고객센터</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
function MyChangePasswordPage({navigation}) {
  const [prevPassword, setPrevPassword] = useState('');
  const [nextPassword, setNextPassword] = useState('');
  const [nextAdditionalPassword, setAdditionalNextPassword] = useState('');
  const [warnPrevPasswordError, setWarnPrevPasswordError] = useState(false);
  const [warnNextPasswordError, setWarnNextPasswordError] = useState(false);
  const [warnNotCorrectPasswordError, setWarnNotCorrectPasswordError] = useState(false);

  const changePasswordHandler = () => {
    let errorCout = 0;
    if(prevPassword !== userData.password){
      if(warnPrevPasswordError === false) setWarnPrevPasswordError(true);
      errorCout++;
    }else{
      if(warnPrevPasswordError === true) setWarnPrevPasswordError(false);
    }
    if(nextPassword !== nextAdditionalPassword){
      if(warnNotCorrectPasswordError === false) setWarnNotCorrectPasswordError(true);
      errorCout++;
    }else{
      if(warnNotCorrectPasswordError === true) setWarnNotCorrectPasswordError(false);
    }
    if(nextPassword.length < 5){
      if(warnNextPasswordError === false) setWarnNextPasswordError(true);
      errorCout++;
    }else{
      if(warnNextPasswordError === true) setWarnNextPasswordError(false);
    }
    if(errorCout === 0){
      userData.password = nextPassword;
      // navigation.navigate('MyServicePage');
      Alert.alert('비밀번호가 변경되었습니다.');
    }
  }

  return (
    <ScrollView>
    <View style={{flex:1, flexDirection: 'column', justifyContent: 'space-around'}}>
      <View style={{margin: 20}}>
        <Text style={{marginVertical: 5, fontWeight:'bold', fontSize: 20}}>현재 비밀번호</Text>
        <TextInput value={prevPassword} style={{borderWidth: 1, backgroundColor: '#DDD', fontSize: 30}} secureTextEntry={true} onChangeText={(text)=>setPrevPassword(text)}/>
        <Text style={{color: warnPrevPasswordError? '#D00f':'#D000', fontSize: 11, marginLeft: 15, marginVertical: 5}}>올바른 비밀번호를 입력해주세요. 현재 비밀번호와 다릅니다.</Text>
      </View>
      <View style={{margin: 20}}>
        <Text style={{marginVertical: 5, fontWeight:'bold', fontSize: 20}}>새 비밀번호</Text>
        <TextInput value={nextPassword} style={{borderWidth: 1, backgroundColor: '#DDD', fontSize: 30}} secureTextEntry={true} onChangeText={(text)=>setNextPassword(text)}/>
        <Text style={{fontSize: 11, marginLeft: 15, marginVertical: 5}}>6~16자 영문, 소문자, 숫자만 사용 가능 합니다.</Text>
        <Text style={{color: warnNextPasswordError? '#D00f':'#D000', fontSize: 11, marginLeft: 15, marginVertical: 5}}>비밀번호를 올바른 형식으로 입력해주세요.</Text>
      </View>
      <View style={{margin: 20}}>
        <Text style={{marginVertical: 5, fontWeight:'bold', fontSize: 20}}>새 비밀번호 확인</Text>
        <TextInput value={nextAdditionalPassword} style={{borderWidth: 1, backgroundColor: '#DDD', fontSize: 30}} secureTextEntry={true} onChangeText={(text)=>setAdditionalNextPassword(text)}/>
        <Text style={{color: warnNotCorrectPasswordError? '#D00f':'#D000', fontSize: 11, marginLeft: 15, marginVertical: 5}}>새 비밀번호와 동일하게 입력해주세요.</Text>
      </View>
      <View style={{margin: 20}}>
        <TouchableOpacity onPress={changePasswordHandler} style={{borderRadius: 1, backgroundColor: '#CCC', alignItems: 'center', justifyContent: 'center', flex:1}}>
          <Text style={{margin:10, fontSize: 22}}>변경완료</Text>
        </TouchableOpacity>
      </View>
    </View>
    </ScrollView>
  );
}
class SubscribeContentBoxComponent extends React.Component{
  constructor(props){
    super(props);
  }

  render(){
    return (
      <View style={styles.myShadow}>
        <Text style={{marginLeft: 20, marginVertical: 10, fontSize: 20, fontWeight: 'bold'}}>{this.props.title}</Text>
        <Text style={{marginLeft:40, marginVertical: 0, fontSize: 20, fontWeight: 'bold'}}>내 기록   <Text style={{fontSize: 25, fontWeight: 'normal'}}>{this.props.count}</Text></Text>
        <Text style={{marginLeft:40, marginVertical: 4, marginBottom: 10, fontSize: 20, fontWeight: 'bold'}}>기간        <Text style={{fontSize: 13, fontWeight: 'normal'}}>{this.props.startDate.format('LL')} ~ {Moment().format('LL')}</Text></Text>
      </View>
    );
  }
}
function UserHistoryPage({navigation}) {
  return (
    <ScrollView style={{flex:1, flexDirection: 'column', backgroundColor: '#fff'}}>
      <Text style={{margin:20, fontWeight:'bold', fontSize: 20}}>나의 구독 내역</Text>
      {userData.myDiaryList.map(diary => {
        let data = dataList[dataList.findIndex(obj => obj.id === diary.id)];
        return <SubscribeContentBoxComponent key={diary.id} title={data.product.title} count={data.diary.totalUpdateCount} startDate={data.diary.makeTime}/>;
      })}
    </ScrollView>
  );
}

// 서비스센터 페이지들
function ServiceCenterPage({navigation}) {
  return (
    <View style={{flex:1, flexDirection: 'column', borderTopWidth: 1, marginHorizontal: 10}}>
      <TouchableOpacity style={{height: 90, justifyContent: 'center', borderBottomWidth: 1, borderColor: '#DDD'}} onPress={()=>navigation.push('ServiceIntroduction')}>
        <Text style={{marginLeft: 30, fontSize: 20}}>서비스 소개</Text>
      </TouchableOpacity>
      <TouchableOpacity style={{height: 90, justifyContent: 'center', borderBottomWidth: 1, borderColor: '#DDD'}} onPress={()=>navigation.push('Help')}>
        <Text style={{marginLeft: 30, fontSize: 20}}>도움말</Text>
      </TouchableOpacity>
      <TouchableOpacity style={{height: 90, justifyContent: 'center', borderColor: '#DDD'}} onPress={()=>navigation.push('Notice')}>
        <Text style={{marginLeft: 30, fontSize: 20}}>공지사항</Text>
      </TouchableOpacity>
    </View>
  );
}
function ServiceIntroductionPage({navigation}) {
  return (
    <View style={{flex:1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
      <Text>서비스 소개</Text>
    </View>
  );
}
class HelpContentComponent extends React.Component{
  constructor(props){
    super(props);

    this.state = {
      showAnswer: false,
    }
  }

  render(){
    return (
      <TouchableOpacity onPress={()=>{this.setState(previousState => ({showAnswer: !previousState.showAnswer}))}} style={{flexDirection: 'column', borderColor: '#666', marginHorizontal: 10, marginVertical: 6, borderWidth: 1, borderRadius: 10}}>
        <Text style={{marginLeft: 15, marginVertical: 20, fontSize: 17, marginRight: 43}}>Q.
          <Text style={{textDecorationLine: this.state.showAnswer?'underline':'none', fontWeight:this.state.showAnswer?'bold':'normal'}}> {this.props.question}</Text>
        </Text>
        <MaterialCommunityIcons style={{position: 'absolute', right: 0, marginRight: 15, marginTop: 20}} name={this.state.showAnswer? "chevron-up":"chevron-down"} size={30} color="black" />
        {this.state.showAnswer &&
          <View style={{marginLeft: 30, marginBottom: 5}}>
            <Text>{this.props.answer}</Text>
          </View>
        }
      </TouchableOpacity>
    );
  }
}
function HelpPage({navigation}) {
  return (
    <ScrollView style={{flex:1, flexDirection: 'column', marginTop: 10}}>
      {informData.help.map( message => {
        return <HelpContentComponent key={message.id} question={message.question} answer={message.answer}/>
      })}
      <View style={{flex:1, height: 600}}/>
    </ScrollView>
  );
}
class NoticeContentComponent extends React.Component{
  constructor(props){
    super(props);

    this.state = {
      showMessage: false,
    }
  }

  render(){
    return (
      <TouchableOpacity onPress={()=>{this.setState(previousState => ({showMessage: !previousState.showMessage}))}} style={{flexDirection: 'column', borderColor: '#666', marginHorizontal: 10, marginVertical: 6, borderWidth: 1, borderRadius: 10}}>
        <Text style={{marginLeft: 15, marginVertical: 16, fontSize: 17, marginRight: 43, textDecorationLine: this.state.showMessage?'underline':'none', fontWeight:this.state.showMessage?'bold':'normal'}}>{this.props.title}</Text>
        <Text style={{marginLeft: 20, marginBottom: 15, fontSize: 12, fontWeight:this.state.showMessage?'bold':'normal'}}>{this.props.date}</Text>
        <MaterialCommunityIcons style={{position: 'absolute', right: 0, marginRight: 15, marginTop: 20}} name={this.state.showMessage? "chevron-up":"chevron-down"} size={30} color="black" />
        {this.state.showMessage &&
          <View style={{marginLeft: 30, marginBottom: 5, marginTop:10, marginRight:20}}>
            <Text>{this.props.message}</Text>
          </View>
        }
      </TouchableOpacity>
    );
  }
}
function NoticePage({navigation}) {
  return (
    <ScrollView style={{flex:1, flexDirection: 'column', marginTop: 10}}>
      {informData.notice.map( message => {
        return  <NoticeContentComponent key={message.id} title={message.title} date={message.date} message={message.message}/>
      })}
      <View style={{flex:1, height: 600}}/>
    </ScrollView>
  );
}

// 메인스택
function MainStackHomePage({navigation}) {

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MainPage"
        options={({route, navigation})=>({
          headerTitle: getHeaderTitle(route, '채팅'),
          headerTitleAlign: 'left',
          headerTitleStyle: {fontWeight: 'bold', fontSize: 20},
          headerBackTitleVisible: false,
          headerTintColor: 'black',
          cardStyle: {backgroundColor: 'white'},
          headerRight: mainHeaderRightHandler(route, navigation)})}
        component={MainPageScreen}
      />
      <Stack.Screen
        name="chatroom"
        options={{
          title: "chatroom",
          headerTitleAlign: 'center',
          headerTitleStyle: {fontWeight: 'bold', fontSize: 20},
          cardStyle: {backgroundColor: 'white'},
          headerBackTitleVisible: false,
          headerTintColor: 'black',
          headerRight: (props) => (
            <TouchableOpacity
            onPress={() => chatSettingButtonHandler(navigation)}
            >
              <Octicons name="three-bars" style={{marginRight:11, marginTop:2}} size={27} color="black" />
            </TouchableOpacity>
          )}}
        component={MyChatRoomScreen}
      />
      <Stack.Screen
        name="contentScreen"
        options={{
          title: "",
          headerTitleAlign: 'center',
          headerTitleStyle: {fontWeight: 'bold', fontSize: 20},
          cardStyle: {backgroundColor: 'white'},
          headerBackTitleVisible: false,
          headerTintColor: 'black',
          headerTransparent: true,
        }}
        component={SubscribeContentScreen}
      />
      <Stack.Screen
        name="Diary"
        options={{
          title: "내 다이어리",
          headerTitleAlign: 'center',
          headerTitleStyle: {fontWeight: 'bold', fontSize: 20},
          headerBackTitleVisible: false,
          headerTintColor: 'black',
          cardStyle: {backgroundColor: 'white'},
          }}
        component={DynamicDiaryScreen}
      />
      <Stack.Screen
        name="MyServicePage"
        options={{
          title: "My",
          headerTitleAlign: 'center',
          headerTitleStyle: {fontWeight: 'bold', fontSize: 20},
          headerBackTitleVisible: false,
          headerTintColor: 'black',
          cardStyle: {backgroundColor: 'white'},
          }}
        component={MyPageScreen}
      />
      <Stack.Screen
        name="ChangePassword"
        options={{
          title: "비밀번호 변경",
          headerTitleAlign: 'center',
          headerTitleStyle: {fontWeight: 'bold', fontSize: 20},
          headerBackTitleVisible: false,
          headerTintColor: 'black',
          cardStyle: {backgroundColor: 'white'},
          }}
        component={MyChangePasswordPage}
      />
      <Stack.Screen
        name="UserHistory"
        options={{
          title: "이용 내역",
          headerTitleAlign: 'center',
          headerTitleStyle: {fontWeight: 'bold', fontSize: 20},
          headerBackTitleVisible: false,
          headerTintColor: 'black',
          cardStyle: {backgroundColor: 'white'},
          }}
        component={UserHistoryPage}
      />
      <Stack.Screen
        name="ServiceCenter"
        options={{
          title: "고객센터",
          headerTitleAlign: 'center',
          headerTitleStyle: {fontWeight: 'bold', fontSize: 20},
          headerBackTitleVisible: false,
          headerTintColor: 'black',
          cardStyle: {backgroundColor: 'white'},
          }}
        component={ServiceCenterPage}
      />
      <Stack.Screen
        name="ServiceIntroduction"
        options={{
          title: "서비스 소개",
          headerTitleAlign: 'center',
          headerTitleStyle: {fontWeight: 'bold', fontSize: 20},
          headerBackTitleVisible: false,
          headerTintColor: 'black',
          cardStyle: {backgroundColor: 'white'},
          }}
        component={ServiceIntroductionPage}
      />
      <Stack.Screen
        name="Help"
        options={{
          title: "도움말",
          headerTitleAlign: 'center',
          headerTitleStyle: {fontWeight: 'bold', fontSize: 20},
          headerBackTitleVisible: false,
          headerTintColor: 'black',
          cardStyle: {backgroundColor: 'white'},
          }}
        component={HelpPage}
      />
      <Stack.Screen
        name="Notice"
        options={{
          title: "공지사항",
          headerTitleAlign: 'center',
          headerTitleStyle: {fontWeight: 'bold', fontSize: 20},
          headerBackTitleVisible: false,
          headerTintColor: 'black',
          cardStyle: {backgroundColor: 'white'},
          }}
        component={NoticePage}
      />
    </Stack.Navigator>
  );
}

const USERDATA = {
  token: null,
  username: '',
  email: '',
  password: '',
  userImg: null,
  mySubscribeList: [],
  myChatroomList: [],
  myDiaryList: [],
};

// 메인 앱
export default function App() {
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'END_LOADING_FIRST_LOGIN':
          return {
            ...prevState,
            nowLoading: false,
          };
        case 'END_LOADING_LOGIN_PAGE':
          return {
            ...prevState,
            nowLoading: false,
            intro: false,
          };
        case 'END_LOADING_RESTORE_DATA':
          return {
            ...prevState,
            nowLoading: false,
            intro: action.intro,
            login: action.login,
            userData: action.userData,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            login: true,
            userData: action.userData,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            login: false,
            userData: USERDATA,
          };
        case 'INTRO_SKIP':
          return {
            ...prevState,
            intro: false,
          };
        case 'UPDATE_USERDATA':
          return {
            ...prevState,
            userData: action.userData,
          };
      }
    },
    {
      nowLoading: true,
      intro: true,
      login: false,
      userData: USERDATA,
    }
  );  // 유저 인증 정보

  const authContext = React.useMemo(
    () => ({
      signIn: async data => {
        console.log(`SignIn email:${data.email}, password:${data.password}`);
        // 인증
        let result = await Connection.login(data.email, data.password);
        //console.log('result: ', result);

        if(result.status){
          // load
          let loadUserData = {
            token: result.data.token,
            username: result.data.username,
            email: data.email,
            password: data.password,
            userImg: null,
            mySubscribeList: [],
            myChatroomList: [],
            myDiaryList: [],
          };
          let responseProductData = await Connection.loadProductData(loadUserData.token);
          let responseDiaryData = await Connection.loadDiaryData(loadUserData.token);

          if(responseProductData.status && responseDiaryData.status){
            // load success
            console.log('load data successely');
            dataList = await Storage.saveProductData(responseProductData.data);
            let diaryData = await Storage.saveDiaryData(responseDiaryData.data);
            registerForPushNotificationsAsync();
            //console.log('responseProductData: ', responseProductData);
            dispatch({ type: 'SIGN_IN', login: true, userData: loadUserData});
          }else{
            console.log('load data failed');
            Alert.alert('데이토 로딩에 실패하였습니다.');
          }
        }
      },
      signOut: () => dispatch({ type: 'SIGN_OUT' }),
      signUp: async data => {
        // In a production app, we need to send user data to server and get a token
        // We will also need to handle errors if sign up failed
        // After getting token, we need to persist the token using `AsyncStorage`
        // In the example, we'll use a dummy token
        console.log('signUp');

        dispatch({ type: 'SIGN_IN', token: 'dummy-auth-token' });
      },
      introSkip: () => dispatch({type: 'INTRO_SKIP'}),
      registerUsername: data => dispatch({type: 'SET_USERNAME', username: data}),
    }),
    []
  );  // 유저 인증 함수 등록

  React.useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let userToken;

      try {
        userToken = await AsyncStorage.getItem('userToken');
      } catch (e) {
        // Restoring token failed
      }
      let testUUID = uuid.v4();
      console.log('uuid: ', testUUID);
      console.log('time: ', Moment().toDate());

      // After restoring token, we may need to validate it in production apps

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      //dispatch({ type: 'RESTORE_TOKEN', token: userToken });
    };

    bootstrapAsync();
  }, []); // 초기화시 데이터 로딩 여기서

  const [notification, setNotification] = useState(null);
  const [loaded, error] = Font.useFonts({
    UhBeeSeulvely: require('./assets/font/UhBeeSeulvely.ttf'),
  });

  const handleNotification = (notify) => {
    setNotification(notify);
    console.log('notification', notify);
  };

  const registerForPushNotificationsAsync = async () => {
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    if (status !== 'granted') {
      Alert.alert('알림 권한 획득 실패!');
      return false;
    }
    let token = await Notifications.getExpoPushTokenAsync();
    // Defined in following steps
    Notifications.addListener(handleNotification);
    console.log(`registerForPushNotificationsAsync\nstatus: ${status}\ntoken: ${token}\nemail: ${state.userData.email}, username: ${state.userData.username}`);

    return fetch(PUSH_REGISTRATION_ENDPOINT, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: {
          value: token,
        },
        user: {
          email: userData.email,
          username: userData.username, //임의값
        },
      }),
    });
    // Defined in next step
  };

  const [theme, setTheme] = useState({
    default: '#d9d9d9',
    light: ['#e8efd9','#d7e4bd', '#b9c89c'],
    logo: logo,
  });


  return (
    <ThemeContext.Provider value={theme}>
    <AuthContext.Provider value={authContext}>
      {state.nowLoading === true ? (
        <View style={{flex:1, marginTop:30, alignItems: 'center', justifyContent: 'center'}}>
          <Text>스플래쉬 화면</Text>
          <Text> 유저 정보 여부에 따라 다음으로 분기 </Text>
          <TouchableOpacity style={{margin: 10}} onPress={()=>{dispatch({ type: 'END_LOADING_RESTORE_DATA', intro:false, login: true, userData: USERDATA})}}>
            <Text> - 저장된 계정 있음(자동 로그인)</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{margin: 10}} onPress={()=>{dispatch({ type: 'END_LOADING_FIRST_LOGIN'})}}>
            <Text> - 저장된 계정 있음(자동 X)</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{margin: 10}} onPress={()=>{dispatch({ type: 'END_LOADING_LOGIN_PAGE'})}}>
            <Text> - 저장된 계정 없음</Text>
          </TouchableOpacity>
        </View>
      ) : state.intro === true ? (
        <IntroNavigation/>
      ) : state.login === false ? (
        <LoginNavigation/>
      )
      : (
        <NavigationContainer>
          <Drawer.Navigator drawerPosition='right' drawerStyle={{backgroundColor: '#CCC'}} drawerContent={props => <CustomDrawerContent {...props}/>}>
            <Drawer.Screen name='sidebar' component={MainStackHomePage} options={{swipeEnabled: false}}/>
          </Drawer.Navigator>
        </NavigationContainer>
      )}
    </AuthContext.Provider>
    </ThemeContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: StatusBar.currentHeight,
  },
  backgroundImg: {
    flex: 1,
    flexDirection: 'column',
    resizeMode: 'cover',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  introText: {
    fontSize: 40,
    marginRight: 110,
    marginBottom: 80,
  },
  skipButton: {
    marginTop: 20,
    marginRight: 20,
  },
  skipButtonText: {
    fontSize: 20,
    color: 'blue',
  },
  singInInputBox: {
    width: 300,
    height: 40,
    padding: 10,
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: '#EEE',
  },
  smallText: {
    fontSize: 10,
  },
  myShadow: {
    borderWidth: 0,
    shadowColor: "#000",
    shadowOffset: {
    	width: 0,
    	height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
    marginHorizontal: 20,
    marginVertical: 7,
  },
  helpContentShadowStyle: {

  },
});
