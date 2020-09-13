import InlineTextInput from './InlineTextInput';
import React, {useState, useEffect, useContext} from 'react';
import {View, ScrollView, Image, Text, TouchableOpacity, KeyboardAvoidingView, Alert} from 'react-native';
import {ThemeContext} from './context/ThemeContext';
import {AuthContext} from './context/AuthContext';
import {isEmailValid, isPasswordValid} from '../utils/utils';
import {HEIGHT} from '../utils/constants';
import {Ionicons } from '@expo/vector-icons';
import CheckBox from 'react-native-check-box';  // https://www.npmjs.com/package/react-native-check-box#installation
import * as WebBrowser from 'expo-web-browser';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';

const Stack = createStackNavigator();
const LogoPosition = ({logo, height}) => {
  return (
    <View style={{height:height??240, alignItems: 'center', justifyContent: 'center'}}>
      <Image resizeMode={'contain'} style={{width:120, marginTop:15}} source={logo}/>
    </View>
  );
}
const WarningMessage = ({visible, message}) => {
  return (
    <View style={{height:24, marginLeft: 40, marginTop:5}}>
      {visible && <Text style={{color: 'red', fontSize: 12}}>{message}</Text>}
    </View>
  );
}
const InlineTouchable = (props) => {
  const focus = props.focus;
  const theme = props.theme;
  const onPress = props.onPress;
  const style = props.style;
  const text = props.text;
  return (
    <View style={style}>
      <TouchableOpacity onPress={onPress} style={{alignItems: 'center', justifyContent: 'center', backgroundColor: focus?theme.light[2]:theme.default, height: 40}}>
        <Text style={{fontSize:17}}>{text}</Text>
      </TouchableOpacity>
    </View>
  );
}
const BackButton = ({navigation}) => {
  return (
    <TouchableOpacity style={{position:'absolute',left:20, top:30}} onPress={()=>navigation.goBack()}>
      <Ionicons name="ios-arrow-back" size={32} color="black" />
    </TouchableOpacity>
  );
}


function SignIn({navigation}){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [autoLoginChecked, setAutoLoginChecked] = useState(true);
  const [isTouchable, setIsTouchable] = useState(false);
  const theme = useContext(ThemeContext);
  const {signIn, ogin} = useContext(AuthContext);
  let nowPressingButton = false;

  const emailUpdateHandler = (text) => {
    if(text!==email) setEmail(text);
  }
  const passwordUpdateHandler = (text) => {
    if(text!==password) setPassword(text);
  }

  useEffect(() => { // 로그인 가능 체크
    if(email !== '' && password !== ''){
      if(!isTouchable) setIsTouchable(true);
    }else if(isTouchable) setIsTouchable(false);
  }, [email, password]);

  const loginHandler = async () => {
    if(nowPressingButton) return;
    else nowPressingButton = true;

    if(isEmailValid(email) && isPasswordValid(password)){
      let response = await signIn({email: email, password:password});
      nowPressingButton = false;

      if(response.ok){
        login({token: response.data.token, username: response.data.username, email: email, password: password});
      }else{
        Alert.alert('로그인 중 에러발생', response.message);
      }
    }else{
      Alert.alert('이메일 또는 비밀번호 형식이 맞지 않습니다.');
      nowPressingButton = false;
    }
  }

  return (
    <ScrollView>
      <LogoPosition logo={theme.logo} height={270}/>
      <InlineTextInput text={email} title="이메일" theme={theme} style={{marginVertical: 5}} onChangeText={emailUpdateHandler} textType={null}/>
      <InlineTextInput text={password} title="비밀번호" theme={theme} style={{marginVertical: 5, borderWidth: 0}} onChangeText={passwordUpdateHandler} textType={'password'}/>
      <CheckBox style={{flex: 1, marginLeft:20}} onClick={()=>setAutoLoginChecked(!autoLoginChecked)} isChecked={autoLoginChecked} rightText={"자동 로그인"}/>
      <InlineTouchable focus={isTouchable} style={{marginHorizontal: 20, marginTop:5}} theme={theme} text={'로그인'} onPress={loginHandler}/>
      <View style={{flexDirection: 'row', justifyContent: 'center', marginTop:20}}>
        <TouchableOpacity onPress={()=>navigation.navigate('FindPassword')}><Text style={{fontSize: 12, margin: 5}}>비밀번호 찾기</Text></TouchableOpacity>
        <Text style={{marginTop: 2}}> | </Text>
        <TouchableOpacity onPress={()=>navigation.navigate('SignUp')}><Text style={{fontSize: 12, margin: 5, marginRight: 30}}>회원 가입</Text></TouchableOpacity>
      </View>
    </ScrollView>
  );
}
function FindPassword({navigation}){
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [isTouchable, setIsTouchable] = useState(false);
  const [findPasswordError, setFindPasswordError] = useState(false);
  const theme = useContext(ThemeContext);
  const {findpw} = useContext(AuthContext);
  let nowPressingButton = false;

  useEffect(() => { // 누름가능여부 체크
    if(email !== ''){
      if(!isTouchable) setIsTouchable(true);
    }else if(isTouchable) setIsTouchable(false);
  }, [email]);

  const emailUpdateHandler = (text) => {
    if(text!==email) setEmail(text);
  }

  const onPressHandler = async () => {
    if(nowPressingButton) return;
    else nowPressingButton = true;

    if(isEmailValid(email)){
      let response = await findpw(email);

      if(response.ok){
        Alert.alert('등록된 이메일로 임시 패스워드를 보냈습니다.');
      }else{
        Alert.alert('등록되지 않은 이메일 입니다.');
      }
      nowPressingButton = false;
    }else{
      Alert.alert('이메일 형식이 맞지 않습니다.');
      nowPressingButton = false;
    }

  }

  return (
    <View style={{height: '100%'}}>
      <LogoPosition logo={theme.logo} height={200}/>
      <View style={{alignItems: 'center', justifyContent: 'center', height: 60}}><Text style={{fontSize: 17, fontWeight: 'bold'}}>비밀번호 찾기</Text></View>
      <InlineTextInput text={email} title="이메일" theme={theme} style={{marginVertical: 5}} onChangeText={emailUpdateHandler} textType={null}/>
      <WarningMessage visible={emailError} message={'가입 시 사용한 이메일 주소를 입력해 주세요.'}/>
      <InlineTouchable onPress={onPressHandler} focus={isTouchable} style={{flex:1, flexDirection: 'column-reverse', margin:20}} theme={theme} text={'확인'}/>
      <BackButton navigation={navigation}/>
    </View>
  );
}
function SignUp({navigation}){
  // 입력창 화면표시제어
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [nextPassword, setNextPassword] = useState('');
  const [nextPasswordError, setNextPasswordError] = useState(false);
  // 버튼 화면표시제어
  const [isTouchable, setIsTouchable] = useState(false);
  const [nowPressingButton, setNowPressingButton] = useState(false);
  const theme = useContext(ThemeContext);

  useEffect(() => { // 누름가능여부 체크
    if(email !== '' && password !== '' && nextPassword !== ''){
      if(!isTouchable) setIsTouchable(true);
    }else if(isTouchable) setIsTouchable(false);
  }, [email, password, nextPassword]);

  const emailUpdateHandler = (text) => {
    if(text!==email) setEmail(text);
  }
  const passwordUpdateHandler = (text) => {
    if(text!==password) setPassword(text);
  }
  const nextPasswordUpdateHandler = (text) => {
    if(text!==nextPassword) setNextPassword(text);
  }

  const onPressHandler = async () => {
    if(nowPressingButton) return;
    else setNowPressingButton(true);

    if(isEmailValid(email)){
      let a;
    }
    setNowPressingButton(false);
  }

  const informTermsOfUse = () => {
    // 이용약관
    WebBrowser.openBrowserAsync('https://www.notion.so/c12e0571d8034d83add6d9976cbf4725');
  };
  const personalTerm = () => {
    // 개인정보
    WebBrowser.openBrowserAsync('https://www.notion.so/de2d25d45cb641319df224c4b325df96');
  };

  return (
    <View>
    <KeyboardAvoidingView behavior={'padding'}>
    <ScrollView>
      <LogoPosition logo={theme.logo} height={200}/>
      <InlineTextInput text={email} title="이메일" theme={theme} style={{marginTop:8}} placeholder={'   비밀번호 분실시 임시 비밀번호를 발송합니다.'} onChangeText={emailUpdateHandler} textType={null}/>
      <WarningMessage visible={emailError} message={'이메일 주소 형식이 아닙니다.'}/>
      <InlineTextInput text={password} title="비밀번호" theme={theme} style={{marginTop:8}} placeholder={'   6 ~ 16자 영어 소문자 및 숫자만 가능'} onChangeText={passwordUpdateHandler} textType={'password'}/>
      <WarningMessage visible={passwordError} message={'올바른 비밀번호 형식이 아닙니다.'}/>
      <InlineTextInput text={nextPassword} title="비밀번호 확인" theme={theme} style={{marginTop:8}} onChangeText={nextPasswordUpdateHandler} textType={'password'}/>
      <WarningMessage visible={nextPasswordError} message={'비밀번호가 일치하지 않습니다.'}/>
      <View style={{height: HEIGHT-620}}/>
      <View style={{flex:1, flexDirection: 'column-reverse'}}>
        <InlineTouchable onPress={onPressHandler} focus={isTouchable} style={{margin:20}} theme={theme} text={'가입하기'}/>
        <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{fontSize: 12}}>회원가입 시 </Text>
          <TouchableOpacity onPress={informTermsOfUse}><Text style={{color: '#22D', fontSize: 12}}>이용약관</Text></TouchableOpacity>
          <Text style={{fontSize: 12}}>과 </Text>
          <TouchableOpacity onPress={personalTerm}><Text style={{color: '#22D', fontSize: 12}}>개인정보 처리방침</Text></TouchableOpacity>
          <Text style={{fontSize: 12}}>을 확인하였으며, 동의합니다. </Text>
        </View>
      </View>
    </ScrollView>
    </KeyboardAvoidingView>
    <BackButton navigation={navigation}/>
    </View>
  );
}
function SetUsername({navigation}){
  const [username, setUsername] = useState('');
  const [isTouchable, setIsTouchable] = useState(false);
  const [nowPressingButton, setNowPressingButton] = useState(false);
  const theme = useContext(ThemeContext);

  useEffect(() => { // 누름가능여부 체크
    if(username !== ''){
      if(!isTouchable) setIsTouchable(true);
    }else if(isTouchable) setIsTouchable(false);
  }, [username]);

  const usernameUpdateHandler = (text) => {
    if(text!==username) setUsername(text);
  }

  const onPressHandler = async () => {
    if(nowPressingButton) return;
    else setNowPressingButton(true);

    // do something

    setNowPressingButton(false);
  }

  return (
    <View style={{height: '100%'}}>
      <LogoPosition logo={theme.logo} height={200}/>
      <View style={{alignItems: 'center', justifyContent: 'center', height: 60}}><Text style={{fontSize: 17, fontWeight: 'bold'}}>당신의 호칭을 정해주세요</Text></View>
      <InlineTextInput text={username} title="사용자 이름" theme={theme} style={{marginVertical: 5}} onChangeText={usernameUpdateHandler} textType={null}/>
      <InlineTouchable onPress={onPressHandler} focus={isTouchable} style={{flex:1, flexDirection: 'column-reverse', margin:20}} theme={theme} text={'시작하기'}/>
      <BackButton navigation={navigation}/>
    </View>
  );
}

export default function LoginNavigation(){

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen options={{cardStyle: {backgroundColor: 'white'}, headerShown: false}} name="SignIn" component={SignIn}/>
        <Stack.Screen options={{cardStyle: {backgroundColor: 'white'}, headerShown: false}} name="FindPassword" component={FindPassword}/>
        <Stack.Screen options={{cardStyle: {backgroundColor: 'white'}, headerShown: false}} name="SignUp" component={SignUp}/>
        <Stack.Screen options={{cardStyle: {backgroundColor: 'white'}, headerShown: false}} name="SetUsername" component={SetUsername}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
