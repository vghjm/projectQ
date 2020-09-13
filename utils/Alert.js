import React from 'react';
import {Alert} from 'react-native';

const message = {
  default: ['기본', '내용'],
};


export default function serviceAlert(errorType){
  return Alert.alert(message.errorType??['정의되지 않은 에러입니다.', 'errorType: '+errorType]);
};
