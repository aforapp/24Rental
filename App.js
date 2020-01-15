/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { useEffect } from 'react';
import { Platform, Text,   KeyboardAvoidingView,
  View } from 'react-native';
import {
  DefaultTheme,
  Provider as PaperProvider,
  Headline,
  TextInput,
  Button,
  HelperText,
  Snackbar
} from 'react-native-paper';
import {
  createAppContainer,
  SafeAreaView,
  createSwitchNavigator
} from 'react-navigation';
import {
  RectButton,
  NativeViewGestureHandler
} from 'react-native-gesture-handler';
// import { Assets as StackAssets } from 'react-navigation-stack';

import NavigationService from './NavigationService';
import firebase from 'react-native-firebase';
import { AppContainer } from './screens/navigations';
import styles, {Colors} from './screens/Styles';
import { StateProvider } from './state';
import Geolocation from '@react-native-community/geolocation';
navigator.geolocation = require('@react-native-community/geolocation');

console.disableYellowBox = true;

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: Colors.main,
    accent: Colors.main
  }
};

const App = props => {
  return (
    <KeyboardAvoidingView style={{flex: 1}} behavior={Platform.OS === "ios" ? "padding" : null} enabled>
    <StateProvider>
      <SafeAreaView style={styles.safeArea}>
        <PaperProvider theme={theme}>
          <AppContainer
            ref={navigatorRef => {
              NavigationService.setTopLevelNavigator(navigatorRef);
            }}
          />
        </PaperProvider>
      </SafeAreaView>
    </StateProvider>
    </KeyboardAvoidingView>
  );
};

export default App;
