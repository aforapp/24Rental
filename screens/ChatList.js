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
  Checkbox,
} from 'react-native-paper';

// import { KeyboardAwareScrollView as ScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles, { Colors } from './Styles';
import { getChatroomsForUser, formatTimestamp } from '../utils';

const Screen = props => {
  const [unreg, setUnreg] = useState(null);

  const [{ auth, chatrooms, openChat }, dispatch] = useStateValue();

  const params = props.navigation.state.params;

  // useEffect(() => {
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
  // return () => {
  //   // console.warn('cleanup')
  //   dispatch({
  //     type: 'resetChatrooms',
  //   });
  // if (unreg != null) {
  //   unreg.xxx();
  // }
  //   };
  // }, [dispatch]);

  const navigateChat = x => {
    NavigationService.navigate('Chat', x);
  };

  return (
    <View style={style.container}>
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
      <Title style={style.title}>對話</Title>
      {/* <ScrollView> */}
      {chatrooms.length ? (
        <FlatList
          initialNumToRender={0}
          data={chatrooms}
          keyExtractor={(item, index) => item.id}
          ItemSeparatorComponent={() => <View style={style.messageDivider} />}
          renderItem={({ item }) => (
            <View>
              <TouchableHighlight onPress={() => navigateChat(item)}>
                <View style={style.messageBlock}>
                  <Text style={style.name}>
                    {auth.isHost ? item.user : item.host}
                  </Text>
                  <View style={style.messageGroup}>
                    <View style={style.messageContent}>
                      <Text
                        style={style.message}
                        numberOfLines={1}
                        ellipsizeMode="tail">
                        {item.lastMessage}
                      </Text>
                    </View>
                    {(auth.isHost ? item.hostNewMessage : item.userNewMessage) >
                    0 ? (
                      <View style={style.newMessageIndicator}>
                        <Text style={style.newMessageCount}>
                          {auth.isHost
                            ? item.hostNewMessage
                            : item.userNewMessage}
                        </Text>
                      </View>
                    ) : null}
                    {/* <Text style={style.timestamp}>
                      最後訊息時間{formatTimestamp(item.lastMessageTime)}
                    </Text> */}
                  </View>
                </View>
              </TouchableHighlight>
            </View>
          )}
        />
      ) : (
        <View style={styles.centerScreen}>
          <Text style={style.emptyChatText}>
            {auth.isHost
              ? '沒有對話'
              : '沒有對話\n對話框只限已訂場的場主開啟\n請到搜尋頁預訂喜愛的排舞室'}
          </Text>
        </View>
      )}
      {/* </ScrollView> */}
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    paddingTop: 10,
  },
  title: {
    color: Colors.title,
    marginLeft: 30,
    marginBottom: 8,
  },
  messageDivider: {
    height: 1.2,
    backgroundColor: 'gray',
    width: '100%',
  },
  messageBlock: {
    paddingVertical: 8,
    paddingHorizontal: 30,
    backgroundColor: Colors.bg,
  },
  messageGroup: {
    ...styles.row,
    justifyContent: 'space-between',
  },
  messageContent: {
    ...styles.row,
    justifyContent: 'flex-start',
  },
  name: {
    marginBottom: 2,
    fontSize: 16,
    letterSpacing: 2,
    color: Colors.main,
  },
  newMessageIndicator: {
    marginRight: 5,
    width: 18,
    height: 18,
    borderRadius: 100,
    backgroundColor: Colors.secondaryButton,
  },
  newMessageCount: {
    color: 'white',
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 17,
  },
  message: {
    width: '60%',
    fontSize: 11,
    color: Colors.main,
  },
  // timestamp: {
  //   fontSize: 11,
  //   letterSpacing: 1,
  //   color: Colors.main,
  // },
  emptyChatText: {
    color: '#9BC4D8',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default Screen;
