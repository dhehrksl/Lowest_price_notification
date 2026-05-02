import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import KeywordScreen from '../screens/KeywordScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

const TAB_ICONS: Record<string, string> = {
  Home: '🔥',
  Keyword: '🔔',
  Profile: '⚙️',
};

export default function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerTitleStyle: { fontWeight: 'bold' },
        tabBarActiveTintColor: '#007bff',
        tabBarIcon: () => (
          <Text style={{ fontSize: 20 }}>{TAB_ICONS[route.name]}</Text>
        ),
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: '실시간 핫딜', tabBarLabel: '홈' }}
      />
      <Tab.Screen
        name="Keyword"
        component={KeywordScreen}
        options={{ title: '키워드 관리', tabBarLabel: '키워드' }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: '내 정보', tabBarLabel: '설정' }}
      />
    </Tab.Navigator>
  );
}
