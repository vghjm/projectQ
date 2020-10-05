import React, {useContext, useState, useEffect, useCallback} from 'react';
import {View, Text, Image, ActivityIndicator, TouchableOpacity, Alert, TouchableHighlight} from 'react-native';
import { GiftedChat, Bubble , Send, InputToolbar, Time, Day, Composer, Avatar  } from 'react-native-gifted-chat' // https://github.com/FaridSafi/react-native-gifted-chat
import Moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker'; // https://github.com/react-native-community/datetimepicker
import { Octicons, Ionicons, MaterialIcons }
from '@expo/vector-icons'; // https://icons.expo.fyi/
import { createNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem, } from '@react-navigation/drawer';  //  https://reactnavigation.org/docs/drawer-based-navigation/
import _ from 'lodash'; // https://lodash.com/docs
import uuid from 'react-native-uuid';       // https://www.npmjs.com/package/react-native-uuid


import * as TestData from '../testData';
import {ThemeContext, SystemContext} from './Context';
import {chatReply} from './ServerConnect';
const bookOn = require('../assets/icon/book_on.png');
const bookOff = require('../assets/icon/book_off.png');
const upArrow = require('../assets/icon/up_arrow.png');
const downArrow = require('../assets/icon/down_arrow.png');



// 취소 및 삭제함수
// 채팅창
function renderLoading() {
  return (
    <View style={{flex:1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
      <ActivityIndicator size='large' color='#6646ee' />
    </View>
  );
}
function renderSend(props) {
  const theme = props.theme;
  return (
    <Send
      {...props}
    >
      <View style={{backgroundColor: theme.light[1],width:50, height:35, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight:5}}>
        <Text style={{margin:3, fontSize:18}}>전송</Text>
      </View>
    </Send>
  );
}
function renderComposer(props){ // textInput style
  return (
    <Composer
      {...props}
      textInputStyle={{borderWidth: 0, marginTop:7, alignSelf: 'center', alignContent: 'center', justifyContent: 'center', paddingTop: 10, borderColor: 'green'}}
    />
  );
}
function renderBubble(props) {
  let theme = props.theme;
  return (
    // Step 3: return the component
    <Bubble
      {...props}
      wrapperStyle={{
        right: {
          // Here is the color change
          backgroundColor: theme.light[0],
          marginVertical: 3,
          borderRadius: 20,
        },
        left: {
          backgroundColor: theme.default,
          marginVertical: 9,
          borderRadius: 20,
        }
      }}
      textStyle={{
        right: {
          color: 'black',
          fontSize: 15,
          padding: 3,
          fontFamily: 'NanumMyeongjo',
        },
        left: {
          fontSize: 15,
          padding: 3,
          fontFamily: 'NanumMyeongjo',
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
          fontFamily: 'NanumMyeongjo',
        },
        left: {
          color: 'gray',
          fontSize: 8,
          fontFamily: 'NanumMyeongjo',
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
      style={{borderWidth:1}}
      primaryStyle={{borderWidth: 1, borderColor: '#CCC', marginVertical: 3, marginHorizontal:9, borderRadius: 10, backgroundColor: 'white'}}
      containerStyle={{borderWidth:0, borderColor: 'red', justifyContent: 'center'}}
      textInputProps={{autoFocus: false, placeholder:'    메시지를 입력하세요'}}
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
function renderAvatar (props) {
  let theme = props.theme;
  return (
    <Avatar {...props}
      containerStyle={{
        left: {
          borderWidth:1,
          borderColor: theme.light[4],
          borderRadius:40
        },
      }}
    />
  )
}
export default function MyChatRoomScreen({route, navigation}) {  // 채팅방 화면
  const Context = useContext(SystemContext);
  //const updateCount = Context.updateFunc();
  const id = route.params.id;
  //let data = dataList[id-1];
  //let data = dataList[dataList.findIndex(obj => obj.id===id)];
  let data = Context.getProductData(id);
  let userData = Context.getUserData();
  const [messages, setMessages] = useState(data.chatroom.chatmessageList);

  const theme = useContext(ThemeContext);

  const makeDiaryMessage = (id, message) => { // 다이어리 메세지 생성기능
    //let data = dataList[id-1];
    //let _data = dataList[dataList.findIndex(obj => obj.id===id)];
    let diaryForm = { _id: uuid.v4(), text: '', createdAt: message.createdAt, islagacy: false, linkedMessageList: [{id: message._id, text:message.text}]};
    data.diary.diarymessageList.push(_.cloneDeep(diaryForm));
    data.diary.totalUpdateCount += 1;
  }
  const deleteMessage = (id, messageId) => { // 다이어리와 연동중이면 해당하는 메시지를 지운다.
    //let data = dataList[id-1];
    //let _data = dataList[dataList.findIndex(obj => obj.id===id)];
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

  useEffect(() => {
    navigation.setOptions({ headerTitle: data.product.title }); // 채팅방 제목 설정
    Context.setGlobalP(id);

    // 채팅방 확인
    data.chatroom.newItemCount = 0;
    // return (() => {
    //   // 답변이 필요한 경우
    //   if(!data.chatroom.lastPushed.solved && myChat!==''){
    //     data.chatroom.lastPushed.solved = true;
    //     Context.getReply(data, navigation);
    //   }
    // });
  }, []);

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
    data.chatroom.lastMessage = message.text;

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

    // 답변해결
    // if(!data.chatroom.lastPushed.solved){
    //   data.chatroom.lastPushed.solved = true;
    //   setTimeout(() => {
    //     let ansMessage = {
    //       _id: uuid.v4(), text: data.product.ansList[data.chatroom.lastPushed.questIndex], createdAt: Moment(),
    //       user: { _id:2, avatar: data.product.imageSet.avatarImg.uri?? data.product.imageSet.avatarImg},
    //     };
    //     data.chatroom.newItemCount += 1;
    //     data.chatroom.lastMessageTime = Moment();
    //     data.chatroom.chatmessageList.unshift(_.cloneDeep(ansMessage));
    //     data.chatroom.lastMessage = ansMessage.text;
    //     data.chatroom.lastPushed.ansMessage = _.cloneDeep(ansMessage);
    //     // Context.popupPushMessage({
    //     //   image: data.product.imageSet.thumbnailImg,
    //     //   title: data.product.title,
    //     //   text: ansMessage.text,
    //     //   onPress: ()=>navigation.navigate('chatroom', {id: data.id, data:data}),
    //     //   lastPushed: Moment(),
    //     //   isPushShowed: true,
    //     // }, 0);
    //     setMessages(previousMessages => GiftedChat.append(previousMessages, ansMessage));
    //   }, 1900);
    // }
    if(!data.chatroom.lastPushed.solved){
      let ansInfo = data.product.ansList[data.chatroom.lastPushed.questIndex];
      console.log('ansInfo: ', ansInfo);
      chatReply(userData.pushToken, ansInfo.q_ID, ansInfo.content);
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
        alwaysShowSend ={true}
        locale={'ko'}
        theme={theme}
        showAvatarForEveryMessage={true}
        renderBubble={renderBubble}
        renderSend={renderSend}
        renderLoading={renderLoading}
        renderTime ={renderTime}
        renderDay={renderDay}
        renderAvatar={renderAvatar}
        bottomOffset ={-15}
        renderInputToolbar={renderInputToolbar}
        renderComposer={renderComposer}
        scrollToBottom ={true}
        alignTop={true}
        maxInputLength={10}
        onLongPress={onLongPress}
        renderAvatarOnTop ={true}
      />
    )
}
