import React from 'react';
import { View, Text, ScrollView, StyleSheet, Alert } from 'react-native';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import {
  Headline,
  TextInput,
  Button,
  Snackbar,
  Card,
  Title,
  Paragraph,
} from 'react-native-paper';
import { validateEmail } from '../utils';
import TextInputField from '../components/TextInputField';
import { emailErrorType, repeatPasswordErrorType } from '../constants';
import firebase from 'react-native-firebase';

export default class Screen extends React.Component {
  state = {
    slots: {},
    selectedDate: '',
  };

  timeslots = [];

  numRow = [];
  numCol = [1, 2, 3, 4, 5, 6];

  constructor(props) {
    super(props);
    const that = this;

    for (let i = 0; i < 2400; i += 100) {
      for (let j = 0; j < 60; j += 30) {
        let s = i + j + '';
        if (s.length == 3) {
          s = '0' + s;
        } else if (s.length == 2) {
          s = '00' + s;
        } else if (s.length == 1) {
          s = '000' + s;
        }
        this.timeslots.push(s);
      }
    }
    for (let i = 0; i < this.timeslots.length; i += 6) {
      this.numRow.push(1);
    }
  }

  selectSlot(slot, ava) {
    // console.warn(slot + !ava);
    this.setState({ slots: { [slot]: !ava } });
  }

  bookNow = () => {
    const ret = Object.keys(this.state)
      .map((k, i) => (this.state[k] ? '' : k))
      .filter(x => x != '')
      .sort();

    firebase
      .firestore()
      .collection('bookings')
      // .where('owner',"==", uid)
      .get()
      .then(sp => {
        const booked = sp.docs.map(doc => doc.data());
        let ok = true;
        booked.map(b => {
          if (b.room != '') {
            b.slots.split(',').map(s => {
              if (ret.indexOf(s) != -1) {
                ok = false;
              }
            });
          }
        });
        if (!ok) {
          Alert.alert('房間已被其他人訂了');
        } else {
          Alert.alert('訂房成功');
        }
      })
      .catch(err => {
        console.log('RoomBookingConfirm bookNow err: ', err);
      });
  };

  onSelectDate(d) {
    this.setState({ selectedDate: d });
  }

  render() {
    let k = 0;
    return (
      <View flex-1>
        <ScrollView contentContainerStyle={style.container}>
          <Calendar
            onDayPress={day => {
              this.onSelectDate(day.dateString);
            }}
            markingType={'period'}
          />
          <View style={style.container}>
            <Text>{this.state.selectedDate}</Text>
            <View style={style.half}>
              <Text>上午</Text>
              {Object.keys(this.timeslots)
                .filter(x => this.timeslots[x] < '1200')
                .map(k => (
                  <Text
                    onPress={this.selectSlot.bind(this, this.timeslots[k])}
                    style={{
                      color: this.state.slots[this.timeslots[k]]
                        ? 'red'
                        : 'blue',
                    }}>
                    {this.timeslots[k]}
                  </Text>
                ))}
            </View>
            <View style={style.half}>
              <Text>下午</Text>
              {Object.keys(this.timeslots)
                .filter(x => this.timeslots[x] >= '1200')
                .map(k => (
                  <Text
                    onPress={this.selectSlot.bind(this, this.timeslots[k])}
                    style={{
                      color: this.state.slots[this.timeslots[k]]
                        ? 'red'
                        : 'blue',
                    }}>
                    {this.timeslots[k]}
                  </Text>
                ))}
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <Button color="white" style={styles.button}>
              加入購物車
            </Button>
            <Button color="white" style={styles.button} onPress={this.bookNow}>
              立即租訂
            </Button>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const style = StyleSheet.create({});

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    color: 'white',
    backgroundColor: '#225599',
    width: '40%',
    height: 40,
  },
});
