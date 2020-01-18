import NavigationService from '../NavigationService';

import React, {useState, useEffect} from 'react';
import {useStateValue} from '../state';
import {
  login as fbLogin,
  validateEmail,
  loadGetHostRooms,
  getChatrooms,
  message,
  alert,
} from '../utils';
import {Input} from '../components/UI';

import {Alert, Platform, StyleSheet, Text, View, Divider} from 'react-native';
import firebase from 'react-native-firebase';
import LinearGradient from 'react-native-linear-gradient';

import {
  Headline,
  TextInput,
  Button,
  HelperText,
  Snackbar,
  Title,
} from 'react-native-paper';

import {Colors} from './Styles';
import styles from './Styles';

const Screen = props => {
  const [{}, dispatch] = useStateValue();

  const label = {
    email: '電郵帳號',
    password: '密碼',
  };

  useEffect(() => {
    firebase
      .messaging()
      .getToken()
      .then(token => {
        if (token) {
          setState({...state, token});
        }
      });
  }, []);

  const helperText = {};

  const [state, setState] = useState({
    label: label,
    helperText,
    onChangeText: onChangeText,
    email: '',
    password: '',

    loggingIn: false,

    // state storing the error...
    revealErrors: {
      email: false,
      password: false,
    },
  });

  function loginInit(isHost, id) {
    getChatrooms().then(list => {
      let ref = firebase.firestore().collection('chatrooms');
      if (isHost) {
        ref = ref.where('hostId', '==', id);
      } else {
        ref = ref.where('userId', '==', id);
      }
      let unsubscribe = ref.onSnapshot(querySnapshot => {
        let data = [];
        let modified = [];
        querySnapshot.docChanges.forEach(change => {
          let x = change.doc.data();
          if (change.type === 'added') {
            data.push({id: change.doc.id, ...x});
          } else if (change.type === 'modified') {
            modified.push({id: change.doc.id, ...x});
          }
        });
        dispatch({
          type: 'chatrooms',
          data,
          modified,
        });
      });
      dispatch({type: 'chatroomsSubscription', data: {unsubscribe}});
      let ret = ref
        .get()
        .then(sp => sp.docs.map(doc => ({id: doc.id, ...doc.data()})))
        .then(data => {});
    });
  }

  function onChangeText(name, value) {
    let ok = true;
    if (name == 'area') {
      if (isNaN(value)) {
        ok = false;
      }
    }
    if (ok) {
      setState({...state, [name]: value});
    }
  }

  const binding = {
    data: state,
    label: label,
    helperText: helperText,
    onChange: onChangeText,
  };

  const getPasswordHelperText = () => {
    if (!state.password.length) {
      return '必須填寫';
    }
  };

  function getEmailHelperText() {
    if (!state.email.length) {
      return '必須填寫';
    }
    if (!validateEmail(state.email)) {
      return '請填寫正確電郵地址';
    }
  }

  const onEmailChange = (n, v) => {
    setState({
      ...state,
      email: v,
      revealErrors: {...state.revealErrors, email: false},
    });
  };
  const onPasswordChange = (n, v) => {
    setState({
      ...state,
      password: v,
      revealErrors: {...state.revealErrors, password: false},
    });
  };

  const toRegisterPage = () => {
    NavigationService.navigate('Register');
  };

  function preSubmitValidate() {
    setState({
      ...state,
      revealErrors: {
        email: true,
        password: true,
      },
    });
    return [getEmailHelperText, getPasswordHelperText].every(
      helper => !helper.bind(this)(),
    );
  }

  function getErrorMessage() {
    if (!props.loginError) return '';
    switch (props.loginError.code) {
      case 'auth/wrong-password':
        return '登入失敗，請檢查你輸入的帳號和密碼';
      default:
        // alert(props.loginError.code)
        return '登入失敗';
    }
  }

  const login = () => {
    setState({
      ...state,
      loggingIn: true,
    });
    fbLogin(state.email, state.password)
      .then(doc => {
        setState({...state, loggingIn: false});
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

          loginInit(me.isHost, me.id);
          // console.warn(state.token);
          firebase
            .firestore()
            .collection('users')
            .doc(me.id)
            .update({
              token: state.token,
            });

          message('登入成功');

          if (me.isHost) {
            loadGetHostRooms(me.id).then(rooms => {
              dispatch({
                type: 'rooms',
                data: rooms,
              });
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
  };

  const hostlogin = () => {
    state.email = 'host01@bin.com';
    state.password = 'abc123';
    login();
  };
  const userlogin = () => {
    state.email = 'user01@bin.com';
    state.password = 'abc123';
    login();
  };

  const emailHelperText = getEmailHelperText(),
    passwordHelperText = getPasswordHelperText();

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#ffffff', '#ffffff', '#ffffff']}>
        <View style={{height: '100%', justifyContent: 'space-between'}}>
          <Title style={style.title}>登入</Title>
          <View style={{...style.itemContainer}}>
            <Input name="email" binding={binding} />
          </View>
          <View style={{...style.itemContainer}}>
            <Input secureTextEntry name="password" binding={binding} />
          </View>
          <View
            style={{
              ...style.itemContainer,
              flexDirection: 'row',
              justifyContent: 'center',
            }}>
            <Button mode="contained" onPress={login} style={{width: '40%'}}>
              {state.loggingIn ? '登入中' : '登入'}
            </Button>
          </View>
          <View
            style={{
              marginTop: 40,
              flexDirection: 'row',
              justifyContent: 'flex-end',
            }}>
            <Button mode="" onPress={hostlogin}>
              {state.loggingIn ? '' : 'host01登入(for testing)'}
            </Button>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
            <Button mode="" onPress={userlogin}>
              {state.loggingIn ? '' : 'user01登入(for testing)'}
            </Button>
          </View>
          <View />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              marginTop: 'auto',
              padding: 16,
            }}>
            <Button mode="text" onPress={toRegisterPage}>
              註冊為房主/租客
            </Button>
          </View>
        </View>
      </LinearGradient>

      <Snackbar
        visible={!!props.loginError}
        onDismiss={props.dismissError}
        action={{
          label: '確定',
          onPress: props.dismissError,
        }}>
        {getErrorMessage()}
      </Snackbar>
    </View>
  );
};

const style = StyleSheet.create({
  itemContainer: {
    padding: 8,
    paddingLeft: 16,
    paddingRight: 16,
  },
  title: {
    marginTop: 12,
    marginLeft: 25,
    color: Colors.title,
  },
});

export default Screen;
