import NavigationService from '../NavigationService';

import React, { useState, useEffect } from 'react';
import { useStateValue } from '../state';
import firebase from 'react-native-firebase';
import { NavigationEvents } from 'react-navigation';

import {
  View,
  FlatList,
  TextInput,
  Divider,
  TouchableHighlight,
  StyleSheet,
} from 'react-native';
import {
  Headline,
  // TextInput,
  Button,
  Snackbar,
  Card,
  Title,
  Text,
  Paragraph,
  List,
  Checkbox
} from 'react-native-paper';

// import { KeyboardAwareScrollView as ScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles, { Colors } from './Styles';
import { getChatroomsForUser, formatTimestamp } from '../utils';

const Screen = props => {

  const [unreg, setUnreg] = useState(null);

  const [{ auth, chatrooms, openChat }, dispatch] = useStateValue();

  const params = props.navigation.state.params;

  useEffect(() => {

    // getChatroomsForUser().then(list => {
    //   let ref = firebase
    //     .firestore()
    //     .collection('chatrooms')
    //     ;

    //   if (auth.isHost) {
    //     ref = ref.where('hostId', '==', auth.id)
    //   }
    //   else {
    //     ref = ref.where('userId', '==', auth.id)
    //   }
    //   let xxx = ref.onSnapshot(querySnapshot => {
    //     let data = [];
    //     let modified = [];
    //     querySnapshot.docChanges.forEach(change => {
    //       let x = change.doc.data();
    //       if (change.type === 'added') {
    //         data.push({ id: change.doc.id, ...x });
    //       } else if (change.type === 'modified') {
    //         modified.push({ id: change.doc.id, ...x });
    //       }
    //     });
    //     dispatch({
    //       type: 'chatrooms',
    //       data,
    //       modified
    //     });
    //   });
    //   dispatch({ type: 'chatroomsSubscription', data: { sub: xxx } });
    //   let ret = ref
    //     .get()
    //     .then(sp => sp.docs.map(doc => ({ id: doc.id, ...doc.data() })))
    //     .then(data => {
    //     })
    // });
    return () => {
      // console.warn('cleanup')
      dispatch({
        type: 'resetChatrooms'
      });
      // if (unreg != null) {
      //   unreg.xxx();
      // }
    }
  }, []);


  const navigateChat = (x) => {
    NavigationService.navigate('Chat', x);
  }

  return (
    <View style={styles.container}>
      <NavigationEvents
        onWillFocus={payload => {
          // console.warn('aa', openChat)

          this.setTimeout(() => {
            if (openChat.userId != null) {
              NavigationService.navigate('Chat', openChat);
            }
          }, 1000);

        }}
        onWillBlur={payload => {
          // console.warn('unreg chatlist')
          // dispatch({
          //   type: 'resetChatrooms'
          // });
          // if (unreg != null) {
          //   unreg.xxx();
          // }
        }}

      />
      <Title style={style.title}>談話</Title>
      <View style={styles.headerBar}></View>
      {/* <ScrollView> */}
      <FlatList
        initialNumToRender={0}
        data={chatrooms}
        keyExtractor={(item, index) => item.id}
        contentContainerStyle={{ paddingLeft: 10, paddingRight: 10 }}
        ItemSeparatorComponent={() => (<View style={{
          height: 1,
          backgroundColor: '#999999',
          width: "100%",
        }}></View>)}
        renderItem={({ item }) => (
          <View>
            <TouchableHighlight onPress={() => navigateChat(item)}>
              <View style={style.messageBlock}>
                <Text style={style.name}>{auth.isHost ? item.user : item.host}</Text>
                <View style={{ ...styles.row, justifyContent: 'space-between' }}>
                  {(auth.isHost ? item.hostNewMessage : item.userNewMessage) > 0 ?
                    (<View style={style.newMessage}>
                      <Text style={{ color: 'white', textAlign: 'center' }}>{(auth.isHost ? item.hostNewMessage : item.userNewMessage)}</Text>
                    </View>) : null}
                  <Text style={style.message} numberOfLines={1} ellipsizeMode="tail">{item.lastMessage}</Text>
                  <Text style={style.time}>{formatTimestamp(item.lastMessageTime)}</Text>
                </View>
              </View>
            </TouchableHighlight>
          </View>
        )} />
      {/* </ScrollView> */}
    </View>
  );
};

const style = StyleSheet.create({
  title: {
    padding: 10
  },
  messageBlock: {
    padding: 8
  },
  name: {
    fontWeight: 'bold'
  },
  newMessage: {
    borderRadius: 4,
    backgroundColor: 'red',
    width: 20
  },
  message: {
    width: '70%'

  },
  time: {

  }
});

export default Screen;
