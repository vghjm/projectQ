import React from "react";

const SUCCESS_RESPONSE_STATUS = "0000";

async function jsonFetch(method, url, data){
  return fetch(url, {
    method: method,
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify(data),
  });
}

function connectionErrorMessage(statusCode){
  switch(statusCode){
    case 400:
      return "잘못된 요청 에러";
    case 401:
      return "인증되지 않은 사용자의 접근 에러";
    case 500:
      return "데이터베이스 에러";
    default :
      return `정의되지 않은 에러, statusCode: ${statusCode}`;
  }
}

export default async function connection(method, url, data=null){
  const reply = {ok: false, data: null, message: ''};
  const response = await jsonFetch(method, url, data);

  if(response.ok){
    const json = await response.json();

    reply.message = json.status_message;
    if(json.status === SUCCESS_RESPONSE_STATUS){
      reply.ok = true;
      reply.data = json;
    }
  }else{
    reply.message = connectionErrorMessage(response.status);
  }

  return reply;
}
