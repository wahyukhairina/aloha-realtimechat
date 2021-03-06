import React from 'react';
import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  input: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    width: '80%',
    marginBottom: 10,
    borderRadius: 5,
  },
  inputmessage: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    width: '85%',
    marginBottom: 10,
    borderRadius: 20,
  },
  btnText: {
    color: 'darkblue',
    fontSize: 20,
  },
  btnSend: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    marginLeft: 10,
    height: 40,
    width: 40,
    paddingTop: 18,
    paddingLeft: 5,
    backgroundColor: '#f19e4d',
    borderRadius: 20,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 2,
    height: 60,
  },
  friend: {
    flexDirection: 'row',
    backgroundColor:'white',
    marginBottom: 5,
    height:50,
    alignItems: 'center'
  }
});

export default styles;
