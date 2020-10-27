import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Moment from 'moment';

import { WIDTH } from './utils/constants';

const defaultImg = {uri: "https://mblogthumb-phinf.pstatic.net/20120919_14/goom5473_1348041165177dg5mj_JPEG/hdmix1318.jpg?type=w2"};

export function PushMessage({pushData, onPressPushNotification}){
  const image = pushData.image??defaultImg;
  let title = pushData.title??'상품제목';
  let text = pushData.text??'전달받은 메세지';
  const time = pushData.lastPushed??Moment();

  if(title.length > 10) title = title.substr(0, 9) + '...';
  if(text.length > 17) text = text.substr(0, 15) + '...';

  return (
    <TouchableOpacity style={styles.container} onPress={onPressPushNotification}>
      <Image source={image} style={styles.image} resizeMode={'cover'}/>
      <View style={styles.textArea}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.text} numberOfLines={1}>{text}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position:'absolute', top:30, backgroundColor: '#ededed', borderRadius: 5, borderWidth: 0, borderColor:'#eee', borderRadius:0, width:WIDTH, height: 70,
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
