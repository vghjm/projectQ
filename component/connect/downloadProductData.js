import React from 'react';
import * as ADDRESS from '../constant/ADDRESS';
import * as MESSAGE from '../constant/MESSAGE';
import { printStatus } from '../utils/Print';
import httpConnection from './httpConnection';
import Moment from 'moment';

async function convertProductType(serverType){

  return await serverType.map(product => {
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
      thumbnailImg: {uri: ADDRESS.FILE + product.thumbnailImg},
      logoImg: {uri: ADDRESS.FILE + product.logoImg},
      mainImg: {uri: ADDRESS.FILE + product.mainImg},
      pushType: product.pushType,
      defaultStartTime: Moment('20200812 ' + product.start_time),
      defaultEndTime: Moment('20200812 ' + product.end_time),
      questionList: myQuestList,
      ansList: myAnsList,
    }
  });
}

export default async function downloadProductData({debug=false}){
  let reply = {ok: false, data: null, message: ''};
  let response = await httpConnection(ADDRESS.PRODUCT_LOOKUP, {}, 'POST');

  if(response.ok){ // HTTP 상태 코드가 200~299일 경우
    let json = await response.json();

    if(json.res === 'fail') reply.message = MESSAGE.FAIL_ERROR;
    else if(json.res === 'noAuth') reply.message = MESSAGE.NO_AUTH_ERROR;
    else {
      reply.ok = true;
      reply.data = await convertProductType(json.products);
    }
  }else{
    reply.message = MESSAGE.NO_CONNECT_ERROR;
  }
  if(debug) printStatus('/connect/downloadProductData', reply);

  return reply;
}
