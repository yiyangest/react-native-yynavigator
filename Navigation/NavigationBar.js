'use strict';
import React from 'react-native'

var {
  Navigator,
    View,
  Text,
    StyleSheet,
  TouchableHighlight,
    TouchableOpacity,
    Animated,
    Easing,
    BackAndroid,
    Platform,
} = React;

import NavigationButton, * as NavButton from './NavigationButton'
import NavStyles from './styles';

class NavigationBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            backButtonOpacity: 0,
            previousRoute: {}
        };
    }
    componentDidMount() {
        if (Platform.OS == 'android') {
            BackAndroid.addEventListener('hardwareBackPress', ()=>{
                if (this.props.currentRoute.index && this.props.currentRoute.index > 0) {
                    this.goBack();
                    return true;
                }

                return false;
            })
        }
    }
    componentWillUnmount() {
        if (Platform.OS == 'android') {
            BackAndroid.removeEventListener('hardwareBackPress');
        }
    }
    componentWillReceiveProps(newProps) {
        if (this.props && this.props.currentRoute.index !== newProps.currentRoute.index) {
            this.setState({
                previousRoute: this.props.currentRoute
            });
        }
    }
    goBack() {
        this.props.goBack(this.props.navigator);
    }
    goForward(route) {
        this.props.goForward(route, this.props.navigator);
    }
    customAction(opts) {
        this.props.customAction(opts);
    }
  render () {
      var navBarStyle;
      if (this.props.currentRoute.hideNavigationBar) {
          navBarStyle = styles.navbarContainerHidden;
      } else {
          navBarStyle = styles.navbarContainer;
      }
      let navbarContent = (
          <BarContent route={this.props.currentRoute}
                      rightBarItem={this.props.rightBarItem}
                      titleBarItem={this.props.titleBarItem}
                      titleStyle={this.props.titleStyle}
                      leftProps={this.props.leftProps}
                      rightProps={this.props.rightProps}
                      titleProps={this.props.titleProps}
                      goBack={this.goBack.bind(this)}
                      goForward={this.goForward.bind(this)}
                      customAction={this.customAction.bind(this)}
          />
      );

      return (
          <View style={[navBarStyle, this.props.style]}>
              {navbarContent}
          </View>
      );
  }
}

class BarContent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            opacity: this.props.willDisappear ? new Animated.Value(1): new Animated.Value(0),
        };
    }

    componentDidMount() {
        this.transAnimation();
    }

    componentWillReceiveProps(newProps) {
        if (newProps.route !== this.props.route) {
            this.state.opacity.setValue(this.props.willDisappear ? 1 : 0);

            this.transAnimation();

        } else if (newProps.route === this.props.route) {
            this.state.opacity.setValue(1);
        }
    }

    transAnimation() {
        setTimeout(()=> {
                Animated.timing(
                    this.state.opacity,
                    {
                        fromValue: this.props.willDisappear ? 1 : 0,
                        toValue: this.props.willDisappear ? 0 : 1,
                        duration: 300,
                        easing: Easing.easeOutQuad
                    }
                ).start();
            }, 0
        );
    }

    goBack() {
        if (!this.props.willDisappear) {
            this.props.goBack();
        }
    }

    goForward(route) {
        this.props.goForward(route);
    }

    customAction(opts) {
        this.props.customAction(opts);
    }

    render () {
        var transitionStyle = {
            opacity: this.state.opacity
        };
        if (this.props.route.hideNavigationBar) {
            return (
                <Animated.View style={[styles.navbar, this.props.route.headerStyle, transitionStyle, {borderBottomWidth:0}]}>

                </Animated.View>
            );
        }
        var leftBarItem, leftBarItemContent = null;
        if (this.props.route.leftBarItem) {
            let LeftComponent = this.props.route.leftBarItem;
            leftBarItemContent = <LeftComponent goForward={this.goForward.bind(this)} customAction={this.customAction.bind(this)} {...this.props.leftProps}/>;
        } else if(this.props.route.index > 0) {
            leftBarItemContent = <NavigationButton barItemType={NavButton.BUTTON_TEXT_ONLY} barItemTitle="<" onPress={()=>this.goBack()}/>;
        }
        leftBarItem = (
            <View style={[styles.barItem, styles.alignLeft]}>
                {leftBarItemContent}
            </View>
        );

        var rightBarItem, rightBarItemContent = null;

        if (this.props.route.rightBarItem) {
            let RightComponent = this.props.route.rightBarItem;
            let rightProps = this.props.route.rightProps || this.props.rightProps;
            rightBarItemContent = (<RightComponent goForward={this.goForward.bind(this)} customAction={this.customAction.bind(this)} {...rightProps}/>);
        }
        rightBarItem = (
            <View style={[styles.barItem, styles.alignRight]}>
                {rightBarItemContent}
            </View>
        );

        var titleBarItem, titleBarItemContent = null;

        if (this.props.route.titleBarItem) {
            let titleComponent = this.props.route.titleBarItem;
            titleBarItemContent = <titleComponent {...this.props.titleProps} />
        } else {
            titleBarItemContent = (
                <Text numberOfLines={1}
                      style={[styles.navbarText, this.props.titleStyle]}>
                    {this.props.route.title}
                </Text>
            );
        }

        titleBarItem = (
            <View style={{flex: 3}}>
                {titleBarItemContent}
            </View>
        );
        return (
            <Animated.View style={[styles.navbar, this.props.route.headerStyle, transitionStyle]}>
                {leftBarItem}
                {titleBarItem}
                {rightBarItem}
            </Animated.View>
        );
    }

    pop() {
        if (!this.props.willDisappear) {
            this.props.pop();
        }
    }


}

var styles = Object.assign({}, NavStyles);

export default NavigationBar;
