import React from "react";
import { StyleSheet, TouchableHighlight, View, Text } from "react-native";
import { Headline } from "react-native-paper";

import { TextInput } from "react-native-paper";
import { KeyboardAwareScrollView as ScrollView } from "react-native-keyboard-aware-scroll-view";

import { Button, ToggleButton, SlotButton } from "../components/UI";
import styles from "../screens/Styles";
import { slotToText, slotsToText } from "../utils.js";
import TextInputField from "../components/TextInputField";

export class TimeSlotSelector extends React.Component {
  // ALL_SELECT = [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ];
  state = {
    price: null,
    onChangeText: (name, value) => {
      this.setState({ [name]: value });
    },
    label: {
      price: "時租"
    },
    helperText: {
      price: ""
    }
  };
  UNSAFE_componentWillMount() {
    this.setState({
      index: this.props.period.index,
      on: this.props.period.on,
      price: this.props.period.price,
      slots: this.props.period.slots
    });
  }
  updateSlot(ind) {
    let slots = this.state.slots;
    slots[ind] = slots[ind] == 0 ? 1 : 0;
    this.setState({ slots });
  }
  updateSlotDate(ind) {
    let on = this.state.on;
    on[ind] = !on[ind];
    this.setState({ on });
  }
  render() {
    return (
      <View style={style.container}>
        <Headline style={{ textAlign: "center", width: "100%" }}>
          {(this.props.period.index == -1 ? "新" : "") +
            "時段" +
            (this.props.period.index == -1 ? "" : this.props.period.index + 1)}
        </Headline>
        <View style={styles.headerBar}></View>
        <View style={{ ...styles.line, height: 40,  paddingLeft: 10, paddingRight: 10 }}>
          <View style={style.row}>
            <Text>日期：</Text>
            <ToggleButton
              title="日"
              on={this.props.period.on[0]}
              onValueUpdate={this.updateSlotDate.bind(this, 0)}
            />
            <ToggleButton
              title="一"
              on={this.props.period.on[1]}
              onValueUpdate={this.updateSlotDate.bind(this, 1)}
            />
            <ToggleButton
              title="二"
              on={this.props.period.on[2]}
              onValueUpdate={this.updateSlotDate.bind(this, 2)}
            />
            <ToggleButton
              title="三"
              on={this.props.period.on[3]}
              onValueUpdate={this.updateSlotDate.bind(this, 3)}
            />
            <ToggleButton
              title="四"
              on={this.props.period.on[4]}
              onValueUpdate={this.updateSlotDate.bind(this, 4)}
            />
            <ToggleButton
              title="五"
              on={this.props.period.on[5]}
              onValueUpdate={this.updateSlotDate.bind(this, 5)}
            />
            <ToggleButton
              title="六"
              on={this.props.period.on[6]}
              onValueUpdate={this.updateSlotDate.bind(this, 6)}
            />
            {/* <ToggleButton
              title="假"
              on={this.props.period.on[7]}
              onValueUpdate={this.updateSlotDate.bind(this, 7)}
            /> */}
          </View>
        </View>

        <View style={{ ...styles.line, height: 80, marginTop: 8 }}>
          <TextInputField name="price" binding={this.state} />
        </View>

        <View style={{ ...styles.line, height: 20, paddingLeft: 10, paddingRight: 10 }}>
          <View style={style.row}>
            <Text>{"時間：" + slotsToText(this.props.period.slots)}</Text>
          </View>
        </View>
        <View style={{ ...styles.line, flexGrow: 1, flexShrink: 1,  paddingLeft: 10, paddingRight: 10 }}>
          <ScrollView style={{ marginTop: 4, marginBottom: 4 }}>
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                flexWrap: "wrap"
              }}
            >
              {this.props.period.slots.map((x, ind) => (
                <View key={"slot" + ind} style={{ width: "25%", height: 32 }}>
                  <SlotButton
                    title={slotToText(ind)}
                    on={this.props.period.slots[ind] == 1 ? true : false}
                    onValueUpdate={this.updateSlot.bind(this, ind)}
                  />
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
        {false && <Text>{slotsToText(this.props.period.slots)}</Text>}

        <View style={styles.line}>
          <View style={{ ...styles.row }}>
            <Button
              onPress={() => {
                this.props.cancel();
              }}
              buttonStyle={{borderRadius: 0}}
              title="取消"
            />
            <Button
              onPress={() => {
                this.props.ok(this.state);
              }}
              buttonStyle={{borderRadius: 0}}
              title="確定"
            />
          </View>
        </View>
      </View>
    );
  }
}

const style = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: "#C6C6C6",
    borderRadius: 0,
    // backgroundColor: "lightblue",
    margin: 8,
    marginTop: 10,
    marginBottom: 10,
    padding: 0,
    flex: 0,
    // flexBasis: 20,
    flexShrink: 1,
    flexDirection: "column",
    // alignItems: "flex-start",
    justifyContent: "center",
    alignItems: "stretch",
    height: "100%"
  },
  line: {
    flex: 1,
    width: "100%",
    // marginBottom: 8,
    // height: 200,
    flex: 0
    // flexGrow: 0
    // flexGrow: 1
  },
  row: {
    // backgroundColor: "orange",
    flex: 1,
    flexDirection: "row",
    alignItems: "center"
    // height: 100,
    // margin: 10
  }
});
