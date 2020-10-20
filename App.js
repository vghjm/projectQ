import React, { useRef, useState, useCallback, useEffect, useContext} from 'react';
import { AppState, Vibration, Dimensions , ActivityIndicator, Platform,TouchableHighlight, TouchableWithoutFeedback, AsyncStorage, ImageBackground, Text, View, StyleSheet, TouchableOpacity, TextInput, CheckBox, KeyboardAvoidingView, Alert, Button, ScrollView, SafeAreaView, Image }
from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, getFocusedRouteNameFromRoute, useFocusEffect, useNavigation } from '@react-navigation/native';
import { createDrawerNavigator, createNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem, } from '@react-navigation/drawer';  //  https://reactnavigation.org/docs/drawer-based-navigation/
import { GiftedChat, Bubble , Send, InputToolbar, Time, Day, Composer } from 'react-native-gifted-chat' // https://github.com/FaridSafi/react-native-gifted-chat
import { Ionicons, MaterialCommunityIcons, Feather, FontAwesome, EvilIcons, AntDesign, MaterialIcons, Octicons }
from '@expo/vector-icons'; // https://icons.expo.fyi/
import * as ImagePicker from 'expo-image-picker';      // https://docs.expo.io/versions/latest/sdk/imagepicker/
// import Constants from 'expo-constants';
import DateTimePicker from '@react-native-community/datetimepicker'; // https://github.com/react-native-community/datetimepicker
//import { Notifications } from 'expo'; // https://docs.expo.io/versions/latest/sdk/notifications/
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import Moment from 'moment';
import  "moment/locale/ko";
require('dayjs/locale/ko');
Moment.locale("ko");
import _ from 'lodash'; // https://lodash.com/docs
import * as Font from 'expo-font';          // https://docs.expo.io/versions/latest/sdk/font/
import uuid from 'react-native-uuid';       // https://www.npmjs.com/package/react-native-uuid
// import * as Random from 'expo-random';
import Hyperlink from 'react-native-hyperlink'; // https://www.npmjs.com/package/react-native-hyperlink
import * as WebBrowser from 'expo-web-browser';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import Draggable from 'react-native-draggable'; // https://github.com/tongyy/react-native-draggable
import * as Animatable from 'react-native-animatable'; // https://github.com/oblador/react-native-animatable
import { SwipeListView } from 'react-native-swipe-list-view'; // https://www.npmjs.com/package/react-native-swipe-list-view
//import * as Haptics from 'expo-haptics';

// my component
import InlineTextInput from './component/InlineTextInput';
import LoginNavigation from './component/LoginForm';
import {ThemeContext, AuthContext, ControllContext, SystemContext, UserDataContext, ProductDataContext, SubscribeDataContext, ChatroomDataContext, DiaryDataContext, InformDataContext, GlobalDataContext} from './component/Context';
import {HTTP, PUSH_REGISTRATION_ENDPOINT} from './component/utils/constants';
import IntroNavigation from './component/IntroForm';
import * as Connection from './component/ServerConnect';
import * as Storage from './component/StorageControll';
import * as PushNotification from './component/PushNotification';
import CustomDrawerContent from './component/CustomDrawerContent';
import MainStackHomePage from './component/MainStackHomePage';
import * as TestData from './testData';
import { logo, subOn, subOff } from './component/utils/loadAssets';
import * as DefaultDataType from './component/utils/DefaultDataType';
import { chooseRandomly } from './component/utils/utils';

const Drawer = createDrawerNavigator();

var dataList = [];
var informData = {
  introduction: [],
  help: [],
  notice: [],
};
var pushList = [];
var userData;
var pushCount = 0;

const testAccount = {
  use: true,
  email: '77eric@naver.com',
  password: '!!gmltjd',
}

// 기기 화면 사이즈
const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;
const ASSUME_SAME_CHAT_TIME = 1; // 채팅 시 같은 메세지로 판정하는 시간간격 (단위 분)
const DEBUG_PRINT = true;
// 컨트롤 변수
var global_p_id = 0;               // 채팅창 사이드 메뉴에서 다른 상품정보로 보내기 위한 상품 id 값
var global_y = 0;         // 다이어리리스트 스크린의 스크롤 값

// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true,
//     shouldPlaySound: false,
//     shouldSetBadge: false,
//   }),
// });


function getReply(data, popupPushMessage, navigation, updateF){
  // console.log('getReply', data);
  // setTimeout(() => {
  //   let ansMessage = {
  //     _id: uuid.v4(), text: data.product.ansList[data.chatroom.lastPushed.questIndex].content, createdAt: Moment(),
  //     user: { _id:2, avatar: data.product.imageSet.avatarImg.uri?? data.product.imageSet.avatarImg},
  //   };
  //   data.chatroom.newItemCount += 1;
  //   data.chatroom.lastMessageTime = Moment();
  //   data.chatroom.chatmessageList.unshift(_.cloneDeep(ansMessage));
  //   data.chatroom.lastMessage = ansMessage.text;
  //   data.chatroom.lastPushed.ansMessage = _.cloneDeep(ansMessage);
  //   popupPushMessage({
  //     image: data.product.imageSet.thumbnailImg,
  //     title: data.product.title,
  //     text: ansMessage.text,
  //     onPress: ()=>navigation.navigate('chatroom', {id: data.id, data:data}),
  //     lastPushed: Moment(),
  //     isPushShowed: true,
  //   });
  //   console.log('getReply ansMessage', ansMessage);
  //   updateF();
  //   return ansMessage;
  //   //setMessages(previousMessages => GiftedChat.append(previousMessages, ansMessage));
  // }, 5 * 1000);
  // return 'aa';
}

async function warningPermission(){
  const push = await Permissions.askAsync(Permissions.NOTIFICATIONS);
  const camera = await Permissions.askAsync(Permissions.CAMERA_ROLL);

  if(push.status !== 'granted' && camera.status !== 'granted'){
    Alert.alert('원활한 앱 진행을 위하여 다음 권한이 필요합니다.', ' - 카메라 권환\n - 푸시알림 권한');
  }else if(push.status !== 'granted'){
    Alert.alert('원활한 앱 진행을 위하여 다음 권한이 필요합니다.', ' - 푸시알림 권한');
  }else if(camera.status !== 'granted'){
    Alert.alert('원활한 앱 진행을 위하여 다음 권한이 필요합니다.', ' - 카메라 권한');
  }
}

// 태스트 모듈
import loginTest from './component/connect/login';
import downloadProductDataTest from './component/connect/downloadProductData';
import downloadSubscribeData from './component/connect/downloadSubscribeData';
import downloadDiaryData from './component/connect/downloadDiaryData';
import subscribeSetting from './component/connect/subscribeSetting';
import deleteDiaryFromServer from './component/connect/deleteDiaryFromServer';
import changePushTime from './component/connect/changePushTime';
import diaryBackUp from './component/connect/diaryBackup';
import requestChatReply from './component/connect/requestChatReply';

export default function App() {
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'END_LOADING_FIRST_LOGIN':
          // 첫 실행 -> 인트로 화면 띄움
          return {
            ...prevState,
            devMode: false,
            nowLoading: false,
          };
        case 'END_LOADING_LOGIN_PAGE':
          // 로그인 화면으로 이동
          return {
            ...prevState,
            devMode: false,
            nowLoading: false,
            intro: false,
          };
        case 'END_LOADING_RESTORE_DATA':
          // 자동로그인, 데이터 로딩 후 바로 사용화면으로 이동
          return {
            ...prevState,
            devMode: false,
            nowLoading: false,
            intro: false,
            login: true,
            token: action.token,
          };
        case 'LOGIN':
          // 유저정보 받아 사용자 화면으로 이동
          return {
            ...prevState,
            devMode: false,
            nowLoading: false,
            intro: false,
            login: true,
            token: action.token,
          };
        case 'SIGN_OUT':
          // 로그인 화면으로 이동
          return {
            ...prevState,
            login: false,
          };
        case 'INTRO_SKIP':
          // 인트로 스킵
          return {
            ...prevState,
            intro: false,
          };
        case 'NO_AUTH':
          // 유저정보 갱신용
          return {
            ...prevState,
            noAuth: true,
            nowLoading: false,
          };
      }
    },
    {
      devMode: true,
      noAuth: false,
      nowLoading: true,
      intro: true,
      login: false,
      token: '',
    }
  );  // 유저 인증 정보
  const authContext = React.useMemo(
    () => ({
      signIn: async data => {
        console.log(`SignIn email:${data.email}, password:${data.password}`);
        let reply = {ok: false, data: null, message: ''};
        let response = await Connection.login(data.email, data.password);

        if(response.ok){
          let username = response.data.username;
          let pushRegistered = await registerForPushNotificationsAsync({email: data.email, username: username});

          if(pushRegistered.ok){
            reply.ok = true;
            reply.data = response.data;
          }else{
            reply.message = pushRegistered.message;
          }
        }else{
          reply.message = response.message;
        }

        return reply;
      },
      login: async data => {
        console.log('token:', data.token);
        console.log('login start');
        userData = await Storage.updateDataSet(dataList, data);
        //registerForPushNotificationsAsync(userData);
        console.log('login end');
        dispatch({ type: 'LOGIN', token:data.token });
      },
      signOut: () => dispatch({ type: 'SIGN_OUT' }),
      findpw: async (email) => {
        return await Connection.findpw(email);
      },
      signUp: async data => {
        console.log(`Signup email:${data.email}, password:${data.password}, username:${data.username}`);
        return await Connection.signUp(data.email, data.password, data.username);
      },
      checkEmail: async email => {
        console.log(`checkEmail email:${email}`);
        return await Connection.checkEmail(email);
      },
      introSkip: () => dispatch({type: 'INTRO_SKIP'}),
      loading: async () => {
        await bootstrapAsync();
      }
    }),
    [state]
  );  // 유저 인증 함수 등록
  const systemContext = React.useMemo(
    () => ({
      function: () => {},
      popupPushMessage: (data, time) => popupPushMessage(data, time),
      getReply: (data, navigation) => getReply(data, systemContext.popupPushMessage, navigation, systemContext.doUpdate),
      getUserData: () => {return userData},
      getProductData: (id) => {return dataList[dataList.findIndex(obj => obj.id===id)]},
      getProductDataList: () => {return dataList},
      getInformData: () => {return informData},
      getPushData: () => {return pushData},
      getGlobalY: () => {return global_y},
      getGlobalP: () => {return global_p_id},
      updateUserData: data => userData = data,
      updateProductData: data => {
        let index = dataList.findIndex(obj => obj.id === data.id);
        dataList[index] = data;
      },
      updateProductDataAll: data => dataList = data,
      updataInformData: data => informData = data,
      updatePushData: data => pushData = data,
      setGlobalP: data => global_p_id = data,
    }),
    []
  );

  // foreground 푸시 처리
  const handleNotification1 = ({request}) => {
    const content = request.content;
    const diaryID = content.data.diary_ID;
    const productID = content.data.product_ID;
    const question = content.data.question;
    const questionID = content.data.question_ID;
    const title = content.title;
    console.log(`\n notify receive  content\n`, content);

    // 푸시알림 처리,
    const productInfo = myProductDataContext[myProductDataContext.findIndex(product => product.p_id === productID)];
    setMyChatroomDataContext(myChatroomDataContext.map(chatroom => {
      if(chatroom.p_id === productID){
        if(chatroomInfo.getPushAlarm){
          popupPushMessage({
            image: productInfo.thumbnailImg,
            title: productInfo.title,
            text: question,
            lastPushed: Moment(),
            isPushShowed: true,
          });
        }

        chatroom.chatMessageList.unshift({ _id: uuid.v4(), text: question, createdAt: Moment(),
          user: { _id:2, avatar: productInfo.thumbnailImg},
        });
        chatroom.newItemCount += 1;
        chatroom.lastPushed = {
          pushTime: Moment(),
          q_id: questionID,
          solved: true,
        };
      }

      return chatroom;
    }));
  };

  // 푸시 알림 터치 시
  const handleNotification2 = (notify) => {
    setNotification(notify);
    console.log('notification2', notify);
  };
  const registerForPushNotificationsAsync = async (data) => {
    const { status } = await Permissions.getAsync(Permissions.NOTIFICATIONS);

    if (status !== 'granted') {
      const { _status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      alert(`${_status}`);
      if (_status !== 'granted') {
        return;
      }
    }

    const token = await Notifications.getExpoPushTokenAsync();

    Notifications.addNotificationReceivedListener(handleNotification1);
    Notifications.addNotificationResponseReceivedListener(handleNotification2);
    console.log(`registerForPushNotificationsAsync\ntoken: ${token}\nemail: ${data.email}, username: ${data.username}`);

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
          email: data.email,
          username: data.username,
        },
      }),
    });
  };

  // 데이터 로딩
  const [theme, setTheme] = useState({
    default: '#E6E5EB',
    light: ['#e8efd9','#d7e4bd', '#b9c89c', '#7C9151', '#48375F'],
    red: '#5F5F5F',
    logo: logo,
  });
  const [loaded, error] = Font.useFonts({
    UhBeeSeulvely: require('./assets/font/UhBeeSeulvely.ttf'),
    NanumMyeongjo: require('./assets/font/NanumMyeongjo.ttf'),
    NanumMyeongjo_bold: require('./assets/font/NanumMyeongjoExtraBold.ttf'),
  });
  const [loadProductData, setLoadProductData] = useState(false);
  const [updateCacheData, setUpdateCacheData] = useState({
    autoLogin: false,
    id: null,
    password: null,
    isFirstLogin: null,
    isReady: false,
  });
  const bootstrapAsync = async () => {
    console.log('\n @ bootstrapAsync\n\t시작시간 : ', Moment().format('LTS'));

    warningPermission();
    Storage.updateProductData()
      .then(response => {
        if(response.ok) {
          //console.log('updateProductData: success\n', response.data);
          dataList = response.data;
          console.log('\tupdateProductData: true');
          setLoadProductData(true);
        }else{
          console.log('\tupdateProductData: false');
        }
      });

    Storage.updateCacheData()
      .then(cache => {
        let autoLogin = false;
        let email = null;
        let password = null;
        let isFirstLogin = true;
        if(cache.ok){
          autoLogin = true;
          email = cache.data.email;
          password = cache.data.password;
          //dispatch({type: 'END_LOADING_RESTORE_DATA', action: token});
        }else{
          let isFirstLogin = cache.data.isFirstLogin;
          //isFirstLogin ? dispatch({type: 'END_LOADING_FIRST_LOGIN', action: token}) : dispatch({type: 'END_LOADING_LOGIN_PAGE', action: token});
        }
        console.log(`\temail: ${email}, password: ${password}\n\tautoLogin: ${autoLogin}, isFirstLogin: ${isFirstLogin}`);
        setUpdateCacheData({
          autoLogin: autoLogin,
          email: email,
          password: password,
          isFirstLogin: isFirstLogin,
          isReady: true,
        });
      });
  };

  useEffect(() => {
    let move = null;
    let cache = null;
    if(loadProductData && updateCacheData.isReady && loaded){
      if(updateCacheData.autoLogin === true || testAccount.use){
        move = 'END_LOADING_RESTORE_DATA';
        if(testAccount.use){
          cache = {
            email: testAccount.email,
            password: testAccount.password,
          }
        }else{
          cache = {
            email: updateCacheData.email,
            password: updateCacheData.password,
          }
        }
        defaultLogin(cache.email, cache.password);
      }else if(updateCacheData.isFirstLogin === true){
        move = 'END_LOADING_FIRST_LOGIN';
        dispatch({ type: move});
      }else{
        move = 'END_LOADING_LOGIN_PAGE';
        dispatch({ type: move});
      }
    }}, [loadProductData, updateCacheData, loaded]);

  // 다이얼 백업함수
  const diaryBackupTrial = async () => {
    if(!state.login){
      console.log('\n\n 로그인 없는 다이어리 저장시도, 캔슬!\n');
      return;
    }

    let response = await diaryBackUp({
      debug: DEBUG_PRINT,
      token: myUserDataContext.token,
      backupDiaryList: myDiaryDataContext.map(diary => {
        return {
          d_ID: diary.d_id,
          p_ID: diary.p_id,
          p_name: diary.title,
          chatedperiod_start: diary.makeTime.format('YYYYMMDD'),
          chatedperiod_end: Moment().format('YYYYMMDD'),
          chatedamount: diary.totalUpdateCount,
          linkname: 'nolink',
          color: diary.color,
          position: diary.pos,
          diaryMessage: diary.diarymessageList.map(diaryMessage => {
            return {
              dm_ID: diaryMessage._id,
              chatedtime: diaryMessage.createdAt,
              chatcontent: diaryMessage.islagacy
                ? diaryMessage.text
                : diaryMessage.linkedMessageList.reduce((prevText, nowText, i) => {
                  return prevText + ' ' + nowText;
                }),
            };
          }),
        }
      })
    });

    if(response.ok) console.log('  다이어리 백업 성공');
    else console.log('  다이어리 백업 실패', response.message);
  };

  // 백그라운드 및 Inactive 감지 함수
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  useEffect(() => {
    AppState.addEventListener("change", _handleAppStateChange);
    //bootstrapAsync();
    return () => {
      AppState.removeEventListener("change", _handleAppStateChange);
    };
  }, []);
  useEffect((appStateVisible) => { // 백그라운드 시 다이어리 서버에 저장함
    if(appState.current === 'background') diaryBackupTrial();
  }, [appStateVisible]);
  const _handleAppStateChange = (nextAppState) => {
    if(appState.current.match(/inactive|background/) && nextAppState === "active"){
      console.log("App has come to the foreground!");
    }

    appState.current = nextAppState;
    setAppStateVisible(appState.current);
    console.log("AppState", appState.current);
  };

  // 자동 로그인 테스트 용
  const updateFunction = async () => {
    console.log('update Start');
    bootstrapAsync();
  };
  const defaultLogin = async (email, password) => {
    console.log('자동 로그인 ~');
    const {signIn, login} = authContext;

    let response = await signIn({email: email, password:password});
    if(response.ok) {
      login({token: response.data.token, username: response.data.username, email: email, password: password});
    }else {
      userData = _.cloneDeep(TestData.userTestData);
      dispatch({ type: 'LOGIN', token:data.token });
    }
  };

  // 푸시메세지 띄우기
  const [pushContext, setPushContext] = useState({
    image: null,
    title: null,
    text: null,
    onPress: null,
    lastPushed: Moment(),
    isPushShowed: false,
  });
  const popupPushMessage = async (data, time) => {
    let timer = time??800;
    setTimeout(() => {
      setPushContext(data??{
        image: null,
        title: null,
        text: null,
        lastPushed: Moment(),
        isPushShowed: true,
      });

      Vibration.vibrate();
      pushCount++;
      setTimeout(() => {
        pushCount--;
        if(pushCount <= 0) setPushContext({
          image: null,
          title: null,
          text: null,
          lastPushed: Moment(),
          isPushShowed: false,
        });
      }, 4800);
    }, timer);
  }
  const onPressPushNotification = () => {
    setPushContext({
      image: null,
      title: null,
      text: null,
      lastPushed: Moment(),
      isPushShowed: false,
    });
  }

  // 새로운 데이터 타입 state
  const [myUserDataContext, setMyUserDataContext] = useState(DefaultDataType.userDataType);
  const [myProductDataContext, setMyProductDataContext] = useState(DefaultDataType.productDataType);
  const [mySubscribeDataContext, setMySubscribeDataContext] = useState(DefaultDataType.subscribeDataType);
  const [myChatroomDataContext, setMyChatroomDataContext] = useState(DefaultDataType.chatroomDataType);
  const [myDiaryDataContext, setMyDiaryDataContext] = useState(DefaultDataType.diaryDataType);
  const [myInformDataContext, setMyInformDataContext] = useState(DefaultDataType.informDataType);
  const [globalDataContext, setGlobalDataContext] = useState(DefaultDataType.globalDataType);

  const controllContext = {
      setFocusChatroomPID: (p_id) => { // 채팅방 확인 함수
        setGlobalDataContext(prev => {
          prev.focusChatroomPID = p_id;
          return prev;
        });
        if(p_id===-1) return;
        setMyChatroomDataContext(myChatroomDataContext.map(chatroom => {
          if(chatroom.p_id === p_id) chatroom.newItemCount = 0;
          return chatroom;
        }));
      },
      setDiaryPositionEditMode: (mode) =>{ // 다이어리 위치편집 버튼
        setGlobalDataContext(prev => {
          prev.focusChatroomPID = 0;
          prev.diaryPositionEditMode = mode;
          return prev;
        })
      },
      setDiaryScreenHeight: (height) => { // 다이어리 화면의 시작높이 등록
        setGlobalDataContext(prev => {
          prev.diaryScreenHeight = height;
          return prev;
        });
      },
      alarmSettingChanger: (p_id) => { // 푸시알람 수신설정 변경
        //console.log('alarmSettingChanger : ', p_id);
        setMyChatroomDataContext(myChatroomDataContext.map(chatroom => {
          if(chatroom.p_id === p_id) chatroom.getPushAlarm = !chatroom.getPushAlarm;
          return chatroom;
        }))
      },
      showState: () => showState(),
      changePosHandler: (start, end) => { // 다이어리 위치변경
        let endPos = myDiaryDataContext.length;
        if(end > endPos){
          setMyDiaryDataContext(myDiaryDataContext.map(diary => {
            if(diary.pos > start) diary.pos -= 1;
            else if(diary.pos === start) diary.pos = endPos;
            return diary;
          }));
        }else{
          setMyDiaryDataContext(myDiaryDataContext.map(diary => {
            if(diary.pos === start) diary.pos = end;
            else if(diary.pos === end) diary.pos = start;
            return diary;
          }));
        }
      },
      eraseChatroom: (p_id) => { // 채팅방 제거함수
        // 구독 제거
        if(mySubscribeDataContext.some(subscribe => subscribe.p_id === p_id)){
          const product = myProductDataContext[myProductDataContext.findIndex(product => product.p_id === p_id)];
          const subscribe = mySubscribeDataContext[mySubscribeDataContext.findIndex(subscribe => subscribe.p_id === p_id)];
          controllContext.subscribeOffHandler(product, subscribe);
        }

        // 채팅방 제거
        setMyChatroomDataContext(myChatroomDataContext.filter(chatroom => chatroom.p_id !== p_id));
      },
      eraseDiary: async (diary) => { // 다이어리 제거함수
        const nowPos = diary.pos;
        const p_id = diary.p_id;

        // 서버 다이어리 삭제 요청
        let response = await deleteDiaryFromServer({
          token: myUserDataContext.token,
          d_id: diary.d_id,
          debug: DEBUG_PRINT,
        });
        if(!response.ok){
          Alert.alert('다이어리 삭제 에러', response.message);
          return;
        }

        //채팅방 제거
        controllContext.eraseChatroom(p_id);

        // 다이어리 제거 & 위치 재조정
        setMyDiaryDataContext(myDiaryDataContext
          .filter(diary => diary.p_id !== p_id)
          .map(diary => {
            if(diary.pos > nowPos) diary.pos -= 1;
            return diary;
        }));
      },
      subscribeOffHandler: async (product, subscribe) => { // 구독 취소 함수
        // 서버에 구독취소 신청
        let response = await subscribeSetting({
          token: myUserDataContext.token,
          title: product.title,
          p_id: product.p_id,
          s_id: subscribe.s_id,
          pushStartTime: subscribe.pushStartTime,
          pushEndTime: subscribe.pushEndTime,
          pushType: product.pushType,
          isSubscribe: false,
          debug: DEBUG_PRINT
        });
        console.log(' 푸시 해제 \n', subscribe);
        if(!response.ok){
          Alert.alert('구독취소에 실패하였습니다.', 'ERROR: 서버연결 실패');
          return;
        }

        // 구독상태 제거
        setMySubscribeDataContext(mySubscribeDataContext.filter(mySubscribe => mySubscribe.p_id!==subscribe.p_id));
      },
      subscribeOnHandler: async (product, startTime, endTime, navigation) => { // 구독 신청 함수
        // 서버에 구독 신청
        let s_id = uuid.v4();
        let response = await subscribeSetting({
          token: myUserDataContext.token,
          title: product.title,
          p_id: product.p_id,
          s_id: s_id,
          pushStartTime: startTime,
          pushEndTime: endTime,
          pushType: product.pushType,
          isSubscribe: true,
          debug: DEBUG_PRINT
        });
        if(!response.ok){
          Alert.alert('구독 등록에 실패하였습니다.', 'ERROR: 서버연결 실패');
          return;
        }

        // 구독상태 추가
        setMySubscribeDataContext(mySubscribeDataContext.concat({p_id: product.p_id, s_id: s_id, pushStartTime: startTime, pushEndTime: endTime}));

        // 채팅방 없으면 추가
        if(!myChatroomDataContext.some(chatroom => chatroom.p_id === product.p_id)){
          controllContext.makeNewChatroom(product, navigation);
        }

        // 다이어리 없으면 추가
        if(!myDiaryDataContext.some(diary => diary.p_id === product.p_id)){
          controllContext.makeNewDiary(product);
        }
      },
      changePushTime: async (p_id, startTime, endTime, pushType) => { // 구독 시간 변경
        // 서버에 푸시시간 변경요청
        let response = await changePushTime({
          token: myUserDataContext.token,
          p_ID: p_id,
          pushStartTime: startTime,
          pushEndTime: endTime,
          pushType: pushType,
          debug: DEBUG_PRINT,
        });
        if(!response.ok) {
          Alert.alert('푸시시간 변경 실패', response.message);
          return ;
        }

        // 푸시시간데이터 변경
        setMySubscribeDataContext(mySubscribeDataContext.map(subscribe => {
          if(subscribe.p_id === p_id){
            subscribe.pushStartTime = startTime;
            subscribe.pushEndTime = endTime;
          }
          return subscribe;
        }));
      },
      makeNewDiary: (product) => { // 기본형 다이어리 새로 만듦
        // 기본형 다이어리 새로 만듦
        setMyDiaryDataContext(myDiaryDataContext.concat({
          p_id: product.p_id, d_id: uuid.v4(), title: product.title, color: Math.floor(Math.random() * 10), pos: myDiaryDataContext.length+1, makeTime: Moment(), totalUpdateCount: 0,
          diarymessageList: []
        }));
      },
      makeNewChatroom: (product, navigation) => { // 새로 채팅방 추가
        // 기본 채팅방 추가
        let questtion = chooseRandomly(product.questionList);
        setMyChatroomDataContext(myChatroomDataContext.concat({
          p_id: product.p_id, getPushAlarm: true, lastCheckedTime: Moment(), newItemCount: 2,
          lastPushed: {pushTime: Moment(), q_id: questtion.q_ID, solved:false},
          chatMessageList: [
            { _id: uuid.v4(), text: questtion.content, createdAt: Moment(),
              user: { _id:2, avatar: product.thumbnailImg},
            },
            { _id: uuid.v4(), text: product.title + ' 채팅방 입니다.', createdAt: Moment(),
              user: { _id:2, avatar: product.thumbnailImg},
            },
        ]
        }));

        // 푸시알림 2개
        popupPushMessage({
          image: product.thumbnailImg,
          title: product.title,
          text: product.title + ' 채팅방 입니다.',
          lastPushed: Moment(),
          isPushShowed: true,
        });
        setTimeout(() => {
          popupPushMessage({
            image: product.thumbnailImg,
            title: product.title,
            text: questtion.content,
            lastPushed: Moment(),
            isPushShowed: true,
          });
          navigation.navigate('MyChatListScreen');
        }, 1000);
      },
      makeNewDiaryMessage: (message) => { // 다이어리 메시지 추가
        return {
          _id: uuid.v4(),
          text: '',
          createdAt: Moment(message.createdAt),
          islagacy: false,
          linkedMessageList: [{id: message._id, text: message.text}],
        };
      },
      deleteChatmessage: (p_id, deleteId) => { // 채팅방에서 메세지 지우기
        // 채팅방에서 메세지 지우기
        setMyChatroomDataContext(myChatroomDataContext.map(chatroom => {
          if(chatroom.p_id === p_id) chatroom.chatMessageList = chatroom.chatMessageList.filter(chatmessage => chatmessage._id !== deleteId);
          return chatroom;
        }));

        // 다이어리에서 채팅 메세지 있으면 제거
        controllContext.deleteDiaryMessageFromChatroom(p_id, deleteId);
      },
      addChatmessage: (p_id, message) => { // 채팅방에 메세지 추가
        setMyChatroomDataContext(myChatroomDataContext.map(chatroom => {
          if(chatroom.p_id === p_id){
            chatroom.lastCheckedTime = Moment();
            chatroom.chatMessageList.unshift(message);
          }
          return chatroom;
        }));

        // 다이어리에 추가
        controllContext.addDiaryMessageFromChatroom(p_id, message);

        // 사용자 답변함 함수 발동
        const productInfo = myProductDataContext[myProductDataContext.findIndex(product => product.p_id === p_id)];
        const chatroomInfo = myChatroomDataContext[myChatroomDataContext.findIndex(chatroom => chatroom.p_id === p_id)];
        const diaryInfo = myDiaryDataContext[myDiaryDataContext.findIndex(diary => diary.p_id === p_id)];
        if(chatroomInfo.lastPushed.solved === false){
          const ansMessage = productInfo.ansList[productInfo.ansList.findIndex(ans => ans.q_ID === chatroomInfo.lastPushed.q_id + 1)]
          controllContext.userReplyed(productInfo.p_id, diaryInfo.d_id, ansMessage);
        }
      },
      userReplyed: async (p_id, d_id, message) => { // 채팅방에 답변하면 서버에 응답요청 보냄
        // 서버에 답변요청 보냄
        let response = await requestChatReply({token:myUserDataContext.token, p_id:p_id, d_id:d_id, message:message, debug:DEBUG_PRINT});
        if(!response.ok){
          Alert.alert('답변 전송 실패', response.message);
          console.log(' app/userReplyed : ', response.message);
          return;
        }
      },
      deleteDiaryMessageFromChatroom: (p_id, deleteId) => { // 채팅방에 메세지 삭제하면 다이어리에 해당하는 메세지 삭제
        // 다이어리에 삭제메시지가 있다면 제거함
        setMyDiaryDataContext(myDiaryDataContext.map(diary => {
          if(diary.p_id === p_id){
            let findMessage = false;
            let needTrimming = false; // 비어있는 다이어리 메세지를 제거하는 용도
            diary.diarymessageList = diary.diarymessageList.map(message => {
              if(message.islagacy || findMessage) return message;

              // 연동중인 메세지인 경우
              let deleteIndex = message.linkedMessageList.findIndex(linkedMessage => linkedMessage.id === deleteId);
              if(deleteIndex === -1) return message; // 못 찾음

              // 메세지 찾음 & 제거
              findMessage = true;
              message.linkedMessageList.splice(deleteIndex, 1);
              if(message.linkedMessageList.length === 0) needTrimming = true;

              return message;
            });

            // 미사용 다이어리 메세지 정리
            if(needTrimming) diary.diarymessageList = diary.diarymessageList.filter(message => message.linkedMessageList.length !== 0);
          }

          return diary;
        }));
      },
      addDiaryMessageFromChatroom: (p_id, message) => { // 채팅창에 메세지  추가하면 다이어리에도 메세지 추가, 내 메세지만 반응
        // 다이어리에 메세지 추가함
        setMyDiaryDataContext(myDiaryDataContext.map(diary => {
          if(diary.p_id === p_id){
            // 메세지 없음
            if(diary.diarymessageList.length === 0) diary.diarymessageList.push(controllContext.makeNewDiaryMessage(message));
            else {
              let topDiaryMessage = diary.diarymessageList[diary.diarymessageList.length-1];
              let checkTime = Moment.duration(topDiaryMessage.createdAt.diff(message.createdAt)).asMinutes();
                if(-ASSUME_SAME_CHAT_TIME <= checkTime && checkTime <= 0 && !topDiaryMessage.islagacy){
                  // 같은 메세지로 인정 15분 간격
                  topDiaryMessage.linkedMessageList.push({id: message._id, text: message.text});

                }else{
                  // 새로운 메세지 생성
                  diary.diarymessageList.push(controllContext.makeNewDiaryMessage(message));
                }
            }

            // 업데이트 수 1 증가
            diary.totalUpdateCount += 1;
          }
          return diary;
        }));
      },
      changeDiaryMessage: (p_id, message_id, message) => { // 다이어리 메세지 내용 변경
        setMyDiaryDataContext(myDiaryDataContext.map(diary => {
          if(diary.p_id === p_id){
            diary.diarymessageList = diary.diarymessageList.map(diaryMessage => {
              if(diaryMessage._id === message_id) return message;
              else return diaryMessage;
            });
            diary.diarymessageList.sort((a, b) => {
              return a.createdAt > b.createdAt;
            });
          }

          return diary;
        }));
      },
      deleteDiaryMessage: (p_id, message_id) => { // 다이어리 메세지 삭제, 빈 칸인 경우
        setMyDiaryDataContext(myDiaryDataContext.map(diary => {
          if(diary.p_id === p_id){
            diary.diarymessageList = diary.diarymessageList.filter(diaryMessage => diaryMessage !== message_id);
          }

          return diary;
        }));
      }
    };

  const showState = () => {
    console.log('\n @ showState');
    console.log(`\n------------- myUserDataContext --------------`);
    console.log(` token: ${myUserDataContext.token}`);
    console.log(` pushToken: ${myUserDataContext.pushToken}`);
    console.log(` email: ${myUserDataContext.email}, password: ${myUserDataContext.password}`);
    console.log(` username: ${myUserDataContext.username}, userImg: ${myUserDataContext.userImg}`);
    console.log(`\n------------- myProductDataContext --------------`);
    myProductDataContext.forEach(product => {
      console.log(` id: ${product.p_id}, isAvailable: ${product.isAvailable}`);
      console.log(` title: ${product.title}, text: ${product.text}`);
      console.log(` thumbnailImg: ${product.thumbnailImg.uri}`);
      console.log(` logoImg: ${product.logoImg.uri}`);
      console.log(` mainImg: ${product.mainImg.uri}`);
      console.log(` pushType: ${product.pushType}, pushtime: ${product.defaultStartTime.format('LTS')} ~ ${product.defaultEndTime.format('LTS')}`);
      console.log(` questionListCount: ${product.questionList.length}, ansListCount: ${product.ansList.length}\n`);
    });
    console.log(`\n------------- mySubscribeDataContext --------------`);
    mySubscribeDataContext.forEach(subscribe => {
      console.log(` p_id: ${subscribe.p_id}, pushTime: ${subscribe.pushStartTime.format('LTS')} ~ ${subscribe.pushEndTime.format('LTS')}`);
    });
    console.log(`\n------------- myChatroomDataContext --------------`);
    myChatroomDataContext.forEach(chatroom=> {
      console.log(` p_id: ${chatroom.p_id}, getPushAlarm: ${chatroom.getPushAlarm}, lastCheckedTime: ${chatroom.lastCheckedTime.format('LTS')}, newItemCount: ${chatroom.newItemCount}`);
      console.log(` lastPushed -> time: ${chatroom.lastPushed.pushTime.format('LTS')}, q_id: ${chatroom.lastPushed.q_id}, solved: ${chatroom.lastPushed.solved}`);
      console.log(` chatMessageListCount: ${chatroom.chatMessageList.length}`);
      chatroom.chatMessageList.forEach(chatmessage => {
        console.log(`  >  _id: ${chatmessage._id}, text: ${chatmessage.text}, user: ${chatmessage.user._id}`);
      });
    });
    console.log(`\n------------- myDiaryDataContext --------------`);
    myDiaryDataContext.forEach(diary => {
      console.log(` diaryTitle: ${diary.title}`);
      console.log(` p_id: ${diary.p_id}, d_id: ${diary.d_id}, color: ${diary.color}, pos: ${diary.pos}, makeTime: ${diary.makeTime.format('LTS')}, totalUpdateCount: ${diary.totalUpdateCount}`);
      console.log(` diarymessageListCount: ${diary.diarymessageList.length}`);
      diary.diarymessageList.forEach(diarymessage => {
        console.log(`  >  _id: ${diarymessage._id}, text: ${diarymessage.text}, createdAt: ${diarymessage.createdAt.format('LTS')}, linkedMessageCount: ${diarymessage.linkedMessageList.length}`);
        diarymessage.linkedMessageList.forEach(message => {
          console.log(`         > id: ${message.id}, text: ${message.text}`);
        });
      });
    });
    console.log(`\n------------- myInformDataContext --------------`);
    console.log(` introduction - count: ${myInformDataContext.introduction.length}`);
    console.log(` help - count: ${myInformDataContext.help.length}`);
    console.log(` notice - count: ${myInformDataContext.notice.length}`);
    console.log(`\n------------- globalData --------------`);
    console.log(`focusChatroomPID: ${globalDataContext.focusChatroomPID}, diaryPositionEditMode: ${globalDataContext.diaryPositionEditMode}, diaryScreenHeight: ${globalDataContext.diaryScreenHeight}`);
  };

  const updateUserDataContext = async (email, password) => {
    let response = await loginTest({email:email, password:password, debug:DEBUG_PRINT});
    if(response.ok){
      setMyUserDataContext({
        token: response.data.token,
        pushToken: 'EXP[TempPushToken]',
        email: email,
        password: password,
        username: response.data.username,
        userImg: 0,
      })
    }
    return response.data.token;
  }
  const updateProductDataContext = async () => {
    let response = await downloadProductDataTest({debug:DEBUG_PRINT});
    if(response.ok){
      setMyProductDataContext(response.data);
    }
    return response.data.map(obj => {return {
      p_id: obj.p_id,
      title: obj.title,
    }});
  }
  const updateSubscribeContext = async (token) => {
    let response = await downloadSubscribeData({token: token, debug:DEBUG_PRINT});
    if(response.ok){
      setMySubscribeDataContext(response.data);
    }
    return response.data.map(obj => obj.p_id);
  }
  const updateChatroomDataContext = async (subList) => {
    let protoChatroomData = subList.map(p_id => {
      return {
        p_id: p_id, getPushAlarm: true, lastCheckedTime: Moment(), newItemCount: 0, chatMessageList: [],
        lastPushed: {pushTime: Moment(), q_id: 1, solved:true}
      }
    });
    setMyChatroomDataContext(protoChatroomData);
  }
  const updateDiaryDataContext = async (subList, proList, token) => {
    let _pos = 0;
    let protoDiaryData = subList.map(p_id => {
      _pos += 1;
      const title = proList[proList.findIndex(pro => pro.p_id === p_id)].title;
      return {
        p_id: p_id, d_id: p_id, title: title, color: _pos%10, pos: _pos, makeTime: Moment(), totalUpdateCount: 0,
        diarymessageList: []
      };
    })
    let response = await downloadDiaryData({jwt:token, debug:DEBUG_PRINT});

    if(response.ok && response.data.length === protoDiaryData.length){
      setMyDiaryDataContext(response.data);
    }else{
      console.log('\n 서버 저장 다이어리가 예상 다이어리와 크기가 다릅니다. server: ', response.data.length, ' expected: ', protoDiaryData.length, response.ok);
      console.log(response.data);
      setMyDiaryDataContext(protoDiaryData);
    }
  }
  const updateInformDataContext = async () => {

  }
  const stateUpdateList = async () => {
    let email = testAccount.email, password = testAccount.password;
    let token = await updateUserDataContext(email, password);
    let proList = await updateProductDataContext();
    let subList = await updateSubscribeContext(token);
    await updateChatroomDataContext(subList);
    await updateDiaryDataContext(subList, proList, token);
    await updateInformDataContext();
  };

  const resetState = async () => {
    console.log('\n @ 상태 초기화');
    setMyUserDataContext(DefaultDataType.userDataType);
    setMyProductDataContext(DefaultDataType.productDataType);
    setMySubscribeDataContext(DefaultDataType.subscribeDataType);
    setMyChatroomDataContext(DefaultDataType.chatroomDataType);
    setMyDiaryDataContext(DefaultDataType.diaryDataType);
    setMyInformDataContext(DefaultDataType.informDataType);
    setGlobalDataContext(DefaultDataType.globalDataType);
  };

  return (
    <ThemeContext.Provider value={theme}>
    <AuthContext.Provider value={authContext}>
      {state.devMode === true ? (
        <View style={{flex:1, marginTop:30, alignItems: 'center', justifyContent: 'center'}}>
          <Text>스플래쉬 화면</Text>
          <Text> 유저 정보 여부에 따라 다음으로 분기 </Text>
          <TouchableOpacity style={{margin: 10}} onPress={() => defaultLogin(testAccount.email, testAccount.password)}>
            <Text> - 저장된 계정 있음(자동 로그인)</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{margin: 10}} onPress={()=>{dispatch({ type: 'END_LOADING_FIRST_LOGIN'})}}>
            <Text> - 저장된 계정 있음(자동 X)</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{margin: 10}} onPress={()=>{dispatch({ type: 'END_LOADING_LOGIN_PAGE'})}}>
            <Text> - 저장된 계정 없음</Text>
          </TouchableOpacity>
          <Text style={{ padding:5, color:loadProductData?'blue':'red'}}>{'상품정보 로딩: ' + loadProductData}</Text>
          <Text style={{ padding:5, color:updateCacheData?'blue':'red'}}>{'캐쉬정보 로딩: ' + updateCacheData}</Text>
          <TouchableOpacity style={{margin: 10}} onPress={updateFunction}>
            <Text>업데이트 상품정보</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{margin: 10}} onPress={() => popupPushMessage(null)}>
            <Text style={{color: 'green'}}>푸시 테스트</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{margin: 10}} onPress={() => showState()}>
            <Text style={{color: 'green'}}>state display</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{margin: 10}} onPress={() => stateUpdateList()}>
            <Text style={{color: 'green'}}>state update</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{margin: 10}} onPress={() => resetState()}>
            <Text style={{color: 'green'}}>state reset</Text>
          </TouchableOpacity>
        </View>
      ) : state.nowLoading === true ? (
        <SplashScreen/>
      ) : state.noAuth === true ? (
        <View style={{flex:1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
          <Text style={{fontFamily: 'NanumMyeongjo',fontSize:20}}>권한이 필요합니다.</Text>
        </View>
      ): state.intro === true ? (
        <IntroNavigation/>
      ) : state.login === false ? (
        <LoginNavigation/>
      )
      : (
        <ControllContext.Provider value={controllContext}>
        <SystemContext.Provider value={systemContext}>
        <UserDataContext.Provider value={myUserDataContext}>
        <ProductDataContext.Provider value={myProductDataContext}>
        <SubscribeDataContext.Provider value={mySubscribeDataContext}>
        <ChatroomDataContext.Provider value={myChatroomDataContext}>
        <DiaryDataContext.Provider value={myDiaryDataContext}>
        <InformDataContext.Provider value={myInformDataContext}>
        <GlobalDataContext.Provider value={globalDataContext}>
        <NavigationContainer>
          <Drawer.Navigator drawerPosition='right' drawerStyle={{backgroundColor: '#CCC'}} drawerContent={props => <CustomDrawerContent {...props}/>}>
            <Drawer.Screen name='sidebar' component={MainStackHomePage} options={{swipeEnabled: false}}/>
          </Drawer.Navigator>
        </NavigationContainer>
        </GlobalDataContext.Provider>
        </InformDataContext.Provider>
        </DiaryDataContext.Provider>
        </ChatroomDataContext.Provider>
        </SubscribeDataContext.Provider>
        </ProductDataContext.Provider>
        </UserDataContext.Provider>
        </SystemContext.Provider>
        </ControllContext.Provider>
      )}
      {pushContext.isPushShowed && <PushNotification.PushMessage pushData={pushContext} onPressPushNotification={onPressPushNotification}/>}

    </AuthContext.Provider>
    </ThemeContext.Provider>
  );
}

function SplashScreen(){
  const {loading} = useContext(AuthContext);

  useEffect(() => {
    loading();
  }, []);

  return (
    <View style={{flex:1, marginTop:30, alignItems: 'center', justifyContent: 'center'}}>
      <Image source={logo} style={{height: screenWidth*0.25, width:screenWidth*0.25}} resizeMode={'cover'}/>
    </View>
  );
}
