import NavigationService from '../NavigationService';

import React, { useState, useEffect } from 'react';
import { useStateValue } from '../state';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
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
  Modal,
} from 'react-native-paper';
import Carousel from 'react-native-snap-carousel';
import { KeyboardAwareScrollView as ScrollView } from 'react-native-keyboard-aware-scroll-view';
import { getSlots, yymmdd, message, alert } from '../utils';
import styles from './Styles';
import { Colors } from './Styles';
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
    maxDate: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 90),
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
      console.log(prices);
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

  const sliderWidth = Dimensions.get('window').width;
  const {
    address,
    area,
    name: roomName,
    photos: carouselBanner,
    pricePerHour,
  } = props.navigation.state.params.room;
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View styles={{ height: '100%' }}>
          <Carousel
            autoplay={true}
            loop={true}
            data={carouselBanner}
            sliderWidth={sliderWidth}
            itemWidth={sliderWidth}
            renderItem={({ item, index }) => (
              <Animated.View
                style={{
                  width: '100%',
                  height: 200,
                  opacity: state.opacity,
                }}>
                <Image
                  source={{
                    url: item,
                  }}
                  style={{
                    width: '100%',
                    height: 300,
                  }}
                  onLoadStart={e => {
                    state.opacity.setValue(0);
                  }}
                  onLoadEnd={e => {
                    Animated.timing(state.opacity, {
                      toValue: 1,
                      duration: 500,
                      useNativeDriver: true,
                    }).start();
                  }}
                />
              </Animated.View>
            )}
          />
          <View style={style.header}>
            <Headline style={style.name}>{roomName}</Headline>
            <Text style={style.address}>{address}</Text>
            <Text style={style.price}>
              {`時租$${pricePerHour} - ${area}尺空間`}
            </Text>
          </View>
          <View style={style.datePickerContainer}>
            <Text style={style.subtitle}>請選擇日期</Text>
            <Button
              mode="outlined"
              color="black"
              onPress={onChooseDateButton}
              style={{ marginTop: 8, borderColor: 'black' }}
              theme="red">
              <Text style={{ fontSize: 12 }}>{selectedDate}</Text>
            </Button>
            <Portal>
              <Modal visible={state.isCalShow} onDismiss={hideCal}>
                <Calendar
                  onDayPress={day => {
                    onSelectDate(day.dateString);
                  }}
                  markedDates={{
                    [selectedDate]: { selected: true },
                  }}
                  minDate={state.today}
                  maxDate={state.maxDate}
                  style={style.calendar}
                  theme={{
                    todayTextColor: '#2d4150',
                  }}
                />
              </Modal>
            </Portal>
          </View>
          <View style={style.timePickerContainer}>
            <Text
              style={{
                ...style.subtitle,
                marginHorizontal: 30,
                marginBottom: 5,
              }}>
              請選擇時間
            </Text>
            <ScrollView>
              {state.isCustom ? (
                <Text style={style.specialArrangementText}>是日有特別安排</Text>
              ) : null}
              {state.isOpen ? (
                ['am', 'pm'].map(ampm => (
                  <View key={ampm} style={style.half}>
                    <Text style={style.ampm}>
                      {ampm == 'am' ? '上午' : '下午'}
                    </Text>
                    <View style={style.timePickerOptions}>
                      {Object.keys(state.timeslots)
                        .filter(
                          x => (ampm == 'pm') != state.timeslots[x] < '12:00',
                        )
                        .map(k => (
                          <Text
                            key={'dummy' + state.timeslots[k]}
                            onPress={selectSlot.bind(this, state.timeslots[k])}
                            style={{
                              ...style.slottext,
                              backgroundColor:
                                state.booked[state.timeslots[k]] ||
                                state.isInCart[state.timeslots[k]]
                                  ? 'gray'
                                  : state.slots[state.timeslots[k]]
                                  ? Colors.selectedText
                                  : timeOptionColor,
                            }}>
                            {state.timeslots[k]}
                          </Text>
                        ))}
                    </View>
                  </View>
                ))
              ) : (
                <View>
                  <Text style={style.specialArrangementText}>是日休息</Text>
                </View>
              )}
            </ScrollView>
          </View>
          <View style={style.buttonContainer}>
            <Button
              color="white"
              style={{
                ...style.button,
                borderTopRightRadius: 10,
                borderBottomRightRadius: 10,
              }}
              onPress={book.bind(this, false)}>
              <Text style={style.buttonText}>加入購物車</Text>
            </Button>
            <Button
              color="white"
              style={{
                ...style.button,
                borderTopLeftRadius: 10,
                borderBottomLeftRadius: 10,
              }}
              onPress={book.bind(this, true)}>
              <Text style={style.buttonText}>立即租訂</Text>
            </Button>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const containerBackgroundColor = '#9BC4D8';
const timeOptionColor = '#9BC4D8';

const style = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',

    padding: 20,
    paddingTop: 30,
  },
  header: {
    backgroundColor: containerBackgroundColor,
    paddingTop: 5,
    paddingBottom: 10,
    marginBottom: 15,
  },
  name: {
    fontSize: 28,
    textAlign: 'center',
  },
  address: {
    fontSize: 14,
    letterSpacing: 2,
    textAlign: 'center',
    marginBottom: 3,
  },
  price: {
    fontSize: 10,
    textAlign: 'center',
  },
  datePickerContainer: {
    marginVertical: 8,
    marginHorizontal: 30,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '300',
    letterSpacing: 5,
  },
  specialArrangementText: {
    marginHorizontal: 30,
    marginVertical: 7,
    fontWeight: '500',
  },
  calendar: {
    // height: 300
    margin: 10,
  },
  timePickerContainer: {
    flex: 1,
    flexGrow: 1,
    marginTop: 12,
  },
  timePickerOptions: {
    flex: 0,
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: 20,
    marginBottom: 10,
  },
  scrollContainer: {
    height: 80,
    backgroundColor: 'red',
  },
  ampm: {
    width: '100%',
    color: 'white',
    backgroundColor: '#2560A4',
    fontSize: 13,
    paddingVertical: 8,
    paddingLeft: 15,
    marginBottom: 11,
  },
  half: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  text: {
    fontSize: 20,
    marginRight: 4,
  },
  slottext: {
    width: 58,
    height: 23,
    overflow: 'hidden',
    borderColor: timeOptionColor,
    borderRadius: 7,
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 23,
    textAlign: 'center',
    marginRight: 10,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  button: {
    color: 'white',
    backgroundColor: '#225599',
    width: '35%',
    height: 35,
  },
  buttonText: {
    fontSize: 12,
  },
});

export default Screen;
