import NavigationService from "../NavigationService";
import React from "react";
import { Alert, Platform, StyleSheet, Text, View, Divider } from 'react-native';
import { Button } from '../components/UI';
import { validateEmail } from "../utils";
import TextInputField from "../components/TextInputField";
import { emailErrorType, repeatPasswordErrorType } from "../constants";
import styles, {Colors} from "./Styles";

const Screen = props => {
  
  const go = (which) => {
    NavigationService.navigate(which);
  }
  
  return (
    <View style={styles.container}>
        <Button onPress={go.bind(this, "RegisterUser")} buttonStyle={{...style.button}} fontSize={26} textStyle={{...style.buttonText}}title="成為租客" />
        <Button onPress={go.bind(this, "RegisterHost")} buttonStyle={{...style.button, borderColor:Colors.main, borderWidth: 3}} color={Colors.bg} fontColor={Colors.main} fontSize={26} textStyle={{...style.buttonText, color: Colors.main}}title="成為場主" />
    </View>
  );
}
const style = StyleSheet.create({
  itemContainer: {
    
  },

  button: {
    height: '80%'
  },

  buttonText: {
    fontSize: 36
  }
  
});

export default Screen;
