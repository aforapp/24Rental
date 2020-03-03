import NavigationService from '../NavigationService';

import React, { useState, useEffect } from 'react';
import { useStateValue } from '../state';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import { Image, ImageBackground } from '../components/UI';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  Headline,
  TextInput,
  Button,
  Snackbar,
  Card,
  Title,
  Paragraph,
} from 'react-native-paper';
import { KeyboardAwareScrollView as ScrollView } from 'react-native-keyboard-aware-scroll-view';

import styles, { Colors } from './Styles';

const Screen = props => {
  const [{ auth, rooms }, dispatch] = useStateValue();

  const chooseRoom = id => {
    for (let room of rooms) {
      if (room.id == id) {
        NavigationService.navigate('HostRoomEditDetails', {
          room,
          isEdit: true,
        });
      }
    }
  };

  const createRoom = () => {
    NavigationService.navigate('CreateRoomAddRoom');
  };
  // console.log(rooms[0])
  return (
    <View style={styles.blackContainer}>
      <View style={style.headerContainer}>
        <View style={{ marginTop: 5 }}>
          <Text style={{ ...styles.blackText, fontSize: 20 }}>
            你好，房主{auth.name}
          </Text>
          <Text style={style.navBarTitle}>歡迎新增和管理您提供的房源</Text>
        </View>
        <Button style={style.createRoomButton} onPress={createRoom}>
          <Icon name="ios-add-circle-outline" size={35} color={Colors.main} />
        </Button>
      </View>

      {rooms.length ? (
        <FlatList
          initialNumToRender={0}
          data={rooms}
          keyExtractor={(room, index) => room.id}
          // ItemSeparatorComponent={() => (
          //   <View
          //     style={{
          //       height: 20,
          //       backgroundColor: 'black',
          //       width: '100%',
          //     }}></View>
          // )}
          renderItem={({ item, index }) => (
            <View>
              <ImageBackground
                source={{ url: item.photos[0] }}
                style={{ width: '100%', height: 244 }}
                onPress={chooseRoom.bind(this, item.id)}>
                <View style={style.roomText}>
                  <Text style={style.roomName}>{item.name}</Text>
                  <Text style={style.address}>{item.address || '--'}</Text>
                  <Text style={style.time}>時間：--</Text>
                </View>
              </ImageBackground>
            </View>
          )}
        />
      ) : (
        <View style={style.emptyListContainer}>
          <Text style={style.emptyListDescription}>你還未增設任何場地</Text>
          <Button
            style={style.emptyListButton}
            mode="contained"
            onPress={createRoom}>
            <Text style={style.emptyListButtonText}>新增場地</Text>
          </Button>
        </View>
      )}
    </View>
  );
};

const style = StyleSheet.create({
  headerContainer: {
    marginLeft: 30,
    marginTop: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  createRoomButton: {
    marginRight: 5,
  },
  navBarTitle: {
    color: Colors.secondaryButton,
    fontSize: 11,
    marginTop: 5,
    marginLeft: 2,
  },
  roomText: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    position: 'relative',
    marginTop: 150,
    height: 76,
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 8,
    paddingBottom: 8,
  },
  roomName: {
    fontSize: 18,
    paddingBottom: 2,
  },
  address: {
    fontSize: 12,
    paddingBottom: 2,
    color: '#707070',
  },
  time: {
    paddingTop: 1,
    fontSize: 10,
  },
  emptyListContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  emptyListDescription: {
    marginBottom: 25,
    fontSize: 18,
    fontWeight: '400',
    color: '#9BC4D8',
  },
  emptyListButton: {
    width: 145,
    height: 32,
    borderRadius: 5,
  },
  emptyListButtonText: {
    fontSize: 12,
    lineHeight: 15,
    letterSpacing: 2,
  },
});

export default Screen;
