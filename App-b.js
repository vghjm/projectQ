import React, { useState, useCallback, useEffect } from 'react';
import { Platform, AsyncStorage, ImageBackground, Text, View, StyleSheet, TouchableOpacity, TextInput, CheckBox, KeyboardAvoidingView, Alert, Button, ScrollView, SafeAreaView, Image }
from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, getFocusedRouteNameFromRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import {
  createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem,
} from '@react-navigation/drawer';  //  https://reactnavigation.org/docs/drawer-based-navigation/
import { Ionicons, MaterialCommunityIcons, Feather, FontAwesome, EvilIcons, AntDesign, MaterialIcons, Octicons } from '@expo/vector-icons'; // https://icons.expo.fyi/
import { GiftedChat } from 'react-native-gifted-chat' // https://github.com/FaridSafi/react-native-gifted-chat
import DateTimePicker from '@react-native-community/datetimepicker'; // https://github.com/react-native-community/datetimepicker
import * as Animatable from 'react-native-animatable'; // https://github.com/oblador/react-native-animatable
import * as ImagePicker from 'expo-image-picker';      // https://docs.expo.io/versions/latest/sdk/imagepicker/
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import Moment from 'moment';
import "moment/locale/ko";
Moment.locale("ko");

// 추가기능 리스트
// 그림자 https://www.npmjs.com/package/react-native-shadow

const introImage1 = {uri: "https://cdn.crowdpic.net/detail-thumb/thumb_d_F78FC0AA8923C441588C382B19DF0BF8.jpg"};
const introImage2 = {uri: "https://previews.123rf.com/images/romeolu/romeolu1601/romeolu160100122/50594417-%EB%88%88-%EB%B0%B0%EA%B2%BD.jpg"};
const introImage3 = {uri: "https://previews.123rf.com/images/kittikornphongok/kittikornphongok1505/kittikornphongok150501184/40020410-%EB%8B%A4%EC%B1%84%EB%A1%9C%EC%9A%B4-%EC%88%98%EC%B1%84%ED%99%94%EC%9E%85%EB%8B%88%EB%8B%A4-%EA%B7%B8%EB%9F%B0-%EC%A7%80-%EC%A7%88%EA%B0%90-%EB%B0%B0%EA%B2%BD%EC%9E%85%EB%8B%88%EB%8B%A4-%EB%B6%80%EB%93%9C%EB%9F%AC%EC%9A%B4-%EB%B0%B0%EA%B2%BD%EC%9E%85%EB%8B%88%EB%8B%A4-.jpg"};
const defaultImg = {uri: "https://www.daelim.ac.kr/coming_soon.jpg"};
const dogtImg = {uri: "https://t1.daumcdn.net/cfile/tistory/24283C3858F778CA2E"};
const catImg = {uri: 'https://image-notepet.akamaized.net/resize/620x-/seimage/20190816%2Ff07bd9f247293aa0317f2c8faba7e83b.png'};
const carmelImg = {uri: 'https://www.jain.re.kr/file/contents/1/201609/30aade86-7056-4948-86a4-a8003c4498ab.jpg'};
const diaryImg = require('./assets/diary.jpg');
const AuthContext = React.createContext();
const ControllContext = React.createContext();
const Tab = createMaterialTopTabNavigator();
const Stack = createStackNavigator();
const MyServiceStack = createStackNavigator();
const ServiceCenterStack = createStackNavigator();
const Drawer = createDrawerNavigator();

// 데이터
var message2 = [
  {
    _id: 7, text: '나의 오늘 답변1', createdAt: Moment('2019-06-24 01:09:34'),
    user: { _id:1},
  },
  { _id: 6, text: '오늘 뭐 했어?', createdAt: Moment('2019-06-23 01:09:34'),
    user: { _id:2, avatar: 'https://image-notepet.akamaized.net/resize/620x-/seimage/20190816%2Ff07bd9f247293aa0317f2c8faba7e83b.png',}
  },
  {
    _id: 5, text: '나의 이전 답변3', createdAt: Moment('2019-06-22 01:09:34'),
    user: { _id:1},
  },
  {
    _id: 4, text: '나의 이전 답변2', createdAt: Moment('2019-06-21 01:09:34'),
    user: { _id:1},
  },
  {
    _id: 3, text: '나의 이전 답변1', createdAt: Moment('2019-06-20 01:09:34'),
    user: { _id:1,},
  },
  { _id: 2, text: '오늘 뭐 했어?', createdAt: Moment('2019-06-19 01:09:34'),
    user: { _id:2, avatar: 'https://image-notepet.akamaized.net/resize/620x-/seimage/20190816%2Ff07bd9f247293aa0317f2c8faba7e83b.png',}
  },
  {
    _id: 1, text: '상품정보명' + ' 채팅방입니다.', createdAt: Moment('2019-06-18 01:09:34'),
    user: { _id:2, avatar: 'https://image-notepet.akamaized.net/resize/620x-/seimage/20190816%2Ff07bd9f247293aa0317f2c8faba7e83b.png',},
  },
];
var message4 = [
  {
    _id: 7, text: '나의 오늘 답변1', createdAt: Moment('2019-06-24 01:09:34'),
    user: { _id:1},
  },
  { _id: 6, text: '오늘 뭐 했어?', createdAt: Moment('2019-06-23 01:09:34'),
    user: { _id:2, avatar: 'https://www.jain.re.kr/file/contents/1/201609/30aade86-7056-4948-86a4-a8003c4498ab.jpg',}
  },
  {
    _id: 5, text: '나의 이전 답변3', createdAt: Moment('2019-06-22 01:09:34'),
    user: { _id:1},
  },
  {
    _id: 4, text: '나의 이전 답변2', createdAt: Moment('2019-06-21 01:09:34'),
    user: { _id:1},
  },
  {
    _id: 3, text: '나의 이전 답변1', createdAt: Moment('2019-06-20 01:09:34'),
    user: { _id:1,},
  },
  { _id: 2, text: '오늘 뭐 했어?', createdAt: Moment('2019-06-19 01:09:34'),
    user: { _id:2, avatar: 'https://www.jain.re.kr/file/contents/1/201609/30aade86-7056-4948-86a4-a8003c4498ab.jpg',}
  },
  {
    _id: 1, text: '상품정보명' + ' 채팅방입니다.', createdAt: Moment('2019-06-18 01:09:34'),
    user: { _id:2, avatar: 'https://www.jain.re.kr/file/contents/1/201609/30aade86-7056-4948-86a4-a8003c4498ab.jpg',},
  },
];
var message6 = [
  {
    _id: 7, text: '나의 오늘 답변1', createdAt: Moment('2019-06-24 01:09:34'),
    user: { _id:1},
  },
  { _id: 6, text: '오늘 뭐 했어?', createdAt: Moment('2019-06-23 01:09:34'),
    user: { _id:2, avatar: 'https://t1.daumcdn.net/cfile/tistory/24283C3858F778CA2E',}
  },
  {
    _id: 5, text: '나의 이전 답변3', createdAt: Moment('2019-06-22 01:09:34'),
    user: { _id:1},
  },
  {
    _id: 4, text: '나의 이전 답변2', createdAt: Moment('2019-06-21 01:09:34'),
    user: { _id:1},
  },
  {
    _id: 3, text: '나의 이전 답변1', createdAt: Moment('2019-06-20 01:09:34'),
    user: { _id:1,},
  },
  { _id: 2, text: '오늘 뭐 했어?', createdAt: Moment('2019-06-19 01:09:34'),
    user: { _id:2, avatar: 'https://t1.daumcdn.net/cfile/tistory/24283C3858F778CA2E',}
  },
  {
    _id: 1, text: '상품정보명' + ' 채팅방입니다.', createdAt: Moment('2019-06-18 01:09:34'),
    user: { _id:2, avatar: 'https://t1.daumcdn.net/cfile/tistory/24283C3858F778CA2E',},
  },
];
var diaryMessage2 = [
  { _id: 1, text: '나의 엤날 답변1', createdAt: Moment('20200314 1405')},
  { _id: 2, text: '나의 엤날 답변2', createdAt: Moment('2020-03-15 14:06')},
  { _id: 3, text: '나의 엤날 답변3', createdAt: Moment('2020-03-16 14:10')},
  { _id: 4, text: '나의 엤날 답변4', createdAt: Moment('2020-03-19 14:05')},
  { _id: 5, text: '나의 엤날 답변5', createdAt: Moment('2020-05-21 14:06')},
  { _id: 6, text: '나의 엤날 답변6 나의 엤날 답변7 나의 엤날 답변8 나의 엤날 답변9', createdAt: Moment('2020-05-27 14:10')},
];
var diaryMessage4 = [
  { _id: 1, text: '나의 엤날 답변1', createdAt: Moment('20200314 1405')},
  { _id: 2, text: '같은 날 먼저 한 답변, 같은 날 먼저 한 답변, 같은 날 먼저 한 답변, 같은 날 먼저 한 답변, 같은 날 먼저 한 답변', createdAt: Moment('2020-03-15 14:06')},
  { _id: 3, text: '나중에 한 답변, 나중에 한 답변, 나중에 한 답변, 나중에 한 답변, 나중에 한 답변, 나중에 한 답변', createdAt: Moment('2020-03-15 16:31')},
  { _id: 4, text: '나의 엤날 답변2', createdAt: Moment('2020-03-19 15:35')},
  { _id: 5, text: '나의 엤날 답변3', createdAt: Moment('2020-05-21 14:06')},
  { _id: 6, text: '나의 엤날 답변4 나의 엤날 답변5 나의 엤날 답변6 나의 엤날 답변7', createdAt: Moment('2020-05-27 14:10')},
];
var diaryMessage6 = [
  { _id: 1, text: '나의 예전 답변1', createdAt: Moment('20200314 1405')},
  { _id: 2, text: '나의 예전 답변2', createdAt: Moment('2020-03-15 14:06')},
  { _id: 3, text: '나의 예전 답변3', createdAt: Moment('2020-03-16 14:10')},
  { _id: 4, text: '나의 예전 답변4', createdAt: Moment('2020-03-19 14:05')},
  { _id: 5, text: '나의 예전 답변5', createdAt: Moment('2020-05-21 14:06')},
  { _id: 6, text: '나의 예전 답변6 나의 엤날 답변6 나의 엤날 답변6 나의 엤날 답변6', createdAt: Moment('2020-05-27 14:10')},
];
var questionList = [
  '오늘은 어땠어?',
  '오늘의 가장 즐거웠던 점은 뭐야?',
  '3번째 랜덤 질문~~',
  '오늘의 날시는 어땠어?',
  '이 앱은 어떤거 같아?',
  '오늘의 점심은 뭐야?',
  '7번째 럭키한 질문~~',
];
var productListData = [
  { p_id:1, avaterThumnail:defaultImg, questionList: questionList, thumbnailImg: defaultImg, bannerImg:defaultImg, mainImg:defaultImg,  randomPushType: false, title: '구독상품명 1', text: '구독상품 소개 문구, 50자 이내 25자씩 2줄 디자인 상품 배경 이미지 제작, 디자인 상품 로고 제작, 디자인 상품 소개 이미지 정방형 디자인 상품 소개', },
  { p_id:2, avaterThumnail:catImg, questionList: questionList, thumbnailImg: catImg, bannerImg:catImg, mainImg:catImg,  randomPushType: true, title: '고양이 상품', text: '귀여운 고양이 상품 이미지와 소개글~', },
  { p_id:3, avaterThumnail:defaultImg, questionList: questionList, thumbnailImg: defaultImg, bannerImg:defaultImg, mainImg:defaultImg,  randomPushType: false, title: '구독상품명 3', text: '구독상품 소개 문구, 50자 이내 25자씩 2줄 디자인 상품 배경 이미지 제작, 디자인 상품 로고 제작, 디자인 ', },
  { p_id:4, avaterThumnail:carmelImg, questionList: questionList, thumbnailImg: carmelImg, bannerImg:carmelImg, mainImg:carmelImg,  randomPushType: true, title: '낙타 상품', text: '지금 구독하시면 귀여운 낙타를 드립니다. 정말로 ', },
  { p_id:5, avaterThumnail:defaultImg, questionList: questionList, thumbnailImg: defaultImg, bannerImg:defaultImg, mainImg:defaultImg,  randomPushType: false, title: '구독상품명 5', text: '구독상품 소개 문구, 50자 이내 25자씩 2줄 디자인 ', },
  { p_id:6, avaterThumnail:dogtImg, questionList: questionList, thumbnailImg: dogtImg, bannerImg:dogtImg, mainImg:dogtImg,  randomPushType: false, title: '댕댕이 상품', text: '강아지 귀여움', },
  { p_id:7, avaterThumnail:defaultImg, questionList: questionList, thumbnailImg: defaultImg, bannerImg:defaultImg, mainImg:defaultImg,  randomPushType: false, title: '구독상품명 7', text: '구독상품 소개 문구', },
];
var subscribeListData = [
  { p_id: 2, pushStartTime: Moment('2019-06-18 09:34'), pushEndTime: Moment('2019-06-18 09:34'), },
  { p_id: 4, pushStartTime: Moment('2019-06-13 19:34'), pushEndTime: Moment('2019-06-18 19:34'), },
  { p_id: 6, pushStartTime: Moment('2020-06-26 20:32'), pushEndTime: Moment('2020-06-26 20:32'), },
];
var chatMessageListData = [
  { p_id: 2, message: message2 },
  { p_id: 4, message: message4 },
  { p_id: 6, message: message6 },
];
var pushListData = [
  { p_id:2, lastUpdateTime: Moment(), newItemCount: 2 },
  { p_id:4, lastUpdateTime: Moment(), newItemCount: 3 },
  { p_id:6, lastUpdateTime: Moment(), newItemCount: 17 },
];
var diaryListData = [
  { p_id:2, lastUpdateTime: Moment('2019-06-18 09:34'), diaryImg:diaryImg, totalUpdateCount: 32, diaryMessage: diaryMessage2 },
  { p_id:4, lastUpdateTime: Moment('2019-06-18 09:34'), diaryImg:diaryImg, totalUpdateCount: 3, diaryMessage: diaryMessage4 },
  { p_id:6, lastUpdateTime: Moment('2019-06-18 09:34'), diaryImg:diaryImg, totalUpdateCount: 17, diaryMessage: diaryMessage6 },
];

// 컨트롤 변수
var pressDiaryEditButton = false;  // diary 편집 버튼 누름
var global_p_id = 0;
var editDiaryTextMode = false;

// 인증 페이지
function IntroScreen1() {
  const { introSkip } = React.useContext(AuthContext);

  return (
    <ImageBackground source={introImage1} style={styles.backgroundImg}>
      <TouchableOpacity style={styles.skipButton} onPress={introSkip}>
        <Text style={styles.skipButtonText}>[Skip]</Text>
      </TouchableOpacity>
      <Text style={styles.introText}>@  o  o</Text>
    </ImageBackground>
  );
}
function IntroScreen2() {
  const { introSkip } = React.useContext(AuthContext);

  return (
    <ImageBackground source={introImage2} style={styles.backgroundImg}>
      <TouchableOpacity style={styles.skipButton} onPress={introSkip}>
        <Text style={styles.skipButtonText}>[Skip]</Text>
      </TouchableOpacity>
      <Text style={styles.introText}>o  @  o</Text>
    </ImageBackground>
  );
}
function IntroScreen3() {
  const { introSkip } = React.useContext(AuthContext);

  return (
    <ImageBackground source={introImage3} style={styles.backgroundImg}>
      <TouchableOpacity style={styles.skipButton} onPress={introSkip}>
        <Text style={styles.skipButtonText}>[Skip]</Text>
      </TouchableOpacity>
      <Text style={styles.introText}>o  o  @</Text>
    </ImageBackground>
  );
}
function SignInScreen({navigation}){
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [autoLoginChecked, setAutoLoginChecked] = React.useState(true);
  const { signIn } = React.useContext(AuthContext);

  return (
    <View style={{flex:1, flexDirection: 'column', alignItems: 'center', justifyContent: 'space-around', margin:20}}>
      <Text>로그인 이미지</Text>
      <View>
        <TextInput value={username} onChangeText={(username)=>setUsername(username)} placeholder={"이메일"} style={[styles.singInInputBox, {marginBottom: 8}]} placeholderTextColor={'#666'}/>
        <TextInput value={password} onChangeText={(password)=>setPassword(password)} placeholder={"비밀번호"} style={styles.singInInputBox} secureTextEntry={true} placeholderTextColor={'#666'}/>
        <View style={{flexDirection: 'row'}}>
          <CheckBox title="autoLoginCheckBox" value={autoLoginChecked} onValueChange={()=>setAutoLoginChecked(!autoLoginChecked)}/>
          <Text style={{marginTop: 3}}>자동로그인</Text>
        </View>
        <TouchableOpacity style={{alignItems: 'center', padding: 10, backgroundColor: '#BBB'}} onPress={()=>signIn([username, password, true])}>
          <Text>로그인</Text>
        </TouchableOpacity>
        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
          <TouchableOpacity onPress={()=>navigation.navigate('FindPassword')}><Text style={{fontSize: 12, margin: 5}}>비밀번호 찾기</Text></TouchableOpacity>
          <Text style={{marginTop: 2}}> | </Text>
          <TouchableOpacity onPress={()=>navigation.navigate('SignUp')}><Text style={{fontSize: 12, margin: 5, marginRight: 30}}>회원 가입</Text></TouchableOpacity>
        </View>
      </View>
    </View>
  )
}
function FindPasswordScreen({navigation}){
  const [email, setEmail] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [emailError, setEmailError] = React.useState(true);
  const [usernameError, setUsernameError] = React.useState(true);
  const [findPasswordError, setFindPasswordError] = React.useState(true);

  return (
    <View style={{flex:1, flexDirection: 'column'}}>
      <TextInput placeholder='이메일' style={{borderWidth: 1, margin: 20, marginTop: 90, padding: 5, backgroundColor: '#DDD'}} value={email} onChangeText={(e)=>setEmail(e)} />
      {emailError && <Text style={{color: 'red', fontSize: 12, marginBottom: 10, marginLeft: 30}}>가입한 이메일 주소를 입력해주세요.</Text>}
      <TextInput placeholder='사용자명' style={{borderWidth: 1, margin: 20, marginTop: 10, padding: 5, backgroundColor: '#DDD'}} value={username} onChangeText={(e)=>setUsername(e)} />
      {usernameError && <Text style={{color: 'red', fontSize: 12, marginBottom: 10, marginLeft: 30}}>해당 사용자명이 존재하지 않습니다.</Text>}
      {findPasswordError && <Text style={{color: 'red', fontSize: 12, marginBottom: 10, marginLeft: 30, marginTop: 20}}>입력하신 정보와 일치하는 계정이 없습니다.</Text>}
      <TouchableOpacity style={{height: 50, margin:20, backgroundColor: '#BBB', alignItems: 'center', justifyContent: 'center'}} onPress={()=>{Alert.alert('제목', '팝업 확인 내용 여기에'); navigation.popToTop();}}>
        <Text>확인</Text>
      </TouchableOpacity>
    </View>
  );
}
function SignUpScreen({navigation}){
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [password2, setPassword2] = React.useState('');
  const [errorEmailForm, setErrorEmailForm] = React.useState(true);
  const [errorPasswordForm, setErrorPasswordForm] = React.useState(true);
  const [errorPasswordNotCorrect, setErrorPasswordNotCorrect] = React.useState(true);
  const { signIn } = React.useContext(AuthContext);

  return (
    <KeyboardAvoidingView style={{flex:1, flexDirection: 'column', alignItems:'center', justifyContent:'space-between'}} behavior="height" enabled>
      <View style={{padding:40}}><Text>회원등록 이미지</Text></View>
      <View>
        <Text style={{margin:5, fontWeight:'bold', marginLeft: 0}}>이메일</Text>
        <TextInput value={email} onChangeText={(email)=>setEmail(email)} style={styles.singInInputBox} placeholder={"username@example.com"}/>
        <Text style={{padding: 3, marginLeft: 10, fontSize: 10}}>※ 비밀번호 찾기 시 이메일 주소로 임시 비밀번호가 발급됩니다.</Text>
        {errorEmailForm && <Text style={{padding: 3, marginLeft: 16, fontSize: 10, color: '#D00'}}>[필수] 메일 주소 형식으로 입력해주세요.</Text>}
      </View>
      <View>
        <Text style={{margin:5, fontWeight:'bold', marginLeft: 0}}>비밀번호</Text>
        <TextInput value={password} onChangeText={(password)=>setPassword(password)}  style={styles.singInInputBox} secureTextEntry={true}/>
        <Text style={{padding: 3, marginLeft: 10, fontSize: 10}}>※ 6~16자 영문 소문자, 숫자만 사용 가능합니다.</Text>
        {errorPasswordForm && <Text style={{padding: 3, marginLeft: 16, fontSize: 10, color: '#D00'}}>[필수] 비밀번호 형식을 확인해 주세요.</Text>}
      </View>
      <View>
        <Text style={{margin:5, fontWeight:'bold', marginLeft: 0}}>비밀번호 확인</Text>
        <TextInput value={password2} onChangeText={(password2)=>setPassword2(password2)}  style={styles.singInInputBox} secureTextEntry={true}/>
        {errorPasswordNotCorrect && <Text style={{padding: 3, marginLeft: 16, fontSize: 10, color: '#D00'}}>[필수] 비밀번호가 일치하지 않습니다.</Text>}
      </View>
      <View style={{flexDirection: 'row'}}>
        <Text style={styles.smallText}>회원가입 시 </Text>
        <TouchableOpacity onPress={()=>{navigation.navigate('InformTermsOfUse')}}><Text style={[styles.smallText, {color: '#22D'}]}>이용약관</Text></TouchableOpacity>
        <Text style={styles.smallText}>과 </Text>
        <TouchableOpacity onPress={()=>{navigation.navigate('InformPersonalInformationProcessingPolicy')}}><Text style={[styles.smallText, {color: '#22D'}]}>개인정보 처리방침</Text></TouchableOpacity>
        <Text style={styles.smallText}>을 확인하였으며, 동의합니다. </Text>
      </View>
      <View>
        <TouchableOpacity style={{alignItems: 'center', padding: 10, backgroundColor: '#BBB', width: 300, marginTop: 60}} onPress={()=>{navigation.navigate('SetUsername'); signIn([email, password, false])}}>
          <Text>가입하기</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
function UserNameSettingScreen({navigation}) {
  const [username, setUsername] = React.useState('');
  const { registerUsername } = React.useContext(AuthContext);

  return (
    <KeyboardAvoidingView style={{flex:1, flexDirection: 'column', alignItems:'center', justifyContent:'space-between'}} behavior="height" enabled>
      <View style={{padding:40}}><Text>유저네임 등록 화면 이미지</Text></View>
      <View style={{justifyContent: 'center'}}>
        <Text style={{fontWeight: 'bold', marginBottom: 50, alignSelf: 'center'}}>당신의 호칭을 정해주세요.</Text>
        <Text style={{margin:5, fontWeight:'bold', marginLeft: 0}}>사용자 이름</Text>
        <TextInput value={username} onChangeText={(username)=>setUsername(username)} style={styles.singInInputBox} placeholder={"'사용자의 이름'"}/>
      </View>
      <View>
        <TouchableOpacity style={{alignItems: 'center', padding: 10, backgroundColor: '#BBB', width: 300, marginTop: 60}} onPress={()=>registerUsername(username)}>
          <Text>시작하기</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
function InformTermsOfUseScreen({navigation}) {
  return (
    <View style={{flex:1, flexDirection: 'column', margin: 35, flexWrap: 'wrap'}}>
      <Text style={{fontWeight:'bold', color: 'black', fontSize: 13}}>이용약관1</Text>
      <Text style={{fontSize: 12, marginBottom: 10}}>이용약관은 다음과 같다.</Text>
      <Text style={{fontWeight:'bold', color: 'black', fontSize: 13}}>이용약관2</Text>
      <Text style={{fontSize: 12, marginBottom: 10}}>이용약관은 다음과 같다.</Text>
      <Text style={{fontWeight:'bold', color: 'black', fontSize: 13}}>이용약관3</Text>
      <Text style={{fontSize: 12, marginBottom: 10}}>이용약관은 다음과 같다.</Text>
    </View>
  );
}
function InformPersonalInformationProcessingPolicyScreen({navigation}) {
  return (
    <View style={{flex:1, flexDirection: 'column', margin: 40, flexWrap: 'wrap'}}>
      <Text style={{fontWeight:'bold', color: 'black', fontSize: 13}}>개인정보 처리방침1</Text>
      <Text style={{fontSize: 12, marginBottom: 10}}>개인정보 처리방침은 다음과 같다.</Text>
      <Text style={{fontWeight:'bold', color: 'black', fontSize: 13}}>개인정보 처리방침2</Text>
      <Text style={{fontSize: 12, marginBottom: 10}}>개인정보 처리방침은 다음과 같다.</Text>
      <Text style={{fontWeight:'bold', color: 'black', fontSize: 13}}>개인정보 처리방침3</Text>
      <Text style={{fontSize: 12, marginBottom: 10}}>개인정보 처리방침은 다음과 같다.</Text>
    </View>
  );
}

// 메인 페이지
function MainPageScreen(){
  return (
    <Tab.Navigator
      backBehavior={'initialRoute'} initialRouteName={'MyChatListScreen'}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, tintcolor  }) => {
          let iconName;
          let size = 24;
          if (route.name === 'SubscribeListScreen') {
            iconName = focused ? 'help-circle' : 'help-circle-outline';
            return <MaterialCommunityIcons name={iconName} size={size} color={tintcolor } />;
          } else if (route.name === 'MyChatListScreen') {
            iconName = focused ? 'chat' : 'chat-outline';
            return <MaterialCommunityIcons name={iconName} size={size} color={tintcolor } />;
          } else if (route.name === 'MyDiaryScreen') {
            if (focused) {
              return <FontAwesome name="bookmark" size={size} color={tintcolor } />;
            }else {
              return <Feather name="bookmark" size={size} color={tintcolor } />;
            }
          }

          // You can return any component that you like here!
        },
      })}
      tabBarPosition='bottom'
      tabBarOptions={{
        activeTintColor: 'black',
        inactiveTintColor: 'gray',
        showIcon: true,
        showLabel: false,
        style: {
          backgroundColor: '#DDD',
        },
      }}
    >
      <Tab.Screen name="SubscribeListScreen" component={SubscribeListScreen}/>
      <Tab.Screen name="MyChatListScreen" component={MyChatListScreen}/>
      <Tab.Screen name="MyDiaryScreen" component={MyDiaryScreen} />
    </Tab.Navigator>
  );
}
function SubscribeListScreen({navigation}){
  const [productList, setProductList] = React.useState(productListData);
  const [subscribeList, setSubscribeList] = React.useState(subscribeListData);

  useEffect(()=>{
    console.log('useEffect');
    setSubscribeList(subscribeListData);
  },[subscribeListData]);

  return (
    <SafeAreaView>
      <ScrollView styles={{marginHorizontal: 20}} centerContent={true}>
        <Text style={{margin:10}}>내 구독 상품</Text>
        {productList.map((product, i)=>{
          return subscribeList.some((subscribe)=>{
            return product.p_id === subscribe.p_id
          }) && <TouchableContentLayout key={i.toString()} id={product.p_id}  nav={()=>navigation.navigate('contentScreen', {id:product.p_id})}/>
        })}
        <Text style={{margin:10, borderTopWidth: 1, borderColor: 'gray', marginTop:23}}>구독 가능한 상품</Text>
        {productList.map((product, i)=>{
          return subscribeList.every((subscribe)=>{
            return product.p_id != subscribe.p_id
          }) && <TouchableContentLayout key={i.toString()} id={product.p_id} nav={()=>navigation.navigate('contentScreen', {id:product.p_id})}/>
        })}
      </ScrollView>
    </SafeAreaView>
  );
}
function MyChatListScreen({navigation}){
  const [mySubscribeList, setMySubscribeList] = React.useState(subscribeListData);
  const [zeroSubscribe, setZeroSubscribe] = React.useState(true);

  useEffect(()=>{
    if(mySubscribeList.length===0) {
      setZeroSubscribe(true);
    } else {
      setZeroSubscribe(false);
    }
    console.log('useEffect - pushListData');
  }, [navigation, pushListData]);

  return (
    <SafeAreaView style={{flex:1}}>
      <ScrollView styles={{marginHorizontal: 20}} centerContent={true} >
        {zeroSubscribe ? NoSubscribeInform(navigation) : <Text/>}
        {mySubscribeList.map((subscribe, i)=>{
          return <TouchableContentLayout key={i.toString()} id={subscribe.p_id} chatroom={true} nav={()=>navigation.navigate('chatroom', {id: subscribe.p_id})}/>
        })}
      </ScrollView>
    </SafeAreaView>
  );
}
function MyDiaryScreen({route, navigation}){
  const [editMode, setEditMode] = React.useState(false);
  const [diaryOption, setDiaryOption] = React.useState(diaryListData)
  const date = new Date();

  useFocusEffect(()=>{
    setEditMode(pressDiaryEditButton);
  });

  return (
    <SafeAreaView>
    <ScrollView>
      <View style={{flex:1, flexDirection: 'column', alignItems: 'center'}}>
        <View style={{flex:1, flexDirection: 'row', justifyContent: 'flex-start', flexWrap: 'wrap'}}>
          {diaryOption.map((diary)=>{
            return editMode ?
              <AnimatableDiaryComponent key={diary.p_id} id={diary.p_id} nav={navigation}/> :
              <DiaryComponent key={diary.p_id} id={diary.p_id} nav={navigation}/>
          })}
        </View>
      </View>
    </ScrollView>
    </SafeAreaView>
  );
}

// 기능 핸들러
function mainHeaderRightHandler(route, navigation){
  var handler = ()=>myButtonHandler();
  var title = getHeaderTitle(route, '채팅');
  var text = 'My';

  if(title === '내 다이어리') {
    if(pressDiaryEditButton){
      text = '완료';
      handler = () => completeDiaryButtonHandler(route, navigation);
    }else{
      text = '편집';
      handler = () => editDiaryButtonHandler(route, navigation);
    }
  }else {
    pressDiaryEditButton = false;
    text = 'My';
    handler = () => myButtonHandler(route, navigation);
  }

  return ()=>(
    <TouchableOpacity onPress={handler}>
      <Text style={{fontWeight: 'bold', marginRight: 20, fontSize: 20, color: 'gray'}}>{text}</Text>
    </TouchableOpacity>
  );
}
function myButtonHandler(route, navigation) {return navigation.navigate('MyServicePage');}
function chatSettingButtonHandler(navigation) {return navigation.openDrawer();}
function editDiaryButtonHandler(route, navigation){
  pressDiaryEditButton = true;

  return navigation.navigate('MyDiaryScreen', {editMode: true});
}
function completeDiaryButtonHandler(route, navigation){
  pressDiaryEditButton = false;

  return navigation.navigate('MyDiaryScreen', {editMode: false});
}



// 글로벌 구성품
class TouchableContentLayout extends React.Component{
  constructor(props){
    super(props);
  };

  render(){
    return (
      <TouchableOpacity onPress={this.props.nav}>
        <ContentLayout id={this.props.id} chatroom={this.props.chatroom??false}/>
      </TouchableOpacity>
    );
  };
}
class ContentLayout extends React.Component {
  constructor(props){
    super(props);
    this.state={
      id: this.props.id,
      lastUpdateTime: false,
      newItemCount: 0,
    };
    productListData.some((product)=>{
      if(product.p_id===this.state.id){
        this.state = {
          ...this.state,
          product: product,
        };
        return true;
      }
    });
    if(this.props.chatroom){
      pushListData.some((push)=>{
        if(push.p_id===this.state.id){
          this.state = {
            ...this.state,
            lastUpdateTime: push.lastUpdateTime,
            newItemCount: push.newItemCount,
          };
          return true;
        }
      });
    }
  }


  render() {
    return (
      <View style={{flexDirection: 'row', height: 56, margin: 3, borderWidth: 0, borderColor: 'gray'}}>
        <Image source={this.state.product.thumbnailImg} style={{height: 46, width: 46, margin: 5, borderRadius: 23, backgroundColor: '#DDD'}}/>
        <Text style={{marginLeft: 10, marginTop: 4, fontSize: 17, width: 220}}>{this.state.product.title ?? "임시 구독상품 명"}</Text>
        <View style={{flex:1, flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'flex-end'}}>
        {this.state.lastUpdateTime && <Text style={{fontSize: 10, marginRight: 6, marginTop: 0}}>{this.state.lastUpdateTime.format('LT')}</Text>}
          {
              this.state.newItemCount && this.state.newItemCount !== '0'
                ? <View style={{height: 20, width: 20, borderRadius: 10, backgroundColor: 'red', margin: 6, marginBottom: 8, alignItems: 'center', justifyContent: 'center'}}><Text style={{color: 'white', fontSize: 11}}>{this.state.newItemCount}</Text></View>
                : <View style={{height: 20, width: 20, borderRadius: 10, margin: 6, marginBottom: 8, alignItems: 'center', justifyContent: 'center'}}/>
          }
        </View>
      </View>
    );
  }
}
function getHeaderTitle(route, initialName) {
  // If the focused route is not found, we need to assume it's the initial screen
  // This can happen during if there hasn't been any navigation inside the screen
  // In our case, it's "Feed" as that's the first screen inside the navigator
  const routeName = getFocusedRouteNameFromRoute(route) ?? initialName;

  switch (routeName) {
    case 'MyChatListScreen':
      return '채팅';
    case 'MyDiaryScreen':
      return '내 다이어리'
    case 'SubscribeListScreen':
      return '구독 상품';
  }

  return routeName;
}

// 구독 구성품
const DateTimePickerExample = () => {
  const [date, setDate] = useState(new Date(1598051730000));
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const showMode = currentMode => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const showTimepicker = () => {
    showMode('time');
  };

  return (
    <View>
    <View>
    <Button onPress={showTimepicker} title="눌러서 시간 선택" />
    </View>
    {show && (
      <DateTimePicker
      testID="dateTimePicker"
      value={date}
      mode={mode}
      is24Hour={true}
      display="default"
      onChange={onChange}
      />
    )}
    </View>
  );
};
function SubscribeContentScreen({route, navigation}){
  const {id} = route.params;
  var productInfo = false;
  productListData.some((product)=>{
    if(id===product.p_id){
      productInfo = product;
      return true;
    }
  });
  console.log('id', id);
  console.log('SubscribeContentScreen-productInfo', productInfo);
  var subscribeInfo = false;
  subscribeListData.some((subscribe)=>{
    if(id===subscribe.p_id){
      subscribeInfo = subscribe;
      return true;
    }
  });
  console.log('SubscribeContentScreen-subscribeInfo', subscribeInfo);
  const [isSubscribe, setIsSubscribe] = React.useState(subscribeInfo?true:false);
  const [pushTime, setPushTime] = React.useState({
    pushStartTime: subscribeInfo?subscribeInfo.pushStartTime: Moment(),
    pushEndTime: subscribeInfo?subscribeInfo.pushEndTime: Moment(),
  });

  return (
    <SafeAreaView>
      <ScrollView centerContent={true} onScroll={(event)=>{
        event.nativeEvent.contentOffset.y > 260.0 ? navigation.setOptions({ headerTitle: productInfo.title, headerTransparent: false}) : navigation.setOptions({ headerTitle: '', headerTransparent: true})
      }}>
        <Image source={productInfo.bannerImg} style={{height: 200}} resizeMode='cover'/>
        <View style={{backgroundColor: '#EEE', justifyContent: 'space-around', alignItems: 'center'}}>
          <Image source={productInfo.thumbnailImg} style={{position:'absolute', alignSelf: 'center', top:-80, height: 100, width: 100, borderRadius: 50}}/>
          <Text style={{fontSize: 20, fontWeight:'bold', marginTop: 35, marginBottom: 10}}>{productInfo.title}</Text>
          <Text style={{margin: 20}}>{productInfo.text}</Text>
        </View>
        <Image source={productInfo.mainImg} style={{height: 1200}} resizeMode='cover'/>
        <View style={{height: 400, backgroundColor: '#EEE'}}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <View style={{flexDirection: 'column'}}>
              <Text style={{marginLeft: 30, marginTop: 40, fontSize: 20}}>구독 하기</Text>
              <Text style={{marginLeft: 30, marginTop: 40, fontSize: 20}}>정시 메시지 수신 시간</Text>
            </View>
            <TouchableOpacity style={{marginTop: 40, marginRight: 30}} onPress={()=>setIsSubscribe(!isSubscribe)}>
              <View style={{flexDirection: 'row', height: 30, width: 85, borderRadius: 15, backgroundColor: isSubscribe?'cornflowerblue':'white', borderWidth: 1}}>
                {isSubscribe? (
                  <>
                    <Text style={{marginLeft: 11, color: 'white', fontSize: 18}}>ON</Text>
                    <View style={{marginTop: 5, marginLeft: 16, height: 18, width: 18, borderRadius: 9, backgroundColor: 'white'}}/>
                  </>
                ):(
                  <>
                    <View style={{marginTop: 5, marginLeft: 10, height: 18, width: 18, borderRadius: 9, backgroundColor: 'black'}}/>
                    <Text style={{marginLeft: 11, color: 'black', fontSize: 18}}>OFF</Text>
                  </>
                )}
              </View>
            </TouchableOpacity>
          </View>
          <View style={{alignSelf: 'flex-end', margin: 20}}>
            <Text style={{fontSize: 25}}>{pushTime.pushStartTime.format('LT')}</Text>
          </View>
          <View style={{margin:20, borderRadius: 10, width: 230, alignSelf: 'center'}}>
            <DateTimePickerExample/>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// 채팅 구성품
function NoSubscribeInform(navigation){
  return (
    <TouchableOpacity onPress={()=>{ navigation.navigate('SubscribeListScreen'); Alert.alert('상품을 구독해 보세요', '구독한 상품정보를 받을 수 있습니다.', [{text: '확인'}])}}>
      <View style={{flexDirection: 'row', height: 56, margin: 10, borderWidth: 1, borderRadius: 8, borderColor: 'gray', alignItems: 'center'}}>
        <Image source={null} style={{height: 40, width: 40, margin: 16, borderRadius: 8, backgroundColor: '#DDD'}}/>
        <Text style={{marginLeft: 15, fontSize: 17, width: 220}}>원하는 상품을 구독해보세요!</Text>
      </View>
    </TouchableOpacity>
  );
}
function CustomDrawerContent({navigation}) {
  return (
    <DrawerContentScrollView>
      <TouchableOpacity onPress={()=>navigation.closeDrawer()}>
        <Octicons name="three-bars" style={{marginLeft:20, marginTop:10, marginBottom: 30}} size={30} color="black" />
      </TouchableOpacity>
      <DrawerItem label="다이어리 보기"  icon={()=><MaterialCommunityIcons name="bookmark-outline" size={30} color="black" />} onPress={() => {navigation.navigate('MyDiaryScreen'); navigation.navigate('Diary', {id:global_p_id})}} />
      <DrawerItem label="푸시 메세지 설정" icon={()=><Ionicons name="md-time" style={{marginLeft: 3}} size={30} color="black" />} onPress={() => {navigation.navigate('SubscribeListScreen'); navigation.navigate('contentScreen', {id:global_p_id})}} />
      <DrawerItem label="채팅방 나가기" icon={()=><MaterialIcons name="exit-to-app" size={30} color="black" />}
        onPress={() => {
          Alert.alert('정말 채팅방을 나가시겠습니까?', '채팅방을 나가면 채팅 내용과 채팅 목록은 사라지고 다이어리에서만 기록을 확인할 수 있습니다.', [{text: '나가기', onPress: ()=>navigation.navigate('MainPage')}, {text:'취소'}]);}} />
    </DrawerContentScrollView>
  );
}
function MyChatRoomScreen({route, navigation}) {
  const [messages, setMessages] = useState([]);
  const {id} = route.params;
  var productInfo = false;
  productListData.some((product)=>{
    if(id===product.p_id){
      productInfo = product;
      return true;
    }
  });
  var chatroomInfo = false;
  chatMessageListData.some((chatMessage)=>{
    if(id===chatMessage.p_id){
      chatroomInfo = chatMessage;
      return true;
    }
  });
  var pushInfo = false;
  pushListData.some((push)=>{
    if(id===push.p_id){
      pushInfo = push;
      push.newItemCount = 0;
      return true;
    }
  });

  useEffect(() => {
    setMessages(chatroomInfo.message);
    global_p_id = id;
    navigation.addListener('beforeRemove', (e) => {
      console.log('beforeRemove', messages);
    })
  }, [navigation])

  React.useLayoutEffect(() => {
    navigation.setOptions({ headerTitle: productInfo.title });
  }, [navigation, route]);

  const onSend = useCallback((messages = []) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, messages));
    console.log('input messages', messages);
    chatroomInfo.message.unshift(messages[0]);
  }, [])

  return (
      <GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}
        user={{
          _id: 1,
        }}
      />
  )
}

// 다이어리 구성품
class AnimatableDiaryComponent extends React.Component{
  constructor(props){
    super(props);

    this.state = {
      id: this.props.id?this.props.id:1,
      productInfo: false,
      diaryOption: false,
    };

    productListData.some((product)=>{
      if(this.state.id===product.p_id){
        this.state.productInfo=product;
        return true;
      }
    });
    diaryListData.some((diary)=>{
      if(this.state.id===diary.p_id){
        this.state.diaryOption=diary;
        return true;
      }
    });
  }

  render(){
    return (
      <View style={{margin: 5}}>
        <Animatable.View animation='swing' iterationCount={'infinite'}>
      <TouchableOpacity style={{margin: 20, marginBottom: 0, marginTop: 10}} onPress={()=>Alert.alert('다이어리 순서변경 기능', '추가예정')}>

          <Image style={{height: 190, width: 130, marginBottom: 5}} source={this.state.diaryOption.diaryImg} resizeMode='contain'/>
          <View>
            <Text style={{fontSize: 20, color: 'black', fontWeight:'bold', alignSelf: 'center'}}>{this.state.productInfo.title}</Text>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5}}>
              <Text style={{fontSize: 8, color: 'gray'}}>{this.state.diaryOption.lastUpdateTime.format('YYYY')}년 {this.state.diaryOption.lastUpdateTime.format('MM')}월 {this.state.diaryOption.lastUpdateTime.format('DD')}일</Text>
              <Text style={{fontSize: 8, color: 'gray'}}>{this.state.diaryOption.totalUpdateCount}회 기록</Text>
            </View>
          </View>

      </TouchableOpacity>
      </Animatable.View>
      <TouchableOpacity onPress={()=>{Alert.alert(this.props.title+'을 삭제하시겠습니까?', '삭제 기능 구현예정')}} style={{position: 'absolute', left: 18, top:18, backgroundColor: '#999', height: 30, width: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center'}}>
        <Text>X</Text>
      </TouchableOpacity>
    </View>
    );
  }
}
class DiaryComponent extends React.Component{
  constructor(props){
    super(props);

    this.state = {
      id: this.props.id?this.props.id:1,
      productInfo: false,
      diaryOption: false,
    };

    productListData.some((product)=>{
      if(this.state.id===product.p_id){
        this.state.productInfo=product;
        return true;
      }
    });
    diaryListData.some((diary)=>{
      if(this.state.id===diary.p_id){
        this.state.diaryOption=diary;
        return true;
      }
    });
  }

  render(){
    return (
      <TouchableOpacity style={{margin: 20, marginBottom: 0, marginTop: 10}} onPress={()=>{this.props.nav.navigate('Diary', {id: this.state.id})}}>
        <View style={{margin: 5}}>
          <Image style={{height: 190, width: 130, marginBottom: 5}} source={this.state.diaryOption.diaryImg} resizeMode='contain'/>
          <View>
            <Text style={{fontSize: 20, color: 'black', fontWeight:'bold', alignSelf: 'center'}}>{this.state.productInfo.title}</Text>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5}}>
              <Text style={{fontSize: 8, color: 'gray'}}>{this.state.diaryOption.lastUpdateTime.format('YYYY')}년 {this.state.diaryOption.lastUpdateTime.format('MM')}월 {this.state.diaryOption.lastUpdateTime.format('DD')}일</Text>
              <Text style={{fontSize: 8, color: 'gray'}}>{this.state.diaryOption.totalUpdateCount}회 기록</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}
function DailyDiaryContentWithDate({message, last, nav, title}){
  const [myMessage, setMyMessage] = React.useState(message? message.text : '임시 텍스트');
  const [editMode, setEditMode] = React.useState(true);

  const onFocusHandler = () => {

    nav.setOptions({
      headerTitle: '편집 중',
      headerRight: (props) => (
        <TouchableOpacity onPress={onEndEditingHandler}>
        <Text style={{fontSize:20, marginRight: 20, justifyContent: 'center'}}>완료</Text>
        </TouchableOpacity>
      )
    });
  };
  const onEndEditingHandler = () => {
    setEditMode(false);
    message.text = myMessage;
    nav.setOptions({
      headerTitle: title,
      headerRight: (props) => (
        <TouchableOpacity onPress={() => optionDiaryButtonHandler()}>
        <MaterialCommunityIcons name="arrow-down-circle-outline" style={{marginRight: 20}} size={40} color="black" />
        </TouchableOpacity>
      )
    });

  };

  return (
    <View style={{flex:1, flexDirection: 'row'}}>
      <View style={{width: 16, height: 16, borderRadius: 8, backgroundColor: 'gray', marginTop: 10}}/>
      <SafeAreaView style={{flex: 1, flexDirection: 'column', marginRight: 8}}>
        <Text style={{color: 'gray', fontWeight: 'bold', fontSize: 20, marginLeft: 10}}>{message.createdAt.format('MMDD')}</Text>
          {!last ?
            <TouchableOpacity onPress={()=>setEditMode(true)}>
              <TextInput editable={editMode} onFocus={onFocusHandler} onEndEditing={onEndEditingHandler} style={{marginLeft: 30, fontSize: 13, padding:3, borderRadius: 5}} multiline value={myMessage} onChangeText={text=>setMyMessage(text)}/>
            </TouchableOpacity>
            : <Text style={{marginLeft: 30, fontSize: 13, padding:3, borderRadius: 5}}>{myMessage}</Text>
          }
          <TouchableOpacity>
          <Text style={{fontSize: 10, color: '#AAA', alignSelf: 'flex-end', marginTop: 6, marginBottom: 30}}>{!last&&message.createdAt.format('LT')}</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}
function DailyDiaryContentNoDate({message, last, nav, title}){
  const [myMessage, setMyMessage] = React.useState(message? message.text : '임시 텍스트');
  const [editMode, setEditMode] = React.useState(true);

  const onFocusHandler = () => {

    nav.setOptions({
      headerTitle: '편집 중',
      headerRight: (props) => (
        <TouchableOpacity onPress={onEndEditingHandler}>
        <Text style={{fontSize:20, marginRight: 20, justifyContent: 'center'}}>완료</Text>
        </TouchableOpacity>
      )
    });
  };
  const onEndEditingHandler = () => {
    setEditMode(false);
    message.text = myMessage;
    nav.setOptions({
      headerTitle: title,
      headerRight: (props) => (
        <TouchableOpacity onPress={() => optionDiaryButtonHandler()}>
        <MaterialCommunityIcons name="arrow-down-circle-outline" style={{marginRight: 20}} size={40} color="black" />
        </TouchableOpacity>
      )
    });

  };

  return (
    <View style={{flex:1, flexDirection: 'row'}}>
      <View style={{width: 16}}/>
      <SafeAreaView style={{flex: 1, flexDirection: 'column', marginRight: 8, marginTop:-30}}>
        <Text style={{marginLeft: 10}}></Text>
          {!last ?
            <TouchableOpacity onPress={()=>setEditMode(true)}>
              <TextInput editable={editMode} onFocus={onFocusHandler} onEndEditing={onEndEditingHandler} style={{marginLeft: 30, fontSize: 13, padding:3, borderRadius: 5}} multiline value={myMessage} onChangeText={text=>setMyMessage(text)}/>
            </TouchableOpacity>
            : <Text style={{marginLeft: 30, fontSize: 13, padding:3, borderRadius: 5}}>{myMessage}</Text>
          }
          <TouchableOpacity>
          <Text style={{fontSize: 10, color: '#AAA', alignSelf: 'flex-end', marginTop: 6, marginBottom: 30}}>{!last&&message.createdAt.format('LT')}</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}
function DynamicDiaryScreen({navigation, route}){
  const [valueY, setValueY] = React.useState(0);
  const [contentHeight, setContentHeight] = React.useState(1000000);
  const [showDropbox, setShowDropbox] = React.useState(false);
  const {id} = route.params;
  var productInfo = false;
  var chatMessageInfo = false;
  var diaryInfo = [];
  var time=false;

  productListData.some((product)=>{
    if(id===product.p_id){
      productInfo = product;
      return true;
    }
  });
  chatMessageListData.some((chatMessage)=>{
    if(id===chatMessage.p_id){
      chatMessageInfo = chatMessage;
      return true;
    }
  });
  diaryListData.some((diary)=>{
    if(id===diary.p_id){
      diaryInfo = diary;
      return true;
    }
  });
  const diaryOptionFocusHandler = () => {
      setShowDropbox(true);
  };
  const diaryOptionBlurHandler = () => {
      setShowDropbox(false);
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: productInfo.title,
      headerRight: (props) => (
        <TouchableOpacity onPress={diaryOptionFocusHandler}>
          <MaterialCommunityIcons name="arrow-down-circle-outline" style={{marginRight: 20}} size={40} color="black" />
        </TouchableOpacity>
      )
    });
  }, [navigation, route]);

  return (
    <View style={{flex:1, flexDirection: 'column'}}>
    <View style={{position: 'absolute', left: 47, top: 30,  width: 2, borderRadius: 1, backgroundColor: 'gray', height: 50}}/>
    <View style={{backgroundColor: '#555', position: 'absolute', left:15, top: 30, borderRadius: 12}}>
      <Text style={{color: 'white', fontSize: 20, marginVertical: 3, marginHorizontal: 5}}>2020</Text>
    </View>
    <ScrollView style={{ marginTop: 80, marginBottom: 50}} keyboardDismissMode={'on-drag'} scrollToEnd={true}>
      <View style={{flex:1, flexDirection: 'column', marginLeft: 40, marginRight: 10, marginBottom: 60}}>
        {diaryInfo.diaryMessage.map((message)=>{
          if(time&&time.isSameOrAfter(message.createdAt, 'day')){
            time = message.createdAt;
            return <DailyDiaryContentNoDate key={message._id} nav={navigation} title={productInfo.title} message={message} last={false}/>
          }else{
            time = message.createdAt;
            return <DailyDiaryContentWithDate key={message._id} nav={navigation} title={productInfo.title} message={message} last={false}/>
          }
          time = message.createdAt;
          return <DailyDiaryContentWithDate key={message._id} nav={navigation} title={productInfo.title} message={message} last={false}/>
        })}

        <DailyDiaryContentWithDate key={0} message={{text:'마지막 입니다.', createdAt: Moment()}} last={true}/>
      </View>
      <View style={{position: 'absolute', left: 47,  width: 2, borderRadius: 1, backgroundColor: 'gray', height: contentHeight, bottom:150}}/>

    </ScrollView>
    {showDropbox &&
      <View style={{position: 'absolute', left: 0, top:0, bottom:0, right:0, backgroundColor: '#AAA8'}}>
        <View style={{height: 65, borderBottomWidth: 1, borderColor: '#AAA', backgroundColor: '#EEE', justifyContent: 'center'}}>
          <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', padding: 5}} onPress={()=>{}}>
            <FontAwesome name="file-pdf-o" size={30} color="black" />
            <Text style={{position: 'absolute', left: 50, fontSize: 23}}>PDF 다운로드</Text>
          </TouchableOpacity>
        </View>
        <View style={{height: 65, backgroundColor: '#EEE', justifyContent: 'center'}}>
          <TouchableOpacity style={{flexDirection: 'row',  alignItems: 'center', padding: 5}} onPress={()=>{}}>
            <EvilIcons name="external-link" size={40} color="black" />
            <Text style={{position: 'absolute', left: 50, fontSize: 23}}>링크로 공유하기</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={diaryOptionBlurHandler} style={{flex:1, flexDirection: 'column', backgroundColor: '#AAAd'}}/>
      </View>}
    </View>
  );
}

// 마이페이지
function MyPageScreen({navigation}) {
  const [myDiaryCount, setMyDiaryCount] = React.useState(10);
  const [totalCount, setTotalCount] = React.useState(256);
  const [image, setImage] = React.useState(null);

  return (
    <View style={{flex:1, flexDirection: 'column'}}>
      <View style={{margin:15, marginBottom: 0, alignItems: 'center', borderBottomWidth: 1, height: 170, justifyContent: 'center'}}>
        <TouchableOpacity onPress={()=>{}}>
          <Image source={{uri: image}} style={{height: 80, width: 80, borderRadius: 40, backgroundColor: 'gray', marginTop: 20, marginBottom: 12}}/>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>{}}>
          <View style={{flexDirection: 'row'}}>
            <Text style={{fontWeight: 'bold', fontSize: 20, marginLeft: 20}}>사용자 이름</Text>
            <EvilIcons name="pencil" size={30} color="black"  style={{marginLeft:5, justifyContent: 'center'}}/>
          </View>
        </TouchableOpacity>
      </View>
      <View style={{}}>
        <View style={{marginHorizontal: 15, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#DDD'}}>
          <EvilIcons name="lock" color="black" size={45} style={{marginVertical: 15, marginLeft: -10}}/>
          <TouchableOpacity onPress={()=>{
            Alert.alert('정말 로그아웃 하시겠습니까?','로그인 페이지로 이동합니다.',[{text:'취소'}, {text:'확인', onPress:()=>{
              Alert.alert('아직 미구현', '로그인 페이지로 이동할 예정');
            }}])}}>
            <Text style={{fontSize: 22, marginLeft: 3}}>로그아웃</Text>
          </TouchableOpacity>
        </View>
        <View style={{marginHorizontal: 15, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#DDD'}}>
          <AntDesign name="key" color="black" size={30} style={{marginVertical: 15, marginLeft: 0}}/>
          <TouchableOpacity onPress={()=>navigation.navigate('ChangePassword')}>
            <Text style={{fontSize: 22, marginLeft: 9}}>비밀번호 변경</Text>
          </TouchableOpacity>
        </View>
        <View style={{marginHorizontal: 15, borderBottomWidth: 1, borderBottomColor: '#DDD'}}>
          <View style={{ flexDirection: 'row', alignItems: 'center'}}>
            <AntDesign name="filetext1" color="black" size={30} style={{marginVertical: 15, marginLeft: 0}}/>
            <TouchableOpacity onPress={()=>navigation.navigate('UserHistory')}>
              <Text style={{fontSize: 22, marginLeft: 9}}>이용 내역</Text>
            </TouchableOpacity>
          </View>
          <View style={{marginLeft: 45, marginRight: 5, marginHorizontal: 10, marginBottom: 20, borderWidth: 1, borderRadius: 10, alignItems: 'center'}}>
            <Text style={{fontSize: 15, margin: 10}}>내 기록: {totalCount}         내 다이어리: {myDiaryCount}</Text>
          </View>
        </View>
        <View style={{marginHorizontal: 15, flexDirection: 'row', alignItems: 'center'}}>
          <Feather name="info" color="black" size={30} style={{marginVertical: 15, marginLeft: 0}}/>
          <TouchableOpacity onPress={()=>navigation.navigate('ServiceCenter')}>
            <Text style={{fontSize: 22, marginLeft: 9}}>고객센터</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
function MyChangePasswordPage({navigation}) {
  const [prevPassword, setPrevPassword] = useState('');
  const [nextPassword, setNextPassword] = useState('');
  const [nextAdditionalPassword, setAdditionalNextPassword] = useState('');
  const [warnPrevPasswordError, setWarnPrevPasswordError] = useState(false);
  const [warnNextPasswordError, setWarnNextPasswordError] = useState(true);
  const [warnNotCorrectPasswordError, setWarnNotCorrectPasswordError] = useState(false);

  return (
    <ScrollView>
    <View style={{flex:1, flexDirection: 'column', justifyContent: 'space-around'}}>
      <View style={{margin: 20}}>
        <Text style={{marginVertical: 5, fontWeight:'bold', fontSize: 20}}>현재 비밀번호</Text>
        <TextInput value={prevPassword} style={{borderWidth: 1, backgroundColor: '#DDD', fontSize: 30}} secureTextEntry={true} onChange={(text)=>setPrevPassword(text)}/>
        <Text style={{color: warnPrevPasswordError? '#D00f':'#D000', fontSize: 11, marginLeft: 15, marginVertical: 5}}>올바른 비밀번호를 입력해주세요. 현재 비밀번호와 다릅니다.</Text>
      </View>
      <View style={{margin: 20}}>
        <Text style={{marginVertical: 5, fontWeight:'bold', fontSize: 20}}>새 비밀번호</Text>
        <TextInput value={nextPassword} style={{borderWidth: 1, backgroundColor: '#DDD', fontSize: 30}} secureTextEntry={true} onChange={(text)=>setNextPassword(text)}/>
        <Text style={{fontSize: 11, marginLeft: 15, marginVertical: 5}}>6~16자 영문, 소문자, 숫자만 사용 가능 합니다.</Text>
        <Text style={{color: warnNextPasswordError? '#D00f':'#D000', fontSize: 11, marginLeft: 15, marginVertical: 5}}>비밀번호를 올바른 형식으로 입력해주세요.</Text>
      </View>
      <View style={{margin: 20}}>
        <Text style={{marginVertical: 5, fontWeight:'bold', fontSize: 20}}>새 비밀번호 확인</Text>
        <TextInput value={nextAdditionalPassword} style={{borderWidth: 1, backgroundColor: '#DDD', fontSize: 30}} secureTextEntry={true} onChange={(text)=>setAdditionalNextPassword(text)}/>
        <Text style={{color: warnNotCorrectPasswordError? '#D00f':'#D000', fontSize: 11, marginLeft: 15, marginVertical: 5}}>새 비밀번호와 동일하게 입력해주세요.</Text>
      </View>
      <View style={{margin: 20}}>
        <TouchableOpacity onPress={()=>{Alert.alert('비밀번호가 변경되었습니다.', '다시 로그인 해주세요.', [{text: '확인'}])}} style={{borderRadius: 1, backgroundColor: '#CCC', alignItems: 'center', justifyContent: 'center', flex:1}}>
          <Text style={{margin:10, fontSize: 22}}>변경완료</Text>
        </TouchableOpacity>
      </View>
    </View>
    </ScrollView>
  );
}
class SubscribeContentBoxComponent extends React.Component{
  constructor(props){
    super(props);
  }

  render(){
    return (
      <View style={styles.myShadow}>
        <Text style={{marginLeft: 20, marginVertical: 10, fontSize: 20, fontWeight: 'bold'}}>{this.props.title}</Text>
        <Text style={{marginLeft:40, marginVertical: 0, fontSize: 20, fontWeight: 'bold'}}>내 기록   <Text style={{fontSize: 25, fontWeight: 'normal'}}>{this.props.count}</Text></Text>
        <Text style={{marginLeft:40, marginVertical: 4, marginBottom: 10, fontSize: 20, fontWeight: 'bold'}}>기간        <Text style={{fontSize: 13, fontWeight: 'normal'}}>{this.props.startDate} ~ {'2020.6.10'}</Text></Text>
      </View>
    );
  }
}
function UserHistoryPage({navigation}) {
  return (
    <ScrollView style={{flex:1, flexDirection: 'column', backgroundColor: '#fff'}}>
      <Text style={{margin:20, fontWeight:'bold', fontSize: 20}}>나의 구독 내역</Text>
      <SubscribeContentBoxComponent title={'구독 상품명1'} count={51} startDate={'2020.3.12'}/>
      <SubscribeContentBoxComponent title={'구독 상품명2'} count={5} startDate={'2020.4.12'}/>
      <SubscribeContentBoxComponent title={'구독 상품명3'} count={123} startDate={'2020.3.30'}/>
      <SubscribeContentBoxComponent title={'구독 상품명4'} count={17} startDate={'2020.7.28'}/>
    </ScrollView>
  );
}

// 서비스센터 페이지들
function ServiceCenterPage({navigation}) {
  return (
    <View style={{flex:1, flexDirection: 'column', borderTopWidth: 1, marginHorizontal: 10}}>
      <TouchableOpacity style={{height: 90, justifyContent: 'center', borderBottomWidth: 1, borderColor: '#DDD'}} onPress={()=>navigation.push('ServiceIntroduction')}>
        <Text style={{marginLeft: 30, fontSize: 20}}>서비스 소개</Text>
      </TouchableOpacity>
      <TouchableOpacity style={{height: 90, justifyContent: 'center', borderBottomWidth: 1, borderColor: '#DDD'}} onPress={()=>navigation.push('Help')}>
        <Text style={{marginLeft: 30, fontSize: 20}}>도움말</Text>
      </TouchableOpacity>
      <TouchableOpacity style={{height: 90, justifyContent: 'center', borderBottomWidth: 1, borderColor: '#DDD'}} onPress={()=>navigation.push('Notice')}>
        <Text style={{marginLeft: 30, fontSize: 20}}>공지사항</Text>
      </TouchableOpacity>
      <TouchableOpacity style={{height: 90, justifyContent: 'center'}} onPress={()=>navigation.push('Question')}>
        <Text style={{marginLeft: 30, fontSize: 20}}>문의하기</Text>
      </TouchableOpacity>
    </View>
  );
}
function ServiceIntroductionPage({navigation}) {
  return (
    <View style={{flex:1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
      <Text>서비스 소개</Text>
    </View>
  );
}
class HelpContentComponent extends React.Component{
  constructor(props){
    super(props);

    this.state = {
      showAnswer: false,
    }
  }

  render(){
    return (
      <TouchableOpacity onPress={()=>{this.setState(previousState => ({showAnswer: !previousState.showAnswer}))}} style={{flexDirection: 'column', borderColor: '#666', marginHorizontal: 10, marginVertical: 6, borderWidth: 1, borderRadius: 10}}>
        <Text style={{marginLeft: 15, marginVertical: 20, fontSize: 17, marginRight: 43}}>Q.
          <Text style={{textDecorationLine: this.state.showAnswer?'underline':'none', fontWeight:this.state.showAnswer?'bold':'normal'}}> {this.props.question}</Text>
        </Text>
        <MaterialCommunityIcons style={{position: 'absolute', right: 0, marginRight: 15, marginTop: 20}} name={this.state.showAnswer? "chevron-up":"chevron-down"} size={30} color="black" />
        {this.state.showAnswer &&
          <View style={{marginLeft: 30, marginBottom: 5}}>
            <Text>{this.props.answer}</Text>
          </View>
        }
      </TouchableOpacity>
    );
  }
}
function HelpPage({navigation}) {
  const helpMessage = [{
    question: '다이어리를 다운받고 싶어요.',
    answer: '안녕하세요 큐모먼트입니다.\n큐모먼트서비스를 이용해 주셔서 감사합니다. 앞으로도 큐모먼트에 많은 성원 부탁드립니다.\n다이어리 다운로드 방법\n\n1. PDF다운로드 받기\n2. 링크 내보내기'
  }, {
    question: '제목이 너무 길면 어떻게 되는지 알고 싶어요 제목이 너무 길면 어떻게 되는지 알고 싶어요',
    answer: '안녕하세요 큐모먼트입니다.\n큐모먼트서비스를 이용해 주셔서 감사합니다. 앞으로도 큐모먼트에 많은 성원 부탁드립니다.\n다이어리 다운로드 방법\n\n1. PDF다운로드 받기\n2. 링크 내보내기'
  }]

  return (
    <ScrollView style={{flex:1, flexDirection: 'column', marginTop: 10}}>
      <HelpContentComponent question={helpMessage[0].question} answer={helpMessage[0].answer}/>
      <HelpContentComponent question={helpMessage[1].question} answer={helpMessage[1].answer}/>
    </ScrollView>
  );
}
class NoticeContentComponent extends React.Component{
  constructor(props){
    super(props);

    this.state = {
      showMessage: false,
    }
  }

  render(){
    return (
      <TouchableOpacity onPress={()=>{this.setState(previousState => ({showMessage: !previousState.showMessage}))}} style={{flexDirection: 'column', borderColor: '#666', marginHorizontal: 10, marginVertical: 6, borderWidth: 1, borderRadius: 10}}>
        <Text style={{marginLeft: 15, marginVertical: 16, fontSize: 17, marginRight: 43, textDecorationLine: this.state.showMessage?'underline':'none', fontWeight:this.state.showMessage?'bold':'normal'}}>{this.props.title}</Text>
        <Text style={{marginLeft: 20, marginBottom: 15, fontSize: 12, fontWeight:this.state.showMessage?'bold':'normal'}}>{this.props.date}</Text>
        <MaterialCommunityIcons style={{position: 'absolute', right: 0, marginRight: 15, marginTop: 20}} name={this.state.showMessage? "chevron-up":"chevron-down"} size={30} color="black" />
        {this.state.showMessage &&
          <View style={{marginLeft: 30, marginBottom: 5, marginTop:10}}>
            <Text>{this.props.message}</Text>
          </View>
        }
      </TouchableOpacity>
    );
  }
}
function NoticePage({navigation}) {
  const noticeMessage = [{
    title: '위치기반 서비스 이용약관 사전 안내',
    date: '2019-03-26',
    message: '안녕하세요 큐모먼트입니다.\n큐모먼트서비스를 이용해 주셔서 감사합니다. 앞으로도 큐모먼트에 많은 성원 부탁드립니다.\n다이어리 다운로드 방법\n\n1. PDF다운로드 받기\n2. 링크 내보내기'
  }, {
    title: '제목이 너무 길면 어떻게 되는지 알고 싶어요 제목이 너무 길면 어떻게 되는지 알고 싶어요',
    date: '2020-07-22',
    message: '안녕하세요 큐모먼트입니다.\n큐모먼트서비스를 이용해 주셔서 감사합니다. 앞으로도 큐모먼트에 많은 성원 부탁드립니다.\n다이어리 다운로드 방법\n\n1. PDF다운로드 받기\n2. 링크 내보내기'
  }]

  return (
    <ScrollView style={{flex:1, flexDirection: 'column', marginTop: 10}}>
      <NoticeContentComponent title={noticeMessage[0].title} date={noticeMessage[0].date} message={noticeMessage[0].message}/>
      <NoticeContentComponent title={noticeMessage[1].title} date={noticeMessage[1].date} message={noticeMessage[1].message}/>
      <NoticeContentComponent title={noticeMessage[0].title} date={noticeMessage[0].date} message={noticeMessage[0].message}/>
      <NoticeContentComponent title={noticeMessage[1].title} date={noticeMessage[1].date} message={noticeMessage[1].message}/>
    </ScrollView>
  );
}
class MyQuestionContentComponent extends React.Component{
  constructor(props){
    super(props);

    this.state = {
      showMessage: false,
      isAnswered: this.props.QuestionMessage.isAnswered,
      title: this.props.QuestionMessage.title,
      message: this.props.QuestionMessage.message,
      answer: this.props.QuestionMessage.answer,
    }
  }

  render(){
    return (
      <TouchableOpacity onPress={()=>{this.setState(previousState => ({showMessage: !previousState.showMessage}))}} style={{flexDirection: 'column', borderColor: '#666', marginHorizontal: 10, marginVertical: 6, borderWidth: 1, borderRadius: 10}}>
        <View style={{flexDirection: 'row'}}>
          <Text style={{alignSelf: 'center', marginLeft: 10, borderWidth: 1, borderRadius: 5, borderColor: this.props.QuestionMessage.isAnswered?'blue':'red', padding:2, color: this.props.QuestionMessage.isAnswered?'blue':'red'}}>{this.props.QuestionMessage.isAnswered?'답변완료':'답변예정'}</Text>
          <Text style={{marginLeft: 15, marginVertical: 16, fontSize: 17, marginRight: 43, textDecorationLine: this.state.showMessage?'underline':'none', fontWeight:this.state.showMessage?'bold':'normal'}}>{this.props.QuestionMessage.title}</Text>
          <MaterialCommunityIcons style={{position: 'absolute', right: 0, marginRight: 15, marginTop: 14}} name={this.state.showMessage? "chevron-up":"chevron-down"} size={30} color="black" />
        </View>
        {this.state.showMessage &&
          <View style={{marginLeft: 30, marginBottom: 10, marginTop:10, marginRight: 30}}>
            <Text style={{fontSize:20, fontWeight:'bold', marginVertical: 10}}>문의 내용</Text>
            <Text style={{marginBottom: 10}}>{this.props.QuestionMessage.message}</Text>
            <Text style={{fontSize:20, fontWeight:'bold', marginVertical: 10}}>답변 내용</Text>
            <Text>{this.props.QuestionMessage.answer}</Text>
          </View>
        }
      </TouchableOpacity>
    );
  }
}
class MyQuestionFormComponent extends React.Component{
  constructor(props){
    super(props);
    this.state={
      type: '',
      title: '',
      message: '',
    }
  }

  render(){
    return (
      <View style={{flex:1, flexDirection: 'column', marginHorizontal: 20, marginVertical: 10}}>
        <TouchableOpacity style={{borderWidth: 1, borderRadius: 10, justifyContent: 'center', padding: 8}} onPress={()=>Alert.alert('미구현!', '드롭박스기능 공부하여 추가할 예정')}>
          <Text>문의 유형 선택</Text>
        </TouchableOpacity>
        <TextInput style={{borderWidth: 1, borderRadius: 10, padding:15, marginVertical: 20}}  value={this.title} placeholder={'문의 제목'} onChange={(text)=>this.setState(preState=>({title: text}))}/>
        <TextInput multiline style={{borderWidth: 1, borderRadius: 10, padding:15, minHeight: 230}}  value={this.message} placeholder={'문의 내용'} onChange={(text)=>this.setState(preState=>({message: text}))}/>
        <Text style={{fontSize: 10, marginVertical: 20}}>문의 내용 등록 시<Text style={{color:'blue'}} onPress={()=>Alert.alert('미구현!', '개인정보 처리방침 페이지로 링크 연결 예정')}> 개인정보 처리방침</Text>을 확인하였으며 동의합니다.</Text>
        <TouchableOpacity style={{marginTop: 45, marginBottom: 25, paddingVertical: 8, borderWidth: 1, backgroundColor: '#545', justifyContent: 'center', alignItems: 'center'}} onPress={()=>Alert.alert('미구현!', '문의정보를 받아와 저장하는 기능 구현 예정')}>
          <Text style={{color:'white', fontSize: 20}}>문의하기</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
function QuestionPage({navigation}) {
  const [myQuestionTab, setMyQuestionTab] = React.useState(true);
  const QuestionMessage = [{
    isAnswered: false,
    title: '문의 제목1',
    message: '안녕하세요 큐모먼트입니다.\n큐모먼트서비스를 이용해 주셔서 감사합니다. 앞으로도 큐모먼트에 많은 성원 부탁드립니다.\n다이어리 다운로드 방법\n\n1. PDF다운로드 받기\n2. 링크 내보내기',
    answer: '안녕하세요 큐모먼트입니다.\n큐모먼트서비스를 이용해 주셔서 감사합니다. 앞으로도 큐모먼트에 많은 성원 부탁드립니다.\n다이어리 다운로드 방법\n\n1. PDF다운로드 받기\n2. 링크 내보내기',
  },{
    isAnswered: true,
    title: '문의 제목2',
    message: '안녕하세요 큐모먼트입니다.\n큐모먼트서비스를 이용해 주셔서 감사합니다. 앞으로도 큐모먼트에 많은 성원 부탁드립니다.\n다이어리 다운로드 방법\n\n1. PDF다운로드 받기\n2. 링크 내보내기',
    answer: '안녕하세요 큐모먼트입니다.\n큐모먼트서비스를 이용해 주셔서 감사합니다. 앞으로도 큐모먼트에 많은 성원 부탁드립니다.\n다이어리 다운로드 방법\n\n1. PDF다운로드 받기\n2. 링크 내보내기',
  },{
    isAnswered: true,
    title: '문의 제목3',
    message: '안녕하세요 큐모먼트입니다.\n큐모먼트서비스를 이용해 주셔서 감사합니다. 앞으로도 큐모먼트에 많은 성원 부탁드립니다.\n다이어리 다운로드 방법\n\n1. PDF다운로드 받기\n2. 링크 내보내기',
    answer: '안녕하세요 큐모먼트입니다.\n큐모먼트서비스를 이용해 주셔서 감사합니다. 앞으로도 큐모먼트에 많은 성원 부탁드립니다.\n다이어리 다운로드 방법\n\n1. PDF다운로드 받기\n2. 링크 내보내기',
  }];

  return (
    <View style={{flex:1, flexDirection: 'column', backgroundColor: 'white'}}>
      <View style={{marginHorizontal: 15, marginVertical: 5, flexDirection: 'row', justifyContent: 'space-between', borderWidth: 1, borderRadius: 21, borderColor: '#AAA', backgroundColor: '#AAA'}}>
        <TouchableOpacity onPress={()=>setMyQuestionTab(true)}>
          <Text style={{borderWidth: 0, borderRadius: 20, fontSize: 18, fontWeight:'bold', paddingVertical: 10, paddingHorizontal: 30, backgroundColor: myQuestionTab?'white':'#AAA'}}>내 문의 내역</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>setMyQuestionTab(false)}>
          <Text style={{borderWidth: 0, borderRadius: 20, fontSize: 18, fontWeight:'bold',  paddingVertical: 10, paddingHorizontal: 40, backgroundColor:  myQuestionTab?'#AAA':'white'}}>문의하기</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={{flex:1, flexDirection: 'column', marginTop: 15}}>
      {myQuestionTab ?
        <View>
          <MyQuestionContentComponent  QuestionMessage={QuestionMessage[0]}/>
          <MyQuestionContentComponent  QuestionMessage={QuestionMessage[1]}/>
          <MyQuestionContentComponent  QuestionMessage={QuestionMessage[2]}/>
        </View> :
        <MyQuestionFormComponent/>
      }
      </ScrollView>
    </View>
  );
}

// 메인스택
function MainStackHomePage({navigation}) {

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MainPage"
        options={({route, navigation})=>({
          headerTitle: getHeaderTitle(route, '채팅'),
          headerTitleAlign: 'left',
          headerTitleStyle: {fontWeight: 'bold', fontSize: 25},
          headerRight: mainHeaderRightHandler(route, navigation)})}
        component={MainPageScreen}
      />
      <Stack.Screen
        name="chatroom"
        options={{
          title: "chatroom",
          headerTitleAlign: 'center',
          headerTitleStyle: {fontWeight: 'bold', fontSize: 25},
          headerRight: (props) => (
            <TouchableOpacity
            onPress={() => chatSettingButtonHandler(navigation)}
            >
            <Octicons name="three-bars" style={{marginRight:10}} size={30} color="black" />
            </TouchableOpacity>
          )}}
        component={MyChatRoomScreen}
      />
      <Stack.Screen
        name="contentScreen"
        options={{
          title: "",
          headerTitleAlign: 'center',
          headerTitleStyle: {fontWeight: 'bold', fontSize: 25},
          headerTransparent: true,
        }}
        component={SubscribeContentScreen}
      />
      <Stack.Screen
        name="Diary"
        options={{
          title: "내 다이어리",
          headerTitleAlign: 'left',
          headerTitleStyle: {fontWeight: 'bold', fontSize: 25},
          }}
        component={DynamicDiaryScreen}
      />
      <Stack.Screen
        name="MyServicePage"
        options={{
          title: "My",
          headerTitleAlign: 'center',
          headerTitleStyle: {fontWeight: 'bold', fontSize: 25},
          }}
        component={MyPageScreen}
      />
      <Stack.Screen
        name="ChangePassword"
        options={{
          title: "비밀번호 변경",
          headerTitleAlign: 'center',
          headerTitleStyle: {fontWeight: 'bold', fontSize: 25},
          }}
        component={MyChangePasswordPage}
      />
      <Stack.Screen
        name="UserHistory"
        options={{
          title: "이용 내역",
          headerTitleAlign: 'center',
          headerTitleStyle: {fontWeight: 'bold', fontSize: 25},
          }}
        component={UserHistoryPage}
      />
      <Stack.Screen
        name="ServiceCenter"
        options={{
          title: "고객센터",
          headerTitleAlign: 'center',
          headerTitleStyle: {fontWeight: 'bold', fontSize: 25},
          }}
        component={ServiceCenterPage}
      />
      <Stack.Screen
        name="ServiceIntroduction"
        options={{
          title: "서비스 소개",
          headerTitleAlign: 'center',
          headerTitleStyle: {fontWeight: 'bold', fontSize: 25},
          }}
        component={ServiceIntroductionPage}
      />
      <Stack.Screen
        name="Help"
        options={{
          title: "도움말",
          headerTitleAlign: 'center',
          headerTitleStyle: {fontWeight: 'bold', fontSize: 25},
          }}
        component={HelpPage}
      />
      <Stack.Screen
        name="Notice"
        options={{
          title: "공지사항",
          headerTitleAlign: 'center',
          headerTitleStyle: {fontWeight: 'bold', fontSize: 25},
          }}
        component={NoticePage}
      />
      <Stack.Screen
        name="Question"
        options={{
          title: "문의",
          headerTitleAlign: 'center',
          headerTitleStyle: {fontWeight: 'bold', fontSize: 25},
          }}
        component={QuestionPage}
      />
    </Stack.Navigator>
  );
}

// 메인 앱
export default function App() {
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
            login: action.autoConfig,
          };
        case 'FIRST_LOGIN':
          return {
            ...prevState,
            userToken: null,
            isLoading: false,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
            login: action.login,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
            login: false,
          };
        case 'INTRO_SKIP':
          return {
            ...prevState,
            userToken: 'dummy-auth-token',
            login: false,
          };
        case 'SET_USERNAME':
          return {
            ...prevState,
            username: action.username,
            login: true,
          };
        case 'SET_DIARY_EDIT_MODE':
          return {
            ...prevState,
            diaryMode: action.diaryMode,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
      login: false,
      username: null,
      diaryMode: false,
    }
  );  // 유저 인증 정보
  React.useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let userToken;

      try {
        userToken = await AsyncStorage.getItem('userToken');
      } catch (e) {
        // Restoring token failed
      }

      // After restoring token, we may need to validate it in production apps

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      //dispatch({ type: 'RESTORE_TOKEN', token: userToken });
    };

    bootstrapAsync();
  }, []); // 초기화시 데이터 로딩 여기서
  const authContext = React.useMemo(
    () => ({
      signIn: async data => {
        // In a production app, we need to send some data (usually username, password) to server and get a token
        // We will also need to handle errors if sign in failed
        // After getting token, we need to persist the token using `AsyncStorage`
        // In the example, we'll use a dummy token
        console.log('singIn:' + data);

        dispatch({ type: 'SIGN_IN', token: 'dummy-auth-token', login: data[2] });
      },
      signOut: () => dispatch({ type: 'SIGN_OUT' }),
      signUp: async data => {
        // In a production app, we need to send user data to server and get a token
        // We will also need to handle errors if sign up failed
        // After getting token, we need to persist the token using `AsyncStorage`
        // In the example, we'll use a dummy token
        console.log('signUp');

        dispatch({ type: 'SIGN_IN', token: 'dummy-auth-token' });
      },
      introSkip: () => dispatch({type: 'INTRO_SKIP'}),
      registerUsername: data => dispatch({type: 'SET_USERNAME', username: data}),
    }),
    []
  );  // 유저 인증 함수 등록

  return (
    <AuthContext.Provider value={authContext}>
      {state.isLoading === true ? (
        <View style={{flex:1, alignItems: 'center', justifyContent: 'center'}}>
          <Text>스플래쉬 화면</Text>
          <Text> 유저 정보 여부에 따라 다음으로 분기 </Text>
          <TouchableOpacity style={{margin: 20}} onPress={()=>{dispatch({ type: 'RESTORE_TOKEN', token: 'dummy-auth-token', autoConfig: true });}}>
            <Text> - 저장된 계정 있음(자동 로그인)</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{margin: 20}} onPress={()=>{dispatch({ type: 'RESTORE_TOKEN', token: 'dummy-auth-token', autoConfig: false });}}>
            <Text> - 저장된 계정 있음(자동 X)</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{margin: 20}} onPress={()=>{dispatch({ type: 'RESTORE_TOKEN', token: null, autoConfig: false });}}>
            <Text> - 저장된 계정 없음</Text>
          </TouchableOpacity>
        </View>
      ) : state.userToken === null ? (
        <NavigationContainer>
          <Tab.Navigator backBehavior={null} tabBar={()=>{}}>
            <Tab.Screen name="Intro1" component={IntroScreen1} />
            <Tab.Screen name="Intro2" component={IntroScreen2} />
            <Tab.Screen name="Intro3" component={IntroScreen3} />
          </Tab.Navigator>
        </NavigationContainer>
      ) : state.login === false ? (
        <NavigationContainer>
          <Stack.Navigator mode={'modal'}>
            <Stack.Screen options={{headerShown: false}} name="SignIn" component={SignInScreen}/>
            <Stack.Screen options={{headerShown: true, headerTitle: '비밀번호 찾기', headerTitleAlign: 'center'}} name="FindPassword" component={FindPasswordScreen}/>
            <Stack.Screen options={{headerShown: false}} name="SignUp" component={SignUpScreen}/>
            <Stack.Screen options={{headerShown: false}} name="SetUsername" component={UserNameSettingScreen}/>
            <Stack.Screen options={{headerShown: true, headerTitle: '이용약관', headerTitleAlign: 'center'}} name="InformTermsOfUse" component={InformTermsOfUseScreen}/>
            <Stack.Screen options={{headerShown: true, headerTitle: '개인정보 처리방침', headerTitleAlign: 'center'}} name="InformPersonalInformationProcessingPolicy" component={InformPersonalInformationProcessingPolicyScreen}/>
          </Stack.Navigator>
        </NavigationContainer>
      ) : (
        <NavigationContainer>
          <Drawer.Navigator drawerPosition='right' drawerStyle={{backgroundColor: '#CCC'}} drawerContent={props => <CustomDrawerContent {...props}/>}>
            <Drawer.Screen name='sidebar' component={MainStackHomePage} options={{swipeEnabled: false}}/>
          </Drawer.Navigator>
        </NavigationContainer>
      )}
    </AuthContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: StatusBar.currentHeight,
  },
  backgroundImg: {
    flex: 1,
    flexDirection: 'column',
    resizeMode: 'cover',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  introText: {
    fontSize: 40,
    marginRight: 110,
    marginBottom: 80,
  },
  skipButton: {
    marginTop: 20,
    marginRight: 20,
  },
  skipButtonText: {
    fontSize: 20,
    color: 'blue',
  },
  singInInputBox: {
    width: 300,
    height: 40,
    padding: 10,
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: '#EEE',
  },
  smallText: {
    fontSize: 10,
  },
  myShadow: {
    borderWidth: 0,
    shadowColor: "#000",
    shadowOffset: {
    	width: 0,
    	height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
    marginHorizontal: 20,
    marginVertical: 7,
  },
  helpContentShadowStyle: {

  },
});
