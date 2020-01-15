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
  Paragraph
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
          isEdit: true
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
      <Title style={{...styles.blackTitle, ...styles.padding, paddingLeft: 30}}>房源</Title>
      <View style={{
          height: 20,
          backgroundColor: Colors.main,
          width: "100%",
        }}></View>
        <View style={{paddingLeft: 30,paddingRight: 0,paddingTop: 0,paddingBottom: 10, flexDirection: 'row', justifyContent: 'space-between'}}>
          <View style={{paddingTop: 8}}>
            <Text style={{...styles.blackText, fontSize: 20}}>你好，房主{auth.name}</Text>
            <Text style={{...styles.blackText, fontSize: 10, paddingTop: 8}}>歡迎新增和管理您提供的房源</Text>
          </View>
          <Button onPress={createRoom}><Icon name="ios-add-circle-outline" size={30} color="white" /></Button>
        </View>

      <FlatList
        initialNumToRender={0}
        data={rooms}
        keyExtractor={(room, index) => room.id}
        ItemSeparatorComponent={() => (<View style={{
          height: 20,
          backgroundColor: 'black',
          width: "100%",
        }}></View>)}
        renderItem={({ item, index }) => (
          <View>
            <ImageBackground source={{url: item.photos[0]}} style={{width: '100%', height: 244}}
              onPress={chooseRoom.bind(this, item.id)}>
              <View style={style.roomText}>
                <Text style={{fontSize: 18, paddingBottom: 4}}>{item.name}</Text>
                <Text style={{fontSize: 12, paddingBottom: 2, color: '#707070'}}>{item.address}</Text>
                <Text style={{fontSize: 10, paddingBottom: 2}}>時間：</Text>
              </View>
            </ImageBackground>
          </View>
        )}
      />
    </View>
  );
};

const style = StyleSheet.create({
  roomText: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    position: 'relative',
    marginTop: 150,
    height: 76,
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 8,
    paddingBottom: 8    
  }
});

export default Screen;
