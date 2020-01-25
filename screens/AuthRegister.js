import NavigationService from '../NavigationService';
import React from 'react';
import { Alert, Platform, StyleSheet, Text, View, Divider } from 'react-native';
import { Button, Title } from 'react-native-paper';
import { validateEmail } from '../utils';
import TextInputField from '../components/TextInputField';
import { emailErrorType, repeatPasswordErrorType } from '../constants';
import styles, { Colors } from './Styles';

const Screen = props => {
  const go = which => {
    NavigationService.navigate(which);
  };

  return (
    <View style={styles.container}>
      <Title style={style.title}>註冊</Title>
      <Text style={style.subtitle}>請選擇註冊類型為：</Text>
      <View style={style.buttonContainer}>
        <Button
          mode="contained"
          style={{ ...style.button, backgroundColor: '#9BC4D8' }}
          onPress={go.bind(this, 'RegisterUser')}>
          <Text style={style.buttonText}>成為租客</Text>
        </Button>
        <View style={style.buttonDescriptionContainer}>
          <Text style={style.buttonDescription}>
            可成為消費方預約各種不同類別的空間作練習或其他用途。{'\n'}
            功能包括搜尋、預訂、消費記錄、聊天室等。
          </Text>
        </View>
      </View>
      <View style={style.buttonContainer}>
        <Button
          mode="contained"
          style={{ ...style.button, backgroundColor: Colors.button }}
          onPress={go.bind(this, 'RegisterHost')}>
          <Text style={style.buttonText}>成為場主</Text>
        </Button>
        <View style={style.buttonDescriptionContainer}>
          <Text style={style.buttonDescription}>
            可成為主辦方提供各種不同類別的空間作練習或其他用途。{'\n'}
            功能包括搜尋、日曆、客人預約記錄、聊天室等。
          </Text>
        </View>
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
  subtitle: {
    marginTop: 40,
    marginBottom: 5,
    fontSize: 18,
    textAlign: 'center',
    color: '#9BC4D8',
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  button: {
    width: '80%',
    height: 55,
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 37,
    letterSpacing: 3,
  },
  buttonDescriptionContainer: {
    alignItems: 'center',
    marginTop: 15,
    width: '80%',
  },
  buttonDescription: {
    fontSize: 11,
    lineHeight: 15,
    color: 'gray',
    textAlign: 'center',
  },
});

export default Screen;
