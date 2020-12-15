import React from "react";
import Connection from "../../apiTemplate";
import {MAKE_LINK} from "../../URL";

export default async function makeLink({token, d_ID, pdfType}){
  const reply = {ok: false, data: null, message: ''};
  const response = await Connection("POST", MAKE_LINK, {
    jwt: token,
    d_ID: d_ID,
    pdfType: pdfType
  });

  if(response.ok){
    reply.ok = true;
    reply.data = {linkname: response.data.link_address??null, htmls: response.data.htmls??null};
  }else{
    reply.message = response.message;
  }

  return reply;
}
