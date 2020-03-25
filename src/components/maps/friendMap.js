import React, {Component} from 'react';
import MapView from 'react-native-maps';
import {Text} from 'react-native';
export default class FriendMap extends Component {
  static navigationOptions = ({navigation}) => {
    return {
      headerTransparent: true,
      headerTitle: (
        <Text style={{fontWeight: 'bold', fontSize: 18}}>
          {navigation.getParam('name')} 's location
        </Text>
      ),
    };
  };
  state = {
    user: [],
  };

  render() {
    return (
      <>
        <MapView
          style={{flex: 1, width: window.width}} //window pake Dimensions
          region={{
            latitude: this.props.navigation.getParam('latitude'),
            longitude: this.props.navigation.getParam('longitude'),
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}>
          <MapView.Marker
            coordinate={{
              latitude: this.props.navigation.getParam('latitude'),
              longitude: this.props.navigation.getParam('longitude'),
            }}
            title={this.props.navigation.getParam('name')}
            description={this.props.navigation.getParam('status')}
          />
        </MapView>
      </>
    );
  }
}
