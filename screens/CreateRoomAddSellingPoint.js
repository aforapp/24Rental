import NavigationService from '../NavigationService';

import React, { Component } from 'react';
import { View } from 'react-native';
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
  Checkbox
} from 'react-native-paper';
import styles from './Styles';

class Screen extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Title>Work in progress</Title>
      </View>
    );
  }
}

export default Screen;
