import React from "react";
import ApiConnect from "../apiTemplate";
import { PRODUCT_LOOKUP, FILE } from "../URL";
import Moment from 'moment';

function requestDataHandler(param){
  return null;
}

function responseDataHandler(responseData){
  return responseData.products.map(product => {
    let myQuestList = [];
    let myAnsList = [];

    product.question.forEach((questObj, i) => {
      if(i%2 === 0){
        myQuestList.push({q_ID: questObj.q_ID, content: questObj.content});
      }else{
        myAnsList.push({q_ID: questObj.q_ID, content: questObj.content});
      }
    });

    return {
      p_id: product.p_ID, isAvailable: true,
      title: product.p_name, text: product.p_intro,
      thumbnailImg: {uri: FILE + product.img_logo},
      logoImg: {uri: FILE + product.img_background},
      mainImg: {uri: FILE + product.img_explain},
      pushType: product.pushType,
      defaultStartTime: Moment('20200812 ' + product.start_time),
      defaultEndTime: Moment('20200812 ' + product.end_time),
      questionList: myQuestList,
      ansList: myAnsList,
    }
  });
}

export default async function lookup(param){
  return await ApiConnect({
    method: "GET",
    url: PRODUCT_LOOKUP,
    data: requestDataHandler(param),
    responseDataHandler: responseData => responseDataHandler(responseData)
  })
}
