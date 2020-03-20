import NavigationService from '../NavigationService';

import React from 'react';
import _ from 'lodash';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Image } from '../components/UI';
import {
  Headline,
  TextInput,
  Button,
  Snackbar,
  Card,
  Title,
  Paragraph,
} from 'react-native-paper';
import { validateEmail } from '../utils';
import TextInputField from '../components/TextInputField';
import { emailErrorType, repeatPasswordErrorType } from '../constants';
import { fbGetList } from '../utils';

export default class Screen extends React.Component {
  state = {
    room: {
      name: '',
      photos: [],
      area: '',
      address: '',
      pricePerHour: '',
      contactNumber: '',
      createdBy: '',
    },
  };

  editRoom() {
    NavigationService.navigate('CreateRoomAddRoom', {
      room: this.props.navigation.state.params.room,
      isEdit: true,
    });
  }
  constructor(props) {
    super(props);
  }
  UNSAFE_componentWillMount() {
    this.setState({ room: this.props.navigation.state.params.room });
  }

  render() {
    return (
      <View>
        <Headline>{this.state.room.name}</Headline>
        <Text>{this.state.area}</Text>
        <Text>{this.state.address}</Text>
        <Text>{this.state.pricePerHour}</Text>
        <Text>{this.state.contactNumber}</Text>
        <Text>{this.state.createdBy}</Text>
        <View
          style={{
            flexDirection: 'column',
            flexWrap: 'wrap',
            width: 300,
            height: 80,
          }}>
          {this.state.room.photos.map(url => (
            <Image source={{ url }} />
          ))}
        </View>
        <Button onPress={this.editRoom.bind(this)}>編輯房間</Button>
      </View>
    );
  }
}

const style = StyleSheet.create({
  container: {
    padding: 16,
  },
});
