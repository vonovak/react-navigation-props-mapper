## react-navigation-props-mapper

Forwards `react-navigation` params to your screen component's props directly. Supports type-checking with TypeScript.

> use version 3 of this package for `react-navigation` version 6 and newer
>
> use version 2 of this package for `react-navigation` version 5
>
> use version 1 of this package for `react-navigation` version 4 and lower

`yarn add react-navigation-props-mapper`

or

`npm i react-navigation-props-mapper`

## Motivation

In `react-navigation` there were different ways to access navigation params:

- `props.navigation.state.params` (from version 1)
- `props.navigation.getParam(paramName, defaultValue)` (added in version 3)
- `props.route.params` (the only way to read params in version 5 and later)

Example with react-navigation v6:

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

### `withForwardedNavigationParams`

Use this function be able to access the navigation params passed to your screen _directly_ from the props. Eg. instead of `props.route.params.user.userName` you'd write `props.user.userName`. The function wraps the provided component in a HOC and passes everything from `props.route.params` to the wrapped component.

#### Usage

When defining the screens for your navigator, wrap the screen component with the provided function. For example:

```js
import { withForwardedNavigationParams } from 'react-navigation-props-mapper';

function SomeScreen(props) {
  // return something
}

export default withForwardedNavigationParams()(SomeScreen);
```

### TypeScript

The package comes with full TS support, so you will get the same level of type checking as you would when using `react-navigation` alone.
It exports several TS types that replace the ones exported from `react-navigation`. Their name is prefixed by `Forwarded`:

| original type          | replacement type                |
| ---------------------- | ------------------------------- |
| StackScreenProps       | ForwardedStackScreenProps       |
| NativeStackScreenProps | ForwardedNativeStackScreenProps |
| DrawerScreenProps      | ForwardedDrawerScreenProps      |
| BottomTabScreenProps   | ForwardedTabScreenProps         |

`ForwardedTabScreenProps` should work for all types of tab navigators.

For example:

```ts
type StackParamList = {
  Profile: { userId: string };
};

type ForwardedProfileProps = ForwardedStackScreenProps<
  StackParamList,
  'Profile'
>;

const ProfileScreen = withForwardedNavigationParams<ForwardedProfileProps>()(
  function ProfileScreenWithForwardedNavParams({ userId }) {
    // userId is of type string
  }
);
```

See the example app for full code.

### Injecting Additional Props to Your screen

This is an advanced use-case and you may not need this. Consider the [deep linking guide](https://reactnavigation.org/docs/deep-linking/) from react-navigation.
You have a chat screen that expects a `userId` parameter provided by deep linking:

```js
config: {
  path: 'chat/:userId';
}
```

you may need to use the `userId` parameter to get the respective `User` object and do some work with it. Wouldn't it be more convenient to directly get the `User` object instead of just the id? `withMappedNavigationParams` accepts an optional parameter, of type `React.ComponentType` (a React component) that gets all the navigation props and the wrapped component as props. You may do some additional logic in this component and then render the wrapped component, for example:

```js
import React, { useContext } from 'react';
import { withForwardedNavigationParams } from 'react-navigation-props-mapper';

function UserInjecter(props) {
  const userStore = useContext(UserStoreContext);

  // In this component you may do eg. a network fetch to get data needed by the screen component.
  const { WrappedComponent, userId } = props;

  const additionalProps = {};
  if (userId) {
    additionalProps.user = userStore.getUserById(userId);
  }
  return <WrappedComponent {...props} {...additionalProps} />;
}

export const ChatScreen = withForwardedNavigationParams(UserInjecter)(
  ({ user }) => {
    // return something
  }
);
```

That way, in your `ChatScreen` component, you don't have to work with user id, but directly work with the user object.

### Accessing the wrapped component

The original component wrapped by `withForwardedNavigationParams` is available as `wrappedComponent` property of the created HOC. This can be useful for testing.
