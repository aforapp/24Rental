import NavigationService from '../NavigationService';

import React, { useState, useEffect, useCallback } from 'react';
import { useStateValue } from '../state';
import {
  Switch,
  View,
  Modal,
  Platform,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import { SafeAreaView } from 'react-navigation';

import ActionSheet from 'react-native-actionsheet';
import firebase from 'react-native-firebase';

import { Input, MiniButton } from '../components/UI';

import Icon from 'react-native-vector-icons/Ionicons';

import OptionScreen from './OptionScreen';
import { Colors } from './Styles';

import { KeyboardAwareScrollView as ScrollView } from 'react-native-keyboard-aware-scroll-view';

import {
  loadHostPaymentRecords,
  loadRoomAdhocSlots,
  textslotsToText,
  yymmdd,
  createAdhoc,
  deleteAdhoc,
  message,
  alert,
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
import styles from './Styles';

const Screen = props => {
  const [{ auth, rooms }, dispatch] = useStateValue();
  const [isLoading, setLoading] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [adhocSlots, setAdhocSlots] = useState([]);
  const [bookingData, setBookingData] = useState([]);
  const [adhocData, setAdhocData] = useState([]);
  const [chosenRoom, setChosenRoom] = useState(null);
  // const [startTime, setChosenRoom] = useState(null);
  // const [endTime, setChosenRoom] = useState(null);

  const [markedDates, setMarkedDates] = useState({});

  const minDate = new Date('2019-01-01');
  const maxDate = new Date(new Date().getTime() + 365 * 24 * 60 * 60 * 1000);
  const today = yymmdd(new Date());
  const [selectedDate, setSelectedDates] = useState('');

  const onSelectDate = x => {
    setSelectedDates(x);
    // showDate(x);
  };

  useEffect(() => {
    let x = bookingData.filter(x => x.date == selectedDate);
    x.sort((x, y) => x.room < y.room && getTime(x.time) < getTime(y.time));
    setBookings(x);
    let y = adhocData.filter(z => z.date == selectedDate);
    setAdhocSlots(y);
  }, [selectedDate, adhocData, bookingData]);

  useEffect(() => {
    setSelectedDates(today);
  }, [today]);

  const reload = useCallback(() => {
    setLoading(true);
    setBookings([]);
    setAdhocSlots([]);
    setMarkedDates({});
    if (auth && auth.id != null) {
      loadHostPaymentRecords(auth.id)
        .then(bookings => {
          loadRoomAdhocSlots(auth.id)
            .then(adhocs => {
              setBookingData(bookings);
              setAdhocData(adhocs);
              let marked = {};
              bookings.map(x => (marked[x.date] = { marked: true }));
              adhocs.map(x => (marked[x.date] = { marked: true }));
              setMarkedDates(marked);
              setLoading(false);
            })
            .catch(err => {
              console.log('HostCalendar loadRoomAdhocSlots err: ', err);
            });
        })
        .catch(err => {
          console.log('HostCalendar loadRoomAdhocSlots err: ', err);
        });
    } else {
      setLoading(false);
    }
  }, [auth]);

  const [isOpen, setIsOpenState] = useState(false);
  function setIsOpen(x) {
    setIsOpenState(x);
    onChange('open', x ? '開放' : '休息');
  }

  const [adhocVisible, setAdhocVisible] = useState(false);
  const addAdhoc = () => {
    setAdhocVisible(true);
  };

  function padZero(x) {
    return ('0' + x).slice(-2);
  }

  const confirmAddAdhoc = () => {
    let slots = {};

    for (let i = 0; i < 48; i++) {
      let x = padZero(Math.floor(i / 2)) + ':' + padZero((i % 2) * 30);
      if (x >= inputData.startTime && x < inputData.endTime) {
        slots[x] = true;
      }
    }

    let noClash = true;

    let msg = '';

    for (let i = 0; i < adhocData.length; i++) {
      const md = adhocData[i];
      if (md.date === selectedDate && md.roomId === chosenRoom.id) {
        const markedSlots = Object.keys(slots);
        for (let j = 0; j < markedSlots.length; j++) {
          if (md.slots[markedSlots[j]] == true) {
            noClash = false;

            msg = `${md.date} ${markedSlots[j]} 已有設定`;
            break;
          }
        }
      }
      if (!noClash) {
        // alert(msg, () => setAdhocVisible(true));
        Alert.alert(msg);
        break;
      }
    }

    if (noClash) {
      createAdhoc({
        room: chosenRoom.name,
        roomId: chosenRoom.id,
        hostId: chosenRoom.createdBy,
        date: selectedDate,
        price: inputData.price,
        isOpen: isOpen,
        slots,
      });
      message('設定成功');
      reload();
      setAdhocVisible(false);
    }
  };

  useEffect(() => {
    reload();
  }, [reload]);

  function getTime(slots) {
    return textslotsToText(Object.keys(slots || {}).join(',')).replace(
      /, /g,
      '\n',
    );
  }

  const [inputData, setInputData] = useState({
    open: '休息',
  });

  function onChange(name, value) {
    setInputData({ ...inputData, [name]: value });
  }

  const chatWith = x => {
    dispatch({
      type: 'openChat',
      data: { userId: x.userId, hostId: auth.id },
    });
    NavigationService.navigate('ChatList');
    // NavigationService.navigate('Chat', { userId: x.userId, hostId: auth.id });
  };

  const confirmRemoveAdhoc = (roomId, userId) => {
    Alert.alert(
      '取消此臨時房間',
      '此動作會取消本次提供房間，請按加號重新增加',
      [
        { text: '取消', style: 'cancel' },
        { text: '確定', onPress: removeAdhoc(roomId, userId) },
      ],
      { cancelable: false },
    );
  };

  const removeAdhoc = (roomId, userId) => {
    deleteAdhoc(roomId, userId);
    reload();
  };

  const binding = {
    data: inputData,
    label: {
      price: '時租',
      room: '房間',
      startTime: '開始時間',
      endTime: '結束時間',
      open: '開放/休息',
      '': '',
    },
    helperText: {},
    onChange,
  };

  const [sheet, setSheet] = useState(null);
  const [startTimeSheet, setStartTimeSheet] = useState(null);
  const [endTimeSheet, setEndTimeSheet] = useState(null);

  const [items, setItems] = useState({});

  const fullSlotsStr =
    '["00:00","00:30","01:00","01:30","02:00","02:30","03:00","03:30","04:00","04:30","05:00","05:30","06:00","06:30","07:00","07:30","08:00","08:30","09:00","09:30","10:00","10:30","11:00","11:30","12:00","12:30","13:00","13:30","14:00","14:30","15:00","15:30","16:00","16:30","17:00","17:30","18:00","18:30","19:00","19:30","20:00","20:30","21:00","21:30","22:00","22:30","23:00","23:30"]';

  const [startSlots, setStartSlots] = useState(JSON.parse(fullSlotsStr));
  const [endSlots, setEndSlots] = useState(JSON.parse(fullSlotsStr));

  const renderItem = x => {
    if (x.isOpen == null) {
      return (
        <View
          style={{
            flex: 1,
            flexGrow: 0,
            flexDirection: 'row',
            alignItems: 'center',
            minHeight: 80,
            justifyContent: 'space-between',
            padding: 8,
            margin: 0,
            borderColor: 'lightgray',
            borderBottomWidth: 1,
          }}>
          <View style={{ ...style.timeslot }}>
            <Text style={{ fontSize: 12 }}>{getTime(x.slots)}</Text>
          </View>
          <Text style={style.timeslotDetails}>
            {'房間：' + x.room + '\n' + '租客：' + x.user}
          </Text>
          <Button
            style={style.chatButton}
            mode="contained"
            compact
            onPress={() => {
              chatWith(x);
            }}>
            <Text style={style.chatButtonText}>談話</Text>
          </Button>
        </View>
      );
    } else {
      return (
        <View
          style={{
            flex: 1,
            flexGrow: 0,
            flexDirection: 'row',
            alignItems: 'center',
            minHeight: 80,
            justifyContent: 'flex-start',
            padding: 8,
            margin: 0,
            borderColor: 'lightgray',
            borderBottomWidth: 1,
          }}>
          <View style={{ ...style.timeslot }}>
            <Text style={{ fontSize: 12 }}>{getTime(x.slots)}</Text>
          </View>
          <Text style={style.timeslotDetails}>
            {x.room +
              ' 臨時' +
              (x.isOpen ? '開放' : '休息') +
              (x.isOpen ? ' 時租$' + x.price : '')}
          </Text>
          <Button
            style={{ ...style.chatButton, backgroundColor: 'red' }}
            mode="contained"
            compact
            onPress={() => {
              confirmRemoveAdhoc(x.roomId, x.id);
            }}>
            <Text style={style.chatButtonText}>取消</Text>
          </Button>
        </View>
      );
    }
  };
  const renderEmptyDate = () => {
    return (
      <View>
        <Text style={{ width: '100%', marginLeft: 20, marginTop: 40 }}>
          沒有預約
        </Text>
      </View>
    );
  };

  const rowHasChanged = () => {};
  const loadItems = day => {
    setSelectedDates(day.dateString);
    setItems({
      [day.dateString]: [
        ...bookingData.filter(x => x.date === day.dateString),
        ...adhocData.filter(x => x.date === day.dateString),
      ],
    });
  };

  const onAgendaLoad = day => {
    // Initialize agenda when items is empty
    if (Object.keys(items).length === 0) {
      loadItems(day);
    }
  };

  return (
    <View style={styles.container}>
      <View style={style.header}>
        <View style={styles.row}>
          <Text
            style={{
              color: Colors.bg,
              fontSize: 20,
              lineHeight: 60,
              marginLeft: 30,
            }}>
            日曆
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
            <Button onPress={reload}>
              <Icon
                size={24}
                name={Platform.OS === 'ios' ? 'ios-refresh' : 'md-refresh'}
                style={{ color: Colors.bg }}
              />
            </Button>

            <Button style={style.addButton} onPress={addAdhoc}>
              <Icon
                size={24}
                name={
                  Platform.OS === 'ios' ? 'ios-add-circle' : 'md-add-circle'
                }
                style={{ color: Colors.bg }}
              />
            </Button>
          </View>
        </View>
      </View>
      <Modal animationType="fade" transparent={false} visible={adhocVisible}>
        <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent' }}>
          <Text style={style.adhocTitle}>{'日期：' + selectedDate}</Text>

          <TouchableOpacity>
            <Input
              name="room"
              binding={binding}
              editable={false}
              onTouchEnd={() => {
                sheet.show();
              }}
            />
          </TouchableOpacity>
          <ActionSheet
            ref={o => setSheet(o)}
            title="請選擇房間"
            options={[...rooms.map(x => x.name), '取消']}
            cancelButtonIndex={rooms.length}
            onPress={index => {
              if (index < rooms.length) {
                setChosenRoom(rooms[index]);
                setInputData({ ...inputData, room: rooms[index].name });
              }
            }}
          />
          <TouchableOpacity>
            <Input
              name="startTime"
              binding={binding}
              editable={false}
              onTouchEnd={() => {
                startTimeSheet.show();
              }}
            />
          </TouchableOpacity>
          <ActionSheet
            ref={o => setStartTimeSheet(o)}
            title="請選擇開始時間"
            options={[...startSlots, '取消']}
            cancelButtonIndex={startSlots.length}
            onPress={index => {
              if (index < startSlots.length) {
                setInputData({ ...inputData, startTime: startSlots[index] });
                setEndSlots(
                  JSON.parse(fullSlotsStr).filter(x => x > startSlots[index]),
                );
              }
            }}
          />
          <TouchableOpacity>
            <Input
              name="endTime"
              binding={binding}
              editable={false}
              onTouchEnd={() => {
                endTimeSheet.show();
              }}
            />
          </TouchableOpacity>
          <ActionSheet
            ref={o => setEndTimeSheet(o)}
            title="請選擇結束時間"
            options={[...endSlots, '取消']}
            cancelButtonIndex={endSlots.length}
            onPress={index => {
              if (index < endSlots.length) {
                setInputData({ ...inputData, endTime: endSlots[index] });
                setStartSlots(
                  JSON.parse(fullSlotsStr).filter(x => x < endSlots[index]),
                );
              }
            }}
          />
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#E7E7E7',
            }}>
            <Input
              style={{ flexGrow: 1 }}
              name="open"
              binding={binding}
              editable={false}
            />
            <View
              style={{
                paddingTop: 12,
                alignItems: 'center',
                borderBottomColor: '#B7B7B7',
                height: '100%',
                borderBottomWidth: 1,
              }}>
              <Switch
                trackColor={{ false: 'grey' }}
                style={{
                  marginRight: 8,
                  borderBottomWidth: 2,
                  borderBottomColor: '#C9C9C9',
                  marginBottom: 2,
                }}
                onValueChange={setIsOpen}
                value={isOpen}
              />
            </View>
          </View>
          <Input
            name="price"
            style={isOpen ? {} : { display: 'none' }}
            binding={binding}
          />
          <Button
            onPress={() => {
              confirmAddAdhoc();
            }}>
            確定
          </Button>
          <Button
            onPress={() => {
              setAdhocVisible(false);
            }}>
            取消
          </Button>
        </SafeAreaView>
      </Modal>

      {/* <Calendar
        onDayPress={day => {
          onSelectDate(day.dateString);
        }}
        markedDates={{ ...markedDates, [selectedDate]: { selected: true, marked: (markedDates[selectedDate] || {}).marked } }}
        minDate={minDate}
        maxDate={maxDate}
        style={style.calendar}
        theme={{
          todayTextColor: Colors.main,
          backgroundColor: Colors.bg,
          calendarBackground: Colors.bg,
          textSectionTitleColor: Colors.main,
          selectedDayBackgroundColor: Colors.main,
          selectedDayTextColor: Colors.bg,
          todayTextColor: Colors.colorText,
          dayTextColor: Colors.main,
          textDisabledColor: Colors.colorText,
          dotColor: Colors.navButton,
          selectedDotColor: Colors.bg,
          arrowColor: Colors.main,
          monthTextColor: Colors.main,
          indicatorColor: Colors.main,
          // textDayFontFamily: 'monospace',
          // textMonthFontFamily: 'monospace',
          // textDayHeaderFontFamily: 'monospace',
          // textDayFontWeight: '300',
          // textMonthFontWeight: 'bold',
          // textDayHeaderFontWeight: '300',
          // textDayFontSize: 16,
          // textMonthFontSize: 16,
          // textDayHeaderFontSize: 16
        }}
      /> */}
      <Agenda
        items={items}
        loadItemsForMonth={onAgendaLoad}
        onDayPress={loadItems}
        renderItem={renderItem}
        renderEmptyDate={renderEmptyDate}
        rowHasChanged={rowHasChanged}
        selected={today}
        markedDates={{
          ...markedDates,
          [selectedDate]: {
            selected: true,
            marked: (markedDates[selectedDate] || {}).marked,
          },
        }}
        // markingType={'period'}

        // monthFormat={'yyyy'}
        // theme={{calendarBackground: 'red', agendaKnobColor: 'green'}}
        //renderDay={(day, item) => (<Text>{day ? day.day: 'item'}</Text>)}
      />
      {/* <ScrollView>
        {isLoading ? (<View style={styles.centerScreen}><Text>載入中</Text></View>) : bookings.length != 0 || adhocSlots.length != 0 || <View style={styles.centerScreen}><Text>沒有紀綠</Text></View>}
        {bookings.map(x => (
          <View key={x.id}>
            <View style={{ flex: 1, flexGrow: 0, flexDirection: 'row', padding: 8 }}>
              <Text>{getTime(x.slots).replace(/, /g, '\n')}</Text>
              <View style={{ marginLeft: 10, width: '100%' }}>
                <Text>{'房間：' + x.room}</Text>
                <View style={styles.row}>
                <Text>{'租客：' + x.user}</Text>
                <MiniButton color={Colors.main} fontColor="white" title="談話" style={{ width: 36, borderWidth: 0 }} buttonStyle={{ width: 30, height: 30, borderRadius: 8 }}
                  onPress={() => { chatWith(x); }} fontSize={12} />
                  </View>
              </View>
            </View>
            <Divider />
          </View>
        ))}
        {adhocSlots.map(x => (
          <View key={x.id}>
            <View style={{ flex: 1, flexGrow: 0, flexDirection: 'row', padding: 8 }}>
              <Text>{getTime(x.slots) + ' ' + x.room + ' 臨時' + (x.isOpen ? '開放' : '休息') + (x.isOpen ? ' 時租$' + x.price : '')}</Text>
              <View style={{ marginLeft: 10 }}>
                <MiniButton color="red" fontColor="white" title="取消" style={{ width: 36, borderWidth: 0 }} buttonStyle={{ width: 30, height: 30, borderRadius: 8 }}
                  onPress={() => { deleteAdhoc(x.roomId, x.id); reload(); }} fontSize={12} />
              </View>
            </View>
            <Divider />
          </View>
        ))}
      </ScrollView> */}
    </View>
  );
};

const style = StyleSheet.create({
  item: {
    backgroundColor: 'white',
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17,
  },
  emptyDate: {
    height: 15,
    flex: 1,
    paddingTop: 30,
  },
  header: {
    alignItems: 'stretch',
    backgroundColor: Colors.main,
    height: 50,
  },
  timeslot: {
    textAlign: 'center',
    borderRightWidth: 1,
    borderColor: 'gray',
    paddingRight: 8,
    paddingTop: 5,
    paddingBottom: 5,
    marginRight: 5,
  },
  timeslotDetails: {
    flex: 1,
    flexGrow: 1,
    fontSize: 12,
    marginLeft: 5,
  },
  chatButton: {
    marginRight: 10,
    height: 30,
    borderRadius: 5,
  },
  chatButtonText: {
    fontSize: 12,
    color: 'white',
    lineHeight: 14,
  },
  addButton: {
    marginLeft: -20,
  },
  adhocTitle: {
    fontSize: 20,
  },
  calendar: {
    // height: 300
    margin: 10,
  },
});
export default Screen;
