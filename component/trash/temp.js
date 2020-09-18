// 인증 페이지
async function loadingProductData() {
  let loadDataFailure = true;

  /*
  const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
  if (status !== "granted") {
      Alert.alert('파일 획득 권한을 얻을 수 없습니다.');
      return loadDataFailure;
  }
  */

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
