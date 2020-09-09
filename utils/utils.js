import React from 'react';

export function isEmailValid(email){
  const emailRegex = /^(([^<>()\[\].,;:\s@"]+(\.[^<>()\[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;

  return emailRegex.test(email);
}
export function isPasswordValid(password){
  if(password.length < 6) return false;
  else return true;
}
