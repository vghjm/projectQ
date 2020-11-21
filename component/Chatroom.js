import React, {useContext, useEffect, useCallback} from 'react';
import {View, Text, ActivityIndicator, Alert } from 'react-native';
import { GiftedChat, Bubble , Send, InputToolbar, Time, Day, Composer, Avatar  } from 'react-native-gifted-chat' // https://github.com/FaridSafi/react-native-gifted-chat
import Moment from 'moment';
import uuid from 'react-native-uuid'; // https://www.npmjs.com/package/react-native-uuid

// 내가 컨트롤하는 파일
import {ThemeContext, ControllContext, ChatroomDataContext} from './Context';
import {chatReply} from './ServerConnect';

// 채팅방 함수
export default function MyChatRoomScreen({route, navigation}) {  // 채팅방 화면
  const p_id = route.params.p_id;
  const title = route.params.title;
  const chatroomList = useContext(ChatroomDataContext);
  const theme = useContext(ThemeContext);
  const { setFocusChatroomPID, deleteChatmessage, addChatmessage } = useContext(ControllContext);
  const chatroom = chatroomList[chatroomList.findIndex(chatroom => chatroom.p_id === p_id)];
  const messages = chatroom ? chatroom.chatMessageList : [];

  // 로딩 후 채팅방 제목 설정함
  useEffect(() => {
    navigation.setOptions({ headerTitle: title });
    setFocusChatroomPID(p_id);
  }, []);

  // 메세지 생성 함수
  const onSend = useCallback((messages = []) => {
    // 메세지 가공
    let message = messages[0];   // 메세지 복사
    message.createdAt = Moment(message.createdAt);  // 시간정보를 Moment로 커버
    addChatmessage(p_id, message);
  }, []);

  // 메세지 길게 터치시 기능
  const onLongPress = (context, message) => {
    if(message.user._id === 1){
      // 유저 메시지 확인
      let alertMessage = '';
      if(message.text.length > 17){
        alertMessage = message.text.substring(0, 13)+'... 메시지를 삭제하시겠습니까?';
      }else{
        alertMessage = message.text + ' 메시지를 삭제하시겠습니까?';
      }
      Alert.alert('메시지 삭제 확인', alertMessage, [{text: '취소'}, {text:'삭제', onPress:() => deleteChatmessage(p_id, message._id)}]);
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

// 채팅방 세부설정용
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
        <Text style={{margin:3, fontSize:18, fontFamily: 'NanumMyeongjo'}}>전송</Text>
      </View>
    </Send>
  );
}
function renderComposer(props){ // textInput style
  return (
    <Composer
      {...props}
      textInputStyle={{borderWidth: 0, marginTop:7, alignSelf: 'center',fontFamily: 'NanumMyeongjo', alignContent: 'center', justifyContent: 'center', paddingTop: 10, borderColor: 'green'}}
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
          backgroundColor: theme.gray,
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
