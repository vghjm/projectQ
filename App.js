import React, { useState, useCallback, useEffect } from 'react';
import { Dimensions , ActivityIndicator, Platform,TouchableHighlight, TouchableWithoutFeedback, AsyncStorage, ImageBackground, Text, View, StyleSheet, TouchableOpacity, TextInput, CheckBox, KeyboardAvoidingView, Alert, Button, ScrollView, SafeAreaView, Image }
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

// https://velog.io/@max9106/React-Native-%EB%A6%AC%EC%95%A1%ED%8A%B8-%EB%84%A4%EC%9D%B4%ED%8B%B0%EB%B8%8Creact-native-%ED%91%B8%EC%8B%9C%EC%95%8C%EB%9E%8C-expo-jkk16hzg5d
const PUSH_REGISTRATION_ENDPOINT = 'http://4774a5cc0602.ngrok.io/pushalarm/token';
const MESSAGE_ENPOINT = 'http://4774a5cc0602.ngrok.io/pushalarm/message';

const introImage1 = {uri: "https://cdn.crowdpic.net/detail-thumb/thumb_d_F78FC0AA8923C441588C382B19DF0BF8.jpg"};
const introImage2 = {uri: "https://previews.123rf.com/images/romeolu/romeolu1601/romeolu160100122/50594417-%EB%88%88-%EB%B0%B0%EA%B2%BD.jpg"};
const introImage3 = {uri: "https://previews.123rf.com/images/kittikornphongok/kittikornphongok1505/kittikornphongok150501184/40020410-%EB%8B%A4%EC%B1%84%EB%A1%9C%EC%9A%B4-%EC%88%98%EC%B1%84%ED%99%94%EC%9E%85%EB%8B%88%EB%8B%A4-%EA%B7%B8%EB%9F%B0-%EC%A7%80-%EC%A7%88%EA%B0%90-%EB%B0%B0%EA%B2%BD%EC%9E%85%EB%8B%88%EB%8B%A4-%EB%B6%80%EB%93%9C%EB%9F%AC%EC%9A%B4-%EB%B0%B0%EA%B2%BD%EC%9E%85%EB%8B%88%EB%8B%A4-.jpg"};
const defaultImg = {uri: "https://www.daelim.ac.kr/coming_soon.jpg"};
const dogImg = {uri: "https://t1.daumcdn.net/cfile/tistory/24283C3858F778CA2E"};
const catImg = {uri: 'https://image-notepet.akamaized.net/resize/620x-/seimage/20190816%2Ff07bd9f247293aa0317f2c8faba7e83b.png'};
const carmelImg = {uri: 'https://www.jain.re.kr/file/contents/1/201609/30aade86-7056-4948-86a4-a8003c4498ab.jpg'};
const diaryImg = require('./assets/diary.jpg');
const logo = require('./assets/icon/Q_banner.png');
const q_moment = require('./assets/icon/Q_1.png');
const bookOn = require('./assets/icon/book_on.png');
const bookOff = require('./assets/icon/book_off.png');
const subOn = require('./assets/icon/subOn.png');
const subOff = require('./assets/icon/subOff.png');
const splash = require('./assets/icon/splash2.png');
const upArrow = require('./assets/icon/up_arrow.png');
const downArrow = require('./assets/icon/down_arrow.png');
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
const AuthContext = React.createContext();
const ControllContext = React.createContext();
const Tab = createMaterialTopTabNavigator();
const Stack = createStackNavigator();
const MyServiceStack = createStackNavigator();
const ServiceCenterStack = createStackNavigator();
const Drawer = createDrawerNavigator();

// 새로운 임시 데이터
let defaultQuestionListData = [
  '오늘은 어땠어?',
  '오늘의 가장 즐거웠던 점은 뭐야?',
  '랜덤~ 랜덤~ 질문',
  '오늘의 날씨는 어땠어?',
  '이 앱은 어떤거 같아?',
  '오늘의 점심은 뭐야?',
  '7은 행운의 숫자지',
];

let defaultProductData = {
  title: '임시 구독상품명',
  text: '구독상품 소개 문구, 50자 이내 25자씩 2줄 디자인 상품 배경 이미지 제작, 디자인 상품 로고 제작, 디자인 상품 소개 이미지 정방형 디자인 상품 소개',
  imageSet: {thumbnailImg: defaultImg, logoImg: defaultImg, mainImg: defaultImg, avatarImg: defaultImg},
  questionList: defaultQuestionListData,
};
let catProductData = {
  title: '고양이 상품',
  text: '귀여운 고양이 상품을 구독하고 고양이 알림을 받으세요.',
  imageSet: {thumbnailImg: catImg, logoImg: catImg, mainImg: catImg, avatarImg: catImg},
  questionList: defaultQuestionListData,
};
let dogProductData = {
  title: '댕댕이 상품',
  text: '귀여운 멍멍이 상품을 구독하고 댕댕이 알림을 받으세요.',
  imageSet: {thumbnailImg: dogImg, logoImg: dogImg, mainImg: dogImg, avatarImg: dogImg},
  questionList: defaultQuestionListData,
};
let carmelProductData = {
  title: '낙타 상품',
  text: '귀여운 낙타 상품을 구독하고 CARMEL 알림을 받으세요.',
  imageSet: {thumbnailImg: carmelImg, logoImg: carmelImg, mainImg: carmelImg, avatarImg: carmelImg},
  questionList: defaultQuestionListData,
};

let defaultChatmessageListData = [];
let testChatmessageListData = [
  {
    _id: 7, text: '나의 오늘 답변1', createdAt: Moment('2019-06-24 01:09:34'),
    user: { _id:1},
  },
  { _id: 6, text: '오늘 뭐 했어?', createdAt: Moment('2019-06-23 01:09:34'),
    user: { _id:2, avatar: 'https://www.daelim.ac.kr/coming_soon.jpg',}
  },
  {
    _id: 5, text: '나의 이전 답변3', createdAt: Moment('2019-06-22 01:09:34'),
    user: { _id:1},
  },
  {
    _id: 4, text: '나의 이전 답변2', createdAt: Moment('2019-06-21 01:09:34'),
    user: { _id:1},
  },
  {
    _id: 3, text: '나의 이전 답변1', createdAt: Moment('2019-06-20 01:09:34'),
    user: { _id:1,},
  },
  { _id: 2, text: '오늘 뭐 했어?', createdAt: Moment('2019-06-19 01:09:34'),
    user: { _id:2, avatar: 'https://www.daelim.ac.kr/coming_soon.jpg',}
  },
  {
    _id: 1, text: '상품정보명' + ' 채팅방입니다.', createdAt: Moment('2019-06-18 01:09:34'),
    user: { _id:2, avatar: 'https://www.daelim.ac.kr/coming_soon.jpg',},
  },
];
let catChatmessageListData = [
  {
    _id: 7, text: '나의 오늘 답변1', createdAt: Moment('2019-06-24 01:09:34'),
    user: { _id:1},
  },
  { _id: 6, text: '오늘 뭐 했어?', createdAt: Moment('2019-06-23 01:09:34'),
    user: { _id:2, avatar: 'https://image-notepet.akamaized.net/resize/620x-/seimage/20190816%2Ff07bd9f247293aa0317f2c8faba7e83b.png',}
  },
  {
    _id: 5, text: '나의 이전 답변3', createdAt: Moment('2019-06-22 01:09:34'),
    user: { _id:1},
  },
  {
    _id: 4, text: '나의 이전 답변2', createdAt: Moment('2019-06-21 01:09:34'),
    user: { _id:1},
  },
  {
    _id: 3, text: '나의 이전 답변1', createdAt: Moment('2019-06-20 01:09:34'),
    user: { _id:1,},
  },
  { _id: 2, text: '오늘 뭐 했어?', createdAt: Moment('2019-06-19 01:09:34'),
    user: { _id:2, avatar: 'https://image-notepet.akamaized.net/resize/620x-/seimage/20190816%2Ff07bd9f247293aa0317f2c8faba7e83b.png',}
  },
  {
    _id: 1, text: '상품정보명' + ' 채팅방입니다.', createdAt: Moment('2019-06-18 01:09:34'),
    user: { _id:2, avatar: 'https://image-notepet.akamaized.net/resize/620x-/seimage/20190816%2Ff07bd9f247293aa0317f2c8faba7e83b.png',},
  },
];
let carmelChatmessageListData = [
  {
    _id: 7, text: '나의 오늘 답변1', createdAt: Moment('2019-06-24 01:09:34'),
    user: { _id:1},
  },
  { _id: 6, text: '오늘 뭐 했어?', createdAt: Moment('2019-06-23 01:09:34'),
    user: { _id:2, avatar: 'https://www.jain.re.kr/file/contents/1/201609/30aade86-7056-4948-86a4-a8003c4498ab.jpg',}
  },
  {
    _id: 5, text: '나의 이전 답변3', createdAt: Moment('2019-06-22 01:09:34'),
    user: { _id:1},
  },
  {
    _id: 4, text: '나의 이전 답변2', createdAt: Moment('2019-06-21 01:09:34'),
    user: { _id:1},
  },
  {
    _id: 3, text: '나의 이전 답변1', createdAt: Moment('2019-06-20 01:09:34'),
    user: { _id:1,},
  },
  { _id: 2, text: '오늘 뭐 했어?', createdAt: Moment('2019-06-19 01:09:34'),
    user: { _id:2, avatar: 'https://www.jain.re.kr/file/contents/1/201609/30aade86-7056-4948-86a4-a8003c4498ab.jpg',}
  },
  {
    _id: 1, text: '상품정보명' + ' 채팅방입니다.', createdAt: Moment('2019-06-18 01:09:34'),
    user: { _id:2, avatar: 'https://www.jain.re.kr/file/contents/1/201609/30aade86-7056-4948-86a4-a8003c4498ab.jpg',},
  },
];
let dogChatmessageListData = [
  {
    _id: 7, text: '나의 오늘 답변1', createdAt: Moment('2019-06-24 01:09:34'),
    user: { _id:1},
  },
  { _id: 6, text: '오늘 뭐 했어?', createdAt: Moment('2019-06-23 01:09:34'),
    user: { _id:2, avatar: 'https://t1.daumcdn.net/cfile/tistory/24283C3858F778CA2E',}
  },
  {
    _id: 5, text: '나의 이전 답변3', createdAt: Moment('2019-06-22 01:09:34'),
    user: { _id:1},
  },
  {
    _id: 4, text: '나의 이전 답변2', createdAt: Moment('2019-06-21 01:09:34'),
    user: { _id:1},
  },
  {
    _id: 3, text: '나의 이전 답변1', createdAt: Moment('2019-06-20 01:09:34'),
    user: { _id:1,},
  },
  { _id: 2, text: '오늘 뭐 했어?', createdAt: Moment('2019-06-19 01:09:34'),
    user: { _id:2, avatar: 'https://t1.daumcdn.net/cfile/tistory/24283C3858F778CA2E',}
  },
  {
    _id: 1, text: '상품정보명' + ' 채팅방입니다.', createdAt: Moment('2019-06-18 01:09:34'),
    user: { _id:2, avatar: 'https://t1.daumcdn.net/cfile/tistory/24283C3858F778CA2E',},
  },
];

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
]


let defaultChatroomSettingData = {
  getPushAlarm: true,
};
let testChatroomSettingData = {
  getPushAlarm: true,
};

// chatroom
let defaultChatroomData = {
  lastMessageTime: Moment('20200314 1405'), newItemCount: 5, lastId:0, chatmessageList: defaultChatmessageListData, chatroomSetting: defaultChatroomSettingData,
};
let testChatroomData = {
  lastMessageTime: Moment('20200314 1405'), newItemCount: 5, lastId:7, chatmessageList: testChatmessageListData, chatroomSetting: testChatroomSettingData,
};
let catChatroomData = {
  lastMessageTime: Moment('20200314 1405'), newItemCount: 5, lastId:7, chatmessageList: catChatmessageListData, chatroomSetting: defaultChatroomSettingData,
};
let dogChatroomData = {
  lastMessageTime: Moment('20200314 1405'), newItemCount: 5, lastId:7, chatmessageList: dogChatmessageListData, chatroomSetting: defaultChatroomSettingData,
};
let carmelChatroomData = {
  lastMessageTime: Moment('20200314 1405'), newItemCount: 5, lastId:7, chatmessageList: carmelChatmessageListData, chatroomSetting: defaultChatroomSettingData,
};

let defaultDiarymessageLsitData = [];
let testDiarymessageLsitData = [
  { _id: 1, text: '나의 엤날 답변1', createdAt: Moment('20200314 1405'), islagacy: true, linkedMessageList: []},
  { _id: 2, text: '나의 엤날 답변2', createdAt: Moment('2020-03-15 14:06'), islagacy: true, linkedMessageList: []},
  { _id: 3, text: '나의 엤날 답변3', createdAt: Moment('2020-03-16 14:10'), islagacy: true, linkedMessageList: []},
  { _id: 4, text: '나의 엤날 답변4', createdAt: Moment('2020-03-19 14:05'), islagacy: true, linkedMessageList: []},
  { _id: 5, text: '나의 엤날 답변5', createdAt: Moment('2020-05-21 14:06'), islagacy: true, linkedMessageList: []},
  { _id: 6, text: '나의 엤날 답변6 나의 엤날 답변7 나의 엤날 답변8 나의 엤날 답변9', createdAt: Moment('2020-05-27 14:10'), islagacy: true, linkedMessageList: []},
];
let catDiarymessageLsitData = [
  { _id: 1, text: '나의 엤날 답변1', createdAt: Moment('20190826 1405'), islagacy: true, linkedMessageList: []},
  { _id: 2, text: '나의 엤날 답변2', createdAt: Moment('2020-03-16 12:06'), islagacy: true, linkedMessageList: []},
  { _id: 3, text: '나의 엤날 답변3', createdAt: Moment('2020-03-16 14:10'), islagacy: true, linkedMessageList: []},
  { _id: 4, text: '나의 엤날 답변4', createdAt: Moment('2020-03-16 15:05'), islagacy: true, linkedMessageList: []},
  { _id: 5, text: '나의 엤날 답변5', createdAt: Moment('2020-05-16 16:06'), islagacy: true, linkedMessageList: []},
  { _id: 6, text: '나의 엤날 답변6 나의 엤날 답변7 나의 엤날 답변8 나의 엤날 답변9', createdAt: Moment('2020-05-27 14:10'), islagacy: true, linkedMessageList: []},
];
let dogDiarymessageLsitData = [
  { _id: 1, text: '나의 엤날 답변1', createdAt: Moment('20200314 1405'), islagacy: true, linkedMessageList: []},
  { _id: 2, text: '나의 엤날 답변2', createdAt: Moment('2020-03-15 14:06'), islagacy: true, linkedMessageList: []},
  { _id: 3, text: '나의 엤날 답변3', createdAt: Moment('2020-03-16 14:10'), islagacy: true, linkedMessageList: []},
  { _id: 4, text: '나의 엤날 답변4', createdAt: Moment('2020-03-19 14:05'), islagacy: true, linkedMessageList: []},
  { _id: 5, text: '나의 엤날 답변5', createdAt: Moment('2020-05-21 14:06'), islagacy: true, linkedMessageList: []},
  { _id: 6, text: '나의 엤날 답변6 나의 엤날 답변7 나의 엤날 답변8 나의 엤날 답변9', createdAt: Moment('2020-05-21 15:10'), islagacy: true, linkedMessageList: []},
];
let carmelDiarymessageLsitData = [
  { _id: 1, text: '나의 엤날 답변1', createdAt: Moment('20200314 1405'), islagacy: true, linkedMessageList: []},
  { _id: 2, text: '나의 엤날 답변2', createdAt: Moment('2020-03-14 15:06'), islagacy: true, linkedMessageList: []},
  { _id: 3, text: '나의 엤날 답변3', createdAt: Moment('2020-03-14 16:10'), islagacy: true, linkedMessageList: []},
  { _id: 4, text: '나의 엤날 답변4', createdAt: Moment('2020-03-14 17:05'), islagacy: true, linkedMessageList: []},
  { _id: 5, text: '나의 엤날 답변5', createdAt: Moment('2020-05-21 18:06'), islagacy: true, linkedMessageList: []},
  { _id: 6, text: '나의 엤날 답변6 나의 엤날 답변7 나의 엤날 답변8 나의 엤날 답변9', createdAt: Moment('2020-05-27 14:10'), islagacy: true, linkedMessageList: []},
];

let defaultDiarySettingData = {
  position: 1,
  color: 1,
};
let testDiarySettingData = {
  color: 2,
};
let catDiarySettingData = {
  color: 3,
};
let dogDiarySettingData = {
  color: 4,
};
let carmelDiarySettingData = {
  color: 5,
};

// diary
let testDiaryData = {
  makeTime: Moment('20200421 1405'), lastId:6, diaryImg: diaryImg, totalUpdateCount: 5, diarymessageList: testDiarymessageLsitData, diarySetting: testDiarySettingData,
};
let defaultDiaryData = {
  makeTime: Moment(), lastId:0, diaryImg: diaryImg, totalUpdateCount: 5, diarymessageList: defaultDiarymessageLsitData, diarySetting: defaultDiarySettingData,
};
let catDiaryData = {
  makeTime: Moment('20200421 1405'), lastId:6, diaryImg: diaryImg, totalUpdateCount: 19, diarymessageList: catDiarymessageLsitData, diarySetting: catDiarySettingData,
};
let dogDiaryData = {
  makeTime: Moment('20200517 2318'), lastId:6, diaryImg: diaryImg, totalUpdateCount: 4, diarymessageList: dogDiarymessageLsitData, diarySetting: dogDiarySettingData,
};
let carmelDiaryData = {
  makeTime: Moment('20200801 1123'), lastId:6, diaryImg: diaryImg, totalUpdateCount: 32, diarymessageList: carmelDiarymessageLsitData, diarySetting: carmelDiarySettingData,
};

// push
let defaultPushData = {
  isRandomPushType: false, pushStartTime: Moment('20200805 090000'), pushEndTime: Moment(),
};
let catPushData = {
  isRandomPushType: true, pushStartTime: Moment('20200805 090000'), pushEndTime: Moment(),
};
let dogPushData = {
  isRandomPushType: false, pushStartTime: Moment('20200805 090000'), pushEndTime: Moment(),
};
let carmelPushData = {
  isRandomPushType: false, pushStartTime: Moment('20200805 090000'), pushEndTime: Moment(),
};



let realTestData1 = {
  id: 1, isAvailable: true, hasDiary:true, hasChatroom: true, isSubscribe:false,
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
    ]
  },
  chatroom: {
    lastMessageTime: Moment('20200705 0811'), newItemCount: 0, lastId:10, chatmessageList: thankQChatmessageListData, chatroomSetting: {color: 0},
  },
  diary: {
    makeTime: Moment('20200702 21:10:34'), lastId:0, totalUpdateCount: 0, diarymessageList: [], diarySetting: {color: 4}
  },
  push: {
    isRandomPushType: false, pushStartTime: Moment('20200812 0830'), pushEndTime: Moment('20200812 0830'),
  },
};
let realTestData2 = {
  id: 2, isAvailable: true, hasDiary:true, hasChatroom: true, isSubscribe:false,
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
    ]
  },
  chatroom: {
    lastMessageTime:  Moment('20200712 0842'), newItemCount: 0, lastId:10, chatmessageList: highlightChatmessageListData, chatroomSetting: {color: 0},
  },
  diary: {
    makeTime:  Moment('20200709 221034'), lastId:0, totalUpdateCount: 0, diarymessageList: [], diarySetting: {color: 5}
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
    ]
  },
  chatroom: {
    lastMessageTime: Moment('20200813 2107'), newItemCount: 0, lastId:13, chatmessageList: qTalkChatmessageListData, chatroomSetting: {color: 0},
  },
  diary: {
    makeTime: Moment('20200809 233834'), lastId:4, totalUpdateCount: 4, diarymessageList: qTalkDiaryMessageListData, diarySetting: {color: 9}
  },
  push: {
    isRandomPushType: false, pushStartTime: Moment('20200812 2100'), pushEndTime: Moment(),
  },
};

let dataList = [
  realTestData1,
  realTestData2,
  realTestData3,
];
let userData = {
  token: 'aadfnlkas235kj2',
  username: '기본 사용자',
  email: 'aa2@naver.com',
  password: '1234!',
  numberOfSubscribe: 3,
  numberOfChatroom: 3,
  numberOfDiary: 3,
  diaryOrder: [1, 2, 3],
  chatroomOrder: [1, 2, 3],
  lastDiaryColor: 1,      // 다이어리 색 분배의 유사랜덤
};

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;
// 컨트롤 변수
let pressDiaryEditButton = false;  // diary 편집버튼 누름 상태값
let global_p_id = 0;               // 채팅창 사이드 메뉴에서 다른 상품정보로 보내기 위한 상품 id 값
let editDiaryTextMode = false;     // 다이어리 편집모드 상태값

// 인증 페이지
function IntroScreen1() {
  const { introSkip } = React.useContext(AuthContext);

  return (
    <ImageBackground source={introImage1} style={styles.backgroundImg}>
      <TouchableOpacity style={styles.skipButton} onPress={introSkip}>
        <Text style={{fontSize: 24, marginRight: 20, color: 'blue', marginTop: 20}}>[Skip]</Text>
      </TouchableOpacity>
    </ImageBackground>
  );
}
function IntroScreen2() {
  const { introSkip } = React.useContext(AuthContext);

  return (
    <ImageBackground source={introImage2} style={styles.backgroundImg}>
      <TouchableOpacity style={styles.skipButton} onPress={introSkip}>
        <Text style={{fontSize: 24, marginRight: 20, color: 'blue', marginTop: 20}}>[Skip]</Text>
      </TouchableOpacity>
    </ImageBackground>
  );
}
function IntroScreen3() {
  const { introSkip } = React.useContext(AuthContext);

  return (
    <ImageBackground source={introImage3} style={{resizeMode: 'cover', flex:1, flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'flex-end'}}>
      <TouchableOpacity onPress={introSkip}>
        <Text style={{fontSize: 24, color: 'blue', marginRight: 40, marginBottom: 40}}>[로그인]</Text>
      </TouchableOpacity>
    </ImageBackground>
  );
}
function IntroScreen4() {
  const { introSkip } = React.useContext(AuthContext);

  useFocusEffect(introSkip, []);

  return (
    <View style={{backgroundColor: 'white'}}/>
  );
}
function SignInScreen({navigation}){
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [autoLoginChecked, setAutoLoginChecked] = React.useState(true);
  const { signIn } = React.useContext(AuthContext);

  return (
      <ScrollView style={{marginTop:30}}>
      <View style={{flex:1, flexDirection: 'column', alignItems: 'center'}}>
      <Image source={q_moment} resizeMode={'contain'} style={{height: 200, width:170, marginTop: 80}}/>
        <View style={{marginTop: 80}}>
          <TextInput value={username} onChangeText={(username)=>setUsername(username)} placeholder={"이메일"} style={[styles.singInInputBox, {marginBottom: 8}]} placeholderTextColor={'#666'}/>
          <TextInput value={password} onChangeText={(password)=>setPassword(password)} placeholder={"비밀번호"} style={styles.singInInputBox} secureTextEntry={true} placeholderTextColor={'#666'}/>
          <View style={{flexDirection: 'row'}}>
            <CheckBox title="autoLoginCheckBox" value={autoLoginChecked} onValueChange={()=>setAutoLoginChecked(!autoLoginChecked)}/>
            <Text style={{marginTop: 3}}>자동로그인</Text>
          </View>
          <TouchableOpacity style={{alignItems: 'center', padding: 10, backgroundColor: '#BBB'}} onPress={()=>signIn([username, password, true])}>
            <Text style={{fontSize: 21}}>로그인</Text>
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
  const [emailError, setEmailError] = React.useState(true);
  const [usernameError, setUsernameError] = React.useState(true);
  const [findPasswordError, setFindPasswordError] = React.useState(true);

  return (
    <View style={{flex:1, flexDirection: 'column'}}>
      <TextInput placeholder='이메일' style={{borderWidth: 1, margin: 20, marginTop: 90, padding: 5, backgroundColor: '#DDD'}} value={email} onChangeText={(e)=>setEmail(e)} />
      {emailError && <Text style={{color: 'red', fontSize: 12, marginBottom: 10, marginLeft: 30}}>가입한 이메일 주소를 입력해주세요.</Text>}
      <TextInput placeholder='사용자명' style={{borderWidth: 1, margin: 20, marginTop: 10, padding: 5, backgroundColor: '#DDD'}} value={username} onChangeText={(e)=>setUsername(e)} />
      {usernameError && <Text style={{color: 'red', fontSize: 12, marginBottom: 10, marginLeft: 30}}>해당 사용자명이 존재하지 않습니다.</Text>}
      {findPasswordError && <Text style={{color: 'red', fontSize: 12, marginBottom: 10, marginLeft: 30, marginTop: 20}}>입력하신 정보와 일치하는 계정이 없습니다.</Text>}
      <TouchableOpacity style={{height: 50, margin:20, backgroundColor: '#BBB', alignItems: 'center', justifyContent: 'center'}} onPress={()=>{Alert.alert('제목', '팝업 확인 내용 여기에'); navigation.popToTop();}}>
        <Text>확인</Text>
      </TouchableOpacity>
    </View>
  );
}
function SignUpScreen({navigation}){
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [password2, setPassword2] = React.useState('');
  const [errorEmailForm, setErrorEmailForm] = React.useState(true);
  const [errorPasswordForm, setErrorPasswordForm] = React.useState(true);
  const [errorPasswordNotCorrect, setErrorPasswordNotCorrect] = React.useState(true);
  const { signIn } = React.useContext(AuthContext);

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
          <TouchableOpacity onPress={()=>{navigation.navigate('InformTermsOfUse')}}><Text style={[styles.smallText, {color: '#22D'}]}>이용약관</Text></TouchableOpacity>
          <Text style={styles.smallText}>과 </Text>
          <TouchableOpacity onPress={()=>{navigation.navigate('InformPersonalInformationProcessingPolicy')}}><Text style={[styles.smallText, {color: '#22D'}]}>개인정보 처리방침</Text></TouchableOpacity>
          <Text style={styles.smallText}>을 확인하였으며, 동의합니다. </Text>
        </View>
        <View>
          <TouchableOpacity style={{alignItems: 'center', padding: 10, backgroundColor: '#BBB', width: 300, marginTop: 60}} onPress={()=>{navigation.navigate('SetUsername'); signIn([email, password, false])}}>
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

  return (
    <KeyboardAvoidingView style={{flex:1, flexDirection: 'column', alignItems:'center', justifyContent:'space-between'}} behavior="height" enabled>
      <View style={{padding:40}}><Text>유저네임 등록 화면 이미지</Text></View>
      <View style={{justifyContent: 'center'}}>
        <Text style={{fontWeight: 'bold', marginBottom: 50, alignSelf: 'center'}}>당신의 호칭을 정해주세요.</Text>
        <Text style={{margin:5, fontWeight:'bold', marginLeft: 0}}>사용자 이름</Text>
        <TextInput value={username} onChangeText={(username)=>setUsername(username)} style={styles.singInInputBox} placeholder={"'사용자의 이름'"}/>
      </View>
      <View>
        <TouchableOpacity style={{alignItems: 'center', padding: 10, backgroundColor: '#BBB', width: 300, marginTop: 60}} onPress={()=>registerUsername(username)}>
          <Text>시작하기</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
function InformTermsOfUseScreen({navigation}) {
  return (
    <View style={{flex:1, flexDirection: 'column', margin: 35, flexWrap: 'wrap'}}>
      <Text style={{fontWeight:'bold', color: 'black', fontSize: 13}}>이용약관1</Text>
      <Text style={{fontSize: 12, marginBottom: 10}}>이용약관은 다음과 같다.</Text>
      <Text style={{fontWeight:'bold', color: 'black', fontSize: 13}}>이용약관2</Text>
      <Text style={{fontSize: 12, marginBottom: 10}}>이용약관은 다음과 같다.</Text>
      <Text style={{fontWeight:'bold', color: 'black', fontSize: 13}}>이용약관3</Text>
      <Text style={{fontSize: 12, marginBottom: 10}}>이용약관은 다음과 같다.</Text>
    </View>
  );
}
function InformPersonalInformationProcessingPolicyScreen({navigation}) {
  return (
    <View style={{flex:1, flexDirection: 'column', margin: 40, flexWrap: 'wrap'}}>
      <Text style={{fontWeight:'bold', color: 'black', fontSize: 13}}>개인정보 처리방침1</Text>
      <Text style={{fontSize: 12, marginBottom: 10}}>개인정보 처리방침은 다음과 같다.</Text>
      <Text style={{fontWeight:'bold', color: 'black', fontSize: 13}}>개인정보 처리방침2</Text>
      <Text style={{fontSize: 12, marginBottom: 10}}>개인정보 처리방침은 다음과 같다.</Text>
      <Text style={{fontWeight:'bold', color: 'black', fontSize: 13}}>개인정보 처리방침3</Text>
      <Text style={{fontSize: 12, marginBottom: 10}}>개인정보 처리방침은 다음과 같다.</Text>
    </View>
  );
}

// 푸시 테스트
function chooseRandomly(a){
  return a[Math.floor(Math.random() * a.length)];
}
function pushMessage(id){
  let data = dataList[id-1];
  let product = data.product;
  let chatroom = data.chatroom;
  let avatar = product.imageSet.avatarImg.uri?? product.imageSet.avatarImg;
  let newMessage = { _id: chatroom.lastId+1, text: chooseRandomly(product.questionList), createdAt: Moment(),
    user: { _id:2, avatar: avatar}
  };
  chatroom.newItemCount += 1;
  chatroom.lastId += 1;
  chatroom.chatmessageList.unshift(_.cloneDeep(newMessage));
  chatroom.lastMessageTime = Moment();

  return ;
}
function pushTestHandler(handler){
  pushMessage(chooseRandomly(userData.chatroomOrder));
  handler();  // update screen
  return ;
}

// 메인 페이지
function MainPageScreen({navigation, route}){
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
            return <MaterialCommunityIcons name={iconName} size={size} color={tintcolor } />;
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
      <Tab.Screen name="MyChatListScreen"  component={MyChatListScreen}/>
      <Tab.Screen name="MyDiaryScreen"  component={MyDiaryScreen} />
    </Tab.Navigator>
  );
}
function SubscribeListScreen({navigation}){
  const [numberOfSubscribe, setNumberOfSubscribe] = useState(userData.numberOfSubscribe);

  useFocusEffect(()=>{
    if(numberOfSubscribe != userData.numberOfSubscribe) setNumberOfSubscribe(userData.numberOfSubscribe);
  }, []);

  return (
    <View style={{flex:1, flexDirection: 'column', backgroundColor: 'white', alignItems: 'flex-start'}}>
      <ScrollView styles={{marginHorizontal: 20}} >
        <Text style={{margin:10, fontSize: 17}}>내 구독 상품</Text>
        {dataList.map(({id, isSubscribe})=>{
          if(isSubscribe) return <SubscribeContentLayout key={id} id={id}  nav={navigation}/>
        })}

          <View style={{left:10, right:10, backgroundColor: '#f0f0f0', height:1, marginVertical:7, width: screenWidth*0.98}}/>

        <Text style={{margin:10, marginTop:5, borderTopWidth: 1, fontSize: 17, borderColor: '#CCC'}}>구독 가능한 상품</Text>
        {dataList.map(({id, isSubscribe})=>{
          if(!isSubscribe) return <SubscribeContentLayout key={id} id={id}  nav={navigation}/>
        })}
        <View style={{height:200}}/>
      </ScrollView>
    </View>
  );
}
function HiddenLayer({data, rowMap}){
  const [alarm, setAlarm] = useState(dataList[data.item.id-1].chatroom.chatroomSetting.getPushAlarm);

  const alarmOnOffhandler = () => {
    if(alarm) {
      // 알람 끄기
      dataList[data.item.id-1].chatroom.chatroomSetting.getPushAlarm = false;
      setAlarm(false);
    } else {
      // 알람 켜기
      dataList[data.item.id-1].chatroom.chatroomSetting.getPushAlarm = true;
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
  const [numberOfChatroom, setNumberOfChatroom] = useState(0);
  const [listViewData, setListViewData] = useState([]);
  const [updateChatListScreen, setUpdateChatListScreen] = useState(0);

  const getPushMessage = () => {
    setUpdateChatListScreen(updateChatListScreen + 1);
  }

  useFocusEffect(()=>{
    if(userData.numberOfSubscribe === 0 && noSubscribe===false || userData.numberOfSubscribe != 0 && noSubscribe===true) setNoSubscribe(!noSubscribe);
    if(numberOfChatroom != userData.numberOfChatroom) {
      setNumberOfChatroom(userData.numberOfChatroom);
      setListViewData(userData.chatroomOrder.map((id)=>{return {key: id.toString(), id: id}}));
    }
  });

  return (
    <View style={{flex:1, flexDirection: 'column', backgroundColor: 'white'}}>
      {noSubscribe ? NoSubscribeInform(navigation) : <Text/>}
      <SwipeListView
        data={listViewData}
        renderHiddenItem={(data, rowMap)=>(<HiddenLayer key={data.item.id.toString()} data={data} rowMap={rowMap}/>)}
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
  const [editMode, setEditMode] = React.useState(false);
  const [numberOfDiary, setNumberOfDiary] = useState(userData.numberOfDiary);

  const changeDiaryHandler = () => {
    setNumberOfDiary(userData.numberOfDiary);
  }
  useFocusEffect(()=>{
    if(editMode != pressDiaryEditButton) setEditMode(pressDiaryEditButton);
    if(numberOfDiary != userData.numberOfDiary) setNumberOfDiary(userData.numberOfDiary);
  });

  return (
    <View style={{flex:1, flexDirection: 'column', backgroundColor: 'white'}}>
      <ScrollView>
        <View style={{flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between'}}>
          {userData.diaryOrder.map((id)=>{
            return editMode ?
              <AnimatableDiaryComponent key={id} id={id} nav={navigation} handler={changeDiaryHandler}/> :
              <DiaryComponent key={id} id={id} nav={navigation}/>
          })}
        </View>
      </ScrollView>
    </View>
  );
}

// 기능 핸들러
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
  const id = props.id;``
  const data = dataList[id-1];
  const productInfo  = dataList[id-1].product;
  const [lastMessageTime, setLastMessageTime] = useState(data.chatroom.lastMessageTime);  // 최신 메세지 업데이트 시간
  const [newItemCount, setNewItemCount] = useState(data.chatroom.newItemCount);   // 최신 알림 수
  const [fromNowTime, setFromNowTime] = useState(lastMessageTime.fromNow());  // 최신 메세지 업데이트 시간, 자연적인 설명버전

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
  });

  return (
    <TouchableHighlight style={{marginBottom: 10}} onPress={()=>props.nav.navigate('chatroom', {id: id})}>
    <View style={{flexDirection: 'row', height: 60, backgroundColor: 'white'}}>
      <Image source={productInfo.imageSet.thumbnailImg} style={{height: 46, width: 46, margin: 5,borderWidth: 1, borderColor: '#f7f7f7', marginLeft: 10, borderRadius: 23, backgroundColor: '#DDD'}}/>
      <View style={{flexDirection: 'column'}}>
        <Text style={{marginLeft: 10, marginTop: 6, fontSize: 17,fontWeight: '400', width: 220}}>{productInfo.title}</Text>
        <Text style={{color: '#AAA', fontSize: 12, marginLeft: 13, marginTop:3}}>{data.chatroom.chatmessageList[0].text}</Text>
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
  const id = props.id;
  const productInfo = dataList[id-1].product;

  return (
    <TouchableOpacity onPress={()=>props.nav.navigate('contentScreen', {id: id})}>
    <View style={{flexDirection: 'row', height: 56, margin: 3, marginBottom: 10}}>
      <Image resizeMode='cover' source={productInfo.imageSet.thumbnailImg} style={{height: 46, borderWidth: 1, borderColor: '#f7f7f7', width: 46, margin: 5, borderRadius: 23, backgroundColor: '#DDD'}}/>
      <View style={{flexDirection: 'column'}}>
        <Text style={{marginLeft: 10, marginTop: 6, fontSize: 17,fontWeight: '400', width: 220}}>{productInfo.title}</Text>
        <Text style={{color: '#AAA', fontSize: 12, marginLeft: 13, marginTop:3}}>{productInfo.text}</Text>
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

// 구독 구성품
function diaryInitializeFunction(id){
  // 기존의 다이어리 있는지 확인
  const data = dataList[id-1];
  if(data.hasDiary) {
    // 아무것도 하지 않음
    return ;
  } else {
    // 초기버전 다이어리 만듦
    userData.numberOfDiary += 1; // 다이어리 확장을 알림
    data.hasDiary = true; // 다이어리를 보이게 함
    userData.diaryOrder.push(id);    // 위치 등록

    // 다이어리 초기 데이터 구성
    userData.lastDiaryColor += 1;
    let makeDiaryData = {
      makeTime: Moment(),  lastId:0, totalUpdateCount: 0, diarymessageList: [], diarySetting: {color: userData.lastDiaryColor% 10},
    };

    data.diary = _.cloneDeep(makeDiaryData); // 다이어리 데이터 연결
    return ;
  }
}
function chatroomInitializeFunction(id){
  // 기존의 채팅창이 있는지 확인함
  const data = dataList[id-1];
  if(data.hasChatroom) {
    // 아무것도 하지 않음
    return ;
  } else {
    // 초기버전 채팅창을 만듦
    userData.numberOfChatroom += 1; // 채팅창 확장을 알림
    data.hasChatroom = true; // 채팅창을 보이게 함
    userData.chatroomOrder.push(id);    // 위치 등록

    // 채팅창 초기 데이터 구성
    let makeChatroomSettingData = {
      getPushAlarm: true,
    };
    let makeChatmessageListData = [
      {
        _id: 1, text: data.product.title + ' 채팅방입니다.', createdAt: Moment(),
        user: { _id:2, avatar: data.product.imageSet.avatarImg.uri??data.product.imageSet.avatarImg},
      },
    ];
    let makeChatroomData = {
      lastMessageTime: Moment(), newItemCount: 1, lastId:1, chatmessageList: makeChatmessageListData, chatroomSetting: makeChatroomSettingData,
    };

    data.chatroom = _.cloneDeep(makeChatroomData); // 채팅창 데이터 연결

    return ;
  }
}
function SubscribeContentScreen({route, navigation}){
  const id = route.params.id;
  const data = dataList[id-1];

  const [isSubscribeButton, setIsSubscribeButton] = React.useState(data.isSubscribe);
  const [pushStartTime, setPushStartTime] = useState(data.push.pushStartTime);
  const [pushEndTime, setPushEndTime] = useState(data.push.pushEndTime);
  let thisScrollView = null;
  let goToEnd = route.params.goToEnd??null;

  const [show0, setShow0] = useState(false);
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);

  const subscribeOffHandler = () => {
    userData.numberOfSubscribe -= 1;
    data.isSubscribe = !data.isSubscribe; // false
    setIsSubscribeButton(data.isSubscribe);
  };

  const subscribeOnHandler = () => {

    // 시간 설정 성공
    userData.numberOfSubscribe += 1;
    data.isSubscribe = !data.isSubscribe; // true
    setIsSubscribeButton(data.isSubscribe);

    // 채팅창 초기화 준비
    chatroomInitializeFunction(id);
    // 다이어리 초기화 준비
    diaryInitializeFunction(id);

    // 시간  설정 실패 return
  };
  const onChange0 = (event, selectedDate) => {
    // 취소한 경우
    if(event.type === 'dismissed') return Alert.alert('취소하였습니다.');

    // 시간 등록
    setPushStartTime(Moment(selectedDate));
    data.push.pushStartTime = Moment(selectedDate);

    setShow0(false); // 시간 선택 종료

    setPushEndTime(Moment(selectedDate));
    data.push.pushEndTime = Moment(selectedDate);
    subscribeOnHandler();
  };
  const onChange1 = (event, selectedDate) => {
    // 취소한 경우
    if(event.type === 'dismissed') return Alert.alert('취소하였습니다.');

    // 시간 등록
    setPushStartTime(Moment(selectedDate));
    data.push.pushStartTime = Moment(selectedDate);

    setShow1(false); // 시간 선택 종료

    setShow2(true);
  };
  const onChange2 = (event, selectedDate) => {
    if(event.type === 'dismissed') return Alert.alert('취소하였습니다.');

    setShow2(false);  // 시간 선택 종료
    setPushEndTime(Moment(selectedDate));
    data.push.pushEndTime = Moment(selectedDate);
    subscribeOnHandler();
  };

  const subscribeButtonHandler = () => {
    if(data.isSubscribe) {
      // 구독 취소
      Alert.alert('구독을 취소하시겠습니까?', '구독을 취소하여도 채팅기록과 다이어리는 남습니다.', [{text: '취소'}, {text:'구독취소', onPress: subscribeOffHandler}]);
    }else{
      // 구독 신청
      Alert.alert(data.product.title + ' 상품을 구독하시겠습니까?', '푸시 알람설정을 완료하여 구독을 할 수 있습니다.', [{text:'취소'}, {text:'푸시설정', onPress:()=>{thisScrollView.scrollToEnd({animated: true}); data.push.isRandomPushType ? setShow1(true) : setShow0(true)}}]);
    }
  };

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
                      <Text style={{color: '#AAA', fontSize: 19, marginTop:10}}>{pushStartTime.format('LT')} 부터</Text>
                      <Text style={{color: '#AAA', fontSize: 19}}>{pushEndTime.format('LT')} 사이</Text>
                    </View>
                  : <Text style={{fontSize: 19, color: '#AAA', fontSize: 19, marginTop:17, marginBottom:7}}>{pushStartTime.format('LT')}</Text>
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
            <View style={{flexDirection: ' row', alignItems: 'flex-start', justifyContent: 'space-between', borderWidth: 0, borderColor: 'blue', marginTop:10, paddingLeft:5}}>
              <Text style={{fontSize: 19}}>푸시알림 시간대를 설정해주세요.</Text>
            </View>
          }
          {show2 &&
            <View style={{flexDirection: ' row', alignItems: 'flex-start', justifyContent: 'space-between', borderWidth: 0, borderColor: 'blue', marginTop:10, paddingLeft:5}}>
              <Text style={{fontSize: 19}}>푸시알림 시간대를 설정해주세요.</Text>
              <Text style={{color: '#AAA', fontSize: 19, marginTop: 5}}>{pushStartTime.format('LT')} 부터</Text>
            </View>
          }

          <View style={{marginTop:10}}>
            {show0 && <DateTimePicker testID="dateTimePicker" value={pushStartTime.toDate()} mode={'time'} is24Hour={true} display="default" onChange={onChange0}/>}
            {show1 && <DateTimePicker testID="dateTimePicker" value={pushStartTime.toDate()} mode={'time'} is24Hour={true} display="default" onChange={onChange1}/>}
            {show2 && <DateTimePicker testID="dateTimePicker" value={pushStartTime.toDate()} mode={'time'} is24Hour={true} display="default" onChange={onChange2}/>}
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

  return (
    <DrawerContentScrollView style={{backgroundColor: '#FFF'}}>
      <TouchableOpacity onPress={()=>navigation.closeDrawer()}>
        <Octicons name="three-bars" style={{marginLeft:20, marginTop:10, marginBottom: 20}} size={20} color="black" />
      </TouchableOpacity>
      <DrawerItem label="다이어리 보기"  icon={()=><Image source={bookOn} resizeMode={'cover'} style={{width:20, height:20}}/>} onPress={() => {navigation.navigate('MyDiaryScreen'); navigation.navigate('Diary', {id:global_p_id, goToEnd: true})}} />
      <DrawerItem label="푸시 메세지 설정" icon={()=><Ionicons name="md-time" style={{marginLeft: 3}} size={20} color="black" />} onPress={() => {navigation.navigate('SubscribeListScreen'); navigation.navigate('contentScreen', {id:global_p_id, goToEnd: true})}} />
      <DrawerItem label="채팅방 나가기" icon={()=><MaterialIcons name="exit-to-app" style={{marginLeft: 1}} size={20} color="black" />}
        onPress={() => {
          Alert.alert('정말 채팅방을 나가시겠습니까?', '채팅방을 나가면 채팅 내용과 채팅 목록은 사라지고 다이어리에서만 기록을 확인할 수 있습니다.', [{text: '나가기', onPress: ()=>navigation.navigate('MainPage')}, {text:'취소'}]);}} />
    </DrawerContentScrollView>
  );
}
function makeDiaryMessage(id, message){
  const data = dataList[id-1];
  let diaryForm = { _id: data.diary.lastId+1, text: message.text, createdAt: message.createdAt, islagacy: false, linkedMessageList: [message._id]}
  data.diary.diarymessageList.push(_.cloneDeep(diaryForm));
  data.diary.totalUpdateCount += 1;
  data.diary.lastId+=1;
}
function MyChatRoomScreen({route, navigation}) {  // 채팅방 화면
  const [messages, setMessages] = useState([]);
  const id = route.params.id;
  const data = dataList[id-1];

  useEffect(() => {
    setMessages(data.chatroom.chatmessageList);                 // 메세지 로드
    navigation.setOptions({ headerTitle: data.product.title }); // 채팅방 제목 설정
    global_p_id = id;                                           // 전역변수에 현재 관심 id 설정

    // 채팅방 확인
    data.chatroom.newItemCount = 0;
  }, []);

  const onSend = useCallback((messages = []) => {
    // 메세지 화면 표시
    setMessages(previousMessages => GiftedChat.append(previousMessages, messages));

    // 메세지 가공
    let message = _.cloneDeep(messages[0]);   // 메세지 복사
    message.createdAt = Moment(message.createdAt);  // 시간정보를 Moment로 커버
    data.chatroom.lastId += 1;
    message._id = data.chatroom.lastId; // 아이디 부여
    if(message.user._id !== 1) {
      message.user.avatar = data.product.imageSet.avatarImg.uri;
    }

    // 채팅방에 저장
    data.chatroom.lastMessageTime = Moment();
    data.chatroom.chatmessageList.unshift(_.cloneDeep(message));

    // 다이어리에 저장
    if(data.diary.lastId === 0) {
      // 첫 메세지
      makeDiaryMessage(id, message);
    }else{
      let topMessage = data.diary.diarymessageList[data.diary.lastId-1];
      let checkTime = Moment.duration(topMessage.createdAt.diff(message.createdAt)).asMinutes();
      if(-15 <= checkTime && checkTime <= 0){
        // 같은 메세지로 인정
        topMessage.linkedMessageList.push(message._id);
        topMessage.text += ' ' + message.text;
      }else{
        // 새로운 메세지 생성
        makeDiaryMessage(id, message);
      }
    }

  }, []);

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
      />

  )
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

function TestScreen({route, navigation}){
  return (
    <View >
      <Draggable x={75} y={100} renderSize={56} renderColor='black' renderText='A' isCircle shouldReverse onShortPressRelease={()=>alert('touched!!')}/>
      <Draggable x={200} y={300} renderColor='red' renderText='B'/>
      <Draggable/>
    	<Draggable x={50} y={50}>
    		<Text>aaaa</Text>
        <Text>bbbb</Text>
    	</Draggable>
    </View>
  );
}

// 다이어리 구성품
function AnimatableDiaryComponent(props){
  const id = props.id;
  const data = dataList[id-1];
  const [makeTime, setMakeTime] = useState(data.diary.makeTime);
  const [totalUpdateCount, setTotalUpdateCount] = useState(data.diary.totalUpdateCount);
  const [nowTime, setNowTime] = useState(Moment());
  let x, y;

  useFocusEffect(()=>{
    if(makeTime != data.diary.makeTime) setMakeTime(data.diary.makeTime);
    if(totalUpdateCount != data.diary.totalUpdateCount) setTotalUpdateCount(data.diary.totalUpdateCount);
    if(!nowTime.isSameOrAfter(nowTime, 'day')) setNowTime(Moment());
  });

  const eraseDiaryHandler = () => {
    userData.numberOfDiary -= 1;  // 다이어리 수가 변함을 알림, 렌더링
    userData.numberOfChatroom -= 1; // 채팅장 수 감소
    userData.numberOfSubscribe -= 1; // 구독 수 감소
    data.hasDiary = false;        // 다이어리 null 셋팅
    data.hasChatroom = false;     // 채팅창 제거
    data.isSubscribe = false;     // 구독 제거
    userData.diaryOrder.splice(userData.diaryOrder.indexOf(id), 1); // 다이어리 순서열에서 제거
    userData.chatroomOrder.splice(userData.chatroomOrder.indexOf(id), 1); // 채팅창 순서열에서 제거

    props.handler();    // 화면 렌더링 시작
  }

  const eraseDiaryAlertHandler = () => {
    Alert.alert('정말로 '+data.product.title+'을 삭제하시겠습니까?', '다이어리를 삭제하면 현재 상품에 대한 다이어리와 채팅 기록이 모두 사라지며 구독이 취소됩니다.', [{text: '취소'}, {text: '확인', onPress: eraseDiaryHandler}]);
  };

  return (
    <View style={{margin: 5}} onLayout={(e)=>{x = e.nativeEvent.layout.x; y = e.nativeEvent.layout.y; console.log('x, y : ', x, y)}}>
      <Draggable x={x} y={y}>
      <Animatable.View animation='swing' iterationCount={'infinite'}>
      <TouchableOpacity style={{margin: 20, marginBottom: 0, marginTop: 10}} onPress={()=>Alert.alert('다이어리 순서변경 기능', '추가예정')}>
          <View style={{position:'absolute', left:3, top:5, height: 185, width:130, backgroundColor: '#CCC', borderBottomRightRadius: 8, borderTopRightRadius: 8}}/>
          <Image style={{height: 190, width: 130}} source={diaryImgList[data.diary.diarySetting.color]} resizeMode='contain'/>
          <View>
            <Text adjustsFontSizeToFit={true} style={{width: 130, fontSize: 16,  color: 'black', fontWeight:'bold', alignSelf: 'center', marginBottom: 3, marginTop:3}}>{data.product.title}</Text>
            <View style={{flexDirection: 'column', marginBottom: 5}}>
              {makeTime.isSameOrAfter(nowTime, 'day')
                ? <View><Text style={{fontSize: 8, color: 'gray'}}>오늘 생성한 다이어리</Text><Text style={{fontSize: 8, color: 'gray', alignSelf: 'flex-end', paddingRight:62}}>총 {totalUpdateCount}회 기록</Text></View>
                : <View><Text style={{fontSize: 8, color: 'gray'}}>{makeTime.format('L')} ~ {nowTime.format('L')}</Text><Text style={{fontSize: 8, color: 'gray', alignSelf: 'flex-end', paddingRight:30}}>총 {totalUpdateCount}회 기록</Text></View>}
            </View>
          </View>
    </TouchableOpacity>
    </Animatable.View>
    <TouchableOpacity onPress={eraseDiaryAlertHandler} style={{position: 'absolute', left: 18, top:18, backgroundColor: '#DDD', height: 34, width: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center'}}>
      <Text style={{fontWeight:'bold'}}>X</Text>
    </TouchableOpacity>
    </Draggable>
  </View>
  );
}
function DiaryComponent(props){
  const id = props.id;
  const data = dataList[id-1];
  const [makeTime, setMakeTime] = useState(data.diary.makeTime);
  const [totalUpdateCount, setTotalUpdateCount] = useState(data.diary.totalUpdateCount);
  const [nowTime, setNowTime] = useState(Moment());

  useFocusEffect(()=>{
    if(makeTime != data.diary.makeTime) setMakeTime(data.diary.makeTime);
    if(totalUpdateCount != data.diary.totalUpdateCount) setTotalUpdateCount(data.diary.totalUpdateCount);
    if(!nowTime.isSameOrAfter(nowTime, 'day')) setNowTime(Moment());
  });

  return (
    <TouchableOpacity style={{margin: 20, marginBottom: 0, marginTop: 10}} onPress={()=>{props.nav.navigate('Diary', {id: id})}}>
      <View style={{margin: 5}}>
        <View style={{position:'absolute', left:3, top:5, height: 185, width:130, backgroundColor: '#CCC', borderBottomRightRadius: 8, borderTopRightRadius: 8}}/>
        <Image style={{height: 190, width: 130}} source={diaryImgList[data.diary.diarySetting.color]} resizeMode='contain'/>
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
        <TouchableOpacity onPress={()=>Alert.alert('날짜 편집 모드')}>
          <Text style={{marginLeft: 20, fontSize: 20, color: 'black', marginBottom:5}}>{date}</Text>
        </TouchableOpacity>
      </View>
  );
}
function DiaryTextWithDate(props){
  const showYear = props.options.first || !props.options.sameYear;
  const showDate = props.options.first || !props.options.sameDate;
  const last = props.options.last;
  const title = props.title;
  const [myMessage, setMyMessage] = React.useState(props.message.text);
  const [editMode, setEditMode] = React.useState(true);
  let handler = props.handler;
  let minusHandler = props.minusHandler;

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
  const onEndEditingHandler = () => {
    setEditMode(false);
    props.message.text = myMessage;
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
  useEffect(
    () => props.nav.addListener('beforeRemove', (e) => {
      if(editMode){
        onEndEditingHandler();
      }
    }),
    [props.nav]
  );


  return (
    <View onLayout={(event) => {
        var {x, y, width, height} = event.nativeEvent.layout;
        if(last) minusHandler(y);
    }}>
      {showYear && <DiaryYear year={props.message.createdAt.format('YYYY')} />}
      {showDate && <DiaryDate date={props.message.createdAt.format('MMDD')} />}
      <View style={{paddingLeft: 90, flexWrap:'wrap'}}>
        <TouchableOpacity onPress={()=>setEditMode(true)}>
          <TextInput editable={editMode} onFocus={onFocusHandler} onEndEditing={onEndEditingHandler} style={{fontFamily: 'NanumGothic', textAlign: 'center', marginLeft: -15, fontSize: 14, padding:3, borderRadius: 5,width:screenWidth *0.76}} multiline value={myMessage} onChangeText={text=>setMyMessage(text)}/>
        </TouchableOpacity>
      </View>
      <View style={{marginBottom: 30, marginRight: 20, alignItems: 'flex-end'}}>
        <TouchableOpacity onPress={()=>Alert.alert('시간 편집 모드')}>
          <Text style={{fontSize:10, color: '#AAA'}}>{props.message.createdAt.format('LT')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
function DynamicDiaryScreen({navigation, route}){ // 다이어리 생성 화면
  const id = route.params.id;
  const data = dataList[id-1];
  let time = false;
  let lastDate = data.diary.diarymessageList.length>0 ? data.diary.diarymessageList[data.diary.diarymessageList.length-1].createdAt : null;
  let goToEnd = route.params.goToEnd;
  let thisScrollView;

  const [showDropbox, setShowDropbox] = React.useState(false);      // 다이어리 공유 옵션 바
  const [showTime, setShowTime] = useState(false);                  // 시간 선택 표시창
  const [numberOfMessage, setNumberOfMessage] = useState(data.diary.diarymessageList.length);
  const [contentHeight, setContentHeight] = useState(10000);
  const [minusPos, setMinusPos] = useState(0);

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
    setMinusPos(value);
  }

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
                if(message.createdAt.isSameOrAfter(lastDate, 'day') && !options.sameDate) options.last = true;

                return <DiaryTextWithDate  options={options} key={i.toString()}  nav={navigation} message={message} title={data.product.title} handler={diaryOptionFocusHandler} minusHandler={getMinusContentPositionHandler}/>;
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
  const [myDiaryCount, setMyDiaryCount] = React.useState(10);
  const [totalCount, setTotalCount] = React.useState(256);
  const [image, setImage] = React.useState(null);

  return (
    <View style={{flex:1, flexDirection: 'column'}}>
      <View style={{margin:15, marginBottom: 0, alignItems: 'center', borderBottomWidth: 1, height: 170, justifyContent: 'center'}}>
        <TouchableOpacity onPress={()=>{}}>
          {image
            ? <Image source={{uri: image}} style={{height: 80, width: 80, borderRadius: 40, backgroundColor: 'gray', marginTop: 20, marginBottom: 12}}/>
            : <View style={{height: 80, width: 80, borderRadius: 40, backgroundColor: 'gray', marginTop: 20, marginBottom: 12}}/>
          }
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>{}}>
          <View style={{flexDirection: 'row'}}>
            <Text style={{fontWeight: 'bold', fontSize: 20, marginLeft: 20}}>사용자 이름</Text>
            <EvilIcons name="pencil" size={30} color="black"  style={{marginLeft:5, justifyContent: 'center'}}/>
          </View>
        </TouchableOpacity>
      </View>
      <View style={{}}>
        <View style={{marginHorizontal: 15, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#DDD'}}>
          <EvilIcons name="lock" color="black" size={45} style={{marginVertical: 15, marginLeft: -10}}/>
          <TouchableOpacity onPress={()=>{
            Alert.alert('정말 로그아웃 하시겠습니까?','로그인 페이지로 이동합니다.',[{text:'취소'}, {text:'확인', onPress:()=>{
              Alert.alert('아직 미구현', '로그인 페이지로 이동할 예정');
            }}])}}>
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
  const [warnNextPasswordError, setWarnNextPasswordError] = useState(true);
  const [warnNotCorrectPasswordError, setWarnNotCorrectPasswordError] = useState(false);

  return (
    <ScrollView>
    <View style={{flex:1, flexDirection: 'column', justifyContent: 'space-around'}}>
      <View style={{margin: 20}}>
        <Text style={{marginVertical: 5, fontWeight:'bold', fontSize: 20}}>현재 비밀번호</Text>
        <TextInput value={prevPassword} style={{borderWidth: 1, backgroundColor: '#DDD', fontSize: 30}} secureTextEntry={true} onChange={(text)=>setPrevPassword(text)}/>
        <Text style={{color: warnPrevPasswordError? '#D00f':'#D000', fontSize: 11, marginLeft: 15, marginVertical: 5}}>올바른 비밀번호를 입력해주세요. 현재 비밀번호와 다릅니다.</Text>
      </View>
      <View style={{margin: 20}}>
        <Text style={{marginVertical: 5, fontWeight:'bold', fontSize: 20}}>새 비밀번호</Text>
        <TextInput value={nextPassword} style={{borderWidth: 1, backgroundColor: '#DDD', fontSize: 30}} secureTextEntry={true} onChange={(text)=>setNextPassword(text)}/>
        <Text style={{fontSize: 11, marginLeft: 15, marginVertical: 5}}>6~16자 영문, 소문자, 숫자만 사용 가능 합니다.</Text>
        <Text style={{color: warnNextPasswordError? '#D00f':'#D000', fontSize: 11, marginLeft: 15, marginVertical: 5}}>비밀번호를 올바른 형식으로 입력해주세요.</Text>
      </View>
      <View style={{margin: 20}}>
        <Text style={{marginVertical: 5, fontWeight:'bold', fontSize: 20}}>새 비밀번호 확인</Text>
        <TextInput value={nextAdditionalPassword} style={{borderWidth: 1, backgroundColor: '#DDD', fontSize: 30}} secureTextEntry={true} onChange={(text)=>setAdditionalNextPassword(text)}/>
        <Text style={{color: warnNotCorrectPasswordError? '#D00f':'#D000', fontSize: 11, marginLeft: 15, marginVertical: 5}}>새 비밀번호와 동일하게 입력해주세요.</Text>
      </View>
      <View style={{margin: 20}}>
        <TouchableOpacity onPress={()=>{Alert.alert('비밀번호가 변경되었습니다.', '다시 로그인 해주세요.', [{text: '확인'}])}} style={{borderRadius: 1, backgroundColor: '#CCC', alignItems: 'center', justifyContent: 'center', flex:1}}>
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
        <Text style={{marginLeft:40, marginVertical: 4, marginBottom: 10, fontSize: 20, fontWeight: 'bold'}}>기간        <Text style={{fontSize: 13, fontWeight: 'normal'}}>{this.props.startDate} ~ {'2020.6.10'}</Text></Text>
      </View>
    );
  }
}
function UserHistoryPage({navigation}) {
  return (
    <ScrollView style={{flex:1, flexDirection: 'column', backgroundColor: '#fff'}}>
      <Text style={{margin:20, fontWeight:'bold', fontSize: 20}}>나의 구독 내역</Text>
      <SubscribeContentBoxComponent title={'구독 상품명1'} count={51} startDate={'2020.3.12'}/>
      <SubscribeContentBoxComponent title={'구독 상품명2'} count={5} startDate={'2020.4.12'}/>
      <SubscribeContentBoxComponent title={'구독 상품명3'} count={123} startDate={'2020.3.30'}/>
      <SubscribeContentBoxComponent title={'구독 상품명4'} count={17} startDate={'2020.7.28'}/>
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
      <TouchableOpacity style={{height: 90, justifyContent: 'center', borderBottomWidth: 1, borderColor: '#DDD'}} onPress={()=>navigation.push('Notice')}>
        <Text style={{marginLeft: 30, fontSize: 20}}>공지사항</Text>
      </TouchableOpacity>
      <TouchableOpacity style={{height: 90, justifyContent: 'center'}} onPress={()=>navigation.push('Question')}>
        <Text style={{marginLeft: 30, fontSize: 20}}>문의하기</Text>
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
  const helpMessage = [{
    question: '다이어리를 다운받고 싶어요.',
    answer: '안녕하세요 큐모먼트입니다.\n큐모먼트서비스를 이용해 주셔서 감사합니다. 앞으로도 큐모먼트에 많은 성원 부탁드립니다.\n다이어리 다운로드 방법\n\n1. PDF다운로드 받기\n2. 링크 내보내기'
  }, {
    question: '제목이 너무 길면 어떻게 되는지 알고 싶어요 제목이 너무 길면 어떻게 되는지 알고 싶어요',
    answer: '안녕하세요 큐모먼트입니다.\n큐모먼트서비스를 이용해 주셔서 감사합니다. 앞으로도 큐모먼트에 많은 성원 부탁드립니다.\n다이어리 다운로드 방법\n\n1. PDF다운로드 받기\n2. 링크 내보내기'
  }]

  return (
    <ScrollView style={{flex:1, flexDirection: 'column', marginTop: 10}}>
      <HelpContentComponent question={helpMessage[0].question} answer={helpMessage[0].answer}/>
      <HelpContentComponent question={helpMessage[1].question} answer={helpMessage[1].answer}/>
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
          <View style={{marginLeft: 30, marginBottom: 5, marginTop:10}}>
            <Text>{this.props.message}</Text>
          </View>
        }
      </TouchableOpacity>
    );
  }
}
function NoticePage({navigation}) {
  const noticeMessage = [{
    title: '위치기반 서비스 이용약관 사전 안내',
    date: '2019-03-26',
    message: '안녕하세요 큐모먼트입니다.\n큐모먼트서비스를 이용해 주셔서 감사합니다. 앞으로도 큐모먼트에 많은 성원 부탁드립니다.\n다이어리 다운로드 방법\n\n1. PDF다운로드 받기\n2. 링크 내보내기'
  }, {
    title: '제목이 너무 길면 어떻게 되는지 알고 싶어요 제목이 너무 길면 어떻게 되는지 알고 싶어요',
    date: '2020-07-22',
    message: '안녕하세요 큐모먼트입니다.\n큐모먼트서비스를 이용해 주셔서 감사합니다. 앞으로도 큐모먼트에 많은 성원 부탁드립니다.\n다이어리 다운로드 방법\n\n1. PDF다운로드 받기\n2. 링크 내보내기'
  }]

  return (
    <ScrollView style={{flex:1, flexDirection: 'column', marginTop: 10}}>
      <NoticeContentComponent title={noticeMessage[0].title} date={noticeMessage[0].date} message={noticeMessage[0].message}/>
      <NoticeContentComponent title={noticeMessage[1].title} date={noticeMessage[1].date} message={noticeMessage[1].message}/>
      <NoticeContentComponent title={noticeMessage[0].title} date={noticeMessage[0].date} message={noticeMessage[0].message}/>
      <NoticeContentComponent title={noticeMessage[1].title} date={noticeMessage[1].date} message={noticeMessage[1].message}/>
    </ScrollView>
  );
}
class MyQuestionContentComponent extends React.Component{
  constructor(props){
    super(props);

    this.state = {
      showMessage: false,
      isAnswered: this.props.QuestionMessage.isAnswered,
      title: this.props.QuestionMessage.title,
      message: this.props.QuestionMessage.message,
      answer: this.props.QuestionMessage.answer,
    }
  }

  render(){
    return (
      <TouchableOpacity onPress={()=>{this.setState(previousState => ({showMessage: !previousState.showMessage}))}} style={{flexDirection: 'column', borderColor: '#666', marginHorizontal: 10, marginVertical: 6, borderWidth: 1, borderRadius: 10}}>
        <View style={{flexDirection: 'row'}}>
          <Text style={{alignSelf: 'center', marginLeft: 10, borderWidth: 1, borderRadius: 5, borderColor: this.props.QuestionMessage.isAnswered?'blue':'red', padding:2, color: this.props.QuestionMessage.isAnswered?'blue':'red'}}>{this.props.QuestionMessage.isAnswered?'답변완료':'답변예정'}</Text>
          <Text style={{marginLeft: 15, marginVertical: 16, fontSize: 17, marginRight: 43, textDecorationLine: this.state.showMessage?'underline':'none', fontWeight:this.state.showMessage?'bold':'normal'}}>{this.props.QuestionMessage.title}</Text>
          <MaterialCommunityIcons style={{position: 'absolute', right: 0, marginRight: 15, marginTop: 14}} name={this.state.showMessage? "chevron-up":"chevron-down"} size={30} color="black" />
        </View>
        {this.state.showMessage &&
          <View style={{marginLeft: 30, marginBottom: 10, marginTop:10, marginRight: 30}}>
            <Text style={{fontSize:20, fontWeight:'bold', marginVertical: 10}}>문의 내용</Text>
            <Text style={{marginBottom: 10}}>{this.props.QuestionMessage.message}</Text>
            <Text style={{fontSize:20, fontWeight:'bold', marginVertical: 10}}>답변 내용</Text>
            <Text>{this.props.QuestionMessage.answer}</Text>
          </View>
        }
      </TouchableOpacity>
    );
  }
}
class MyQuestionFormComponent extends React.Component{
  constructor(props){
    super(props);
    this.state={
      type: '',
      title: '',
      message: '',
    }
  }

  render(){
    return (
      <View style={{flex:1, flexDirection: 'column', marginHorizontal: 20, marginVertical: 10}}>
        <TouchableOpacity style={{borderWidth: 1, borderRadius: 10, justifyContent: 'center', padding: 8}} onPress={()=>Alert.alert('미구현!', '드롭박스기능 공부하여 추가할 예정')}>
          <Text>문의 유형 선택</Text>
        </TouchableOpacity>
        <TextInput style={{borderWidth: 1, borderRadius: 10, padding:15, marginVertical: 20}}  value={this.title} placeholder={'문의 제목'} onChange={(text)=>this.setState(preState=>({title: text}))}/>
        <TextInput multiline style={{borderWidth: 1, borderRadius: 10, padding:15, minHeight: 230}}  value={this.message} placeholder={'문의 내용'} onChange={(text)=>this.setState(preState=>({message: text}))}/>
        <Text style={{fontSize: 10, marginVertical: 20}}>문의 내용 등록 시<Text style={{color:'blue'}} onPress={()=>Alert.alert('미구현!', '개인정보 처리방침 페이지로 링크 연결 예정')}> 개인정보 처리방침</Text>을 확인하였으며 동의합니다.</Text>
        <TouchableOpacity style={{marginTop: 45, marginBottom: 25, paddingVertical: 8, borderWidth: 1, backgroundColor: '#545', justifyContent: 'center', alignItems: 'center'}} onPress={()=>Alert.alert('미구현!', '문의정보를 받아와 저장하는 기능 구현 예정')}>
          <Text style={{color:'white', fontSize: 20}}>문의하기</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
function QuestionPage({navigation}) {
  const [myQuestionTab, setMyQuestionTab] = React.useState(true);
  const QuestionMessage = [{
    isAnswered: false,
    title: '문의 제목1',
    message: '안녕하세요 큐모먼트입니다.\n큐모먼트서비스를 이용해 주셔서 감사합니다. 앞으로도 큐모먼트에 많은 성원 부탁드립니다.\n다이어리 다운로드 방법\n\n1. PDF다운로드 받기\n2. 링크 내보내기',
    answer: '안녕하세요 큐모먼트입니다.\n큐모먼트서비스를 이용해 주셔서 감사합니다. 앞으로도 큐모먼트에 많은 성원 부탁드립니다.\n다이어리 다운로드 방법\n\n1. PDF다운로드 받기\n2. 링크 내보내기',
  },{
    isAnswered: true,
    title: '문의 제목2',
    message: '안녕하세요 큐모먼트입니다.\n큐모먼트서비스를 이용해 주셔서 감사합니다. 앞으로도 큐모먼트에 많은 성원 부탁드립니다.\n다이어리 다운로드 방법\n\n1. PDF다운로드 받기\n2. 링크 내보내기',
    answer: '안녕하세요 큐모먼트입니다.\n큐모먼트서비스를 이용해 주셔서 감사합니다. 앞으로도 큐모먼트에 많은 성원 부탁드립니다.\n다이어리 다운로드 방법\n\n1. PDF다운로드 받기\n2. 링크 내보내기',
  },{
    isAnswered: true,
    title: '문의 제목3',
    message: '안녕하세요 큐모먼트입니다.\n큐모먼트서비스를 이용해 주셔서 감사합니다. 앞으로도 큐모먼트에 많은 성원 부탁드립니다.\n다이어리 다운로드 방법\n\n1. PDF다운로드 받기\n2. 링크 내보내기',
    answer: '안녕하세요 큐모먼트입니다.\n큐모먼트서비스를 이용해 주셔서 감사합니다. 앞으로도 큐모먼트에 많은 성원 부탁드립니다.\n다이어리 다운로드 방법\n\n1. PDF다운로드 받기\n2. 링크 내보내기',
  }];

  return (
    <View style={{flex:1, flexDirection: 'column', backgroundColor: 'white'}}>
      <View style={{marginHorizontal: 15, marginVertical: 5, flexDirection: 'row', justifyContent: 'space-between', borderWidth: 1, borderRadius: 21, borderColor: '#AAA', backgroundColor: '#AAA'}}>
        <TouchableOpacity onPress={()=>setMyQuestionTab(true)}>
          <Text style={{borderWidth: 0, borderRadius: 20, fontSize: 18, fontWeight:'bold', paddingVertical: 10, paddingHorizontal: 30, backgroundColor: myQuestionTab?'white':'#AAA'}}>내 문의 내역</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>setMyQuestionTab(false)}>
          <Text style={{borderWidth: 0, borderRadius: 20, fontSize: 18, fontWeight:'bold',  paddingVertical: 10, paddingHorizontal: 40, backgroundColor:  myQuestionTab?'#AAA':'white'}}>문의하기</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={{flex:1, flexDirection: 'column', marginTop: 15}}>
      {myQuestionTab ?
        <View>
          <MyQuestionContentComponent  QuestionMessage={QuestionMessage[0]}/>
          <MyQuestionContentComponent  QuestionMessage={QuestionMessage[1]}/>
          <MyQuestionContentComponent  QuestionMessage={QuestionMessage[2]}/>
        </View> :
        <MyQuestionFormComponent/>
      }
      </ScrollView>
    </View>
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
      <Stack.Screen
        name="Question"
        options={{
          title: "문의",
          headerTitleAlign: 'center',
          headerTitleStyle: {fontWeight: 'bold', fontSize: 20},
          headerBackTitleVisible: false,
          headerTintColor: 'black',
          cardStyle: {backgroundColor: 'white'},
          }}
        component={QuestionPage}
      />
    </Stack.Navigator>
  );
}

// 메인 앱
export default function App() {
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
            login: action.autoConfig,
          };
        case 'FIRST_LOGIN':
          return {
            ...prevState,
            userToken: null,
            isLoading: false,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
            login: action.login,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
            login: false,
          };
        case 'INTRO_SKIP':
          return {
            ...prevState,
            userToken: 'dummy-auth-token',
            login: false,
          };
        case 'SET_USERNAME':
          return {
            ...prevState,
            username: action.username,
            login: true,
          };
        case 'SET_DIARY_EDIT_MODE':
          return {
            ...prevState,
            diaryMode: action.diaryMode,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
      login: false,
      username: null,
      diaryMode: false,
    }
  );  // 유저 인증 정보
  React.useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let userToken;

      try {
        userToken = await AsyncStorage.getItem('userToken');
      } catch (e) {
        // Restoring token failed
      }

      // After restoring token, we may need to validate it in production apps

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      //dispatch({ type: 'RESTORE_TOKEN', token: userToken });
    };

    bootstrapAsync();
  }, []); // 초기화시 데이터 로딩 여기서
  const authContext = React.useMemo(
    () => ({
      signIn: async data => {
        // In a production app, we need to send some data (usually username, password) to server and get a token
        // We will also need to handle errors if sign in failed
        // After getting token, we need to persist the token using `AsyncStorage`
        // In the example, we'll use a dummy token
        console.log('singIn:' + data);

        dispatch({ type: 'SIGN_IN', token: 'dummy-auth-token', login: data[2] });
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
  const [notification, setNotification] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [loaded, error] = Font.useFonts({
    NanumGothic: require('./assets/font/NanumGothic.ttf'),
  });

  const handleNotification = (notify) => {
    setNotification(notify);
    console.log('notification', notification);
  };

  const registerForPushNotificationsAsync = async () => {
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    if (status !== 'granted') {
      Alert.alert('알림 권한 획득 실패!');
      return;
    }
    console.log('status: ', status);
    let token = await Notifications.getExpoPushTokenAsync();
    console.log('token: ', token);
    // Defined in following steps
    Notifications.addListener(handleNotification);
    console.log('registerForPushNotificationsAsync up');

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
          username: 'warly', //임의값
          name: 'Dan Ward'   //임의값
        },
      }),
    });
    // Defined in next step

  };

  useEffect(()=>{
    console.log('useEffect registerForPushNotificationsAsync');
    registerForPushNotificationsAsync();
  }, []);


  const handleChangeText = (text) => {
    setMessageText(text);
  }

  const sendMessage = async () => {
    fetch(MESSAGE_ENPOINT, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: messageText,
      }),
    });
    console.log('send Message: ', messageText);
    setMessageText('');
  }


  return (
    <AuthContext.Provider value={authContext}>
      {state.isLoading === true ? (
        <View style={{flex:1, alignItems: 'center', justifyContent: 'center'}}>
          <Text>스플래쉬 화면</Text>
          <Text> 유저 정보 여부에 따라 다음으로 분기 </Text>
          <TouchableOpacity style={{margin: 10}} onPress={()=>{dispatch({ type: 'RESTORE_TOKEN', token: 'dummy-auth-token', autoConfig: true });}}>
            <Text> - 저장된 계정 있음(자동 로그인)</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{margin: 10}} onPress={()=>{dispatch({ type: 'RESTORE_TOKEN', token: 'dummy-auth-token', autoConfig: false });}}>
            <Text> - 저장된 계정 있음(자동 X)</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{margin: 10}} onPress={()=>{dispatch({ type: 'RESTORE_TOKEN', token: null, autoConfig: false });}}>
            <Text> - 저장된 계정 없음</Text>
          </TouchableOpacity>
          <View style={{}}>
            <TextInput
              value={messageText}
              onChangeText={handleChangeText}
              style={{borderWidth: 1, marginTop: 30}}
            />
            <TouchableOpacity
              style={{padding: 15}}
              onPress={sendMessage}
            >
              <Text style={{fontSize: 20}}>Send</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : state.userToken === null ? (
        <NavigationContainer>
          <Tab.Navigator backBehavior={null} tabBarOptions={{
            tabStyle: {backgroundColor: '#FFF', height: 0},
            showIcon: false,
            showLabel: false,
          }}>
            <Tab.Screen name="Intro1" component={IntroScreen1} />
            <Tab.Screen name="Intro2" component={IntroScreen2} />
            <Tab.Screen name="Intro3" component={IntroScreen3} />
            <Tab.Screen name="Intro4" component={IntroScreen4} />
          </Tab.Navigator>
        </NavigationContainer>
      ) : state.login === false ? (
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen options={{cardStyle: {backgroundColor: 'white'}, headerShown: false}} name="SignIn" component={SignInScreen}/>
            <Stack.Screen options={{cardStyle: {backgroundColor: 'white'}, headerShown: true, headerTitle: '비밀번호 찾기', headerTitleAlign: 'center'}} name="FindPassword" component={FindPasswordScreen}/>
            <Stack.Screen options={{cardStyle: {backgroundColor: 'white'}, headerShown: false}} name="SignUp" component={SignUpScreen}/>
            <Stack.Screen options={{cardStyle: {backgroundColor: 'white'}, headerShown: false}} name="SetUsername" component={UserNameSettingScreen}/>
            <Stack.Screen options={{cardStyle: {backgroundColor: 'white'}, headerShown: true, headerTitle: '이용약관', headerTitleAlign: 'center'}} name="InformTermsOfUse" component={InformTermsOfUseScreen}/>
            <Stack.Screen options={{cardStyle: {backgroundColor: 'white'}, headerShown: true, headerTitle: '개인정보 처리방침', headerTitleAlign: 'center'}} name="InformPersonalInformationProcessingPolicy" component={InformPersonalInformationProcessingPolicyScreen}/>
          </Stack.Navigator>
        </NavigationContainer>
      ) : (
        <NavigationContainer>
          <Drawer.Navigator drawerPosition='right' drawerStyle={{backgroundColor: '#CCC'}} drawerContent={props => <CustomDrawerContent {...props}/>}>
            <Drawer.Screen name='sidebar' component={MainStackHomePage} options={{swipeEnabled: false}}/>
          </Drawer.Navigator>
        </NavigationContainer>
      )}
    </AuthContext.Provider>
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
