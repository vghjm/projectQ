import React, {useContext} from 'react';
import {ImageBackground, TouchableOpacity, Text, StyleSheet, View} from 'react-native';
import {NavigationContainer, useFocusEffect} from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import {ThemeContext} from './context/ThemeContext';
import {AuthContext} from './context/AuthContext';

const introImage1 = {uri: "https://cdn.crowdpic.net/detail-thumb/thumb_d_F78FC0AA8923C441588C382B19DF0BF8.jpg"};
const introImage2 = {uri: "https://previews.123rf.com/images/romeolu/romeolu1601/romeolu160100122/50594417-%EB%88%88-%EB%B0%B0%EA%B2%BD.jpg"};
const introImage3 = {uri: "https://previews.123rf.com/images/kittikornphongok/kittikornphongok1505/kittikornphongok150501184/40020410-%EB%8B%A4%EC%B1%84%EB%A1%9C%EC%9A%B4-%EC%88%98%EC%B1%84%ED%99%94%EC%9E%85%EB%8B%88%EB%8B%A4-%EA%B7%B8%EB%9F%B0-%EC%A7%80-%EC%A7%88%EA%B0%90-%EB%B0%B0%EA%B2%BD%EC%9E%85%EB%8B%88%EB%8B%A4-%EB%B6%80%EB%93%9C%EB%9F%AC%EC%9A%B4-%EB%B0%B0%EA%B2%BD%EC%9E%85%EB%8B%88%EB%8B%A4-.jpg"};

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
