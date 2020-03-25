import React, { Component } from 'react'
import { View, Text, TextInput, TouchableOpacity, Dimensions, ImageBackground } from 'react-native'
import styles from '../constants/styles'
import { db,auth, time } from '../congfig/Config'
import { FlatList, ScrollView } from 'react-native-gesture-handler'
import Icon from 'react-native-vector-icons/Feather'
import backGround from '../../image/chat.png'

export default class ChatScreen extends Component {
    static navigationOptions = ({ navigation }) => {
        const id = navigation.getParam('uid')
        return {
            headerTitle: (<TouchableOpacity onPress={()=> navigation.navigate('Friend', id)}><Text>{navigation.getParam('name', null)}</Text></TouchableOpacity>),
   
        }
    }

    constructor(props){
        super(props);
        this.state = {
            name: props.navigation.getParam('name'),
            uid: props.navigation.getParam('uid'),
            textMessage: '',
            messageList: '',   
        }
       
    }

    componentDidMount(){
        db.ref('/messages/').child(`/${auth.currentUser.uid}/`).child(`/${this.state.uid}/`)
            .on('child_added', (value) => {
                this.setState((prevState) => {
                    return {
                        messageList: [...prevState.messageList, value.val()]
                    }
                })
            })
    }


    sendMessage = async () => {
        if(this.state.textMessage.length > 0) {
            let msgId = (await db.ref('/messages/').child(`/${auth.currentUser.uid}/`).child(`/${this.state.uid}/`).push()).key
            let updates = {}
            let message = {
                message: this.state.textMessage,
                time: time,
                from: auth.currentUser.uid
            }
            updates['messages/' + auth.currentUser.uid +'/' + this.state.uid + '/' + msgId] = message
            updates['messages/' + this.state.uid +'/' + auth.currentUser.uid + '/' + msgId] = message
            db.ref().update(updates);
            this.setState({ textMessage: ''})

        }
    }


    handleChange= key => val => {
        this.setState({ [key] : val })
    }

    convertTime = (time) => {
        let d = new Date(time);
        let c = new Date();
        let result = (d.getHours() < 10 ? '0' : '' ) + d.getHours() + ':';
        result += (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();
        if(c.getDay() !== d.getDay()) {
            result = d.getDay() + '' + d.getMonth() + '' + result;
        } 
        return result
    }

renderRow = ({item}) => {
    console.disableYellowBox = true;
    return (
        <View style = {{
            flexDirection: 'row',
            width: '60%',
            alignSelf: item.from === auth.currentUser.uid ? 'flex-end' : 'flex-start',
            backgroundColor: item.from === auth.currentUser.uid ? 'rgba(255, 145, 77, 0.6)' : 'rgba(239, 226, 213, 0.9)',
            borderRadius: 5,
            marginBottom: 10
        }}>
            <Text style={{color: 'black', padding: 7, fontSize: 16}}>
            {item.message}
            </Text>
            <Text style={{color: 'grey', padding: 13, fontSize: 12, marginHorizontal: 70}}>
            {this.convertTime(item.time)}
            </Text>
        </View>
    )
}

    render () {
        let { height, width } = Dimensions.get('window')
        return (
            <> 
             <ImageBackground source={backGround} style={{ flex: 1,
          width: null,
          height: null,
          justifyContent: 'center',
          alignItems: 'center'}}>
           <View>
               <ScrollView>
            <FlatList
                style={{padding: 10, height: height * 0.8}}
                data = { this.state.messageList}
                renderItem = { this.renderRow }
                keyExtractor = {(item, index) => index.toString()}
            />
            </ScrollView>
            <View style={{flexDirection: 'row',alignItems: 'center', marginHorizontal:10}}>
               <TextInput 
                ref={ref => this.FlatList}
                style={styles.inputmessage}
                value={this.state.textMessage}
                placeholder="Type message..."
                onChangeText={ this.handleChange('textMessage')}
               />

            <TouchableOpacity onPress={this.sendMessage} style={styles.btnSend}>
                <Icon name='send' size={20} style={{color:'white', marginRight: 10, marginBottom: 15}} />
            </TouchableOpacity>
            </View>
            </View>
            </ImageBackground>
            </>
        )
    }
} 