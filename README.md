## react-navigation-props-mapper

> NOTE use version 1 of this package for `react-navigation` version 4 and lower
>
> use version 2 of this package for `react-navigation` version 5

`yarn add react-navigation-props-mapper`

or

`npm i react-navigation-props-mapper`

## Motivation

If you started RN development in 2018 or so, you remember how painful navigation was back then. To name some of the libraries, there were `react-native-router-flux`, `NavigationExperimental`, `ex-navigation` and finally `react-navigation`. This library started as a way to abstract away different ways in which navigation libraries passed screen params, making your screen component less dependent or even independent of the used navigation library.

In `react-navigation` there were different ways to access navigation params:

- `this.props.navigation.state.params` (from version 1)
- `this.props.navigation.getParam(paramName, defaultValue)` (added in version 3)
- `this.props.route.params` (the only way to read params in version 5)

Example with v5:

```js
function SomeComponent({ route }) {
  const { params } = route;
  return (
    <View>
      <Text>Chat with {params.user.userName}</Text>
    </View>
  );
}
```

This works well but if you don't want your code to be tightly coupled to `react-navigation` (maybe because you're migrating from version 4 to 5) or if you simply want to work with navigation params the same way as with any other props, this package will help.

### `withMappedNavigationParams`

Use this function to be able to access the navigation params passed to your screen _directly_ from the props. Eg. instead of `this.props.route.params.user.userName` you'd write `this.props.user.userName`. The function wraps the provided component in a HOC and passes everything from `props.route.params` to the wrapped component.

#### Usage

When defining the screens for your navigator, wrap the screen component with the provided function. For example:

```js
import { withMappedNavigationParams } from 'react-navigation-props-mapper';

function SomeScreen(props) {
  // return something
}

export default withMappedNavigationParams()(SomeScreen);

// decorator that can be used with class components
@withMappedNavigationParams()
export class SomeScreen extends Component {}
```

### Injecting Additional Props to Your screen

This is an advanced use-case and you may not need this feature. Consider the [deep linking guide](https://reactnavigation.org/docs/deep-linking.html) from react-navigation.
You have a chat screen that expects a `userId` parameter provided by deep linking:

```js
config: {
  path: 'chat/:userId',
},
```

you may need to use the `userId` parameter to get the respective `User` object and do some work with it. Wouldn't it be more convenient to directly get the `User` object instead of just the id? `withMappedNavigationParams` accepts an optional parameter, of type `React.ComponentType` (a React component) that gets all the navigation props and the wrapped component as props. You may do some additional logic in this component and then render the wrapped component, for example:

```js
import React, { useContext } from 'react';
import { withMappedNavigationParams } from 'react-navigation-props-mapper';

function AdditionalPropsInjecter(props) {
  const userStore = useContext(UserStoreContext);

  // In this component you may do eg. a network fetch to get data needed by the screen component.
  const { WrappedComponent, userId } = props;

  const additionalProps = {};
  if (userId) {
    additionalProps.user = userStore.getUserById(userId);
  }
  return <WrappedComponent {...props} {...additionalProps} />;
}

@withMappedNavigationParams(AdditionalPropsInjecter)
class ChatScreen extends React.Component {}
```

That way, in your `ChatScreen` component, you don't have to work with user id, but directly work with the user object.

### Acessing the wrapped component

The original component wrapped by `withMappedNavigationParams` is available as `wrappedComponent` property of the created HOC. This can be useful for testing.
