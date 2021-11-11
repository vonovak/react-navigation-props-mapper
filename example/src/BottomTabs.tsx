import * as React from 'react';
import { View, Text, Button } from 'react-native';
// import createBottomTabNavigator from '@react-navigation/bottom-tabs/src/navigators/createBottomTabNavigator';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { StackInTabs } from './StackInTabs';
import {
  ForwardedTabScreenProps,
  withForwardedNavigationParams,
} from 'react-navigation-props-mapper';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

type UserIdParam = { userId: string };

type TabParamList = {
  Home: undefined;
  Stack: undefined;
  Settings: UserIdParam;
};

type HomeProps = BottomTabScreenProps<TabParamList, 'Home'>;

function HomeScreen({ navigation }: HomeProps) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <Button
        title={'go to stack'}
        onPress={() => {
          navigation.navigate('Stack');
        }}
      />
    </View>
  );
}
type ForwardedSettingsProps = ForwardedTabScreenProps<TabParamList, 'Settings'>;

const ScreenWithForwardedProps = ({
  route,
  userId,
}: ForwardedSettingsProps) => {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Profile id from route: {route.params.userId}</Text>
      <Text>Profile id from props: {userId}</Text>
    </View>
  );
};

const SettingsScreen = withForwardedNavigationParams<ForwardedSettingsProps>()(
  ScreenWithForwardedProps
);

const TabNav = createBottomTabNavigator<TabParamList>();

export const BottomTabs = () => {
  return (
    <TabNav.Navigator>
      <TabNav.Screen name="Home" component={HomeScreen} />
      <TabNav.Screen name="Stack" component={StackInTabs} />
      <TabNav.Screen
        name="Settings"
        component={SettingsScreen}
        initialParams={{ userId: '789' }}
      />
    </TabNav.Navigator>
  );
};
