import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Title, Button } from 'react-native-paper';
import { KeyboardAwareScrollView as ScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles, { Colors } from './Styles';

const TITLE = '註冊';

const Screen = props => {
  const toLoginPage = () => {
    props.navigation.navigate('Login');
  };

  return (
    <ScrollView style={{ ...styles.scrollViewContent, height: '100%' }}>
      <Title style={style.title}>{TITLE}</Title>
      <View style={style.descriptionContainer}>
        <Text style={style.description}>
          恭喜你，已完成註冊。{'\n'}按確定以開始探索
        </Text>
      </View>
      <View style={style.buttonContainer}>
        <Button style={style.button} mode="contained" onPress={toLoginPage}>
          <Text style={style.buttonText}>確定</Text>
        </Button>
      </View>
    </ScrollView>
  );
};

const style = StyleSheet.create({
  title: {
    marginTop: 12,
    marginLeft: 25,
    color: Colors.title,
  },
  descriptionContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
    height: 200,
  },
  description: {
    fontSize: 18,
    lineHeight: 25,
    textAlign: 'center',
    color: Colors.title,
  },
  buttonContainer: {
    alignItems: 'center',
  },
  button: {
    width: '35%',
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 12,
    letterSpacing: 2,
  },
});

export default Screen;
