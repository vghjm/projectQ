import React from "react";
import ApiConnect from "../apiTemplate";
import { MAKE_LINK } from "../URL";

function requestDataHandler(param){
  return {
    jwt: param.userToken,
    d_ID: param.d_id,
    pdfType: param.pdfType
  }
}

function responseDataHandler(responseData){
  return {
    link: responseData.link_address??null,
    html: responseData.html_code??null
  };
}

export default async function makelink(param){
  return await ApiConnect({
    method: "POST",
    url: MAKE_LINK,
    data: requestDataHandler(param),
    responseDataHandler: responseData => responseDataHandler(responseData)
  })
}
