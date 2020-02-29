import NavigationService from '../NavigationService';

import React, { useState, useEffect } from 'react';
import { useStateValue } from '../state';
import { Alert, Platform, View, StyleSheet } from 'react-native';
import { Image } from '../components/UI';
import { Title, Headline, Button, Text } from 'react-native-paper';
import TextInputField from '../components/TextInputField';
import firebase from 'react-native-firebase';
import ImageResizer from 'react-native-image-resizer';
import { KeyboardAwareScrollView as ScrollView } from 'react-native-keyboard-aware-scroll-view';

import { notifyRoomCreate, loadGetHostRooms, padZero } from '../utils';
import styles, { Colors } from './Styles';

function formatDate(d) {
  return (
    d.getFullYear() +
    '-' +
    padZero(d.getMonth() + 1) +
    '-' +
    padZero(d.getDate())
  );
}

const Screen = props => {
  // console.log('c', props.navigation.state.params.isEdit)
  const [state, setState] = useState({
    ...props.navigation.state.params,
    inProgress: false,
  });

  const [{ auth, rooms }, dispatch] = useStateValue();

  useEffect(() => {}, []);

  function onConfirm() {
    if (state.inProgress) {
      return;
    }

    setState({ ...state, inProgress: true });

    let roomRef = firebase
      .firestore()
      .collection('rooms')
      .doc(state.isEdit ? state.id : null);

    let data = {
      id: roomRef.id,
      createdBy: auth.id,
      type: state.type,
      district: state.district,
      name: state.name,
      area: state.area,
      pricePerHour: state.pricePerHour,
      address: state.address,
      contactNumber: state.contactNumber,
      location: state.location,
      description: state.description,
      rules: state.rules,
      facilities: state.facilities,
      openingHours: state.openingHours,
      photos: [null, null, null, null, null],
      modifyTime: firebase.firestore.FieldValue.serverTimestamp(),
    };

    if (!state.isEdit) {
      data.createTime = firebase.firestore.FieldValue.serverTimestamp();
    }
    // console.log('a', state.isEdit)

    const lastAction = () => {
      let action;
      if (!state.isEdit) {
        action = roomRef.set(data);
      } else {
        action = roomRef.update(data);
      }
      action
        .then(() => {
          notifyRoomCreate(roomRef.id)
            .then(x => {
              if (x.msg != true) {
                Alert.alert('發生錯誤');
              }
            })
            .catch(err => {
              console.log('CreateRoomConfirm lastAction err: ', err);
            });
          loadGetHostRooms(auth.id)
            .then(datarooms => {
              dispatch({
                type: 'rooms',
                data: datarooms,
              });
              // console.log('b', state.isEdit)
              Alert.alert(state.isEdit ? '編輯房間完成!' : '新增房間完成!');
              NavigationService.navigate('HostRoomList');
            })
            .catch(err => {
              setState({ ...state, inProgress: false });
              Alert.alert('發生錯誤');
            });
        })
        .catch(err => {
          console.log('CreateRoomConfirm lastAction err: ', err);
        });
    };

    let needUpload = 0;
    for (let i = 1; i <= 5; i++) {
      const key = 'photo' + i;
      if (state[key] != null && state[key].substring(0, 4) != 'http') {
        needUpload++;

        ImageResizer.createResizedImage(
          state[key],
          1024,
          1024,
          'PNG',
          100,
          0,
          null,
        )
          .then(res => {
            const imageRef = firebase
              .storage()
              .ref('roomdata')
              .child(roomRef.id + '/' + key);

            imageRef
              .putFile(
                Platform.OS === 'ios'
                  ? res.uri.replace('file://', '')
                  : res.uri.state[key],
              )
              .then(() => {
                return imageRef.getDownloadURL();
              })
              .then(url => {
                data.photos[i - 1] = url;
                needUpload--;

                if (needUpload == 0) {
                  lastAction();
                }
              })
              .catch(e => {
                Alert.alert('Error: ' + e.code);
              });
          })
          .catch(err => {
            console.log('CreateRoomConfirm createResizedImage err: ', err);
          });
      } else {
        data.photos[i - 1] = state[key];
      }
    }
    if (needUpload == 0) {
      lastAction();
    }
  }
  return (
    <View style="styles.container">
      <ScrollView>
        <View style={styles.headerBar}></View>
        <View style={{ flexDirection: 'column' }}>
          <View style={style.imageGroup}>
            <Image
              key={'photo1' + state.photo1}
              source={{ uri: state.photo1 }}
              direct={true}
              style={{ width: 60, height: 60 }}
            />
            <Image
              key={'photo2' + state.photo2}
              source={{ uri: state.photo2 }}
              direct={true}
              style={{ width: 60, height: 60 }}
            />
            <Image
              key={'photo3' + state.photo3}
              source={{ uri: state.photo3 }}
              direct={true}
              style={{ width: 60, height: 60 }}
            />
            <Image
              key={'photo4' + state.photo4}
              source={{ uri: state.photo4 }}
              direct={true}
              style={{ width: 60, height: 60 }}
            />
            <Image
              key={'photo5' + state.photo5}
              source={{ uri: state.photo5 }}
              direct={true}
              style={{ width: 60, height: 60 }}
            />
          </View>

          <View style={style.infoBox}>
            <Text style={{ ...style.field }}>房間名稱</Text>
            <Text style={{ ...style.fieldText }}>{state.name}</Text>
            <Text style={{ ...style.field }}>呎數</Text>
            <Text style={{ ...style.fieldText }}>{state.area}</Text>
            <Text style={{ ...style.field }}>價錢(每小時)</Text>
            <Text style={{ ...style.fieldText }}>{state.pricePerHour}</Text>
            <Text style={{ ...style.field }}>地點</Text>
            <Text style={{ ...style.fieldText }}>{state.address}</Text>
            <Text style={{ ...style.field }}>房間簡介</Text>
            <Text style={{ ...style.fieldText }}>{state.description}</Text>
            <Text style={{ ...style.field }}>用場守則</Text>
            <Text style={{ ...style.fieldText }}>{state.rules}</Text>
            <Text style={{ ...style.field }}>設施</Text>
            <Text style={{ ...style.fieldText }}>
              {(state.facilities || []).join(',')}
            </Text>
            <Text style={{ ...style.field }}>聯絡電話</Text>
            <Text style={{ ...style.fieldText }}>{state.contactNumber}</Text>
          </View>
          <Button
            mode="contained"
            disabled={state.inProgress}
            style={{ ...style.button }}
            onPress={onConfirm.bind(this)}>
            {state.inProgress ? '處理中' : '確認'}
          </Button>
        </View>
      </ScrollView>
    </View>
  );
};

const style = StyleSheet.create({
  imageGroup: {
    flexDirection: 'row',
    height: 80,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  infoBox: {
    padding: 30,
  },
  field: {
    fontSize: 12,
    color: Colors.navButton,
    padding: 2,
  },
  fieldText: {
    fontSize: 20,
    padding: 2,
  },
  button: {
    color: 'white',
    backgroundColor: '#225599',
    width: '40%',
    marginLeft: '30%',
    marginTop: 8,
    marginBottom: 8,
    paddingBottom: 8,
  },
});

export default Screen;
