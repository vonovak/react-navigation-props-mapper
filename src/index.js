import React from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';

export const withMappedNavigationParams = SecondOrderWrapperComponent => WrappedComponent => {
  const TargetWithHoistedStatics = mapNavigationProps(SecondOrderWrapperComponent)(
    WrappedComponent
  );

  if (typeof WrappedComponent.navigationOptions === 'function') {
    TargetWithHoistedStatics.navigationOptions = navigationProps =>
      mapScreenConfigProps(navigationProps, WrappedComponent.navigationOptions);
  }

  return TargetWithHoistedStatics;
};

export const mapNavigationProps = SecondOrderWrapperComponent => WrappedComponent => {
  const TargetComponent = props => {
    const params = props.navigation?.state?.params;

    const { screenProps, ...propsExceptScreenProps } = props;

    if (!SecondOrderWrapperComponent) {
      return <WrappedComponent {...screenProps} {...propsExceptScreenProps} {...params} />;
    } else {
      return (
        <SecondOrderWrapperComponent
          WrappedComponent={WrappedComponent}
          {...screenProps}
          {...propsExceptScreenProps}
          {...params}
        />
      );
    }
  };

  TargetComponent.displayName = `withMappedNavigationParams(${WrappedComponent.displayName ||
    WrappedComponent.name})`;

  hoistNonReactStatics(TargetComponent, WrappedComponent);
  TargetComponent.wrappedComponent = WrappedComponent;
  return TargetComponent;
};

function mapScreenConfigProps(reactNavigationProps, navigationOptionsFunction) {
  const { navigation, screenProps, navigationOptions, theme } = reactNavigationProps;
  const props = { ...screenProps, ...navigation.state.params, navigationOptions, navigation, theme };
  return navigationOptionsFunction(props);
}
