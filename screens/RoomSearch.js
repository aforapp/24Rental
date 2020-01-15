import NavigationService from '../NavigationService';

import _ from 'lodash'
import React, { useState, useEffect } from 'react';
import { useStateValue } from '../state';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
// import Tags from "react-native-tags";
import {
  Platform,
  TouchableHighlight,
  View,
  Animated,
  StyleSheet,
  Modal,
  FlatList
} from 'react-native';
import { Image, HeaderButton, ImageBackground } from '../components/UI';
import { SafeAreaView } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';
import { KeyboardAwareScrollView as ScrollView } from 'react-native-keyboard-aware-scroll-view';
// import { TimeSlotSelector } from '../components/TimeSlotSelector';
import { SlotButton, Button as UIButton } from '../components/UI';
import { slotToText, slotsToText } from '../utils.js';
import { Dimensions } from 'react-native';
import { SearchBar } from 'react-native-elements';

import {
  Button,
  Card,
  Checkbox,
  Headline,
  // List,
  Paragraph,
  Snackbar,
  Text,
  TextInput,
  Title
} from 'react-native-paper';
import Accordion from 'react-native-collapsible/Accordion';

import firebase from 'react-native-firebase';
import styles from './Styles';
import { Colors } from './Styles';

const ANY = '任何';

const Screen = props => {
  let [search, setSearch] = useState('');
  const [{ auth }, dispatch] = useStateValue();
  // const [tags, setTags] = useState(['a', 'b', 'c']);
  const [state, setState] = useState({

    activeSections: [],
    activeSections2: [],
    type: null,
    district: null,
    price: null,
    area: null,
    facilities: null,
    // pullDownSections: [{
    //   title: '服務：任何',
    // },
    // {
    //   title: '地區：任何'
    // },
    // {
    //   title: '日期：任何'
    // },
    // {
    //   title: '時租：任何'
    // },
    // {
    //   title: '呎吋：任何'
    // },
    // {
    //   title: '設施：任何'
    // }
    // ],
    sortCrit: '人氣',

    today: new Date(),
    maxDate: new Date(new Date().getTime() + 24 * 60 * 60 * 1000 * 365),

    imageOpacity: {},

    expanded: false,
    // maxHeight: 800,
    // minHeight: 50,
    // animation: new Animated.Value(50),
    modalVisible: false,
    searchPeriod: {
      on: [true, true, true, true, true, true, true, true],
      slots: [
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
      ]
    }
  });


  chooseType = () => {
    const returnData = (data) => {
      setState({ ...state, type: data.data[0] == ANY ? null : data.data[0] })
    }
    showOptions(
      {
        title: '服務',
        multiSelect: false,
        selected: state.type || ANY,
        items: [
          ANY,
          '跳舞室',
          '派對室',
          'Band房'
        ]
      },
      returnData
    )
  };

  chooseDistrict = () => {
    const returnData = (data) => {
      setState({ ...state, district: data.data[0] == ANY ? null : data.data[0] })
    }
    showOptions(
      {
        title: '地點',
        multiSelect: false,
        selected: state.district || ANY,
        items: [
          { title: ANY },
          ANY,
          { title: '香港島' },
          '中西區', '灣仔區', '東區', '南區',
          { title: '九龍' },
          '油尖旺區', '深水埗區', '九龍城區', '觀塘區',
          { title: '新界' },
          '葵青區',
          '荃灣區',
          '屯門區',
          '元朗區',
          '北區',
          '大埔區',
          '沙田區',
          '西貢區',
          '離島區'
        ]
      },
      returnData
    )
  };


  choosePrice = () => {
    const returnData = (data) => {
      setState({ ...state, price: data.data[0] == ANY ? null : data.data[0] })
    }
    showOptions(
      {
        title: '時租',
        multiSelect: false,
        items: [
          ANY,
          '$100或以下',
          '$101至$200',
          '$201至$300',
          '$301至$400',
          '$401至$500',
          '$500以上',
        ]
      },
      returnData
    )
  };



  chooseArea = () => {
    const returnData = (data) => {
      setState({ ...state, area: data.data[0] == ANY ? null : data.data[0] })
    }
    showOptions(
      {
        title: '時租',
        multiSelect: false,
        items: [
          ANY,
          '100呎或以下',
          '101呎至200呎',
          '201呎至300呎',
          '301呎至400呎',
          '401呎至500呎',
          '500呎以上',
        ]
      },
      returnData
    )
  };


  chooseFacilities = () => {
    const returnData = (data) => {
      let crit = data.data;
      if (crit.length == 0 || crit[0] == ANY) {
        crit = null;
      }
      setState({ ...state, facilities: crit })
    }
    showOptions(
      {
        title: '時租',
        multiSelect: true,
        items: [
          ANY,
          'Studio 設備',
          '音響設備（可插咪）',
          '音響設備（不可插咪）',
          '無背椅',
          '有背椅',
          '方枱',
          '長枱',
          '有線咪',
          '無線咪',
          '白板',
          '投映機',
          '攝影器材',
          '儲物櫃',
          '儲物空間',
          '瑜伽墊',
          '瑜伽磚',
          '空中瑜伽設備',
          '健身器材（大）',
          '健身器材（小）',
          '拳擊用品',
          '健康舞踏板',
          '鋼管',
        ]
      },
      returnData
    )
  };


  // chooseType = () => {
  //   let pickerData = [ANY, '跳舞室', '派對室', 'Band房'];

  //   Picker.init({
  //     pickerData: pickerData,
  //     pickerTitleText: '請選擇',
  //     pickerConfirmBtnText: '確定',
  //     pickerCancelBtnText: '取消',
  //     selectedValue: [ANY],
  //     onPickerConfirm: data => {
  //       setState({...state, type: data[0], blocker: false})
  //     },
  //     onPickerCancel: data => {
  //       setState({...state, blocker: false});
  //     },
  //     onPickerSelect: data => {
  //         // console.warn(data);
  //     }
  //   });
  //   Picker.show();
  //   setState({...state, blocker: true});
  // }


  // chooseDistrict = () => {
  //   let districtData = [
  //     {ANY: [ANY]},
  //     {'香港島': ['中西區', '灣仔區', '東區', '南區']},
  //     {'九龍': ['油尖旺區', '深水埗區', '九龍城區', '觀塘區']},
  //     {'新界': [
  //       '葵青區',
  //       '荃灣區',
  //       '屯門區',
  //       '元朗區',
  //       '北區',
  //       '大埔區',
  //       '沙田區',
  //       '西貢區',
  //       '離島區'
  //     ]}];

  //   Picker.init({
  //     pickerData: districtData,
  //     pickerTitleText: '請選擇',
  //     pickerConfirmBtnText: '確定',
  //     pickerCancelBtnText: '取消',
  //     // selectedValue: ['香港島', '中西區'],
  //     selectedValue: [ANY, ANY],
  //     onPickerConfirm: data => {
  //       setState({...state, district: data[1], blocker: false})
  //     },
  //     onPickerCancel: data => {
  //       setState({...state, blocker: false});
  //     },
  //     onPickerSelect: data => {
  //       // console.warn(data);
  //     }
  //   });
  //   Picker.show();
  //   setState({...state, blocker: true});
  // }



  search = () => {
    let roomsRef = firebase.firestore().collection('rooms');

    if (state.type != null && state.type != ANY) {
      // console.warn(state.type)
      roomsRef = roomsRef.where('type', '==', state.type);
    }
    else if (state.district != null && state.district != ANY) {
      // console.warn(state.district)
      roomsRef = roomsRef.where('district', '==', state.district);
    }
    else if (state.price != null) {
      // console.log(state.price)

      let map = {
      '$100或以下': 100,
      '$101至$200': 200,
      '$201至$300': 300,
      '$301至$400': 400,
      '$401至$500': 500,
      '$500以上': 100000000
      };
      let maxPrice = map[state.price] || 100000000;

      console.log('maxPrice', maxPrice)

      //NOT WORKING, DON'T KNOW WHY
      // roomsRef = roomsRef.where('pricePerHour', '<=', maxPrice);
    }
    else if (state.area != null) {
      console.log(state.area)

      let map = {
        '100呎以下': 100,
        '101呎至200呎': 200,
        '201呎至300呎': 300,
        '301呎至400呎': 400,
        '401呎至500呎': 500,
        '500呎以上': 100000000,
      };
      let maxArea = map[state.area] || 100000000;
      console.log('maxArea', maxArea)
      roomsRef = roomsRef.where('area', '<=', maxArea);
    }
    else if (state.facilities != null && state.facilities.length > 0) {
      console.log(state.facilities)
      roomsRef = roomsRef.where('facilities', 'array-contains', state.facilities[0]);
    }

    


    let wip = 0;
    let slotAry = state.markedDatesAry || [];
    let slotTimeAry = state.searchPeriod.slots || [];

    let rooms = [];
    let roomData = null; //fulllist of room
    let result = [];

    let showResult = () => {
      if (wip == 0) {
        if (slotAry.length > 0) {
          roomData.map(x => {
            if (result.indexOf(x.id) != -1) {
              rooms.push(x);
            }
          });
        } else {
          rooms = roomData;
        }
        // console.warn(rooms)
        setState({ ...state, rooms, activeSections2: [] });
      }
    };

    /*
     * algo:
     * If timeslot is not selected, each selected date initate a search for availability.
     *
     * if timeslot is selected, take the first one of each selected date to initate a search for availability.
     * Then the result time slots of the date are checked against all requested timeslots.
     *
     * Finally, merge all result room ID into the list, and retrieve data from (potentially full data set of) room data list.
     *
     * TODO: add reference in "roomslots" collection to improve performance
     */

    setState({ ...state, activeSections2: [] });

    slotAry.map(d => {
      //selected dates
      let ts = null;
      for (let ind = 0; ind < slotTimeAry.length; ind++) {
        if (slotTimeAry[ind] == 1) {
          ts = slotToText(ind);
          break;
        }
      }

      let roomSlotsRef = firebase.firestore().collection('roomslots');
      wip++;

      roomSlotsRef = roomSlotsRef.where('date', '==', d);
      if (ts != null) {
        roomSlotsRef = roomSlotsRef.where('slots', 'array-contains', ts);
      }

      roomSlotsRef.get().then(s => {

        s.forEach(d => {
          //get available slots
          let av = d.data().slots;

          //check if any required slot not in available slots
          let ok = true;
          slotTimeAry.map((t, ind) => {
            if (t != 0 && av.indexOf(slotToText(ind)) == -1) {
              ok = false;
            }
          });
          if (ok) {
            result.push(d.data().roomId);
          }
        });
        wip--;
        showResult(); //this will check if all data downloaded itself
      });
    });

    wip++;
    roomsRef
      .get()
      .then(sp => {
        roomData = sp.docs.map(doc => doc.data());
        console.log('roomData', roomData.length)
        roomData = roomData.filter(x => {
          // console.log(x)
          let ret = true;

          if (ret && state.type != null && state.type != ANY) {
            if (x.type != state.type) {
              ret = false;
            }
          }
          if (ret && state.district != null && state.district != ANY) {
            if (x.district != state.district) {
              ret = false;
            }
          }
          if (ret && state.facilities != null && state.facilities.length > 0) {
            if (x.facilities == null) {
              ret = false;
            }
            else for (let i=0; i<state.facilities.length; i++) {
              if (x.facilities.indexOf(state.facilities[i]) == -1) {
                ret = false;
                break;
              }
            }
          }
          if (ret && state.price != null) {
            let minMap = {
              '$100或以下': -1,
              '$101至$200': 100,
              '$201至$300': 200,
              '$301至$400': 300,
              '$401至$500': 400,
              '$500以上': 500
            };
            let maxMap = {
              '$100或以下': 100,
              '$101至$200': 200,
              '$201至$300': 300,
              '$301至$400': 400,
              '$401至$500': 500,
              '$500以上': 100000000
            };
            if (x.pricePerHour <= minMap[state.price] || x.pricePerHour > maxMap[state.price]) {
              ret = false;
            }
          }
          if (ret && state.area != null) {
            let minMap = {
              '100呎或以下': -1,
              '101呎至200呎': 100,
              '201呎至300呎': 200,
              '301呎至400呎': 300,
              '401呎至500呎': 400,
              '500呎以上': 500,
            };
            let maxMap = {
              '100呎或以下': 100,
              '101呎至200呎': 200,
              '201呎至300呎': 300,
              '301呎至400呎': 400,
              '401呎至500呎': 500,
              '500呎以上': 100000000,
            };
      
            if (x.area <= minMap[state.area] || x.area > maxMap[state.area]) {
              ret = false;
            }
          }
          return ret;
        });
        console.log(roomData.length)
        wip--;
        showResult(); //this will check if all data downloaded itself
      })
      .catch(e => {
        console.log(e)
        console.warn(e);
      });
  };


  useEffect(() => {
    // this.items = {
    //   type: [ANY, '跳舞室', '派對室', 'Band房']
    //   // district: [ANY, '油尖旺區', '深水埗區', '九龍城區', '觀塘區']
    // };
    search();
    // let { height, width } = Dimensions.get('window');
    // setState({ ...state, maxHeight: Math.ceil(height * 0.8) });
  }, []);

  // changePrice = price => {
  //   setState({ ...state, price });
  // };

  // changeType = type => {
  //   setState({ ...state, type });
  // };

  // changeDistrict = district => {
  //   setState({ ...state, district });
  // };

  // _handlePress = () =>
  //   setState({ ...state, expanded: !state.expanded });

  selectSorting = (sortCrit) => {
    setState({ ...state, sortCrit });
  }

  // returnData = (data) => {
  //   setState({...state, ...data});
  // }

  showOptions = (options, returnData) => {
    NavigationService.navigate('OptionScreen', {
      options,
      returnData: returnData.bind(this)
    });
  }


  chooseRoom = (room) => {
    NavigationService.navigate('RoomDetails', { room });
  }

  setPeriod = (period) => {
    setState({ ...state, modalVisible: false });
  }

  onSelectDate = (date) => {
    markedDates = {};
    markedDatesAry = state.markedDatesAry || [];

    let ind = markedDatesAry.indexOf(date);
    if (ind == -1) {
      markedDatesAry.push(date);
    } else {
      markedDatesAry.splice(ind, 1);
    }

    markedDatesAry.map(x => {
      markedDates[x] = { marked: true };
    });

    setState({ ...state, markedDates, markedDatesAry });
  }

  updateSlot = (ind) => {
    let v = state.searchPeriod.slots[ind]
    let searchPeriod = state.searchPeriod;
    searchPeriod.slots[ind] = v == 0 ? 1 : 0;
    setState({ ...state, searchPeriod });
  }

  _renderSectionTitle = section => {
    return (
      <View style={{ height: 0 }}>
      </View>
    );
  };

  hasTimeSearch = () => {
    if ((state.markedDatesAry || []).length > 0) {
      (state.searchPeriod.slots || []).map(x => {
        if (x == 1) {
          return true;
        }
      })
      return true;
    }

    return false;
  }

  _renderContent = section => {
    return (
      <View style={style.menu}>
        <Text style={style.optionText}>選項：</Text>
        <View style={{ ...styles.row, flexWrap: 'wrap' }}>
          <TouchableHighlight style={state.type == null ? style.optionContent : style.optionContentSelected} onPress={() => chooseType()}>
            <View style={styles.row}>
              <Icon style={state.type == null ? style.optionIcon : style.optionIconSelected} size={18} name="group" />
              <Text style={state.type == null ? style.optionText : style.optionTextSelected}>服務</Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight style={state.district == null ? style.optionContent : style.optionContentSelected} onPress={() => chooseDistrict()}>
            <View style={styles.row}>
              <Icon style={state.district == null ? style.optionIcon : style.optionIconSelected} size={18} name="map-marker" />
              <Text style={state.district == null ? style.optionText : style.optionTextSelected}>地點</Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight style={ !hasTimeSearch() ? style.optionContent : style.optionContentSelected} onPress={() => setState({ ...state, modalVisible: true })}>
            <View style={styles.row}>
              <Icon style={!hasTimeSearch() ? style.optionIcon : style.optionIconSelected} size={18} name="calendar" />
              <Text style={!hasTimeSearch() ? style.optionText : style.optionTextSelected}>時間</Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight style={state.price == null ? style.optionContent : style.optionContentSelected} onPress={() => choosePrice()}>
            <View style={styles.row}>
              <Icon style={state.price == null ? style.optionIcon : style.optionIconSelected} size={18} name="money" />
              <Text style={state.price == null ? style.optionText : style.optionTextSelected}>時租</Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight style={state.area == null ? style.optionContent : style.optionContentSelected} onPress={() => chooseArea()}>
            <View style={styles.row}>
              <Icon style={state.area == null ? style.optionIcon : style.optionIconSelected} size={18} name="arrows-alt" />
              <Text style={state.area == null ? style.optionText : style.optionTextSelected}>呎寸</Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight style={state.facilities == null ? style.optionContent : style.optionContentSelected} onPress={() => chooseFacilities()}>
            <View style={styles.row}>
              <Icon style={state.facilities == null ? style.optionIcon : style.optionIconSelected} size={18} name="briefcase" />
              <Text style={state.facilities == null ? style.optionText : style.optionTextSelected}>設施</Text>
            </View>
          </TouchableHighlight>
        </View>
        {/* <Tags initialTags={tags} deleteTagOnPress={true} readonly={true} onTagPress={(e) => {let x = _.cloneDeep(tags);x.splice(e, 1);setTags(x);}}/> */}
        {/* <SearchBar
          placeholder="搜尋"
          onChangeText={setSearch}
          value={search}
          containerStyle={{shadowColor: 'white', backgroundColor: Colors.navButton, width: '70%', borderRadius: 8, borderWidth: 0,
                          marginLeft: 20,
                          marginRight: 20,
                          marginBottom: 12,
                      }}
          inputStyle={{color: 'white', fontSize: 16, backgroundColor: Colors.navButton, borderWidth: 0}}
          inputContainerStyle={{shadowColor: 'white', backgroundColor: Colors.navButton, borderColor: Colors.navButton, borderWidth: 0}}
          leftIconContainerStyle={{shadowColor: 'white', backgroundColor: Colors.navButton, borderColor: Colors.navButton, borderWidth: 0}}
          rightIconContainerStyle={{shadowColor: 'white', backgroundColor: Colors.navButton, borderColor: Colors.navButton, borderWidth: 0}}
        /> */}
        <View style={{ ...styles.row, justifyContent: 'center', marginTop: 10, width: '100%' }}>
          <TouchableHighlight style={{ ...style.optionContent, backgroundColor: Colors.navButton, color: Colors.main, borderColor: Colors.navButton, width: '50%' }}
            onPress={() => search()}>
            <View style={{ ...styles.row, justifyContent: 'center' }}>
              {/* <Icon style={style.optionIcon} size={20} name="search" /> */}
              <Text style={{ ...style.optionText }}>搜尋</Text>
            </View>
          </TouchableHighlight>
        </View>
        {/* <View style={{ ...style.line }}>
          <Button
            onPress={() => search()}
            mode="contained"
            style={{
              color: 'white',
              backgroundColor: '#225599',
              width: '40%',
              marginLeft: '30%'
            }}
          >
            搜尋
          </Button>
          </View> */}
      </View>
    );
  };
  _updateSections = activeSections => {
    setState({ ...state, activeSections });
  };
  _updateSections2 = activeSections2 => {
    setState({ ...state, activeSections2 });
  };


  return (
    <View style={{ ...styles.container }}>
      <Modal
        comment="dialog for date search"
        animationType="fade"
        transparent={false}
        visible={state.modalVisible}
      >
        <SafeAreaView>
          <View
            style={{
              borderWidth: 1,
              borderRadius: 10,
              borderColor: 'black',
              marginTop: 40,
              marginBottom: 40,
              marginLeft: 8,
              marginRight: 8,

              height: '90%',
              backgroundColor: '#BFDFEE'
            }}
          >

            <View
              style={{
                padding: 10,
                width: '100%',
                margin: 'auto'
              }}
            >
              <Calendar
                onDayPress={day => {
                  this.onSelectDate(day.dateString);
                }}
                markedDates={state.markedDates}
                minDate={state.today}
                maxDate={state.maxDate}
                theme={{
                  todayTextColor: '#2d4150'
                }}
              />
            </View>
            <ScrollView>
              <View
              style={{
                flex: 1,
                flexDirection: 'row',
                flexWrap: 'wrap',
                paddingBottom: 40
              }}
            >
              {state.searchPeriod.slots.map((x, ind) => (
                <View key={'slot' + ind} style={{ width: '25%', height: 40 }}>
                  <SlotButton
                    title={slotToText(ind)}
                    on={
                      state.searchPeriod.slots[ind] == 1 ? true : false
                    }
                    index={ind}
                    onValueUpdate={this.updateSlot.bind(this, ind)}
                  />
                </View>
              ))}
              </View>
            </ScrollView>
            <Button
              mode="contained"
              onPress={() => setState({ ...state, modalVisible: false })}
            >
              確定
            </Button>
          </View>
        </SafeAreaView>
      </Modal>

      <View
        style={{
          zIndex: 100,
          // borderRadius: 30, 
          backgroundColor: Colors.main
        }}
      >
        <Accordion
          // collapsed={false}
          underlayColor={Colors.main}
          sections={[{ title: 'haha' }]}
          activeSections={state.activeSections2}
          renderSectionTitle={section => {
            return (
              <View style={{ height: 0 }}>
              </View>
            )
          }}
          renderHeader={section => {
            return (
              <View style={{ height: 0 }}>
              </View>
            )
          }}
          renderContent={this._renderContent}
          onChange={activeSections2 => {
            setState({ ...state, activeSections2: [0] });
          }}
        />
        <View style={{ ...styles.row, width: '100%' }}>
          <View style={{ ...styles.row, width: '50%' }}>
            <Icon style={style.navIcon} size={24} name="navicon" onPress={() => setState({ ...state, activeSections2: state.activeSections2.length > 0 ? [] : [0] })} />
            <HeaderButton title="人氣" onPress={() => selectSorting('人氣')} active={state.sortCrit == '人氣'} />
            <HeaderButton title="價錢" onPress={() => selectSorting('價錢')} active={state.sortCrit == '價錢'} />
            <HeaderButton title="評分" onPress={() => selectSorting('評分')} active={state.sortCrit == '評分'} />
          </View>
          <View style={{ ...styles.row, width: '50%' }}>
            <HeaderButton title={"你好," + (auth.id == null ? '訪客' : auth.name)} onPress={() => { }} active={false} buttonStyle={{ width: '100%', marginRight: 10 }} textStyle={{ alignSelf: 'flex-end', textAlign: 'right' }} />
          </View>
        </View>
      </View>
      <View style={{ marginTop: 0, marginBottom: 30 }}>
        <View styles={{ height: '100%' }}>
          {(state.rooms || []).length == 0 ? (
            <View style={styles.centerScreen}>
              <Text>沒有搜尋條件內的房間</Text>
            </View>
          ) : null}

          <FlatList
            initialNumToRender={0}
            data={state.rooms}
            keyExtractor={(item, index) => item.id}
            renderItem={({ item }) => (
              <View>
                <ImageBackground source={{ url: item.photos[0] }} style={{ width: '100%', height: 244 }}
                  onPress={chooseRoom.bind(this, item)}>
                  <View style={style.roomText}>
                    <Text style={{ fontSize: 18, paddingBottom: 4 }}>{item.name}</Text>
                    <Text style={{ fontSize: 10, paddingBottom: 2 }}>{'時租$' + item.pricePerHour}</Text>
                    <Text style={{ fontSize: 12, paddingBottom: 2, color: '#707070' }}>{item.address}</Text>
                  </View>
                </ImageBackground>
              </View>


              // <Card onPress={this.chooseRoom.bind(this, item)}>
              //   <Card.Content>
              //     <View style={{ flex: 1, flexDirection: 'row' }}>
              //       <Animated.View
              //         style={{
              //           width: 60,
              //           height: 60,
              //           margin: 4,
              //           opacity: (state.imageOpacity[
              //             item.id
              //           ] = new Animated.Value(0))
              //         }}
              //       >
              //         <Image onPress={this.chooseRoom.bind(this, item)}
              //           source={{
              //             url: item.photos[0]
              //           }}
              //           style={{
              //             width: 60,
              //             height: 60
              //           }}
              //           onLoadStart={e => {
              //             state.imageOpacity[item.id].setValue(0);
              //           }}
              //           onLoadEnd={e => {
              //             Animated.timing(
              //               state.imageOpacity[item.id],
              //               {
              //                 toValue: 1,
              //                 duration: 500,
              //                 useNativeDriver: true
              //               }
              //             ).start();
              //           }}
              //         />
              //       </Animated.View>
              //       <View style={{ width: 200 }}>
              //         <Text style={style.name}>{item.name}</Text>
              //         <Text style={style.price}>
              //           {'時租$' + item.pricePerHour}
              //         </Text>
              //         <Text style={style.address}>
              //           {'地址：' + item.address}
              //         </Text>
              //       </View>
              //     </View>
              //   </Card.Content>
              // </Card>
            )}
          />
        </View>
      </View>
    </View>
  );
}

const style = StyleSheet.create({
  container: { flex: 1, flexDirection: 'column' },
  menu: {
    paddingTop: 10,
    padding: 10,
    // height: '100%',
    backgroundColor: Colors.main
  },
  navIcon: {
    marginLeft: 10,
    lineHeight: 20,
    color: Colors.bg
  },
  optionIcon: {
    marginLeft: 0,
    marginRight: 0,
    lineHeight: 40,
    width: 20,
    textAlign: 'center',
    color: Colors.bg
  },
  optionIconSelected: {
    marginLeft: 0,
    marginRight: 0,
    lineHeight: 40,
    width: 20,
    textAlign: 'center',
    color: Colors.main
  },
  optionText: {
    fontSize: 20,
    lineHeight: 48,
    marginLeft: 10,
    marginRight: 8,
    color: Colors.bg
  },
  optionTextSelected: {
    fontSize: 20,
    lineHeight: 48,
    marginLeft: 10,
    marginRight: 8,
    color: Colors.main
  },
  line: { flex: 1, flexShrink: 0, flexGrow: 1 },
  roomText: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    position: 'relative',
    marginTop: 150,
    height: 76,
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 8,
    paddingBottom: 8
  },
  accordion: {
    color: 'red',
    marginTop: 0,
    marginBottom: -20
  },
  name: {
    fontSize: 20
  },
  address: {
    fontSize: 14
  },
  price: {
    fontSize: 14
  },
  optionButton: {
    backgroundColor: Colors.selected,
    fontSize: 12,
    margin: 1
  },
  optionContent: {
    borderWidth: 2,
    borderColor: Colors.menuSelected,
    borderRadius: 8,
    marginLeft: 0,
    marginRight: 0,
    marginBottom: 12,
    padding: 8,
    paddingTop: 0,
    width: '30%',
    height: 44
  },
  optionContentSelected: {
    borderWidth: 2,
    backgroundColor: Colors.menuSelected,
    borderColor: Colors.menuSelected,
    borderRadius: 8,
    marginLeft: 0,
    marginRight: 0,
    marginBottom: 12,
    padding: 8,
    paddingTop: 0,
    width: '30%',
    height: 44
  },
  pullDown: {
    backgroundColor: Colors.main,
    width: '100%',
    shadowColor: 'black',
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 0.3,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    // position: 'absolute',
    zIndex: 1000
  }
});

export default Screen;
