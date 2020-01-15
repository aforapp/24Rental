import NavigationService from '../NavigationService';

import React, { useState, useEffect } from 'react';
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
import { KeyboardAwareScrollView as ScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from './Styles';

const Screen = props => {
  return (
    <View style={styles.container}>
      <Title>Work in progress</Title>
    </View>
  );
};

export default Screen;
