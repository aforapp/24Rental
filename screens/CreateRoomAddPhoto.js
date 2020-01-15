import NavigationService from '../NavigationService';

import React, { Component } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Image } from '../components/UI';
import {Colors} from './Styles';
import { Headline, Button } from 'react-native-paper';
// import ImagePicker from 'react-native-image-picker';

const Screen = props => {



  // onSave() {
  //   this.props.navigation.state.params.returnData(this.state);
  //   this.props.navigation.goBack();
  // }
/*
  const options = {
    title: 'Select Avatar',
    customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
    storageOptions: {
      skipBackup: true,
      path: 'images',
    },
  };

  ImagePicker.showImagePicker(options, (response) => {
    console.log('Response = ', response);
  
    if (response.didCancel) {
      console.log('User cancelled image picker');
    } else if (response.error) {
      console.log('ImagePicker Error: ', response.error);
    } else if (response.customButton) {
      console.log('User tapped custom button: ', response.customButton);
    } else {
      const source = { uri: response.uri };
  
      // You can also display the image using data:
      // const source = { uri: 'data:image/jpeg;base64,' + response.data };
  
      this.setState({
        avatarSource: source,
      });
    }
  });

  // getSelectedImages(images, current) {
  //   let i = 1;
  //   this.setState({
  //     photo1: null,
  //     photo2: null,
  //     photo3: null,
  //     photo4: null,
  //     photo5: null
  //   });

  //   images.map(x => {
  //     const key = 'photo' + i;
  //     this.setState({ [key]: x.uri });
  //     i++;
  //   });

  //   const num = images.length;

  //   this.setState({
  //     num: num,
  //     selected: images
  //   });
  // }

*/
    return (
      <View style={style.container}>
        {/* <View style={style.content}>
          <Text style={style.text}>
            已選取<Text style={style.bold}>{this.state.num}</Text>張相片
          </Text>
        </View>
        <Button color={Colors.bg} onPress={this.onSave.bind(this)}>確定</Button> */}
      </View>
    );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.main
  },
  content: {
    marginTop: 15,
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  text: {
    fontSize: 16,
    alignItems: 'center',
    color: '#fff'
  },
  bold: {
    fontWeight: 'bold'
  },
  info: {
    fontSize: 12
  }
});

export default Screen;
