import React from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import { auth } from '../congfig/Config'

export default class AuthLoadingScreen extends React.Component {

componentDidMount(){
  this.checkAuth()
}

async checkAuth() {
  await auth.onAuthStateChanged( user => {
  this.props.navigation.navigate(user ? 'Home' : 'Auth')
  })
}

  render() {
    return (
      <View>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}