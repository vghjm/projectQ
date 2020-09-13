import React from 'react';
import {AsyncStorage} from 'react-native';
import * as Permissions from 'expo-permissions';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import {FILE} from '../utils/constants';
import Moment from 'moment';
Moment.locale("ko");
import _ from 'lodash'; // https://lodash.com/docs


export async function saveProductData(data){
  let dataList = [];

  const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
  if (status !== "granted") {
      Alert.alert('파일 접근 권한을 얻을 수 없습니다.');
      loadSuccess = true;
      return loadDataFailure;
  }

  const downloadFile = async (url) =>{
    let path = url.split('/');
    let returnUri=null;
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

  await data.products.reduce( async (last, product, i) =>{
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
    let thumbnailImg = await downloadFile(FILE + product.img_logo);
    let logoImg = await downloadFile(FILE + product.img_background);
    let mainImg = await downloadFile(FILE + product.img_explain);

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
    //console.log('load product\n', productData);
    dataList.push(_.cloneDeep(productData));

    return 1;
  }, 0);

  return dataList;
}
export async function saveDiaryData(data){
  let diaryData = [];

  console.log('saveDiaryData: ', data);

  return diaryData;
}
