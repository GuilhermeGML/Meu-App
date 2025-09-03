import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../screens/Home';
import Second from '../screens/Second';

export type RootStackParamList = {
  Home: undefined;
  Second: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const Navigation: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#6200ee',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={Home}
          options={{ title: 'Home Screen' }}
        />
        <Stack.Screen 
          name="Second" 
          component={Second}
          options={{ title: 'Second Screen' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
