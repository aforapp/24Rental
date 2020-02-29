import NavigationService from '../NavigationService';

import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Title, Button } from 'react-native-paper';
import { validateEmail, message, alert } from '../utils';
import { KeyboardAwareScrollView as ScrollView } from 'react-native-keyboard-aware-scroll-view';
import firebase from 'react-native-firebase';
import styles, { Colors } from './Styles';

const TITLE = '註冊';
const HOST_REG_SUCCESS_MSG = '場主註冊成功！';
const USER_REG_SUCCESS_MSG = '租客註冊成功！';

const Screen = props => {
  const { name, tel, email, password, isHost } = props.navigation.state.params;

  const label = {
    name: '名稱',
    tel: '電話',
    email: '電郵帳號',
    password: '密碼',
  };

  const register = () => {
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(function(x) {
        firebase
          .firestore()
          .collection('users')
          .doc(x.user.uid)
          .set({
            id: x.user.uid,
            name: name,
            tel: tel,
            email: email,
            isHost,
            createTime: firebase.firestore.FieldValue.serverTimestamp(),
          });
        firebase
          .auth()
          .signOut()
          .then(() => {
            message(isHost ? HOST_REG_SUCCESS_MSG : USER_REG_SUCCESS_MSG);
            NavigationService.navigate('Login');
          })
          .catch(err => {
            console.log('AuthRegisterConfirmation registererr: ', err);
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

  const toHomePage = () => {
    props.navigation.navigate('RoomSearch');
  };

  const toLoginPage = () => {
    props.navigation.navigate('Login');
  };

  return (
    <ScrollView style={{ ...styles.scrollViewContent, height: '100%' }}>
      <Title style={style.title}>{TITLE}</Title>
      <View style={style.accountInfoContainer}>
        <Text style={style.accountInfoText}>
          <Text style={style.accountInfoLabel}>{label.name}</Text> : {name}
        </Text>
        <Text style={style.accountInfoText}>
          <Text style={style.accountInfoLabel}>{label.tel}</Text> : {tel}
        </Text>
        <Text style={style.accountInfoText}>
          <Text style={style.accountInfoLabel}>{label.email}</Text> : {email}
        </Text>
        <Text style={style.accountInfoText}>
          <Text style={style.accountInfoLabel}>{label.password}</Text> :{' '}
          {Array(password.length + 1).join('•')}
        </Text>
      </View>
      <View style={style.confirmationTextContainer}>
        <Text style={style.confirmationText}>
          請確認資料正確，{'\n'}並按下確定以完成註冊
        </Text>
      </View>
      <View style={style.buttonsContainer}>
        <Button style={style.button} mode="outlined" onPress={toHomePage}>
          <Text style={{ ...style.buttonText, color: 'gray' }}>取消</Text>
        </Button>
        <Button style={style.button} mode="contained" onPress={register}>
          <Text style={style.buttonText}>確定</Text>
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
  accountInfoContainer: {
    marginTop: 20,
    marginLeft: 37,
    borderLeftWidth: 1,
    borderColor: 'lightgray',
  },
  accountInfoText: {
    marginLeft: 8,
    lineHeight: 25,
    letterSpacing: 2,
  },
  accountInfoLabel: {
    color: '#9BC4D8',
  },
  confirmationTextContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 220,
  },
  confirmationText: {
    fontSize: 18,
    textAlign: 'center',
    color: Colors.title,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 30,
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
