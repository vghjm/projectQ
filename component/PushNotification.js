import React, {useState, useContext} from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity, Vibration} from 'react-native';
import * as Haptics from 'expo-haptics';
import Moment from 'moment';
import * as Animatable from 'react-native-animatable'; // https://github.com/oblador/react-native-animatable

import {ThemeContext} from './Context';
import {WIDTH} from './utils/constants';

const defaultImg = {uri: "https://mblogthumb-phinf.pstatic.net/20120919_14/goom5473_1348041165177dg5mj_JPEG/hdmix1318.jpg?type=w2"};
const defaultAlarm = () => {
  //Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  Vibration.vibrate();
  //Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  alert('누름!');
}
let pushData = {
  image: defaultImg,
  title: '상품제목',
  text: '전달받은 메세지',
  onPress: defaultAlarm,
};

export function setPushData(data){
  pushData = {
    image: data.image??defaultImg,
    title: data.title??'상품제목',
    text: data.text??'전달받은 메세지',
    onPress: data.onPress??defaultAlarm,
  };
}

export function PushMessage({pushData}){
  const image = pushData.image??defaultImg;
  const title = pushData.title??'상품제목';
  let text = pushData.text??'전달받은 메세지';
  const onPress = pushData.onPress??defaultAlarm;
  const time = pushData.lastPushed??Moment();

  if(text.length > 11) text = text.substr(0, 11) + '...';
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image source={image} style={styles.image} resizeMode={'cover'}/>
      <View style={styles.textArea}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.text}>{text}</Text>
      </View>
      <Text style={styles.time}>{time.format('LTS')}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position:'absolute', top:30, backgroundColor: '#EEE', borderWidth: 1, borderColor:'black', borderRadius:10, width:WIDTH * 0.9, height: 70,
    alignSelf: 'center', flexDirection: 'row',
  },
  image:{
    width: 50, height: 50, margin:8, borderRadius: 14
  },
  textArea: {
    flex:1, flexDirection:'column',
  },
  title: {
    marginLeft:8, marginTop: 10, fontSize: 20, fontWeight: 'bold', marginRight:10,
  },
  text: {
    marginLeft:8, marginTop:6, fontSize: 14, marginRight:10,
  },
  time: {
    position: 'absolute', right: 8, bottom:8, fontSize: 10,
  },
});
