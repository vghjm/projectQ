import React from 'react';

export default async function httpConnection(address, data, type, timeout=4000){
  return Promise.race([
    fetch(address, {
      method: type,
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify(data),
    }),
    new Promise((n, reject) => setTimeout(() => reject(new Error('timeout')), timeout))
  ]).catch(e => console.log('\t> httpError: ', e));
};
