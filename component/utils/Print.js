import React from 'react';
import Moment from 'moment';

export function printStatus(title, reply){
  console.log(` > ${title} - STATUS ${reply.ok} ${reply.message}`);
}
export function printUserData(userData){
  console.log('\n > userData print');
  console.log(` > email: ${userData.email}, password: ${userData.password}`);
  console.log(' > user-token: ', userData.token.substring(0, 15), '...');
  console.log(' > push-token: ', userData.pushToken);
  console.log(` > username: ${userData.username}, img: ${userData.userImg}`);
  console.log(` > subscribe [${userData.mySubscribeList.length}]`, userData.mySubscribeList.reduce((prev, curr, i) => prev+' '+curr.id, ''));
  console.log(` > chatroom [${userData.myChatroomList.length}]`, userData.myChatroomList.reduce((prev, curr, i) => prev+' '+curr.id, ''));
  console.log(` > diary [${userData.myDiaryList.length}]`, userData.myDiaryList.reduce((prev, curr, i) => prev+' '+curr.id, ''), '\n');
}
export function printDataList(dataList){
  console.log('\n > dataList print');
  dataList.forEach(data => {
    console.log(` id: ${data.id}`);
    console.log(` isAvailable: ${data.isAvailable}, hasDiary: ${data.hasDiary}, hasChatroom: ${data.hasChatroom}, isSubscribe: ${data.isSubscribe}`);
    console.log(` product: ${data.product.title}`);
    console.log(` diary: ${data.diary.id}, totalUpdateCount: ${data.diary.totalUpdateCount}\n`);
  })
  console.log('\n');
}
export function printUnitTest(link){
  console.log(`\n@ 기능체크 ${link}`);
}
