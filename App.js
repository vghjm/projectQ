import React, { useRef, useState, useCallback, useEffect } from 'react';
import { AppState, Clipboard, Dimensions , ActivityIndicator, Platform,TouchableHighlight, TouchableWithoutFeedback, AsyncStorage, ImageBackground, Text, View, StyleSheet, TouchableOpacity, TextInput, CheckBox, KeyboardAvoidingView, Alert, Button, ScrollView, SafeAreaView, Image }
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
import { Notifications } from 'expo'; // https://docs.expo.io/versions/latest/sdk/notifications/
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

//jj
// my component
import InlineTextInput from './component/InlineTextInput';
import LoginNavigation from './component/LoginForm';
import {ThemeContext, AuthContext, SystemContext} from './component/Context';
import {HTTP, PUSH_REGISTRATION_ENDPOINT} from './component/utils/constants';
import IntroNavigation from './component/IntroForm';
import * as Connection from './component/ServerConnect';
import * as Storage from './component/StorageControll';
//import {DynamicDiaryScreen, DraggableDiary, BasiceDiary} from './component/Diary';



const defaultImg = {uri: "https://www.daelim.ac.kr/coming_soon.jpg"};
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

const Tab = createMaterialTopTabNavigator();
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

let dataList = [];
let informData = {
  introduction: [],
  help: [],
  notice: [],
};
let pushList = [];
let userData;
import * as TestData from './testData';


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


// 푸시
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
  chatroom.lastMessage = newMessage.text;
  chatroom.lastPushed = {pushTime: Moment(), questIndex: randomIndex, solved:false};
}
function pushTestHandler(updateScreenHandler){  // 간단한 푸시 테스트함수
  let pushTestId = chooseRandomly(userData.mySubscribeList).id;
  if(pushTestId != null){
    pushMessage(pushTestId);
    updateScreenHandler();  // 화면 강제 업데이트
  }
}
// 다이어리 html
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

// 테스트
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
  const [newChatMessageCount, setNewChatMessageCount] = useState(0);

  useFocusEffect(() => {
    let newCount = getAllNewMessageCount();
    if(newChatMessageCount != newCount){
      setNewChatMessageCount(newCount);
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
            return <MaterialCommunityIcons name={iconName} size={size} color={tintcolor} />;
          } else if (route.name === 'MyChatListScreen') {
            iconName = focused ? 'chat' : 'chat-outline';

            return (
              <View>
                <MaterialCommunityIcons name={iconName} size={size} color={tintcolor} />
                {newChatMessageCount > 0
                  ? <View style={{height:12, width:16, borderRadius:8, backgroundColor: 'red', position:'absolute', right:-7, top:-2, alignItems: 'center', justifyContent: 'center'}}>
                      <Text style={{fontSize: 9, color:'white'}}>{newChatMessageCount}</Text>
                    </View>
                  : null
                }
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
  //const data = props.data;

  //console.log('ChatroomContentLayout\n', data);
  //const data = dataList[id-1];
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
    <TouchableHighlight style={{marginBottom: 10}} onPress={()=>props.nav.navigate('chatroom', {id: id, data:data})}>
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
function MyChatListScreen({navigation, route}){
  const [noSubscribe, setNoSubscribe] = useState(true);
  const [numberOfChatroom, setNumberOfChatroom] = useState(userData.myChatroomList.length);
  const [listViewData, setListViewData] = useState(userData.myChatroomList);
  const [updateChatListScreen, setUpdateChatListScreen] = useState(0);

  const getPushMessage = () => {
    setUpdateChatListScreen(updateChatListScreen + 1);
  }

  const NoSubscribeInform = (navigation) => {
    return (
      <TouchableOpacity onPress={()=>{ navigation.navigate('SubscribeListScreen'); Alert.alert('상품을 구독해 보세요', '구독한 상품정보를 받을 수 있습니다.', [{text: '확인'}])}}>
        <View style={{flexDirection: 'row', height: 56, margin: 10, borderWidth: 1, borderRadius: 8, borderColor: 'gray', alignItems: 'center'}}>
          <Image source={null} style={{height: 40, width: 40, margin: 16, borderRadius: 8, backgroundColor: '#DDD'}}/>
          <Text style={{marginLeft: 15, fontSize: 17, width: 220}}>원하는 상품을 구독해보세요!</Text>
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
    //console.log('diary Count: ', numberOfDiary, userData.myDiaryList.length);
    //console.log(userData.myDiaryList);
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
            <DraggableDiary key={obj.id} dataList={dataList} userData={userData} id={obj.id} nav={navigation} changePosHandler={changePosHandler} updateDiary={updateDiary} cancelDrag={changeCnacelScrollHandler}/> :
            <BasiceDiary key={obj.id} dataList={dataList} userData={userData} id={obj.id} nav={navigation} changePosHandler={changePosHandler}/>
        })}
      </View>
    </ScrollView>
  );
}

// 메인스택
import * as MyPage from './component/MyPage';
import ChatroomScreen from './component/Chatroom';
import Subscribe from './component/Subsciribe';
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
// 우측상단 메뉴
//let pressDiaryEditButton = false;  // diary 편집버튼 누름 상태값

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
      <Text style={{fontWeight: 'bold', marginRight: 20, fontSize: 20, color: 'gray'}}>{text}</Text>
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
        component={ChatroomScreen}
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
        component={Subscribe}
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
        component={MyPage.MyPageScreen}
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
        component={MyPage.MyChangePasswordPage}
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
        component={MyPage.UserHistoryPage}
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
        component={MyPage.ServiceCenterPage}
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
        component={MyPage.ServiceIntroductionPage}
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
        component={MyPage.HelpPage}
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
        component={MyPage.NoticePage}
      />
    </Stack.Navigator>
  );
}

import * as PushNotification from './component/PushNotification';
// app . json
function CustomDrawerContent({navigation}) {

  const unSubscribe = (id) => {
    userData.mySubscribeList.splice(userData.mySubscribeList.findIndex(obj => obj.id===id), 1);
    //dataList[id-1].isSubscribe = false;
    const data = dataList[dataList.findIndex(obj => obj.id===id)];
    data.isSubscribe = false;

  }
  const deleteChatroom = (id) => {
    userData.myChatroomList.splice(userData.myChatroomList.findIndex(obj => obj.id===id), 1);
    //dataList[id-1].hasChatroom = false;
    const data = dataList[dataList.findIndex(obj => obj.id===id)];
    data.hasChatroom = false;
  }

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
export default function App() {
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'END_LOADING_FIRST_LOGIN':
          // 첫 실행 -> 인트로 화면 띄움
          return {
            ...prevState,
            nowLoading: false,
          };
        case 'END_LOADING_LOGIN_PAGE':
          // 로그인 화면으로 이동
          return {
            ...prevState,
            nowLoading: false,
            intro: false,
          };
        case 'END_LOADING_RESTORE_DATA':
          // 자동로그인, 데이터 로딩 후 바로 사용화면으로 이동
          return {
            ...prevState,
            nowLoading: false,
            intro: false,
            login: true,
            token: action.token,
          };
        case 'LOGIN':
          // 유저정보 받아 사용자 화면으로 이동
          return {
            ...prevState,
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
      devMode: false,
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
          let pushRegistered = await registerForPushNotificationsAsync({email: data.email, username:response.data.username});

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
        //userData = await Storage.updateDataSet(dataList, data);
        console.log('token:', data.token);
        console.log('login start');
        userData = await Storage.updateDataSet(dataList, data);
        console.log('\nlogin: ', userData);
        //console.log('\ndataList: \n', dataList);
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
      manualStart: () => {

      },
    }),
    []
  );  // 유저 인증 함수 등록

  const [notification, setNotification] = useState(null);
  const [loaded, error] = Font.useFonts({
    UhBeeSeulvely: require('./assets/font/UhBeeSeulvely.ttf'),
  });

  const handleNotification = (notify) => {
    setNotification(notify);
    console.log('notification', notify);
  };
  const registerForPushNotificationsAsync = async (userData) => {
    const { status } = await Permissions.getAsync(Permissions.NOTIFICATIONS);

    if (status !== 'granted') {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      alert(`${status}`);
      if (status !== 'granted') {
        return;
      }
    }

    const token = await Notifications.getExpoPushTokenAsync();

    Notifications.addListener(handleNotification);
    console.log(`registerForPushNotificationsAsync\ntoken: ${token}\nemail: ${userData.email}, username: ${userData.username}`);
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
          email: userData.email,
          username: userData.username,
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
  const [productData, setProductData] = useState({
    0: {
        isAvailable: true,
        title: '상품제목',
        text: '상품 설명',
        imageSet: {thumbnailImg: defaultImg, logoImg: defaultImg, mainImg: defaultImg, avatarImg: defaultImg},
        questionList: ['상품질문1','상품질문2','상품질문3'],
        ansList: ['질문의 답변1','질문의 답변2','질문의 답변3'],
        isRandomPushType: false, pushStartTime: Moment(), pushEndTime: Moment(),
    },
  });
  const [loadProductData, setLoadProductData] = useState(false);
  const [updateCacheData, setUpdateCacheData] = useState(false);

  const initAsync = async () => {

  };
  const bootstrapAsync = async () => {
    console.log('시작시간 : ', Moment().toDate());

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
      .then(autoLogin => {
        setUpdateCacheData(true);
        if(autoLogin.ok){
          let token = autoLogin.data.token;
          //dispatch({type: 'END_LOADING_RESTORE_DATA', action: token});
        }else{
          let isFirstLogin = autoLogin.data.isFirstLogin;
          //isFirstLogin ? dispatch({type: 'END_LOADING_FIRST_LOGIN', action: token}) : dispatch({type: 'END_LOADING_LOGIN_PAGE', action: token});
        }
      });
  };

  // *************************************                  백그라운드 및 Inactive 감지 함수
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  useEffect(() => {
    AppState.addEventListener("change", _handleAppStateChange);
    bootstrapAsync();
    //registerForPushNotificationsAsync({email: 'abc123@naver.com', username:'인간1'})
    return () => {
      AppState.removeEventListener("change", _handleAppStateChange);
    };
  }, []);

  const _handleAppStateChange = (nextAppState) => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      console.log("App has come to the foreground!");
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
  const defaultLogin = async () => {
    console.log('자동 로그인 ~');
    const {signIn, login} = authContext;
    let email = 'abc123@naver.com';
    let password = 'abc123';

    let response = await signIn({email: email, password:password});
    if(response.ok) login({token: response.data.token, username: response.data.username, email: email, password: password});
    else {
      userData = _.cloneDeep(TestData.userTestData);
      dispatch({ type: 'LOGIN', token:data.token });
    }
  };
  const noNetworkLogin = async () => {
    console.log('자동 로그인 no network~');
    userData = TestData.userTestData;
    dataList = TestData.productTestData;
    informData = TestData.informTestData;
    pushList = TestData.pushTestData;
  };

  const [productdataContext, setProductdataContext] = useState();
  const [userdataContext, setUserdataContext] = useState();
  const [noticedataContext, setNoticedataContext] = useState();
  const systemContext = React.useMemo(
    () => ({
      function: () => {},
    }),
    []
  );

  const [devCache, setDevCache] = useState({
    token: '',
    isFirstLogin: true,
  });

  const [showPushNotification, setShowPushNotification] = useState(true);

  return (
    <ThemeContext.Provider value={theme}>
    <AuthContext.Provider value={authContext}>
      {state.devMode === true ? (
        <View style={{flex:1, marginTop:30, alignItems: 'center', justifyContent: 'center'}}>
          <Text>스플래쉬 화면</Text>
          <Text> 유저 정보 여부에 따라 다음으로 분기 </Text>
          <TouchableOpacity style={{margin: 10}} onPress={defaultLogin}>
            <Text> - 저장된 계정 있음(자동 로그인)</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{margin: 10}} onPress={()=>{dispatch({ type: 'END_LOADING_FIRST_LOGIN'})}}>
            <Text> - 저장된 계정 있음(자동 X)</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{margin: 10}} onPress={()=>{dispatch({ type: 'END_LOADING_LOGIN_PAGE'})}}>
            <Text> - 저장된 계정 없음</Text>
          </TouchableOpacity>
          <Text style={{padding:5, color:loadProductData?'blue':'red'}}>{'상품정보 로딩: ' + loadProductData}</Text>
          <Text style={{padding:5, color:updateCacheData?'blue':'red'}}>{'캐쉬정보 로딩: ' + updateCacheData}</Text>
          <TouchableOpacity style={{margin: 10}} onPress={updateFunction}>
            <Text>업데이트 상품정보</Text>
          </TouchableOpacity>
        </View>
      ) : state.nowLoading === true ? (
        <View style={{flex:1, marginTop:30, alignItems: 'center', justifyContent: 'center'}}>
          <Text>스플래쉬 화면</Text>
          <Text> 유저 정보 여부에 따라 다음으로 분기 </Text>
          <TouchableOpacity style={{margin: 10}} onPress={defaultLogin}>
            <Text> - 저장된 계정 있음(자동 로그인)</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{margin: 10}} onPress={()=>{dispatch({ type: 'END_LOADING_FIRST_LOGIN'})}}>
            <Text> - 저장된 계정 있음(자동 X)</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{margin: 10}} onPress={()=>{dispatch({ type: 'END_LOADING_LOGIN_PAGE'})}}>
            <Text> - 저장된 계정 없음</Text>
          </TouchableOpacity>
          <Text style={{padding:5, color:loadProductData?'blue':'red'}}>{'상품정보 로딩: ' + loadProductData}</Text>
          <Text style={{padding:5, color:updateCacheData?'blue':'red'}}>{'캐쉬정보 로딩: ' + updateCacheData}</Text>
          <TouchableOpacity style={{margin: 10}} onPress={updateFunction}>
            <Text>업데이트 상품정보</Text>
          </TouchableOpacity>
        </View>
      ) : state.noAuth === true ? (
        <View style={{flex:1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
          <Text style={{fontSize:20}}>권한이 필요합니다.</Text>
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
      {showPushNotification && <PushNotification.PushMessage />}
    </AuthContext.Provider>
    </ThemeContext.Provider>
  );
}

// 다이어리가
// 드래그기능 있는 다이어리
function diarySortByDate(myDiaryMessageList){
  myDiaryMessageList.sort((a, b) => {
    return a.createdAt > b.createdAt;
  });
}
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
      <AnimatableDiaryComponent id={id} nav={nav} updateDiary={updateDiary} />
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
