import React from 'react';
import { AsyncStorage } from 'react-native';

import { testAccount } from '../constant/TEST';

export default async function loadLastUserData(){
  let prevUser =  await AsyncStorage.getItem('prevUser');

  if(testAccount.use){
    prevUser = {
      isExist: true,
      isAutoLogin: true,
      email: testAccount.email,
      password: testAccount.password,
    }
  }else if(prevUser === null){
    prevUser = {
      isExist: false,
      isAutoLogin: false,
      email: null,
      password: null,
    };
  }

  return prevUser;
}
