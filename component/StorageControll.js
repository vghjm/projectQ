import React from 'react';
import {AsyncStorage} from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import Moment from 'moment';
Moment.locale("ko");
import _ from 'lodash'; // https://lodash.com/docs
import { Notifications } from 'expo'; // https://docs.expo.io/versions/latest/sdk/notifications/


import {FILE, PRODUCT_LOOKUP} from './utils/constants';
import * as Message from './utils/Message';
import * as Connect from './ServerConnect';
import {printStatus, printUserData, printDataList, printUnitTest} from './utils/Print';


function diarySortByDate(myDiaryMessageList){
  myDiaryMessageList.sort((a, b) => {
    return a.createdAt > b.createdAt;
  });
}

const downloadFile = async (url) => {
  // 사진 저장용 함수
  let path = url.split('/');
  let returnUri=null;
  const file_name = path[path.length-1];

  await FileSystem.downloadAsync(
    url,
    FileSystem.documentDirectory +'image/' + file_name
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
const chooseRandomIndex = (value) => {
  return Math.floor(Math.random() * value);
}

export async function updateDataSet(dataList, data, debugPrint=false){
  if(debugPrint) printUnitTest('StorageControll > updateDataSet');

  let userData = {
    token: data.token,
    pushToken: await Notifications.getExpoPushTokenAsync(),
    email: data.email,
    password: data.password,
    username: data.username,
    userImg: null,
    mySubscribeList: [],
    myChatroomList: [],
    myDiaryList: [],
  }

  await updateUserData(userData.token, userData.email, debugPrint)
    .then(response => {
      if(response.ok) userData.userImg = response.data;
    });

  await updateSubscribeData(userData.token, userData.email, debugPrint)
    .then(response => {
      if(response.ok){
        response.data.forEach(subscribe => {
          userData.mySubscribeList.push(subscribe);
          userData.myChatroomList.push({id: subscribe.id, getPushAlarm:true, key:subscribe.id.toString()})
          let data = dataList[dataList.findIndex(obj => obj.id===subscribe.id)];
          data.isSubscribe = true;
          data.hasChatroom = true;
          data.chatroom.lastMessageTime = Moment();
          data.chatroom.newItemCount = 0;
          data.chatroom.lastMessage = '';
          data.chatroom.lastPushed = {pushTime: Moment(), questIndex0: 1, solved:true, ansMessage: null};
          data.push.pushStartTime = subscribe.pushStartTime;
          data.push.pushEndTime = subscribe.pushEndTime;
        })
      }
    });

  await updateDiaryData(userData.token, userData.email, debugPrint)
    .then(response => {
      if(response.ok){
        response.data.forEach(diary => {
          userData.myDiaryList.push({id:diary.id, pos:diary.pos, color:diary.color});
          let data = dataList[dataList.findIndex(obj => obj.id===diary.id)];
          data.hasDiary = true;
          data.diary.id = diary.d_ID;
          data.diary.makeTime = diary.makeTime;
          data.diary.totalUpdateCount = diary.totalUpdateCount;
          data.diary.diarymessageList = diary.diarymessageList;
          diarySortByDate(data.diary.diarymessageList);
        })
      }
    })

  await updateChatData(userData.token, userData.email, debugPrint)
    .then(response => {
      if(response.ok){
        response.data.forEach(chat => {
          userData.myChatroomList[userData.myChatroomList.findIndex(obj => obj.id===chat.id)].getPushAlarm = chat.getPushAlarm;
          let data = dataList[dataList.findIndex(obj => obj.id===chat.id)];
          data.chatroom = chat.chatroom;
          data.chatroom.noMessage = false;
        })
      }
    });

  if(debugPrint){
    printUserData(userData);
    printDataList(dataList);
  }

  return userData;
}
export async function updateProductData(debugPrint=false){
  if(debugPrint) printUnitTest('StorageControll > updateProductData');

  let reply = {ok: false, data: [], message: ''};
  let response = await loadProductData();

  if(response.ok){
    // 데이터 파싱
    //await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory);
    await response.data.reduce( async (last, product, i) =>{
      let myQuestList = [];
      let myAnsList = [];
      // 질문 분류기
      product.question.forEach((questObj, i) => {
        if(i%2 === 0){
          myQuestList.push({q_ID: questObj.q_ID, content: questObj.content});
        }else{
          myAnsList.push({q_ID: questObj.q_ID, content: questObj.content});
        }
      })

      // 이미지 로딩
      //let thumbnailImg = await downloadFile(FILE + product.img_logo);
      //let logoImg = await downloadFile(FILE + product.img_background);
      //let mainImg = await downloadFile(FILE + product.img_explain);
      let thumbnailImg = FILE + product.img_logo;
      let logoImg = FILE + product.img_background;
      let mainImg = FILE + product.img_explain;

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
          makeTime: null, totalUpdateCount: 0, diarymessageList: [],
        },
        push: {
          isRandomPushType: product.pushType===1, pushStartTime: Moment('20200812 ' + product.start_time), pushEndTime: Moment('20200812 ' + product.end_time),
        },
      };
      //console.log('load product\n', productData);
      reply.data.push(_.cloneDeep(productData));

      return 1;
    }, 0);

    reply.ok = true;
  }else{
    // 데이터 로드 에러
    reply.message = Message.FAIL_LOAD_DATA_ERROR;
  }

  if(debugPrint) printStatus('updateProductData', reply);

  return reply;
}
export async function updateCacheData(debugPrint=false){
  if(debugPrint) printUnitTest('StorageControll > updateCacheData');

  let reply = {ok:false, data:null, message:''};
  let cache = await AsyncStorage.getItem('cacheData');



  if(cache === null){
    reply.data = {token: null, isFirstLogin:true};
  }else{
    if(cache.autoLogin){
       reply.ok = true;
       reply.data = {token: cache.token, isFirstLogin:false};
    }else{
      reply.data = {token: null, isFirstLogin:false};
    }
  }
  if(debugPrint) printStatus('updateCacheData', reply);

  return reply;
}
async function updateSubscribeData(token, email, debugPrint=false){
  let reply = {ok: false, data: [], message: ''};
  let localResponse = await loadSubscribeData(email);

  if(localResponse.ok){
    reply.ok = true;
    reply.data = localResponse.data;
  }else{
    let serverResponse = await Connect.loadSubscribeDataFromServer(token);
    if(serverResponse.ok){
      reply.ok = true;
      serverResponse.data.forEach( obj => {
        reply.data.push({id:obj.p_ID, pushStartTime: Moment('20200916 '+obj.chatstart_time), pushEndTime: Moment('20200916 '+obj.chatend_time)});
      });
    }else reply.message = serverResponse.message;
  }
  if(debugPrint) printStatus('updateSubscribeData', reply);

  return reply;
}
async function updateChatData(token, email, debugPrint=false){
  let reply = {ok: false, data: [], message: ''};
  let localResponse = await loadChatData(email);

  if(localResponse.ok){
    reply.ok = true;
    reply.data = localResponse.data;
  }else reply.message =  localResponse.message;

  if(debugPrint) printStatus('updateChatData', reply);

  return reply;
}
async function updateUserData(token, email, debugPrint=false){
  let reply = {ok: false, data: [], message: ''};
  let localResponse = await loadUserData(email);

  if(localResponse.ok){
    reply.ok = true;
    reply.data = localResponse.data;
  }else{
    reply.message = localResponse.message;
  }
  if(debugPrint) printStatus('updateUserData', reply);

  return reply;
}
async function updateDiaryData(token, email, debugPrint=false){
  let reply = {ok: false, data: [], message: ''};
  let localResponse = await loadDiaryData(email);

  if(localResponse.ok){
    reply.ok = true;
    reply.data = localResponse.data;
  }else{
    let serverResponse = await Connect.loadDiaryDataFromServer(token);

    if(serverResponse.ok){
      reply.ok = true;
      let pos = 1;
      serverResponse.data.forEach(obj => {
        let diarymessageList = [];
        let _id = 1;
        obj.chating.forEach(chat => {
          diarymessageList.push({_id:_id, text:chat.chatcontent, createdAt:Moment(chat.time), islagacy:true, linkedMessageList: []})
          _id += 1;
        })
        reply.data.push({id:obj.dp_ID, pos:pos, color:chooseRandomIndex(10), d_ID:obj.d_ID, makeTime:Moment(obj.chatedperiod_start), totalUpdateCount:obj.chatedamount, diarymessageList:diarymessageList});
        pos += 1;
      })
    }
  }
  if(debugPrint) printStatus('updateDiaryData', reply);

  return reply;
}
async function loadProductData(debugPrint=false){
  let reply = {ok: false, data: null, message: ''};
  let dataVersion = await AsyncStorage.getItem('productDataVersion');
  let response = await Connect.httpConnection(PRODUCT_LOOKUP, {version: dataVersion}, 'POST');

  let productData;
  if(response.ok){ // HTTP 상태 코드가 200~299일 경우
    let json = await response.json();

    if(json.res === 'fail') reply.message = Message.FAIL_ERROR;
    else if(json.res === 'noAuth') reply.message = Message.NO_AUTH_ERROR;
    else if(json.res === 'new data'){
      reply.data = await AsyncStorage.getItem('productData');
      if(reply.data !== null) reply.ok = true;
      else reply.message = Message.NO_SAVE_DATA_ERROR;
    }
    else {
      reply.ok = true;
      reply.data = json.products;
    };
  }else{
    reply.message = Message.NO_CONNECT_ERROR;
  }
  if(debugPrint) printStatus('loadProductData', reply);

  return reply;
}
async function loadDiaryData(email, debugPrint=false){
  let reply = {ok:false, data:null, message:''};
  let diary = await AsyncStorage.getItem('diaryData%' + email);
  //console.log('load local DiaryData: ', diary);
  if(diary === null){
    reply.message = Message.NO_DATA_ERROR;
  }else{
    reply.ok = true;
    reply.data = diary;
  }
  if(debugPrint) printStatus('loadDiaryData', reply);

  return reply;
}
async function loadChatData(email, debugPrint=false){
  let reply = {ok:false, data:null, message:''};
  let chat = await AsyncStorage.getItem('chatData%' + email);

  if(chat){
    reply.ok = true;
    reply.data = chat;
  }else{
    reply.message = Message.NO_DATA_ERROR;
  }
  if(debugPrint) printStatus('loadChatData', reply);

  return reply;
}
async function loadSubscribeData(email, debugPrint=false){
  let reply = {ok:false, data:null, message:''};
  let subscribe = await AsyncStorage.getItem('subscribeData%'+email);
  //console.log('load local SubscribeData: ', subscribe);
  if(subscribe === null){
    reply.message = Message.NO_DATA_ERROR;
  }else{
    reply.ok = true;
    reply.data = subscribe;
  }
  if(debugPrint) printStatus('loadSubscribeData', reply);

  return reply;
}
async function loadUserData(email, debugPrint=false){
  let reply = {ok:false, data:null, message:''};
  let user = await AsyncStorage.getItem('userData%' + email);
  //console.log('load local UserData: ', user);
  if(user === null){
    reply.message = Message.NO_DATA_ERROR;
  }else{
    reply.ok = true;
    reply.data = user;
  }
  if(debugPrint) printStatus('loadUserData', reply);

  return reply;
}
