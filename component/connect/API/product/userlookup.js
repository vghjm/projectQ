import React from "react";
import ApiConnect from "../apiTemplate";
import { SUBSCRIBE_LOOKUP } from "../URL";
import Moment from 'moment';

function requestDataHandler(param){
  return {
    jwt: param.userToken
  }
}

function responseDataHandler(responseData){
  return responseData.subscribed.map(subscribe => {
    return {
      p_id: subscribe.p_ID,
      s_id: subscribe.d_ID,
      pushStartTime: Moment('20200812 ' + subscribe.chatstart_time),
      pushEndTime: Moment('20200812 ' + subscribe.chatend_time)
    };
  });
}

export default async function userlookup(param){
  return await ApiConnect({
    method: "POST",
    url: SUBSCRIBE_LOOKUP,
    data: requestDataHandler(param),
    responseDataHandler: responseData => responseDataHandler(responseData)
  })
}
