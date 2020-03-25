import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  StatusBar,
  LayoutAnimation,
  ScrollView,
  KeyboardAvoidingView,
  ToastAndroid,
} from 'react-native';
import { auth, db } from '../congfig/Config'
import GetLocation from 'react-native-get-location'
import backGround from '../../image/bg.png'

export default class RegisterScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props)

    this.state = {
      isVisible: false,
      name: '',
      email: '',
      password: '',
      uid: '',
      latitude: null,
      longitude: null,
      errorMessage: null,
      loading: false,
      updatesEnabled: false,
      location: []
    }
    this.handleSignUp = this.handleSignUp.bind(this);
  }

  async componentDidMount() {
    await GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
          timeout: 15000,
      })
      .then(location => {
          console.log(location);
        this.setState({
            location : location
          })
      })
      .catch(error => {
          const { code, message } = error;
          console.warn(code, message);
      })
      
    this._isMounted = true;
    
  };

  componentWillUnmount() {
    this._isMounted = false;
    
  }


  hideToast = () => {
    this.setState({
      visible: false,
    });
  };

  handleSignUp = async () => {
    const {email, name, password} = this.state;
    if (name.length < 1) {
      ToastAndroid.show('Please input your fullname', ToastAndroid.LONG);
    } else if (email.length < 6) {
      ToastAndroid.show(
        'Please input a valid email address',
        ToastAndroid.LONG,
      );
    } else if (password.length < 6) {
      ToastAndroid.show(
        'Password must be at least 6 characters',
        ToastAndroid.LONG,
      );
    } else {
      // Action
      await auth.createUserWithEmailAndPassword(email, password)
        .then(async userCredentials => {
          
          db.ref('/user/' + userCredentials.user.uid)
            .set({
              name: this.state.name,
              status: 'online',
              email: this.state.email,
              photo: "https://upload.wikimedia.org/wikipedia/commons/7/7c/User_font_awesome.svg",
              uid : userCredentials.user.uid,
              longitude : this.state.location.longitude,
              latitude : this.state.location.latitude,
            })
            .catch(error => console.log(error.message))

            console.log(userCredentials);
            ToastAndroid.show("Success", ToastAndroid.LONG)


            if(userCredentials.user) {
                userCredentials.user.updateProfile({
                  displayName: this.state.name,
                  photoURL: "http://linkphoto.com"
                }).then((s) => {
                  this.props.navigation.navigate("App")
                })
            }
          
          
        })
        .catch(error => {
          ToastAndroid.show(error.message, ToastAndroid.LONG)
        })

  }
  }

  render() {
    console.disableYellowBox = true
      return (
        <ImageBackground source={backGround} style={{ flex: 1,
          width: null,
          height: null,
          justifyContent: 'center',
          alignItems: 'center'}}>
      <View style={{width:'80%'}}>
        <StatusBar barStyle="dark-content" backgroundColor="#f4f4f4"></StatusBar>
        <ScrollView>
                   
        <Text style={styles.aloha}>ɑːˈloʊhɑː</Text>

          <View style={styles.errorMessage}>
            {this.state.errorMessage && (
              <Text style={styles.error}>{this.state.errorMessage}</Text>
            )}
          </View>

          <View style={styles.form}>
            <KeyboardAvoidingView behavior="padding" enabled>
              <View>
                  <Text style={styles.inputTitle}>Full Name</Text>
                  <TextInput
                      style={styles.input}
                      autoCapitalize="none"
                      onChangeText={name => this.setState({ name })}
                      value={this.state.name}
                  ></TextInput>
              </View>

              <View style={{ marginTop: 20 }}>
                  <Text style={styles.inputTitle}>Email Address</Text>
                  <TextInput
                      style={styles.input}
                      autoCapitalize="none"
                      onChangeText={email => this.setState({ email })}
                      value={this.state.email}
                  ></TextInput>
              </View>

              <View style={{ marginTop: 20 }}>
                  <Text style={styles.inputTitle}>Password</Text>
                  <TextInput
                      style={styles.input}
                      secureTextEntry
                      autoCapitalize="none"
                      onChangeText={password => this.setState({ password })}
                      value={this.state.password}
                  ></TextInput>
              </View>
            </KeyboardAvoidingView>  
          </View>

          <TouchableOpacity style={styles.button} onPress={this.handleSignUp}>
            <Text style={{ color: "#FFFFFF", fontWeight: "bold" }}>SIGN UP</Text>
          </TouchableOpacity>
               

          <TouchableOpacity
            style={{alignSelf: 'center', marginTop: 20, marginHorizontal: 50}}
            onPress={() => this.props.navigation.navigate('Login')}>
           <View style={{flexDirection:'row', marginLeft: 45}} >
            <Text style={{color: '#414959', fontSize: 13}}>
              Have an account?</Text>
              <Text style={{fontWeight:'bold', width: 100}}> Sign In</Text>
              </View>
          </TouchableOpacity>

        </ScrollView>
      </View>
      </ImageBackground>
    );
  }
}


const Toast = props => {
  if (props.visible) {
    ToastAndroid.showWithGravityAndOffset(
      props.message,
      ToastAndroid.LONG,
      ToastAndroid.TOP,
      1,
      800,
    );
    return null;
  }
  return null;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  greeting: {
    marginTop: 50,
    fontSize: 18,
    fontWeight: '400',
    textAlign: 'center',
    color: "#000000",
  },
  form: {
    marginBottom: 48,
    marginHorizontal: 30,
  },
  inputTitle: {
    color: '#8A8F9E',
    fontSize: 10,
    textTransform: 'uppercase',
  },
  input: {
    borderBottomColor: '#8A8F9E',
    borderBottomWidth: StyleSheet.hairlineWidth,
    height: 40,
    fontSize: 15,
    color: '#161F3D',
  },
  button: {
    marginHorizontal: 90,
    marginBottom: 10,
    backgroundColor: "#ffab5a",
    borderRadius: 10,
    height: 45,
    width: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorMessage: {
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 30,
  },
  error: {
    color: 'red',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  aloha: {
    marginTop: 0,
    fontSize: 55,
    fontWeight: 'bold',
    textAlign: 'center',
    marginHorizontal: 30,
    color: "#FFFFFF",
    backgroundColor:'#ffab5a',
    width:240,
    borderRadius: 5,
    fontFamily:'monospace'
  },
  back: {
    position: 'absolute',
    top: 48,
    left: 32,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(21, 22, 48, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});