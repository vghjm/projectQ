import React from 'react';

export function isEmailValid(email){
  // 유효한 이메일 확인
  const emailRegex = /^(([^<>()\[\].,;:\s@"]+(\.[^<>()\[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;

  return emailRegex.test(email);
}
export function isPasswordValid(password){
  // 유효 패스워드 확인
  if(password.length < 6) return false;
  else return true;
}

export function diarySortByDate(myDiaryMessageList){
  // 다이어리 메세지들을 시간순으로 정렬
  myDiaryMessageList.sort((a, b) => {
    return a.createdAt > b.createdAt;
  });
}

export function chooseRandomIndex(a){
  // 배열에서 랜덤한 인덱스 추출
  return Math.floor(Math.random() * a.length);
}
export function chooseRandomly(a){
  // 배열에서 랜덤한 항목 추출
  return a[Math.floor(Math.random() * a.length)];
}
