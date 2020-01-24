import NavigationService from '../NavigationService';

import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, TouchableHighlight } from 'react-native';
import {
  Headline,
  TextInput,
  Button,
  Snackbar,
  Card,
  Title,
  Text,
  Paragraph,
  List,
  Checkbox,
} from 'react-native-paper';
import { KeyboardAwareScrollView as ScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from './Styles';
import { Colors } from './Styles';

const Screen = props => {
  const options = props.navigation.state.params.options;
  const returnData = props.navigation.state.params.returnData;

  let sel = options.selected || {};
  console.log(sel);
  if (sel instanceof String) {
    sel = { [sel]: true };
  }
  let [selected, setSelected] = useState(sel);

  onClick = x => {
    if (options.multiSelect != true) {
      setSelected({ [x]: true });
    } else {
      setSelected({ ...selected, [x]: !(selected[x] || false) });
    }
    // console.warn(selected)
  };

  // console.warn(props)
  return (
    <View style={style.container}>
      <Title style={style.title}>{options.title}</Title>

      <FlatList
        initialNumToRender={0}
        data={options.items}
        extraData={selected}
        keyExtractor={(item, index) =>
          'key' + (typeof item == 'string' ? item : '_title_' + item.title)
        }
        renderItem={({ item }) =>
          typeof item == 'string' ? (
            <TouchableHighlight onPress={() => onClick(item)}>
              <View style={style.optionTextWrapper}>
                <Text
                  style={{
                    ...style.optionText,
                    backgroundColor:
                      selected[item] === true ? Colors.selectedText : Colors.bg,
                    color:
                      selected[item] === true ? 'white' : Colors.optionList,
                  }}>
                  {item}
                </Text>
              </View>
            </TouchableHighlight>
          ) : (
            <View>
              <Text style={style.optionTitle}>{item.title}</Text>
            </View>
          )
        }
      />

      <Button
        style={{ backgroundColor: '#2560A4' }}
        color="white"
        onPress={() => {
          let data = [];
          options.items.map(x => {
            if (typeof x == 'string') {
              if (selected[x]) {
                data.push(x);
              }
            }
          });
          returnData({ field: options.field, data });
          props.navigation.goBack();
        }}>
        確定
      </Button>
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#9BC4D8',
    height: '100%',
    paddingTop: 10,
  },
  title: {
    color: Colors.title,
    marginLeft: 30,
    marginBottom: 8,
  },
  optionTextWrapper: {
    borderBottomWidth: 1.2,
    borderBottomColor: '#D0D3D4',
  },
  optionText: {
    paddingLeft: 30,
    height: 40,
    lineHeight: 40,
    fontSize: 15,
    letterSpacing: 3,
    fontWeight: '500',
    color: Colors.optionList,
  },
  optionTitle: {
    marginTop: -2,
    paddingRight: 25,
    height: 23,
    textAlign: 'right',
    lineHeight: 23,
    letterSpacing: 3,
    color: 'white',
    backgroundColor: 'black',
  },
});

export default Screen;
