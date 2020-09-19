import React, {useState} from 'react';
import {View, Text, Image, TouchableOpacity, TextInput, Alert, ScrollView} from 'react-native';
import * as Permissions from 'expo-permissions';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import * as ImagePicker from 'expo-image-picker';      // https://docs.expo.io/versions/latest/sdk/imagepicker/
import { EvilIcons, AntDesign, Feather, MaterialCommunityIcons }
from '@expo/vector-icons'; // https://icons.expo.fyi/



import {AuthContext} from './Context';


const userData = {
  token: 'asfnjk436k3b46jh346bk',
  username: '테스트 계정',
  email: 'test@naver.com',
  password: '1234567!!',
  userImg: null,
  mySubscribeList: [],
  myDiaryList: [],
  myChatroomList: [],
};

let dataList = [];

const informTestData = {
  introduction: [],
  help: [],
  notice: [],
};

// 마이페이지
export function MyPageScreen({navigation}) {
  const [myDiaryCount, setMyDiaryCount] = useState(10);
  const [totalCount, setTotalCount] = useState(256);
  const [image, setImage] = useState(userData.userImg);
  const [username, setUsername] = useState(userData.username);
  const [editMode, setEditMode] = useState(false);
  const { signOut } = useContext(AuthContext);

  const [tempText, setTempText] = useState('aaaa');

  const getPermissionAsync = async () => {
    //if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert('카메라기능 사용자권한이 필요합니다.');
      }
    //}
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
export function MyChangePasswordPage({navigation}) {
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
export function UserHistoryPage({navigation}) {
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
export function ServiceCenterPage({navigation}) {
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
export function ServiceIntroductionPage({navigation}) {
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
export function HelpPage({navigation}) {
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
export function NoticePage({navigation}) {
  return (
    <ScrollView style={{flex:1, flexDirection: 'column', marginTop: 10}}>
      {informData.notice.map( message => {
        return  <NoticeContentComponent key={message.id} title={message.title} date={message.date} message={message.message}/>
      })}
      <View style={{flex:1, height: 600}}/>
    </ScrollView>
  );
}
