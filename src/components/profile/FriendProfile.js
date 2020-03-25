import React, {Component} from 'react';
import {Text, ImageBackground, Image} from 'react-native';
import {db} from '../congfig/Config';
import backGround from '../../image/bgchat.png';
import {View} from 'native-base';
import MapView from 'react-native-maps';
import styles from '../constants/styles';
import Icon from 'react-native-vector-icons/Entypo'
import { TouchableOpacity } from 'react-native-gesture-handler';

export default class FriendProfile extends Component {
  static navigationOptions = {
    headerTransparent: true,
    title: '',
  };
  state = {
    users: [],
  };
  componentDidMount() {
    this.getDetails();
  }
  getDetails() {
    const id = this.props.navigation.state.params;
    db.ref('/user/' + id).on('value', snapshot => {
      const user = snapshot.val();
      this.setState({
        users: user,
      });
    });
  }

  render() {
    return (
      <>
       <Image
            style={{width: '100%', height: '30%'}}
            source={{uri: `${this.state.users.photo}`}}
          />
        <View style={{backgroundColor: '#efefef', marginLeft: 2}}>
         

          <View>
            <Text style={{fontWeight: 'bold', color: 'grey', fontSize: 40}}>
              {this.state.users.name}
            </Text>
          </View>
          <TouchableOpacity style={styles.friend}>
              <Icon name='block' color= 'red' size={18} style={{marginLeft: 5,marginBottom: 2}} />
            <Text style={{color: 'red', fontSize: 19, height: 30, marginLeft: 5}}>Block</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.friend}>
          <Icon name='thumbs-down' color= 'red' size={20} style={{marginLeft: 5, marginBottom:-5}} />
            <Text style={{color: 'red', fontSize: 19, marginLeft: 2}}>Report Contact</Text>
          </TouchableOpacity>

          <View style={{backgroundColor: 'white'}}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: 'bold',
                color: 'grey',
                marginBottom: 5,
                marginLeft: 5
              }}>
              {this.state.users.name} 's location :
            </Text>
            <TouchableOpacity onPress={()=>this.props.navigation.navigate('FriendMap', this.state.users)}  >
            <Image
              style={{
                width: '100%',
                height: '75%',
              }}
              source={require('../../image/maps.jpeg')}
            />
            </TouchableOpacity>
          </View>
        </View>
      </>
    );
  }
}
