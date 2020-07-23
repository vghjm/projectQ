import React from 'react';
import { View, Text } from 'react-native';

export default function MainScreen() {
  return (
    <Text>Main Screen</Text>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: StatusBar.currentHeight,
  },
  backgroundImg: {
    flex: 1,
    flexDirection: 'column',
    resizeMode: 'cover',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  introText: {
    fontSize: 40,
    marginRight: 110,
    marginBottom: 80,
  },
  skipButton: {
    marginTop: 20,
    marginRight: 20,
  },
  skipButtonText: {
    fontSize: 20,
    color: 'blue',
  }
});
