import React, { useState, useCallback, useEffect } from 'react';
import { AsyncStorage, ImageBackground, Text, View, StyleSheet, TouchableOpacity, TextInput, CheckBox, KeyboardAvoidingView, Alert, Button, ScrollView, SafeAreaView, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, getFocusedRouteNameFromRoute, useNavigation } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons, MaterialCommunityIcons, Feather, FontAwesome } from '@expo/vector-icons';
import { GiftedChat } from 'react-native-gifted-chat' // https://github.com/FaridSafi/react-native-gifted-chat

const introImage1 = {uri: "https://cdn.crowdpic.net/detail-thumb/thumb_d_F78FC0AA8923C441588C382B19DF0BF8.jpg"};
const introImage2 = {uri: "https://previews.123rf.com/images/romeolu/romeolu1601/romeolu160100122/50594417-%EB%88%88-%EB%B0%B0%EA%B2%BD.jpg"};
const introImage3 = {uri: "https://previews.123rf.com/images/kittikornphongok/kittikornphongok1505/kittikornphongok150501184/40020410-%EB%8B%A4%EC%B1%84%EB%A1%9C%EC%9A%B4-%EC%88%98%EC%B1%84%ED%99%94%EC%9E%85%EB%8B%88%EB%8B%A4-%EA%B7%B8%EB%9F%B0-%EC%A7%80-%EC%A7%88%EA%B0%90-%EB%B0%B0%EA%B2%BD%EC%9E%85%EB%8B%88%EB%8B%A4-%EB%B6%80%EB%93%9C%EB%9F%AC%EC%9A%B4-%EB%B0%B0%EA%B2%BD%EC%9E%85%EB%8B%88%EB%8B%A4-.jpg"};
const defaultImg = {uri: "https://t1.daumcdn.net/cfile/tistory/24283C3858F778CA2E"};
const AuthContext = React.createContext();
const Tab = createMaterialTopTabNavigator();
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

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
  return (
    <View style={{flex:1, alignItems: 'center', justifyContent:'space-between'}}>
      <Text>비밀번호 찾기 페이지</Text>
      <TouchableOpacity onPress={()=>navigation.popToTop()}>
        <Text>뒤로가기</Text>
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
        <TouchableOpacity onPress={()=>Alert.alert('이용약관', '이용약관은 다음과 같음 ~~, 다음 사항에 동의합니다.', [{text: '동의'}])}><Text style={[styles.smallText, {color: '#22D'}]}>이용약관</Text></TouchableOpacity>
        <Text style={styles.smallText}>과 </Text>
        <TouchableOpacity onPress={()=>Alert.alert('개인정보 처리방침', '개인정보 처리방침은 다음과 같음 ~~, 다음 사항에 동의합니다.', [{text: '동의'}])}><Text style={[styles.smallText, {color: '#22D'}]}>개인정보 처리방침</Text></TouchableOpacity>
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
        <Text style={{fontWeight: 'bold', marginBottom: 50}}>당신의 호칭을 정해주세요.</Text>
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
function MyDiaryScreen(){
  return (
    <View style={{flex:1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>MyDiaryScreen</Text>
    </View>
  );
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
function SubscribeContentScreen({route, navigation}){
  const {itemId, otherParams} = route.params;

  React.useLayoutEffect(() => {
    navigation.setOptions({ headerTitle: itemId });
  }, [navigation, route]);

  return (
    <SafeAreaView style={{flex:1}}>
      <ScrollView centerContent={true} >
        <Image source={defaultImg} style={{height: 200}} resizeMode='cover'/>
        <View style={{height: 160, backgroundColor: '#EEE', justifyContent: 'space-around', alignItems: 'center'}}>
          <Image source={defaultImg} style={{position:'absolute', alignSelf: 'center', top:-80, height: 100, width: 100, borderRadius: 50}}/>
          <Text style={{fontSize: 20, fontWeight:'bold', marginTop: 15}}>구독상품 제목</Text>
          <Text style={{marginLeft: 20, marginRight: 20}}>구독상품 소개 문구, 50자 이내 25자씩 2줄 디자인 상품 배경 이미지 제작, 디자인 상품 로고 제작, 디자인 상품 소개 이미지 정방형 디자인 상품 소개 끝</Text>
        </View>
        <Image source={defaultImg} style={{height: 1200}} resizeMode='cover'/>
        <View style={{flex:1, backgroundColor: '#EEE', justifyContent: 'space-around'}}>
          <TouchableOpacity style={{position:'absolute', right:30, top:80, height: 30, width: 130, backgroundColor: 'blue'}}>
            <Text>ON</Text>
          </TouchableOpacity>
          <Text>구독 하기</Text>
          <Text>정시 메시지 수신 시간</Text>
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
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
      login: false,
      username: null,
    }
  );

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
  }, []);

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
  );

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
          <Stack.Navigator mode={'modal'} headerMode={'none'}>
            <Stack.Screen name="SignIn" component={SignInScreen}/>
            <Stack.Screen name="FindPassword" component={FindPasswordScreen}/>
            <Stack.Screen name="SignUp" component={SignUpScreen}/>
            <Stack.Screen name="SetUsername" component={UserNameSettingScreen}/>
          </Stack.Navigator>
        </NavigationContainer>
      ) : (
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name="MainPage"
              options={({route})=>({
                headerTitle: getHeaderTitle(route, '채팅'),
                headerTitleAlign: 'left',
                headerTitleStyle: {fontWeight: 'bold', fontSize: 25},
                headerRight: (props) => (
                  <TouchableOpacity
                    onPress={() => Alert.alert('This is a button!', ' - 기능 추가할 예정')}
                  >
                  <Text style={{fontWeight: 'bold', marginRight: 20, fontSize: 20, color: 'gray'}}>My</Text>
                  </TouchableOpacity>
                )})
              }
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
                    onPress={() => Alert.alert('This is a button!')}
                  >
                  <Text style={{fontWeight: 'bold', marginRight: 20, fontSize: 20, color: 'gray'}}>=</Text>
                  </TouchableOpacity>
                )}
              }
              component={MyChatRoomScreen}
            />
            <Stack.Screen
              name="contentScreen"
              options={{
                title: "content screen",
                headerTitleAlign: 'center',
                headerTitleStyle: {fontWeight: 'bold', fontSize: 25},
                headerTransparent: true,
              }}
              component={SubscribeContentScreen}
            />
          </Stack.Navigator>
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
