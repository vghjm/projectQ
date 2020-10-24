import React from 'react';
import { AsyncStorage } from 'react-native';

export default async function loadUserImg(email){
  let userImg =  await AsyncStorage.getItem(email+'/userImg');
  if(userImg === null) userImg = null;
  return userImg;
}
