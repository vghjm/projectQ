import React from 'react';

export const SERVER = 'http://qmoment.qmoment.tk:9000';

export const LOGIN = SERVER + '/user/login';
export const SIGNUP = SERVER + '/user/signup';
export const CHECK_EMAIL = SERVER + '/user/checkemail';
export const FIND_PW = SERVER + '/user/findpw';
export const CHANGE_PW = SERVER + '/user/changepw';
export const LOGOUT = SERVER + '/user/logout';

export const PRODUCT_LOOKUP = SERVER + '/product/lookup'; // get
export const SUBSCRIBE_LOOKUP = SERVER + '/product/userlookup';
export const DIARY_LOOKUP = SERVER + '/diary/lookup';
export const DIARY_BACKUP = SERVER + '/diary/backup';
export const DIARY_DELETE = SERVER + '/diary/delete';

export const PUSH_SET = SERVER + '/subscribe/pushsetting';
export const PUSH_TIME_SET = SERVER + '/subscribe/timesetting';

export const MAKE_LINK = SERVER + '/makelink';
export const REQUEST_CHAT_REPLY = SERVER + '/chating';
export const SET_PUSH_ALARM = SERVER + '/pushalarm';
export const SET_PUSH_TOKEN = SERVER + '/pushalarm/token';
export const RECEIVE_PUSH_SUCCESSFUL = SERVER + '/pushalarm/success';
export const CHATLOG_BACKUP = SERVER + '/pushalarm/chatLogBackup';

export const FILE = SERVER + '/files/';
