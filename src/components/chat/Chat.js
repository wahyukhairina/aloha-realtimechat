import React, {Component} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Dimensions,
  KeyboardAvoidingView,
  ImageBackground,
  Animated,
  Platform,
  Alert,
  Keyboard,
} from 'react-native';
import styles from '../constants/styles';
import {db, auth, time} from '../congfig/Config';
import {FlatList, ScrollView} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Feather';
import backGround from '../../image/chat.png';

const isIOS = Platform.OS === 'ios';
export default class ChatScreen extends Component {
  static navigationOptions = ({navigation}) => {
    const id = navigation.getParam('uid');
    const status = navigation.getParam('status');
    return {
      headerTitle: (
        <TouchableOpacity onPress={() => navigation.navigate('Friend', id)}>
          <Text style={{fontWeight: 'bold', fontSize: 18}}>
            {navigation.getParam('name', null)}
          </Text>
        </TouchableOpacity>
      ),
      headerRight: (
        <View style={{marginHorizontal: 10}}>
          <Text style={{color: status === 'online' ? 'green' : 'red'}}>
            {status}
          </Text>
        </View>
      ),
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      name: props.navigation.getParam('name'),
      uid: props.navigation.getParam('uid'),
      textMessage: '',
      messageList: '',
    };
    this.keyboardHeight = new Animated.Value(0);
    this.bottomPadding = new Animated.Value(60);
  }

  componentDidMount() {
    this.keyboardShowListener = Keyboard.addListener(
      isIOS ? 'keyboardWillShow' : 'keyboardDidShow',
      e => this.keyboardEvent(e, true),
    );
    this.keyboardShowListener = Keyboard.addListener(
      isIOS ? 'keyboardWillHide' : 'keyboardDidHide',
      e => this.keyboardEvent(e, false),
    );
    db.ref('/messages/')
      .child(`/${auth.currentUser.uid}/`)
      .child(`/${this.state.uid}/`)
      .on('child_added', value => {
        this.setState(prevState => {
          return {
            messageList: [...prevState.messageList, value.val()],
          };
        });
      });
  }

  sendMessage = async () => {
    if (this.state.textMessage.length > 0) {
      let msgId = (
        await db
          .ref('/messages/')
          .child(`/${auth.currentUser.uid}/`)
          .child(`/${this.state.uid}/`)
          .push()
      ).key;
      let updates = {};
      let message = {
        message: this.state.textMessage,
        time: time,
        from: auth.currentUser.uid,
      };
      updates[
        'messages/' + auth.currentUser.uid + '/' + this.state.uid + '/' + msgId
      ] = message;
      updates[
        'messages/' + this.state.uid + '/' + auth.currentUser.uid + '/' + msgId
      ] = message;
      db.ref().update(updates);
      this.setState({textMessage: ''});
    }
  };

  keyboardEvent = (event, isShow) => {
    Animated.parallel([
      Animated.timing(this.keyboardHeight, {
        duration: event.duration,
        toValue: isShow ? 60 : 0,
      }),
      Animated.timing(this.bottomPadding, {
        duration: event.duration,
        toValue: isShow ? 120 : 60,
      }),
    ]).start();
  };

  handleChange = key => val => {
    this.setState({[key]: val});
  };

  LongPress(item){
    console.log(item)
    Alert.alert('confirmation', 'Delete Message?')
  }

  convertTime = time => {
    let d = new Date(time);
    let c = new Date();
    let result = (d.getHours() < 10 ? '0' : '') + d.getHours() + ':';
    result += (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();
    if (c.getDay() !== d.getDay()) {
      result = d.getDay() + '' + d.getMonth() + '' + result;
    }
    return result;
  };

  renderRow = ({item}) => {
    console.disableYellowBox = true;
    return (
      <TouchableOpacity onLongPress={()=> this.LongPress(item)}>
      <View
        style={{
          flexDirection: 'row',
          width: '60%',
          alignSelf:
            item.from === auth.currentUser.uid ? 'flex-end' : 'flex-start',
          backgroundColor:
            item.from === auth.currentUser.uid
              ? 'rgba(255, 145, 77, 0.6)'
              : 'rgba(239, 226, 213, 0.9)',
          borderRadius: 5,
          marginBottom: 10,
        }}>
        <Text style={{color: 'black', padding: 7, fontSize: 16}}>
          {item.message}
        </Text>
        <Text
          style={{
            color: 'grey',
            padding: 13,
            fontSize: 12,
            marginHorizontal: 70,
          }}>
          {this.convertTime(item.time)}
        </Text>
      </View>
      </TouchableOpacity>
    );
  };

  render() {
    let {height} = Dimensions.get('window');
    console.log(this.state.messageList)
    return (
      <>
        <ImageBackground
          source={backGround}
          style={{
            flex: 1,
            width: null,
            height: null,
          }}>
          <KeyboardAvoidingView behavior="height" style={{flex: 1}}>
            <Animated.View
              style={[styles.bottomBar, {bottom: this.keyboardHeight}]}>
              <TextInput
                style={styles.inputmessage}
                value={this.state.textMessage}
                placeholder="Type message"
                onChangeText={this.handleChange('textMessage')}
              />
              <TouchableOpacity
                onPress={this.sendMessage}
                style={styles.btnSend}>
                <Icon
                  name="send"
                  size={20}
                  style={{color: 'white', marginRight: 10, marginBottom: 15}}
                />
              </TouchableOpacity>
            </Animated.View>
            <FlatList
              ref={ref => (this.flatList = ref)}
              onContentSizeChange={() =>
                this.flatList.scrollToEnd({animated: true})
              }
              onLayout={() => this.flatList.scrollToEnd({animated: true})}
              style={{padding: 10, height: height * 0.8}}
              data={this.state.messageList}
              renderItem={this.renderRow}
              keyExtractor={(item, index) => index.toString()}
              ListFooterComponent={
                <Animated.View style={{height: this.bottomPadding}} />
              }
            />
          </KeyboardAvoidingView>
        </ImageBackground>
      </>
    );
  }
}
