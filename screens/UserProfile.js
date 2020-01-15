import NavigationService from '../NavigationService';

import React, { useState, useEffect } from 'react';
import { useStateValue } from '../state';

import { Switch, View, Modal, Platform, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Title, Headline, Text, Button } from 'react-native-paper';
import { logout } from '../utils';
import styles from './Styles';

const Screen = props => {
  const [{ auth }, dispatch] = useStateValue();
  function onLogout() {
    logout(dispatch);
    NavigationService.navigate('GuestFlow');
  }
  return (
    <View style={styles.container}>
      <Title style={styles.padding}>租客資料</Title>
      <View style={styles.headerBar}></View>
      <Text style={styles.bigName}>{auth.name}</Text>
      <View style={styles.padding}>
        <Text>{'電話：' + auth.tel}</Text>
        <Text>{'電郵帳號：' + auth.email}</Text>
      </View>
      <Button onPress={onLogout.bind(this)}>登出</Button>
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    padding: 10
  }
});
export default Screen;
