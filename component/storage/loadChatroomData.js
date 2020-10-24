import React from 'react';
import { AsyncStorage } from 'react-native';

export default async function loadChatroomData(email){
  let chatroom =  await AsyncStorage.getItem(email+'/chatroom');
  if(chatroom === null) chatroom = [];
  return chatroom;
}
