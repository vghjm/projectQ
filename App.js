import React, { useRef, useState, useCallback, useEffect, useContext} from 'react';
import { AppState, Vibration, Clipboard, Dimensions , ActivityIndicator, Platform,TouchableHighlight, TouchableWithoutFeedback, AsyncStorage, ImageBackground, Text, View, StyleSheet, TouchableOpacity, TextInput, CheckBox, KeyboardAvoidingView, Alert, Button, ScrollView, SafeAreaView, Image }
from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, getFocusedRouteNameFromRoute, useFocusEffect } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createStackNavigator } from '@react-navigation/stack';
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
import Hyperlink from 'react-native-hyperlink'; // https://www.npmjs.com/package/react-native-hyperlink
import * as WebBrowser from 'expo-web-browser';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import Draggable from 'react-native-draggable'; // https://github.com/tongyy/react-native-draggable
import * as Animatable from 'react-native-animatable'; // https://github.com/oblador/react-native-animatable
import { SwipeListView } from 'react-native-swipe-list-view'; // https://www.npmjs.com/package/react-native-swipe-list-view
//import * as Haptics from 'expo-haptics';

// my component
import InlineTextInput from './component/InlineTextInput';
import LoginNavigation from './component/LoginForm';
import {ThemeContext, AuthContext, SystemContext} from './component/Context';
import {HTTP, PUSH_REGISTRATION_ENDPOINT} from './component/utils/constants';
import IntroNavigation from './component/IntroForm';
import * as Connection from './component/ServerConnect';
import * as Storage from './component/StorageControll';
import {DynamicDiaryScreen, DraggableDiary, BasicDiary} from './component/Diary';
import * as MyPage from './component/MyPage';
import ChatroomScreen from './component/Chatroom';
import Subscribe from './component/Subsciribe';
import * as PushNotification from './component/PushNotification';
import CustomDrawerContent from './component/CustomDrawerContent';




const defaultImg = {uri: "https://www.daelim.ac.kr/coming_soon.jpg"};
const logo = require('./assets/img/icon.png');
const bookOn = require('./assets/icon/book_on.png');
const bookOff = require('./assets/icon/book_off.png');
const priceTag = require('./assets/icon/price-tag.png');
const priceTagB = require('./assets/icon/price-tag_b.png');
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

const Tab = createMaterialTopTabNavigator();
const Stack = createStackNavigator();
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
import * as TestData from './testData';


// 기기 화면 사이즈
const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

// 컨트롤 변수
let pressDiaryEditButton = false;  // diary 편집버튼 누름 상태값
var global_p_id = 0;               // 채팅창 사이드 메뉴에서 다른 상품정보로 보내기 위한 상품 id 값
var editDiaryTextMode = false;     // 다이어리 편집모드 상태값
var global_y = 0;         // 다이어리리스트 스크린의 스크롤 값

// 유용한 함수
function chooseRandomIndex(a){
  return Math.floor(Math.random() * a.length);
}
function chooseRandomly(a){
  return a[Math.floor(Math.random() * a.length)];
}


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

// 테스트
function TestScreen({navigation}){
  const [mytext, setMytext] = useState('빈 텍스트 칸');
  let url;

  const printToPdf = async () => {
      let html;

      let responsePDF = await Connection.makeLink(userData.token, dataList[1].diary.id, 1);
      if(responsePDF.ok){
        html = responsePDF.data.htmls;
        console.log('printToPdf: ', html);
      }else{
        Alert.alert('printToPdf ERROR', responsePDF.message);
        return;
      }

      // https://forums.expo.io/t/expo-print-creating-pdf-and-giving-it-a-file-name/36164
      const responsePrintToFile = await Print.printToFileAsync({ html: html });

      const pdfName = `${responsePrintToFile.uri.slice(
          0,
          responsePrintToFile.uri.lastIndexOf('/') + 1
      )}testPDF_${Moment()}.pdf`;

      await FileSystem.moveAsync({
          from: responsePrintToFile.uri,
          to: pdfName,
      });
      sharePdf(pdfName)
  }

  const sharePdf = (url) => {
      Sharing.shareAsync(url)
  }

  const shareWithLink = async () => {
    let responseMakeLink = await Connection.makeLink(userData.token, dataList[1].diary.id, 0);
    if(responseMakeLink.ok){
      url = responseMakeLink.data.linkname;
      console.log('shareWithLink: ', responseMakeLink.data.linkname);
    }else{
      Alert.alert('shareWithLink ERROR', responseMakeLink.message);
    }

    Clipboard.setString(url);
    Alert.alert('링크가 클립보드에 저장됨');
  }

  const showUserData = () => {
    console.log('\nuserData: \n', userData);
  }
  const showDataList = () => {
    console.log('\ndataList: \n', dataList);
  }

  return (
    <ScrollView>
    <View style={{flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: screenHeight-60}}>
      <Text style={{fontFamily: 'NanumMyeongjo'}}>기능 테스트 공간</Text>
      <TouchableOpacity onPress={printToPdf} style={{margin:20}}>
        <Text style={{fontFamily: 'NanumMyeongjo'}}>PDF 생성</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={shareWithLink} style={{margin:20}}>
        <Text style={{fontFamily: 'NanumMyeongjo'}}>링크공유</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={showUserData} style={{margin:20}}>
        <Text style={{fontFamily: 'NanumMyeongjo'}}>user data show</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={showDataList} style={{margin:20}}>
        <Text style={{fontFamily: 'NanumMyeongjo'}}>dataList show</Text>
      </TouchableOpacity>
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
function MainPageScreen({navigation, route}){
  const [newChatMessageCount, setNewChatMessageCount] = useState(0);
  const theme = useContext(ThemeContext);

  useFocusEffect(() => {
    let newCount = getAllNewMessageCount();
    if(newChatMessageCount != newCount){
      setNewChatMessageCount(newCount);
    }
  });

  return (
    <Tab.Navigator
      backBehavior={'initialRoute'} initialRouteName={'MyChatListScreen'}
      swipeEnabled={false}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, tintcolor  }) => {
          let iconName;
          let size = 24;
          if (route.name === 'SubscribeListScreen') {
            iconName = focused ? 'clockcircle' : 'clockcircleo';
            return <AntDesign name={iconName} size={size} color={tintcolor} />;
          } else if (route.name === 'MyChatListScreen') {
            iconName = focused ? 'chat' : 'chat-outline';

            return (
              <View>
                <MaterialCommunityIcons name={iconName} size={size+2} color={tintcolor} />
                {newChatMessageCount > 0
                  ? <View style={{height:14, width:14, borderRadius:7, backgroundColor: theme.light[2], position:'absolute', right:-6, top:-3, alignItems: 'center', justifyContent: 'center'}}>
                      <Text style={{fontSize: 10, color:'white'}}>{newChatMessageCount}</Text>
                    </View>
                  : null
                }
              </View>);
          } else if (route.name === 'MyDiaryScreen') {
            if (focused) {
              //return <FontAwesome name="bookmark" size={size} color={tintcolor } />;
              return <Image source={priceTagB} style={{width: 23, height: 23}}/>
            }else {
              //return <Feather name="bookmark" size={size} color={tintcolor } />;
              return <Image source={priceTag} style={{width: 22, height: 22}}/>
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
          borderTopWidth:1,
          borderColor: '#eee',
          backgroundColor: 'white',
          height: 45,
        },
      }}
    >
      <Tab.Screen name="SubscribeListScreen"  component={SubscribeListScreen}/>
      <Tab.Screen name="MyChatListScreen"  component={MyChatListScreen} />
      <Tab.Screen name="MyDiaryScreen"  component={MyDiaryScreen} />
      <Tab.Screen name="testScreen"  component={TestScreen} />
    </Tab.Navigator>
  );
}
function SubscribeContentLayout(props){
  let data = props.data;
  let productInfo = data.product;
  //console.log('SubscribeContentLayout\n', productInfo);
  //const productInfo = dataList[id-1].product;

  return (
    <TouchableOpacity onPress={()=>props.nav.navigate('contentScreen', {id: data.id})}>
    <View style={{flexDirection: 'row', height: 56, margin: 3, marginBottom: 10}}>
      <Image resizeMode='cover' source={productInfo.imageSet.thumbnailImg} style={{height: 46, borderWidth: 1, borderColor: '#f7f7f7', width: 46, margin: 5, borderRadius: 23, backgroundColor: '#DDD'}}/>
      <View style={{flexDirection: 'column'}}>
        <Text style={{fontFamily: 'NanumMyeongjo', marginLeft: 10, marginTop: 6, fontSize: 17,fontWeight: '400', width: 220}}>{productInfo.title}</Text>
        <Text numberOfLines={1} style={{fontFamily: 'NanumMyeongjo', color: '#AAA', fontSize: 12, marginLeft: 13, marginTop:3, width: 230}}>{productInfo.text}</Text>
      </View>
    </View>
    </TouchableOpacity>
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
        <Text style={{fontFamily: 'NanumMyeongjo', margin:10, fontSize: 17}}>내 구독 상품</Text>
          {dataList.map(data => {
            if(data.isSubscribe) return <SubscribeContentLayout key={uuid()} data={data} nav={navigation}/>
          })}
        <View style={{left:10, right:10, backgroundColor: '#f0f0f0', height:1, marginVertical:7, width: screenWidth*0.98}}/>
        <Text style={{fontFamily: 'NanumMyeongjo', margin:10, marginTop:5, borderTopWidth: 1, fontSize: 17, borderColor: '#CCC'}}>구독 가능한 상품</Text>
          {dataList.map(data => {
            if(!data.isSubscribe) return <SubscribeContentLayout key={uuid()} data={data} nav={navigation}/>
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
function ChatroomContentLayout(props){
  const id = props.id;
  const data = dataList[dataList.findIndex(obj => obj.id===id)];
  const theme = useContext(ThemeContext);

  const productInfo  = data.product;
  const [lastMessageTime, setLastMessageTime] = useState(data.chatroom.lastMessageTime);  // 최신 메세지 업데이트 시간
  const [newItemCount, setNewItemCount] = useState(data.chatroom.newItemCount);   // 최신 알림 수
  const [fromNowTime, setFromNowTime] = useState(lastMessageTime.fromNow());  // 최신 메세지 업데이트 시간, 자연적인 설명버전
  const [topMessage, setTopMessage] = useState(data.chatroom.lastMessage);

  useFocusEffect(()=>{
    if(newItemCount !== data.chatroom.newItemCount){
      setNewItemCount(data.chatroom.newItemCount);
    }
    if(lastMessageTime !== data.chatroom.lastMessageTime){
      setLastMessageTime(data.chatroom.lastMessageTime);
    }
    if(fromNowTime !== lastMessageTime.fromNow()){
      setFromNowTime(lastMessageTime.fromNow());
    }
    if(topMessage !== data.chatroom.lastMessage){
      setTopMessage(data.chatroom.lastMessage);
    }
  });

  return (
    <TouchableHighlight style={{marginBottom: 10}} onPress={()=>props.nav.navigate('chatroom', {id: id})}>
    <View style={{flexDirection: 'row', height: 60, backgroundColor: 'white'}}>
      <Image source={productInfo.imageSet.thumbnailImg} style={{height: 46, width: 46, margin: 5,borderWidth: 1, borderColor: '#f7f7f7', marginLeft: 10, borderRadius: 23, backgroundColor: '#DDD'}}/>
      <View style={{flexDirection: 'column'}}>
        <Text style={{fontFamily: 'NanumMyeongjo', marginLeft: 10, marginTop: 6, fontSize: 17,fontWeight: '400', width: 220}}>{productInfo.title}</Text>
        <Text numberOfLines={1} style={{fontFamily: 'NanumMyeongjo', color: '#AAA', fontSize: 12, marginLeft: 13, marginTop:3, width: 230}}>{topMessage}</Text>
      </View>
      <View style={{flex:1, flexDirection: 'column', alignItems: 'flex-end'}}>
        <Text style={{fontFamily: 'NanumMyeongjo', fontSize: 10, marginRight: 10, marginTop: 0}}>{fromNowTime}</Text>
        {newItemCount > 0 && <View style={{height: 10, width: 10, borderRadius: 5, backgroundColor: theme.light[2], margin: 6, marginRight: 10, marginTop: 12, alignItems: 'center', justifyContent: 'center'}}/>}
      </View>
    </View>
    </TouchableHighlight>
  );
}
function MyChatListScreen({navigation, route}){
  const [noSubscribe, setNoSubscribe] = useState(true);
  const [numberOfChatroom, setNumberOfChatroom] = useState(userData.myChatroomList.length);
  const [listViewData, setListViewData] = useState(userData.myChatroomList);
  const [updateChatListScreen, setUpdateChatListScreen] = useState(0);
  const {popupPushMessage} = useContext(SystemContext);

  const getPushMessage = () => {
    setUpdateChatListScreen(updateChatListScreen + 1);
  }

  const NoSubscribeInform = (navigation) => {
    return (
      <TouchableOpacity onPress={()=>{ navigation.navigate('SubscribeListScreen'); Alert.alert('상품을 구독해 보세요', '구독한 상품정보를 받을 수 있습니다.', [{text: '확인'}])}}>
        <View style={{flexDirection: 'row', height: 56, margin: 10, borderWidth: 1, borderRadius: 8, borderColor: 'gray', alignItems: 'center'}}>
          <Image source={null} style={{height: 40, width: 40, margin: 16, borderRadius: 8, backgroundColor: '#DDD'}}/>
          <Text style={{fontFamily: 'NanumMyeongjo', marginLeft: 15, fontSize: 17, width: 220}}>원하는 상품을 구독해보세요!</Text>
        </View>
      </TouchableOpacity>
    );
  }

  useFocusEffect(()=>{
    if(userData.mySubscribeList.length === 0 && noSubscribe===false || userData.mySubscribeList.length != 0 && noSubscribe===true) setNoSubscribe(!noSubscribe);
    if(numberOfChatroom != userData.myChatroomList.length) {
      setNumberOfChatroom(userData.myChatroomList.length);
      setListViewData(userData.myChatroomList);
    }
  });

  // 푸시
  const pushMessage = (id) => {
    // 랜덤한 질문 메시지를 만들어 채팅방에 추가함
    let data = dataList[dataList.findIndex(obj => obj.id===id)];
    let product = data.product;
    let chatroom = data.chatroom;
    let avatar = product.imageSet.avatarImg.uri?? product.imageSet.avatarImg;
    let randomIndex = chooseRandomIndex(product.questionList);
    let newMessage = { _id: uuid.v4(), text: product.questionList[randomIndex].content, createdAt: Moment(),
      user: { _id:2, avatar: avatar}
    };
    chatroom.newItemCount += 1;
    chatroom.chatmessageList.unshift(_.cloneDeep(newMessage));
    chatroom.lastMessageTime = Moment();
    chatroom.lastMessage = newMessage.text;
    chatroom.lastPushed = {pushTime: Moment(), questIndex: randomIndex, solved:false};
    popupPushMessage({
      image: product.imageSet.thumbnailImg,
      title: product.title,
      text: newMessage.text,
      onPress: ()=>navigation.navigate('chatroom', {id: id, data:data}),
      lastPushed: Moment(),
      isPushShowed: true,
    });
  }
  const pushTestHandler = (updateScreenHandler) => {  // 간단한 푸시 테스트함수
    let pushTestId = chooseRandomly(userData.mySubscribeList).id;
    if(pushTestId != null){
      pushMessage(pushTestId);
      updateScreenHandler();  // 화면 강제 업데이트
    }
  }

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
  const [editMode, setEditMode] = useState(false);    // 편집모드 중인경우 애니메이션 기능
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
    if(editMode != pressDiaryEditButton) setEditMode(pressDiaryEditButton);
    if(numberOfDiary != userData.myDiaryList.length){
      setNumberOfDiary(userData.myDiaryList.length);
      setBackgroundWidthFunc();
    }
  });

  return (
    <ScrollView canCancelContentTouches={cancelScroll} bounces={false} onScroll={(event) => {global_y = event.nativeEvent.contentOffset.y}}>
      <View style={{width: screenWidth, height: backgroundWidth, backgroundColor: 'white'}}>
        {numberOfDiary < 1 && <View style={{fontFamily: 'NanumMyeongjo', flex:1, flexDirection: 'column',  justifyContent: 'center', alignItems: 'center'}}><Text style={{fontFamily: 'NanumMyeongjo'}}>생성된 다이어리가 없습니다.</Text></View>}
        {userData.myDiaryList.map((obj) => {
          return editMode ?
            <DraggableDiary key={obj.id} id={obj.id} nav={navigation} changePosHandler={changePosHandler} updateDiary={updateDiary} cancelDrag={changeCnacelScrollHandler}/> :
            <BasicDiary key={obj.id} id={obj.id} nav={navigation} changePosHandler={changePosHandler}/>
        })}
      </View>
    </ScrollView>
  );
}

// 메인스택

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



function mainHeaderRightHandler(route, navigation){
  var handler = ()=>myButtonHandler();
  var title = getHeaderTitle(route, '채팅');
  var text = 'My';

  const editDiaryButtonHandler = (route, navigation) => {
    pressDiaryEditButton = true;

    return navigation.navigate('MyDiaryScreen', {editMode: true});
  }
  const completeDiaryButtonHandler = (route, navigation) => {
    pressDiaryEditButton = false;

    return navigation.navigate('MyDiaryScreen', {editMode: false});
  }

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
      <Text style={{fontFamily: 'NanumMyeongjo_bold', marginRight: 20, fontSize: 20, color: 'gray'}}>{text}</Text>
    </TouchableOpacity>
  );
}
function myButtonHandler(route, navigation) {return navigation.navigate('MyServicePage');}
function MainStackHomePage({navigation}) {
  const chatSettingButtonHandler = (navigation) => {return navigation.openDrawer();}

  return (
    <Stack.Navigator screenOptions={{}}>
      <Stack.Screen
        name="MainPage"
        options={({route, navigation})=>({
          headerTitle: getHeaderTitle(route, '채팅'),
          headerTitleAlign: 'left',
          headerTitleStyle: {fontSize: 20, fontFamily: 'NanumMyeongjo_bold'},
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
          headerTitleStyle: {fontSize: 20, fontFamily: 'NanumMyeongjo_bold'},
          cardStyle: {backgroundColor: 'white'},
          headerBackTitleVisible: false,
          headerTintColor: 'black',
          headerRight: (props) => (
            <TouchableOpacity
            onPress={() => chatSettingButtonHandler(navigation)}
            >
              <Octicons name="three-bars" style={{marginRight:11, marginTop:2}} size={27} color="black" />
            </TouchableOpacity>
          ),
        }}
        component={ChatroomScreen}
      />
      <Stack.Screen
        name="contentScreen"
        options={{
          title: "",
          headerTitleAlign: 'center',
          headerTitleStyle: {fontSize: 20, fontFamily: 'NanumMyeongjo_bold'},
          cardStyle: {backgroundColor: 'white'},
          headerBackTitleVisible: false,
          headerTintColor: 'black',
          headerTransparent: true,
        }}
        component={Subscribe}
      />
      <Stack.Screen
        name="Diary"
        options={{
          title: "내 다이어리",
          headerTitleAlign: 'center',
          headerTitleStyle: {fontSize: 20, fontFamily: 'NanumMyeongjo_bold'},
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
          headerTitleStyle: {fontSize: 20, fontFamily: 'NanumMyeongjo_bold'},
          headerBackTitleVisible: false,
          headerTintColor: 'black',
          cardStyle: {backgroundColor: 'white'},
          }}
        component={MyPage.MyPageScreen}
      />
      <Stack.Screen
        name="ChangePassword"
        options={{
          title: "비밀번호 변경",
          headerTitleAlign: 'center',
          headerTitleStyle: {fontSize: 20, fontFamily: 'NanumMyeongjo_bold'},
          headerBackTitleVisible: false,
          headerTintColor: 'black',
          cardStyle: {backgroundColor: 'white'},
          }}
        component={MyPage.MyChangePasswordPage}
      />
      <Stack.Screen
        name="UserHistory"
        options={{
          title: "이용 내역",
          headerTitleAlign: 'center',
          headerTitleStyle: {fontSize: 20, fontFamily: 'NanumMyeongjo_bold'},
          headerBackTitleVisible: false,
          headerTintColor: 'black',
          cardStyle: {backgroundColor: 'white'},
          }}
        component={MyPage.UserHistoryPage}
      />
      <Stack.Screen
        name="ServiceCenter"
        options={{
          title: "고객센터",
          headerTitleAlign: 'center',
          headerTitleStyle: {fontSize: 20, fontFamily: 'NanumMyeongjo_bold'},
          headerBackTitleVisible: false,
          headerTintColor: 'black',
          cardStyle: {backgroundColor: 'white'},
          }}
        component={MyPage.ServiceCenterPage}
      />
      <Stack.Screen
        name="ServiceIntroduction"
        options={{
          title: "서비스 소개",
          headerTitleAlign: 'center',
          headerTitleStyle: {fontSize: 20, fontFamily: 'NanumMyeongjo_bold'},
          headerBackTitleVisible: false,
          headerTintColor: 'black',
          cardStyle: {backgroundColor: 'white'},
          }}
        component={MyPage.ServiceIntroductionPage}
      />
      <Stack.Screen
        name="Help"
        options={{
          title: "도움말",
          headerTitleAlign: 'center',
          headerTitleStyle: {fontSize: 20, fontFamily: 'NanumMyeongjo_bold'},
          headerBackTitleVisible: false,
          headerTintColor: 'black',
          cardStyle: {backgroundColor: 'white'},
          }}
        component={MyPage.HelpPage}
      />
      <Stack.Screen
        name="Notice"
        options={{
          title: "공지사항",
          headerTitleAlign: 'center',
          headerTitleStyle: {fontSize: 20, fontFamily: 'NanumMyeongjo_bold'},
          headerBackTitleVisible: false,
          headerTintColor: 'black',
          cardStyle: {backgroundColor: 'white'},
          }}
        component={MyPage.NoticePage}
      />
    </Stack.Navigator>
  );
}


// app . json

async function getPermission(){
  let reply = {ok:false, data: '', message:''};
  const {status} = await Permissions.askAsync(Permissions.NOTIFICATIONS);
  const camera = await Permissions.askAsync(Permissions.CAMERA_ROLL);
  let errorCount = 0;


  if (status !== 'granted') {
    Alert.alert('푸시 권한이 필요합니다.', `status: ${status}`);
    errorCount++;
  }

  if(camera.status !== 'granted'){
    Alert.alert('카메라 권한이 필요합니다.');
    errorCount++;
  }

  if(errorCount === 0){
    reply.ok = true;
  }

  return reply;
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
        case 'UPDATE':
          // 유저정보 갱신용
          return {
            ...prevState,
            update: state.update + 1,
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
      update: 1,
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

  const [notification, setNotification] = useState(null);
  const [loaded, error] = Font.useFonts({
    UhBeeSeulvely: require('./assets/font/UhBeeSeulvely.ttf'),
    NanumMyeongjo: require('./assets/font/NanumMyeongjo.ttf'),
    NanumMyeongjo_bold: require('./assets/font/NanumMyeongjoExtraBold.ttf'),
  });

  const handleNotification1 = ({request}) => {
    let content = request.content
    let q_id = content.data.q_ID[0];
    let message = content.body;
    console.log(`\n notify receive  - q_ID: ${q_id}, message: ${message}`);
    popupPushMessage();
  };
  const handleNotification2 = (notify) => {
    setNotification(notify);
    console.log('notification2', notify);
  };
  const registerForPushNotificationsAsync = async (data) => {
    const { status } = await Permissions.getAsync(Permissions.NOTIFICATIONS);

    if (status !== 'granted') {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      alert(`${status}`);
      if (status !== 'granted') {
        return;
      }
    }

    const token = await Notifications.getExpoPushTokenAsync();

    Notifications.addNotificationReceivedListener(handleNotification1);
    Notifications.addNotificationResponseReceivedListener(handleNotification2);
    console.log(`registerForPushNotificationsAsync\ntoken: ${token}\nemail: ${data.email}, username: ${data.username}`);
    //Alert.alert('registerForPushNotificationsAsync', `token: ${token}\nemail: ${userData.email}, username: ${userData.username}`);

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

  const [theme, setTheme] = useState({
    default: '#E6E5EB',
    light: ['#e8efd9','#d7e4bd', '#b9c89c', '#7C9151', '#48375F'],
    red: '#5F5F5F',
    logo: logo,
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
    console.log('\nbootstrapAsync\n시작시간 : ', Moment().toDate());

    let permission = await getPermission();

    //if(!permission.ok) return dispatch({ type: 'NO_AUTH' });

    //await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory+'image/', { intermediates: true });

    Storage.updateProductData()
      .then(response => {
        if(response.ok) {
          //console.log('updateProductData: success\n', response.data);
          dataList = response.data;
          setLoadProductData(true);
        }else{
          console.log('updateProductData: false');
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
        setUpdateCacheData({
          autoLogin: autoLogin,
          email: email,
          password: password,
          isFirstLogin: isFirstLogin,
          isReady: true,
        });
      });
  };

  // *************************************                  백그라운드 및 Inactive 감지 함수
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  let testAccount = {
    use: true,
    email: '77eric@naver.com',
    password: '!!gmltjd',
  }
  useEffect(() => {
    AppState.addEventListener("change", _handleAppStateChange);
    //bootstrapAsync();
    return () => {
      AppState.removeEventListener("change", _handleAppStateChange);
    };
  }, []);
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
  // *************************************                  백그라운드 및 Inactive 감지 함수

  const updateFunction = async () => {
    console.log('update Start');
    bootstrapAsync();
    console.log('update End');
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
            <Text>푸시 뛰우기</Text>
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
        <SystemContext.Provider value={systemContext}>
        <NavigationContainer>
          <Drawer.Navigator drawerPosition='right' drawerStyle={{backgroundColor: '#CCC'}} drawerContent={props => <CustomDrawerContent {...props}/>}>
            <Drawer.Screen name='sidebar' component={MainStackHomePage} options={{swipeEnabled: false}}/>
          </Drawer.Navigator>
        </NavigationContainer>
        </SystemContext.Provider>
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
