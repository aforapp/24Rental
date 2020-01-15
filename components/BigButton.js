// extended text input wrapping around the helper text method
import React from "react";
import { View } from "react-native";
import { TextInput, HelperText } from "react-native-paper";

// import styles from "./Styles";

/*
  Everything is kind of the same with the TextInput from Paper,
  except the helper text are delivered in a "HelperTextList" object
*/
const BigButton = ({
  ...props
}) => (
  <View>
 <TouchableHighlight
         style={styles.button}
         onPress={this.onPress}
       >
         <Text> </Text>
  </View>
);

export default TextInputField;
