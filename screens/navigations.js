import NavigationService from '../NavigationService';

import React, {Component} from 'react';
import {Headline} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import {Platform, StyleSheet, Text, View} from 'react-native';

import IconWithBadge from '../components/IconWithBadge';
import IconWithBadgeMsg from '../components/IconWithBadgeMsg';

import {
  createAppContainer,
  SafeAreaView,
  createSwitchNavigator,
  createDrawerNavigator,
} from 'react-navigation';

import {createStackNavigator} from 'react-navigation-stack';
import {createBottomTabNavigator} from 'react-navigation-tabs';
// import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';

import Dummy from './dummy';

import Login from './AuthLogin';
import Register from './AuthRegister';
import RegisterUser from './AuthRegisterUser';
import RegisterHost from './AuthRegisterHost';

import {Colors} from './Styles';

const defaultNavigationOptions = {
  headerBackTitle: ' ',
  headerBackImage: (
    <MIcon size={20} name={'arrow-back'} style={{color: 'black'}} />
  ),
};

const LoginStack = createStackNavigator(
  {
    Login: {
      screen: Login,
      navigationOptions: {
        header: null,
      },
    },
    Register: {
      screen: Register,
      navigationOptions: {
        headerForceInset: true,
        title: '',
      },
    },
    RegisterUser: {
      screen: RegisterUser,
      navigationOptions: {
        headerForceInset: true,
        title: '',
      },
    },
    RegisterHost: {
      screen: RegisterHost,
      navigationOptions: {
        headerForceInset: true,
        title: '',
      },
    },
  },
  {
    initialRouteName: 'Login',
    defaultNavigationOptions,
  },
);

import HostProfile from './HostProfile';

const HostProfileStack = createSwitchNavigator(
  {
    HostProfile: {
      screen: HostProfile,
      navigationOptions: {
        header: null,
      },
    },
  },
  {
    initialRouteName: 'HostProfile',
  },
);

import UserProfile from './UserProfile';

const UserProfileStack = createSwitchNavigator(
  {
    UserProfile: {
      screen: UserProfile,
      navigationOptions: {
        header: null,
      },
    },
  },
  {
    initialRouteName: 'UserProfile',
  },
);

import RoomSearch from './RoomSearch';
// import RoomList from "./RoomList";
import RoomDetails from './RoomDetails';
import RoomTimeSlots from './RoomTimeSlots';
import RoomBookingConfirm from './RoomBookingConfirm';

const BookingStack = createStackNavigator(
  {
    RoomSearch: {
      screen: RoomSearch,
      navigationOptions: () => ({
        header: null,
      }),
    },
    OptionScreen: {
      screen: OptionScreen,
      navigationOptions: () => ({
        header: null,
      }),
    },
    // RoomList: {
    //   screen: RoomList,
    //   navigationOptions: () => ({
    //     title: "結果",
    //     headerForceInset: true
    //   })
    // },
    RoomDetails: {
      screen: RoomDetails,
      navigationOptions: () => ({
        headerTransparent: true,
        title: '',
        headerForceInset: true,
      }),
    },
    RoomTimeSlots: {
      screen: RoomTimeSlots,
      navigationOptions: () => ({
        headerTransparent: true,
        title: '',
        headerForceInset: true,
      }),
    },
    RoomBookingConfirm: {
      screen: RoomBookingConfirm,
      navigationOptions: () => ({
        title: '',
        headerForceInset: true,
      }),
    },
  },
  {
    initialRouteName: 'RoomSearch',
    defaultNavigationOptions,
  },
);

import HostRoomList from './HostRoomList';
import HostRoomDetails from './HostRoomDetails';
// import HostRoomEditDetails from './HostRoomEditDetails';
import CreateRoomAddRoom from './CreateRoomAddRoom';
import CreateRoomAddPhoto from './CreateRoomAddPhoto';
import CreateRoomSetOpeningHours from './CreateRoomSetOpeningHours';
import CreateRoomAddFacility from './CreateRoomAddFacility';
import CreateRoomAddSellingPoint from './CreateRoomAddSellingPoint';
import CreateRoomSetMapMarker from './CreateRoomSetMapMarker';
import CreateRoomSetAvailableTime from './CreateRoomSetAvailableTime';
import CreateRoomConfirm from './CreateRoomConfirm';
import OptionScreen from './OptionScreen';

const HostRoomListStack = createStackNavigator(
  {
    OptionScreen: {
      screen: OptionScreen,
      navigationOptions: () => ({
        header: null,
      }),
    },
    HostRoomList: {
      screen: HostRoomList,
      navigationOptions: {
        header: null,
      },
    },
    HostRoomDetails,
    CreateRoomAddRoom: {
      screen: CreateRoomAddRoom,
      navigationOptions: () => ({
        title: '新增房間',
        gesturesEnabled: false, //prevent accidental back action
        headerForceInset: true,
      }),
    },
    HostRoomEditDetails: {
      screen: CreateRoomAddRoom,
      navigationOptions: () => ({
        title: '編輯房間',
        gesturesEnabled: false, //prevent accidental back action
        headerForceInset: true,
      }),
    },
    CreateRoomAddPhoto: {
      screen: CreateRoomAddPhoto,
      navigationOptions: () => ({
        title: '選擇相片',
        gesturesEnabled: false, //prevent accidental back action
        headerForceInset: true,
      }),
    },
    CreateRoomAddFacility,
    CreateRoomSetOpeningHours: {
      screen: CreateRoomSetOpeningHours,
      navigationOptions: () => ({
        title: '開放時間',
        headerForceInset: true,
      }),
    },
    CreateRoomAddSellingPoint,
    CreateRoomSetMapMarker,
    CreateRoomSetAvailableTime,
    CreateRoomConfirm: {
      screen: CreateRoomConfirm,
      navigationOptions: () => ({
        title: '新增房間確認',
        headerForceInset: true,
      }),
    },
  },
  {
    initialRouteName: 'HostRoomList',
    defaultNavigationOptions,
  },
);

import ChatList from './ChatList';
import Chat from './Chat';

const ChatStack = createStackNavigator(
  {
    ChatList: {
      screen: ChatList,
      navigationOptions: () => ({
        header: null,
      }),
    },
    Chat: {
      screen: Chat,
      navigationOptions: screenProps => ({
        title: screenProps.navigation.getParam('title')
          ? '與' + screenProps.navigation.getParam('title') + '的對話'
          : '對話',
        // gesturesEnabled: false, //prevent accidental back action
        headerForceInset: true,
      }),
    },
  },
  {
    initialRouteName: 'ChatList',
    defaultNavigationOptions,
  },
);

import ShoppingCart from './ShoppingCart';
import ShoppingCartPay from './ShoppingCartPay';

const ShoppingCartStack = createStackNavigator(
  {
    ShoppingCart: {
      screen: ShoppingCart,
      navigationOptions: {
        header: null,
      },
    },
    ShoppingCartPay,
  },
  {
    initialRouteName: 'ShoppingCart',
    defaultNavigationOptions,
  },
);

const tabOptions = {
  tabBarOptions: {
    style: {
      borderTopColor: 'transparent',
    },
    activeTintColor: Colors.navButton,
    activeBackgroundColor: Colors.bg,
    inactiveTintColor: Colors.bg,
    inactiveBackgroundColor: Colors.navButton,
    safeAreaInset: {
      // bottom: "never"
    },
  },
  barStyle: {backgroundColor: Colors.navButton},
};

import Loading from './Loading';

const LoadingStack = createStackNavigator(
  {
    Loading: {
      screen: Loading,
      navigationOptions: () => ({
        header: null,
      }),
    },
  },
  {
    initialRouteName: 'Loading',
    defaultNavigationOptions,
  },
);

const LoadingFlow = createBottomTabNavigator(
  {
    Loading: {
      screen: LoadingStack,
      navigationOptions: {
        headerStyle: {
          headerTransparent: true,
          backgroundColor: 'red', // this will handle the cutOff at the top the
        },
        tabBarLabel: ' ',
      },
    },
  },
  {
    initialRouteName: 'Loading',
    ...tabOptions,
  },
);

import LoginRequired from './LoginRequired';

const GuestFlow = createBottomTabNavigator(
  {
    Search: getConfig(BookingStack, '搜尋', 'search'),
    ShoppingCart: getConfig(LoginRequired, '購物車', 'cart', true),
    Record: getConfig(LoginRequired, '紀錄', 'document'),
    Inbox: getConfig(LoginRequired, '收件匣', 'mail'),
    Login: getConfig(LoginStack, '登入', 'desktop'),
  },
  {
    initialRouteName: 'Search',
    ...tabOptions,
  },
);

import UserPaymentRecords from './UserPaymentRecords';

const UserFlow = createBottomTabNavigator(
  {
    Search: getConfig(BookingStack, '搜尋', 'search'),
    ShoppingCart: getConfig(ShoppingCartStack, '購物車', 'cart', true),
    Record: getConfig(UserPaymentRecords, '紀錄', 'document'),
    Inbox: getConfig(ChatStack, '收件匣', 'mail', false, true),
    Profile: getConfig(UserProfileStack, '租客資料', 'settings'),
  },
  {
    initialRouteName: 'Search',
    ...tabOptions,
  },
);

import HostPaymentRecords from './HostPaymentRecords';
import HostCalendar from './HostCalendar';

const HostFlow = createBottomTabNavigator(
  {
    Room: getConfig(HostRoomListStack, '房源', 'business'),
    Calendar: getConfig(HostCalendar, '日曆', 'calendar'),
    Record: getConfig(HostPaymentRecords, '紀錄', 'document'),
    Inbox: getConfig(ChatStack, '收件匣', 'mail', false, true),
    Profile: getConfig(HostProfileStack, '場主資料', 'settings'),
  },
  {
    initialRouteName: 'Room',
    ...tabOptions,
  },
);

function getConfig(screen, label, icon, isCart, isMsg) {
  return {
    screen,
    navigationOptions: {
      headerStyle: {
        headerTransparent: true,
        backgroundColor: 'red', // this will handle the cutOff at the top the
      },
      tabBarLabel: label,
      tabBarIcon: ({tintColor, focused}) =>
        isCart ? (
          <IconWithBadge
            size={28}
            name={
              Platform.OS === 'ios'
                ? focused
                  ? 'ios-' + icon
                  : 'ios-' + icon
                : focused
                ? 'md-' + icon
                : 'md-' + icon
            }
            color={tintColor}
            style={{color: tintColor}}
          />
        ) : isMsg ? (
          <IconWithBadgeMsg
            size={28}
            name={
              Platform.OS === 'ios'
                ? focused
                  ? 'ios-' + icon
                  : 'ios-' + icon
                : focused
                ? 'md-' + icon
                : 'md-' + icon
            }
            color={tintColor}
            style={{color: tintColor}}
          />
        ) : (
          <Icon
            size={28}
            name={
              Platform.OS === 'ios'
                ? focused
                  ? 'ios-' + icon
                  : 'ios-' + icon
                : focused
                ? 'md-' + icon
                : 'md-' + icon
            }
            style={{color: tintColor}}
          />
        ),
    },
  };
}

export const AppContainer = createAppContainer(
  createSwitchNavigator(
    {
      LoadingFlow,
      GuestFlow,
      HostFlow,
      UserFlow,
    },
    {
      initialRouteName: 'LoadingFlow',
    },
  ),
);
