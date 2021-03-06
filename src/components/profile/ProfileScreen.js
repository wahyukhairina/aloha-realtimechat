import React, {Component} from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Alert,
  ImageBackground
} from 'react-native';
import styles from '../constants/styles';
import {auth, db} from '../congfig/Config';
import ImagePicker from 'react-native-image-picker';
import firebase from 'firebase';
import backGround from '../../image/bgchat.png';

export default class ProfilScreen extends Component {
  static navigationOptions = {
    title: 'Profile',
  };

  state = {
    imageSource: '',
    upload: false,
    users: [],
  };

  componentDidMount() {
    this.getDataUser();
  }

  onLogout = async () => {
    const id = auth.currentUser.uid;
    await db
      .ref('/user/' + id)
      .child('status')
      .set('offline');
    auth.signOut().then(res => console.warn('oke'));
  };

  changeImage = () => {
    const options = {
      quality: 0.7,
      allowsEditing: true,
      mediaType: 'photo',
      noData: true,
      storageOptions: {
        skipBackup: true,
        waitUntilSaved: true,
        path: 'images',
        cameraRoll: true,
      },
    };
    ImagePicker.showImagePicker(options, response => {
      if (response.error) {
        console.log(error);
      } else if (!response.didCancel) {
        this.setState(
          {
            upload: true,
            imageSource: {uri: response.uri},
          },
          this.uploadFile,
        );
      }
    });
  };

  updateUserImage = async imageUrl => {
    const id = auth.currentUser.uid;
    auth.currentUser.photo = imageUrl;
    await db
      .ref('/user/' + id)
      .child('photo')
      .set(imageUrl);
    Alert.alert('Succes', 'image changed successfull');
    this.setState({upload: false, imageSource: {uri: imageUrl}});
  };

  uploadFile = async () => {
    const file = await this.uriToBlob(this.state.imageSource.uri);
    firebase
      .storage()
      .ref(`profile/${auth.currentUser.uid}.png`)
      .put(file)
      .then(snapshot => snapshot.ref.getDownloadURL())
      .then(url => this.updateUserImage(url))
      .catch(error => {
        this.setState({
          upload: false,
          imageSource: require('../../image/user.png'),
        });
        Alert.alert('Error', 'Error on upload Image');
      });
  };

  uriToBlob = uri => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function() {
        resolve(xhr.response);
      };

      xhr.onerror = function() {
        reject(new Error('Error on upload image'));
      };

      xhr.responseType = 'blob';
      xhr.open('GET', uri, true);
      xhr.send(null);
    });
  };

  getDataUser() {
    const id = auth.currentUser.uid;
    db.ref('/user/' + id).on('value', snapshot => {
      const data = snapshot.val();
      this.setState({
        users: data,
      });
    });
  }

  render() {
    console.log('user', this.state.users)
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
        <View style={{marginVertical: 200, alignItems: 'center'}}>
          <TouchableOpacity onPress={this.changeImage}>
            {this.state.upload ? (
              <ActivityIndicator size="large" />
            ) : (
              <Image
                style={{
                  width: 150,
                  height: 150,
                  borderRadius: 100,
                  resizeMode: 'cover',
                  marginBottom: 10,
                }}
                source={this.state.imageSource === '' ? {uri: `${this.state.users.photo}`} : this.state.imageSource}
              />
            )}
          </TouchableOpacity>
          <Text style={{fontSize: 22}}>{auth.currentUser.displayName}</Text>
          <TouchableOpacity style={{marginTop:30, backgroundColor:'#eff0f2', width: 90, height: 30, justifyContent:'center', alignItems:'center', borderRadius:10}} onPress={this.onLogout}>
            <Text style={{ fontSize:18}}>Logout</Text>
          </TouchableOpacity>
        </View>
        </ImageBackground>
      </>
    );
  }
}
