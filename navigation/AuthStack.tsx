import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import LoginSelect from '../pages/login/LoginSelect';

const Stack = createNativeStackNavigator();

type Props = {
  onLoginSuccess: () => void;
};

export default function AuthStack({onLoginSuccess}: Props) {
  return (
    <Stack.Navigator
      initialRouteName="LoginSelect"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="LoginSelect">
        {() => <LoginSelect onLoginSuccess={onLoginSuccess} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
