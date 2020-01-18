import React from 'react';
import PropTypes from 'prop-types';
// import styled from 'styled-components/native';
import {Colors} from '../screens/Styles';

import {
  StyleSheet,
  TouchableHighlight,
  View,
  Text,
  Platform,
  Image as RNImage,
  ImageBackground as RNImageBackground,
  useEffect,
} from 'react-native';
import {TextInput, HelperText} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';

const styles = StyleSheet.create({
  inputsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    margin: 4,
    flex: 1,
  },
  button: {
    width: '80%',
    backgroundColor: 'blue',
    borderRadius: 10,
    height: 30,

    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 20,
    color: 'white',
  },
});

// export const Header = styled.Text`
//   font-size: 30;
//   backgroundColor: #225599;
//   color: red;
// `;

// export const Button2 = styled.Button`
//   backgroundColor: #225599;
//   color: red;
// `;

// export const Title = styled.Text`
//   fontSize: 30;
//   color: red;
// `;

export const Input = props => {
  return (
    <React.Fragment>
      <TextInput
        {...props}
        mode="flat"
        label={
          props.binding.label[props.name] +
          (props.required != null && props.binding.data[props.name] == null
            ? ' ' + props.required
            : '')
        }
        value={props.binding.data[props.name]}
        onChangeText={value => {
          props.binding.onChange(props.name, value);
        }}
      />
      {props.binding.helperText[props.name] ? (
        <HelperText type="error" visible={true}>
          {props.binding.helperText[props.name]}
        </HelperText>
      ) : null}
    </React.Fragment>
  );
};

export class MiniButton extends React.Component {
  render() {
    return (
      <Button
        style={{
          margin: 0,
          borderWidth: 1,
          borderColor: '#1A3F5D',
          borderRadius: 0,
        }}
        buttonStyle={{width: '100%', height: '100%', borderRadius: 0}}
        {...this.props}
      />
    );
  }
}

export class Button extends React.Component {
  render() {
    return (
      <View style={{...styles.inputsContainer, ...this.props.style}}>
        <TouchableHighlight
          underlayColor={this.props.color}
          style={{
            ...styles.button,
            ...this.props.buttonStyle,
            backgroundColor: this.props.color,
          }}
          onPress={() => {
            this.props.onPress();
          }}>
          <Text
            style={{
              ...styles.buttonText,
              ...this.props.textStyle,
              color: this.props.fontColor,
              fontSize: this.props.fontSize,
            }}>
            {this.props.title}
          </Text>
        </TouchableHighlight>
      </View>
    );
  }
}

Button.propTypes = {
  color: PropTypes.string,
  fontColor: PropTypes.string,
};

Button.defaultProps = {
  color: '#225599',
  fontColor: 'white',
};

export const HeaderButton = props => {
  return (
    <Button
      {...props}
      color={props.color || Colors.headerButton}
      fontSize={20}
      buttonStyle={props.buttonStyle}
      textStyle={{...(props.textStyle || {})}}
    />
  );
};

export const HeaderSortButton = props => {
  return (
    <View
      style={{
        height: 'auto',
        marginTop: -8,
      }}>
      <Text
        style={{
          alignSelf: 'center',
          justifyContent: 'flex-end',
          marginBottom: -10,
          fontSize: 25,
          color: Colors.menuSelected,
          zIndex: 1,
          opacity: props.active ? 100 : 0,
        }}>
        •
      </Text>
      <Button
        {...props}
        style={{flexGrow: 0.5}}
        color={props.color || Colors.navButton}
        fontSize={15}
        buttonStyle={props.buttonStyle}
        textStyle={props.textStyle}
      />
    </View>
  );
};

export class ToggleButton extends React.Component {
  state = {on: false};

  UNSAFE_componentWillMount() {
    this.setState({on: this.props.on});
  }

  render() {
    return (
      <Button
        color={this.state.on ? '#225599' : 'white'}
        fontColor={this.state.on ? 'white' : '#225599'}
        onPress={() => {
          let on = !this.state.on;
          this.props.onValueUpdate(on, this.props.index);
          this.setState({on});
        }}
        {...this.props}
        buttonStyle={{
          width: '100%',
          height: '100%',
          borderRadius: 0,
          ...this.props.buttonStyle,
        }}
        style={{
          margin: 0,
          borderWidth: 1,
          borderColor: '#1A3F5D',
          borderRadius: 0,
          ...this.props.style,
        }}
      />
    );
  }
  static defaultProps = {
    onValueUpdate: () => {},
  };
}

export class SlotButton extends React.Component {
  render() {
    return (
      <ToggleButton
        {...this.props}
        style={{borderWidth: 1, borderRadius: 10, margin: 4}}
        buttonStyle={{borderRadius: 10}}
      />
    );
  }
}

let RNFS = require('react-native-fs');
import shorthash from 'shorthash';

export class Image extends React.Component {
  state = {source: require('../room.png')};
  loadFile = path => {
    this.setState({source: {uri: path}});
  };
  downloadFile = (uri, path) => {
    // consol.warn('cached', path)
    if (uri.substr(0, 4) == 'http') {
      RNFS.downloadFile({fromUrl: uri, toFile: path}).promise.then(res => {
        this.loadFile(path);
        // consol.warn('cached', path)
      });
    } else {
      this.setState({source: {uri}});
    }
  };

  UNSAFE_componentWillMount() {
    // console.warn(this.props.source)
    // console.warn('mount', this.props)
    if (this.props.direct == true && this.props.source.uri != null) {
      // console.warn(this.props.source)
      this.setState({source: this.props.source});
    } else {
      let uri = this.props.source.url;
      uri = uri || '';
      if (uri != '') {
        // uri = 'img/room.png';

        const name = shorthash.unique(uri);
        const extension = Platform.OS === 'android' ? 'file://' : '';
        const path = `${extension}${RNFS.CachesDirectoryPath}/${name}.png`;
        RNFS.exists(path).then(exists => {
          if (exists) this.loadFile(path);
          else this.downloadFile(uri, path);
        });
      }
    }
  }

  render() {
    return (
      <TouchableHighlight onPress={this.props.onPress}>
        <RNImage {...this.props} source={this.state.source} />
      </TouchableHighlight>
    );
  }
}

export class ImageBackground extends React.Component {
  state = {source: require('../room.png')};
  loadFile = path => {
    this.setState({source: {uri: path}});
  };
  downloadFile = (uri, path) => {
    // consol.warn('cached', path)
    if (uri.substr(0, 4) == 'http') {
      RNFS.downloadFile({fromUrl: uri, toFile: path}).promise.then(res => {
        this.loadFile(path);
        // consol.warn('cached', path)
      });
    } else {
      this.setState({source: {uri}});
    }
  };

  UNSAFE_componentWillMount() {
    // console.warn(this.props.source)
    // console.warn('mount', this.props)
    if (this.props.direct == true && this.props.source.uri != null) {
      // console.warn(this.props.source)
      this.setState({source: this.props.source});
    } else {
      let uri = this.props.source.url;
      uri = uri || '';
      if (uri != '') {
        // uri = 'img/room.png';

        const name = shorthash.unique(uri);
        const extension = Platform.OS === 'android' ? 'file://' : '';
        const path = `${extension}${RNFS.CachesDirectoryPath}/${name}.png`;
        RNFS.exists(path).then(exists => {
          if (exists) this.loadFile(path);
          else this.downloadFile(uri, path);
        });
      }
    }
  }

  render() {
    return (
      <TouchableHighlight onPress={this.props.onPress}>
        <RNImageBackground {...this.props} source={this.state.source} />
      </TouchableHighlight>
    );
  }
}

export const OptionSelect = props => {
  return (
    <TouchableHighlight onPress={props.onPress}>
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          backgroundColor: '#E7E7E7',
          borderColor: '#ADADAD',
          borderBottomWidth: 1,
          height: 58,
          padding: 14,
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <Text style={{fontSize: 16, color: '#6A6A6A'}}>{props.children}</Text>
        <Icon name="angle-right" size={24} color="#C8C7CC" />
      </View>
    </TouchableHighlight>
  );
};
