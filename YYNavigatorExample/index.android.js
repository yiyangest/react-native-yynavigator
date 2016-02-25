/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';
import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  View,
  ScrollView,
} from 'react-native';

import YYNavigator from 'react-native-yynavigator';
let {
    NavigationController,
    NavigatorMixin,
    NavigationButton
} = YYNavigator;
// import NavigationController from './Navigation/NavigationController';
// import NavigationButton from './Navigation/NavigationButton';
// import NavigatorMixin from './Navigation/NavigatorMixin';

class YYNavigatorExample extends Component {
  render() {
    return (
      <View style={styles.container}>
          <NavigationController
              initialRoute={{title: 'Home', component:HomePage, hideNavigationBar: true}}
              navbarStyle={{backgroundColor: 'green'}}
              />
      </View>
    );
  }
}

class HomePage extends Component {
    componentDidMount() {
        // this.props.setNavBarHidden && this.props.setNavBarHidden(true);
    }
    render() {
        return (
            <ScrollView>
                <View>
                    <Text style={{margin: 20}} onPress={this.simpleJump.bind(this)}>
                        Simple jump to next page, and change nav title in SecondPage.
                    </Text>
                </View>
            </ScrollView>
        );
    }
    simpleJump() {
        this.props.goForward &&
        this.props.goForward({title: 'Second Page', component: SecondPage});
    }
}

class SecondPage extends Component {
    componentWillMount() {
        this.props.navigationController && this.props.navigationController.setTitle('Second');
    }
    render() {
        return (
            <ScrollView>
                <View>
                    <Text style={{margin: 20}} onPress={this.simpleJump.bind(this)}>
                        Using NavigatorMixin.
                    </Text>
                </View>
            </ScrollView>
        );
    }
    simpleJump() {
        this.navigatorPush('Third', ThirdPage);
    }
}

Object.assign(SecondPage.prototype, NavigatorMixin);

class ThirdPage extends Component {
    componentWillMount() {
        this.props.navigationController && this.props.navigationController.setRightBarItem(NavigationButton);
        this.props.setRightProps && this.props.setRightProps({barItemTitle: 'back', onPress: ()=>this.props.goBack && this.props.goBack()});
    }
    render() {
        return (
            <ScrollView>
                <View>
                    <Text style={{margin: 20}}>
                        The last page.
                    </Text>
                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('YYNavigatorExample', () => YYNavigatorExample);
