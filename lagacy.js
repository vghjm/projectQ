import React from 'react';

let thankQChatmessageListData = [
  {
    _id: 10, text: '그랬구나~!~! 정말 감사한 기억이겠다😌', createdAt: Moment('20200705 0810'),
    user: { _id:2, avatar: require('./assets/product/new땡Q노트/thumbnail.png')},
  },
  {
    _id: 9, text: '어렸을 때 할아버지가 크레파스를 사주셨던 추억이 너무 감사해. 할아버지가 조금 무서웠는데, 크레파스를 통해서 할아버지의 사랑이 느껴져서 좋았어~', createdAt: Moment('20200705 0807'),
    user: { _id:1,},
  },
  {
    _id: 8, text: '너의 어린시절에 감사를 한다면?', createdAt: Moment('20200705 0803'),
    user: { _id:2, avatar: require('./assets/product/new땡Q노트/thumbnail.png')},
  },
  {
    _id: 7, text: '아 그래? 네 곁에 소중한 것이 많아지길 바래..!', createdAt: Moment('20200704 0807'),
    user: { _id:2, avatar: require('./assets/product/new땡Q노트/thumbnail.png')},
  },
  { _id: 6, text: '나는 생일날 선물 받은 무선 이어폰이 감사해. 그 이어폰을 꼽고 지하철을 탈 때마다 너무 편하고 기분이 좋아!!', createdAt: Moment('20200704 0805'),
    user: { _id:1,},
  },
  {
    _id: 5, text: '감사하게 생각하는 물건은 뭐야?', createdAt: Moment('20200704 0801'),
    user: { _id:2, avatar: require('./assets/product/new땡Q노트/thumbnail.png')},
  },
  {
    _id: 4, text: '그렇구나~~ 간단하게 그분께 감사함을 표현해보는 것도 좋겠다😉', createdAt: Moment('20200703 0805'),
    user: { _id:2, avatar: require('./assets/product/new땡Q노트/thumbnail.png')},
  },
  {
    _id: 3, text: '나랑 함께 일하는 사람들에게 감사해. 나 혼자였다면 하지 못했을 일들도, 주변의 사람들과 함께 만들어나가면 해낼 수 있었던 거 같아.', createdAt: Moment('20200703 0802'),
    user: { _id:1,},
  },
  { _id: 2, text: '지금 문득 감사하고 싶은 사람이 있어?', createdAt: Moment('20200703 0800'),
    user: { _id:2, avatar: require('./assets/product/new땡Q노트/thumbnail.png')},
  },
  {
    _id: 1, text: '이제 THANK Q 감사노트 구독이 시작됩니다.\n오전 8시가 되면 질문 드릴게요.', createdAt: Moment('20200702 211034'),
    user: { _id:2, avatar: require('./assets/product/new땡Q노트/thumbnail.png')},
  },
];
let highlightChatmessageListData = [
  {
    _id: 10, text: '좋은데~? 잘 할 수 있을거야! 빠샤~!', createdAt: Moment('20200712 0842'),
    user: { _id:2, avatar: require('./assets/product/newQ하이라이트/thumbnail.png')},
  },
  {
    _id: 9, text: '오! 오늘 중학교 친구에게 연락이나 한번 해봐야겠다. 오랜만에 전화하면 진짜 반가울 거 같아ㅋㅋㅋ', createdAt: Moment('20200712 0840'),
    user: { _id:1,},
  },
  {
    _id: 8, text: '오늘 소소하게 하고 싶은 일이 뭐야? 난 연락을 못했던 친구에게 안부를 물어봐야겠다. 너는?', createdAt: Moment('20200712 0832'),
    user: { _id:2, avatar: require('./assets/product/newQ하이라이트/thumbnail.png')},
  },
  {
    _id: 7, text: '그래~~멋지다😍😍 매일 행동하는 너가 대단해..!', createdAt: Moment('20200711 0807'),
    user: { _id:2, avatar: require('./assets/product/newQ하이라이트/thumbnail.png')},
  },
  { _id: 6, text: '오늘은 저녁에 10분 정도 운동을 해야겠어. 틈날 때마다 조금씩이라도 운동을 해보려고!', createdAt: Moment('20200711 0840'),
    user: { _id:1,},
  },
  {
    _id: 5, text: '오늘 소소하게 하고 싶은 일이 뭐야?', createdAt: Moment('20200711 0835'),
    user: { _id:2, avatar: require('./assets/product/newQ하이라이트/thumbnail.png')},
  },
  {
    _id: 4, text: '좋아! 그거 하나는 끝내버리자고!!! 💪💪', createdAt: Moment('20200710 0837'),
    user: { _id:2, avatar: require('./assets/product/newQ하이라이트/thumbnail.png')},
  },
  {
    _id: 3, text: '오늘은 꼭 밀렸던 집안일을 해치우겠어!!! 빨래도 하고 방도 쓸거야~~', createdAt: Moment('20200710 0834'),
    user: { _id:1,},
  },
  { _id: 2, text: '오늘은 어떤 소소한 일을 해낼까?', createdAt: Moment('20200710 0830'),
    user: { _id:2, avatar: require('./assets/product/newQ하이라이트/thumbnail.png')},
  },
  {
    _id: 1, text: '이제 Q 하이라이트 구독이 시작됩니다.\n오전 8시 30분이 되면 질문 드릴게요.', createdAt: Moment('20200709 221034'),
    user: { _id:2, avatar: require('./assets/product/newQ하이라이트/thumbnail.png')},
  },
];
let qTalkChatmessageListData = [
  {
    _id: 11, text: '오늘 뭐했는지 궁금하다! 오늘 어떻게 보냈어?', createdAt: Moment('20200813 2101'),
    user: { _id:2, avatar: require('./assets/product/newQ톡일기/thumbnail.png')},
  },
  {
    _id: 10, text: '그랬어?? 내가 다 재밌다🤣🤣', createdAt: Moment('20200812 2112'),
    user: { _id:2, avatar: require('./assets/product/newQ톡일기/thumbnail.png')},
  },
  {
    _id: 9, text: '오늘은 동료들끼리 고기를 좀 구웠어~ 우리가 갔던 곳이 정말 맛있는 집이여서 기분이 좋았어. 같이 얘기도 하고 고기도 먹으니 신났어', createdAt: Moment('20200812 2110'),
    user: { _id:1,},
  },
  {
    _id: 8, text: '오늘 재밌는 일은 뭐가 있었어?', createdAt: Moment('20200812 2103'),
    user: { _id:2, avatar: require('./assets/product/newQ톡일기/thumbnail.png')},
  },
  {
    _id: 7, text: '그래? 잘했어, 잘한거야~🤗', createdAt: Moment('20200811 2110'),
    user: { _id:2, avatar: require('./assets/product/newQ톡일기/thumbnail.png')},
  },
  { _id: 6, text: '오늘은 집에 왔는데 너무 귀찮아서 놀았어. 재밌는 영상 보면서 뒹굴거리니깐 안락해ㅋㅋ 너무 생각없이 놀았나 싶기도 하고 ㅠㅠ', createdAt: Moment('20200811 2108'),
    user: { _id:1,},
  },
  {
    _id: 5, text: '오늘 잘지냈어? 뭐하고 지냈어?', createdAt: Moment('20200811 2105'),
    user: { _id:2, avatar: require('./assets/product/newQ톡일기/thumbnail.png')},
  },
  {
    _id: 4, text: '그랬구나! 밥🍚은 꼭꼭 챙겨먹으라구~', createdAt: Moment('20200810 2112'),
    user: { _id:2, avatar: require('./assets/product/newQ톡일기/thumbnail.png')},
  },
  {
    _id: 3, text: '오늘은 바빠서 점심에 후딱 샐러드를 먹긴 했는데, 저녁에는 그래도 든든하게 챙겨 먹었어. 정신없이 지나간 하루였어ㅠㅠ', createdAt: Moment('20200810 2110'),
    user: { _id:1,},
  },
  { _id: 2, text: '오늘 어떻게 보냈어? 밥은 잘 챙겨 먹었어?', createdAt: Moment('20200810 2100'),
    user: { _id:2, avatar: require('./assets/product/newQ톡일기/thumbnail.png')},
  },
  {
    _id: 1, text: '이제 Q TALK 일기 구독이 시작됩니다.\n오후 9시가 되면 질문 드릴게요.', createdAt: Moment('20200809 233834'),
    user: { _id:2, avatar: require('./assets/product/newQ톡일기/thumbnail.png')},
  },
];
let qTalkDiaryMessageListData = [
  { _id: 1, text: '오늘은 바빠서 점심에 후딱 샐러드를 먹긴 했는데,\n저녁에는 그래도 든든하게 챙겨 먹었어.\n정신없이 지나간 하루였어ㅠㅠ', createdAt: Moment('20200810 2110'), islagacy: true, linkedMessageList: []},
  { _id: 2, text: '오늘은 집에 왔는데 너무 귀찮아서 놀았어.\n재밌는 영상 보면서 뒹굴거리니깐 안락해ㅋㅋ\n너무 생각없이 놀았나 싶기도 하고 ㅠㅠ', createdAt: Moment('20200811 2108'), islagacy: true, linkedMessageList: []},
  { _id: 3, text: '오늘은 동료들끼리 고기를 좀 구웠어~\n우리가 갔던 곳이 정말 맛있는 집이여서 기분이 좋았어.\n같이 얘기도 하고 고기도 먹으니 신났어', createdAt:Moment('20200812 2110'), islagacy: true, linkedMessageList: []},
  { _id: 4, text: '오늘 특별한 일이 없었던거 같아.\n그냥 열심히 일하고, 기분도 딱히 나쁘지 않았던거 같아.\n하루를 끝내기는 조금 아쉬우니 집 앞에\n산책이나 다녀오려고 해.', createdAt: Moment('20200813 2105'), islagacy: true, linkedMessageList: []},
];

let realTestData1 = {
  id: 1, isAvailable: true, hasDiary:true, hasChatroom: true, isSubscribe:true,
  product: {
    title: 'THANK Q 감사노트',
    text: '매일 당신에게 질문하는 감사 일기장',
    imageSet: {thumbnailImg: require('./assets/product/new땡Q노트/thumbnail.png'), logoImg: require('./assets/product/new땡Q노트/logo.png'), mainImg: require('./assets/product/new땡Q노트/main.png'), avatarImg: require('./assets/product/new땡Q노트/thumbnail.png')},
    questionList: [
      '지금 문득 감사하고 싶은 사람이 있어?',
      '너가 감사함을 느끼는 추억은 어떤거야?',
      '너가 평소 감사하고 있는 일은 어떤거야?',
      '너가 감사하는 물건은?',
      '자연에 관해 감사한다면, 어떤 것에 감사하고 싶어?',
      '나 자신에게 감사하고 싶은 게 있을까?',
      '너의 가족들에게 어떤 걸 감사하고 싶어?',
      '최근에 친구나 주변사람 중에 누구에게 감사를 느꼈어?',
      '연예인이나 유명인 중에 너가 감동을 받고, 감사한 사람이 있어?',
      '너는 어떤 글귀나 책에 감사한 마음을 느끼고 있어?',
      '지금까지 영화나 영상을 본 것 중에 감사한 것이 있어?',
      '너의 어린시절에 감사를 한다면?',
      '오늘 감사할 것이 있다면, 어떤거야?',
      '음식에 관해 감사할 것이 있을까?',
    ],
    ansList: [],
  },
  chatroom: {
    lastMessageTime: Moment('20200705 0811'), newItemCount: 0, chatmessageList: thankQChatmessageListData, lastPushed: {pushTime: Moment(), questIndex: 1, solved:true},
  },
  diary: {
    makeTime: Moment('20200702 211034'), totalUpdateCount: 0, diarymessageList: []
  },
  push: {
    isRandomPushType: false, pushStartTime: Moment('20200812 0830'), pushEndTime: Moment('20200812 0830'),
  },
};
let realTestData2 = {
  id: 2, isAvailable: true, hasDiary:true, hasChatroom: true, isSubscribe:true,
  product: {
    title: 'Q 하이라이트',
    text: '오늘을 의미있게 만들 순간을, 미리 적는 일기장',
    imageSet: {thumbnailImg: require('./assets/product/newQ하이라이트/thumbnail.png'), logoImg: require('./assets/product/newQ하이라이트/logo.png'), mainImg: require('./assets/product/newQ하이라이트/main.png'), avatarImg: require('./assets/product/newQ하이라이트/thumbnail.png')},
    questionList: [
      '오늘 소소하게 하고 싶은 일이 있어?',
      '오늘 소소하게 하고 싶은 일이 어떤거야? 난 밀렸던 빨래를 할거야. 너는?',
      '오늘 소소하게 하고 싶은 일이 뭐야? 난 글을 써보고 싶어. 너는?',
      '오늘 소소하게 하고 싶은 일이 뭐야? 나는 오늘 일기를 쓸거야. 너는?',
      '오늘 소소하게 하고 싶은 일이 뭐야? 난 조용한 음악을 틀어놓고 명상을 해보고 싶어. 너는?',
      '오늘 소소하게 하고 싶은 일이 뭐야? 난 내가 좋아하는 노래를 들으려고! 너는?',
      '오늘 소소하게 하고 싶은 일이 뭐야? 난 좋아하는 친구에게 전화할거야! 너는?',
      '오늘 소소하게 하고 싶은 일이 뭐야? 난 연락을 못했던 친구에게 안부를 물어봐야겠다. 너는?',
      '오늘의 소소한 하이라이트는 뭐였으면 좋겠어?',
      '오늘 소소하게 하고 싶은 일이 뭐야?',
      '오늘 한 가지 재밌는 일을 뭘로 정하면 좋을 것 같아?',
      '오늘 해내고 싶은 한 가지는 뭐야?',
      '오늘 처리해버리면 시원한, 할 일 한 가지는 뭐야?',
      '오늘의 하이라이트 한 가지는 뭐로 정할래?',
      '오늘은 어떤 소소한 일을 해낼까?',
      '오늘 내가 할 수 있는 일 한 가지를 뭘로 정하면 좋겠어?',
      '오늘 하이라이트로 뭘 하고 싶어?',
      '즐거운 일 한 가지를 오늘의 하이라이트로 정해보는 건 어때? 뭘로 정할래!',
      '오늘 이거 하나는 꼭 해야겠다는 게 뭐야?',
      '오늘을 만족한 하루로 만들, 소소한 할 일 한 가지는 뭐야?',
    ],
    ansList: [],
  },
  chatroom: {
    lastMessageTime:  Moment('20200712 0842'), newItemCount: 0,  chatmessageList: highlightChatmessageListData, lastPushed: {pushTime: Moment(), questIndex: 1, solved:true},
  },
  diary: {
    makeTime:  Moment('20200709 221034'),  totalUpdateCount: 0, diarymessageList: [],
  },
  push: {
    isRandomPushType: false, pushStartTime: Moment('20200812 0830'), pushEndTime: Moment('20200812 0830'),
  },
};
let realTestData3 = {
  id: 3, isAvailable: true, hasDiary:true, hasChatroom: true, isSubscribe:true,
  product: {
    title: 'Q TALK 일기',
    text: '오늘 당신의 감정과 생각을 물어오는 일기장',
    imageSet: {thumbnailImg: require('./assets/product/newQ톡일기/thumbnail.png'), logoImg: require('./assets/product/newQ톡일기/logo.png'), mainImg: require('./assets/product/newQ톡일기/main.png'), avatarImg: require('./assets/product/newQ톡일기/thumbnail.png')},
    questionList: [
      '오늘 어땠어? 만족스러웠어?',
      '오늘 기분은 어때?',
      '오늘은 어떻게 보냈어?',
      '오늘 힘든 일 없었어?',
      '오늘 재밌는 일은 뭐가 있었어?',
      '오늘 잘지냈어? 뭐하고 지냈어?',
      '오늘은 뭐했어?',
      '오늘 뭐했는지 궁금하다! 오늘 어떻게 보냈어?',
      '하루동안 수고 많았어. 만족스러운 하루였어?',
      '오늘 기분은 어때!',
      '하루 잘 보냈어?',
      '오늘 어떻게 보냈어? 밥은 잘 챙겨 먹었어?',
      '오늘 뭐가 제일 재밌는 일이었어?',
      '오늘 어떤 즐거운 일이 있었어?',
      '오늘 하루는 너다웠어?',
      '오늘은 많이 바빴어?',
      '오늘 고민거리는 없었어?',
    ],
    ansList: [],
  },
  chatroom: {
    lastMessageTime: Moment('20200813 2107'), newItemCount: 0,  chatmessageList: qTalkChatmessageListData, lastPushed: {pushTime: Moment(), questIndex: 1, solved:true},
  },
  diary: {
    makeTime: Moment('20200809 233834'), totalUpdateCount: 4, diarymessageList: qTalkDiaryMessageListData,
  },
  push: {
    isRandomPushType: true, pushStartTime: Moment('20200812 0830'), pushEndTime: Moment('20200812 1130'),
  },
};


async function loadingProductData() {
  let loadDataFailure = true;

  const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
  if (status !== "granted") {
      Alert.alert('파일 획득 권한을 얻을 수 없습니다.');
      return loadDataFailure;
  }

  const downloadFile = async (url) =>{
    let path = url.split('/');
    let returnUri;
    const file_name = path[path.length-1];

    await FileSystem.downloadAsync(
      url,
      FileSystem.documentDirectory + file_name
    )
    .then(({ uri }) => {
      console.log('Finished downloading to ', uri);
      returnUri = uri;

    })
    .catch(error => {
      console.error(error);
    });

    return returnUri;
  }


  let response = await fetch(HTTP+'/product/lookup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify({
      jwt: userData.token,
    }),
  });

  if (response.ok) { // HTTP 상태 코드가 200~299일 경우
    // 응답 몬문을 받습니다(관련 메서드는 아래에서 설명).
    let json = await response.json();
    //console.log('response\n', json);
    loadDataFailure = false; // 성공

    dataList = [];
    await json.products.reduce( async (last, product, i) =>{
      let myQuestList = [];
      let myAnsList = [];
      // 질문 분류기
      product.question.forEach((questObj, i) => {
        if(i%2 === 0){
          myQuestList.push(questObj.content);
        }else{
          myAnsList.push(questObj.content);
        }
      })

      // 이미지 로딩
      let thumbnailImg = await downloadFile(HTTP + '/files/' + product.img_logo);
      let logoImg = await downloadFile(HTTP + '/files/' + product.img_background);
      let mainImg = await downloadFile(HTTP + '/files/' + product.img_explain);

      let productData = {
        id: product.p_ID, isAvailable: true, hasDiary:false, hasChatroom: false, isSubscribe:false,
        product: {
          title: product.p_name,
          text: product.p_intro,
          imageSet: {thumbnailImg: {uri: thumbnailImg}, logoImg: {uri: logoImg}, mainImg: {uri: mainImg}, avatarImg: {uri: thumbnailImg}},
          questionList: myQuestList,
          ansList: myAnsList,
        },
        chatroom: {
          lastMessageTime: null, newItemCount: 0, chatmessageList: [],
        },
        diary: {
          makeTime: null, totalUpdateCount: 0, diarymessageList: []
        },
        push: {
          isRandomPushType: product.pushType===1, pushStartTime: Moment('20200812 ' + product.start_time), pushEndTime: Moment('20200812 ' + product.end_time),
        },
      };
      console.log('load product\n', productData);
      dataList.push(_.cloneDeep(productData));
      return 1;
    }, 0);

    //console.log('update UserData: ', dataList[0]);

    return loadDataFailure;
  } else {
    // 서버와 연결이 안됨
    Alert.alert('서버와 연결이되지 않습니다.');
  }

  return loadDataFailure;
}
async function loadingDiaryData() {
  let loadDataFailure = true;
  console.log("loadingDiaryData\n");

  let response = await fetch(HTTP+'/diary/lookup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify({
      jwt: userData.token,
    }),
  });

  if (response.ok) { // HTTP 상태 코드가 200~299일 경우
    // 응답 몬문을 받습니다(관련 메서드는 아래에서 설명).
    let json = await response.json();
    console.log('response\n', json);
    loadDataFailure = false; // 성공
    return loadDataFailure;
  } else {
    // 서버와 연결이 안됨
    Alert.alert('서버와 연결이되지 않습니다.');
  }

  return loadDataFailure;
}
function SignInScreen({navigation}){
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [autoLoginChecked, setAutoLoginChecked] = React.useState(true);
  const { signIn } = React.useContext(AuthContext);
  const [pressLoginButton, setPressLoginButton] = useState(false);

  const loginHandler = async () => {
    // email check
    // https://velog.io/@marcus/React-Form-Login-Validation-fpjsepzu0x
    if(pressLoginButton){
      return;
    }
    setPressLoginButton(true);

    if(isEmail(username)){
      console.log(`email: ${username}, password:${password}`);
      let response = await fetch(HTTP+'/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify({
          email: username,
          password: password
        }),
      });

      if (response.ok) { // HTTP 상태 코드가 200~299일 경우
        // 응답 몬문을 받습니다(관련 메서드는 아래에서 설명).
        let json = await response.json();
        //console.log('response\n', json);
        if(json.res === 'no email'){
          Alert.alert('해당하는 이메일의 계정이 없습니다.');
        }else if(json.res === 'password mismatch'){
          Alert.alert('비밀번호가 일치하지 않습니다.');
        }else if(json.res === 'success'){
          userData.token = json.token;
          userData.username = json.name;
          userData.email = username;
          userData.password = password;
          console.log('login success\ntoken: \n', userData.token,'\nusername: ', userData.username);

          let loadProductDataFailure = await loadingProductData();
          let loadingDiaryDataFailure = await loadingDiaryData();
          if(loadProductDataFailure){
            // 실패
            Alert.alert('서버로부터 상품정보를 불러올 수 없습니다.');
          }else if(loadingDiaryDataFailure){
            // 실패
            Alert.alert('서버로부터 사용자정보를 불러올 수 없습니다.');
          }else {
            // 성공
            signIn([username, password, true]);
          }

        }

      } else {
        // 서버와 연결이 안됨
        Alert.alert('서버와 연결이되지 않습니다.');
      }

    }else{
      Alert.alert('이메일 형식이 잘못되었습니다.');
    }
    setPressLoginButton(false);
  }

  return (
      <ScrollView style={{marginTop:30}}>
      <View style={{flex:1, flexDirection: 'column', alignItems: 'center'}}>
        <Image source={q_moment} resizeMode={'contain'} style={{height: 200, width:170, marginTop: 80}}/>
        <View style={{marginTop: 80}}>
          <TextInput value={username} onChangeText={(username)=>setUsername(username)} placeholder={"이메일"} style={[styles.singInInputBox, {marginBottom: 8}]} placeholderTextColor={'#666'}/>
          <TextInput value={password} onChangeText={(password)=>setPassword(password)} placeholder={"비밀번호"} style={styles.singInInputBox} secureTextEntry={true} placeholderTextColor={'#666'}/>
          <View style={{flexDirection: 'row', margin:10}}>
            <CheckBox title="autoLoginCheckBox" value={autoLoginChecked} onValueChange={()=>setAutoLoginChecked(!autoLoginChecked)}/>
            <Text style={{marginTop: 3}}>자동로그인</Text>
          </View>
          <TouchableOpacity style={{alignItems: 'center', padding: 10, backgroundColor: '#BBB'}} onPress={loginHandler}>
            <Text style={{fontSize: 21}}>{pressLoginButton ? '로그인 중...' : '로그인'}</Text>
          </TouchableOpacity>
          <View style={{flexDirection: 'row', justifyContent: 'center'}}>
            <TouchableOpacity onPress={()=>navigation.navigate('FindPassword')}><Text style={{fontSize: 12, margin: 5}}>비밀번호 찾기</Text></TouchableOpacity>
            <Text style={{marginTop: 2}}> | </Text>
            <TouchableOpacity onPress={()=>navigation.navigate('SignUp')}><Text style={{fontSize: 12, margin: 5, marginRight: 30}}>회원 가입</Text></TouchableOpacity>
          </View>
        </View>
      </View>
      </ScrollView>
  )
}
function FindPasswordScreen({navigation}){
  const [email, setEmail] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [emailError, setEmailError] = React.useState(false);
  const [usernameError, setUsernameError] = React.useState(false);
  const [findPasswordError, setFindPasswordError] = React.useState(false);

  const findPasswordHandler = async () => {
    console.log('findPasswordHandler');

    if(!isEmail(email)){
      if(!emailError) setEmailError(true);
      return;
    }

    let response = await fetch(HTTP+'/user/findpw', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify({
        email: email,
      }),
    });

    if (response.ok) { // HTTP 상태 코드가 200~299일 경우
      // 응답 몬문을 받습니다.
      let json = await response.json();
      console.log('response\n', json);
      if(json.res === 'send email success'){
        Alert.alert('이메일로 새로운 임시 비밀번호를 보냈습니다.', '',[{text: '확인', onPress:() => navigation.popToTop()}]);
      }else if(json.res === 'send email failed'){
        Alert.alert('메일 발송이 불가능한 이메일 주소입니다.');
      }else if(json.res === 'No existing email'){
        //Alert.alert('미등록된 이메일 주소입니다.');
        if(!findPasswordError) setFindPasswordError(true);
      }
    } else {
      // 서버와 연결이 안됨
      Alert.alert('서버와 연결이되지 않습니다.');
    }

  }

  return (
    <View style={{flex:1, flexDirection: 'column'}}>
      <TextInput placeholder='이메일' style={{borderWidth: 1, margin: 20, marginTop: 90, padding: 5, backgroundColor: '#DDD'}} value={email} onChangeText={(e)=>setEmail(e)} />
      {emailError && <Text style={{color: 'red', fontSize: 12, marginBottom: 10, marginLeft: 30}}>가입한 이메일 주소를 입력해주세요.</Text>}
      <TextInput placeholder='사용자명' style={{borderWidth: 1, margin: 20, marginTop: 10, padding: 5, backgroundColor: '#DDD'}} value={username} onChangeText={(e)=>setUsername(e)} />
      {usernameError && <Text style={{color: 'red', fontSize: 12, marginBottom: 10, marginLeft: 30}}>해당 사용자명이 존재하지 않습니다.</Text>}
      {findPasswordError && <Text style={{color: 'red', fontSize: 12, marginBottom: 10, marginLeft: 30, marginTop: 20}}>입력하신 정보와 일치하는 계정이 없습니다.</Text>}
      <TouchableOpacity style={{height: 50, margin:20, backgroundColor: '#BBB', alignItems: 'center', justifyContent: 'center'}} onPress={findPasswordHandler}>
        <Text>확인</Text>
      </TouchableOpacity>
    </View>
  );
}
function SignUpScreen({navigation}){
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [password2, setPassword2] = React.useState('');
  const [errorEmailForm, setErrorEmailForm] = React.useState(false);
  const [errorPasswordForm, setErrorPasswordForm] = React.useState(false);
  const [errorPasswordNotCorrect, setErrorPasswordNotCorrect] = React.useState(false);
  const { signIn } = React.useContext(AuthContext);

  const informTermsOfUse = () => {
    // 이용약관
    WebBrowser.openBrowserAsync('https://www.notion.so/c12e0571d8034d83add6d9976cbf4725');
  };
  const personalTerm = () => {
    // 개인정보
    WebBrowser.openBrowserAsync('https://www.notion.so/de2d25d45cb641319df224c4b325df96');
  };
  const signUpHandler = async () => {
    let errorCount = 0;

    // 이메일 형식 확인
    if(isEmail(email)){
      if(errorEmailForm) setErrorEmailForm(false);
    }else{
      errorCount++;
      if(!errorEmailForm) setErrorEmailForm(true);
    }

    // 비밀번호 형식 확인
    if(password.length > 5){
      if(errorPasswordForm) setErrorPasswordForm(false);
    }else{
      errorCount++;
      if(!errorPasswordForm) setErrorPasswordForm(true);
    }

    // 비밀번효 확인
    if(password === password2){
      if(errorPasswordNotCorrect) setErrorPasswordNotCorrect(false);
    }else{
      errorCount++;
      if(!errorPasswordNotCorrect) setErrorPasswordNotCorrect(true);
    }

    if(errorCount === 0){
      // 통과
      console.log(`emailcheck email:${email}`);

      let response = await fetch(HTTP+'/user/checkemail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({
          email: email,
        }),
      });

      if (response.ok) { // HTTP 상태 코드가 200~299일 경우
        // 응답 몬문을 받습니다.
        let json = await response.json();
        console.log('response\n', json);
        if(json.res === 'already existing email'){
          Alert.alert('이미 존재하는 이메일 입니다.');
        }else if(json.res === 'success'){
          console.log('emailcheck success');
          userData.email = email;
          userData.password = password;
          navigation.navigate('SetUsername');
          signIn([email, password, false]);
        }
      } else {
        // 서버와 연결이 안됨
        Alert.alert('서버와 연결이되지 않습니다.');
      }
    }
  }

  return (
    <View>
    <View style={{position:'absolute', left:16, top:30}}>
      <TouchableOpacity onPress={()=>navigation.navigate('SignIn')}>
        <AntDesign name="arrowleft" size={26} color="black" />
      </TouchableOpacity>
    </View>
    <ScrollView  style={{marginTop:60}}>
      <View style={{flex:1, flexDirection: 'column', alignItems: 'center'}}>
        <Image source={logo} resizeMode={'contain'} style={{width:270, height:90, marginBottom: 40}} />
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
          <TouchableOpacity onPress={informTermsOfUse}><Text style={[styles.smallText, {color: '#22D'}]}>이용약관</Text></TouchableOpacity>
          <Text style={styles.smallText}>과 </Text>
          <TouchableOpacity onPress={personalTerm}><Text style={[styles.smallText, {color: '#22D'}]}>개인정보 처리방침</Text></TouchableOpacity>
          <Text style={styles.smallText}>을 확인하였으며, 동의합니다. </Text>
        </View>
        <View>
          <TouchableOpacity style={{alignItems: 'center', padding: 10, backgroundColor: '#BBB', width: 300, marginTop: 60}} onPress={signUpHandler}>
            <Text>가입하기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
    </View>
  );
}
function UserNameSettingScreen({navigation}) {
  const [username, setUsername] = React.useState('');
  const { registerUsername } = React.useContext(AuthContext);

  const start = async () => {
    userData.username = username;
    console.log('start');

    let response1 = await fetch(HTTP+'/user/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify({
        email: userData.email,
        name: username,
        password: userData.password,
      }),
    });

    if(response1.ok){
      let json1 = await response1.json();
      console.log('response1\n', json1);

      if(json1.res === "failed"){
        Alert.alert('signup error');
        return;
      }

      // login
      let response2 = await fetch(HTTP+'/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({
          email: userData.email,
          password: userData.password,
        }),
      });

      if(response2.ok){
        let json2 = await response2.json();

        userData.token = json2.jwt;

        registerUsername(username);
      }else{
        Alert.alert('로그인 과정중 에러가 있습니다. 다시 시도하세요');
        return;
      }

    }else{
      Alert.alert('서버에 연결이 되지 않습니다.');
    }

  }

  return (
    <KeyboardAvoidingView style={{flex:1, flexDirection: 'column', alignItems:'center', justifyContent:'space-between'}} behavior="height" enabled>
      <View style={{padding:40}}><Text>유저네임 등록 화면 이미지</Text></View>
      <View style={{justifyContent: 'center'}}>
        <Text style={{fontWeight: 'bold', marginBottom: 50, alignSelf: 'center'}}>당신의 호칭을 정해주세요.</Text>
        <Text style={{margin:5, fontWeight:'bold', marginLeft: 0}}>사용자 이름</Text>
        <TextInput value={username} onChangeText={(username)=>setUsername(username)} style={styles.singInInputBox} placeholder={"'사용자의 이름'"}/>
      </View>
      <View>
        <TouchableOpacity style={{alignItems: 'center', padding: 10, backgroundColor: '#BBB', width: 300, marginTop: 60}} onPress={start}>
          <Text>시작하기</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
