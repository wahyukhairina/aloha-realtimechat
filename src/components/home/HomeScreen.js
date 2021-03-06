import React, {Component} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  FlatList,
  ImageBackground,
  Image,
} from 'react-native';
import {Container} from 'native-base';
import {db, auth} from '../congfig/Config';
import styles from '../constants/styles';
import profileImage from '../../image/user.png';
import GetLocation from 'react-native-get-location';
import backGround from '../../image/bgchat.png';

class HomeScreen extends Component {
  static navigationOptions = {
    header: null,
  };

  state = {
    users: [],
  };

  componentDidMount() {
    this.getDataUser();
    this.getLocation();
  }

  async getLocation () {
    const id = auth.currentUser.uid;
    await GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 15000,
    })
      .then(location => {
        db.ref('/user/' + id)
          .child('latitude')
          .set(location.latitude);
        db.ref('/user/' + id)
          .child('longitude')
          .set(location.longitude);
      })
      .then(
        db
          .ref('/user/' + id)
          .child('status')
          .set('online'),
      )
      .catch(error => {
        const {code, message} = error;
        console.warn(code, message);
      });

    this._isMounted = true;
  }
  getDataUser() {
    db.ref('/user').on('value', snapshot => {
      const current_user = auth.currentUser.uid;
      const data = snapshot.val();
      const user = Object.values(data);
      const result = user.filter(user => user.uid !== current_user);
      this.setState({
        users: result,
      });
    });
  }

  renderRow = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => this.props.navigation.navigate('Chat', item)}
        style={{
          padding: 10,
          borderBottomColor: '#ccc',
          borderBottomWidth: 1,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <Image
          style={{borderRadius: 100, width: 50, height: 50, marginRight: 5}}
          source={{uri: `${item.photo}`}}
        /><View>
          <Text style={{fontSize: 16}}>{item.name}</Text>
          <Text style={{fontSize: 12}}>{item.status}</Text>
        </View>
        
      </TouchableOpacity>
    );
  };

  render() {
    const {height} = Dimensions.get('window');
    console.disableYellowBox = true;
    return (
      <>
        <ImageBackground
          source={backGround}
          style={{
            flex: 1,
            width: null,
            height: null,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View style={{width: '99%', height: '100%'}}>
            <FlatList
              style={{height}}
              data={this.state.users}
              renderItem={this.renderRow}
              keyExtractor={item => {
                item.uid;
              }}
              ListHeaderComponent={() => (
                <Text
                  style={{
                    fontSize: 30,
                    marginVertical: 10,
                    marginLeft: 10,
                    fontWeight: 'bold',
                  }}>
                  Chats
                </Text>
              )}
            />
          </View>
        </ImageBackground>
      </>
    );
  }
}
export default HomeScreen;
