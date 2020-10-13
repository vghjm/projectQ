import React, {useContext, useEffect, useState} from 'react';
import {TouchableOpacity, View, Text, Alert, Clipboard, ScrollView, Image, TouchableHighlight, Dimensions, TextInput} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer, getFocusedRouteNameFromRoute, useFocusEffect } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { MaterialCommunityIcons, AntDesign, Octicons, Feather }
from '@expo/vector-icons'; // https://icons.expo.fyi/
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import uuid from 'react-native-uuid'; // https://www.npmjs.com/package/react-native-uuid
import Moment from 'moment';
import { SwipeListView } from 'react-native-swipe-list-view'; // https://www.npmjs.com/package/react-native-swipe-list-view
import _ from 'lodash'; // https://lodash.com/docs

import {SystemContext, ThemeContext, ChatroomDataContext, SubscribeDataContext, ProductDataContext} from './Context';
import {priceTag, priceTagB} from './utils/loadAssets';
import * as Connection from './ServerConnect';
import {DynamicDiaryScreen, DraggableDiary, BasicDiary} from './Diary';
import ChatroomScreen from './Chatroom';
import SubscribeScreen from './Subsciribe';
import * as MyPage from './MyPage';
import { chooseRandomIndex, chooseRandomly } from './utils/utils';

const Stack = createStackNavigator();
const Tab = createMaterialTopTabNavigator();
const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;
var pressDiaryEditButton = false;

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
function myButtonHandler(route, navigation) {return navigation.navigate('MyServicePage');}
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
function getAllNewMessageCount(chatroomList){
  let newCount = 0;
  chatroomList.forEach(chatroom => {
    newCount += chatroom.newItemCount;
  });
  return newCount;
}

// 테스트
function TestScreen({navigation}){
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
function SubscribeContentLayout(props){
  const product = props.product;
  const subscribe = props.subscribe;

  return (
    <TouchableOpacity onPress={()=>props.nav.navigate('contentScreen', {product: product, subscribe: subscribe})}>
    <View style={{flexDirection: 'row', height: 56, margin: 3, marginBottom: 10}}>
      <Image resizeMode='cover' source={product.thumbnailImg} style={{height: 46, borderWidth: 1, borderColor: '#f7f7f7', width: 46, margin: 5, borderRadius: 23, backgroundColor: '#DDD'}}/>
      <View style={{flexDirection: 'column'}}>
        <Text style={{fontFamily: 'NanumMyeongjo', marginLeft: 10, marginTop: 6, fontSize: 17,fontWeight: '400', width: 220}}>{product.title}</Text>
        <Text numberOfLines={1} style={{fontFamily: 'NanumMyeongjo', color: '#AAA', fontSize: 12, marginLeft: 13, marginTop:3, width: 230}}>{product.text}</Text>
      </View>
    </View>
    </TouchableOpacity>
  );
}
function SubscribeListScreen({navigation}){
  const subscribeList = useContext(SubscribeDataContext);
  const productList = useContext(ProductDataContext);
  let subscribeContent = [], unsubscribeContent = [];

  productList.forEach(product => {
    if(!subscribeList.some(subscribe => {
      if(product.p_id == subscribe.p_id){
        subscribeContent.push({product:product, subscribe: subscribe})
        return true;
      }
    })) unsubscribeContent.push({product:product, subscribe: null});
  })

  return (
    <View style={{flex:1, flexDirection: 'column', backgroundColor: 'white', alignItems: 'flex-start'}}>
      <ScrollView styles={{marginHorizontal: 20}} >
        <Text style={{fontFamily: 'NanumMyeongjo', margin:10, fontSize: 17}}>내 구독 상품</Text>
          {subscribeContent.map(content => <SubscribeContentLayout key={uuid.v4()} product={content.product} subscribe={content.subscribe} nav={navigation}/>)}
        <View style={{left:10, right:10, backgroundColor: '#f0f0f0', height:1, marginVertical:7, width: screenWidth*0.98}}/>
        <Text style={{fontFamily: 'NanumMyeongjo', margin:10, marginTop:5, borderTopWidth: 1, fontSize: 17, borderColor: '#CCC'}}>구독 가능한 상품</Text>
          {unsubscribeContent.map(obj => <SubscribeContentLayout key={uuid.v4()} product={content.product} subscribe={content.subscribe} nav={navigation}/>)}
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
  const Context = useContext(SystemContext);
  const theme = useContext(ThemeContext);
  let dataList = Context.getProductDataList();
  const data = dataList[dataList.findIndex(obj => obj.id===id)];


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
  const Context = useContext(SystemContext);
  let userData = Context.getUserData();
  let dataList = Context.getProductDataList();
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
  const Context = useContext(SystemContext);
  let userData = Context.getUserData();
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

function MainPageScreen({navigation, route}){
  const chatroomList = useContext(ChatroomDataContext);
  const [newChatMessageCount, setNewChatMessageCount] = useState(getAllNewMessageCount(chatroomList));
  const theme = useContext(ThemeContext);

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
              return <Image source={priceTagB} style={{width: 23, height: 23}}/>
            }else {
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

export default function MainStackHomePage({navigation}) {
  const Context = useContext(SystemContext);
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
        component={SubscribeScreen}
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
