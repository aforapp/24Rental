import NavigationService from '../NavigationService';

import React, { useState, useEffect } from 'react';
import { useStateValue } from '../state';
import { loadHostPaymentRecords, loadRoomAdhocSlots, formatDateTime, textslotsToText, yymmdd, createAdhoc, deleteAdhoc, message, alert } from '../utils';
import { Input, MiniButton } from '../components/UI';
import {
  View,
  FlatList,
  StyleSheet,
  Divider,
 } from 'react-native';
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
  Checkbox
} from 'react-native-paper';
import { KeyboardAwareScrollView as ScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles, {Colors} from './Styles';

const Screen = props => {

  const [{ auth }, dispatch] = useStateValue();

  const [isLoading, setLoading] = useState(false);
  const [bookings, setBookings] = useState([]);

  // useEffect(() => {
  //   let x = bookingData.filter(x => x.date == selectedDate);
  //   x.sort((x, y) => x.room < y.room && getTime(x.time) < getTime(y.time))
  //   setBookings(x);
  //   let y = adhocData.filter(z => z.date == selectedDate);
  //   setAdhocSlots(y);
  // }, [selectedDate, adhocData, bookingData]);

  useEffect(() => {
    reload()
  }, []);

  const getTime = (slots) => {
    return textslotsToText(Object.keys(slots || {}).join(','));
  };

  const reload = () => {
    setLoading(true);
    setBookings([]);
    if (auth.id != null) {
      loadHostPaymentRecords(auth.id).then(data => {
        setBookings(data)
        setLoading(false)
      });
    }
  };


  return (
    <View style={styles.container}>


        {isLoading ? (<View style={styles.centerScreen}><Text>載入中</Text></View>) : bookings.length != 0 || <View style={styles.centerScreen}><Text>沒有紀綠</Text></View>}

        <FlatList
        initialNumToRender={0}
        data={bookings}
        keyExtractor={(booking, index) => booking.id}
        renderItem={({ item, index }) => (
          <View>
            <View style={{ height: 16, backgroundColor: Colors.main }}>
              <Text style={{color: '#FFFFFF', fontSize:10, paddingLeft: 32}}></Text>
            </View>

            <View style={{ flex: 1, flexGrow: 0, flexDirection: 'row', paddingTop: 8, paddingBottom: 8 }}>
              
              <View style={{ marginLeft: 0, width: '100%' }}>
                <Text style={{color: '#707070', fontSize:16, paddingTop: 1, paddingBottom: 1, paddingLeft: 32}}>下單時間：{formatDateTime(item.createTime.toDate())}</Text>
                <Text style={{color: '#90BED4', fontSize:22, paddingTop: 2, paddingBottom: 2, paddingLeft: 32}}>{item.room}</Text>
                <Text style={{color: '#9F9F9F', fontSize:16, paddingTop: 1, paddingBottom: 1, paddingLeft: 32}}>日期：{item.date}</Text>
                <Text style={{color: '#000000', fontSize:14, paddingTop: 1, paddingBottom: 1, paddingLeft: 32}}>時間：{getTime(item.slots).replace(/, /g, '\n')}</Text>
              </View>
            </View>
          </View>
        )}
        />


      </View>
  );
};

const style = StyleSheet.create({
});

export default Screen;
