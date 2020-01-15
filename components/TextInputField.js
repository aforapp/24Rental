// extended text input wrapping around the helper text method
import React from "react";
import { View } from "react-native";
import { TextInput, HelperText } from "react-native-paper";
/*
  Everything is kind of the same with the TextInput from Paper,
  except the helper text are delivered in a "HelperTextList" object
*/
const TextInputField = ({
  name,
  binding = {
    label: {},
    helperText: {},
    onChangeText: () => {}
  },
  multiline = false,
  numberOfLines = 1,
  ...props
}) => (
  <View>
    <TextInput
      value={binding[name]}
      label={binding.label[name]}
      multiline={multiline}
      numberOfLines={numberOfLines}
      onChangeText={value => binding.onChangeText(name, value)}
      {...props}
    />
    {binding.helperText[name] ? (
      <HelperText type="error" visible={true}>
        {binding.helperText[name]}
      </HelperText>
    ) : null}
  </View>
);

export default TextInputField;
