import NavigationService from '../NavigationService';

import React, { useState, useEffect, useCallback } from 'react';
import { useStateValue } from '../state';
import {
  loadHostPaymentRecords,
  loadRoomAdhocSlots,
  formatDateTime,
  textslotsToText,
  yymmdd,
  createAdhoc,
  deleteAdhoc,
  message,
  alert,
} from '../utils';
import { Input, MiniButton } from '../components/UI';
import { View, FlatList, RefreshControl, StyleSheet } from 'react-native';
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
    reload();
  }, [reload]);

  const onRefresh = React.useCallback(() => {
    reload();
  }, [reload]);

  const getTime = slots => {
    return textslotsToText(Object.keys(slots || {}).join(','));
  };

  const reload = useCallback(() => {
    setLoading(true);
    setBookings([]);
    if (auth.id != null) {
      loadHostPaymentRecords(auth.id)
        .then(data => {
          setBookings(data);
          setLoading(false);
        })
        .catch(err => {
          console.log('HostPaymentRecord reload err: ', err);
        });
    }
  }, [auth.id]);

  return (
    <View style={style.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
        }>
        <Title style={style.title}>記錄</Title>
        {isLoading ? (
          <View style={styles.centerScreen}>
            <Text>載入中</Text>
          </View>
        ) : null}

        {bookings.length ? (
          <FlatList
            initialNumToRender={0}
            data={bookings}
            keyExtractor={(booking, index) => booking.id}
            renderItem={({ item, index }) => (
              <View style={style.listItem}>
                <Text style={style.itemText}>
                  租客名稱{'\t\t'}
                  {item.user}
                </Text>
                <Text style={style.itemText}>
                  下單日期{'\t\t'}
                  {formatDateTime(item.createTime.toDate())}
                </Text>
                <Text style={style.itemText}>
                  場地名稱{'\t\t'}
                  {item.room}
                </Text>
                <Text style={style.itemText}>
                  租用日期{'\t\t'}
                  {item.date}
                </Text>
                <Text style={style.itemText}>
                  租用時間{'\t\t'}
                  {getTime(item.slots).replace(/, /g, '\n')}
                </Text>
                <Text style={style.itemText}>租用費用{'\t\t'}--</Text>
                <Text style={style.itemText}>交易狀態{'\t\t'}--</Text>
              </View>
            )}
          />
        ) : (
          !isLoading && (
            <View style={styles.centerScreen}>
              <Text>沒有記錄</Text>
            </View>
          )
        )}
      </ScrollView>
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    paddingTop: 10,
    backgroundColor: 'white',
  },
  title: {
    color: Colors.title,
    marginLeft: 30,
    marginBottom: 8,
  },
  listItem: {
    flex: 1,
    paddingTop: 12,
    paddingBottom: 5,
    paddingLeft: 38,
    marginBottom: 2,
    backgroundColor: Colors.bg,
    borderBottomWidth: 1,
    borderColor: Colors.main,
  },
  itemText: {
    fontSize: 11,
    color: Colors.main,
  },
});

export default Screen;
