import NavigationService from '../NavigationService';

import React, { useState, useEffect } from 'react';
import { useStateValue } from '../state';
import firebase from 'react-native-firebase';
import { NavigationEvents } from 'react-navigation';
import {
  View,
  FlatList,
  TextInput,
  Platform,
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

import { KeyboardAwareScrollView as ScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles, { Colors } from './Styles';
import { getChats, chatToHost, chatToUser, getChatroomsForUser, formatTimestampAsTime, formatTimestampAsDate } from '../utils';

const Screen = props => {

  let scroll = null;

  // const [chats, setChats] = useState([]);
  const [message, setMessage] = useState('');
  const [room, setRoom] = useState({});

  const [{ auth, chats, currentChatroomId }, dispatch] = useStateValue();

  const [unreg, setUnreg] = useState(null);

  const params = props.navigation.state.params;
  

  loadChat = () => {
    let ref = firebase
      .firestore()
      .collection('chatrooms')
      .where('hostId', '==', params.hostId)
      .where('userId', '==', params.userId)
      .get()
      .then(sp => {
        let room = {};
        if (sp.docs.length == 0) {
          firebase
            .firestore()
            .collection('users')
            .doc(params.hostId)
            .get()
            .then(doc => {
              room.hostId = params.hostId;
              room.host = doc.data().name;

              firebase
                .firestore()
                .collection('users')
                .doc(params.userId)
                .get()
                .then(doc => {
                  room.userId = params.userId;
                  room.user = doc.data().name;
                  setRoom(room);
                });

            });
        }
        else {
          let data = sp.docs[0].data();
          room.id = sp.docs[0].id;
          room.hostId = data.hostId;
          room.userId = data.userId;
          room.host = data.host;
          room.user = data.user;
          setRoom(room);

          let side = auth.isHost ? 'hostNewMessage' : 'userNewMessage';
          firebase.firestore().collection('chatrooms').doc(sp.docs[0].id)
            .update({
            [side]: 0
          })
        }

        params.title = auth.isHost ? room.user : room.host;
        dispatch({
          type: 'currentChatroomId',
          data: room.id
        });

        dispatch({
          type: 'resetChats'
        });
        let ref = firebase
          .firestore()
          .collection('chats')
          .where('hostId', '==', params.hostId)
          .where('userId', '==', params.userId)
          .orderBy('timestamp', 'desc') //must be desc, for limiting last
          .limit(1000);
        let xxx = ref.onSnapshot(querySnapshot => {
          let data = [];
          let modified = [];
          querySnapshot.docChanges.forEach(change => {
            // console.warn(change.type, change.doc.data())
            let x = change.doc.data();
            if (change.type === 'added') {
              data.push({ id: change.doc.id, ...x, datestamp: formatTimestampAsDate(x.timestamp) });
            } else if (change.type === 'modified') {
              modified.push({ id: change.doc.id, ...x, datestamp: formatTimestampAsDate(x.timestamp) });
            }
          });
          // data = data.reverse();
          dispatch({
            type: 'chats',
            data,
            modified
          });
        });

        setUnreg({ xxx });

        let ret = ref
          .get()
          .then(sp => sp.docs.map(doc => ({ id: doc.id, ...doc.data() })))
          .then(msg => {
            dispatch({
              type: 'openChat',
              data: {}
            });
          });
      });

  }

  // let flatList1 = null;


  // useEffect(() => {
    // if (flatList1) {
    //   setTimeout(() => (flatList1.scrollToEnd()), 1000);
    // }
  // }, [chats]);


  const send = () => {
    if (message != '') {
      if (auth.isHost) {
        chatToUser(params.userId, message, dispatch);
      }
      else {
        chatToHost(params.hostId, message, dispatch);
      }
      setMessage('');
    }
  }

  // return (<View/>)
  return (
    <View style={styles.container}>
      <View style={styles.headerBar}></View>
      <NavigationEvents
        onWillFocus={payload => {
          loadChat();
        }}
        // onDidFocus={payload => console.warn('did focus',payload)}
        onWillBlur={payload => {
          dispatch({
            type: 'resetChats'
          });
          dispatch({
            type: 'currentChatroomId',
            data: null
          });
          let side = auth.isHost ? 'hostNewMessage' : 'userNewMessage';
          firebase.firestore().collection('chatrooms').doc(currentChatroomId)
            .update({
            [side]: 0
          });
          if (unreg != null) {
            unreg.xxx();
          }
        }}
      // onDidBlur={payload => console.warn('did blur',payload)}
      />
      {/* <Title>User: {room.user}</Title> */}
      <FlatList
        inverted={true}
        initialNumToRender={0}
        data={chats}
        contentContainerStyle={{ paddingLeft: 10, paddingRight: 10 }}
        ref={(ref) => { flatList1 = ref }}
        // onContentSizeChange={() => { if (flatList1) flatList1.scrollToEnd() }}
        keyExtractor={(item, index) => item.isHeader ? 'header_' + item.title : item.id}
        // ListHeaderComponent={() => (<View style={{
        //   height: 10,
        //   width: "100%",
        // }}></View>)}
        ListFooterComponent={() => (<View style={{
          height: 10,
          width: "100%",
        }}></View>)}
        ItemSeparatorComponent={() => (<View style={{
          height: 1,
          width: "100%",
        }}></View>)}
        renderItem={({ item }) => (
          item.isHeader ? (<View style={style.header}><Text style={style.headerText}>{item.title}</Text></View>) :
            auth.isHost ?
              (
                <View style={{ ...styles.row, justifyContent: 'space-between' }}>
                  {item.hostId == item.byId ? (<View />) : (
                    <View style={style.block}>
                      {/* <Text>{item.userId == item.byId ? room.user : room.host}</Text> */}
                      <Text style={style.message}>{item.message}</Text>
                      <Text style={style.timestamp1}>{formatTimestampAsTime(item.timestamp)}</Text>
                    </View>)
                  }
                  {item.userId == item.byId ? (<View />) : (
                    <View style={style.block}>
                      <Text style={style.message}>{item.message}</Text>
                      <Text style={style.timestamp2}>{formatTimestampAsTime(item.timestamp)}</Text>
                    </View>)
                  }
                </View>
              )
              :
              (<View style={{ ...styles.row, justifyContent: 'space-between' }}>
                {item.userId == item.byId ? (<View />) : (
                  <View style={style.block}>
                    {/* <Text>{item.hostId == item.byId ? room.host : room.user}</Text> */}
                    <Text style={style.message}>{item.message}</Text>
                    <Text style={style.timestamp1}>{formatTimestampAsTime(item.timestamp)}</Text>
                  </View>)
                }
                {item.hostId == item.byId ? (<View />) : (
                  <View style={style.block}>
                    <Text style={style.message}>{item.message}</Text>
                    <Text style={style.timestamp2}>{formatTimestampAsTime(item.timestamp)}</Text>

                  </View>)
                }
              </View>)

        )}
      />
      <View style={styles.row}>
        <TextInput
          style={{ width: '80%', height: 40, borderColor: 'gray', borderWidth: 1, padding: 8 }}
          onChangeText={(text) => setMessage(text)}
          // onFocus={() => setTimeout(() => { if (flatList1) flatList1.scrollToEnd() }, 500)}
          value={message} />
        <Button
          onPress={() => send()}
          mode="contained"
          style={{
            color: 'white',
            backgroundColor: '#225599',
            width: '20%',
            // marginLeft: '30%'
          }}
        >
          發送
      </Button>
      </View>

    </View>
  );
};

const style = StyleSheet.create({
  header: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.main,
    justifyContent: 'center',
    marginLeft: '30%',
    marginRight: '30%',
    backgroundColor: Colors.main
  },
  headerText: {
    color: Colors.bg,
    textAlign: 'center',
    padding: 8
  },
  block: {
    maxWidth: '80%',
    padding: 8,
    borderRadius: 10,
    margin: 4,
    borderWidth: 1,
    borderColor: Colors.main
  },
  message: {

  },
  timestamp1: {
    fontSize: 10,
    color: '#111111'
  },
  timestamp2: {
    fontSize: 10,
    textAlign: 'right',
    color: '#111111'
  }
});

export default Screen;
