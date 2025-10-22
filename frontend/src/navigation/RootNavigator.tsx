import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeProducts  from '../features/products/HomeProducts';
import Cart  from '../features/cart/Cart';
import SplashScreen from './SplashScreen';

const Stack = createNativeStackNavigator();

export const RootNavigator = () => {

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="Home" component={HomeProducts} />
        <Stack.Screen
          name="Cart"
          component={Cart}
          options={{
            presentation: 'modal',
            animation: 'slide_from_bottom',
            gestureEnabled: true,
            headerShown: false,
            contentStyle: {
              backgroundColor: '#00122a',
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};