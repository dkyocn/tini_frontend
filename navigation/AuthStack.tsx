import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import StartPage from '../pages/login/StartPage';
import LoginSelect from '../pages/login/LoginSelect';
import ProfileInputPage from '../pages/login/ProfileInputPage';
import SignUpCompletePage from '../pages/login/SignUpCompletePage';

const Stack = createNativeStackNavigator();

type Props = {
  onLoginSuccess: () => void;
};

export default function AuthStack({onLoginSuccess}: Props) {
  return (
    <Stack.Navigator
      initialRouteName="StartPage"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="StartPage">
        {({navigation}) => (
          <StartPage onStart={() => navigation.navigate('LoginSelect')} />
        )}
      </Stack.Screen>
      <Stack.Screen name="LoginSelect">
        {({navigation}) => (
          <LoginSelect
            onLoginSuccess={initialProfile =>
              navigation.navigate('ProfileInput', initialProfile)
            }
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="ProfileInput">
        {({navigation, route}) => (
          <ProfileInputPage
            initialProfile={route.params}
            onNext={() => navigation.navigate('SignUpComplete')}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="SignUpComplete">
        {() => <SignUpCompletePage onComplete={onLoginSuccess} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
