import InlineTextInput from './InlineTextInput';
import React, {useState, useEffect, useContext} from 'react';
import {View, ScrollView, Image, CheckBox, Text, TouchableOpacity} from 'react-native';
import {ThemeContext} from './context/ThemeContext';



function LoginForm({navigation}){
  const logo = null;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [autoLoginChecked, setAutoLoginChecked] = useState(true);
  const [isLoginAvailable, setIsLoginAvailable] = useState(false);
  const [pressLoginButton, setPressLoginButton] = useState(false);
  const theme = useContext(ThemeContext);

  const emailUpdateHandler = (e) => {
    const text = e.nativeEvent.text;
    //console.log('emailUpdateHandler: ', text);
    if(text!==email) setEmail(text);
  }
  const passwordUpdateHandler = (e) => {
    const text = e.nativeEvent.text;
    //console.log('passwordUpdateHandler: ', text);
    if(text!==password) setPassword(text);
  }
  useEffect(() => {
    //console.log('useEffect');
    if(email !== '' && password !== '' && !isLoginAvailable) setIsLoginAvailable(true);
    else if(isLoginAvailable) setIsLoginAvailable(false);
  }, [email, password]);

  const loginHandler = () => {

  }


  return (
    <ScrollView>
      <View style={{height:260, alignItems: 'center', justifyContent: 'center'}}><Image resizeMode={'contain'} style={{height: 200, width:120, marginTop:20}} source={theme.logo}/></View>
      <InlineTextInput text={email} title="이메일" theme={theme} style={{marginVertical: 5}} onEndEditing={emailUpdateHandler} textType={null}/>
      <InlineTextInput text={password} title="비밀번호" theme={theme} style={{marginVertical: 5, borderWidth: 0}} onEndEditing={passwordUpdateHandler} textType={'password'}/>
      <View style={{flexDirection: 'row', marginVertical:0, marginLeft:20, borderWidth:0}}>
        <CheckBox title="autoLoginCheckBox" value={autoLoginChecked} onValueChange={()=>setAutoLoginChecked(!autoLoginChecked)}/>
        <Text style={{marginTop: 3, fontSize: 14}}>자동로그인</Text>
      </View>
      <TouchableOpacity style={{marginHorizontal: 20, height:43, borderWidth:0, marginTop:5, backgroundColor: isLoginAvailable?theme.light[2]:theme.default, alignItems: 'center', justifyContent: 'center'}} onPress={loginHandler}>
        <Text style={{fontSize: 13}}>{pressLoginButton ? '로그인 중...' : '로그인'}</Text>
      </TouchableOpacity>
      <View style={{flexDirection: 'row', justifyContent: 'center', marginTop:20}}>
        <TouchableOpacity onPress={()=>navigation.navigate('FindPassword')}><Text style={{fontSize: 12, margin: 5}}>비밀번호 찾기</Text></TouchableOpacity>
        <Text style={{marginTop: 2}}> | </Text>
        <TouchableOpacity onPress={()=>navigation.navigate('SignUp')}><Text style={{fontSize: 12, margin: 5, marginRight: 30}}>회원 가입</Text></TouchableOpacity>
      </View>
    </ScrollView>
  );
}

export default LoginForm;
