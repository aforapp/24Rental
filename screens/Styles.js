import {StyleSheet} from 'react-native';

// 預設顏色：R=37  G=96  B=164
// 背景：R=255  G=255  B=255
// 字：R=0  G=0  B=0  K=90 1
// 按鈕：R=37  G=96  B=164
// 反白背景（選擇了選項）：R=255  G=255  B=255
// 反白字眼色：R=37  G=96  B=164
// MenuBar 背景顏色：R=255  G=255  B=255
// MenuBar 字體顏色：R=0  G=0  B=0  K=90 1
// MenuBar 反白背景：R=255  G=255  B=255
// MenuBar 翻白字體顏色：R=37  G=96  B=164
// 底部功能鍵(登入果欄) R=155  G=196  B=216

const colorMain = '#2560A4';
const colorBg = '#FFFFFF';
const colorText = '#3E3A39';
const colorButton = '#2560A4';
const colorSelected = '#FFFFFF';
const colorSelectedText = '#2560A4';
const colorMenuBg = '#FFFFFF';
const colorMenuText = '#000000';
const colorMenuSelected = '#FFFFFF';
const colorMenuSelectedText = '#2560A4';
const colorNavButton = '#9BC4D8';

export const Colors = {
  main: colorMain,
  bg: colorBg,
  text: colorText,
  button: colorButton,
  selected: colorSelected,
  selectedText: colorSelectedText,
  menuBg: colorMenuBg,
  menuText: colorMenuText,
  menuSelected: colorMenuSelected,
  menuSelectedText: colorMenuSelectedText,
  navButton: colorNavButton,
};

export default StyleSheet.create({
  container: {
    flex: 1,
    // padding: 8,
    backgroundColor: 'white',
    height: '100%',
  },
  title: {
    padding: 8,
    lineHeight: 26,
  },
  headerBar: {
    height: 18,
    marginBottom: 10,
    backgroundColor: '#3568A6',
  },
  blackTitle: {
    color: 'white',
  },
  blackText: {
    color: 'white',
  },
  blackContainer: {
    flex: 1,
    // padding: 8,
    backgroundColor: 'black',
    color: 'white',
    height: '100%',
  },
  container2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    flexGrow: 1,
    justifyContent: 'space-between',
    // margin: 10
  },
  padding: {
    padding: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    margin: 10,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  safeArea: {
    flex: 1,
    backgroundColor: colorNavButton,
  },
  fixBackground: {
    backgroundColor: colorNavButton,
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
    height: 100,
    zIndex: -1000,
  },
  centerScreen: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
  },
  welcome: {
    fontSize: 20,
  },
  bigName: {
    fontSize: 30,
    textAlign: 'center',
    color: colorNavButton,
  },
  scrollView: {
    // height: "100%"
  },
  scrollViewContent: {
    // padding: 8
    // height: "100%"
    // borderWidth: 1,
    // borderColor: "red"
  },
});
