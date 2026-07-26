/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

console.log('[BUNDLE-CHECK] new bundle loaded at', new Date().toISOString());

AppRegistry.registerComponent(appName, () => App);
