import React, {useState, useContext} from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';

import {ThemeContext} from './Context';
import {WIDTH} from './utils/constants';

const defaultImg = {uri: "https://mblogthumb-phinf.pstatic.net/20120919_14/goom5473_1348041165177dg5mj_JPEG/hdmix1318.jpg?type=w2"};
const defaultAlarm = () => alert('누름!');

export function PushMessage(props){
  const image = props.image??defaultImg;
  const title = props.title??'상품 제목';
  const text = props.text??'전달받은 메세지';
  const onPressHandler = props.onPress??defaultAlarm;

  return (
    <TouchableOpacity style={styles.container} onPress={onPressHandler}>
      <Image source={image} style={styles.image} resizeMode={'cover'}/>
      <View style={styles.textArea}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.text}>{text}</Text>
      </View>
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
});
