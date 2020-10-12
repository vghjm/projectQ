import React, {useContext} from 'react';
import {View, TouchableOpacity, Alert, Image} from 'react-native';
import { createDrawerNavigator, createNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem, } from '@react-navigation/drawer';  //  https://reactnavigation.org/docs/drawer-based-navigation/
import { Octicons, Ionicons, MaterialIcons }
from '@expo/vector-icons'; // https://icons.expo.fyi/

import {bookOn, bookOff} from './utils/loadAssets';
import {SystemContext} from './Context';

export default function CustomDrawerContent({navigation}) {
  const Context = useContext(SystemContext);
  let userData = Context.getUserData();
  let global_p_id = Context.getGlobalP();
  let dataList = Context.getProductDataList();

  const unSubscribe = (id) => {
    userData.mySubscribeList.splice(userData.mySubscribeList.findIndex(obj => obj.id===id), 1);
    let data = dataList[dataList.findIndex(obj => obj.id===id)];
    data.isSubscribe = false;
  }
  const deleteChatroom = (id) => {
    userData.myChatroomList.splice(userData.myChatroomList.findIndex(obj => obj.id===id), 1);
    let data = dataList[dataList.findIndex(obj => obj.id===id)];
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
