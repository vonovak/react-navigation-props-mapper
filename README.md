## react-navigation-props-mapper

`yarn add react-navigation-props-mapper`

or

`npm i react-navigation-props-mapper --save`


## The problem
You're using react-navigation to navigate around you React Native app. The [documentation](https://reactnavigation.org/docs/intro/#Passing-params) describes you should use `this.props.navigation.state.params` to access props passed to your screen. For example:

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

You don't like this because you

1 . don't want your code to be tightly coupled to react-navigation (maybe you're coming from ex-navigation and your screen components are not compatible with the react-navigation's way of passing props)

2 . want to reuse your component somewhere else

3 . don't find this very elegant

More in related [github issue](https://github.com/react-community/react-navigation/issues/935)

## The solution
This small package offers two functions to ease working with the props from react-navigation.
 
### `withMappedNavigationProps`
Use this function to be able to access the props passed to your screen *directly*. Eg. instead of `this.props.navigation.state.params.user.userName` you'd write `this.props.user.userName`. The function wraps the provided component in a HOC and passes everything from `props.navigation.state.params` as well as `props.screenProps` to the wrapped component.

#### Usage
When defining the screens for your navigator, wrap the screen component with the function. For example:

```js
import { withMappedNavigationProps } from 'react-navigation-props-mapper'
...
const MainNavigator = StackNavigator({
  firstScreen:  { screen: withMappedNavigationProps(FirstScreenComponent) },
  secondScreen: { screen: withMappedNavigationProps(SecondScreenComponent) },
});
```

You may, of course, also use this directly on your screen components:

```js
@withMappedNavigationProps
export default class SomeScreen extends Component {
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
static navigationOptions = ({navigation, name }) => ({
  title: name,
  headerRight: (
      <HeaderButton title="Sort" onPress={() => navigation.navigate('DrawerOpen')} />
    ),
});
```


#### Usage
`import { withMappedNavigationAndConfigProps } from 'react-navigation-props-mapper` and use the same way as `withMappedNavigationProps`. In your screen component, use `static navigationOptions`, same as you'd do normally.


### Injecting Additional Props
Consider the [deep linking guide](https://reactnavigation.org/docs/guides/linking#Configuration) from react-navigation.
You have a chat screen defined as:

```js
Chat: {
    screen: ChatScreen,
    path: 'chat/:userId',
  },
```

you may need to use the `userId` parameter to get the respective `user` object and do some work with it. Wouldn't it be more convenient to directly get the `user` object instead of just the id? Both `withMappedNavigationAndConfigProps` and `withMappedNavigationProps` accept an optional second parameter, of type `ReactClass` (a react component) that gets all the navigation props and the wrapped component as props. You may do some additional logic in this component and then render the wrapped component, for example:

```js
import React from 'react';
import { inject } from 'mobx-react/native';
import { withMappedNavigationAndConfigProps } from 'react-navigation-props-mapper';

@inject('userStore')//this injects userStore as a prop, via react context
class AdditionalPropsInjecter extends React.Component {
  render() {
    const { WrappedComponent, userStore, userId } = this.props;

    const additionalProps = {};
    if (userId) {
      additionalProps.user = userStore.getUserById(userId)
    }
    return <WrappedComponent {...this.props} {...additionalProps} />;
  }
}

// then, when defining your screens
const ChatStack = StackNavigator(
  {
    ChatScreen: {
      screen: withMappedNavigationAndConfigProps(ChatScreen, AdditionalPropsInjecter),
    },
    // other screens
);

```

That way, in your `ChatScreen` component, you don't have to work with user id, but directly work with the user object.

#### Tip

If you don't like the function names, you may import the functions with an alias: 

```js
import { withMappedNavigationAndConfigProps as mapperFunc } from 'react-navigation-props-mapper';
```

