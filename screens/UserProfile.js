import NavigationService from '../NavigationService';

import React from 'react';
import { useStateValue } from '../state';

import { Alert, View, StyleSheet } from 'react-native';
import { Title, Text, Button } from 'react-native-paper';
import { logout } from '../utils';
import styles, { Colors } from './Styles';

const Screen = props => {
  const [{ auth }, dispatch] = useStateValue();

  const logoutAlert = () => {
    Alert.alert(
      '確定登出？',
      '你可以在登入頁面再次登入',
      [
        { text: '取消', style: 'cancel' },
        { text: '確定', onPress: onLogout },
      ],
      { cancelable: false },
    );
  };

  const onLogout = () => {
    logout(dispatch);
    NavigationService.navigate('GuestFlow');
  };

  return (
    <View style={styles.container}>
      <Title style={style.header}>使用者資料</Title>
      <View style={style.userInfoContainer}>
        <Text style={style.username}>{auth.name}</Text>
        <Text style={style.phone}>{'電話：' + auth.tel}</Text>
        <Text style={style.email}>{'帳號電郵：' + auth.email}</Text>
      </View>
      <Button style={style.logoutButton} mode="outlined" onPress={logoutAlert}>
        <Text style={style.buttonText}>登出</Text>
      </Button>
    </View>
  );
};

const style = StyleSheet.create({
  header: {
    marginVertical: 10,
    marginLeft: 25,
    color: Colors.main,
  },
  userInfoContainer: {
    marginTop: 20,
    marginLeft: 25,
  },
  username: {
    marginBottom: 2,
    fontSize: 22,
    letterSpacing: 8,
    color: Colors.title,
  },
  phone: {
    marginBottom: 2,
    fontSize: 12,
    color: Colors.selectedText,
  },
  email: {
    fontSize: 10,
    color: Colors.selectedText,
  },
  logoutButton: {
    marginHorizontal: 25,
    marginTop: 20,
    height: 30,
  },
  buttonText: {
    fontSize: 11,
    fontWeight: '300',
    letterSpacing: 2,
    lineHeight: 13,
  },
});
export default Screen;
