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
import styles from './Styles';

const TITLE = '註冊租客';
const BUTTON_LABEL = '註冊為租客';
const REG_SUCCESS_MSG = '租客註冊成功！';

const Screen = props => {
  const label = {
    name: '名稱',
    tel: '電話',
    email: '電郵帳號',
    password: '密碼',
    repeatPassword: '確定密碼',
  };
  const helperText = {};
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
    registering: false,
  });

  const binding = {
    data: state,
    label,
    helperText,
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
      if (state[name] == null || state[name].trim() == '') {
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

  register = () => {
    if (!validate()) return;

    firebase
      .auth()
      .createUserWithEmailAndPassword(state.email, state.password)
      .then(function(x) {
        firebase
          .firestore()
          .collection('users')
          .doc(x.user.uid)
          .set({
            id: x.user.uid,
            name: state.name,
            tel: state.tel,
            email: state.email,
            isHost: false,
            createTime: firebase.firestore.FieldValue.serverTimestamp(),
          });
        firebase
          .auth()
          .signOut()
          .then(() => {
            message(REG_SUCCESS_MSG);
            NavigationService.navigate('Login');
          });
      })
      .catch(e => {
        let msg = '不明錯誤' + e.code;
        switch (e.code) {
          case 'auth/email-already-in-use': // Thrown if there already exists an account with the given email address.
            msg = '電郵已註冊';
            break;
          case 'auth/invalid-email': // Thrown if the email address is not valid.
            msg = '電郵格式錯誤';
            break;
          case 'auth/operation-not-allowed': // Thrown if email/password accounts are not enabled. Enable email/password accounts in the Firebase Console, under the Auth tab.
            //system error, use default message
            break;
          case 'auth/weak-password': // Thrown if the password is not strong enough.
            msg = '密碼太簡單';
            break;
        }
        alert('錯誤:' + msg);
      });
  };
  toLoginPage = () => {
    props.navigation.navigate('Login');
  };

  return (
    <ScrollView style={{ ...styles.scrollViewContent, height: '100%' }}>
      <Title style={styles.title}>{TITLE}</Title>
      <View style={{ ...style.itemContainer }}>
        <Input name="name" binding={binding} />
        <Input name="tel" binding={binding} />
        <Input name="email" binding={binding} />
        <Input secureTextEntry name="password" binding={binding} />
        <Input secureTextEntry name="repeatPassword" binding={binding} />
      </View>
      <View
        style={{
          ...style.itemContainer,
          flexDirection: 'row',
          justifyContent: 'center',
          marginTop: 'auto',
        }}>
        <Button mode="contained" onPress={register} style={{ width: '40%' }}>
          {state.registering ? '註冊中' : BUTTON_LABEL}
        </Button>
      </View>
    </ScrollView>
  );
};

const style = StyleSheet.create({
  itemContainer: {
    padding: 8,
    paddingLeft: 16,
    paddingRight: 16,
  },
});

export default Screen;
