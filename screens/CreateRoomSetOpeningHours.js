import NavigationService from '../NavigationService';

import _ from 'lodash';
import React, { Component } from 'react';
import { SafeAreaView } from 'react-navigation';
import { Button } from '../components/UI';
import { TimeSlotSelector } from '../components/TimeSlotSelector';

import {
  // Button,
  Modal,
  TouchableHighlight,
  TouchableOpacity,
} from 'react-native';
import DateTimePicker from 'react-native-modal-datetime-picker';

import { View, StyleSheet } from 'react-native';
import {
  Headline,
  TextInput,
  Snackbar,
  Card,
  Title,
  Text,
  Paragraph,
  List,
  Checkbox,
  Switch,
  IconButton,
} from 'react-native-paper';
import { KeyboardAwareScrollView as ScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from './Styles';
import {
  slotToText,
  slotsToText,
  textSlotsToslots,
  textslotsToText,
} from '../utils.js';
import { Colors } from './Styles';

function datesToBinary(ary) {
  let ret = [];

  let dates = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'PUB'];

  dates.map(x => {
    ret.push(ary.indexOf(x) == -1 ? 0 : 1);
  });
  return ret;
}

function getPreview(periods) {
  let dates = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'PUB'];
  let baseSlot =
    '[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]';
  let grid = {};

  dates.map(d => {
    grid[d] = JSON.parse(baseSlot);
  });

  periods.map(period => {
    period.dates.map(d => {
      for (let i = 0; i < 48; i++) {
        if (period.slots[i] != 0) {
          grid[d][i] = period.price;
        }
      }
    });
  });

  return grid;
}

function getDuplicated(periods) {
  let dates = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'PUB'];
  let baseSlot =
    '[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]';
  let grid = {};
  let gridDup = {};

  dates.map(d => {
    grid[d] = JSON.parse(baseSlot);
    gridDup[d] = JSON.parse(baseSlot);
  });

  periods.map(period => {
    period.dates.map(d => {
      let slots = textSlotsToslots(period.slots);
      for (let i = 0; i < 48; i++) {
        if (slots[i] != 0) {
          grid[d][i]++;
        }
      }
    });
  });

  let ret = [];
  dates.map(d => {
    for (let i = 0; i < 48; i++) {
      if (grid[d][i] > 1) {
        gridDup[d][i] = 1;
      }
    }
    let text = slotsToText(gridDup[d]);
    if (text != '') {
      ret.push({ date: dateNames[d], text });
    }
  });

  return ret;
}

function getRemainingDates(periods) {
  let ret = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'PUB'];
  periods.map(x =>
    x.dates.map(y => {
      ret = ret.filter(z => z != y);
    }),
  );
  return ret;
}

function weekdayToText(ary) {
  let gotWeekday = false;
  let gotPublicHoliday = false;

  let ret = '';

  if (ary.indexOf('SUN') != -1) {
    gotWeekday = true;
    ret += '日';
  }
  if (ary.indexOf('MON') != -1) {
    gotWeekday = true;
    ret += '一';
  }
  if (ary.indexOf('TUE') != -1) {
    gotWeekday = true;
    ret += '二';
  }
  if (ary.indexOf('WED') != -1) {
    gotWeekday = true;
    ret += '三';
  }
  if (ary.indexOf('THU') != -1) {
    gotWeekday = true;
    ret += '四';
  }
  if (ary.indexOf('FRI') != -1) {
    gotWeekday = true;
    ret += '五';
  }
  if (ary.indexOf('SAT') != -1) {
    gotWeekday = true;
    ret += '六';
  }
  if (ary.indexOf('PUB') != -1) {
    gotPublicHoliday = true;
  }

  if (gotWeekday) {
    ret = '逢星期' + ret;
  }
  if (gotPublicHoliday) {
    if (ret != '') {
      ret += '及';
    }
    ret += '公眾假期';
  }
  if (ret == '') {
    ret = '無';
  }
  return ret;
}

const dateNames = {
  SUN: '星期日',
  MON: '星期一',
  TUE: '星期二',
  WED: '星期三',
  THU: '星期四',
  FRI: '星期五',
  SAT: '星期六',
  PUB: '公眾假期',
};

class Screen extends React.Component {
  // dateNames = {
  //   sun: "星期日",
  //   mon: "星期一",
  //   tue: "星期二",
  //   wed: "星期三",
  //   thu: "星期四",
  //   fri: "星期五",
  //   sat: "星期六",
  //   holiday: "公眾假期"
  // };

  constructor(props) {
    super(props);
    let baseSlot =
      '[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]';
    // console.warn(JSON.parse(baseSlot));
    this.state = {
      on: [false, false, false, true, false, false, false],
      modalVisible: false,
      slots: JSON.parse(baseSlot),
      periods: [],
    };
  }

  UNSAFE_componentWillMount(props) {
    let openingHours = _.get(
      this.props,
      'navigation.state.params.openingHours',
    );
    // if (_.get(this.props, "navigation.state.params.isEdit")) {
    if (openingHours != null) {
      this.setState({ periods: openingHours });
    }

    // console.warn(openingHours);
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  editPeriod(ind) {
    this.setModalVisible(true);

    let editPeriod = {
      index: -1,
      slots: [],
      on: [false, false, false, false, false, false, false, false],
      price: null,
    };

    for (let i = 0; i < 48; i++) {
      editPeriod.slots.push(0);
    }

    if (ind !== -1) {
      editPeriod.index = ind;
      editPeriod.price = this.state.periods[ind].price;
      editPeriod.slots = textSlotsToslots(this.state.periods[ind].slots);
      editPeriod.on = datesToBinary(this.state.periods[ind].dates);
    }
    this.setState({ editPeriod });
  }

  removePeriod(ind) {
    let periods = this.state.periods;
    // if (periods.length > 1) {
    periods.splice(ind, 1);
    this.setState({ periods });
    // }
  }
  confirm = () => {
    this.props.navigation.state.params.returnData({
      openingHours: this.state.periods,
    });
    this.props.navigation.goBack();
  };

  savePeriod(data) {
    // console.warn(periods, period);
    // let ind = period.index;
    // // delete period.index;
    // if (period.index == -1) {
    let period = {};
    period.dates = [];
    period.price = data.price;
    if (data.on[0]) {
      period.dates.push('SUN');
    }
    if (data.on[1]) {
      period.dates.push('MON');
    }
    if (data.on[2]) {
      period.dates.push('TUE');
    }
    if (data.on[3]) {
      period.dates.push('WED');
    }
    if (data.on[4]) {
      period.dates.push('THU');
    }
    if (data.on[5]) {
      period.dates.push('FRI');
    }
    if (data.on[6]) {
      period.dates.push('SAT');
    }
    if (data.on[7]) {
      period.dates.push('PUB');
    }
    period.slots = [];
    for (let i = 0; i < 48; i++) {
      if (data.slots[i]) {
        period.slots.push(slotToText(i));
      }
    }

    let periods = this.state.periods;
    if (data.index == -1) {
      periods.push(period);
    } else {
      periods[data.index] = period;
    }

    this.setState({ periods });
    this.setModalVisible(false);
  }

  render() {
    return (
      <View style={style.container}>
        <Modal
          animationType="fade"
          transparent={false}
          visible={this.state.modalVisible}>
          <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent' }}>
            <TimeSlotSelector
              period={this.state.editPeriod}
              ok={period => this.savePeriod(period)}
              cancel={() => this.setModalVisible(false)}
            />
          </SafeAreaView>
        </Modal>
        {this.state.periods.length == 0 && (
          <View
            style={{
              ...style.line,
              width: '100%',
              flex: 1,
              flexDirection: 'column',
              justifyContent: 'center',
              flexGrow: 1,
            }}>
            <Text style={{ fontSize: 20, width: '100%', textAlign: 'center' }}>
              請按新增加入時段及收費
            </Text>
          </View>
        )}
        {/* <ScrollView style={{ ...style.line }}> */}
        {getDuplicated(this.state.periods).length > 0 && (
          <View style={{}}>
            {getDuplicated(this.state.periods).map((x, ind) => (
              <Text key={'dup' + x.date}>
                {ind == 0 ? '請更正重複設定\n' : ''}
                {x.date} {x.text}
              </Text>
            ))}
          </View>
        )}
        {this.state.periods.map((period, ind) => (
          <View
            key={'period' + ind}
            style={{
              borderWidth: 1,
              borderColor: 'gray',
              borderRadius: 10,
              borderStyle: 'solid',
              marginBottom: 4,
              padding: 8,
              flexDirection: 'row',
            }}>
            <View style={{ width: '80%', marginLeft: 10 }}>
              <Headline style={style.textMain}>時段{ind + 1}</Headline>
              <Text style={style.textMain}>
                日子：{weekdayToText(period.dates)}
              </Text>
              <Text style={style.textMain}>
                時段：{textslotsToText(period.slots)}
              </Text>
              <Text style={style.textMain}>價錢：${period.price}</Text>
            </View>
            <View
              style={{
                width: '20%',
                flex: 1,
                flexDirection: 'column',
                marginLeft: 10,
              }}>
              <IconButton
                icon="edit"
                color="#225599"
                size={30}
                onPress={this.editPeriod.bind(this, ind)}
              />
              <IconButton
                icon="cancel"
                color="red"
                size={30}
                onPress={this.removePeriod.bind(this, ind)}
              />
            </View>
          </View>
        ))}
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'center',
          }}>
          <IconButton
            icon="add-circle"
            color="#225599"
            size={40}
            onPress={this.editPeriod.bind(this, -1)}
          />
        </View>
        {/* </ScrollView> */}

        {false && <Text>全日休息</Text>}
        {false && (
          <Text>
            日子：{weekdayToText(getRemainingDates(this.state.periods))}
          </Text>
        )}

        <View style={{ ...style.line, height: 40 }}>
          <Button title="確定" onPress={this.confirm} />
        </View>
      </View>
    );
  }
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
    backgroundColor: 'white',
    height: '100%',
  },
  line: {
    flex: 0,
    // flexShrink: 0
  },
  button: {
    backgroundColor: '#225599',
    margin: 10,
    width: 100,
  },
  weekdayTitle: {
    fontSize: 12,
  },
  weekdays: {
    width: '14%',
    textAlign: 'center',

    height: 40,
    color: 'white',
    backgroundColor: 'blue',
  },
  textMain: {
    color: Colors.main,
  },
});

export default Screen;
