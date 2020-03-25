import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import React from 'react'
import 'react-native-gesture-handler';
import HomeScreen from './src/components/home/HomeScreen'
import LoginScreen from './src/components/login/LoginScreen'
import AuthLoadingScreen from './src/components/auth/AuthLoadingScreen'
import RegisterScreen from './src/components/register/Register'
import ChatScreen from './src/components/chat/Chat'
import ProfileScreen from './src/components/profile/ProfileScreen'
import Icon from 'react-native-vector-icons/AntDesign'
import FriendProfile from './src/components/profile/FriendProfile'
import Maps from './src/components/maps/maps'

const AppStack = createStackNavigator({ 
  Home: HomeScreen,
  Chat: ChatScreen,
  Profile : ProfileScreen,
  Friend: FriendProfile
});
 
AppStack.navigationOptions = ({navigation}) => {
  let tabBarVisible = navigation.state.index === 0
  return {
    tabBarVisible
  }
}

const AuthStack = createStackNavigator({ 
  Login: LoginScreen,
  Register: RegisterScreen,
  });

  const TabNavigator = createBottomTabNavigator({
    Home: AppStack,
    Profile: ProfileScreen,
    Map : Maps
  },{
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        const { routeName } = navigation.state;
        let iconName;
        if (routeName === 'Home') {
          iconName = 'wechat'
        } else if (routeName === 'Profile') {
          iconName = 'user';
        }
        return <Icon name={iconName} size={25} color={tintColor} />;
      },
    }),
    tabBarOptions: {
      activeTintColor: 'tomato',
      inactiveTintColor: 'gray',
    },
  }
  );

export default createAppContainer(
  createSwitchNavigator(
    {
      AuthLoading: AuthLoadingScreen,
      App: TabNavigator,
      Auth: AuthStack,
    },
    {
      initialRouteName: 'AuthLoading',
    }
  )
);
