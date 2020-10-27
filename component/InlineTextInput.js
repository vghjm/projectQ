import { View, Text, TextInput, TouchableWithoutFeedback } from 'react-native';
import React from 'react';

function InlineTextInput(props){
  const color = {
    focus: props.theme? props.theme.light[2] : 'green',
    default: props.theme? props.theme.default : 'gray',
  };
  const title = props.title??'제목';
  const textType = props.textType??'none';
  const text = props.text??'';
  const isFocus = text===''?false:true
  const placeholder = props.placeholder??'';
  let textInputRef;

  const onPress = () => {
    textInputRef.focus();
  }

  return (
    <View style={props.style}>
      <TouchableWithoutFeedback onPress={onPress}>
        <View style={{marginHorizontal: 20, height: 70, borderWidth: 4, borderColor: isFocus?color.focus : color.default, flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start'}}>
          <Text style={{marginLeft:10, marginTop: 5, fontSize: 15}}>{title}</Text>
          <TextInput ref={ref => textInputRef = ref} placeholder={placeholder}  maxLength={16} secureTextEntry={textType==='password'?true:false} textContentType={'oneTimeCode'} style={{position:'absolute', bottom:5, left:10, right:5, borderWidth:0, fontSize:15}} value={text} onChangeText={props.onChangeText}/>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}
export default InlineTextInput;
