import React from 'react';
import { AsyncStorage } from 'react-native';

import { testChatroom } from '../constant/TEST';

export default async function loadChatroomData(email){
  let chatroom =  await AsyncStorage.getItem(email+'/chatroom');

  if(testChatroom.use){
    chatroom = testChatroom.chatroom;
  }else if(chatroom === null) chatroom = [];
  
  return chatroom;
}
