import React, { useRef, useState, useCallback, useEffect, useContext} from 'react';
import { AppState, Vibration, Dimensions , ActivityIndicator, Platform,TouchableHighlight, TouchableWithoutFeedback, AsyncStorage, ImageBackground, Text, View, StyleSheet, TouchableOpacity, TextInput, CheckBox, KeyboardAvoidingView, Alert, Button, ScrollView, SafeAreaView, Image }
from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, getFocusedRouteNameFromRoute, useFocusEffect } from '@react-navigation/native';
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
import {ThemeContext, AuthContext, ControllContext, SystemContext, UserDataContext, ProductDataContext, SubscribeDataContext, ChatroomDataContext, DiaryDataContext, InformDataContext} from './component/Context';
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
  console.log('getReply', data);
  setTimeout(() => {
    let ansMessage = {
      _id: uuid.v4(), text: data.product.ansList[data.chatroom.lastPushed.questIndex].content, createdAt: Moment(),
      user: { _id:2, avatar: data.product.imageSet.avatarImg.uri?? data.product.imageSet.avatarImg},
    };
    data.chatroom.newItemCount += 1;
    data.chatroom.lastMessageTime = Moment();
    data.chatroom.chatmessageList.unshift(_.cloneDeep(ansMessage));
    data.chatroom.lastMessage = ansMessage.text;
    data.chatroom.lastPushed.ansMessage = _.cloneDeep(ansMessage);
    popupPushMessage({
      image: data.product.imageSet.thumbnailImg,
      title: data.product.title,
      text: ansMessage.text,
      onPress: ()=>navigation.navigate('chatroom', {id: data.id, data:data}),
      lastPushed: Moment(),
      isPushShowed: true,
    });
    console.log('getReply ansMessage', ansMessage);
    updateF();
    return ansMessage;
    //setMessages(previousMessages => GiftedChat.append(previousMessages, ansMessage));
  }, 5 * 1000);
  return 'aa';
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

async function diaryBackup(){
  if(!userData){
    console.log('ERROR : 로그인 없는 diary backup 탐지');
    return -1;
  }
  let backupDiary = [];
  dataList.forEach( data => {
    if(data.hasDiary){
      let diaryData = data.diary;
      let productData = data.product;
      let myDiary = userData.myDiaryList[userData.myDiaryList.findIndex(obj => obj.id === data.id)];
      let diaryMessage = diaryData.diarymessageList.map(message => {
        let content = '';
        if(message.islagacy){
          content = message.text;
        }else{
          message.linkedMessageList.forEach(linkedMessage => {
            if(content === '') content = linkedMessage.text;
            else content += ' ' + linkedMessage.text;
          })
        }
        return {
          dm_ID: message._id,
          chatcontent: content,
          chatedtime: message.createdAt,
        }
      });
      let diaryBackupData = {
        d_ID: diaryData.id,
        p_ID: data.id,
        p_name: productData.title,
        chatedperiod_start: diaryData.makeTime.format('YYYYMMDD'),
        chatedperiod_end: Moment().format('YYYYMMDD'),
        chatedamount: diaryData.totalUpdateCount,
        linkname: 'temp',
        color: myDiary.color,
        position: myDiary.pos,
        diaryMessage: diaryMessage,
      }
      backupDiary.push(_.cloneDeep(diaryBackupData));
    }
  });
  console.log('diary backup', backupDiary);
  let response = await Connection.diaryBackUp(userData.token, backupDiary);
  if(response.ok){
    console.log('다이어리 백업 성공!');
  }else{
    console.log('ERROR : 다이어리 백업 실패 , ', response.message);
  }
}

// 태스트 모듈
import loginTest from './component/connect/login';
import downloadProductDataTest from './component/connect/downloadProductData';
import downloadSubscribeData from './component/connect/downloadSubscribeData';
import downloadDiaryData from './component/connect/downloadDiaryData';


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
    []
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

  // 푸시등록
  const handleNotification1 = ({request}) => {
    const content = request.content;
    const diaryID = content.data.diary_ID;
    const productID = content.data.product_ID;
    const question = content.data.question;
    const questionID = content.data.question_ID;
    const title = content.title;
    let data = dataList[dataList.findIndex(obj => obj.id===productID)];


    console.log(`\n notify receive  content\n`, content);
    popupPushMessage({
      image: data.product.imageSet.mainImg,
      title: title,
      text: question,
      onPress: ()=>navigation.navigate('chatroom', {id: productID, data:data}),
      lastPushed: Moment(),
      isPushShowed: true,
    });
  };
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
    }
  }, [loadProductData, updateCacheData, loaded]);

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
  const _handleAppStateChange = (nextAppState) => {
    if(appState.current.match(/inactive|background/) && nextAppState === "active"){
      console.log("App has come to the foreground!");
    }else{
      diaryBackup();
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
        onPress: null,
        lastPushed: Moment(),
        isPushShowed: true,
      });

      Vibration.vibrate();
      pushCount++;
      setTimeout(() => {
        pushCount--;
        //console.log('push time out : ', pushCount);
        if(pushCount===0) setPushContext({
          image: null,
          title: null,
          text: null,
          onPress: null,
          lastPushed: Moment(),
          isPushShowed: false,
        });
      }, 4800);
    }, timer);
  }


  // 새로운 데이터 타입 state
  const [myUserDataContext, setMyUserDataContext] = useState(DefaultDataType.userDataType);
  const [myProductDataContext, setMyProductDataContext] = useState(DefaultDataType.productDataType);
  const [mySubscribeDataContext, setMySubscribeDataContext] = useState(DefaultDataType.subscribeDataType);
  const [myChatroomDataContext, setMyChatroomDataContext] = useState(DefaultDataType.chatroomDataType);
  const [myDiaryDataContext, setMyDiaryDataContext] = useState(DefaultDataType.diaryDataType);
  const [myInformDataContext, setMyInformDataContext] = useState(DefaultDataType.informDataType);

  const controllContext = React.useMemo(
    () => ({
      function: () => {},
    }),
    []
  );

  const showState = () => {
    console.log('\n @ showState');
    console.log(`------------- myUserDataContext --------------`);
    console.log(`token: ${myUserDataContext.token}`);
    console.log(`pushToken: ${myUserDataContext.pushToken}`);
    console.log(`email: ${myUserDataContext.email}, password: ${myUserDataContext.password}`);
    console.log(`username: ${myUserDataContext.username}, userImg: ${myUserDataContext.userImg}`);
    console.log(`------------- myProductDataContext --------------`);
    myProductDataContext.forEach((obj, i) => {
      console.log(`id: ${obj.p_id}, isAvailable: ${obj.isAvailable}`);
      console.log(`title: ${obj.title}, text: ${obj.text}`);
      console.log(`imageLoad: ${obj.thumbnailImg !== null && obj.logoImg !== null && obj.mainImg !== null}, pushType: ${obj.pushType}`);
      console.log(`pushtime: ${obj.defaultStartTime.format('LTS')} ~ ${obj.defaultEndTime.format('LTS')}`);
      console.log(`questionListCount: ${obj.questionList.length}, ansListCount: ${obj.ansList.length}`);
    });
    console.log(`------------- mySubscribeDataContext --------------`);
    mySubscribeDataContext.forEach((obj, i) => {
      console.log(`p_id: ${obj.p_id}, pushTime: ${obj.pushStartTime.format('LTS')} ~ ${obj.pushEndTime.format('LTS')}`);
    });
    console.log(`------------- myChatroomDataContext --------------`);
    myChatroomDataContext.forEach((obj, i) => {
      console.log(`p_id: ${obj.p_id}, getPushAlarm: ${obj.getPushAlarm}, lastCheckedTime: ${obj.lastCheckedTime.format('LTS')}, newItemCount: ${obj.newItemCount}`);
      console.log(`lastPushed -> time: ${obj.lastPushed.pushTime.format('LTS')}, index: ${obj.lastPushed.questIndex}, solved: ${obj.lastPushed.solved}`);
      console.log(`chatMessageListCount: ${obj.chatMessageList.length}`);
    });
    console.log(`------------- myDiaryDataContext --------------`);
    myDiaryDataContext.forEach((obj, i) => {
      console.log(`p_id: ${obj.p_id}, d_id: ${obj.d_id}, color: ${obj.color}, pos: ${obj.pos}, makeTime: ${obj.makeTime.format('LTS')}, totalUpdateCount: ${obj.totalUpdateCount}`);
      console.log(`diarymessageListCount: ${obj.diarymessageList.length}`);
    });
    console.log(`------------- myInformDataContext --------------`);
    console.log(`introduction - count: ${myInformDataContext.introduction.length}`);
    console.log(`help - count: ${myInformDataContext.help.length}`);
    console.log(`notice - count: ${myInformDataContext.notice.length}`);
  };

  const updateUserDataContext = async (email, password) => {
    let response = await loginTest({email:email, password:password, debug:true});
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
    let response = await downloadProductDataTest({debug:true});
    if(response.ok){
      setMyProductDataContext(response.data);
    }
  }
  const updateSubscribeContext = async (token) => {
    console.log('token : ', token);
    let response = await downloadSubscribeData({jwt: token, debug:true});
    if(response.ok){
      setMySubscribeDataContext(response.data);
    }
  }
  const updateChatroomDataContext = async () => {

  }
  const updateDiaryDataContext = async (token) => {
    let response = await downloadDiaryData({jwt:token, debug:true});
    if(response.ok){
      setMyDiaryDataContext(response.data);
    }
  }
  const updateInformDataContext = async () => {

  }
  const stateUpdateList = async () => {
    let email = testAccount.email, password = testAccount.password;
    let token = await updateUserDataContext(email, password);
    await updateProductDataContext();
    await updateSubscribeContext(token);
    await updateChatroomDataContext();
    await updateDiaryDataContext(token);
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
        <NavigationContainer>
          <Drawer.Navigator drawerPosition='right' drawerStyle={{backgroundColor: '#CCC'}} drawerContent={props => <CustomDrawerContent {...props}/>}>
            <Drawer.Screen name='sidebar' component={MainStackHomePage} options={{swipeEnabled: false}}/>
          </Drawer.Navigator>
        </NavigationContainer>
        </InformDataContext.Provider>
        </DiaryDataContext.Provider>
        </ChatroomDataContext.Provider>
        </SubscribeDataContext.Provider>
        </ProductDataContext.Provider>
        </UserDataContext.Provider>
        </SystemContext.Provider>
        </ControllContext.Provider>
      )}
      {pushContext.isPushShowed && <PushNotification.PushMessage pushData={pushContext}/>}
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
