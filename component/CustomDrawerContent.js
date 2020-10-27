import React, {useContext} from 'react';
import { View, TouchableOpacity, Alert, Image, Text} from 'react-native';
import { DrawerContentScrollView, DrawerItem, } from '@react-navigation/drawer';  //  https://reactnavigation.org/docs/drawer-based-navigation/

import { priceTag, menuIcon, mdTime, exitToApp } from './utils/loadAssets';
import { GlobalDataContext, ControllContext, ThemeContext } from './Context';

export default function CustomDrawerContent({navigation}) {
  const { focusChatroomPID } = useContext(GlobalDataContext);
  const { eraseChatroom } = useContext(ControllContext);
  const { gray } = useContext(ThemeContext);

  const setLabel = (text) => {
    return (
      <Text style={{fontFamily: "NanumMyeongjo"}}>{text}</Text>
    )
  }

  return (
    <DrawerContentScrollView style={{backgroundColor: gray}}>
      <TouchableOpacity onPress={()=>navigation.closeDrawer()}>
        <Image source={menuIcon} resizeMode={'cover'} style={{marginLeft:20, marginTop:10, marginBottom: 20, width:24, height: 24}} />
      </TouchableOpacity>
      <DrawerItem label={()=>setLabel("다이어리 보기")} icon={()=><Image source={priceTag} resizeMode={'cover'} style={{width:20, height:20}}/>} onPress={() => {navigation.navigate('MyDiaryScreen'); navigation.navigate('Diary', {p_id:focusChatroomPID, goToEnd: true})}} />
      <DrawerItem label={()=>setLabel("구독 시간 설정")} icon={()=><Image source={mdTime} resizeMode={'cover'} style={{width:20, height:20}}/>} onPress={() => {navigation.navigate('SubscribeListScreen'); navigation.navigate('contentScreen', {p_id:focusChatroomPID, goToEnd: true})}} />
      <DrawerItem label={()=>setLabel("채팅방 나가기")} icon={()=><Image source={exitToApp} resizeMode={'cover'} style={{width:20, height:20}}/>}
        onPress={() => {
          Alert.alert('정말 채팅방을 나가시겠습니까?', '채팅방을 나가면 구독이 해제되고 채팅기록이 사라집니다.', [{text:'취소'}, {text: '나가기', onPress: ()=>{navigation.navigate('MyChatListScreen'); eraseChatroom(focusChatroomPID)}} ])}} />
    </DrawerContentScrollView>
  );
}
