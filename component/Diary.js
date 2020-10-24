import React, {useContext, useState, useEffect} from 'react';
import { View, TouchableOpacity, Image, KeyboardAvoidingView, ScrollView, Text, TextInput, Alert, Dimensions} from 'react-native';
import Draggable from 'react-native-draggable'; // https://github.com/tongyy/react-native-draggable
import * as Animatable from 'react-native-animatable'; // https://github.com/oblador/react-native-animatable
import Moment from 'moment';
import { FontAwesome, EvilIcons }
from '@expo/vector-icons'; // https://icons.expo.fyi/
import DateTimePicker from '@react-native-community/datetimepicker'; // https://github.com/react-native-community/datetimepicker

import { ControllContext, GlobalDataContext, DiaryDataContext } from './Context';
import { diaryImgList, downArrow } from './utils/loadAssets';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

// 드래그기능 있는 다이어리
function diarySortByDate(myDiaryMessageList){
  myDiaryMessageList.sort((a, b) => {
    return a.createdAt > b.createdAt;
  });
}
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
function realPosToDiaryPos(realPos, numberOfDiary){
  let diaryPos = 0;
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
export function DraggableDiary({diary, numberOfDiary, nav, cancelDrag}){ // 애니메이션 다이어리에 드래그 기능 추가
  const { diaryScreenHeight } = useContext(GlobalDataContext);
  const { changePosHandler } = useContext(ControllContext);
  const pos = diaryPosToRealPos(diary.pos);
  const [z, setZ] = useState(1);

  const zUp = () =>{
    if(z!=10) setZ(10);
  }
  const zDown = () =>{
    if(z!=1) setZ(1);
  }

  return (
    <Draggable x={pos.x} y={pos.y} z={z}  shouldReverse
      onDragRelease={(event, gestureState) => {
        zDown();
        changePosHandler(diary.pos, realPosToDiaryPos({x:gestureState.moveX, y:diaryScreenHeight+gestureState.moveY, numberOfDiary:numberOfDiary})); cancelDrag(true)}}
      onDrag={(event)=>{zUp(); cancelDrag(false)}}
    >
      <AnimatableDiaryComponent diary={diary} nav={nav}/>
    </Draggable>
  );
}
export function BasicDiary({diary, numberOfDiary, nav, globalY}){  // 기본 다이어리에 위치를 잡아줌, 드래그 기능은 없음
  const pos = diaryPosToRealPos(diary.pos);
  const [z, setZ] = useState(1);

  const zUp = () =>{
    if(z!=2) setZ(2);
  }
  const zDown = () =>{
    if(z!=1) setZ(1);
  }

  return (
    <Draggable x={pos.x} y={pos.y} z={z} disabled={true} shouldReverse
      onDragRelease={(event, gestureState) => {
        zDown();
        changePosHandler(diary.pos, realPosToDiaryPos({x:gestureState.moveX, y:globalY+gestureState.moveY, numberOfDiary:numberOfDiary}))}}
      onDrag={zUp()}
    >
      <DiaryComponent diary={diary} nav={nav}/>
    </Draggable>
  );
}
function AnimatableDiaryComponent(props){ // 흔들리는 다이어리, 다이어리 삭제기능 있음
  const { eraseDiary } = useContext(ControllContext);
  const diary = props.diary;
  const nav = props.nav;

  const eraseDiaryAlertHandler = () => { // 다이어리 삭제할 건지 더 물어봄
    Alert.alert('정말로 '+diary.title+'을 삭제하시겠습니까?', '다이어리를 삭제하면 현재 상품에 대한 다이어리와 채팅 기록이 모두 사라지며 구독이 취소됩니다.', [{text: '취소'}, {text: '확인', onPress: () => eraseDiary(diary)}]);
  };

  return (
    <View style={{margin: 5}}>
      <Animatable.View animation='swing' iterationCount={'infinite'}>
      <View style={{margin: 20, marginBottom: 0, marginTop: 10}}>
          <View style={{position:'absolute', left:3, top:5, height: 185, width:130, backgroundColor: '#CCC', borderBottomRightRadius: 8, borderTopRightRadius: 8}}/>
          <Image style={{height: 190, width: 130}} source={diaryImgList[diary.color]} resizeMode='contain'/>
          <View>
            <Text adjustsFontSizeToFit={true} style={{width: 130, fontSize: 16,  color: 'black', fontWeight:'bold', alignSelf: 'center', marginBottom: 3, marginTop:3}}>{diary.title}</Text>
            <View style={{flexDirection: 'column', marginBottom: 5}}>
              {diary.makeTime.isSameOrAfter(Moment(), 'day')
                ? <View><Text style={{fontSize: 8, color: 'gray'}}>오늘 생성한 다이어리</Text><Text style={{fontSize: 8, color: 'gray', alignSelf: 'flex-end', paddingRight:62}}>총 {diary.totalUpdateCount}회 기록</Text></View>
                : <View><Text style={{fontSize: 8, color: 'gray'}}>{diary.makeTime.format('L')} ~ {Moment().format('L')}</Text><Text style={{fontSize: 8, color: 'gray', alignSelf: 'flex-end', paddingRight:30}}>총 {diary.totalUpdateCount}회 기록</Text></View>}
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
function DiaryComponent(props){ // 기본적인 다이어리, 다이어리 조회기능 있음
  const diary = props.diary;
  const nav = props.nav;

  return (
    <TouchableOpacity style={{margin: 20, marginBottom: 0, marginTop: 10}} onPress={() => nav.navigate('Diary', {p_id: diary.p_id, goToEnd:false})}>
      <View style={{margin: 5}}>
        <View style={{position:'absolute', left:3, top:5, height: 185, width:130, backgroundColor: '#CCC', borderBottomRightRadius: 8, borderTopRightRadius: 8}}/>
        <Image style={{height: 190, width: 130}} source={diaryImgList[diary.color]} resizeMode='contain'/>
        <View>
          <Text adjustsFontSizeToFit={true} style={{width: 130, fontSize: 16, color: 'black', fontWeight:'bold', alignSelf: 'center', marginBottom: 3, marginTop:3}}>{diary.title}</Text>
          <View style={{flexDirection: 'column', marginBottom: 5}}>
            {diary.makeTime.isSameOrAfter(Moment(), 'day')
              ? <View><Text style={{fontSize: 8, color: 'gray'}}>오늘 생성한 다이어리</Text><Text style={{fontSize: 8, color: 'gray', alignSelf: 'flex-end', paddingRight:62}}>총 {diary.totalUpdateCount}회 기록</Text></View>
              : <View><Text style={{fontSize: 8, color: 'gray'}}>{diary.makeTime.format('L')} ~ {Moment().format('L')}</Text><Text style={{fontSize: 8, color: 'gray', alignSelf: 'flex-end', paddingRight:30}}>총 {diary.totalUpdateCount}회 기록</Text></View>}
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
function defaultMessage(diaryMessage){
  if(diaryMessage.islagacy) return diaryMessage.text;
  return diaryMessage.linkedMessageList.reduce((prev, curr, i) => {
    if(i===0) return curr.text;
    else return prev + ' ' + curr.text;
  }, '');
}
function DiaryTextWithDate(props){
  // 옵션 셋팅 변수
  const showYear = props.options.first || !props.options.sameYear;
  const showDate = props.options.first || !props.options.sameDate;
  const last = props.options.last;
  const title = props.title;
  const nav = props.nav;

  const diaryMessage = props.diaryMessage;
  const changeDiaryMessage = props.changeDiaryMessage;
  const deleteDiaryMessage = props.deleteDiaryMessage;
  const originMessage = defaultMessage(diaryMessage);
  const [myMessage, setMyMessage] = useState(originMessage); // 표시되는 메시지
  const [editMode, setEditMode] = useState(true);                 // 편집모드 확인
  let handler = props.handler;                                    // 우상단 기능 구현함수
  let minusHandler = props.minusHandler;                          // 마지막 항목의 크기를 측정해감

  // 시간 및 날짜 편집용 변수
  const [showTimeChanger, setShowTimeChanger] = useState(false);
  const [showDateChanger, setShowDateChanger] = useState(false);

  useEffect(() => {
    setMyMessage(originMessage);
  }, [diaryMessage])


  const timeChangerHandler = (event, selectedDate) => {
    let newTime = Moment(selectedDate);
    setShowTimeChanger(false);
    if(event.type === 'dismissed') return Alert.alert('취소하였습니다.');
    if(newTime.isAfter(Moment())) return Alert.alert('현재 시간보다 앞으로 할 수 없습니다.', `현재시간: ${Moment().format('LL')}`);

    // 메세지 시간설정 변경
    let newDiaryMessage = { _id: diaryMessage._id, text: diaryMessage.text, createdAt: newTime, islagacy: diaryMessage.islagacy, linkedMessageList: diaryMessage.linkedMessageList};
    changeDiaryMessage(diaryMessage._id, newDiaryMessage);
  }
  const dateChangerHandler = (event, selectedDate) => {
    let newTime = Moment(selectedDate);
    setShowDateChanger(false);
    if(event.type === 'dismissed') return Alert.alert('취소하였습니다.');
    if(newTime.isAfter(Moment())) return Alert.alert('현재 시간보다 앞으로 할 수 없습니다.', `현재시간: ${Moment().format('LL')}`);

    // 메세지 시간설정 변경
    let newDiaryMessage = { _id: diaryMessage._id, text: diaryMessage.text, createdAt: newTime, islagacy: diaryMessage.islagacy, linkedMessageList: diaryMessage.linkedMessageList};
    changeDiaryMessage(diaryMessage._id, newDiaryMessage);
  }


  const onFocusHandler = () => {
    nav.setOptions({
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

    if(myMessage === ''){
      // 메세지 삭제
      deleteDiaryMessage(diaryMessage._id);
    }else if(originMessage != myMessage){
      // 메시지가 변함
      let newDiaryMessage = { _id: diaryMessage._id, text: myMessage, createdAt: diaryMessage. createdAt, islagacy: true, linkedMessageList: []};
      changeDiaryMessage(diaryMessage._id, newDiaryMessage);
    }

    nav.setOptions({
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

  return (
    <View onLayout={(event) => {
        var {x, y, width, height} = event.nativeEvent.layout;
        if(last) minusHandler(y);
    }}>
      {showYear && <DiaryYear year={diaryMessage.createdAt.format('YYYY')} />}
      {showDate && <DiaryDate date={diaryMessage.createdAt.format('MMDD')} onPressHandler={() => setShowDateChanger(true)} />}
      {showDateChanger && <DateTimePicker testID="DiaryDatePicker" value={diaryMessage.createdAt.toDate()} mode={'date'}  display="default" onChange={dateChangerHandler}/>}
      <View style={{paddingLeft: 90, flexWrap:'wrap'}}>
        <TouchableOpacity onPress={()=>setEditMode(true)}>
          <TextInput editable={editMode} onFocus={onFocusHandler} onEndEditing={onEndEditingHandler} style={{fontFamily: 'UhBeeSeulvely', textAlign: 'center', marginLeft: -15, fontSize: 14, padding:3, borderRadius: 5,width:screenWidth *0.76}} multiline value={myMessage} onChangeText={text=>setMyMessage(text)}/>
        </TouchableOpacity>
      </View>
      <View style={{marginBottom: 30, marginRight: 20, alignItems: 'flex-end'}}>
        <TouchableOpacity onPress={()=>setShowTimeChanger(true)}>
          <Text style={{fontSize:10, color: '#AAA'}}>{diaryMessage.createdAt.format('LT')}</Text>
        </TouchableOpacity>
      </View>
      {showTimeChanger && <DateTimePicker testID="DiaryTimePicker" value={diaryMessage.createdAt.toDate()} mode={'time'} is24Hour={true} display="default" onChange={timeChangerHandler}/>}
    </View>
  );
}
function LastDiaryTextWithDate(props){// 마지막 다이어리만위 위해 만들었음, 나중에 통합 필요
  // // 옵션 셋팅 변수
  // const showYear = props.options.first || !props.options.sameYear;
  // const showDate = props.options.first || !props.options.sameDate;
  // const last = props.options.last;
  // const title = props.title;
  // const [myMessage, setMyMessage] = useState(props.message.text); // 표시되는 메시지
  // const [editMode, setEditMode] = useState(true);                 // 편집모드 확인
  // let handler = props.handler;                                    // 우상단 기능 구현함수
  // let minusHandler = props.minusHandler;                          // 마지막 항목의 크기를 측정해감
  // const [saveLastMessage, setSaveLastMessage] = useState('');     // 초기 메시지 저장 & 변경 확인용
  //
  // // 시간 및 날짜 편집용 변수
  // const [showTimeChanger, setShowTimeChanger] = useState(false);
  // const [showDateChanger, setShowDateChanger] = useState(false);
  //
  // const timeChangerHandler = (event, selectedDate) => {
  //   setShowTimeChanger(false);
  //   if(event.type === 'dismissed') return Alert.alert('취소하였습니다.');
  //
  //   props.message.createdAt = Moment(selectedDate);
  //   props.diarySort();
  // }
  // const dateChangerHandler = (event, selectedDate) => {
  //   setShowDateChanger(false);
  //   if(event.type === 'dismissed') return Alert.alert('취소하였습니다.');
  //
  //   props.message.createdAt = Moment(selectedDate);
  //   props.diarySort();
  // }
  //
  // const onFocusHandler = () => {
  //   props.nav.setOptions({
  //     headerTitle: '내 기록편집',
  //     headerTitleAlign: 'center',
  //     headerRight: (props) => (
  //       <TouchableOpacity onPress={onEndEditingHandler}>
  //         <Text style={{fontSize:20, marginRight: 20, justifyContent: 'center'}}>완료</Text>
  //       </TouchableOpacity>
  //     )
  //   });
  // };
  // const onEndEditingHandler = () => { // 글쓰기 끝냄 처리
  //   setEditMode(false);
  //
  //   if(myMessage === ''){
  //     props.diary.diarymessageList.splice(props.diaryId, 1);
  //     props.diarySort();
  //   }else if(props.message.islagacy){
  //     // 연동 아님
  //     if(saveLastMessage != myMessage){
  //       props.message.text = myMessage;
  //     }
  //   }else {
  //     if(saveLastMessage != myMessage){
  //       props.message.islagacy = true;
  //       props.message.text = myMessage;
  //     }
  //   }
  //
  //   props.nav.setOptions({
  //     headerTitle: title,
  //     headerTitleAlign: 'left',
  //     headerRight: (props) => (
  //       <TouchableOpacity onPress={handler}>
  //         <Image source={downArrow} style={{width:30, height:30, marginRight:20}}/>
  //       </TouchableOpacity>
  //     )
  //   });
  //   setTimeout(()=>{
  //     setEditMode(true);
  //   }, 500);
  // };
  //
  // useEffect(() => {
  //   if(!props.message.islagacy){
  //     // 연동중
  //     let sumMessage = '';
  //     props.message.linkedMessageList.forEach(message => {
  //       if(sumMessage === '') sumMessage = message.text;
  //       else sumMessage += ' ' + message.text;
  //     })
  //     setMyMessage(sumMessage);
  //     setSaveLastMessage(sumMessage);
  //   }else{
  //     setSaveLastMessage(props.message.text);
  //   }
  // }, []);
  //
  //
  //
  //
  // return (
  //   <View onLayout={(event) => {
  //       var {x, y, width, height} = event.nativeEvent.layout;
  //       if(last) minusHandler(y);
  //   }}>
  //     {showYear && <DiaryYear year={props.message.createdAt.format('YYYY')} />}
  //     {showDate && <DiaryDate date={props.message.createdAt.format('MMDD')} onPressHandler={() => setShowDateChanger(true)} />}
  //     {showDateChanger && <DateTimePicker testID="DiaryDatePicker" value={props.message.createdAt.toDate()} mode={'date'}  display="default" onChange={dateChangerHandler}/>}
  //     <View style={{paddingLeft: 90, flexWrap:'wrap'}}>
  //       <TouchableOpacity onPress={()=>setEditMode(true)}>
  //         <TextInput editable={editMode} onFocus={onFocusHandler} onEndEditing={onEndEditingHandler} style={{fontFamily: 'UhBeeSeulvely', textAlign: 'center', marginLeft: -15, fontSize: 14, padding:3, borderRadius: 5,width:screenWidth *0.76}} multiline value={myMessage} onChangeText={text=>setMyMessage(text)}/>
  //       </TouchableOpacity>
  //     </View>
  //     <View style={{marginBottom: 30, marginRight: 20, alignItems: 'flex-end'}}>
  //       <TouchableOpacity onPress={()=>setShowTimeChanger(true)}>
  //         <Text style={{fontSize:10, color: '#AAA'}}>{props.message.createdAt.format('LT')}</Text>
  //       </TouchableOpacity>
  //     </View>
  //     {showTimeChanger && <DateTimePicker testID="DiaryTimePicker" value={props.message.createdAt.toDate()} mode={'time'} is24Hour={true} display="default" onChange={timeChangerHandler}/>}
  //   </View>
  // );
}
export function DynamicDiaryScreen({navigation, route}){ // 다이어리 생성 화면
  const p_id = route.params.p_id;
  const goToEnd = route.params.goToEnd;
  const diaryList = useContext(DiaryDataContext);
  const { changeDiaryMessage, deleteDiaryMessage } = useContext(ControllContext);
  const diary = diaryList[diaryList.findIndex(diary => diary.p_id === p_id)];
  const numberOfMessage = diary.diarymessageList.length;
  // console.log('\n\n /component/DynamicDiaryScreen\n', diary);

  let time = false; // 이전 시간 저장용 임시변수
  let thisScrollView;
  let lastDate = numberOfMessage > 0 ? diary.diarymessageList[numberOfMessage - 1].createdAt : null;

  const [showDropbox, setShowDropbox] = useState(false);      // 다이어리 공유 옵션 바
  const [showTime, setShowTime] = useState(false);                  // 시간 선택 표시창
  const [contentHeight, setContentHeight] = useState(10000);
  const [minusPos, setMinusPos] = useState(0);

  // 다이어리 옵션 해제 함수
  const diaryOptionBlurHandler = () => {
      setShowDropbox(false);
      navigation.setOptions({
        headerTitle: diary.title,
        headerRight: (props) => (
          <TouchableOpacity onPress={diaryOptionFocusHandler}>
            <Image source={downArrow} style={{width:30, height:30, marginRight:20}}/>
          </TouchableOpacity>
        )
      });
  };

  // 다이어리 옵션 클릭 함수
  const diaryOptionFocusHandler = () => {
      setShowDropbox(true);
      navigation.setOptions({
        headerRight: (props) => (
          <TouchableOpacity onPress={diaryOptionBlurHandler}>
            <Image source={downArrow} style={{width:30, height:30, marginRight:20}}/>
          </TouchableOpacity>
        )
      });
  };

  // 다이어리 생성시 제목 설정 함수
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: diary.title,
      headerRight: (props) => (
        <TouchableOpacity onPress={diaryOptionFocusHandler}>
          <Image source={downArrow} style={{width:30, height:30, marginRight:20}}/>
        </TouchableOpacity>
      )
    });
  }, []);

  // 동적으로 차이값 설정
  const getMinusContentPositionHandler = (value) => {
    if(value != minusPos) setMinusPos(value);
  }

  const changeDiaryMessageFunction = (message_id, diaryMessage) => {
    changeDiaryMessage(p_id, message_id, diaryMessage);
  }
  const deleteDiaryMessageFunction = (message_id) => {
    deleteDiaryMessage(p_id, message_id);
  }

  return (
    <View style={{flex:1, flexDirection: 'column', backgroundColor: 'white'}}>
      {numberOfMessage === 0
        ? <NoDataInDiary/>
        : <KeyboardAvoidingView behavior={'height'}>
          <ScrollView ref={ref=>{thisScrollView = ref}} onLayout={()=>{goToEnd && thisScrollView.scrollToEnd({animated: true})}} onContentSizeChange={(contentWidth, contentHeight)=>setContentHeight(contentHeight)}>
            <View style={{position: 'absolute', flex:1, flexDirection: 'column', left: 54, top:32, width: 1, borderRadius: 1, backgroundColor: '#DDD', height: minusPos-15<40?40:minusPos-15}}/>
            {diary.diarymessageList.map((diaryMessage, i)=>{
                let options = {first: false, last: false, sameDate: false, sameYear: false};

                if(i===0) {
                  options.first = true;
                  time = diaryMessage.createdAt;
                }
                if(time.isSameOrAfter(diaryMessage.createdAt, 'year')) {
                  options.sameYear = true;
                } else {
                  time = diaryMessage.createdAt;
                }
                if(options.sameYear && time.isSameOrAfter(diaryMessage.createdAt, 'day')) {
                  options.sameDate = true;
                } else {
                  time = diaryMessage.createdAt;
                }
                if(diaryMessage.createdAt.isSameOrAfter(lastDate, 'day') && !options.sameDate) {
                  options.last = true;
                  // return <DiaryTextWithDate diary={diary} diaryId={i} changeDiaryDateHandler={changeDiaryDateHandler} diarySort={diarySort} options={options} key={i.toString()}  nav={navigation} p_id={p_id} message={message} title={diary.title} handler={diaryOptionFocusHandler} minusHandler={getMinusContentPositionHandler}/>;
                }

                return <DiaryTextWithDate diaryMessage={diaryMessage} changeDiaryMessage={changeDiaryMessageFunction} deleteDiaryMessage={deleteDiaryMessageFunction}  options={options} key={i.toString()}  nav={navigation} title={diary.title} handler={diaryOptionFocusHandler} minusHandler={getMinusContentPositionHandler}/>;
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
