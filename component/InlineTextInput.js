import {View, Text, TextInput} from 'react-native';
import React, {useState} from 'react';

function InlineTextInputForm(props){
  const color = {
    focus: props.theme? props.theme.light[2] : 'green',
    default: props.theme? props.theme.default : 'gray',
  };
  const title = props.title??'제목';
  const textType = props.textType??'none';
  const [text, setText] = useState(props.text??'');
  const [isFocus, setIsFocus] = useState(text===''?false:true);

  const onTextChangeHandler = (changedText) => {
    if(changedText !== text) setText(changedText);
    if(changedText === ''){
      // focus off
      if(isFocus) setIsFocus(false);
    }else{
      // focus on
      if(!isFocus) setIsFocus(true);
    }
  }
  //console.log(`textInput - ${title} >> ${text}`);

  return (
    <View style={props.style}>
      <View style={{marginHorizontal: 20, height: 70, borderWidth: 4, borderColor: isFocus?color.focus : color.default, flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start'}}>
        <Text style={{marginLeft:10, marginTop: 5, fontSize: 12}}>{title}</Text>
        <TextInput maxLength={14} secureTextEntry={textType==='password'?true:false} textContentType={textType} style={{position:'absolute', bottom:5, left:10, right:5, borderWidth:0}} value={text} onChangeText={onTextChangeHandler} onEndEditing={props.onEndEditing}/>
      </View>
    </View>
  );
}
export default InlineTextInputForm;
