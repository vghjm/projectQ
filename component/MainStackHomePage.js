import React, { useContext } from 'react';
import {TouchableOpacity, View, Text, Alert, Clipboard, ScrollView, Image, TouchableHighlight, Dimensions, TextInput} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { Octicons }
from '@expo/vector-icons'; // https://icons.expo.fyi/
import uuid from 'react-native-uuid'; // https://www.npmjs.com/package/react-native-uuid
import Moment from 'moment';

import { ThemeContext, UserDataContext, ChatroomDataContext, SubscribeDataContext, ProductDataContext, ControllContext, DiaryDataContext, GlobalDataContext} from './Context';
import { DynamicDiaryScreen } from './Diary';
import ChatroomScreen from './Chatroom';
import SubscribeScreen from './Subsciribe';
import * as MyPage from './MyPage';
import MainScreen from './MainScreen';

const Stack = createStackNavigator();

function getHeaderTitle(route, initialName) { // 현재 포커스 화면의 제목을 불러옴
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
function mainHeaderRightHandler(route, navigation){ // 우상단 메뉴버튼 구현
  const { diaryPositionEditMode } = useContext(GlobalDataContext);
  const { setDiaryPositionEditMode } = useContext(ControllContext);
  let handler;
  let routeName = getHeaderTitle(route, '채팅');
  let text;

  const editDiaryButtonHandler = () => {
    console.log(' editDiaryButtonHandler ');
    setDiaryPositionEditMode(true);
    navigation.navigate('MyDiaryScreen', {editMode:true});
  }
  const completeDiaryButtonHandler = () => {
    console.log(' completeDiaryButtonHandler ');
    setDiaryPositionEditMode(false);
    navigation.navigate('MyDiaryScreen', {editMode:false});
  }
  const myButtonHandler = () => {
    navigation.navigate('MyServicePage');
  }

  if(routeName === '내 다이어리'){
    if(diaryPositionEditMode){
      text = '완료';
      handler = () => completeDiaryButtonHandler();
    }else{
      text = '편집';
      handler = () => editDiaryButtonHandler();
    }
  }else if(routeName === '채팅'){
    if(diaryPositionEditMode) {
      navigation.navigate('MyDiaryScreen', {editMode:false});
      setDiaryPositionEditMode(false);
      navigation.navigate('MyChatListScreen');
    }
    text = 'My';
    handler = () => myButtonHandler();
  }else if(routeName === '구독 상품'){
    if(diaryPositionEditMode) {
      navigation.navigate('MyDiaryScreen', {editMode:false});
      setDiaryPositionEditMode(false);
      navigation.navigate('SubscribeListScreen');
    }
    text = 'My';
    handler = () => myButtonHandler();
  }

  return ()=>(
    <TouchableOpacity onPress={handler}>
      <Text style={{fontFamily: 'NanumMyeongjo_bold', marginRight: 20, fontSize: 20, color: 'gray'}}>{text}</Text>
    </TouchableOpacity>
  );
}

export default function MainStackHomePage({navigation}) {
  const chatSettingButtonHandler = (navigation) => {return navigation.openDrawer();}

  return (
    <Stack.Navigator>
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
        component={MainScreen}
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
            <TouchableOpacity onPress={() => chatSettingButtonHandler(navigation)}>
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
