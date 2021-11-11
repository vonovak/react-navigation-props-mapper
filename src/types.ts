import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { ComponentType } from 'react';
import type { ParamListBase, RouteProp } from '@react-navigation/core';
import type { StackScreenProps } from '@react-navigation/stack';
import type { DrawerScreenProps } from '@react-navigation/drawer';

export type ScreenPropsSource<
  ParamList extends ParamListBase,
  RouteName extends keyof ParamList = string
> =
  | DrawerScreenProps<ParamList, RouteName>
  | BottomTabScreenProps<ParamList, RouteName>
  | NativeStackScreenProps<ParamList, RouteName>
  | StackScreenProps<ParamList, RouteName>;

const paramListKey = '';
export type ParamListKeyType = typeof paramListKey;

export type ScreenPropsWithForwardedNavParams<
  ScreenProps extends ScreenPropsSource<ParamList, RouteName>,
  ParamList extends ParamListBase,
  RouteName extends keyof ParamList = string
> = Omit<
  {
    [K in keyof RouteProp<ParamList, RouteName>['params']]: RouteProp<
      ParamList,
      RouteName
    >['params'][K];
  },
  'navigation' | 'route' | ParamListKeyType
> &
  ScreenProps & {
    // we need to carry the ParamList to withForwardedNavigationParams() call so that we don't ask user the same information twice;
    // and there seems to be no other way than this... - we use empty string as the key because TS happily accepts it
    // and at the same time, it cannot really be used in userland code (intellisense will offer it, but practically it cannot be used)
    [paramListKey]: ParamList;
  };

export type ForwardedNativeStackScreenProps<
  ParamList extends ParamListBase,
  RouteName extends keyof ParamList = string
> = ScreenPropsWithForwardedNavParams<
  NativeStackScreenProps<ParamList, RouteName>,
  ParamList,
  RouteName
>;

export type ForwardedStackScreenProps<
  ParamList extends ParamListBase,
  RouteName extends keyof ParamList = string
> = ScreenPropsWithForwardedNavParams<
  StackScreenProps<ParamList, RouteName>,
  ParamList,
  RouteName
>;

export type ForwardedDrawerScreenProps<
  ParamList extends ParamListBase,
  RouteName extends keyof ParamList = string
> = ScreenPropsWithForwardedNavParams<
  DrawerScreenProps<ParamList, RouteName>,
  ParamList,
  RouteName
>;

export type ForwardedTabScreenProps<
  ParamList extends ParamListBase,
  RouteName extends keyof ParamList = string
> = ScreenPropsWithForwardedNavParams<
  BottomTabScreenProps<ParamList, RouteName>,
  ParamList,
  RouteName
>;

export type ForwardedScreenProps<
  ParamList extends ParamListBase,
  RouteName extends keyof ParamList = string
> =
  | ForwardedNativeStackScreenProps<ParamList, RouteName>
  | ForwardedDrawerScreenProps<ParamList, RouteName>
  | ForwardedTabScreenProps<ParamList, RouteName>
  | ForwardedStackScreenProps<ParamList, RouteName>;

type OmitParamList<ScreenProps> = Omit<ScreenProps, ParamListKeyType>;

export type NavigationAndRoute<
  ScreenProps extends ScreenPropsSource<any, any>
> = Pick<ScreenProps, 'navigation' | 'route'>;

export type WithForwardedNavigationParamsReturn<
  ScreenProps extends ScreenPropsSource<any, any>
> = (WrappedComponent: ComponentType<ScreenProps>) => ComponentType<
  NavigationAndRoute<ScreenProps>
> & {
  wrappedComponent: ComponentType<ScreenProps>;
};

export type SecondOrderWrapperType<
  ScreenProps extends ForwardedScreenProps<any, any>
> = ComponentType<
  OmitParamList<ScreenProps> & {
    WrappedComponent: ComponentType<OmitParamList<ScreenProps>>;
  }
>;
