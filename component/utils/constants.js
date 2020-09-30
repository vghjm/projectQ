import React from 'react';
import {Dimensions} from 'react-native';

export const HTTP = 'http://qmoment.qmoment.tk:9000';
export const PUSH_REGISTRATION_ENDPOINT = HTTP + '/pushalarm/token';
export const MESSAGE_ENPOINT = HTTP + 'pushalarm/message';
export const LOGIN = HTTP + '/user/login';
export const SIGNUP = HTTP + '/user/signup';
export const CHECKEMAIL = HTTP + '/user/checkemail';
export const FINDPW = HTTP + '/user/findpw';
export const CHANGEPW = HTTP + '/user/changepw';

export const PRODUCT_LOOKUP = HTTP + '/product/lookup';
export const SUBSCRIBE_LOOKUP = HTTP + '/product/userlookup';
export const DIARY_LOOKUP = HTTP + '/diary/lookup';
export const DIARY_BACKUP = HTTP + '/diary/backup';
export const DIARY_DELETE = HTTP + '/diary/delete';

export const PUSHSET = HTTP + '/subscribe/pushsetting';
export const TIMESET = HTTP + '/subscribe/timesetting';

export const MAKELINK = HTTP + '/makelink';
export const SETPUSHTOKEN = HTTP + '/token';
export const MESSAGE = HTTP + '/message';
export const CHATREPLY = HTTP + '/chating';

export const FILE = HTTP + '/files/';

export const HEIGHT = Dimensions.get('window').height;
export const WIDTH = Dimensions.get('window').width;
