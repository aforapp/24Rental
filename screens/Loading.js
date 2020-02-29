import NavigationService from '../NavigationService';

import firebase from 'react-native-firebase';
import { useStateValue } from '../state';

import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
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
  Checkbox,
} from 'react-native-paper';
import { KeyboardAwareScrollView as ScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles, { Colors } from './Styles';
import { loadGetHostRooms, getChatrooms } from '../utils';

const Screen = props => {
  const [{}, dispatch] = useStateValue();

  function loginInit(isHost, id) {
    getChatrooms()
      .then(list => {
        let ref = firebase.firestore().collection('chatrooms');
        if (isHost) {
          ref = ref.where('hostId', '==', id);
        } else {
          ref = ref.where('userId', '==', id);
        }
        let xxx = ref.onSnapshot(querySnapshot => {
          let data = [];
          let modified = [];
          querySnapshot.docChanges.forEach(change => {
            let x = change.doc.data();
            if (change.type === 'added') {
              data.push({ id: change.doc.id, ...x });
            } else if (change.type === 'modified') {
              modified.push({ id: change.doc.id, ...x });
            }
          });
          dispatch({
            type: 'chatrooms',
            data,
            modified,
          });
        });
        dispatch({ type: 'chatroomsSubscription', data: { sub: xxx } });
        let ret = ref
          .get()
          .then(sp => sp.docs.map(doc => ({ id: doc.id, ...doc.data() })))
          .then(data => {})
          .catch(err => {
            console.log('Loading loginInit err: ', err);
          });
      })
      .catch(err => {
        console.log('Loading getChatrooms err: ', err);
      });
  }

  useEffect(() => {
    let user = firebase.auth().currentUser;

    if (user) {
      // console.warn(user);
      firebase
        .firestore()
        .collection('users')
        .doc(user.uid)
        .get()
        .then(doc => {
          if (doc != null && doc.exists) {
            const me = doc.data();
            dispatch({
              type: 'auth',
              data: {
                id: me.id,
                name: me.name,
                tel: me.tel,
                email: me.email,
                isHost: me.isHost,
              },
            });
            //   console.warn(me)

            loginInit(me.isHost, me.id);
            //   firebase.firestore().collection('users').doc(me.id).update({
            //     token: state.token
            //   });

            if (me.isHost) {
              loadGetHostRooms(me.id)
                .then(rooms => {
                  dispatch({
                    type: 'rooms',
                    data: rooms,
                  });
                })
                .catch(err => {
                  console.log('Loading loadGetHostRooms err: ', err);
                });

              NavigationService.navigate('HostFlow');
            } else {
              NavigationService.navigate('UserFlow');
            }
          }
        })
        .catch(e => {
          console.error(e);
        });
    } else {
      NavigationService.navigate('GuestFlow');
    }
  }, []);

  return (
    <View style={styles.container}>
      <Title>載入中</Title>
    </View>
  );
};

const style = StyleSheet.create({});

export default Screen;
