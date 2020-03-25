import React, { Component } from 'react'
import { Text, View, TouchableOpacity, Dimensions, FlatList, ImageBackground } from 'react-native'
import { Container } from 'native-base'
import { db,auth } from '../congfig/Config'
import styles from '../constants/styles'
import profileImage from '../../image/user.png'
import GetLocation from 'react-native-get-location'
import backGround from '../../image/bgchat.png'

class HomeScreen extends Component {
    static navigationOptions = {
        header : null
      }
      
      state = {
          users: [],
          latitude: '',
          longtitude: '',
      }
    
     async componentDidMount () {
         const id = auth.currentUser.uid
         this.getDataUser()
        this.getLocation()
        
        
      }
    

    getLocation(){
        const id = auth.currentUser.uid
        GetLocation.getCurrentPosition({
            enableHighAccuracy: true,
                timeout: 15000,
            })
           .then(location => {
            db.ref('/user/' + id ).child("status").set('online')
            db.ref('/user/' + id ).child("latitude").set(location.latitude)
            db.ref('/user/' + id ).child("longitude").set(location.longitude)
                
            })
            .catch(error => {
                const { code, message } = error;
                console.warn(code, message);
            })
            
          this._isMounted = true;

    }
    getDataUser() {
       db.ref('/user').on('value', (snapshot) => {
           const current_user = auth.currentUser.uid
           const data = snapshot.val()
           const user = Object.values(data)
           const result = user.filter(user => user.uid !== current_user);
           this.setState({
               users : result})
       })
    }

  renderRow= ({item}) => {
      return (
          <TouchableOpacity 
          onPress={()=> this.props.navigation.navigate('Chat', item)}
          style={{padding: 10, borderBottomColor: '#ccc', borderBottomWidth:1, backgroundColor:'rgba(255, 255, 255, 0)'
          }}>
              <Text>{item.name}</Text>
          </TouchableOpacity>
      )
  }

    render(){
        const {height} = Dimensions.get('window')
        console.disableYellowBox = true;
        return (
            <>
             <ImageBackground source={backGround} style={{ flex: 1,
          width: null,
          height: null,
          justifyContent: 'center',
          alignItems: 'center'}}>
            <View style={{width: '99%', height:'100%'}}>
                <FlatList
                    style={{height}}
                    data = {this.state.users}
                    renderItem={this.renderRow} 
                    keyExtractor={(item) => {item.uid}}
                    ListHeaderComponent = {() => <Text style={{fontSize: 30, marginVertical:10, marginLeft: 10, fontWeight:'bold'}}>Chats</Text>}
                />
                
            </View>
            </ImageBackground>
            </>
        )
    }
}
export default HomeScreen
 