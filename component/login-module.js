import { StatusBar } from 'expo-status-bar';
import React, {Component} from 'react';
import { Alert, Image, StyleSheet, Platform, Text, TouchableOpacity, View, Button, TextInput} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import logo from '../assets/logo.png';
import * as ImagePicker from 'expo-image-picker';
import * as Sharing from 'expo-sharing';
const axios = require('axios');

const http = require('../config/http');

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
    };
  }

  onLogin() {
    const { username, password } = this.state;


    let params = {
      email: username,
      password: password
    };

    axios.post(http+'/user/login', params).then(
      response => {
        console.log("response:" + response);
        console.log("response_token:" + response.data.res);
      }
    ).catch(response => {console.log(response)});

  }

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          value={this.state.username}
          onChangeText={(username) => this.setState({ username })}
          placeholder={'Username'}
          style={styles.input}
        />
        <TextInput
          value={this.state.password}
          onChangeText={(password) => this.setState({ password })}
          placeholder={'Password'}
          secureTextEntry={true}
          style={styles.input}
        />

        <Button
          title={'Login'}
          style={styles.input}
          onPress={this.onLogin.bind(this)}
        />
        <Text>input username: {this.state.username}</Text>
        <Text>input password: {this.state.password}</Text>
      </View>
    );
  }
}

function HomeScreen({navigation, route}){
  React.useEffect(() => {
    if(route.params?.post){
      // Post update, do something with route.params.Post
      // for eaxmple, send the post to server
    }
  }, [route.params?.post]);

  return (
    <View style={{flex:1, alignItems:'center', justifyContent: 'center'}}>
      <Text>Home Screen!</Text>
      <Button
        title="Create Post"
        onPress={() => navigation.navigate('CreatePost')}
      />
      <Text style={{margin: 10}}>Post: {route.params?.post}</Text>
      <Button
        title="Go to details"
        onPress={() => {
          /* Navigate to the Details route with params */
          navigation.navigate('Details', {
            itemId: 86,
            otherParam: 'anything you want here',
          });
        }}
      />
    </View>
  );
}

function CreatePostScreen({navigation, route}){
  const [postText, setPostText] = React.useState('');

  return (
    <>
      <TextInput
        multiline
        placeholder="What's on your mind?"
        style={{height: 200, padding: 10, backgroundColor: 'white'}}
        value={postText}
        onChangeText={setPostText}
      />
      <Button
        title="Done"
        onPress={() => {
          navigation.navigate('Home', {post: postText});
        }}
      />
    </>
  );
}

function DetailsScreen({route, navigation}){
  /* Get the params */
  const { itemId, otherParam } = route.params;

  return (
    <View style={{flex:1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Detailed Screen</Text>
      <Text>itemID: {JSON.stringify(itemId)}</Text>
      <Text>otherParams: {JSON.stringify(otherParam)}</Text>
      <Button
        title="go myself"
        onPress={() => navigation.push('Details', {
          itemId: Math.floor(Math.random() * 100)
        })}
      />
      <Button title="go to home" onPress={() => navigation.navigate('Home')} />
      <Button title="go back" onPress={() => navigation.goBack()} />
      <Button title="go back to first" onPress={() => navigation.popToTop()} />
    </View>
  );
}

const Stack = createStackNavigator();

const screenOptions = {
  home: {
    title: 'Home Page'
  },
  detail: {
    title: 'Detail Screen',
    headerStyle: {
      backgroundColor: '#f4511e'
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold'
    }
  }
};

function App(){
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Home"  options={screenOptions.home} component={HomeScreen} />
        <Stack.Screen
          name="Details"
          component={DetailsScreen}
          options={screenOptions.detail}
          initialParams={{itemId:42, otherParam: "default"}}
        />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="CreatePost" component={CreatePostScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 305,
    height: 159,
    marginBottom: 10,
  },
  instructions: {
    color: '#888',
    fontSize: 18,
    marginHorizontal: 35,
  },
  button: {
    backgroundColor: 'blue',
    padding: 20,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 20,
    color: '#fff',
  },
  thumbnail: {
    width: 300,
    height: 300,
    resizeMode: "cover",
  },
  input: {
    width: 200,
    height: 44,
    padding: 10,
    borderWidth: 1,
    borderColor: 'black',
    marginBottom: 10,
  }
});
