import React from 'react';

import * as DefaultDataType from './component/utils/DefaultDataType';

export async function loadUserData(){
  return {
    user: DefaultDataType.userDataType,
    subscribe: DefaultDataType.subscribeDataType,
    chatroom: DefaultDataType.chatroomDataType,
    diary: DefaultDataType.diaryDataType,
    inform: DefaultDataType.informDataType,
  };
}
