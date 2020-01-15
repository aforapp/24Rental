import NavigationService from '../NavigationService';

import React, { useState, useEffect } from 'react';
import { useStateValue } from '../state';
import { View, FlatList } from 'react-native';
import { Title, Headline, Button, Text, Divider } from 'react-native-paper';
import firebase from 'react-native-firebase';
import { getPrice, notifyRoomRequest, textslotsToText, alert, message } from '../utils';

import styles, {Colors} from './Styles';
import { 
  Platform, StyleSheet
} from 'react-native';
import { KeyboardAwareScrollView as ScrollView } from 'react-native-keyboard-aware-scroll-view';

import { NativeModules } from 'react-native';
console.warn(NativeModules.ReactNativePayments.supportedGateways)

// const PaymentRequest = require('react-native-payments').PaymentRequest;
global.PaymentRequest = require('react-native-payments').PaymentRequest;

if (Platform.OS === 'ios') {
}

if (Platform.OS === 'android') {
  
}



const Screen = props => {
  const [state, setState] = useState({
    isProcessing: false
  });

  const [loadingPrice, setLoadingPrice] = useState(false);

  const [total, setTotal] = useState(0);
  const [displayItems, setDisplayItems] = useState([]);

  const [{ auth, cart }, dispatch] = useStateValue();

  useEffect(() => {
    // console.warn('price update');
    setLoadingPrice(true);
    setTotal(0);
    getPrice(cart.bookings).then((ret)=>{

      let roomName = {};
      cart.bookings.map(b => {roomName[b.roomId] = b.room;});

      // console.warn('ha', ret)
      setTotal(ret.data.total);
      // console.warn(ret.data.total)
      let items = [];
      ret.data.bookings.map((booking, index) => {
        // console.warn(JSON.stringify(booking))
        items.push({
          label: '訂單' + (index+1), //roomName[booking.roomId] + ' ' + booking.date + ' ' + booking.slots,
          amount: { currency: 'HKD', value: booking.total + '.00'}
        });
      });
      // console.warn(items.length)
      setDisplayItems(items);
      setLoadingPrice(false);
    });
  }, [cart.bookings]);

  function cancel(ind) {
    dispatch({ type: 'cancelBooking', data: ind });
  }

  pay = () => {
    if (loadingPrice) {
      return;
    }
    let mobilepay = 'apple-pay';
    if (Platform.OS === 'android') {
      mobilepay = 'android-pay';
    }

    const METHOD_DATA = [
      {
        supportedMethods: [mobilepay],
        data: {
          merchantIdentifier: "merchant.aforapp.app24bin",
          supportedNetworks: ["visa", "mastercard"],
          countryCode: "HK",
          currencyCode: "HKD",
          paymentMethodTokenizationParameters: {
            parameters: {
              gateway: "stripe",
              "stripe:publishableKey": "pk_test_jUMBt8hjyMj847fnFQdurNi700NInhPlju",
              "stripe:version": "5.0.0" // Only required on Android
            }
          }
        }
      }
    ];

    const DETAILS = {
      // id: "",
      displayItems, 
      total: {
        label: "24bin",
        amount: { currency: "HKD", value: total+'.00' }
      }
    };

    const paymentRequest = new PaymentRequest(METHOD_DATA, DETAILS);
    // paymentRequest.show()
    paymentRequest
      .show()
      .then(paymentResponse => {
        console.warn(paymentResponse.details);

        let reqId = cart.reqId;
        if (reqId == null) {
          let req = firebase
            .firestore()
            .collection("requests")
            .doc();

          const createdBy = auth.id;
          const createTime = firebase.firestore.FieldValue.serverTimestamp();

          req.set({
            bookings: cart.bookings,
            status: "PROCESSING",

            payment: paymentResponse.details,
            amount: total,
            createTime,
            createdBy
          });

          reqId = req.id;
        }

        console.warn('bbb', reqId)
        checkRequest(reqId, paymentResponse);
        // if (Platform.OS === 'ios') {
        //   paymentResponse.complete('success');
        // }
      })
      .catch(e => {
        //could be AbortError
        // console.warn('error', e);
      });
      


      return;
    // console.warn(ReactNativePayments.supportedGateways);
    // return;

    if (state.isProcessing) {
      alert('處理中');
      return;
    }
    if (cart.bookings.length == 0) {
      alert('沒有訂單');
      return;
    }

    if (auth.id == null) {
      alert('請先登入');
      NavigationService.navigate('Login');
      return;
    }

    let reqId = cart.reqId;
    if (reqId == null) {
      let req = firebase
        .firestore()
        .collection('requests')
        .doc();

      const createdBy = auth.id;
      const createTime = firebase.firestore.FieldValue.serverTimestamp();

      req.set({
        bookings: cart.bookings,
        status: 'PROCESSING',
        // paymentResponse,
        createTime,
        createdBy
      });

      reqId = req.id;
    }

    checkRequestTest(reqId);

    
  };

  function checkRequestTest(reqId) {
    notifyRoomRequest(reqId)
      .then(x => {
        dispatch({ type: 'clearBookings' });
        if (x.msg == 'ok') {
          setState({ ...state, isProcessing: false, reqId: false });
          alert('已成功訂房');
        } else if (x.msg == 'not ok') {
          setState({ ...state, isProcessing: false });
          alert('訂房失敗');
        } else if (x.msg == 'not found') {
          checkRequest(reqId, paymentResponse);
        } else {
          setState({ ...state, isProcessing: false });
          alert('發生錯誤');
        }
      })
      .catch(e => {
        dispatch({ type: 'clearBookings' });
        setState({ ...state, isProcessing: false });
        console.warn(e)
        alert('發生錯誤');
      });
  }

  function checkRequest(reqId, paymentResponse) {
    notifyRoomRequest(reqId)
      .then(x => {
        if (x.msg == 'ok') {
          setState({ ...state, isProcessing: false, reqId: false });
          paymentResponse.complete('success');
          console.log("accepted payment");
          dispatch({ type: 'clearBookings' });
        } else if (x.msg == 'not ok') {
          setState({ ...state, isProcessing: false });
          paymentResponse.complete('fail');
          alert('訂房失敗');
        } else if (x.msg == 'not found') {
          // console.warn("not found");
          checkRequest(reqId, paymentResponse);
        } else {
          setState({ ...state, isProcessing: false });
          paymentResponse.complete('fail');
          alert('發生錯誤');
        }
      })
      .catch(e => {
        setState({ ...state, isProcessing: false });
        paymentResponse.complete('fail');
        alert('發生錯誤');
      });
  }

  return (
    <View style={{...styles.container, ...style.container}}>
      <Title>購物車</Title>
        {cart.bookings.length == 0 ? (

          <Text>沒有訂單</Text>
        ) : (
          <React.Fragment>

            <FlatList
              initialNumToRender={0}
              data={cart.bookings}
              extraData={{displayItems, loadingPrice}}
              keyExtractor={(item, index) => 'req' + index}
              renderItem={({ item, index }) => (
              <View>
                <Text style={{ marginTop: 18 }}>訂單{index + 1}：</Text>
                <Text>房間：{item.room}</Text>
                <Text>日期：{item.date}</Text>
                <Text>時間：{textslotsToText(item.slots)}</Text>
                <Text>小計：{loadingPrice || displayItems.length <= index ? '--' : displayItems[index].amount.value}</Text>
                <Button
                  mode="outlined"
                  disabled={state.isProcessing}
                  onPress={cancel.bind(this, index)}
                >
                  取消訂單
                </Button>
              </View>
              )}
              />
          
          <Button
          mode="contained"
          disabled={state.isProcessing}
          onPress={pay}
          style={{ marginTop: 18 }}
        >
          {state.isProcessing ? '處理中' : '付款(' + (loadingPrice ? '計算中' : 'HK$'+ total) +')'}
        </Button>
        </React.Fragment>

        )}
        
    </View>
  );
};

const style = StyleSheet.create({
  container: { margin: 10},
});

export default Screen;
