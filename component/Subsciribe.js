import React, {useContext, useState, useEffect} from 'react';
import {View, TouchableOpacity, Text, Image, ScrollView, SafeAreaView, Alert, Dimensions} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker'; // https://github.com/react-native-community/datetimepicker
import {ProductContext} from './Context';
import Moment from 'moment';
import _ from 'lodash'; // https://lodash.com/docs
import uuid from 'react-native-uuid'; // https://www.npmjs.com/package/react-native-uuid
import * as Permissions from 'expo-permissions';

import { ControllContext, ProductDataContext, SubscribeDataContext } from './Context';
import { subOn, subOff } from './utils/loadAssets';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

// 구독 상품 화면
export default function SubscribeContentScreen({route, navigation}){
  const p_id = route.params.p_id;
  const goToEnd = route.params.goToEnd??false;
  const productList = useContext(ProductDataContext);
  const subscribeList = useContext(SubscribeDataContext);
  const { subscribeOffHandler, subscribeOnHandler, changePushTime } = useContext(ControllContext);
  const product = productList[productList.findIndex(product => product.p_id===p_id)];
  const subscribe = subscribeList[subscribeList.findIndex(subscribe => subscribe.p_id===p_id)];

  const [show0, setShow0] = useState(false);
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);
  const [show3, setShow3] = useState(false);
  const [show4, setShow4] = useState(false);
  const isSubscribeButton = subscribe?true:false;
  const pushStartTime = subscribe?subscribe.pushStartTime:product.defaultStartTime;
  const pushEndTime = subscribe?subscribe.pushEndTime:product.defaultEndTime;
  let thisScrollView = null;

  useEffect(() => {
    if(goToEnd) thisScrollView.scrollToEnd({animated: true});
  }, []);

  const onChange0 = (event, selectedDate) => {
    // 푸시타입 0 인경우 푸시등록 함수
    let getTime = Moment(selectedDate);
    setShow0(false); // 시간 선택 종료

    // 취소한 경우
    if(event.type === 'dismissed'){
      return Alert.alert('취소하였습니다.')
    };

    // 시간 등록
    subscribeOnHandler(product, getTime, getTime, navigation);
  };
  const onChange1 = (event, selectedDate) => {
    // 푸시타입 1인 경우, pushStartTime 셋팅
    let getTime = Moment(selectedDate);
    setShow1(false); // 시간 선택 종료
    // 취소한 경우
    if(event.type === 'dismissed') return Alert.alert('취소하였습니다.');
    // 시간 등록

    setTimeout(() => {
      setShow2(true);
    }, 200);
  };
  const onChange2 = (event, selectedDate) => {
    // onChane1 에 이어서 pushEndTime 셋팅
    let getTime = Moment(selectedDate);
    setShow2(false);  // 시간 선택 종료

    if(event.type === 'dismissed') {
      return Alert.alert('취소하였습니다.')
    };

    subscribeOnHandler(product, pushTempTime, getTime, navigation);
  };

  const subscribeOff = () => {
    subscribeOffHandler(product, subscribe);
  }

  const subscribeButtonHandler = async () => {
    if(isSubscribeButton) {
      // 구독 취소
      Alert.alert('구독을 취소하시겠습니까?', '구독을 취소하여도 채팅기록과 다이어리는 남습니다.', [{text: '취소'}, {text:'구독취소', onPress: subscribeOff}]);
    }else{
      // 구독 신청
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      if (status !== 'granted') {
        alert('푸시메시지를 받기위해서는 푸시권한이 필요합니다.');
        return;
      }

      Alert.alert(product.title + ' 상품을 구독하시겠습니까?', '푸시 알람설정을 완료하여 구독을 할 수 있습니다.',
        [{text:'취소'}, {text:'푸시설정', onPress: () => {thisScrollView.scrollToEnd({animated: true}); product.pushType ?  setShow1(true) : setShow0(true)}}]
      );
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

  const pushStartChanger = (event, selectedDate) => {
    let getTime = Moment(selectedDate);
    setShow3(false);  // 시간 선택 종료

    if(event.type === 'dismissed') {
      return Alert.alert('취소하였습니다.')
    };

    changePushTime(product.p_id, getTime, pushEndTime, product.pushType);
  };
  const pushEndChanger = (event, selectedDate) => {
    let getTime = Moment(selectedDate);
    setShow4(false);  // 시간 선택 종료

    if(event.type === 'dismissed') {
      return Alert.alert('취소하였습니다.')
    };

    changePushTime(product.p_id, pushStartTime, getTime, product.pushType);
  };

  return (
    <SafeAreaView>
      <ScrollView style={{width:screenWidth}}  ref={ref =>{ thisScrollView = ref}}  centerContent={true} onScroll={(event)=>{
        event.nativeEvent.contentOffset.y > 255.0 ? navigation.setOptions({ headerTitle: product.title, headerTransparent: false}) : navigation.setOptions({ headerTitle: '', headerTransparent: true})
      }}>
        <Image source={product.logoImg} style={{height: 200}} resizeMode='stretch'/>
        <View style={{alignItems: 'center', borderWidth: 0, borderColor:'black'}}>
          <Image source={product.thumbnailImg} resizeMode='cover' style={{position:'absolute', borderWidth: 0, borderColor: '#AAA', alignSelf: 'center', top:-80, height: 100, width: 100, borderRadius: 50}}/>
          <Text style={{fontFamily: 'NanumMyeongjo_bold', fontSize: 21, marginTop: 35, marginBottom: 10}}>{product.title}</Text>
          <Text style={{fontFamily: 'NanumMyeongjo', margin: 20, marginTop:0}}>{product.text}</Text>
        </View>
        <Image source={product.mainImg} style={{ width:screenWidth, height:screenWidth*3, borderWidth: 0, resizeMode: 'contain'}}/>
        <View style={{flexDirection:'column', paddingVertical: 10, paddingHorizontal: 15, borderTopWidth:0, borderBottomWidth:1, borderColor: '#f0f0f0'}}>
          <Text style={{fontFamily: 'NanumMyeongjo',fontSize: 21}}>구독 상품 설정</Text>
        </View>
        <View style={{width:screenWidth, flexDirection: 'column', paddingHorizontal: 15}}>
          <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginLeft: 10}}>
            {isSubscribeButton ? <Text style={{fontFamily: 'NanumMyeongjo', fontSize: 19}}>구독 중</Text> : <Text style={{fontFamily: 'NanumMyeongjo',fontSize: 19}}>구독하기</Text>}
            <TouchableOpacity onPress={subscribeButtonHandler} style={{marginRight: 10, marginVertical: 7}}>
                {isSubscribeButton ? (
                    <Image source={subOff}  style={{width:65, height:40}}/>
                ) : (
                    <Image source={subOn} style={{width:65, height:40}}/>
                )}
            </TouchableOpacity>
          </View>
          {isSubscribeButton &&
            <View style={{flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', borderTopWidth: 1, paddingBottom:10, borderColor: '#f0f0f0', marginLeft: 10}}>
              <Text style={{fontFamily: 'NanumMyeongjo',fontSize: 19, marginTop:17}}>메시지 수신 시간</Text>
              <TouchableOpacity onPress={()=>{Alert.alert('시간 변경')}}>
                {product.pushType
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
          {show0 || show1 &&
            <View style={{flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', borderWidth: 0, borderColor: 'blue', marginTop:10, paddingLeft:5}}>
              <Text style={{fontFamily: 'NanumMyeongjo',fontSize: 19}}>푸시알림 수신시간을 설정해 주세요.</Text>
            </View>
          }
          {show2 &&
            <View style={{flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', borderWidth: 0, borderColor: 'blue', marginTop:10, paddingLeft:5}}>
              <Text style={{fontFamily: 'NanumMyeongjo',fontSize: 19}}>푸시알림 시간대를 설정해주세요.</Text>
              <Text style={{fontFamily: 'NanumMyeongjo',color: '#AAA', fontSize: 19, marginTop: 5}}>{pushTempTime.format('LT')} 부터</Text>
            </View>
          }

          <View style={{marginTop:10}}>
            {show0 && <DateTimePicker testID="dateTimePicker" value={pushStartTime.toDate()} mode={'time'} is24Hour={true} display="default" onChange={onChange0}/>}
            {show1 && <DateTimePicker testID="dateTimePicker" value={pushStartTime.toDate()} mode={'time'} is24Hour={true} display="default" onChange={onChange1}/>}
            {show2 && <DateTimePicker testID="dateTimePicker" value={pushTempTime.toDate()} mode={'time'} is24Hour={true} display="default" onChange={onChange2}/>}
            {show3 && <DateTimePicker testID="dateTimePicker" value={pushStartTime.toDate()} mode={'time'} is24Hour={true} display="default" onChange={pushStartChanger}/>}
            {show4 && <DateTimePicker testID="dateTimePicker" value={pushEndTime.toDate()} mode={'time'} is24Hour={true} display="default" onChange={pushEndChanger}/>}
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
