import React, {useState, useContext, useEffect} from 'react';
import {View, Text, Image, TouchableOpacity, TextInput, Alert, ScrollView, StyleSheet} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import * as Permissions from 'expo-permissions';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import * as ImagePicker from 'expo-image-picker';      // https://docs.expo.io/versions/latest/sdk/imagepicker/
import { EvilIcons, AntDesign, Feather, MaterialCommunityIcons }
from '@expo/vector-icons'; // https://icons.expo.fyi/
import Moment from 'moment';

import { ThemeContext, AuthContext, UserDataContext, DiaryDataContext, ControllContext, InformDataContext } from './Context';
import changepPassword from './connect/changePassword';
import { defaultUserImg, pencil, paper, key, lock, info } from './utils/loadAssets';
import InlineTextInput from './InlineTextInput';
import { isPasswordValid } from './utils/utils';


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

// 마이페이지
export function MyPageScreen({navigation}) {
  const userData = useContext(UserDataContext);
  const diaryList = useContext(DiaryDataContext);
  const theme = useContext(ThemeContext);
  const diaryCount = diaryList.length;
  const totalDiaryUpdateCount = diaryList.reduce((prev, curr, i) => {
    return prev + curr.totalUpdateCount;
  }, 0);
  const [image, setImage] = useState(userData.userImg);
  const { updateUserImg, updateUserName } = useContext(ControllContext);
  const [username, setUsername] = useState(userData.username);
  const [editMode, setEditMode] = useState(false);
  const { signOut } = useContext(AuthContext);

  const onEndEditingHandler = () => {
    if(username !== ''){
      updateUserName(username)
    }else{
      setUsername(userData.username);
    }
    setEditMode(false);
  };

  const startEditModeHandler = () => {
    if(editMode === false){
      setEditMode(true);
    }
  };

  const pickImage = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status !== 'granted') {
      alert('카메라기능 사용자권한이 필요합니다.');
      return ;
    }

    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.cancelled) {
        updateUserImg(result);
        setImage(result);
      }

      console.log(result);
    } catch (E) {
      console.log(E);
    }
  };

  return (
    <View style={{flex:1, flexDirection: 'column'}}>
      <View style={{margin:15, marginBottom: 0, alignItems: 'center', borderBottomWidth: 1, borderColor: '#ccc', height: 170, justifyContent: 'center'}}>
        <TouchableOpacity onPress={pickImage}>
          {image
            ? <Image source={image} style={{height: 415/5, width: 426/5, borderRadius: 40, backgroundColor: '#EEE', marginTop: 20, marginBottom: 12}}/>
            : <Image source={defaultUserImg} style={{height: 415/5, width: 426/5, backgroundColor: '#EEE', marginTop: 20, marginBottom: 12}}/>
          }
        </TouchableOpacity>
        <View style={{flexDirection: 'row', marginLeft:20}}>
          {editMode
          ? <TextInput autoFocus={true} maxLength={10} selectTextOnFocus={true} onEndEditing={onEndEditingHandler} style={{fontSize: 20, height: 30, width:150, fontFamily: 'NanumMyeongjo_bold'}} value={username}  onChangeText={text=>setUsername(text)}/>
          : <Text style={{fontSize: 20, fontFamily: 'NanumMyeongjo_bold'}}>{username}</Text>
          }
          <TouchableOpacity onPress={startEditModeHandler}>
            <Image source={pencil} resizeMode={"cover"} style={{width: 15, height: 15, marginLeft: 10, marginTop:6}}/>
          </TouchableOpacity>
        </View>
      </View>
      <View style={{}}>
        <View style={{marginHorizontal: 15, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#f0f0f0'}}>
          <Image source={lock} resizeMode={'cover'} style={{width: 185/8, height: 246/8, margin: 15}}/>
          <TouchableOpacity onPress={()=>Alert.alert('정말 로그아웃 하시겠습니까?','로그인 페이지로 이동합니다.',[{text:'취소'}, {text:'확인', onPress:signOut}])}>
            <Text style={{fontSize: 17, marginLeft: 3, fontFamily: 'NanumMyeongjo'}}>로그아웃</Text>
          </TouchableOpacity>
        </View>
        <View style={{marginHorizontal: 15, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#f0f0f0'}}>
          <Image source={key} resizeMode={'cover'} style={{width: 201/8, height: 203/8, marginVertical: 15, marginRight: 8, marginLeft: 13}}/>
          <TouchableOpacity onPress={()=>navigation.navigate('ChangePassword')}>
            <Text style={{fontSize: 17, marginLeft: 9, fontFamily: 'NanumMyeongjo'}}>비밀번호 변경</Text>
          </TouchableOpacity>
        </View>
        <View style={{marginHorizontal: 15, borderBottomWidth: 1, borderBottomColor: '#f0f0f0'}}>
          <View style={{ flexDirection: 'row', alignItems: 'center'}}>
            <Image source={paper} resizeMode={'cover'} style={{width: 163/8, height: 209/8, margin: 15}}/>
            <TouchableOpacity onPress={()=>navigation.navigate('UserHistory')}>
              <Text style={{fontSize: 17, marginLeft: 9, fontFamily: 'NanumMyeongjo'}}>이용 내역</Text>
            </TouchableOpacity>
          </View>
          <View style={{marginLeft: 45, marginRight: 5, marginHorizontal: 10, marginBottom: 20, borderRadius: 10, alignItems: 'center', backgroundColor: theme.light[0]}}>
            <Text style={{fontSize: 15, margin: 10, fontFamily: 'NanumMyeongjo'}}>내 기록: {totalDiaryUpdateCount}         내 다이어리: {diaryCount}</Text>
          </View>
        </View>
        <View style={{marginHorizontal: 15, flexDirection: 'row', alignItems: 'center'}}>
          <Image source={info} resizeMode={'cover'} style={{width: 165/7, height: 165/7, margin: 15}}/>
          <TouchableOpacity onPress={()=>navigation.navigate('ServiceCenter')}>
            <Text style={{fontSize: 17, marginLeft: 9, fontFamily: 'NanumMyeongjo'}}>고객센터</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
export function MyChangePasswordPage({navigation}) {
  const [prevPassword, setPrevPassword] = useState('');
  const [prevPasswordError, setPrevPasswordError] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordError, setNewPasswordError] = useState(false);
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
  const [newPasswordConfirmError, setNewPasswordConfirmError] = useState(false);

  const theme = useContext(ThemeContext);
  const userData = useContext(UserDataContext);
  const { changePassword } = useContext(ControllContext);
  const [isTouchable, setIsTouchable] = useState(false);
  let nowPressingButton = false;

  const prevPasswordUpdate = (text) => {
    if(text !== prevPassword) setPrevPassword(text);
  }
  const newPasswordUpdate = (text) => {
    if(text !== newPassword) setNewPassword(text);
  }
  const newPasswordConfirmUpdate = (text) => {
    if(text !== newPasswordConfirm) setNewPasswordConfirm(text);
  }

  useEffect(() => { // 누름가능여부 체크
    if(prevPassword !== '' && newPassword !== '' && newPasswordError !== ''){
        if(!isTouchable) setIsTouchable(true);
    }else if(isTouchable) setIsTouchable(false);
  }, [prevPassword, newPassword, newPasswordError]);


  const onPressHandler = async () => {
    if(nowPressingButton) return;
    else nowPressingButton = true;

    let errorCount = 0;

    if(prevPassword !== userData.password){
      errorCount++;
      if(!prevPasswordError) setPrevPasswordError(true);
    }else if(prevPasswordError) setPrevPasswordError(false);

    if(isPasswordValid(newPassword)){
      errorCount++;
      if(!newPasswordError) setNewPasswordError(true);
    }else if(newPasswordError) setNewPasswordError(false);

    if(newPassword !== newPasswordConfirm){
      errorCount++;
      if(!newPasswordConfirmError) setNewPasswordConfirmError(true);
    }else if(newPasswordConfirmError) setNewPasswordConfirmError(false);

    if(errorCount === 0){

      Alert.alert('비밀번호가 변경되었습니다.');
      changePassword(newPassword);
      navigation.goBack();
    }

    nowPressingButton = false;
  }

  return (
    <View style={{height: '100%'}}>
      <View style={{height: 100}}/>
      <InlineTextInput text={prevPassword} title="현재 비밀번호" theme={theme} style={{marginVertical: 5}} onChangeText={prevPasswordUpdate} textType={'password'}/>
      <WarningMessage visible={prevPasswordError} message={'현재 비밀번호와 다릅니다.'}/>
      <InlineTextInput text={newPassword} title="새 비밀번호" theme={theme} placeholder={'6~16자 영문, 소문자, 숫자만 사용가능합니다.'} style={{marginVertical: 5}} onChangeText={newPasswordUpdate} textType={'password'}/>
      <WarningMessage visible={newPasswordError} message={'6~16자 영문, 소문자, 숫자만 사용가능합니다.'}/>
      <InlineTextInput text={newPasswordConfirm} title="새 비밀번호 확인" theme={theme} placeholder={'6~16자 영문, 소문자, 숫자만 사용가능합니다.'} style={{marginVertical: 5}} onChangeText={newPasswordConfirmUpdate} textType={'password'}/>
      <WarningMessage visible={newPasswordConfirmError} message={'비밀번호가 일치하지 않습니다.'}/>
      <InlineTouchable onPress={onPressHandler} focus={isTouchable} style={{flex:1, flexDirection: 'column-reverse', margin:20}} theme={theme} text={'변경완료'}/>
    </View>
  );
}
class SubscribeContentBoxComponent extends React.Component{
  constructor(props){
    super(props);
  }

  render(){
    return (
      <View style={styles.myShadow}>
        <Text style={{marginLeft: 20, marginVertical: 10, fontSize: 18, fontFamily: 'NanumMyeongjo_bold'}}>{this.props.title}</Text>
        <Text style={{marginLeft:30, marginVertical: 0, fontSize: 18, fontFamily: 'NanumMyeongjo_bold'}}>내 기록   <Text style={{fontSize: 22, fontWeight: 'normal', fontFamily: 'NanumMyeongjo'}}>{this.props.count}</Text></Text>
        <Text style={{marginLeft:30, marginVertical: 4, marginBottom: 10, fontSize: 18, fontFamily: 'NanumMyeongjo_bold'}}>기간  <Text style={{fontSize: 12, fontWeight: 'normal', fontFamily: 'NanumMyeongjo'}}>{this.props.startDate.format('YYYY.MM.DD')} ~ {Moment().format('YYYY.MM.DD')}</Text></Text>
      </View>
    );
  }
}
export function UserHistoryPage({navigation}) {
  const diaryList = useContext(DiaryDataContext);

  return (
    <ScrollView style={{flex:1, flexDirection: 'column', backgroundColor: '#fff'}}>
      <Text style={{margin:20, fontSize: 20, fontFamily: 'NanumMyeongjo_bold'}}>나의 구독 내역</Text>
      {diaryList.map(diary => {
        return <SubscribeContentBoxComponent key={diary.p_id} title={diary.title} count={diary.totalUpdateCount} startDate={diary.makeTime}/>;
      })}
    </ScrollView>
  );
}

// 서비스센터 페이지들
export function ServiceCenterPage({navigation}) {
  return (
    <View style={{flex:1, flexDirection: 'column', borderTopWidth: 0, marginHorizontal: 10}}>
      <TouchableOpacity style={{justifyContent: 'center', borderBottomWidth: 1, borderColor: '#F4F4F4'}} onPress={()=>navigation.push('ServiceIntroduction')}>
        <Text style={{marginVertical: 20, marginLeft: 30, fontSize: 20, fontFamily: 'NanumMyeongjo'}}>서비스 소개</Text>
      </TouchableOpacity>
      <TouchableOpacity style={{justifyContent: 'center', borderBottomWidth: 1, borderColor: '#F4F4F4'}} onPress={()=>navigation.push('Help')}>
        <Text style={{marginVertical: 20, marginLeft: 30, fontSize: 20, fontFamily: 'NanumMyeongjo'}}>도움말</Text>
      </TouchableOpacity>
      <TouchableOpacity style={{justifyContent: 'center', borderColor: '#F4F4F4'}} onPress={()=>navigation.push('Notice')}>
        <Text style={{marginVertical: 20, marginLeft: 30, fontSize: 20, fontFamily: 'NanumMyeongjo'}}>공지사항</Text>
      </TouchableOpacity>
    </View>
  );
}
export function ServiceIntroductionPage({navigation}) {
  return (
    <View style={{flex:1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
      <Text style={{fontSize: 20, fontFamily: 'NanumMyeongjo'}}>소개페이지가 준비중입니다.</Text>
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
export function HelpPage({navigation}) {
  const informData = useContext(InformDataContext);

  return (
    informData.help.length === 0
      ? <View style={{flex:1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
          <Text style={{fontSize: 20, fontFamily: 'NanumMyeongjo'}}>도움말 메시지가 없습니다.</Text>
        </View>
      : <ScrollView style={{flex:1, flexDirection: 'column', marginTop: 10}}>
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
export function NoticePage({navigation}) {
  const informData = useContext(InformDataContext);

  return (
    informData.notice.length === 0
      ? <View style={{flex:1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
          <Text style={{fontSize: 20, fontFamily: 'NanumMyeongjo'}}>공지사항 메시지가 없습니다.</Text>
        </View>
      : <ScrollView style={{flex:1, flexDirection: 'column', marginTop: 10}}>
          {informData.notice.map( message => {
            return <NoticeContentComponent key={message.id} title={message.title} date={message.date} message={message.message}/>
          })}
          <View style={{flex:1, height: 600}}/>
        </ScrollView>
  );
}

const styles = StyleSheet.create({
  myShadow: {
    borderWidth: 0,
    shadowColor: "#000",
    shadowOffset: {
    	width: 0,
    	height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,

    marginHorizontal: 20,
    marginVertical: 7,
  },
});
