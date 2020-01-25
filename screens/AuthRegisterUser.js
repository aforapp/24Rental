import NavigationService from '../NavigationService';

import React, { useState, useEffect } from 'react';
import { Alert, Platform, StyleSheet, Text, View, Divider } from 'react-native';
import {
  Title,
  Headline,
  TextInput,
  Button,
  Snackbar,
} from 'react-native-paper';
import { validateEmail, message, alert } from '../utils';
import TextInputField from '../components/TextInputField';
import { Input } from '../components/UI';
import { KeyboardAwareScrollView as ScrollView } from 'react-native-keyboard-aware-scroll-view';
import { emailErrorType, repeatPasswordErrorType } from '../constants';
import firebase from 'react-native-firebase';
import styles, { Colors } from './Styles';

const TITLE = '租客註冊';

const Screen = props => {
  const label = {
    name: '名稱',
    tel: '電話',
    email: '電郵帳號',
    password: '密碼',
    repeatPassword: '確定密碼',
  };

  const onChangeText = (name, value) => {
    let ok = true;
    if (ok) {
      setState({ ...state, [name]: value });
    }
  };

  const [state, setState] = useState({
    onChangeText: onChangeText,
    name: '',
    tel: '',
    email: '',
    password: '',
    repeatPassword: '',
    helperText: {},
  });

  const binding = {
    data: state,
    label,
    onChange: onChangeText,
  };

  const onInputChange = (n, v) => {
    setState({
      ...state,
      [n]: v,
      revealErrors: { ...state.revealErrors, [n]: false },
    });
  };
  const validate = () => {
    const helperText = {};

    //required text fields
    ['name', 'tel', 'email', 'password', 'repeatPassword'].map(name => {
      if (state[name] == null || state[name].trim() === '') {
        helperText[name] = '必須填寫';
      }
    });

    if (!validateEmail(state.email)) {
      helperText.email = '請填寫正確電郵地址';
    }

    if (state.repeatPassword !== state.password) {
      helperText.repeatPassword = '與密碼不符';
    }

    setState({ ...state, helperText });
    return Object.getOwnPropertyNames(helperText).length === 0;
  };

  const toConfirmationPage = () => {
    if (validate()) {
      NavigationService.navigate('RegisterConfirmation', {
        name: state.name,
        tel: state.tel,
        email: state.email,
        password: state.password,
        isHost: false,
      });
    }
  };

  const toHomePage = () => {
    props.navigation.navigate('RoomSearch');
  };

  const toLoginPage = () => {
    props.navigation.navigate('Login');
  };

  return (
    <ScrollView style={{ ...styles.scrollViewContent, height: '100%' }}>
      <Title style={style.title}>{TITLE}</Title>
      <View style={style.itemContainer}>
        <Input style={style.inputField} name="name" binding={binding} />
        <Input style={style.inputField} name="tel" binding={binding} />
        <Input style={style.inputField} name="email" binding={binding} />
        <Input
          style={style.inputField}
          secureTextEntry
          name="password"
          binding={binding}
        />
        <Input
          style={style.inputField}
          secureTextEntry
          name="repeatPassword"
          binding={binding}
        />
      </View>
      <View style={style.buttonsContainer}>
        <Button style={style.button} mode="outlined" onPress={toHomePage}>
          <Text style={{ ...style.buttonText, color: 'gray' }}>取消</Text>
        </Button>
        <Button
          style={style.button}
          mode="contained"
          onPress={toConfirmationPage}>
          <Text style={style.buttonText}>下一頁</Text>
        </Button>
      </View>
      <Button style={{ marginTop: 5 }} mode="text" onPress={toLoginPage}>
        <Text style={style.buttonText}>已有帳號？按此立即登入</Text>
      </Button>
    </ScrollView>
  );
};

const style = StyleSheet.create({
  title: {
    marginTop: 12,
    marginLeft: 25,
    color: Colors.title,
  },
  itemContainer: {
    marginTop: 12,
  },
  inputField: {
    backgroundColor: '#9BC4D8',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 30,
    marginTop: 40,
  },
  button: {
    width: '40%',
    height: 32,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 11,
    letterSpacing: 2,
  },
});

export default Screen;
