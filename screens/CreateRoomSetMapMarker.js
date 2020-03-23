import NavigationService from '../NavigationService';

import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { Headline, Button } from 'react-native-paper';
import MapView, { Marker } from 'react-native-maps';

class Screen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      title: '地點',
      initRegion: {
        latitude: 22.300802,
        longitude: 114.172459,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      },
      region: null,
      markerRegion: null,
      markers: [],
    };
  }
  UNSAFE_componentWillMount() {
    // this.setState({ title: this.props.title });
    this.markCurrentLocation();
  }

  markCurrentLocation() {
    navigator.geolocation.getCurrentPosition(position => {
      this.setState({
        ...this.state,
        region: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        markerRegion: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
      });
    });
  }

  onMapPress(e) {
    this.setState({
      ...this.state,
      region: null,
      markerRegion: {
        ...e.nativeEvent.coordinate,
        // latitudeDelta: 0.01,
        // longitudeDelta: 0.01
      },
    });
  }

  onSave = () => {
    this.props.navigation.state.params.returnData({
      location: {
        latitude: this.state.markerRegion.latitude,
        longitude: this.state.markerRegion.longitude,
      },
    });
    this.props.navigation.goBack();
  };

  render() {
    return (
      <View
        style={{
          height: '100%',
          width: '100%',
          justifyContent: 'flex-end',
          alignItems: 'center',
        }}>
        <MapView
          style={{
            height: '100%',
            width: '100%',
          }}
          onPress={e => this.onMapPress(e)}
          initialRegion={this.state.initRegion}
          region={this.state.region}>
          <Marker
            title={this.state.title}
            description=""
            coordinate={this.state.markerRegion}
          />
        </MapView>
        <Button
          style={style.submitButton}
          mode="contained"
          onPress={this.onSave}>
          確定
        </Button>
      </View>
    );
  }
}

const style = StyleSheet.create({
  submitButton: {
    width: '100%',
  },
});

export default Screen;
