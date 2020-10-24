import React from 'react';
import { AsyncStorage } from 'react-native';

export default async function loadLastUserData(){
  let prevUser =  await AsyncStorage.getItem('prevUser');
  if(prevUser === null) prevUser = {
    isExist: false,
    isAutoLogin: false,
    email: null,
    password: null,
  };
  return prevUser;
}
