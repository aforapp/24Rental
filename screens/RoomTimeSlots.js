import NavigationService from '../NavigationService';

import React, { useState, useEffect } from 'react';
import { useStateValue } from '../state';
import { View, Text, StyleSheet, Alert, Animated } from 'react-native';
import { Image } from '../components/UI';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import {
  Headline,
  TextInput,
  Button,
  Snackbar,
  Card,
  Title,
  Paragraph,
  Divider,
  Portal,
  Modal
} from 'react-native-paper';
import { KeyboardAwareScrollView as ScrollView } from 'react-native-keyboard-aware-scroll-view';
import { getSlots, yymmdd, message, alert } from '../utils';
import styles from './Styles';
import { Button as UIButton } from '../components/UI';

const Screen = props => {
  const [state, setState] = useState({
    opacity: new Animated.Value(0),
    isCustom: false,
    isCalShow: false,
    slots: {},
    isInCart: {},
    timeslots: [],
    prices: {},
    isOpen: true,
    today: new Date(),
    maxDate: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 90)
  });

  const d = new Date();
  const dstr = yymmdd(d);

  const [selectedDate, setSelectedDate] = useState(dstr);

  const [{ cart }, dispatch] = useStateValue();

  useEffect(() => {
    // if (prevState.selectedDate != state.selectedDate) {
    updateSlots();
  }, selectedDate);

  function updateSlots() {
    let date = selectedDate;
    let room = props.navigation.state.params.room;
    // console.warn(new Date(d).getDay());
    getSlots(room.id, date).then(({ slots, prices }) => {
      console.log(prices)
      timeslots = slots || [];
      setState({ ...state, timeslots, prices, booked: {} });
      let isInCart = {};
      let room = props.navigation.state.params.room;
      cart.bookings.map(booking => {
        if (booking.roomId == room.id && booking.date == selectedDate) {
          booking.slots.split(',').map(s => {
            isInCart[s] = true;
          });
        }
      });
      if (JSON.stringify(isInCart) != JSON.stringify(state.isInCart)) {
        setState({ ...state, isInCart });
      }
    });
  }

  function selectSlot(slot) {
    let slots = state.slots || {};

    if (slots[slot] != null) {
      delete slots[slot];
    } else {
      slots[slot] = true;
    }

    // console.warn(slots);
    setState({ ...state, slots });
  }

  function book(payNow = false) {
    const roomId = props.navigation.state.params.room.id;
    const room = props.navigation.state.params.room.name;
    const date = selectedDate;
    const slots = Object.keys(state.slots)
      .map(k => {
        return state.slots[k] ? k : '';
      })
      .filter(x => x != '')
      .sort()
      .join(',');

    if (slots.length == 0) {
      alert('請選擇時間');
    } else {
      dispatch({ type: 'addBooking', data: { room, roomId, date, slots } });
      if (payNow) {
        NavigationService.navigate('ShoppingCart', { payNow: true });
      } else {
        message('已加入購物車');
      }
      setState({ ...state, slots: [] });
    }

  }

  const onChooseDateButton = () => {
    setState({ ...state, isCalShow: true });
  };

  const hideCal = () => {
    setState({ ...state, isCalShow: false });
  };

  function onSelectDate(d) {
    setSelectedDate(d);
    setState({ ...state, slots: {} });
    hideCal();
  }

  let k = 0;
  return (
    <View style={style.container}>
      <View style={{flex: 0}}>
        <Text style={style.roomname}>
          {props.navigation.state.params.room.name}
        </Text>
        <Text style={style.header2}>請選擇日期</Text>
        <Button
          mode="contained"
          onPress={onChooseDateButton}
          style={{ marginTop: 8 }}
        >
          {selectedDate}
        </Button>
        <Portal>
          <Modal visible={state.isCalShow} onDismiss={hideCal}>
            <Calendar
              onDayPress={day => {
                onSelectDate(day.dateString);
              }}
              markedDates={{
                [selectedDate]: { selected: true }
              }}
              minDate={state.today}
              maxDate={state.maxDate}
              style={style.calendar}
              theme={{
                todayTextColor: '#2d4150'
              }}
            />
          </Modal>
        </Portal>
      </View>
      <View style={{flex: 1, flexGrowth: 1}}>
          <Text style={{ ...style.header2, marginTop: 30 }}>請選擇時間</Text>
          <ScrollView>
          {state.isCustom ? (<Text>是日有特別安排</Text>) : null}
          {state.isOpen ? (
              ['am', 'pm'].map(ampm => (
                <View key={ampm} style={style.half}>
                  <Text style={style.ampm}>
                    {ampm == 'am' ? '' : ''}
                  </Text>
                  <Divider />
                  <View style={{}}>
                    {Object.keys(state.timeslots)
                      .filter(
                        x => (ampm == 'pm') != state.timeslots[x] < '12:00'
                      )
                      .map(k => (
                        <Text
                          key={'dummy' + state.timeslots[k]}
                          onPress={selectSlot.bind(this, state.timeslots[k])}
                          style={{
                            ...style.slottext,
                            color:
                              state.booked[state.timeslots[k]] ||
                                state.isInCart[state.timeslots[k]]
                                ? 'gray'
                                : state.slots[state.timeslots[k]]
                                  ? 'red'
                                  : '#225599'
                          }}
                        >
                          {state.timeslots[k] + ' - $' + (state.prices[state.timeslots[k]] / 2)}
                        </Text>
                      ))}
                  </View>
                </View>
              ))
            
          ) : (
              <View>
                <Text>是日休息</Text>
              </View>
            )}
                  </ScrollView>

        </View>

      <View style={style.buttonContainer}>
        <Button
          color="white"
          style={style.button}
          onPress={book.bind(this, false)}
        >
          加入購物車
        </Button>
        <Button
          color="white"
          style={style.button}
          onPress={book.bind(this, true)}
        >
          立即租訂
        </Button>
      </View>
    </View>

  );
};

const style = StyleSheet.create({
  container: {
    flex:1,
    flexDirection: 'column',
    justifyContent: 'flex-start',

    padding: 20,
    paddingTop: 30
  },
  roomname: {
    fontSize: 30
  },
  header2: {
    fontSize: 16,
    color: '#245499',
    marginTop: 8
  },
  calendar: {
    // height: 300
    margin: 10
  },
  scrollContainer: {
    height: 80,
    backgroundColor: 'red'
  },
  buttonContainer: {
    flexDirection: 'row',
    // justifyContent: 'flex-end',
    // marginTop: 'auto',
    padding: 16
  },
  ampm: {
    width: '100%',
    fontSize: 18,
    marginTop: 8
  },
  half: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  text: {
    fontSize: 20,
    marginRight: 4
  },
  slottext: {
    fontSize: 20,
    marginRight: 4
  },
  button: {
    color: 'white',
    backgroundColor: '#225599',
    width: '40%',
    height: 40,
    alignItems: 'center',

    marginHorizontal: 20
  }
});

export default Screen;
