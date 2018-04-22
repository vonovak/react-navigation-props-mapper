## react-navigation-props-mapper

`yarn add react-navigation-props-mapper`

or

`npm i react-navigation-props-mapper`


## Motivation

You're using react-navigation to navigate around your React Native app. The [documentation](https://reactnavigation.org/docs/params.html) describes you should use `this.props.navigation.state.params` to access props passed to your screen. For example:

```js
render() {
  // The screen's current route is passed in to `props.navigation.state`:
  const { params } = this.props.navigation.state;
  return (
    <View>
      <Text>Chat with {params.user.userName}</Text>
    </View>
  );
}
```

You don't like this because you don't want your code to be tightly coupled to react-navigation (maybe you're coming from ex-navigation and your screen components are not compatible with the react-navigation's way of passing props) and perhaps don't find this very elegant.


This small package offers two functions to ease working with the props from react-navigation:

### `withMappedNavigationProps`

Use this function to be able to access the props passed to your screen _directly_. Eg. instead of `this.props.navigation.state.params.user.userName` you'd write `this.props.user.userName`. The function wraps the provided component in a HOC and passes everything from `props.navigation.state.params` as well as `props.screenProps` to the wrapped component.

#### Usage

When defining the screens for your navigator, wrap the screen component with the function. For example:

```js
import { withMappedNavigationProps } from 'react-navigation-props-mapper'

@withMappedNavigationProps()
export class SomeScreen extends Component {
```

### `withMappedNavigationAndConfigProps`

When using a function in `static navigationOptions` to configure eg. a screen header dynamically based on the props, you're dealing with the same issues as mentioned above. `withMappedNavigationAndConfigProps` does the same as `withMappedNavigationProps` but also saves you some hassle when defining screen's `static navigationOptions` property. For example, it allows turning

```js
static navigationOptions = ({ navigation }) => ({
  title: `${navigation.state.params.name}'s Profile!`,
  headerRight: (
      <HeaderButton title="Sort" onPress={() => navigation.navigate('DrawerOpen')} />
    ),
});
```

into

```js
static navigationOptions = ({ navigation, name }) => ({
  title: name,
  headerRight: (
      <HeaderButton title="Sort" onPress={() => navigation.navigate('DrawerOpen')} />
    ),
});
```

#### Usage

`import { withMappedNavigationAndConfigProps } from 'react-navigation-props-mapper'` and use the same way as `withMappedNavigationProps`. In your screen component, use `static navigationOptions`, same as you'd do normally.

### Injecting Additional Props to Your screen

Consider the [deep linking guide](https://reactnavigation.org/docs/deep-linking.html) from react-navigation.
You have a chat screen defined as:

```js
Chat: {
    screen: ChatScreen,
    path: 'chat/:userId',
  },
```

you may need to use the `userId` parameter to get the respective `user` object and do some work with it. Wouldn't it be more convenient to directly get the `user` object instead of just the id? Both `withMappedNavigationAndConfigProps` and `withMappedNavigationProps` accept an optional parameter, of type `ReactClass` (a react component) that gets all the navigation props and the wrapped component as props. You may do some additional logic in this component and then render the wrapped component, for example:

```js
import React from 'react';
import { inject } from 'mobx-react/native';
import { withMappedNavigationAndConfigProps } from 'react-navigation-props-mapper';

class AdditionalPropsInjecter extends React.Component {
  // In this component you may do eg. a network fetch to get data needed by the screen component.
  // Once you have the data ready, you may also need to call `setParams`.
  render() {
    const { WrappedComponent, userStore, userId } = this.props;

    const additionalProps = {};
    if (userId) {
      additionalProps.user = userStore.getUserById(userId);
    }
    return <WrappedComponent {...this.props} {...additionalProps} />;
  }
}

@inject('userStore') //this injects userStore as a prop, via react context
@withMappedNavigationAndConfigProps(AdditionalPropsInjecter)
class ChatScreen extends React.Component {}
```

That way, in your `ChatScreen` component, you don't have to work with user id, but directly work with the user object.

#### A Word of Warning

Under some circumstances, when your screen components use `PureComponent` together with the functions from this library and you have several routes depend on the same navigation parameter, changing the navigation parameter may cause the screen components to enter an extra re-render. 

#### Tip

If you don't like the function names, you may import the functions with an alias:

```js
import { withMappedNavigationAndConfigProps as mapperFunc } from 'react-navigation-props-mapper';
```
