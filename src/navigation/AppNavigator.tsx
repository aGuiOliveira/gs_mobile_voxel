import React from 'react';
import { Text } from 'react-native';
import { DarkTheme, NavigationContainer, Theme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { RootStackParamList, TabParamList } from './types';
import {
  ConfirmationScreen,
  HistoryScreen,
  HomeScreen,
  LearnScreen,
  NewProjectScreen,
  ProjectDetailScreen,
  ResultScreen,
  SimulationScreen,
} from '../screens';
import { colors } from '../theme';

const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

const navTheme: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.bg,
    card: colors.surface,
    text: colors.text,
    border: colors.border,
    primary: colors.primary,
  },
};

const TAB_ICONS: Record<keyof TabParamList, string> = {
  Home: '🪐',
  Learn: '📚',
  History: '🗂️',
};

function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
        tabBarIcon: ({ size }) => (
          <Text style={{ fontSize: size - 4 }}>{TAB_ICONS[route.name]}</Text>
        ),
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Início' }} />
      <Tab.Screen name="Learn" component={LearnScreen} options={{ title: 'Aprender' }} />
      <Tab.Screen name="History" component={HistoryScreen} options={{ title: 'Histórico' }} />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.text,
          headerTitleStyle: { fontWeight: '800' },
          contentStyle: { backgroundColor: colors.bg },
        }}
      >
        <Stack.Screen name="Tabs" component={Tabs} options={{ headerShown: false }} />
        <Stack.Screen name="NewProject" component={NewProjectScreen} options={{ title: 'Novo projeto' }} />
        <Stack.Screen
          name="Simulation"
          component={SimulationScreen}
          options={{ headerShown: false, gestureEnabled: false }}
        />
        <Stack.Screen name="Result" component={ResultScreen} options={{ title: 'Resultado' }} />
        <Stack.Screen
          name="Confirmation"
          component={ConfirmationScreen}
          options={{ headerShown: false, gestureEnabled: false }}
        />
        <Stack.Screen name="ProjectDetail" component={ProjectDetailScreen} options={{ title: 'Projeto' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
