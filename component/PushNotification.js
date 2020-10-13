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

export function PushMessage({pushData}){
  const image = pushData.image??defaultImg;
  const title = pushData.title??'상품제목';
  let text = pushData.text??'전달받은 메세지';
  const onPress = pushData.onPress??defaultAlarm;
  const time = pushData.lastPushed??Moment();

  if(text.length > 28) text = text.substr(0, 28) + '...';
  // console.log(pushData);
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image source={image} style={styles.image} resizeMode={'cover'}/>
      <View style={styles.textArea}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.text}>{text}</Text>
      </View>
    </TouchableOpacity>
  );
}
// <Text style={styles.time}>{time.format('LT')}</Text>

const styles = StyleSheet.create({
  container: {
    position:'absolute', top:30, backgroundColor: '#ededed', borderWidth: 0, borderColor:'#eee', borderRadius:0, width:WIDTH, height: 70,
    alignSelf: 'center', flexDirection: 'row',
  },
  image:{
    width: 46, height: 46, marginLeft:16, borderRadius: 23, alignSelf: 'center', borderWidth:1, borderColor: '#48375F', marginBottom:1,
  },
  textArea: {
    flex:1, flexDirection:'column',
  },
  title: {
    marginLeft:16, marginTop: 15, fontSize: 16, fontWeight: 'bold', marginRight:10
  },
  text: {
    marginLeft:16, marginTop:6, fontSize: 13, marginRight:10,
  },
  time: {
    position: 'absolute', right: 20, bottom:8, fontSize: 10,
  },
});
