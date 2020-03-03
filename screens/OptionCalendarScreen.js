import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Button, Title } from 'react-native-paper';
import { SlotButton } from '../components/UI';
import { KeyboardAwareScrollView as ScrollView } from 'react-native-keyboard-aware-scroll-view';
import { slotToText } from '../utils.js';

import { Colors } from './Styles';

const Screen = props => {
  const options = props.navigation.state.params.options;
  const returnData = props.navigation.state.params.returnData;

  const [state, setState] = useState({
    markedDates: options.markedDates,
    markedDatesAry: options.markedDatesAry,
    searchPeriod: options.searchPeriod,
  });

  const onSelectDate = date => {
    let markedDates = {};
    let markedDatesAry = state.markedDatesAry || [];

    let ind = markedDatesAry.indexOf(date);
    if (ind === -1) {
      markedDatesAry.push(date);
    } else {
      markedDatesAry.splice(ind, 1);
    }
    markedDatesAry.map(x => {
      markedDates[x] = { marked: true };
    });

    setState({ ...state, markedDates, markedDatesAry });
  };

  const updateSlot = ind => {
    let v = state.searchPeriod.slots[ind];
    let searchPeriod = state.searchPeriod;
    searchPeriod.slots[ind] = v === 0 ? 1 : 0;
    setState({ ...state, searchPeriod });
  };

  const onSubmit = () => {
    returnData({
      markedDates: state.markedDates,
      markedDatesAry: state.markedDatesAry,
      searchPeriod: state.searchPeriod,
    });
    props.navigation.goBack();
  };

  return (
    <View style={style.container}>
      <Title style={style.title}>時間</Title>
      <View style={style.calendarContainer}>
        <View style={style.datePicker}>
          <Calendar
            onDayPress={day => {
              onSelectDate(day.dateString);
            }}
            markedDates={state.markedDates}
            minDate={options.today}
            maxDate={options.maxDate}
            theme={{
              todayTextColor: '#2d4150',
            }}
          />
        </View>
        <ScrollView>
          <View style={style.timePicker}>
            {state.searchPeriod.slots.map((x, ind) => (
              <View key={'slot' + ind} style={{ width: '25%', height: 33 }}>
                <SlotButton
                  title={slotToText(ind)}
                  on={state.searchPeriod.slots[ind] === 1 ? true : false}
                  index={ind}
                  onValueUpdate={() => updateSlot(ind)}
                />
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
      <Button
        style={{ backgroundColor: '#2560A4' }}
        color="white"
        onPress={onSubmit}>
        確定
      </Button>
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: Colors.bg,
    height: '100%',
    paddingTop: 10,
  },
  title: {
    color: Colors.title,
    marginLeft: 30,
  },
  calendarContainer: {
    borderWidth: 1,
    borderColor: '#616A6B',
    marginBottom: 30,
    marginHorizontal: 30,
    height: '82%',
    backgroundColor: 'white',
  },
  datePicker: {
    paddingBottom: 10,
    width: '100%',
    margin: 'auto',
  },
  timePicker: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 25,
    paddingBottom: 20,
  },
});

export default Screen;
