import React, { useState, useCallback, useEffect } from 'react';
import { Clipboard, Dimensions , ActivityIndicator, Platform,TouchableHighlight, TouchableWithoutFeedback, AsyncStorage, ImageBackground, Text, View, StyleSheet, TouchableOpacity, TextInput, CheckBox, KeyboardAvoidingView, Alert, Button, ScrollView, SafeAreaView, Image }
from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, getFocusedRouteNameFromRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons, MaterialCommunityIcons, Feather, FontAwesome, EvilIcons, AntDesign, MaterialIcons, Octicons }
from '@expo/vector-icons'; // https://icons.expo.fyi/
import * as ImagePicker from 'expo-image-picker';      // https://docs.expo.io/versions/latest/sdk/imagepicker/
// import Constants from 'expo-constants';
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import Moment from 'moment';
import  "moment/locale/ko";
require('dayjs/locale/ko');
Moment.locale("ko");
import _ from 'lodash'; // https://lodash.com/docs
import { createDrawerNavigator} from '@react-navigation/drawer';  //  https://reactnavigation.org/docs/drawer-based-navigation/
import * as Font from 'expo-font';          // https://docs.expo.io/versions/latest/sdk/font/
import uuid from 'react-native-uuid';       // https://www.npmjs.com/package/react-native-uuid
import Hyperlink from 'react-native-hyperlink'; // https://www.npmjs.com/package/react-native-hyperlink
import * as WebBrowser from 'expo-web-browser';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';


// my component
import InlineTextInput from './component/InlineTextInput';
import LoginNavigation from './component/LoginForm';
import {ThemeContext, UserContext, ProductContext, NoticeContext} from './component/Context';
import {HTTP, PUSH_REGISTRATION_ENDPOINT} from './utils/constants';
import IntroNavigation from './component/IntroForm';
import * as Connection from './component/ServerConnect';
import * as Storage from './component/StorageControll';
import {CustomDrawerContent} from './component/Chatroom';
import {DynamicDiaryScreen} from './component/Diary';
import {SubscribeContentScreen} from './component/Subscribe';
import {MyChatRoomScreen} from './component/Chatroom';
import MainScreen from './component/MainScreen';

// https://velog.io/@max9106/React-Native-%EB%A6%AC%EC%95%A1%ED%8A%B8-%EB%84%A4%EC%9D%B4%ED%8B%B0%EB%B8%8Creact-native-%ED%91%B8%EC%8B%9C%EC%95%8C%EB%9E%8C-expo-jkk16hzg5d

const introImage1 = {uri: "https://cdn.crowdpic.net/detail-thumb/thumb_d_F78FC0AA8923C441588C382B19DF0BF8.jpg"};
const introImage2 = {uri: "https://previews.123rf.com/images/romeolu/romeolu1601/romeolu160100122/50594417-%EB%88%88-%EB%B0%B0%EA%B2%BD.jpg"};
const introImage3 = {uri: "https://previews.123rf.com/images/kittikornphongok/kittikornphongok1505/kittikornphongok150501184/40020410-%EB%8B%A4%EC%B1%84%EB%A1%9C%EC%9A%B4-%EC%88%98%EC%B1%84%ED%99%94%EC%9E%85%EB%8B%88%EB%8B%A4-%EA%B7%B8%EB%9F%B0-%EC%A7%80-%EC%A7%88%EA%B0%90-%EB%B0%B0%EA%B2%BD%EC%9E%85%EB%8B%88%EB%8B%A4-%EB%B6%80%EB%93%9C%EB%9F%AC%EC%9A%B4-%EB%B0%B0%EA%B2%BD%EC%9E%85%EB%8B%88%EB%8B%A4-.jpg"};
const defaultImg = {uri: "https://www.daelim.ac.kr/coming_soon.jpg"};
const dogImg = {uri: "https://t1.daumcdn.net/cfile/tistory/24283C3858F778CA2E"};
const catImg = {uri: 'https://image-notepet.akamaized.net/resize/620x-/seimage/20190816%2Ff07bd9f247293aa0317f2c8faba7e83b.png'};
const carmelImg = {uri: 'https://www.jain.re.kr/file/contents/1/201609/30aade86-7056-4948-86a4-a8003c4498ab.jpg'};
const diaryImg = require('./assets/diary.jpg');
const logo = require('./assets/img/icon.png');

const subOn = require('./assets/icon/subOn.png');
const subOff = require('./assets/icon/subOff.png');
const upArrow = require('./assets/icon/up_arrow.png');
const downArrow = require('./assets/icon/down_arrow.png');
const defaultUser = require('./assets/img/default_user.png');
const diaryImgList = [
  require('./assets/icon/diary_1.png'),
  require('./assets/icon/diary_2.png'),
  require('./assets/icon/diary_3.png'),
  require('./assets/icon/diary_4.png'),
  require('./assets/icon/diary_5.png'),
  require('./assets/icon/diary_6.png'),
  require('./assets/icon/diary_7.png'),
  require('./assets/icon/diary_8.png'),
  require('./assets/icon/diary_9.png'),
  require('./assets/icon/diary_10.png'),
];

const ControllContext = React.createContext();
const Tab = createMaterialTopTabNavigator();
const Stack = createStackNavigator();
const MyServiceStack = createStackNavigator();
const ServiceCenterStack = createStackNavigator();
const Drawer = createDrawerNavigator();

// 임시 데이터

const noticeMessage = [
  {
    id: 1,
    title: '위치기반 서비스 이용약관 사전 안내',
    date: '2019-03-26',
    message: '안녕하세요 큐모먼트입니다.\n큐모먼트서비스를 이용해 주셔서 감사합니다. 앞으로도 큐모먼트에 많은 성원 부탁드립니다.\n다이어리 다운로드 방법\n\n1. PDF다운로드 받기\n2. 링크 내보내기'
  }, {
    id: 2,
    title: '제목이 너무 길면 어떻게 되는지 알고 싶어요 제목이 너무 길면 어떻게 되는지 알고 싶어요',
    date: '2020-07-22',
    message: '안녕하세요 큐모먼트입니다.\n큐모먼트서비스를 이용해 주셔서 감사합니다. 앞으로도 큐모먼트에 많은 성원 부탁드립니다.\n다이어리 다운로드 방법\n\n1. PDF다운로드 받기\n2. 링크 내보내기'
  }
];
const helpMessage = [
  {
    id: 1,
    question: '다이어리를 다운받고 싶어요.',
    answer: '안녕하세요 큐모먼트입니다.\n큐모먼트서비스를 이용해 주셔서 감사합니다. 앞으로도 큐모먼트에 많은 성원 부탁드립니다.\n다이어리 다운로드 방법\n\n1. PDF다운로드 받기\n2. 링크 내보내기'
  }, {
    id:2,
    question: '제목이 너무 길면 어떻게 되는지 알고 싶어요 제목이 너무 길면 어떻게 되는지 알고 싶어요',
    answer: '안녕하세요 큐모먼트입니다.\n큐모먼트서비스를 이용해 주셔서 감사합니다. 앞으로도 큐모먼트에 많은 성원 부탁드립니다.\n다이어리 다운로드 방법\n\n1. PDF다운로드 받기\n2. 링크 내보내기'
  }
];

// dataList - id, isAvailable, hasDiary, hasChatroom, isSubscribe, product, diary, push
let dataList = [];

let userData = {
  token: null,
  username: null,
  email: null,
  password: null,
  userImg: null,
  mySubscribeList: [],
  myChatroomList: [],
  myDiaryList: [],
};


let informData = {
  introduction: [],
  help: helpMessage,
  notice: noticeMessage,
};
let pushList = [];

// 기기 화면 사이즈
const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;
const USERDATA = {
  token: null,
  username: '',
  email: '',
  password: '',
  userImg: null,
  autoLogin: true,
  mySubscribe: {
    0: {pushStartTime: Moment(), pushEndTime: Moment()},
  },
  myChat: {
    0: {lastMessageTime: Moment(), newItemCount: 0, chatmessageList: [], lastPushed: {pushTime: Moment(), questIndex: 1, solved:true}},
  },
  myDiary: {
    0: {makeTime: Moment(), totalUpdateCount: 0, diarymessageList: []},
  },
  myPush:{
    0: {isRandomPushType: false, pushStartTime: Moment('20200812 0830'), pushEndTime: Moment('20200812 1030')},
  }
};

// 컨트롤 변수
let pressDiaryEditButton = false;  // diary 편집버튼 누름 상태값
let global_p_id = 0;               // 채팅창 사이드 메뉴에서 다른 상품정보로 보내기 위한 상품 id 값
let editDiaryTextMode = false;     // 다이어리 편집모드 상태값
let global_y = 0;         // 다이어리리스트 스크린의 스크롤 값

// 유용한 함수
function chooseRandomIndex(a){
  return Math.floor(Math.random() * a.length);
}
function chooseRandomly(a){
  return a[Math.floor(Math.random() * a.length)];
}

function isEmail(email){
  const emailRegex = /^(([^<>()\[\].,;:\s@"]+(\.[^<>()\[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;

  return emailRegex.test(email);
}





// 우측상단 메뉴
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

// 마이페이지
function MyPageScreen({navigation}) {
  const [myDiaryCount, setMyDiaryCount] = useState(10);
  const [totalCount, setTotalCount] = useState(256);
  const [image, setImage] = React.useState(userData.userImg);
  const [username, setUsername] = useState(userData.username);
  const [editMode, setEditMode] = useState(false);
  const { signOut } = React.useContext(AuthContext);

  const [tempText, setTempText] = useState('aaaa');

  const getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert('카메라기능 사용자권한이 필요합니다.');
      }
    }
  };

  const onEndEditingHandler = () => {
    if(username !== ''){
      userData.username = username;
    }else{
      setUsername(userData.username);
    }
    setEditMode(false);
  };

  const startEditModeHandler = () => {
    if(!editMode){
      setEditMode(true);
    }
  };

  useFocusEffect(() => {
    if(!editMode) setEditMode(false);
    setMyDiaryCount(userData.myDiaryList.length);

    let total = 0;
    userData.myDiaryList.forEach(obj => {
      total += dataList[dataList.findIndex(data => data.id === obj.id)].diary.totalUpdateCount;
      //total += dataList[obj.id-1].diary.totalUpdateCount;
    })
    setTotalCount(total);
  });

  const _pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.cancelled) {
        userData.userImg = result;
        setImage(result);
      }

      console.log(result);
    } catch (E) {
      console.log(E);
    }
  };

  return (
    <View style={{flex:1, flexDirection: 'column'}}>
      <View style={{margin:15, marginBottom: 0, alignItems: 'center', borderBottomWidth: 1, height: 170, justifyContent: 'center'}}>
        <TouchableOpacity onPress={()=>getPermissionAsync().then(_pickImage()).catch(e => console.log('getPermissionAsync error: ', e))}>
          {image
            ? <Image source={image} style={{height: 80, width: 80, borderRadius: 40, backgroundColor: '#EEE', marginTop: 20, marginBottom: 12}}/>
            : <Image source={defaultUser} style={{height: 80, width: 80, borderRadius: 40, backgroundColor: '#EEE', marginTop: 20, marginBottom: 12}}/>
          }
        </TouchableOpacity>
        <View style={{flexDirection: 'row', marginLeft:20}}>
          {editMode
          ? <TextInput autoFocus={true} maxLength={10} selectTextOnFocus={true} onEndEditing={onEndEditingHandler} style={{fontSize: 20, height: 30, width:150}} value={username}  onChangeText={text=>setUsername(text)}/>
          : <Text style={{fontWeight: 'bold', fontSize: 20}}>{username}</Text>
          }
          <TouchableOpacity onPress={startEditModeHandler}>
            <EvilIcons name="pencil" size={30} color="black"  style={{marginLeft:5, justifyContent: 'center'}}/>
          </TouchableOpacity>
        </View>
      </View>
      <View style={{}}>
        <View style={{marginHorizontal: 15, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#DDD'}}>
          <EvilIcons name="lock" color="black" size={45} style={{marginVertical: 15, marginLeft: -10}}/>
          <TouchableOpacity onPress={()=>Alert.alert('정말 로그아웃 하시겠습니까?','로그인 페이지로 이동합니다.',[{text:'취소'}, {text:'확인', onPress:signOut}])}>
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
  const [warnNextPasswordError, setWarnNextPasswordError] = useState(false);
  const [warnNotCorrectPasswordError, setWarnNotCorrectPasswordError] = useState(false);

  const changePasswordHandler = () => {
    let errorCout = 0;
    if(prevPassword !== userData.password){
      if(warnPrevPasswordError === false) setWarnPrevPasswordError(true);
      errorCout++;
    }else{
      if(warnPrevPasswordError === true) setWarnPrevPasswordError(false);
    }
    if(nextPassword !== nextAdditionalPassword){
      if(warnNotCorrectPasswordError === false) setWarnNotCorrectPasswordError(true);
      errorCout++;
    }else{
      if(warnNotCorrectPasswordError === true) setWarnNotCorrectPasswordError(false);
    }
    if(nextPassword.length < 5){
      if(warnNextPasswordError === false) setWarnNextPasswordError(true);
      errorCout++;
    }else{
      if(warnNextPasswordError === true) setWarnNextPasswordError(false);
    }
    if(errorCout === 0){
      userData.password = nextPassword;
      // navigation.navigate('MyServicePage');
      Alert.alert('비밀번호가 변경되었습니다.');
    }
  }

  return (
    <ScrollView>
    <View style={{flex:1, flexDirection: 'column', justifyContent: 'space-around'}}>
      <View style={{margin: 20}}>
        <Text style={{marginVertical: 5, fontWeight:'bold', fontSize: 20}}>현재 비밀번호</Text>
        <TextInput value={prevPassword} style={{borderWidth: 1, backgroundColor: '#DDD', fontSize: 30}} secureTextEntry={true} onChangeText={(text)=>setPrevPassword(text)}/>
        <Text style={{color: warnPrevPasswordError? '#D00f':'#D000', fontSize: 11, marginLeft: 15, marginVertical: 5}}>올바른 비밀번호를 입력해주세요. 현재 비밀번호와 다릅니다.</Text>
      </View>
      <View style={{margin: 20}}>
        <Text style={{marginVertical: 5, fontWeight:'bold', fontSize: 20}}>새 비밀번호</Text>
        <TextInput value={nextPassword} style={{borderWidth: 1, backgroundColor: '#DDD', fontSize: 30}} secureTextEntry={true} onChangeText={(text)=>setNextPassword(text)}/>
        <Text style={{fontSize: 11, marginLeft: 15, marginVertical: 5}}>6~16자 영문, 소문자, 숫자만 사용 가능 합니다.</Text>
        <Text style={{color: warnNextPasswordError? '#D00f':'#D000', fontSize: 11, marginLeft: 15, marginVertical: 5}}>비밀번호를 올바른 형식으로 입력해주세요.</Text>
      </View>
      <View style={{margin: 20}}>
        <Text style={{marginVertical: 5, fontWeight:'bold', fontSize: 20}}>새 비밀번호 확인</Text>
        <TextInput value={nextAdditionalPassword} style={{borderWidth: 1, backgroundColor: '#DDD', fontSize: 30}} secureTextEntry={true} onChangeText={(text)=>setAdditionalNextPassword(text)}/>
        <Text style={{color: warnNotCorrectPasswordError? '#D00f':'#D000', fontSize: 11, marginLeft: 15, marginVertical: 5}}>새 비밀번호와 동일하게 입력해주세요.</Text>
      </View>
      <View style={{margin: 20}}>
        <TouchableOpacity onPress={changePasswordHandler} style={{borderRadius: 1, backgroundColor: '#CCC', alignItems: 'center', justifyContent: 'center', flex:1}}>
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
        <Text style={{marginLeft:40, marginVertical: 4, marginBottom: 10, fontSize: 20, fontWeight: 'bold'}}>기간        <Text style={{fontSize: 13, fontWeight: 'normal'}}>{this.props.startDate.format('LL')} ~ {Moment().format('LL')}</Text></Text>
      </View>
    );
  }
}
function UserHistoryPage({navigation}) {
  return (
    <ScrollView style={{flex:1, flexDirection: 'column', backgroundColor: '#fff'}}>
      <Text style={{margin:20, fontWeight:'bold', fontSize: 20}}>나의 구독 내역</Text>
      {userData.myDiaryList.map(diary => {
        let data = dataList[dataList.findIndex(obj => obj.id === diary.id)];
        return <SubscribeContentBoxComponent key={diary.id} title={data.product.title} count={data.diary.totalUpdateCount} startDate={data.diary.makeTime}/>;
      })}
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
      <TouchableOpacity style={{height: 90, justifyContent: 'center', borderColor: '#DDD'}} onPress={()=>navigation.push('Notice')}>
        <Text style={{marginLeft: 30, fontSize: 20}}>공지사항</Text>
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
  return (
    <ScrollView style={{flex:1, flexDirection: 'column', marginTop: 10}}>
      {informData.help.map( message => {
        return <HelpContentComponent key={message.id} question={message.question} answer={message.answer}/>
      })}
      <View style={{flex:1, height: 600}}/>
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
          <View style={{marginLeft: 30, marginBottom: 5, marginTop:10, marginRight:20}}>
            <Text>{this.props.message}</Text>
          </View>
        }
      </TouchableOpacity>
    );
  }
}
function NoticePage({navigation}) {
  return (
    <ScrollView style={{flex:1, flexDirection: 'column', marginTop: 10}}>
      {informData.notice.map( message => {
        return  <NoticeContentComponent key={message.id} title={message.title} date={message.date} message={message.message}/>
      })}
      <View style={{flex:1, height: 600}}/>
    </ScrollView>
  );
}

// 메인스택
function MainStackHomePage({navigation}) {

  return (
    <Stack.Navigator screenOptions={{}}>
      <Stack.Screen
        name="MainPage"
        options={({route, navigation})=>({
          headerTitle: getHeaderTitle(route, '채팅'),
          headerTitleAlign: 'left',
          headerTitleStyle: {fontWeight: 'bold', fontSize: 20},
          headerBackTitleVisible: false,
          headerTintColor: 'black',
          cardStyle: {backgroundColor: 'white'},
          headerRight: mainHeaderRightHandler(route, navigation)})}
        component={MainScreen}
      />
      <Stack.Screen
        name="chatroom"
        options={{
          title: "chatroom",
          headerTitleAlign: 'center',
          headerTitleStyle: {fontWeight: 'bold', fontSize: 20},
          cardStyle: {backgroundColor: 'white'},
          headerBackTitleVisible: false,
          headerTintColor: 'black',
          headerRight: (props) => (
            <TouchableOpacity
            onPress={() => chatSettingButtonHandler(navigation)}
            >
              <Octicons name="three-bars" style={{marginRight:11, marginTop:2}} size={27} color="black" />
            </TouchableOpacity>
          )}}
        component={MyChatRoomScreen}
      />
      <Stack.Screen
        name="contentScreen"
        options={{
          title: "",
          headerTitleAlign: 'center',
          headerTitleStyle: {fontWeight: 'bold', fontSize: 20},
          cardStyle: {backgroundColor: 'white'},
          headerBackTitleVisible: false,
          headerTintColor: 'black',
          headerTransparent: true,
        }}
        component={SubscribeContentScreen}
      />
      <Stack.Screen
        name="Diary"
        options={{
          title: "내 다이어리",
          headerTitleAlign: 'center',
          headerTitleStyle: {fontWeight: 'bold', fontSize: 20},
          headerBackTitleVisible: false,
          headerTintColor: 'black',
          cardStyle: {backgroundColor: 'white'},
          }}
        component={DynamicDiaryScreen}
      />
      <Stack.Screen
        name="MyServicePage"
        options={{
          title: "My",
          headerTitleAlign: 'center',
          headerTitleStyle: {fontWeight: 'bold', fontSize: 20},
          headerBackTitleVisible: false,
          headerTintColor: 'black',
          cardStyle: {backgroundColor: 'white'},
          }}
        component={MyPageScreen}
      />
      <Stack.Screen
        name="ChangePassword"
        options={{
          title: "비밀번호 변경",
          headerTitleAlign: 'center',
          headerTitleStyle: {fontWeight: 'bold', fontSize: 20},
          headerBackTitleVisible: false,
          headerTintColor: 'black',
          cardStyle: {backgroundColor: 'white'},
          }}
        component={MyChangePasswordPage}
      />
      <Stack.Screen
        name="UserHistory"
        options={{
          title: "이용 내역",
          headerTitleAlign: 'center',
          headerTitleStyle: {fontWeight: 'bold', fontSize: 20},
          headerBackTitleVisible: false,
          headerTintColor: 'black',
          cardStyle: {backgroundColor: 'white'},
          }}
        component={UserHistoryPage}
      />
      <Stack.Screen
        name="ServiceCenter"
        options={{
          title: "고객센터",
          headerTitleAlign: 'center',
          headerTitleStyle: {fontWeight: 'bold', fontSize: 20},
          headerBackTitleVisible: false,
          headerTintColor: 'black',
          cardStyle: {backgroundColor: 'white'},
          }}
        component={ServiceCenterPage}
      />
      <Stack.Screen
        name="ServiceIntroduction"
        options={{
          title: "서비스 소개",
          headerTitleAlign: 'center',
          headerTitleStyle: {fontWeight: 'bold', fontSize: 20},
          headerBackTitleVisible: false,
          headerTintColor: 'black',
          cardStyle: {backgroundColor: 'white'},
          }}
        component={ServiceIntroductionPage}
      />
      <Stack.Screen
        name="Help"
        options={{
          title: "도움말",
          headerTitleAlign: 'center',
          headerTitleStyle: {fontWeight: 'bold', fontSize: 20},
          headerBackTitleVisible: false,
          headerTintColor: 'black',
          cardStyle: {backgroundColor: 'white'},
          }}
        component={HelpPage}
      />
      <Stack.Screen
        name="Notice"
        options={{
          title: "공지사항",
          headerTitleAlign: 'center',
          headerTitleStyle: {fontWeight: 'bold', fontSize: 20},
          headerBackTitleVisible: false,
          headerTintColor: 'black',
          cardStyle: {backgroundColor: 'white'},
          }}
        component={NoticePage}
      />
    </Stack.Navigator>
  );
}


async function getPermission(){
  let reply = {ok:false, data: '', message:''};
  const { push } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
  if (push === 'granted') {
    reply.ok = true;
  }

  return reply;
}

// 메인 앱
export default function App() {
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'END_LOADING_FIRST_LOGIN':
          // 첫 실행 -> 인트로 화면 띄움
          return {
            ...prevState,
            nowLoading: false,
          };
        case 'END_LOADING_LOGIN_PAGE':
          // 로그인 화면으로 이동
          return {
            ...prevState,
            nowLoading: false,
            intro: false,
          };
        case 'END_LOADING_RESTORE_DATA':
          // 자동저장 중, 데이터 로딩 후 바로 사용화면으로 이동
          return {
            ...prevState,
            nowLoading: false,
            intro: action.intro,
            login: action.login,
            userData: action.userData,
          };
        case 'LOGIN':
          // 유저정보 받아 사용자 화면으로 이동
          return {
            ...prevState,
            login: true,
            userData: action.userData,
          };
        case 'SIGN_OUT':
          // 로그인 화면으로 이동
          return {
            ...prevState,
            login: false,
            userData: USERDATA,
          };
        case 'INTRO_SKIP':
          // 인트로 스킵
          return {
            ...prevState,
            intro: false,
          };
        case 'UPDATE_USERDATA':
          // 유저정보 갱신용
          return {
            ...prevState,
            userData: action.userData,
          };
        case 'NO_AUTH':
          // 유저정보 갱신용
          return {
            ...prevState,
            noAuth: true,
            nowLoading: false,
          };
      }
    },
    {
      noAuth: false,
      nowLoading: true,
      intro: true,
      login: false,
      userData: USERDATA,
    }
  );  // 유저 인증 정보
  const userContext = React.useMemo(
    () => ({
      signIn: async data => {
        console.log(`SignIn email:${data.email}, password:${data.password}`);
        let reply = {ok: false, data: null, message: ''};
        let response = await Connection.login(data.email, data.password);

        if(response.ok){
          let pushRegistered = await registerForPushNotificationsAsync({email: data.email, username:response.data.username});

          if(pushRegistered.ok){
            reply.ok = true;
            reply.data = response.data;
          }else{
            reply.message = pushRegistered.message;
          }
        }else{
          reply.message = response.message;
        }

        return reply;
      },
      login: async data => {
        let saveData = {
          token: data.token,
          username: data.username,
          email: data.email,
          password: data.password,
          userImg: null,
          mySubscribeList: [],
          myChatroomList: [],
          myDiaryList: [],
        };
        console.log('saveData\n', saveData);
        // *추가 구독 및 다이어리 정보 불러올 것

        dispatch({ type: 'LOGIN', userData: saveData });
      },
      loadUserData: async () =>  {
          let loadUserData = {
            token: result.data.token,
            username: result.data.username,
            email: data.email,
            password: data.password,
            userImg: null,
            mySubscribeList: [],
            myChatroomList: [],
            myDiaryList: [],
          };
          let responseProductData = await Connection.loadProductData(loadUserData.token);
          let responseDiaryData = await Connection.loadDiaryData(loadUserData.token);

          if(responseProductData.status && responseDiaryData.status){
            // load success
            console.log('load data successely');
            dataList = await Storage.saveProductData(responseProductData.data);
            let diaryData = await Storage.saveDiaryData(responseDiaryData.data);
          }
      },
      signOut: () => dispatch({ type: 'SIGN_OUT' }),
      findpw: async (email) => {
        return await Connection.findpw(email);
      },
      signUp: async data => {
        console.log(`Signup email:${data.email}, password:${data.password}, username:${data.username}`);
        return await Connection.signUp(data.email, data.password, data.username);
      },
      checkEmail: async email => {
        console.log(`checkEmail email:${email}`);
        return await Connection.checkEmail(email);
      },
      introSkip: () => dispatch({type: 'INTRO_SKIP'}),
      getUserData: () => {
        return state.userData;
      },
    }),
    []
  );  // 유저 인증 함수 등록

  const [notification, setNotification] = useState(null);
  const [loaded, error] = Font.useFonts({
    UhBeeSeulvely: require('./assets/font/UhBeeSeulvely.ttf'),
  });

  const handleNotification = (notify) => {
    setNotification(notify);
    console.log('notification', notify);
  };

  const registerForPushNotificationsAsync = async (userData) => {
    let token = await Notifications.getExpoPushTokenAsync();

    Notifications.addListener(handleNotification);
    console.log(`registerForPushNotificationsAsync\ntoken: ${token}\nemail: ${userData.email}, username: ${userData.username}`);

    return fetch(PUSH_REGISTRATION_ENDPOINT, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: {
          value: token,
        },
        user: {
          email: userData.email,
          username: userData.username,
        },
      }),
    });
  };

  const [theme, setTheme] = useState({
    default: '#d9d9d9',
    light: ['#e8efd9','#d7e4bd', '#b9c89c'],
    logo: logo,
  });
  const [productData, setProductData] = useState({
    0: {
        isAvailable: true,
        title: '상품제목',
        text: '상품 설명',
        imageSet: {thumbnailImg: defaultImg, logoImg: defaultImg, mainImg: defaultImg, avatarImg: defaultImg},
        questionList: ['상품질문1','상품질문2','상품질문3'],
        ansList: ['질문의 답변1','질문의 답변2','질문의 답변3'],
        isRandomPushType: false, pushStartTime: Moment(), pushEndTime: Moment(),
    },
  });

  React.useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      console.log('시작시간 : ', Moment().toDate());

      let permission = await getPermission();
      if(!permission.ok) return dispatch({ type: 'NO_AUTH' });

      Storage.updateProductData()
        .then(needUpdate => {
          if(needUpdate.ok) setProductData(needUpdate.data);
        })



      let productVersion = 0;
      let response = await Storage.updateProductData(productVersion);
      if(response.ok){
        setProductData(response.data);
        console.log('updateProductData - success - ', response.data);
      }else{
        console.log('updateProductData - fail - ', response.message);
      }
    };

    //bootstrapAsync();
  }, []); // 초기화시 데이터 로딩 여기서

  return (
    <ThemeContext.Provider value={theme}>
    <UserContext.Provider value={userContext}>
      {state.nowLoading === true ? (
        <View style={{flex:1, marginTop:30, alignItems: 'center', justifyContent: 'center'}}>
          <Text>스플래쉬 화면</Text>
          <Text> 유저 정보 여부에 따라 다음으로 분기 </Text>
          <TouchableOpacity style={{margin: 10}} onPress={()=>{dispatch({ type: 'END_LOADING_RESTORE_DATA', intro:false, login: true, userData: USERDATA})}}>
            <Text> - 저장된 계정 있음(자동 로그인)</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{margin: 10}} onPress={()=>{dispatch({ type: 'END_LOADING_FIRST_LOGIN'})}}>
            <Text> - 저장된 계정 있음(자동 X)</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{margin: 10}} onPress={()=>{dispatch({ type: 'END_LOADING_LOGIN_PAGE'})}}>
            <Text> - 저장된 계정 없음</Text>
          </TouchableOpacity>
        </View>
      ) : state.noAuth === true ? (
        <View>

        </View>
      ): state.intro === true ? (
        <IntroNavigation/>
      ) : state.login === false ? (
        <LoginNavigation/>
      )
      : (
        <ProductContext.Provider value={productData}>
        <NavigationContainer>
          <Drawer.Navigator drawerPosition='right' drawerStyle={{backgroundColor: '#CCC'}} drawerContent={props => <CustomDrawerContent {...props}/>}>
            <Drawer.Screen name='sidebar' component={MainStackHomePage} options={{swipeEnabled: false}}/>
          </Drawer.Navigator>
        </NavigationContainer>
        </ProductContext.Provider>
      )}
    </UserContext.Provider>
    </ThemeContext.Provider>
  );
}

const styles = StyleSheet.create({
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
});
