/**
 * @format
 */

import 'react-native-gesture-handler' //for fixing crashing after upgrading to RN 0.61
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
