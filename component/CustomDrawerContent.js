import React, {useContext} from 'react';
import { View, TouchableOpacity, Alert, Image} from 'react-native';
import { DrawerContentScrollView, DrawerItem, } from '@react-navigation/drawer';  //  https://reactnavigation.org/docs/drawer-based-navigation/
import { Octicons, Ionicons, MaterialIcons }
from '@expo/vector-icons'; // https://icons.expo.fyi/

import { bookOn } from './utils/loadAssets';
import { GlobalDataContext, ControllContext } from './Context';

export default function CustomDrawerContent({navigation}) {
  const { focusChatroomPID } = useContext(GlobalDataContext);
  const { eraseChatroom } = useContext(ControllContext);

  return (
    <DrawerContentScrollView style={{backgroundColor: '#FFF'}}>
      <TouchableOpacity onPress={()=>navigation.closeDrawer()}>
        <Octicons name="three-bars" style={{marginLeft:20, marginTop:10, marginBottom: 20}} size={20} color="black" />
      </TouchableOpacity>
      <DrawerItem label="다이어리 보기"  icon={()=><Image source={bookOn} resizeMode={'cover'} style={{width:20, height:20}}/>} onPress={() => {navigation.navigate('MyDiaryScreen'); navigation.navigate('Diary', {p_id:focusChatroomPID, goToEnd: true})}} />
      <DrawerItem label="푸시 메세지 설정" icon={()=><Ionicons name="md-time" style={{marginLeft: 3}} size={20} color="black" />} onPress={() => {navigation.navigate('SubscribeListScreen'); navigation.navigate('contentScreen', {p_id:focusChatroomPID, goToEnd: true})}} />
      <DrawerItem label="채팅방 나가기" icon={()=><MaterialIcons name="exit-to-app" style={{marginLeft: 1}} size={20} color="black" />}
        onPress={() => {
          Alert.alert('정말 채팅방을 나가시겠습니까?', '채팅방을 나가면 채팅 내용과 채팅 목록은 사라지고 다이어리에서만 기록을 확인할 수 있습니다.', [{text:'취소'}, {text: '나가기', onPress: ()=>{navigation.navigate('MyChatListScreen'); eraseChatroom(focusChatroomPID)}} ])}} />
    </DrawerContentScrollView>
  );
}
