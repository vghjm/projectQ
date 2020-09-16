import React, {useContext, useState, useEffect} from 'react';
import {View, TouchableOpacity, Image, KeyboardAvoidingView, ScrollView, Text, TextInput, Alert} from 'react-native';
import Draggable from 'react-native-draggable'; // https://github.com/tongyy/react-native-draggable
import * as Animatable from 'react-native-animatable'; // https://github.com/oblador/react-native-animatable
import Moment from 'moment';


// 유용
function diarySortByDate(myDiaryMessageList){
  myDiaryMessageList.sort((a, b) => {
    return a.createdAt > b.createdAt;
  });
}


// 드래그 기능 추가
function diaryPosToRealPos(diaryPos){
  let realPos ={x:0, y:0};

  if(diaryPos%2===1){
    // 왼쪽
    realPos.x = 0;
  }else{
    realPos.x = screenWidth-185;
  }
  realPos.y = (Math.ceil(diaryPos/2)-1) * 280;

  return realPos;
}
function realPosToDiaryPos(realPos){
  let diaryPos = 0;
  let numberOfDiary = userData.myDiaryList.length;
  console.log('x, y : ', realPos.x, realPos.y);

  if(realPos.y <= 0){
    diaryPos = 1;
  }else{
    diaryPos = Math.floor(realPos.y/320)*2 + 1;
  }

  if(diaryPos > numberOfDiary){
    diaryPos = numberOfDiary;
    if(numberOfDiary%2 === 0) diaryPos-=1;
  }
  if(realPos.x >= screenWidth/2) diaryPos+=1;

  return diaryPos;
}



// 다이어리 구성품
function AnimatableDiaryComponent(props){
  const id = props.id;
  //const data = dataList[id-1];
  let data = dataList[dataList.findIndex(obj => obj.id===id)];
  const [makeTime, setMakeTime] = useState(data.diary.makeTime);
  const [totalUpdateCount, setTotalUpdateCount] = useState(data.diary.totalUpdateCount);
  const [nowTime, setNowTime] = useState(Moment());
  let mydiarySettingIndex = userData.myDiaryList.findIndex(obj => obj.id === id);
  let x, y;

  useFocusEffect(()=>{
    if(makeTime != data.diary.makeTime) setMakeTime(data.diary.makeTime);
    if(totalUpdateCount != data.diary.totalUpdateCount) setTotalUpdateCount(data.diary.totalUpdateCount);
    if(!nowTime.isSameOrAfter(nowTime, 'day')) setNowTime(Moment());
  });

  const eraseDiaryHandler = () => { // 다이어리 삭제 기능
    let thisPos = userData.myDiaryList[userData.myDiaryList.findIndex(obj => obj.id === id)].pos;  // 현재 위치 확인
    userData.mySubscribeList.splice(userData.mySubscribeList.findIndex(obj => obj.id === id), 1);  // 구독 제거
    userData.myChatroomList.splice(userData.myChatroomList.findIndex(obj => obj.id === id), 1);    // 채팅창 제거
    userData.myDiaryList.splice(userData.myDiaryList.findIndex(obj => obj.id === id), 1);          // 다이어리 제거
    data.hasDiary = false;        // 다이어리 없음 셋팅
    data.hasChatroom = false;     // 채팅창 없음 셋팅
    data.isSubscribe = false;     // 구독 없음 셋팅
    data.diary.totalUpdateCount = 0;
    props.updateDiary(thisPos);    // 화면 렌더링 & 현재 다이어리보다 높은 위치의 다이어리를 모두 한 칸 아래로 압축
  }

  const eraseDiaryAlertHandler = () => { // 다이어리 삭제할 건지 더 물어봄
    Alert.alert('정말로 '+data.product.title+'을 삭제하시겠습니까?', '다이어리를 삭제하면 현재 상품에 대한 다이어리와 채팅 기록이 모두 사라지며 구독이 취소됩니다.', [{text: '취소'}, {text: '확인', onPress: eraseDiaryHandler}]);
  };

  return (
    <View style={{margin: 5}} onLayout={(e)=>{x = e.nativeEvent.layout.x; y = e.nativeEvent.layout.y; console.log('x, y : ', x, y)}}>
      <Animatable.View animation='swing' iterationCount={'infinite'}>
      <View style={{margin: 20, marginBottom: 0, marginTop: 10}}>
          <View style={{position:'absolute', left:3, top:5, height: 185, width:130, backgroundColor: '#CCC', borderBottomRightRadius: 8, borderTopRightRadius: 8}}/>
          <Image style={{height: 190, width: 130}} source={diaryImgList[userData.myDiaryList[mydiarySettingIndex].color]} resizeMode='contain'/>
          <View>
            <Text adjustsFontSizeToFit={true} style={{width: 130, fontSize: 16,  color: 'black', fontWeight:'bold', alignSelf: 'center', marginBottom: 3, marginTop:3}}>{data.product.title}</Text>
            <View style={{flexDirection: 'column', marginBottom: 5}}>
              {makeTime.isSameOrAfter(nowTime, 'day')
                ? <View><Text style={{fontSize: 8, color: 'gray'}}>오늘 생성한 다이어리</Text><Text style={{fontSize: 8, color: 'gray', alignSelf: 'flex-end', paddingRight:62}}>총 {totalUpdateCount}회 기록</Text></View>
                : <View><Text style={{fontSize: 8, color: 'gray'}}>{makeTime.format('L')} ~ {nowTime.format('L')}</Text><Text style={{fontSize: 8, color: 'gray', alignSelf: 'flex-end', paddingRight:30}}>총 {totalUpdateCount}회 기록</Text></View>}
            </View>
          </View>
    </View>
    </Animatable.View>
    <TouchableOpacity onPress={eraseDiaryAlertHandler} style={{position: 'absolute', left: 18, top:18, backgroundColor: '#DDD', height: 34, width: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center'}}>
      <Text style={{fontWeight:'bold'}}>X</Text>
    </TouchableOpacity>
  </View>
  );
}
function DiaryComponent(props){
  const id = props.id;
  //const data = dataList[id-1];
  let data = dataList[dataList.findIndex(obj => obj.id===id)];
  const [makeTime, setMakeTime] = useState(data.diary.makeTime);
  const [totalUpdateCount, setTotalUpdateCount] = useState(data.diary.totalUpdateCount);
  const [nowTime, setNowTime] = useState(Moment());
  let mydiarySettingIndex = userData.myDiaryList.findIndex(obj => obj.id === id);

  useFocusEffect(()=>{
    if(makeTime != data.diary.makeTime) setMakeTime(data.diary.makeTime);
    if(totalUpdateCount != data.diary.totalUpdateCount) setTotalUpdateCount(data.diary.totalUpdateCount);
    if(!nowTime.isSameOrAfter(nowTime, 'day')) setNowTime(Moment());
  });

  return (
    <TouchableOpacity style={{margin: 20, marginBottom: 0, marginTop: 10}} onPress={()=>{props.nav.navigate('Diary', {id: id})}}>
      <View style={{margin: 5}}>
        <View style={{position:'absolute', left:3, top:5, height: 185, width:130, backgroundColor: '#CCC', borderBottomRightRadius: 8, borderTopRightRadius: 8}}/>
        <Image style={{height: 190, width: 130}} source={diaryImgList[userData.myDiaryList[mydiarySettingIndex].color]} resizeMode='contain'/>
        <View>
          <Text adjustsFontSizeToFit={true} style={{width: 130, fontSize: 16, color: 'black', fontWeight:'bold', alignSelf: 'center', marginBottom: 3, marginTop:3}}>{data.product.title}</Text>
          <View style={{flexDirection: 'column', marginBottom: 5}}>
            {makeTime.isSameOrAfter(nowTime, 'day')
              ? <View><Text style={{fontSize: 8, color: 'gray'}}>오늘 생성한 다이어리</Text><Text style={{fontSize: 8, color: 'gray', alignSelf: 'flex-end', paddingRight:62}}>총 {totalUpdateCount}회 기록</Text></View>
              : <View><Text style={{fontSize: 8, color: 'gray'}}>{makeTime.format('L')} ~ {nowTime.format('L')}</Text><Text style={{fontSize: 8, color: 'gray', alignSelf: 'flex-end', paddingRight:30}}>총 {totalUpdateCount}회 기록</Text></View>}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
function MyDropList(props){
  const downloadPDFHandler = () => {
    Alert.alert('PDF 다운로드 버튼');
  };
  const shareWithLinkHandler = () => {
    Alert.alert('링크로 공유하기 버튼');
  }

  return (
    <View style={{position: 'absolute', left: 0, top:0, bottom:0, right:0, backgroundColor: '#AAA8'}}>
      <View style={{height: 65, borderBottomWidth: 1, borderColor: '#AAA', backgroundColor: '#FFF', justifyContent: 'center'}}>
        <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', padding: 5}} onPress={downloadPDFHandler}>
          <FontAwesome name="file-pdf-o" size={30} color="black" style={{marginLeft: 10}}/>
          <Text style={{position: 'absolute', left: 50, fontSize: 23}}>PDF 다운로드</Text>
        </TouchableOpacity>
      </View>
      <View style={{height: 65, backgroundColor: '#FFF', justifyContent: 'center'}}>
        <TouchableOpacity style={{flexDirection: 'row',  alignItems: 'center', padding: 5}} onPress={shareWithLinkHandler}>
          <EvilIcons name="external-link" size={40} color="black" />
          <Text style={{position: 'absolute', left: 50, fontSize: 23}}>링크로 공유하기</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={props.handler} style={{flex:1, flexDirection: 'column', backgroundColor: '#AAA7'}}/>
    </View>
  )
}
function NoDataInDiary(){
  return (
    <View style={{flex:1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
      <Text style={{fontSize: 15}}>채팅방에서 글을 작성해보세요.</Text>
    </View>
  );
}
function DiaryYear(props){
  const year = props.year;

  return (
    <View style={{paddingVertical: 5, marginBottom: 20}}>
      <View style={{backgroundColor: '#999', borderRadius: 12, marginLeft: 20, width: 70}}>
        <Text style={{color: 'white', fontSize: 20, marginVertical: 2, alignSelf: 'center'}}>{year}</Text>
      </View>
    </View>
  );
}
function DiaryDate(props){
  const date = props.date;

  return (
      <View style={{flexDirection: 'row', height: 40, alignItems: 'center'}}>
        <View style={{width: 10, height: 10, borderRadius: 5, backgroundColor: '#CCC', marginLeft: 50, marginBottom:3}}/>
        <TouchableOpacity onPress={props.onPressHandler}>
          <Text style={{marginLeft: 20, fontSize: 20, color: 'black', marginBottom:5}}>{date}</Text>
        </TouchableOpacity>
      </View>
  );
}
function DiaryTextWithDate(props){
  // 옵션 셋팅 변수
  const showYear = props.options.first || !props.options.sameYear;
  const showDate = props.options.first || !props.options.sameDate;
  const last = props.options.last;
  const title = props.title;
  const [myMessage, setMyMessage] = useState(props.message.text); // 표시되는 메시지
  const [editMode, setEditMode] = useState(true);                 // 편집모드 확인
  let handler = props.handler;                                    // 우상단 기능 구현함수
  let minusHandler = props.minusHandler;                          // 마지막 항목의 크기를 측정해감
  const [saveLastMessage, setSaveLastMessage] = useState('');     // 초기 메시지 저장 & 변경 확인용

  // 시간 및 날짜 편집용 변수
  const [showTimeChanger, setShowTimeChanger] = useState(false);
  const [showDateChanger, setShowDateChanger] = useState(false);

  const timeChangerHandler = (event, selectedDate) => {
    setShowTimeChanger(false);
    if(event.type === 'dismissed') return Alert.alert('취소하였습니다.');

    props.message.createdAt = Moment(selectedDate);
    props.diarySort();
  }
  const dateChangerHandler = (event, selectedDate) => {
    setShowDateChanger(false);
    if(event.type === 'dismissed') return Alert.alert('취소하였습니다.');

    props.message.createdAt = Moment(selectedDate);
    props.diarySort();
  }


  const onFocusHandler = () => {
    props.nav.setOptions({
      headerTitle: '내 기록편집',
      headerTitleAlign: 'center',
      headerRight: (props) => (
        <TouchableOpacity onPress={onEndEditingHandler}>
          <Text style={{fontSize:20, marginRight: 20, justifyContent: 'center'}}>완료</Text>
        </TouchableOpacity>
      )
    });
  };
  const onEndEditingHandler = () => { // 글쓰기 끝냄 처리
    setEditMode(false);
    //console.log('myMessage\n', myMessage);
    if(myMessage === ''){
      props.data.diary.diarymessageList.splice(props.diaryId, 1);
      props.diarySort();
    }else if(props.message.islagacy){
      // 연동 아님
      if(saveLastMessage != myMessage){
        //console.log('연동중 다름 발생! ', saveLastMessage, myMessage);
        props.message.text = myMessage;
      }
    }else {
      if(saveLastMessage != myMessage){
        //console.log('비 연동중 다름 발생! ', saveLastMessage, myMessage);
        props.message.islagacy = true;
        props.message.text = myMessage;
      }
    }

    props.nav.setOptions({
      headerTitle: title,
      headerTitleAlign: 'left',
      headerRight: (props) => (
        <TouchableOpacity onPress={handler}>
          <Image source={downArrow} style={{width:30, height:30, marginRight:20}}/>
        </TouchableOpacity>
      )
    });
    setTimeout(()=>{
      setEditMode(true);
    }, 500);
  };

  useEffect(() => {
    if(!props.message.islagacy){
      // 연동중
      let sumMessage = '';
      props.message.linkedMessageList.forEach(message => {
        if(sumMessage === '') sumMessage = message.text;
        else sumMessage += ' ' + message.text;
      })
      setMyMessage(sumMessage);
      setSaveLastMessage(sumMessage);
    }else{
      setSaveLastMessage(props.message.text);
    }
  }, []);




  return (
    <View onLayout={(event) => {
        var {x, y, width, height} = event.nativeEvent.layout;
        if(last) minusHandler(y);
    }}>
      {showYear && <DiaryYear year={props.message.createdAt.format('YYYY')} />}
      {showDate && <DiaryDate date={props.message.createdAt.format('MMDD')} onPressHandler={() => setShowDateChanger(true)} />}
      {showDateChanger && <DateTimePicker testID="DiaryDatePicker" value={props.message.createdAt.toDate()} mode={'date'}  display="default" onChange={dateChangerHandler}/>}
      <View style={{paddingLeft: 90, flexWrap:'wrap'}}>
        <TouchableOpacity onPress={()=>setEditMode(true)}>
          <TextInput editable={editMode} onFocus={onFocusHandler} onEndEditing={onEndEditingHandler} style={{fontFamily: 'UhBeeSeulvely', textAlign: 'center', marginLeft: -15, fontSize: 14, padding:3, borderRadius: 5,width:screenWidth *0.76}} multiline value={myMessage} onChangeText={text=>setMyMessage(text)}/>
        </TouchableOpacity>
      </View>
      <View style={{marginBottom: 30, marginRight: 20, alignItems: 'flex-end'}}>
        <TouchableOpacity onPress={()=>setShowTimeChanger(true)}>
          <Text style={{fontSize:10, color: '#AAA'}}>{props.message.createdAt.format('LT')}</Text>
        </TouchableOpacity>
      </View>
      {showTimeChanger && <DateTimePicker testID="DiaryTimePicker" value={props.message.createdAt.toDate()} mode={'time'} is24Hour={true} display="default" onChange={timeChangerHandler}/>}
    </View>
  );
}
function LastDiaryTextWithDate(props){// 마지막 다이어리만위 위해 만들었음, 나중에 통합 필요
  // 옵션 셋팅 변수
  const showYear = props.options.first || !props.options.sameYear;
  const showDate = props.options.first || !props.options.sameDate;
  const last = props.options.last;
  const title = props.title;
  const [myMessage, setMyMessage] = useState(props.message.text); // 표시되는 메시지
  const [editMode, setEditMode] = useState(true);                 // 편집모드 확인
  let handler = props.handler;                                    // 우상단 기능 구현함수
  let minusHandler = props.minusHandler;                          // 마지막 항목의 크기를 측정해감
  const [saveLastMessage, setSaveLastMessage] = useState('');     // 초기 메시지 저장 & 변경 확인용

  // 시간 및 날짜 편집용 변수
  const [showTimeChanger, setShowTimeChanger] = useState(false);
  const [showDateChanger, setShowDateChanger] = useState(false);

  const timeChangerHandler = (event, selectedDate) => {
    setShowTimeChanger(false);
    if(event.type === 'dismissed') return Alert.alert('취소하였습니다.');

    props.message.createdAt = Moment(selectedDate);
    props.diarySort();
  }
  const dateChangerHandler = (event, selectedDate) => {
    setShowDateChanger(false);
    if(event.type === 'dismissed') return Alert.alert('취소하였습니다.');

    props.message.createdAt = Moment(selectedDate);
    props.diarySort();
  }


  const onFocusHandler = () => {
    props.nav.setOptions({
      headerTitle: '내 기록편집',
      headerTitleAlign: 'center',
      headerRight: (props) => (
        <TouchableOpacity onPress={onEndEditingHandler}>
          <Text style={{fontSize:20, marginRight: 20, justifyContent: 'center'}}>완료</Text>
        </TouchableOpacity>
      )
    });
  };
  const onEndEditingHandler = () => { // 글쓰기 끝냄 처리
    setEditMode(false);
    //console.log('myMessage\n', myMessage);
    if(myMessage === ''){
      props.data.diary.diarymessageList.splice(props.diaryId, 1);
      props.diarySort();
    }else if(props.message.islagacy){
      // 연동 아님
      if(saveLastMessage != myMessage){
        //console.log('연동중 다름 발생! ', saveLastMessage, myMessage);
        props.message.text = myMessage;
      }
    }else {
      if(saveLastMessage != myMessage){
        //console.log('비 연동중 다름 발생! ', saveLastMessage, myMessage);
        props.message.islagacy = true;
        props.message.text = myMessage;
      }
    }

    props.nav.setOptions({
      headerTitle: title,
      headerTitleAlign: 'left',
      headerRight: (props) => (
        <TouchableOpacity onPress={handler}>
          <Image source={downArrow} style={{width:30, height:30, marginRight:20}}/>
        </TouchableOpacity>
      )
    });
    setTimeout(()=>{
      setEditMode(true);
    }, 500);
  };

  useEffect(() => {
    if(!props.message.islagacy){
      // 연동중
      let sumMessage = '';
      props.message.linkedMessageList.forEach(message => {
        if(sumMessage === '') sumMessage = message.text;
        else sumMessage += ' ' + message.text;
      })
      setMyMessage(sumMessage);
      setSaveLastMessage(sumMessage);
    }else{
      setSaveLastMessage(props.message.text);
    }
  }, []);




  return (
    <View onLayout={(event) => {
        var {x, y, width, height} = event.nativeEvent.layout;
        if(last) minusHandler(y);
    }}>
      {showYear && <DiaryYear year={props.message.createdAt.format('YYYY')} />}
      {showDate && <DiaryDate date={props.message.createdAt.format('MMDD')} onPressHandler={() => setShowDateChanger(true)} />}
      {showDateChanger && <DateTimePicker testID="DiaryDatePicker" value={props.message.createdAt.toDate()} mode={'date'}  display="default" onChange={dateChangerHandler}/>}
      <View style={{paddingLeft: 90, flexWrap:'wrap'}}>
        <TouchableOpacity onPress={()=>setEditMode(true)}>
          <TextInput editable={editMode} onFocus={onFocusHandler} onEndEditing={onEndEditingHandler} style={{fontFamily: 'UhBeeSeulvely', textAlign: 'center', marginLeft: -15, fontSize: 14, padding:3, borderRadius: 5,width:screenWidth *0.76}} multiline value={myMessage} onChangeText={text=>setMyMessage(text)}/>
        </TouchableOpacity>
      </View>
      <View style={{marginBottom: 30, marginRight: 20, alignItems: 'flex-end'}}>
        <TouchableOpacity onPress={()=>setShowTimeChanger(true)}>
          <Text style={{fontSize:10, color: '#AAA'}}>{props.message.createdAt.format('LT')}</Text>
        </TouchableOpacity>
      </View>
      {showTimeChanger && <DateTimePicker testID="DiaryTimePicker" value={props.message.createdAt.toDate()} mode={'time'} is24Hour={true} display="default" onChange={timeChangerHandler}/>}
    </View>
  );
}
export function DynamicDiaryScreen({navigation, route}){ // 다이어리 생성 화면
  const id = route.params.id;
  //let data = dataList[id-1];
  let data = dataList[dataList.findIndex(obj => obj.id===id)];
  let time = false;
  let lastDate = data.diary.diarymessageList.length>0 ? data.diary.diarymessageList[data.diary.diarymessageList.length-1].createdAt : null;
  let goToEnd = route.params.goToEnd;
  let thisScrollView;

  const [showDropbox, setShowDropbox] = useState(false);      // 다이어리 공유 옵션 바
  const [showTime, setShowTime] = useState(false);                  // 시간 선택 표시창
  const [numberOfMessage, setNumberOfMessage] = useState(data.diary.diarymessageList.length);
  const [contentHeight, setContentHeight] = useState(10000);
  const [minusPos, setMinusPos] = useState(0);
  const [updated, setUpdated] = useState(0);

  const diaryOptionBlurHandler = () => {
      setShowDropbox(false);
      navigation.setOptions({
        headerTitle: data.product.title,
        headerRight: (props) => (
          <TouchableOpacity onPress={diaryOptionFocusHandler}>
            <Image source={downArrow} style={{width:30, height:30, marginRight:20}}/>
          </TouchableOpacity>
        )
      });
  };
  const diaryOptionFocusHandler = () => {
      setShowDropbox(true);
      console.log('diaryOptionFocusHandler');
      navigation.setOptions({
        headerRight: (props) => (
          <TouchableOpacity onPress={diaryOptionBlurHandler}>
            <Image source={downArrow} style={{width:30, height:30, marginRight:20}}/>
          </TouchableOpacity>
        )
      });
  };
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: data.product.title,
      headerRight: (props) => (
        <TouchableOpacity onPress={diaryOptionFocusHandler}>
          <Image source={downArrow} style={{width:30, height:30, marginRight:20}}/>
        </TouchableOpacity>
      )
    });
  }, [navigation, route]);

  const getMinusContentPositionHandler = (value) => {
    if(value != minusPos) setMinusPos(value);
    //console.log('setMinusPos: ', minusPos);
  }

  const diarySort = () => {
    //console.log('sorting -------------------------------------- ');
    diarySortByDate(data.diary.diarymessageList);
    lastDate = data.diary.diarymessageList.length>0 ? data.diary.diarymessageList[data.diary.diarymessageList.length-1].createdAt : null;
    //console.log('lastDate: ', lastDate.format('LL'));
    //setUpdated(updated+1);
    setNumberOfMessage(data.diary.diarymessageList.length);
    //navigation.navigate('Diary', {id:id});
  }


  //console.log('diary state \n', data.diary.diarymessageList);

  return (
    <View style={{flex:1, flexDirection: 'column', backgroundColor: 'white'}}>
      {numberOfMessage === 0
        ? <NoDataInDiary/>
        : <KeyboardAvoidingView behavior={'height'}>
          <ScrollView ref={ref=>{thisScrollView = ref}} onLayout={()=>{goToEnd && thisScrollView.scrollToEnd({animated: true}); goToEnd = null;}} onContentSizeChange={(contentWidth, contentHeight)=>setContentHeight(contentHeight)}>
            <View style={{position: 'absolute', flex:1, flexDirection: 'column', left: 54, top:32, width: 1, borderRadius: 1, backgroundColor: '#DDD', height: minusPos-15<40?40:minusPos-15}}/>
            {data.diary.diarymessageList.map((message, i)=>{
                let options = {first: false, last: false, sameDate: false, sameYear: false};

                if(i===0) {
                  options.first = true;
                  time = message.createdAt;
                }
                if(time.isSameOrAfter(message.createdAt, 'year')) {
                  options.sameYear = true;
                } else {
                  time = message.createdAt;
                }
                if(options.sameYear && time.isSameOrAfter(message.createdAt, 'day')) {
                  options.sameDate = true;
                } else {
                  time = message.createdAt;
                }
                if(message.createdAt.isSameOrAfter(lastDate, 'day') && !options.sameDate) {
                  options.last = true;
                  //console.log('last Message: ', message.text);
                  return <LastDiaryTextWithDate data={data} diaryId={i} diarySort={diarySort} options={options} key={i.toString()}  nav={navigation} id={id} message={message} title={data.product.title} handler={diaryOptionFocusHandler} minusHandler={getMinusContentPositionHandler}/>;
                }

                return <DiaryTextWithDate data={data} diaryId={i} diarySort={diarySort} options={options} key={i.toString()}  nav={navigation} id={id} message={message} title={data.product.title} handler={diaryOptionFocusHandler} minusHandler={getMinusContentPositionHandler}/>;
              })
            }
            <View style={{height: 160}}/>
        </ScrollView>
        </KeyboardAvoidingView>
      }
      {showDropbox && <MyDropList handler={diaryOptionBlurHandler}/>}
      {showTime && <DateTimePicker />}
    </View>
  );
}

export function DraggableDiary({id, changePosHandler, nav, updateDiary, cancelDrag}){ // 애니메이션 다이어리에 드래그 기능 추가
  const [z, setZ] = useState(1);
  let diaryIndex = userData.myDiaryList.findIndex(obj => obj.id === id);
  let pos = diaryPosToRealPos(userData.myDiaryList[diaryIndex].pos);

  const zUp = () =>{
    if(z!=10) setZ(10);
  }
  const zDown = () =>{
    if(z!=1) setZ(1);
  }
  return (
    <Draggable x={pos.x} y={pos.y} z={z}  shouldReverse onDragRelease={(event, gestureState) => {zDown();  changePosHandler(userData.myDiaryList[diaryIndex].pos, realPosToDiaryPos({x:gestureState.moveX, y:global_y+gestureState.moveY})); cancelDrag(true)}} onDrag={(event)=>{zUp(); cancelDrag(false);}} >
      <AnimatableDiaryComponent id={id} nav={nav} updateDiary={updateDiary}/>
    </Draggable>
  );
}
export function BasiceDiary({id, changePosHandler, nav}){  // 기본 다이어리에 위치를 잡아줌, 드래그 기능은 없음
  const [z, setZ] = useState(1);
  let diaryIndex = userData.myDiaryList.findIndex(obj => obj.id === id);
  let pos = diaryPosToRealPos(userData.myDiaryList[diaryIndex].pos);

  const zUp = () =>{
    if(z!=2) setZ(2);
  }
  const zDown = () =>{
    if(z!=1) setZ(1);
  }
  return (
    <Draggable x={pos.x} y={pos.y} z={z} disabled={true} shouldReverse onDragRelease={(event, gestureState) => {zDown();  changePosHandler(userData.myDiaryList[diaryIndex].pos, realPosToDiaryPos({x:gestureState.moveX, y:global_y+gestureState.moveY}));}} onDrag={(event, gestureState)=>{zUp(); console.log('x, y ~~ : ', gestureState.moveX, global_y+gestureState.moveY); console.log('pos: ', realPosToDiaryPos({x:gestureState.moveX, y:global_y+gestureState.moveY}))}} >
      <DiaryComponent id={id} nav={nav}/>
    </Draggable>
  );
}