import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, TouchableHighlight, Dimensions } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import uuid from 'react-native-uuid';
import Moment from 'moment';
import { MaterialCommunityIcons, AntDesign, Feather }
from '@expo/vector-icons'; // https://icons.expo.fyi/
import { SwipeListView } from 'react-native-swipe-list-view'; // https://www.npmjs.com/package/react-native-swipe-list-view
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';

import { ThemeContext, ChatroomDataContext, ControllContext, ProductDataContext, SubscribeDataContext, DiaryDataContext } from './Context';
import { chooseRandomIndex, chooseRandomly } from './utils/utils';
import {priceTag, priceTagB} from './utils/loadAssets';
import { DraggableDiary, BasicDiary } from './Diary';
import makeLink from './connect/makeLink';


const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;
const Tab = createMaterialTopTabNavigator();

function SubscribeContentLayout(props){
  const product = props.product;
  const nav = props.nav;

  return (
    <TouchableOpacity onPress={()=>nav.navigate('contentScreen', {p_id: product.p_id, goToEnd:false})}>
    <View style={{flexDirection: 'row', height: 56, margin: 3, marginBottom: 10}}>
      <Image resizeMode='cover' source={product.thumbnailImg} style={{height: 46, borderWidth: 1, borderColor: '#f7f7f7', width: 46, margin: 5, borderRadius: 23, backgroundColor: '#DDD'}}/>
      <View style={{flexDirection: 'column'}}>
        <Text style={{fontFamily: 'NanumMyeongjo', marginLeft: 10, marginTop: 6, fontSize: 17,fontWeight: '400', width: 220}}>{product.title}</Text>
        <Text numberOfLines={1} style={{fontFamily: 'NanumMyeongjo', color: '#AAA', fontSize: 12, marginLeft: 13, marginTop:3, width: 230}}>{product.text}</Text>
      </View>
    </View>
    </TouchableOpacity>
  );
}
function SubscribeListScreen({navigation}){
  const subscribeList = useContext(SubscribeDataContext);
  const productList = useContext(ProductDataContext);
  let subscribeContent = [], unsubscribeContent = [];

  productList.forEach(product => {
    if(!subscribeList.some(subscribe => {
      if(product.p_id == subscribe.p_id){
        subscribeContent.push({product:product})
        return true;
      }
    })) unsubscribeContent.push({product:product});
  })

  return (
    <View style={{flex:1, flexDirection: 'column', backgroundColor: 'white', alignItems: 'flex-start'}}>
      <ScrollView styles={{marginHorizontal: 20}} >
        <Text style={{fontFamily: 'NanumMyeongjo', margin:10, fontSize: 17}}>내 구독 상품</Text>
          {subscribeContent.map(content => <SubscribeContentLayout key={uuid.v4()} product={content.product} nav={navigation}/>)}
        <View style={{left:10, right:10, backgroundColor: '#f0f0f0', height:1, marginVertical:7, width: screenWidth*0.98}}/>
        <Text style={{fontFamily: 'NanumMyeongjo', margin:10, marginTop:5, borderTopWidth: 1, fontSize: 17, borderColor: '#CCC'}}>구독 가능한 상품</Text>
          {unsubscribeContent.map(content => <SubscribeContentLayout key={uuid.v4()} product={content.product} nav={navigation}/>)}
        <View style={{height:200}}/>
      </ScrollView>
    </View>
  );
}
function HiddenLayer({chatroom, alarmSettingChanger}){
  const p_id = chatroom.p_id;
  const alarmData = chatroom.getPushAlarm;
  return (
    <TouchableOpacity onPress={() => alarmSettingChanger(p_id)}>
      <View style={{backgroundColor: '#cffffe', padding:11, paddingLeft: 30, justifyContent: 'center'}}>
          {alarmData
            ? <Feather name="bell-off" size={34} color="black" />
            : <Feather name="bell" size={34} color="black" />
          }
      </View>
    </TouchableOpacity>
  );
}
function ChatroomContentLayout(props){
  const chatroom = props.chatroom;
  const product = props.product;
  const nav = props.nav;
  const theme = useContext(ThemeContext);
  const newItemCount = chatroom.newItemCount;   // 최신 알림 수
  const [fromNowTime, setFromNowTime] = useState(chatroom.lastCheckedTime.fromNow());  // 최신 메세지 업데이트 시간, 자연적인 설명버전
  const topMessage = chatroom.chatMessageList.length===0?'':chatroom.chatMessageList[0].text;

  useEffect(() => {
    setFromNowTime(chatroom.lastCheckedTime.fromNow());
    setInterval(() => {
      let nowTime = chatroom.lastCheckedTime.fromNow();
      if(nowTime !== fromNowTime) setFromNowTime(nowTime);
    }, 20000);
    return clearInterval();
  }, [chatroom.lastCheckedTime])

  return (
    <TouchableHighlight style={{marginBottom: 10}} onPress={()=>nav.navigate('chatroom', {p_id: product.p_id, title: product.title})}>
    <View style={{flexDirection: 'row', height: 60, backgroundColor: 'white'}}>
      <Image source={product.thumbnailImg} style={{height: 46, width: 46, margin: 5,borderWidth: 1, borderColor: '#f7f7f7', marginLeft: 10, borderRadius: 23, backgroundColor: '#DDD'}}/>
      <View style={{flexDirection: 'column'}}>
        <Text style={{fontFamily: 'NanumMyeongjo', marginLeft: 10, marginTop: 6, fontSize: 17,fontWeight: '400', width: 220}}>{product.title}</Text>
        <Text numberOfLines={1} style={{fontFamily: 'NanumMyeongjo', color: '#AAA', fontSize: 12, marginLeft: 13, marginTop:3, width: 230}}>{topMessage}</Text>
      </View>
      <View style={{flex:1, flexDirection: 'column', alignItems: 'flex-end'}}>
        <Text style={{fontFamily: 'NanumMyeongjo', fontSize: 10, marginRight: 10, marginTop: 0}}>{fromNowTime}</Text>
        {newItemCount > 0 && <View style={{height: 10, width: 10, borderRadius: 5, backgroundColor: theme.light[2], margin: 6, marginRight: 10, marginTop: 12, alignItems: 'center', justifyContent: 'center'}}/>}
      </View>
    </View>
    </TouchableHighlight>
  );
}
function MyChatListScreen({navigation, route}){
  const chatroomList = useContext(ChatroomDataContext);
  const productList = useContext(ProductDataContext);
  const { alarmSettingChanger } = useContext(ControllContext);
  const numberOfChatroom = chatroomList.length;
  const listViewData = chatroomList.map(chatroom => {
    return {
      key: chatroom.p_id.toString(),
      chatroom: chatroom,
      product: productList[productList.findIndex(product => product.p_id===chatroom.p_id)]
    };
  });

  const NoSubscribeInform = (navigation) => {
    return (
      <TouchableOpacity onPress={()=>{ navigation.navigate('SubscribeListScreen'); Alert.alert('상품을 구독해 보세요', '구독한 상품정보를 받을 수 있습니다.', [{text: '확인'}])}}>
        <View style={{flexDirection: 'row', height: 56, margin: 10, borderWidth: 1, borderRadius: 8, borderColor: 'gray', alignItems: 'center'}}>
          <Image source={null} style={{height: 40, width: 40, margin: 16, borderRadius: 8, backgroundColor: '#DDD'}}/>
          <Text style={{fontFamily: 'NanumMyeongjo', marginLeft: 15, fontSize: 17, width: 220}}>원하는 상품을 구독해보세요!</Text>
        </View>
      </TouchableOpacity>
    );
  }

  // // 푸시
  // const pushMessage = (p_id) => {
  //   // 랜덤한 질문 메시지를 만들어 채팅방에 추가함
  //   let data = dataList[dataList.findIndex(obj => obj.id===id)];
  //   let product = data.product;
  //   let chatroom = data.chatroom;
  //   let avatar = product.imageSet.avatarImg.uri?? product.imageSet.avatarImg;
  //   let randomIndex = chooseRandomIndex(product.questionList);
  //   let newMessage = { _id: uuid.v4(), text: product.questionList[randomIndex].content, createdAt: Moment(),
  //     user: { _id:2, avatar: avatar}
  //   };
  //   chatroom.newItemCount += 1;
  //   chatroom.chatmessageList.unshift(_.cloneDeep(newMessage));
  //   chatroom.lastMessageTime = Moment();
  //   chatroom.lastMessage = newMessage.text;
  //   chatroom.lastPushed = {pushTime: Moment(), questIndex: randomIndex, solved:false};
  //   popupPushMessage({
  //     image: product.imageSet.thumbnailImg,
  //     title: product.title,
  //     text: newMessage.text,
  //     onPress: ()=>navigation.navigate('chatroom', {id: id, data:data}),
  //     lastPushed: Moment(),
  //     isPushShowed: true,
  //   });
  // }
  const pushTestHandler = () => {  // 간단한 푸시 테스트함수
    let pushTestId = chooseRandomly(chatroomList).p_id;
    if(pushTestId != null){
      // pushMessage(pushTestId);
    }
  }

  return (
    <View style={{flex:1, flexDirection: 'column', backgroundColor: 'white'}}>
      {numberOfChatroom===0 ? NoSubscribeInform(navigation) : <Text/>}
      <SwipeListView
        data={listViewData}
        renderHiddenItem={(data, rowMap)=>(<HiddenLayer key={data.item.key} chatroom={data.item.chatroom} alarmSettingChanger={alarmSettingChanger}/>)}
        renderItem={(data, rowMap)=>(
          <ChatroomContentLayout key={data.item.key} chatroom={data.item.chatroom} product={data.item.product} nav={navigation}/>
        )}
        onRowOpen={(rowKey, rowMap, toValue)=>setTimeout(()=>rowMap[rowKey].closeRow(), 2000)}
        leftOpenValue={90}
        closeOnRowPress={true}
        closeOnScroll={true}
      />
      <TouchableHighlight onPress={()=>pushTestHandler()} style={{position:'absolute', width:60, height: 60, right:15, bottom: 15, borderWidth: 1, borderRadius: 30, backgroundColor: 'gray', alignItems: 'center', justifyContent: 'center'}}>
        <Text style={{color: 'white', fontSize: 24}}>푸시</Text>
      </TouchableHighlight>
    </View>
  );
}
function MyDiaryScreen({route, navigation}){
  const diaryPositionEditMode = route.params?route.params.editMode:false;
  const diaryList = useContext(DiaryDataContext);
  const numberOfDiary = diaryList.length; // 다이어리의 수
  const backgroundWidth = Math.ceil(numberOfDiary/2)*300 <= screenHeight-90 ? screenHeight-90 : Math.ceil(numberOfDiary/2)*300 // 배경의 크기
  const [cancelScroll, setCancelScroll] = useState(true);
  const [globalY, setGlobalY] = useState(0);

  const changeCnacelScrollHandler = (value) => {
    if(value !== cancelScroll) setCancelScroll(value);
  }

  return (
    <ScrollView canCancelContentTouches={cancelScroll} bounces={false} onScrollEndDrag={(event) => setGlobalY(event.nativeEvent.contentOffset.y)}>
      <View style={{width: screenWidth, height: backgroundWidth, backgroundColor: 'white'}}>
        {numberOfDiary < 1 && <View style={{fontFamily: 'NanumMyeongjo', flex:1, flexDirection: 'column',  justifyContent: 'center', alignItems: 'center'}}><Text style={{fontFamily: 'NanumMyeongjo'}}>생성된 다이어리가 없습니다.</Text></View>}
        {diaryList.map(diary => {
          return diaryPositionEditMode ?
            <DraggableDiary key={uuid.v4()} diary={diary} nav={navigation} numberOfDiary={numberOfDiary} globalY={globalY} cancelDrag={changeCnacelScrollHandler}/> :
            <BasicDiary key={uuid.v4()} diary={diary} nav={navigation} numberOfDiary={numberOfDiary} globalY={globalY}/>
        })}
      </View>
    </ScrollView>
  );
}
function TestScreen({navigation}){
  const { showState } = useContext(ControllContext);
  let url;

  const printToPdf = async () => {
      let html;

      let responsePDF = await makeLink({
        token: userData.token,
        d_ID: dataList[1].diary.id,
        pdfType: 1,
        debug: true,
      });
      if(responsePDF.ok){
        html = responsePDF.data.htmls;
        console.log('printToPdf: ', html);
      }else{
        Alert.alert('printToPdf ERROR', responsePDF.message);
        return;
      }

      // https://forums.expo.io/t/expo-print-creating-pdf-and-giving-it-a-file-name/36164
      const responsePrintToFile = await Print.printToFileAsync({ html: html });

      const pdfName = `${responsePrintToFile.uri.slice(
          0,
          responsePrintToFile.uri.lastIndexOf('/') + 1
      )}testPDF_${Moment()}.pdf`;

      await FileSystem.moveAsync({
          from: responsePrintToFile.uri,
          to: pdfName,
      });
      sharePdf(pdfName)
  }

  const sharePdf = (url) => {
      Sharing.shareAsync(url)
  }

  const shareWithLink = async () => {
    let responseMakeLink = await makeLink({
      token: userData.token,
      d_ID: dataList[1].diary.id,
      pdfType: 0,
      debug: true,
    });
    if(responseMakeLink.ok){
      url = responseMakeLink.data.linkname;
      console.log('shareWithLink: ', responseMakeLink.data.linkname);
    }else{
      Alert.alert('shareWithLink ERROR', responseMakeLink.message);
    }

    Clipboard.setString(url);
    Alert.alert('링크가 클립보드에 저장됨');
  }

  const showUserData = () => {
    console.log('\nuserData: \n', userData);
  }
  const showDataList = () => {
    console.log('\ndataList: \n', dataList);
  }

  return (
    <ScrollView>
    <View style={{flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: screenHeight-60}}>
      <Text style={{fontFamily: 'NanumMyeongjo'}}>기능 테스트 공간</Text>
      <TouchableOpacity onPress={printToPdf} style={{margin:20}}>
        <Text style={{fontFamily: 'NanumMyeongjo'}}>PDF 생성</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={shareWithLink} style={{margin:20}}>
        <Text style={{fontFamily: 'NanumMyeongjo'}}>링크공유</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={showUserData} style={{margin:20}}>
        <Text style={{fontFamily: 'NanumMyeongjo'}}>user data show</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={showDataList} style={{margin:20}}>
        <Text style={{fontFamily: 'NanumMyeongjo'}}>dataList show</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={showState} style={{margin:20}}>
        <Text style={{fontFamily: 'NanumMyeongjo'}}>state show</Text>
      </TouchableOpacity>
    </View>
    </ScrollView>
  );
}


function getAllNewMessageCount(chatroomList){ // 채팅방들에서 새로운 메시지 리턴
  let newCount = 0;
  chatroomList.forEach(chatroom => {
    newCount += chatroom.newItemCount;
  });
  return newCount;
}
export default function MainPageScreen({navigation, route}){
  const theme = useContext(ThemeContext);
  const chatroomList = useContext(ChatroomDataContext);
  const newChatMessageCount = getAllNewMessageCount(chatroomList);

  return (
    <Tab.Navigator
      backBehavior={'initialRoute'} initialRouteName={'MyChatListScreen'}
      swipeEnabled={false}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, tintcolor  }) => {
          let iconName;
          let size = 24;
          if (route.name === 'SubscribeListScreen') {
            iconName = focused ? 'clockcircle' : 'clockcircleo';
            return <AntDesign name={iconName} size={size} color={tintcolor} />;
          } else if (route.name === 'MyChatListScreen') {
            iconName = focused ? 'chat' : 'chat-outline';

            return (
              <View>
                <MaterialCommunityIcons name={iconName} size={size+2} color={tintcolor} />
                {newChatMessageCount > 0
                  ? <View style={{height:14, width:14, borderRadius:7, backgroundColor: theme.light[2], position:'absolute', right:-6, top:-3, alignItems: 'center', justifyContent: 'center'}}>
                      <Text style={{fontSize: 10, color:'white'}}>{newChatMessageCount}</Text>
                    </View>
                  : null
                }
              </View>);
          } else if (route.name === 'MyDiaryScreen') {
            if (focused) {
              return <Image source={priceTagB} style={{width: 23, height: 23}}/>
            }else {
              return <Image source={priceTag} style={{width: 22, height: 22}}/>
            }
          }
        },
      })}
      tabBarPosition='bottom'
      tabBarOptions={{
        indicatorStyle: {backgroundColor: '#0000'},
        showIcon: true,
        showLabel: false,
        style: {
          borderTopWidth:1,
          borderColor: '#eee',
          backgroundColor: 'white',
          height: 45,
        },
      }}
    >
      <Tab.Screen name="SubscribeListScreen"  component={SubscribeListScreen}/>
      <Tab.Screen name="MyChatListScreen"  component={MyChatListScreen}/>
      <Tab.Screen name="MyDiaryScreen"  component={MyDiaryScreen}/>
      <Tab.Screen name="testScreen"  component={TestScreen}/>
    </Tab.Navigator>
  );
}
