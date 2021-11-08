import * as React from 'react';
import { View, Text, Button } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  withForwardedNavigationParams,
  ForwardedNativeStackScreenProps,
} from 'react-navigation-props-mapper';

type UserIdParam = { userId: string };

type StackParamList = {
  Profile: UserIdParam;
};

type ForwardedProfileProps = ForwardedNativeStackScreenProps<
  StackParamList,
  'Profile'
>;

const forwardParamsToProfile =
  withForwardedNavigationParams<ForwardedProfileProps>();

const ScreenWithForwardedProps = ({
  navigation,
  route,
  userId,
}: ForwardedProfileProps) => {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Profile id from route: {route.params.userId}</Text>
      <Text>Profile id from props: {userId}</Text>
      <Button
        title={'push more'}
        onPress={() => {
          navigation.push('Profile', { userId: userId + userId });
        }}
      />
    </View>
  );
};

const ProfileScreen = forwardParamsToProfile(ScreenWithForwardedProps);

const Stack = createNativeStackNavigator<StackParamList>();

export const StackInTabs = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        initialParams={{ userId: 'abc' }}
      />
    </Stack.Navigator>
  );
};
