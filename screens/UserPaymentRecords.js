import NavigationService from '../NavigationService';

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  FlatList,
  RefreshControl,
  // TextInput,
  StyleSheet,
} from 'react-native';
import { KeyboardAwareScrollView as ScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
  loadGetUserPaymentRecords,
  textslotsToText,
  formatDateTime,
} from '../utils';
import {
  Headline,
  TextInput,
  Button,
  Snackbar,
  Card,
  Title,
  Text,
  Paragraph,
  Divider,
} from 'react-native-paper';
import styles, { Colors } from './Styles';

import { useStateValue } from '../state';

const Screen = props => {
  const statusMapping = {
    PROCESSING: '處理中',
    FAILURE: '交易失敗',
    SUCCESS: '交易成功',
  };
  const statusBgColor = {
    PROCESSING: 'yellow',
    FAILURE: 'red',
    SUCCESS: Colors.main,
  };
  const statusColor = {
    PROCESSING: 'black',
    FAILURE: 'black',
    SUCCESS: '#FFFFFF',
  };

  const [{ auth }, dispatch] = useStateValue();

  // const [state, setState] = useState({ requests: [] });
  const [requests, setRequests] = useState([]);
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const ha = [
    { a: 'a' },
    { a: 'a' },
    { a: 'a' },
    { a: 'a' },
    { a: 'a' },
    { a: 'a' },
    { a: 'a' },
    { a: 'a' },
    { a: 'a' },
  ];

  // const onRefresh = React.useCallback(() => {
  //   if (auth && auth.id != null) {
  //     getUserPaymentRecords(auth.id);
  //   }
  // }, [auth, getUserPaymentRecords]);

  const getTime = slots => {
    return textslotsToText(slots);
  };

  const getUserPaymentRecords = useCallback(
    authId => {
      if (authId != null) {
        setIsLoading(true);
        setRecords([]);
        loadGetUserPaymentRecords(authId)
          .then(data => {
            setRequests(data);
            transformRequestsToRecords(requests);
            setIsLoading(false);
          })
          .catch(err => {
            console.log('getUserPaymentRecords err: ', err);
          });
      }
    },
    [requests, transformRequestsToRecords],
  );

  const transformRequestsToRecords = useCallback(fetchedRequests => {
    let formattedRecords = [];
    fetchedRequests.forEach(request => {
      request.bookings.forEach(booking => {
        formattedRecords.push({
          amount: request.amount,
          status: request.status,
          createTime: request.createTime,
          room: booking.room,
          date: booking.date,
          slots: booking.slots,
        });
      });
    });
    setRecords(formattedRecords);
  }, []);

  useEffect(() => {
    if (auth && auth.id != null) {
      getUserPaymentRecords(auth.id);
    }
  }, [auth, getUserPaymentRecords]);

  useEffect(() => {
    transformRequestsToRecords(requests);
  }, [requests, transformRequestsToRecords]);

  return (
    // <View style={styles.container}>
    //   <Title>紀錄</Title>
    //     {isLoading ? <Text>載入中</Text> : state.requests.length == 0 ? <Text>沒有紀錄</Text> : <View />}

    //     <FlatList
    //       initialNumToRender={0}
    //       data={state.requests}
    //       keyExtractor={(item, index) => item.id}
    //       renderItem={({ item }) => (
    //         <View style={style.record}>
    //           <Text>{'狀態：' + statusMapping[item.status]}</Text>
    //           <Text>{'下單日期：' + formatDateTime(item.createTime.toDate())}</Text>
    //           <FlatList
    //       initialNumToRender={0}
    //       data={item.bookings}
    //       keyExtractor={(booking, bindex) => item.id+ '_booking_' + bindex }
    //       renderItem={({ item }) => (
    //         <View style={style.record}>
    //             <Text>{'房間：' + item.room}</Text>
    //             <Text>{'日期：' + item.date}</Text>
    //             <Text>{'時間：' + textslotsToText(item.slots)}</Text>
    //         </View>
    //       )}
    //       />
    //         </View>
    //       )}
    //       />
    // </View>

    <View style={style.container}>
      {/* <ScrollView
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
        }> */}
      <Title style={style.title}>紀綠</Title>
      {isLoading ? (
        <View style={styles.centerScreen}>
          <Text>載入中</Text>
        </View>
      ) : null}

      {records.length ? (
        <FlatList
          initialNumToRender={0}
          data={records}
          keyExtractor={(request, index) => request.id}
          renderItem={({ item, index }) => (
            <View style={style.listItem}>
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
                {getTime(item.slots)}
              </Text>
              <Text style={style.itemText}>
                租用費用{'\t\t'}
                HKD {item.amount}
              </Text>
              <Text style={style.itemText}>
                交易狀態{'\t\t'}
                {statusMapping[item.status]}
              </Text>
            </View>
          )}
        />
      ) : (
        !isLoading && (
          <View style={styles.centerScreen}>
            <Text style={style.emptyRecordText}>
              沒有訂單紀綠{'\n'}請到搜尋頁面預訂喜愛的排舞室
            </Text>
          </View>
        )
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
    backgroundColor: '#2560A4',
  },
  itemText: {
    fontSize: 11,
    color: 'white',
  },
  emptyRecordText: {
    color: '#9BC4D8',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default Screen;
