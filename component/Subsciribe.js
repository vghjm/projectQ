import React, {useContext, useState, useEffect} from 'react';
import {View, TouchableOpacity, Text, Image, ScrollView, SafeAreaView, Alert, Dimensions} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker'; // https://github.com/react-native-community/datetimepicker
import {ProductContext} from './Context';
import Moment from 'moment';
import _ from 'lodash'; // https://lodash.com/docs
import uuid from 'uuid';
import * as Permissions from 'expo-permissions';

import {SystemContext} from './Context';
import {subscribe} from './ServerConnect';


const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;
const subOn = require('../assets/icon/subOn.png');
const subOff = require('../assets/icon/subOff.png');

//import * as TestData from '../testData';
//let userData = TestData.userTestData;
//let dataList = TestData.productTestData;

// 구독 상품 화면
export default function SubscribeContentScreen({route, navigation}){
  const Context = useContext(SystemContext);

  const id = route.params.id;
  const goToEnd = route.params.goToEnd??null;
  let userData = Context.getUserData();
  let data = Context.getProductData(id);

  const [show0, setShow0] = useState(false);
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);
  const [show3, setShow3] = useState(false);
  const [show4, setShow4] = useState(false);
  const [isSubscribeButton, setIsSubscribeButton] = useState(data.isSubscribe);
  const [pushStartTime, setPushStartTime] = useState(data.push.pushStartTime);
  const [pushEndTime, setPushEndTime] = useState(data.push.pushEndTime);

  let tempTime;
  let thisScrollView = null;

  // 채팅방 초기로 생성 함수
  const chatroomInitializeFunction = (id) => {
    // 기존의 채팅창이 있는지 확인함
    if(!data.hasChatroom) {
      // 초기버전 채팅창을 만듦
      userData.myChatroomList.push({id: id, getPushAlarm: true, key:id.toString()});
      data.hasChatroom = true; // 채팅창을 보이게 함

      // 채팅창 초기 데이터 구성
      let makeChatmessageListData = [
        {
          _id: 2, text: data.product.questionList[0].content, createdAt: Moment(),
          user: { _id:2, avatar: data.product.imageSet.avatarImg.uri??data.product.imageSet.avatarImg},
        },
        {
          _id: 1, text: data.product.title + ' 채팅방입니다.', createdAt: Moment(),
          user: { _id:2, avatar: data.product.imageSet.avatarImg.uri??data.product.imageSet.avatarImg},
        },
      ];
      let makeChatroomData = {
        lastMessageTime: Moment(), newItemCount: 2, chatmessageList: makeChatmessageListData, lastPushed: {pushTime: Moment(), questIndex: 0, solved:false},
      };

      data.chatroom = _.cloneDeep(makeChatroomData); // 채팅창 데이터 연결

      // 생성 후 푸시알림
      Context.popupPushMessage({
        image: data.product.imageSet.thumbnailImg,
        title: data.product.title,
        text: makeChatmessageListData[1].text,
        onPress: ()=>navigation.navigate('chatroom', {id: id}),
        lastPushed: Moment(),
        isPushShowed: true,
      });
      //setTimeout(() => {
        Context.popupPushMessage({
          image: data.product.imageSet.thumbnailImg,
          title: data.product.title,
          text: makeChatmessageListData[0].text,
          onPress: ()=>navigation.navigate('chatroom', {id: id}),
          lastPushed: Moment(),
          isPushShowed: true,
        },2100);
      //}, 1300);
    }
  }

  // 다이어리 초기로 생성 함수
  const diaryInitializeFunction = (id) => {
    // 기존의 다이어리 있는지 확인
    if(!data.hasDiary) {
      // 초기버전 다이어리 만듦
      data.hasDiary = true; // 다이어리를 보이게 함
      userData.myDiaryList.push({id:id, pos: userData.myDiaryList.length+1, color: Math.floor(Math.random() * 10)});

      // 다이어리 초기 데이터 구성
      let makeDiaryData = {
        makeTime: Moment(), totalUpdateCount: 0, diarymessageList: [],
      };

      data.diary = _.cloneDeep(makeDiaryData); // 다이어리 데이터 연결
    }
  }

  useEffect(() => {
    if(isSubscribeButton){
      userData.mySubscribeList.some( obj => {
        if(obj.id === data.id){
          setPushStartTime(obj.pushStartTime);
          setPushEndTime(obj.pushEndTime);

          return true;
        }
      })
    }
    if(goToEnd) thisScrollView.scrollToEnd({animated: true});
  }, []);

  const subscribeOffHandler = async () => {
    const {status} = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    if (status !== 'granted') {
      Alert.alert('푸시 권한이 필요합니다.');
      return;
    }

    const res = {
      jwt: userData.token,
      p_name: data.product.title,
      p_ID: data.id,
      d_ID: data.diary.id,
      start_time: data.push.pushStartTime,
      end_time: data.push.pushEndTime,
      pushType: data.push.isRandomPushType,
      subscribe: 0,
    };

    let response = await subscribe(res);
    if(!response.ok){
      Alert.alert('푸시 해제에 실패하였습니다.',response.message);
      return;
    }

    userData.mySubscribeList.splice(userData.mySubscribeList.findIndex(obj => obj.id === data.id), 1);
    data.isSubscribe = false; // false
    setIsSubscribeButton(false);
    setPushStartTime(data.push.pushStartTime);
    setPushEndTime(data.push.pushEndTime);

  };
  const subscribeOnHandler = async (startTime, endTime) => {
    const {status} = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    if (status !== 'granted') {
      Alert.alert('푸시 권한이 필요합니다.');
      return;
    }

    let d_ID = uuid.v4();
    const res = {
      jwt: userData.token,
      p_name: data.product.title,
      p_ID: data.id,
      d_ID: d_ID,
      start_time: startTime,
      end_time: endTime,
      pushType: data.push.isRandomPushType,
      subscribe: 1,
    };
    data.diary.id = d_ID;

    let response = await subscribe(res);
    if(!response.ok){
      Alert.alert('푸시 등록이 실패하였습니다.',response.message);
      return ;
    }

    // 시간 설정 성공
    userData.mySubscribeList.push({id:data.id, pushStartTime:startTime, pushEndTime:endTime});
    data.isSubscribe = true; // true
    setIsSubscribeButton(true);

    // 채팅창 초기화 준비
    chatroomInitializeFunction(data.id);
    // 다이어리 초기화 준비
    diaryInitializeFunction(data.id);

    // 시간  설정 실패 return
  };
  const onChange0 = (event, selectedDate) => {
    let getTime = Moment(selectedDate);
    setShow0(false); // 시간 선택 종료
    // 취소한 경우

    if(event.type === 'dismissed') return Alert.alert('취소하였습니다.');
    // 시간 등록
    setPushStartTime(getTime);
    setPushEndTime(getTime);

    subscribeOnHandler(getTime, getTime);
  };
  const onChange1 = (event, selectedDate) => {
    let getTime = Moment(selectedDate);
    setShow1(false); // 시간 선택 종료
    // 취소한 경우
    if(event.type === 'dismissed') return Alert.alert('취소하였습니다.');
    setPushStartTime(getTime);
    // 시간 등록

    setTimeout(() => {
      setShow2(true);

    }, 200);
  };
  const onChange2 = (event, selectedDate) => {
    let getTime = Moment(selectedDate);
    setShow2(false);  // 시간 선택 종료

    if(event.type === 'dismissed') {
      setPushStartTime(data.push.pushStartTime);  //   데이터 복구

      return Alert.alert('취소하였습니다.')
    };


    setPushEndTime(Moment(selectedDate));
    subscribeOnHandler(pushStartTime, getTime);
  };

  const subscribeButtonHandler = () => {
    if(data.isSubscribe) {
      // 구독 취소
      Alert.alert('구독을 취소하시겠습니까?', '구독을 취소하여도 채팅기록과 다이어리는 남습니다.', [{text: '취소'}, {text:'구독취소', onPress: subscribeOffHandler}]);
    }else{
      // 구독 신청
      Alert.alert(data.product.title + ' 상품을 구독하시겠습니까?', '푸시 알람설정을 완료하여 구독을 할 수 있습니다.', [{text:'취소'}, {text:'푸시설정', onPress:()=>{thisScrollView.scrollToEnd({animated: true}); data.push.isRandomPushType ?  setShow1(true) : setShow0(true)}}]);
    }
  };

  const pushTimeChanger = (type) => {
    if(show3 || show4) return;
    if(type === 1){
      // start
      setShow3(true);
    }else{
      setShow4(true);
    }
  }
  const changePushTime = (start, end) => {
    let myData = userData.mySubscribeList[userData.mySubscribeList.findIndex(obj => obj.id===data.id)];
    myData.pushStartTime = start;
    myData.pushEndTime = end;
  }
  const pushStartChanger = (event, selectedDate) => {
    let getTime = Moment(selectedDate);
    setShow3(false);  // 시간 선택 종료

    if(event.type === 'dismissed') {
      return Alert.alert('취소하였습니다.')
    };

    setPushStartTime(getTime);

    changePushTime(getTime, pushEndTime);
  };
  const pushEndChanger = (event, selectedDate) => {
    let getTime = Moment(selectedDate);
    setShow4(false);  // 시간 선택 종료

    if(event.type === 'dismissed') {
      return Alert.alert('취소하였습니다.')
    };

    setPushEndTime(Moment(selectedDate));
    changePushTime(pushStartTime, getTime);
  };


  return (
    <SafeAreaView>
      <ScrollView style={{width:screenWidth}}  ref={ref =>{ thisScrollView = ref}}  centerContent={true} onScroll={(event)=>{
        event.nativeEvent.contentOffset.y > 255.0 ? navigation.setOptions({ headerTitle: data.product.title, headerTransparent: false}) : navigation.setOptions({ headerTitle: '', headerTransparent: true})
      }}>
        <Image source={data.product.imageSet.logoImg} style={{height: 200}} resizeMode='stretch'/>
        <View style={{alignItems: 'center', borderWidth: 0, borderColor:'black'}}>
          <Image source={data.product.imageSet.thumbnailImg} resizeMode='cover' style={{position:'absolute', borderWidth: 0, borderColor: '#AAA', alignSelf: 'center', top:-80, height: 100, width: 100, borderRadius: 50}}/>
          <Text style={{fontFamily: 'NanumMyeongjo_bold', fontSize: 21, marginTop: 35, marginBottom: 10}}>{data.product.title}</Text>
          <Text style={{fontFamily: 'NanumMyeongjo', margin: 20, marginTop:0}}>{data.product.text}</Text>
        </View>
        <Image source={data.product.imageSet.mainImg} style={{ width:screenWidth, height:screenWidth*3, borderWidth: 0, resizeMode: 'contain'}}/>
        <View style={{flexDirection:'column', paddingVertical: 10, paddingHorizontal: 15, borderTopWidth:0, borderBottomWidth:1, borderColor: '#f0f0f0'}}>
          <Text style={{fontFamily: 'NanumMyeongjo',fontSize: 21}}>구독 상품 설정</Text>
        </View>
        <View style={{width:screenWidth, flexDirection: 'column', paddingHorizontal: 15}}>
          <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginLeft: 10}}>
            {isSubscribeButton ?<Text style={{fontFamily: 'NanumMyeongjo', fontSize: 19}}>구독 중</Text> :  <Text style={{fontFamily: 'NanumMyeongjo',fontSize: 19}}>구독하기</Text>}
            <TouchableOpacity onPress={subscribeButtonHandler} style={{marginRight: 10, marginVertical: 7}}>
                {isSubscribeButton? (
                    <Image source={subOff}  style={{width:65, height:40}}/>
                ):(
                    <Image source={subOn} style={{width:65, height:40}}/>
                )}
            </TouchableOpacity>
          </View>
          {isSubscribeButton &&
            <View style={{flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', borderTopWidth: 1, paddingBottom:10, borderColor: '#f0f0f0', marginLeft: 10}}>
              <Text style={{fontFamily: 'NanumMyeongjo',fontSize: 19, marginTop:17}}>메시지 수신 시간</Text>
              <TouchableOpacity onPress={()=>{Alert.alert('시간 변경')}}>
                {data.push.isRandomPushType
                  ? <View style={{flexDirection: 'column', justifyContent: 'space-around'}}>
                      <TouchableOpacity onPress={() => pushTimeChanger(1)}>
                        <Text style={{fontFamily: 'NanumMyeongjo',color: '#AAA', fontSize: 19, marginTop:10}}>{pushStartTime.format('LT')} 부터</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => pushTimeChanger(2)}>
                        <Text style={{fontFamily: 'NanumMyeongjo',color: '#AAA', fontSize: 19}}>{pushEndTime.format('LT')} 사이</Text>
                      </TouchableOpacity>
                    </View>
                  : <TouchableOpacity onPress={() => pushTimeChanger(1)}><Text style={{fontFamily: 'NanumMyeongjo',fontSize: 19, color: '#AAA', fontSize: 19, marginTop:17, marginBottom:7}}>{pushStartTime.format('LT')}</Text></TouchableOpacity>
                }
              </TouchableOpacity>
            </View>
          }
        </View>
        <View style={{backgroundColor: '#f0f0f0', height:1, width: '100%', marginVertical: 0}}/>
        <View style={{height:290, width: '100%', flexDirection: 'column', paddingVertical: 5, paddingHorizontal: 15, paddingLeft:20}}>
          {show0 &&
            <View style={{flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', borderWidth: 0, borderColor: 'blue', marginTop:10, paddingLeft:5}}>
              <Text style={{fontFamily: 'NanumMyeongjo',fontSize: 19}}>푸시알림 수신시간을 설정해 주세요.</Text>
            </View>
          }
          {show1 &&
            <View style={{flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', borderWidth: 0, borderColor: 'blue', marginTop:10, paddingLeft:5}}>
              <Text style={{fontFamily: 'NanumMyeongjo',fontSize: 19}}>푸시알림 수신시간을 설정해 주세요.</Text>
            </View>
          }
          {show2 &&
            <View style={{flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', borderWidth: 0, borderColor: 'blue', marginTop:10, paddingLeft:5}}>
              <Text style={{fontFamily: 'NanumMyeongjo',fontSize: 19}}>푸시알림 시간대를 설정해주세요.</Text>
              <Text style={{fontFamily: 'NanumMyeongjo',color: '#AAA', fontSize: 19, marginTop: 5}}>{pushStartTime.format('LT')} 부터</Text>
            </View>
          }

          <View style={{marginTop:10}}>
            {show0 && <DateTimePicker testID="dateTimePicker" value={pushStartTime.toDate()} mode={'time'} is24Hour={true} display="default" onChange={onChange0}/>}
            {show1 && <DateTimePicker testID="dateTimePicker" value={pushStartTime.toDate()} mode={'time'} is24Hour={true} display="default" onChange={onChange1}/>}
            {show2 && <DateTimePicker testID="dateTimePicker" value={pushStartTime.toDate()} mode={'time'} is24Hour={true} display="default" onChange={onChange2}/>}
            {show3 && <DateTimePicker testID="dateTimePicker" value={pushStartTime.toDate()} mode={'time'} is24Hour={true} display="default" onChange={pushStartChanger}/>}
            {show4 && <DateTimePicker testID="dateTimePicker" value={pushEndTime.toDate()} mode={'time'} is24Hour={true} display="default" onChange={pushEndChanger}/>}
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
