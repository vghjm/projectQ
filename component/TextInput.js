import React, { Component } from 'react';
import { TextInput } from 'react-native';

export default function UselessTextInput() {
  const [value, onChangeText] = React.useState('This is your own Text Input');

  return (
    <TextInput
      onChangeText={text => onChangeText(text)}
      value={value}
    />
  );
}
