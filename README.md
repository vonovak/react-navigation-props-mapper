## react-navigation-props-mapper

`yarn add react-navigation-props-mapper`

or

`npm i react-navigation-props-mapper --save`


### The problem
You're using react-navigation to navigate around you React Native app. The [documentation](https://reactnavigation.org/docs/intro/#Passing-params) describes you should use `this.props.navigation.state.params` to access props passed to your screen. For example:

```
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

1 . don't want your code to be tightly coupled to react-navigation

2 . want to reuse your component somewhere else

3 . don't find this very elegant

More in related [github issue](https://github.com/react-community/react-navigation/issues/935)

## The solution
This small package offers two functions to ease working with the props from react-navigation.
 
### `withMappedNavigationProps`
Use this function to be able to access the props passed to your screen *directly*. Eg. instead of `this.props.navigation.state.params.user.userName` you'd write `this.props.user.userName`. The function wraps the provided component in a HOC and passes everything from `props.navigation.state.params` as well as `props.screenProps` to the wrapped component.

#### Usage
When defining the screens for your navigator, wrap the screen component with the function. For example:

```
import { withMappedNavigationProps } from 'react-navigation-props-mapper'
...
const MainNavigator = StackNavigator({
  firstScreen:  { screen: withMappedNavigationProps(FirstScreenComponent) },
  secondScreen: { screen: withMappedNavigationProps(SecondScreenComponent) },
});
```

### withMappedNavigationAndConfigProps
When using a function in `static navigationOptions` to configure eg. a screen header dynamically based on the props, you're dealing with the same issues as mentioned above. `withMappedNavigationAndConfigProps` does the same as `withMappedNavigationProps` but also saves you some hassle when defining screen's `static navigationOptions` property. For example, it allows turning

```
static navigationOptions = ({ navigation }) => ({
  title: `${navigation.state.params.name}'s Profile!`,
  headerRight: (
      <HeaderButton title="Sort" onPress={() => navigation.navigate('DrawerOpen')} />
    ),
});
```
into
```
static navigationOptions = (props) => ({
  title: props.name,
  headerRight: (
      <HeaderButton title="Sort" onPress={() => props.navigation.navigate('DrawerOpen')} />
    ),
});
```
or
```
static navigationOptions = ({navigation, name }) => ({
  title: name,
  headerRight: (
      <HeaderButton title="Sort" onPress={() => navigation.navigate('DrawerOpen')} />
    ),
});
```


#### Usage
`import { withMappedNavigationAndConfigProps } from 'react-navigation-props-mapper` and use the same way as `withMappedNavigationProps`. In your screen component, use `static navigationOptions`, same as you'd do normally.
