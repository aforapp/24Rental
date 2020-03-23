import NavigationService from '../NavigationService';

// import React, { Component } from 'react';
import React, { useState } from 'react';
import { useStateValue } from '../state';
import _ from 'lodash';
import {
  Alert,
  View,
  StyleSheet,
  ScrollView,
  Image as RNImage,
  TouchableOpacity,
} from 'react-native';
import { Image } from '../components/UI';
// import { KeyboardAwareScrollView as ScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Title, Headline, Button, Text } from 'react-native-paper';
// import ActionSheet from 'react-native-actionsheet';

import ImagePicker from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';

// import TextInputField from '../components/TextInputField';
import { Input, OptionSelect } from '../components/UI';
import { deleteHostRoom } from '../utils';
import styles from './Styles';

import { DISTRICTS } from '../constants';

const Screen = props => {
  const [{ auth }, dispatch] = useStateValue();
  const label = {
    type: '服務',
    district: '地區',
    name: '房間名稱',
    area: '呎數',
    // pricePerHour: '價錢(每小時)',
    address: '地點',
    description: '房間簡介(多行)',
    rules: '用場守則(多行)',
    contactNumber: '聯絡電話',
  };
  const helperText = {};
  // console.log('d', props.navigation.state.params)
  const room =
    (props.navigation.state.params && props.navigation.state.params.room) || {};
  const isEdit =
    props.navigation.state.params && props.navigation.state.params.isEdit;

  const photos = {};
  if (room.photos && room.photos.length > 0) {
    photos.photo1 = room.photos[0];
    photos.photo2 = room.photos[1];
    photos.photo3 = room.photos[2];
    photos.photo4 = room.photos[3];
    photos.photo5 = room.photos[4];
  }

  const onChangeText = (name, value) => {
    setState({ ...state, [name]: value });
  };

  const [state, setState] = useState({
    label,
    helperText,
    onChangeText,
    type: null,
    showTypePicker: false,
    district: null,
    name: null,
    area: null,
    // pricePerHour: '',
    address: null,
    location: {},
    description: null,
    rules: null,
    mainAttractions: [],
    contactNumber: null,
    facilities: [],
    openingHours: null,

    photo1: null,
    photo2: null,
    photo3: null,
    photo4: null,
    photo5: null,
    isEdit,
    ...room,
    ...photos,
  });
  const binding = {
    data: state,
    label,
    helperText,
    onChange: onChangeText,
  };

  const returnData = ret => {
    // console.warn(ret);
    if (ret['openingHours'] != null) {
      let minPricePerHour = 1000000;

      ret.openingHours.map(x => {
        if (x.price < minPricePerHour) {
          minPricePerHour = parseInt(x.price, 10);
        }
      });
      ret.pricePerHour = minPricePerHour;
    }

    if (ret.field != null) {
      let data = ret.data;
      if (ret.field === 'facilities') {
        // console.log(ret)
      } else if (data.length > 0) {
        data = data[0];
      }
      setState({ ...state, [ret.field]: data });
    } else {
      // console.warn(ret)
      setState({ ...state, ...ret });
    }
  };

  const onSetType = () => {
    NavigationService.navigate('OptionScreen', {
      options: {
        field: 'type',
        title: '服務',
        multiSelect: false,
        selected: state.type || '',
        items: ['跳舞室', '派對室', 'Band房'],
      },
      returnData,
    });
  };

  const onSellingPoints = () => {
    NavigationService.navigate('CreateRoomAddSellingPoint', {
      returnData,
    });
  };

  const onSetDistrict = () => {
    NavigationService.navigate('OptionScreen', {
      options: {
        field: 'district',
        title: '地區',
        multiSelect: false,
        selected: state.district || '',
        items: [
          { title: '香港島' },
          '中西區',
          '灣仔區',
          '東區',
          '南區',
          { title: '九龍' },
          '油尖旺區',
          '深水埗區',
          '九龍城區',
          '觀塘區',
          { title: '新界' },
          '葵青區',
          '荃灣區',
          '屯門區',
          '元朗區',
          '北區',
          '大埔區',
          '沙田區',
          '西貢區',
          '離島區',
        ],
      },
      returnData,
    });
  };

  const onSetFacilities = () => {
    const selected = {};
    state.facilities.map(x => {
      selected[x] = true;
    });
    NavigationService.navigate('OptionScreen', {
      options: {
        field: 'facilities',
        title: '設施',
        multiSelect: true,
        selected,
        items: [
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
        ],
      },
      returnData,
    });
  };

  const validate = () => {
    const helperText = {};

    //required text fields
    ['name', 'area', 'address', 'description', 'contactNumber'].map(name => {
      if (state[name] == null || state[name].trim() === '') {
        helperText[name] = '請輸入' + label[name];
      }
    });

    if (state.photo1 == null) {
      Alert.alert('請設定房間相片');
      helperText['請設定房間相片'] = '請設定房間相片';
    } else if (state.openingHours == null) {
      Alert.alert('請設定開放時間');
      helperText['請設定開放時間'] = '請設定開放時間';
    }

    setState({ ...state, helperText });
    return Object.getOwnPropertyNames(helperText).length === 0;
  };

  const onNextStep = () => {
    if (true || validate()) {
      NavigationService.navigate('CreateRoomConfirm', state);
    }
  };

  const onMap = () => {
    NavigationService.navigate('CreateRoomSetMapMarker', {
      title: state.room,
      returnData,
    });
  };

  const onOpeningHours = () => {
    // console.warn(state.openingHours)
    NavigationService.navigate('CreateRoomSetOpeningHours', {
      openingHours: state.openingHours,
      returnData,
    });
  };

  const onAddPhoto = field => {
    const options = {
      title: '選擇房間相片',
      mediaType: 'photo',

      // customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
      storageOptions: {
        skipBackup: true,
        // path: 'images',
      },
    };

    ImagePicker.launchImageLibrary(options, response => {
      if (response.didCancel) {
        // console.log('User cancelled image picker');
      } else if (response.error) {
        // console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        // console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = response.uri;
        // console.warn(source)
        // console.warn(state.photo1)

        // You can also display the image using data:
        // const source = { uri: 'data:image/jpeg;base64,' + response.data };

        setState({ ...state, [field]: source });
      }
    });

    // NavigationService.navigate('CreateRoomAddPhoto', {
    //   returnData
    // });
  };

  const onDeleteRoomConfirm = () => {
    Alert.alert(
      '確定刪除房間？',
      '你不能恢復已刪除的房間',
      [
        { text: '取消', style: 'cancel' },
        { text: '確定', onPress: onDeleteRoom },
      ],
      { cancelable: false },
    );
  };

  const onDeleteRoom = () => {
    deleteHostRoom(dispatch, auth.id, room.id);
  };

  return (
    <View style="styles.container">
      <ScrollView>
        {state.isEdit && (
          <View style={style.headerContainer}>
            <Title style={styles.padding}>{state.name}</Title>
            <Button onPress={() => onDeleteRoomConfirm()}>
              <Icon size={30} name="delete" />
            </Button>
          </View>
        )}
        <View style={style.imageBlock}>
          <Text style={style.setRoomPhotos}>設定房間相片：</Text>
          <View style={style.imageGroup}>
            <Image
              key={'photo1' + state.photo1}
              source={{ uri: state.photo1 }}
              direct={true}
              style={style.image}
              onPress={() => onAddPhoto('photo1')}
            />
            <Image
              key={'photo2' + state.photo2}
              source={{ uri: state.photo2 }}
              direct={true}
              style={style.image}
              onPress={() => onAddPhoto('photo2')}
            />
            <Image
              key={'photo3' + state.photo3}
              source={{ uri: state.photo3 }}
              direct={true}
              style={style.image}
              onPress={() => onAddPhoto('photo3')}
            />
            <Image
              key={'photo4' + state.photo4}
              source={{ uri: state.photo4 }}
              direct={true}
              style={style.image}
              onPress={() => onAddPhoto('photo4')}
            />
            <Image
              key={'photo5' + state.photo5}
              source={{ uri: state.photo5 }}
              direct={true}
              style={style.image}
              onPress={() => onAddPhoto('photo5')}
            />
          </View>
        </View>

        <OptionSelect
          onPress={() => {
            onSetType();
          }}
          label={'服務'}
          value={state.type || '(未設定)'}
        />
        {!state.isEdit && (
          <Input name="name" binding={binding} required={'(未設定)'} />
        )}
        <Input name="area" binding={binding} required={'(未設定)'} />
        <OptionSelect
          onPress={() => {
            onOpeningHours();
          }}
          label={'開放時間及價格'}
          value={state.openingHours == null ? '(未設定)' : '已設定'}
        />
        <OptionSelect
          onPress={() => {
            onSellingPoints();
          }}
          label={'場地賣點'}
          value={'(未設定)'}
        />
        <OptionSelect
          onPress={() => {
            onSetDistrict();
          }}
          label={'地區'}
          value={state.district || '(未設定)'}
        />
        <Input name="address" binding={binding} required={'(未設定)'} />
        <OptionSelect
          onPress={() => {
            onMap();
          }}
          label={'地圖'}
          value={
            state.location == null || state.location.longitude == null
              ? '(未設定)'
              : '已設定'
          }
        />
        <Input
          name="description"
          binding={binding}
          multiline={true}
          required={'(未設定)'}
        />
        <Input
          name="rules"
          binding={binding}
          multiline={true}
          required={'(未設定)'}
        />
        <Input name="contactNumber" binding={binding} required={'(未設定)'} />
        <OptionSelect
          onPress={() => {
            onSetFacilities();
          }}
          label={'設施：'}
          value={
            state.facilities.length === 0
              ? '(未設定)'
              : _.join(state.facilities, ',')
          }
        />
        <Button
          mode="contained"
          style={{ ...style.button, marginBottom: 100, borderRadius: 5 }}
          onPress={onNextStep}>
          下一頁
        </Button>
      </ScrollView>
    </View>
  );
};

const style = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  button: {
    color: 'white',
    backgroundColor: '#225599',
    width: '40%',
    marginLeft: '30%',
    marginTop: 8,
    marginBottom: 8,
  },
  imageBlock: {
    marginTop: 25,
    padding: 8,
  },
  setRoomPhotos: {
    marginBottom: 10,
    marginLeft: 5,
    fontSize: 11,
    letterSpacing: 2,
  },
  imageGroup: {
    flexDirection: 'row',
    width: '100%',
    height: 80,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  image: {
    height: 60,
    width: 60,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: 'gray',
  },
});

export default Screen;
