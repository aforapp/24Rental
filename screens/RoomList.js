import NavigationService from '../NavigationService';

import React from 'react';
import { View, Text } from 'react-native';
import { Image } from '../components/UI';
import { StyleSheet } from 'react-native';
import {
  Headline,
  TextInput,
  Button,
  Snackbar,
  Card,
  Title,
  Paragraph
} from 'react-native-paper';
import { validateEmail } from '../utils';
import TextInputField from '../components/TextInputField';
import { emailErrorType, repeatPasswordErrorType } from '../constants';
import { KeyboardAwareScrollView as ScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from './Styles';

export default class Screen extends React.Component {
  state = {
    rooms: []
  };
  constructor(props) {
    super(props);
  }
  UNSAFE_componentWillMount() {
    const rooms = this.props.navigation.state.params.rooms;

    this.setState({ rooms });
  }

  chooseRoom(room) {
    // console.warn(room);
    NavigationService.navigate('RoomDetails', { room });
  }

  render() {
    return (
      <View styles={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View styles={{ height: '100%' }}>
            {(this.state.rooms || []).map((room, ind) => (
              <Card key={room.id} onPress={this.chooseRoom.bind(this, room)}>
                <Card.Content>
                  <View style={{ flex: 1, flexDirection: 'row' }}>
                    <Image
                      source={{
                        url: room.photos[0] || 'img/room.png'
                      }}
                      style={{ width: 60, height: 60 }}
                    />
                    <View style={{ width: 200 }}>
                      <Text style={style.name}>{room.name}</Text>
                      <Text style={style.address}>{room.address}</Text>
                      <Text style={style.price}>
                        {'$' + room.pricePerHour}/每小時
                      </Text>
                    </View>
                  </View>
                </Card.Content>
              </Card>
            ))}
          </View>
        </ScrollView>
      </View>
    );
  }
}

const style = StyleSheet.create({
  name: {
    fontSize: 28
  },
  address: {
    fontSize: 14
  },
  price: {
    fontSize: 14
  }
});
