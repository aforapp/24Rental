import NavigationService from '../NavigationService';

import React, {useState, useEffect} from 'react';
import {useStateValue} from '../state';
import {View, Text, StyleSheet, Animated, Dimensions} from 'react-native';
import {Image} from '../components/UI';
import {
  Headline,
  TextInput,
  Button,
  Snackbar,
  Card,
  Title,
  Paragraph,
} from 'react-native-paper';
import Carousel from 'react-native-snap-carousel';

import MapView, {Marker} from 'react-native-maps';
import {KeyboardAwareScrollView as ScrollView} from 'react-native-keyboard-aware-scroll-view';
import styles from './Styles';

const Screen = props => {
  const [state, setState] = useState({
    room: {
      photos: [],
    },
    opacity: new Animated.Value(0),
    region: {
      latitude: 0,
      longitude: 0,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    },
  });

  let obj = props.navigation.state.params.room;
  useEffect(() => {
    Object.keys(obj).forEach(
      k => !obj[k] && obj[k] !== undefined && delete obj[k],
    );
    const room = {
      area: '--',
      pricePerHour: '--',
      address: '--',
      contactNumber: '--',
      createdBy: '--',
      ...obj,
    };

    // let openDays = '星期日至六，公眾假期休息';
    // let openDays = "";

    dates = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
    dateNames = {
      sun: '日',
      mon: '一',
      tue: '二',
      wed: '三',
      thu: '四',
      fri: '五',
      sat: '六',
      holiday: '公眾假期',
    };

    let open = [];
    let close = [];

    // for (let i of dates) {
    //   if (room.openingHours[i].isOpen) {
    //     open.push(dateNames[i]);
    //   } else {
    //     close.push(dateNames[i]);
    //   }
    // }
    // if (open.length > 0) {
    //   openDays += "星期" + open.join("");
    // }
    // if (room.openingHours["holiday"].isOpen) {
    //   if (open.length > 0) {
    //     openDays += "及";
    //   }
    //   openDays += "公眾假期";
    // }
    // if (openDays.length > 0) {
    //   openDays += "開放";
    // }
    // if (close.length > 0) {
    //   if (openDays.length > 0) {
    //     openDays += ",";
    //   }
    //   openDays += "星期" + close.join("");
    // }
    // if (!room.openingHours["holiday"].isOpen) {
    //   if (close.length > 0) {
    //     openDays += "及";
    //   }
    //   openDays += "公眾假期";
    // }

    // if (close.length > 0 || !room.openingHours["holiday"].isOpen) {
    //   openDays += "休息";
    // }
    // console.warn(room);
    setState({
      ...state,
      room,
      // openDays,
      region: {
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
        ...props.navigation.state.params.room.location,
      },
    });
  }, []);

  bookRoom = () => {
    // console.warn(state.room);
    NavigationService.navigate('RoomTimeSlots', {room: state.room});
  };

  const sliderWidth = Dimensions.get('window').width;

  return (
    <View styles={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View styles={{height: '100%'}}>
          <Carousel
            autoplay={true}
            loop={true}
            data={props.navigation.state.params.room.photos}
            sliderWidth={sliderWidth}
            itemWidth={sliderWidth}
            renderItem={({item, index}) => (
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
            <Headline style={style.name}>{state.room.name}</Headline>
            <Text style={style.address}>{state.room.address}</Text>
            <Text style={style.price}>
              {`時租$${state.room.pricePerHour} - ${state.room.area}尺空間`}
            </Text>
          </View>
          <View style={{flex: 1, alignItems: 'center'}}>
            <Button
              mode="contained"
              style={style.buttonTimetable}
              onPress={this.bookRoom}>
              查看時間表
            </Button>
          </View>
          <View style={style.map}>
            <MapView
              style={{width: '85%', height: 200}}
              initialRegion={state.region}
              region={state.region}>
              <Marker
                title={state.room.name}
                description=""
                coordinate={state.region}
              />
            </MapView>
          </View>
          {
            // <Text>{"開放時間：" + state.openDays}</Text>
          }
          <View style={style.descriptionContainer}>
            <Text style={style.description}>
              電話{'\n'}
              {state.room.contactNumber}
            </Text>
          </View>
          <View style={style.descriptionContainer}>
            <Text style={style.description}>
              備註{'\n'}
              {(state.room.description || 'N/A').replace(/\\n/g, '\n')}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const containerBackgroundColor = '#9BC4D8';

const style = StyleSheet.create({
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
  buttonTimetable: {
    width: '85%',
  },
  map: {
    alignItems: 'center',
    marginVertical: 17,
  },
  descriptionContainer: {
    flex: 1,
    alignItems: 'center',
    marginTop: 4,
  },
  description: {
    fontSize: 11,
    lineHeight: 15,
    width: '85%',
    padding: 8,
    backgroundColor: containerBackgroundColor,
  },
});

export default Screen;
