import NavigationService from '../NavigationService';

import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  // TextInput,
  StyleSheet,
 } from 'react-native';
import { KeyboardAwareScrollView as ScrollView } from 'react-native-keyboard-aware-scroll-view';
import { loadGetUserPaymentRecords, textslotsToText, formatDateTime } from '../utils';
import {
  Headline,
  TextInput,
  Button,
  Snackbar,
  Card,
  Title,
  Text,
  Paragraph,
  Divider
} from 'react-native-paper';
import styles, {Colors} from './Styles';

import { useStateValue } from '../state';

const Screen = props => {

  const statusMapping = {
    'PROCESSING': '處理中',
    'FAILURE': '失敗',
    'SUCCESS': '成功'
  }
  const statusBgColor = {
    'PROCESSING': 'yellow',
    'FAILURE': 'red',
    'SUCCESS': Colors.main
  }
  const statusColor = {
    'PROCESSING': 'black',
    'FAILURE': 'black',
    'SUCCESS': '#FFFFFF'
  }
  
  const [{auth}, dispatch] = useStateValue();

  // const [state, setState] = useState({ requests: [] });
  const [requests, setRequests] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const ha = [{a:'a'}, {a:'a'}, {a:'a'}, {a:'a'}, {a:'a'}, {a:'a'}, {a:'a'}, {a:'a'}, {a:'a'}]

  const getTime = (slots) => {
    return textslotsToText(Object.keys(slots || {}).join(','));
  };

  useEffect(() => {
    setIsLoading(true);
    loadGetUserPaymentRecords(auth.id).then(data => {
      setIsLoading(false);
      setRequests(data);
    });
  }, []);
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


    <View style={styles.container}>
    {isLoading ? (<View style={styles.centerScreen}><Text>載入中</Text></View>) : requests.length != 0 || <View style={styles.centerScreen}><Text>沒有紀綠</Text></View>}

    <FlatList
    initialNumToRender={0}
    data={requests}
    keyExtractor={(request, index) => request.id}
    renderItem={({ item, index }) => (
      <View>
        <View style={{ height: 24, backgroundColor: statusBgColor[item.status] }}>
          <Text style={{color:  statusColor[item.status], fontSize:16, paddingLeft: 32}}>狀態：{statusMapping[item.status]}</Text>
        </View>

        <Text style={{color: '#707070', fontSize:16, paddingTop: 1, paddingBottom: 1, paddingLeft: 32}}>下單時間：{formatDateTime(item.createTime.toDate())}</Text>
        <FlatList
          initialNumToRender={0}
          data={item.bookings}
          keyExtractor={(booking, index) => booking.id}
          renderItem={({ item, index }) => (
            <View style={{ flex: 1, flexGrow: 0, flexDirection: 'row', paddingTop: 8, paddingBottom: 8 }}>
              <View style={{ marginLeft: 0, width: '100%' }}>
                <Text style={{color: '#90BED4', fontSize:22, paddingTop: 2, paddingBottom: 2, paddingLeft: 32}}>{item.room}</Text>
                <Text style={{color: '#9F9F9F', fontSize:16, paddingTop: 1, paddingBottom: 1, paddingLeft: 32}}>日期：{item.date}</Text>
                <Text style={{color: '#000000', fontSize:14, paddingTop: 1, paddingBottom: 1, paddingLeft: 32}}>時間：{item.slots}</Text>
              </View>
            </View>)}
        />
      </View>
    )}
    />


  </View>
  );
};

const style = StyleSheet.create({
  record: {
    padding: 10,
    // borderWidth:
    // color: 'white',
    // backgroundColor: '#225599',
    // width: '40%',
    // marginLeft: '30%',
    // marginTop: 8,
    // marginBottom: 8
  }
});

export default Screen;
