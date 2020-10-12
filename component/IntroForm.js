import React, {useContext} from 'react';
import {ImageBackground, TouchableOpacity, Text, StyleSheet, View} from 'react-native';
import {NavigationContainer, useFocusEffect} from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import {ThemeContext, AuthContext} from './Context';

import { introImage1, introImage2, introImage3 } from './utils/loadAssets';

const Tab = createMaterialTopTabNavigator();
const styles = StyleSheet.create({
  backgroundImg: {
    flex: 1,
    flexDirection: 'column',
    resizeMode: 'cover',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  skipButton: {
    marginTop: 20,
    marginRight: 20,
  },
});

function IntroScreen1() {
  const { introSkip } = useContext(AuthContext);

  return (
    <ImageBackground source={introImage1} style={styles.backgroundImg}>
      <TouchableOpacity style={styles.skipButton} onPress={introSkip}>
        <Text style={{fontSize: 24, marginRight: 20, color: 'blue', marginTop: 20}}>[Skip]</Text>
      </TouchableOpacity>
    </ImageBackground>
  );
}
function IntroScreen2() {
  const { introSkip } = useContext(AuthContext);

  return (
    <ImageBackground source={introImage2} style={styles.backgroundImg}>
      <TouchableOpacity style={styles.skipButton} onPress={introSkip}>
        <Text style={{fontSize: 24, marginRight: 20, color: 'blue', marginTop: 20}}>[Skip]</Text>
      </TouchableOpacity>
    </ImageBackground>
  );
}
function IntroScreen3() {
  const { introSkip } = useContext(AuthContext);

  return (
    <ImageBackground source={introImage3} style={{resizeMode: 'cover', flex:1, flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'flex-end'}}>
      <TouchableOpacity onPress={introSkip}>
        <Text style={{fontSize: 24, color: 'blue', marginRight: 40, marginBottom: 40}}>[가입하기]</Text>
      </TouchableOpacity>
    </ImageBackground>
  );
}
function IntroScreen4() {
  const { introSkip } = useContext(AuthContext);

  useFocusEffect(introSkip, []);

  return (
    <View style={{backgroundColor: 'white'}}/>
  );
}


export default function IntroNavigation(){
  return (
    <NavigationContainer>
      <Tab.Navigator backBehavior={null} tabBarOptions={{
        tabStyle: {backgroundColor: '#FFF', height: 0},
        showIcon: false,
        showLabel: false,
      }}>
        <Tab.Screen name="Intro1" component={IntroScreen1} />
        <Tab.Screen name="Intro2" component={IntroScreen2} />
        <Tab.Screen name="Intro3" component={IntroScreen3} />
        <Tab.Screen name="Intro4" component={IntroScreen4} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
