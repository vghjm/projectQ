import React, {useContext} from 'react';
import {View, Text, Image, ActivityIndicator, TouchableOpacity, Alert, TouchableHighlight} from 'react-native';
import { GiftedChat, Bubble , Send, InputToolbar, Time, Day, Composer } from 'react-native-gifted-chat' // https://github.com/FaridSafi/react-native-gifted-chat
import Moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker'; // https://github.com/react-native-community/datetimepicker
import { Octicons, Ionicons, MaterialIcons }
from '@expo/vector-icons'; // https://icons.expo.fyi/
import { createNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem, } from '@react-navigation/drawer';  //  https://reactnavigation.org/docs/drawer-based-navigation/
import * as Context from './component/Context';
const bookOn = require('../assets/icon/book_on.png');
const bookOff = require('../assets/icon/book_off.png');

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


export function ChatroomContentLayout(props){
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

// 채팅 구성품
export function CustomDrawerContent({navigation}) {

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
export function MyChatRoomScreen({route, navigation}) {  // 채팅방 화면
  const [messages, setMessages] = useState([]);
  const { getUserData } = useContext(Context.UserContext);
  const id = route.params.id;
  const userData = getUserData();
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
