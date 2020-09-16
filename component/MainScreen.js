import React, {useState} from 'react';
import {View, Text, Image, ScrollView, TouchableHighlight, TouchableOpacity}
from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useFocusEffect } from '@react-navigation/native';
import { MaterialCommunityIcons, Feather }
from '@expo/vector-icons'; // https://icons.expo.fyi/
import Draggable from 'react-native-draggable'; // https://github.com/tongyy/react-native-draggable

import { SwipeListView } from 'react-native-swipe-list-view'; // https://www.npmjs.com/package/react-native-swipe-list-view

import {DraggableDiary, BasiceDiary} from './Diary';
import {MyChatRoomScreen, ChatroomContentLayout} from './Chatroom';
import {SubscribeContentScreen, SubscribeContentLayout} from './Subscribe';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';


const bookOn = require('../assets/icon/book_on.png');
const bookOff = require('../assets/icon/book_off.png');

const Tab = createMaterialTopTabNavigator();

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

export default function MainPageScreen({navigation, route}){
  const [newChatMessage, setNewChatMessage] = useState(0);

  useFocusEffect(() => {
    //let newCount = getAllNewMessageCount();
    if(newChatMessage != newCount){
      //setNewChatMessage(newCount);
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
              return <Image source={bookOff} style={{width: 23, height: 23}}/>
            }else {
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
