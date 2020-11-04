import React, {useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import HomeScreen from './../Screen/HomeScreen';
import SplashScreen from './../Screen/SplashScreen';
import ProfileScreen from './../Screen/ProfileScreen';
import NewContactScreen from './../Screen/NewContactScreen';

const Stack = createStackNavigator();

export default function StackNavigation() {
  const [isLoading, setIsLoading] = useState(true);

  setTimeout(() => {
    setIsLoading(false);
  }, 1000);

  if (isLoading) {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            options={{headerShown: false}}
            name="SplashScreen"
            component={SplashScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          options={{headerShown: false}}
          name="HomeScreen"
          component={HomeScreen}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="ProfileScreen"
          component={ProfileScreen}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="NewContactScreen"
          component={NewContactScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
