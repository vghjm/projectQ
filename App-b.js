import React, { useState, useCallback, useEffect } from 'react';
import { Platform, AsyncStorage, ImageBackground, Text, View, StyleSheet, TouchableOpacity, TextInput, CheckBox, KeyboardAvoidingView, Alert, Button, ScrollView, SafeAreaView, Image }
from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, getFocusedRouteNameFromRoute, useNavigation } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';  //  https://reactnavigation.org/docs/drawer-based-navigation/
import { Ionicons, MaterialCommunityIcons, Feather, FontAwesome, EvilIcons, AntDesign } from '@expo/vector-icons'; // https://icons.expo.fyi/
import { GiftedChat } from 'react-native-gifted-chat' // https://github.com/FaridSafi/react-native-gifted-chat
import DateTimePicker from '@react-native-community/datetimepicker'; // https://github.com/react-native-community/datetimepicker
import * as Animatable from 'react-native-animatable'; // https://github.com/oblador/react-native-animatable
import * as ImagePicker from 'expo-image-picker';      // https://docs.expo.io/versions/latest/sdk/imagepicker/
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';

const introImage1 = {uri: "https://cdn.crowdpic.net/detail-thumb/thumb_d_F78FC0AA8923C441588C382B19DF0BF8.jpg"};
const introImage2 = {uri: "https://previews.123rf.com/images/romeolu/romeolu1601/romeolu160100122/50594417-%EB%88%88-%EB%B0%B0%EA%B2%BD.jpg"};
const introImage3 = {uri: "https://previews.123rf.com/images/kittikornphongok/kittikornphongok1505/kittikornphongok150501184/40020410-%EB%8B%A4%EC%B1%84%EB%A1%9C%EC%9A%B4-%EC%88%98%EC%B1%84%ED%99%94%EC%9E%85%EB%8B%88%EB%8B%A4-%EA%B7%B8%EB%9F%B0-%EC%A7%80-%EC%A7%88%EA%B0%90-%EB%B0%B0%EA%B2%BD%EC%9E%85%EB%8B%88%EB%8B%A4-%EB%B6%80%EB%93%9C%EB%9F%AC%EC%9A%B4-%EB%B0%B0%EA%B2%BD%EC%9E%85%EB%8B%88%EB%8B%A4-.jpg"};
const defaultImg = {uri: "https://t1.daumcdn.net/cfile/tistory/24283C3858F778CA2E"};
const diaryImg = require('./assets/diary.jpg');
const AuthContext = React.createContext();
const ControllContext = React.createContext();
const Tab = createMaterialTopTabNavigator();
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

// 컨트롤 변수
var pressDiaryEditButton = false;  // diary 편집 버튼 누름

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
  return (
    <SafeAreaView style={{flex:1}}>
      <ScrollView styles={{marginHorizontal: 20}} centerContent={true}>
        <Text style={{margin:10}}>내 구독 상품</Text>
        <ContentLayout />
        <ContentLayout />
        <Text style={{margin:10, borderTopWidth: 1, borderColor: 'gray'}}>구독 가능한 상품</Text>
        <TouchableOpacity onPress={()=>navigation.navigate('contentScreen', {itemId: '구독상품명 1', otherParams: ''})}>
          <ContentLayout title='구독 상품명 1' thumbnail={defaultImg}/>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>navigation.navigate('contentScreen', {itemId: '구독상품명 2', otherParams: ''})}>
          <ContentLayout title='구독 상품명 2' thumbnail={defaultImg}/>
        </TouchableOpacity>
        <ContentLayout />
        <ContentLayout />
        <ContentLayout />
        <ContentLayout />
        <ContentLayout />
        <ContentLayout />
        <ContentLayout />
        <ContentLayout />
      </ScrollView>
    </SafeAreaView>
  );
}
function MyChatListScreen({navigation}){
  var time =  (new Date().getMonth() + 1) + '월 ' + new Date().getDate() + '일';
  var numberOfSubscribe = 0;

  return (
    <SafeAreaView style={{flex:1}}>
      <ScrollView styles={{marginHorizontal: 20}} centerContent={true} >
        {!numberOfSubscribe ? NoSubscribeInform(navigation) : <Text/>}
        <TouchableOpacity onPress={()=>navigation.navigate('chatroom', {itemId: '구독상품명 1', otherParams: '오늘 뭐 했어?'})}>
          <ContentLayout title='구독상품명 1' thumbnail={introImage1} lastUpdateTime={time} newItemCount={'3'}/>
        </TouchableOpacity>
        <ContentLayout title='구독상품명 2' thumbnail={introImage2} lastUpdateTime={'오전 11:59'} newItemCount={'0'}/>
        <ContentLayout title='구독상품명 3' thumbnail={introImage3} lastUpdateTime={'오전 11:59'} newItemCount={'1'}/>
        <ContentLayout title='구독상품명 4' thumbnail={defaultImg} lastUpdateTime={'오전 11:59'} newItemCount={'0'}/>
        <ContentLayout title='이미지 없음'/>
        <ContentLayout title='글자길이 테스트으으으으ㅡㅇ으으 15' lastUpdateTime={'오후 11:09'} newItemCount={'18'}/>
        <ContentLayout />
        <ContentLayout />
        <ContentLayout />
        <ContentLayout />
        <ContentLayout />
        <ContentLayout />
      </ScrollView>
    </SafeAreaView>
  );
}
function MyDiaryScreen({navigation}){
  const [diaryCount, setDiaryCount] = React.useState(0);
  const [animation, setAnimation] = React.useState(false);
  const date = new Date();

  return (
    <SafeAreaView>
    <ScrollView>
      <View style={{flex:1, flexDirection: 'column', alignItems: 'center'}}>
        <View style={{flex:1, flexDirection: 'row', justifyContent: 'flex-start', flexWrap: 'wrap'}}>
          <DiaryComponent title='구독 상품명 1' updateDate={date} updateCount={3} id={1} nav={navigation}/>
          <DiaryComponent title='구독 상품명 2' updateDate={date} updateCount={37} id={2} nav={navigation}/>
          <DiaryComponent/>
          <DiaryComponent/>
          <DiaryComponent/>
          <DiaryComponent/>
          <DiaryComponent/>
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
function myButtonHandler(route, navigation) {return navigation.push('MyPage');}
function chatSettingButtonHandler(){
  return Alert.alert('채팅창의 Setting 버튼을 눌렀습니다.', '기능 차후 추가 예정');
}
function editDiaryButtonHandler(route, navigation){
  pressDiaryEditButton = true;
  navigation.navigate('MyDiaryScreen');

  return Alert.alert('다이어리창의  편집버튼을 눌렀습니다.', '기능 차후 추가 예정');
}
function completeDiaryButtonHandler(route, navigation){
  pressDiaryEditButton = false;
  navigation.navigate('MyDiaryScreen');

  return Alert.alert('다이어리창의  완료버튼을 눌렀습니다.', '기능 차후 추가 예정');
}
function optionDiaryButtonHandler(){
  return Alert.alert('다이어리내의 옵션 버튼을 눌렀습니다.', '기능 차후 추가 예정');
}

// 글로벌 구성품
class ContentLayout extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      titleText: this.props.title,
      thumbnail: this.props.thumbnail,
      lastUpdateTime: this.props.lastUpdateTime,
      newItemCount: this.props.newItemCount,
    }
  }

  render() {
    return (
      <View style={{flexDirection: 'row', height: 56, margin: 3, borderWidth: 0, borderColor: 'gray'}}>
        <Image source={this.state.thumbnail} style={{height: 46, width: 46, margin: 5, borderRadius: 23, backgroundColor: '#DDD'}}/>
        <Text style={{marginLeft: 10, marginTop: 4, fontSize: 17, width: 220}}>{this.state.titleText ? this.state.titleText : "임시 구독상품 명"}</Text>
        <View style={{flex:1, flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'flex-end'}}>
          {this.state.lastUpdateTime && <Text style={{fontSize: 10, marginRight: 6, marginTop: 0}}>{this.state.lastUpdateTime}</Text>}
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
  const {itemId, otherParams} = route.params;
  const [subscribe, setSubscribe] = React.useState(false);
  const [pushTime, setPushTime] = React.useState({
    from: {
      hour: 0,
      minute: 0,
    },
    to: {
      hour: 23,
      minute: 59,
    },
  });

  return (
    <SafeAreaView style={{flex:1}}>
      <ScrollView centerContent={true} onScroll={(event)=>{
        event.nativeEvent.contentOffset.y > 260.0 ? navigation.setOptions({ headerTitle: itemId, headerTransparent: false}) : navigation.setOptions({ headerTitle: '', headerTransparent: true})
      }}>
        <Image source={defaultImg} style={{height: 200}} resizeMode='cover'/>
        <View style={{backgroundColor: '#EEE', justifyContent: 'space-around', alignItems: 'center'}}>
          <Image source={defaultImg} style={{position:'absolute', alignSelf: 'center', top:-80, height: 100, width: 100, borderRadius: 50}}/>
          <Text style={{fontSize: 20, fontWeight:'bold', marginTop: 35, marginBottom: 10}}>{itemId}</Text>
          <Text style={{margin: 20}}>구독상품 소개 문구, 50자 이내 25자씩 2줄 디자인 상품 배경 이미지 제작, 디자인 상품 로고 제작, 디자인 상품 소개 이미지 정방형 디자인 상품 소개</Text>
        </View>
        <Image source={defaultImg} style={{height: 1200}} resizeMode='cover'/>
        <View style={{height: 400, backgroundColor: '#EEE'}}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <View style={{flexDirection: 'column'}}>
              <Text style={{marginLeft: 30, marginTop: 40, fontSize: 20}}>구독 하기</Text>
              <Text style={{marginLeft: 30, marginTop: 40, fontSize: 20}}>정시 메시지 수신 시간</Text>
            </View>
            <TouchableOpacity style={{marginTop: 40, marginRight: 30}} onPress={()=>setSubscribe(!subscribe)}>
              <View style={{flexDirection: 'row', height: 30, width: 85, borderRadius: 15, backgroundColor: subscribe?'cornflowerblue':'white', borderWidth: 1}}>
                {subscribe? (
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
          <View style={{alignSelf: 'flex-end', margin: 20, fontSize: 20}}>
            <Text> 오후 {pushTime.from.hour}시</Text>
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
function ChatRoomSidebarComponent(navigation){
  return (
    <View style={{flex:1, margin:15, flexDirection: 'column', backgroundColor: '#DDD'}}>
      <View style={{flexDirection: 'row', padding: 5}}>
        <Image source={null} style={{height: 40, width: 40, backgroundColor: 'gray', margin: 5}}/>
        <TouchableOpacity onPress={()=>navigation.push('Diary')} style={{justifyContent: 'center'}}>
          <Text>다이어리 보기</Text>
        </TouchableOpacity>
      </View>
      <View style={{flexDirection: 'row', padding: 5}}>
        <Image source={null} style={{height: 40, width: 40, backgroundColor: 'gray', margin: 5}}/>
        <TouchableOpacity onPress={()=>navigation.navigate('contentScreen', {itemId: '구독상품명 1', otherParams: ''})} style={{justifyContent: 'center'}}>
          <Text>푸시 메세지 설정</Text>
        </TouchableOpacity>
      </View>
      <View style={{flexDirection: 'row', padding: 5}}>
        <Image source={null} style={{height: 40, width: 40, backgroundColor: 'gray', margin: 5}}/>
        <TouchableOpacity onPress={()=>{Alert.alert('정말 채팅방을 나가시겠습니까?', '채팅방을 나가면 채팅 내용과 채팅목록은 사라지고 다이어리에서만 기록을 확인 할 수 있습니다.', [{text:'나가기', onPress: ()=>navigation.popToTop()}])}} style={{justifyContent: 'center'}}>
          <Text>채팅방 나가기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
function MyChatRoomScreen({route, navigation}) {
  const [messages, setMessages] = useState([]);
  const {itemId, otherParams} = route.params;

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: otherParams,
        createdAt: new Date(),
        user: {
          avatar: 'https://placeimg.com/140/140/any',
        }
      },
      {
        _id: 2,
        text: itemId + ' 채팅방입니다.',
        createdAt: new Date(),
        user: {
          _id:2,
          name: 'system',
          avatar: 'https://placeimg.com/140/140/any',
        },
      },
    ])
  }, [])

  React.useLayoutEffect(() => {
    navigation.setOptions({ headerTitle: itemId });
  }, [navigation, route]);

  const onSend = useCallback((messages = []) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
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
class DiaryComponent extends React.Component{
  constructor(props){
    super(props);

    this.state = {
      _id: this.props.id?this.props.id:1,
      title: this.props.title?this.props.title:'임시 상품명',
      updateDate: this.props.updateDate?{
        year: this.props.updateDate.getFullYear(),
        month: this.props.updateDate.getMonth(),
        day: this.props.updateDate.getDay(),
      }:{year: 2020, month: 11, day: 21},
      updateCount: this.props.updateCount?this.props.updateCount:0,
      animation: this.props.animation,
    };
  }

  componentDidUpdate(prevProps, prevState){
    //if(pressDiaryEditButton !== animation){

      this.setState({animation: this.props.animation});
      console.log(this.state.animation);
    //}
  }

  render(){

    if(this.state.animation){
      return (
      <Animatable.View animation="swing" iterationCount={'infinite'}>
      <TouchableOpacity style={{margin: 20, marginBottom: 0, marginTop: 10}} onPress={()=>{this.props.nav.navigate('Diary')}}>
        <View style={{margin: 5}}>
          <Image style={{height: 190, width: 130, marginBottom: 5}} source={diaryImg} resizeMode='contain'/>
          <View style={{}}>
            <Text style={{fontSize: 20, color: 'black', fontWeight:'bold', alignSelf: 'center'}}>{this.state.title}</Text>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5}}>
              <Text style={{fontSize: 8, color: 'gray'}}>{this.state.updateDate.year}년 {this.state.updateDate.month}월 {this.state.updateDate.day}일</Text>
              <Text style={{fontSize: 8, color: 'gray'}}>{this.state.updateCount}회 기록</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
      </Animatable.View>
    );
    } else {
      return (
        <TouchableOpacity style={{margin: 20, marginBottom: 0, marginTop: 10}} onPress={()=>{this.props.nav.navigate('Diary')}}>
          <View style={{margin: 5}}>
            <Image style={{height: 190, width: 130, marginBottom: 5}} source={diaryImg} resizeMode='contain'/>
            <View style={{}}>
              <Text style={{fontSize: 20, color: 'black', fontWeight:'bold', alignSelf: 'center'}}>{this.state.title}</Text>
              <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5}}>
                <Text style={{fontSize: 8, color: 'gray'}}>{this.state.updateDate.year}년 {this.state.updateDate.month}월 {this.state.updateDate.day}일</Text>
                <Text style={{fontSize: 8, color: 'gray'}}>{this.state.updateCount}회 기록</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      );
    }
  }
}
function DailyDiaryContent({text, last}){
  const [message, setMessage] = React.useState(
    text? text : 'media heading media heading media heading media headingmedia heading media heading media heading media heading media heading media heading'
  );


  return (
    <View style={{flex:1, flexDirection: 'row'}}>
      <View style={{width: 16, height: 16, borderRadius: 8, backgroundColor: 'gray', marginTop: 10}}/>
      <SafeAreaView style={{flex: 1, flexDirection: 'column', marginRight: 8}}>
        <Text style={{color: 'gray', fontWeight: 'bold', fontSize: 20, marginLeft: 10}}>0524</Text>
        <TextInput editable={last??true} style={{marginLeft: 30, fontSize: 13}} multiline value={message===''?'빈 메시지':message} onChangeText={text=>setMessage(text)}></TextInput>
        <TouchableOpacity onPress={()=>{ return(<DateTimePicker
          testID="dateTimePicker"
          value={new Date(1598051730000)}
          mode={'date'}
          is24Hour={true}
          display="default"
          onChange={()=>{}}
          />)}}>
          <Text style={{fontSize: 10, color: '#AAA', alignSelf: 'flex-end', marginTop: 6, marginBottom: 30}}>오후 4시 40분</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}
function DynamicDiaryScreen(){
  const [valueY, setValueY] = React.useState(0);
  const [contentHeight, setContentHeight] = React.useState(1000);

  return (
    <View style={{flex:1, flexDirection: 'column'}}>
    <View style={{position: 'absolute', left: 47, top: 30,  width: 2, borderRadius: 1, backgroundColor: 'gray', height: 50}}/>
    <View style={{backgroundColor: '#555', position: 'absolute', left:15, top: 30, borderRadius: 12}}>
      <Text style={{color: 'white', fontSize: 20, marginVertical: 3, marginHorizontal: 5}}>2020</Text>
    </View>
    <ScrollView style={{ marginTop: 80}} onScroll={(event)=>{setValueY(event.nativeEvent.contentOffset.y); setContentHeight(event.nativeEvent.contentSize.height);}} keyboardDismissMode={'on-drag'} scrollToEnd={true}>
      <View style={{flex:1, flexDirection: 'column', marginLeft: 40, marginRight: 10, marginBottom: 60}}>
        <DailyDiaryContent/>
        <DailyDiaryContent/>
        <DailyDiaryContent/>
        <DailyDiaryContent/>
        <DailyDiaryContent/>
        <DailyDiaryContent/>
        <DailyDiaryContent/>
        <DailyDiaryContent text={'마지막 메세지'} date={new Date()} last={false}/>
      </View>
      <View style={{position: 'absolute', left: 47,  width: 2, borderRadius: 1, backgroundColor: 'gray', height: contentHeight-150}}/>

    </ScrollView>
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
          <TouchableOpacity onPress={()=>{}}>
            <Text style={{fontSize: 22, marginLeft: 3}}>로그아웃</Text>
          </TouchableOpacity>
        </View>
        <View style={{marginHorizontal: 15, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#DDD'}}>
          <AntDesign name="key" color="black" size={30} style={{marginVertical: 15, marginLeft: 0}}/>
          <TouchableOpacity onPress={()=>{}}>
            <Text style={{fontSize: 22, marginLeft: 9}}>비밀번호 변경</Text>
          </TouchableOpacity>
        </View>
        <View style={{marginHorizontal: 15, borderBottomWidth: 1, borderBottomColor: '#DDD'}}>
          <View style={{ flexDirection: 'row', alignItems: 'center'}}>
            <AntDesign name="filetext1" color="black" size={30} style={{marginVertical: 15, marginLeft: 0}}/>
            <TouchableOpacity onPress={()=>{}}>
              <Text style={{fontSize: 22, marginLeft: 9}}>이용 내역</Text>
            </TouchableOpacity>
          </View>
          <View style={{marginLeft: 45, marginRight: 5, marginHorizontal: 10, marginBottom: 20, borderWidth: 1, borderRadius: 10, alignItems: 'center'}}>
            <Text style={{fontSize: 15, margin: 10}}>내 기록: {totalCount}         내 다이어리: {myDiaryCount}</Text>
          </View>
        </View>
        <View style={{marginHorizontal: 15, flexDirection: 'row', alignItems: 'center'}}>
          <Feather name="info" color="black" size={30} style={{marginVertical: 15, marginLeft: 0}}/>
          <TouchableOpacity onPress={()=>{}}>
            <Text style={{fontSize: 22, marginLeft: 9}}>고객센터</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

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
            onPress={() => chatSettingButtonHandler()}
            >
            <Text style={{fontWeight: 'bold', marginRight: 20, fontSize: 20, color: 'gray'}}>=</Text>
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
          headerRight: (props) => (
            <TouchableOpacity
            onPress={() => optionDiaryButtonHandler()}
            >
            <Text style={{fontWeight: 'bold', marginRight: 20, fontSize: 20, color: 'gray'}}>+</Text>
            </TouchableOpacity>
          )}}
        component={DynamicDiaryScreen}
      />
      <Stack.Screen
        name="MyPage"
        options={{
          title: "My",
          headerTitleAlign: 'center',
          headerTitleStyle: {fontWeight: 'bold', fontSize: 25}}}
        component={MyPageScreen}
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
          <Drawer.Navigator>
            <Drawer.Screen name='sidebar' component={MainStackHomePage}/>
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
});
