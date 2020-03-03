import NavigationService from '../NavigationService';

import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import {
  Headline,
  TextInput,
  Button,
  Snackbar,
  Card,
  Title,
  Text,
  Paragraph,
  List,
  Checkbox,
} from 'react-native-paper';
import { KeyboardAwareScrollView as ScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Colors } from './Styles';
import styles from './Styles';

const Screen = props => {
  let title;
  const navKey = props.navigation.state.key;
  switch (navKey) {
    case 'ShoppingCart':
      title = '購物車';
      break;
    case 'Record':
      title = '記錄';
      break;
    case 'Inbox':
      title = '收件匣';
      break;
    default:
      title = '請先登入';
  }

  return (
    <View style={styles.container}>
      <Title style={style.title}>{title}</Title>
      <View style={style.innerContainer}>
        <Text style={style.description}>
          請登入或立即註冊{'\n'}來使用各種服務
        </Text>
        <Button
          style={style.button}
          mode="contained"
          onPress={() => NavigationService.navigate('Login')}>
          登入
        </Button>
        <Button
          style={{ ...style.button, backgroundColor: Colors.secondaryButton }}
          mode="contained"
          onPress={() => NavigationService.navigate('Register')}>
          註冊
        </Button>
      </View>
    </View>
  );
};

const style = StyleSheet.create({
  title: {
    marginTop: 12,
    marginLeft: 25,
    color: Colors.title,
  },
  innerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: Colors.text,
    marginBottom: 15,
  },
  button: {
    marginVertical: 8,
    width: '35%',
    borderRadius: 5,
  },
});

export default Screen;
