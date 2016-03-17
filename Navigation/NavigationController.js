/**
 * Created by yiyang on 16/1/18.
 */

'use strict';

import React from 'react-native'

import NavigationBar from './NavigationBar';
import NavStyles from './styles';

let {
    StyleSheet,
    Navigator,
    StatusBarIOS,
    View,
    Platform,
    StatusBar
    } = React;

export default class NavigationController extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            route: {
                title: null,
                index: null
            },
        };
        this.routeStack = [];
    }
    componentWillMount() {
        this.state.route = this.props.initialRoute;
        this.routeStack.push(this.props.initialRoute);
    }
    componentDidMount() {
        this._navigator = this.refs["navigator"];
        this.refs["navigator"].navigationContext.addListener('willfocus', (event)=>{
            const route = event.data.route;
            this.willFocus(route);
        });
    }
    componentWillReceiveProps(newProps) {
        // console.log("old props: ", this.props);
        // console.log("new props: ", newProps);
        if (this.props.initialRoute.component != newProps.initialRoute.component) {
            this.resetTo(newProps.initialRoute);
        }
    }
    willFocus(route){
        if (route.index) {
            if (route.index >= this.routeStack.length) {
                this.routeStack.push(route);
            } else if (route.index < this.routeStack.length) {
                this.routeStack = this.routeStack.slice(0, route.index + 1);
            }
            this.setState({route: this.routeStack[route.index]});
        } else if (this.routeStack.length > 0){
            this.routeStack = [this.routeStack[0]];
            this.setState({route: this.routeStack[0]});
        } else {
            this.routeStack.push(route);
            this.setState({route: route});
        }
    }
    onBack(navigator) {
        if (this.state.route.index > 0) {
            this.routeStack.pop();
            navigator.pop();
        }
    }
    onForward(route, navigator) {
        route.index = this.state.route.index + 1 || 1;
        this.routeStack.push(route);
        navigator.push(route);
    }

    customAction(opts) {
        this.props.customAction(opts);
    }

    setRightProps(props) {
        this.setState({rightProps: props});
    }

    setLeftProps(props) {
        this.setState({leftProps: props});
    }

    setTitleProps(props) {
        this.setState({titleProps: props});
    }

    setTitle(title) {
        let route = {...this.state.route, title: title};
        let currentRoute = this._navigator.getCurrentRoutes();
        currentRoute[currentRoute.length - 1].title = title;
        this.routeStack[this.routeStack.length - 1].title = title;
        this.setState({route: route});

    }

    setNavBarHidden(isHidden) {
        let route = {...this.state.route, hideNavigationBar: isHidden};
        let currentRoute = this._navigator.getCurrentRoutes();
        currentRoute[currentRoute.length - 1].hideNavigationBar = isHidden;
        this.routeStack[this.routeStack.length - 1].hideNavigationBar = isHidden;
        this.setState({route: route});
    }

    setRightBarItem(barItem) {
        let route = {...this.state.route, rightBarItem: barItem};
        this.routeStack[this.routeStack.length - 1] = route;
        this.setState({route: route});
    }

    setLeftBarItem(barItem) {
        let route = {...this.state.route, leftBarItem: barItem};
        this.routeStack[this.routeStack.length - 1] = route;
        this.setState({route: route});
    }

    setTitleBarItem(barItem) {
        let route = {...this.state.route, titleBarItem: barItem};
        this.routeStack[this.routeStack.length - 1] = route;
        this.setState({route: route});
    }

    setRoute(route) {
        let newRoute = {...route};
        if (!newRoute.component) {
            newRoute.component = this.state.route.component;
        }
        newRoute.index = this.state.route.index;
        this.routeStack[this.routeStack.length - 1] = newRoute;
        this.setState({route: newRoute});
    }

    resetTo(route) {
        route.index = 0;
        this.routeStack = [route];
        this.refs["navigator"] && this.refs["navigator"].resetTo(route);
        this.setState({route});
    }

    configureScene(route) {
        return route.sceneConfig || Navigator.SceneConfigs.PushFromRight;
    }

    renderScene(route, navigator) {
        var goForward = function(route) {
            route.index = this.state.route.index + 1 || 1;
            navigator.push(route);
        }.bind(this);

        var goBackwards = function() {
            this.onBack(navigator);
        }.bind(this);

        var goToFirstRoute = function() {
            navigator.popToTop()
        };

        var popToRoute = function(route) {
            let routeStack = navigator.getCurrentRoutes();
            if (routeStack.indexOf(route) == -1) {
                for (let i = routeStack.length - 1; i>=0; i--) {
                    let r = routeStack[i];
                    if (r.component == route.component) {
                        navigator.popToRoute(r);
                        return;
                    }
                }
            } else {
                navigator.popToRoute(route);
            }
        }.bind(this);

        var customAction = function(opts) {
            this.customAction(opts);
        }.bind(this);

        var preventDefault = function(event) {
            return false;
        }

        var setRightProps = function(props) {
            this.setRightProps(props);
        }.bind(this);

        var setLeftProps = function(props) {
            this.setLeftProps(props);
        }.bind(this);

        var setTitleProps = function(props) {
            this.setTitleProps(props);
        }.bind(this);

        var setTitle = function(title) {
            let route = {...this.state.route, title: title};
            let currentRoute = navigator.getCurrentRoutes();
            currentRoute[currentRoute.length - 1].title = title;
            this.routeStack[this.routeStack.length - 1].title = title;
            this.setState({route: route});
        }.bind(this);

        var setNavBarHidden = function(isHidden) {
            let route = {...this.state.route, hideNavigationBar: isHidden};
            let currentRoute = navigator.getCurrentRoutes();
            currentRoute[currentRoute.length - 1].hideNavigationBar = isHidden;
            this.routeStack[this.routeStack.length - 1].hideNavigationBar = isHidden;
            this.setState({route: route});
        }.bind(this);

        var Content = route.component;
        var self = this;
        var extraStyling = {};
        if (this.props.hideNavigationBar || route.hideNavigationBar) {
            extraStyling.marginTop = 0;
        }

        return (
            <View style={[styles.container, this.props.itemWrapperStyle, extraStyling]}
            >
                <Content name={route.title}
                    index={route.index}
                    navigator={navigator}
                    navigationController={self}
                    setRightProps={setRightProps}
                    setLeftProps={setLeftProps}
                    setTitleProps={setTitleProps}
                    setTitle={setTitle}
                    setNavBarHidden={setNavBarHidden}
                    goForward={goForward}
                    goBack={goBackwards}
                    popToTop={goToFirstRoute}
                    popToRoute={popToRoute}
                    customAction={customAction}
                    {...route.passProps}
                />
            </View>
        );
    }

    render() {
        var navigationBar;
        // Status bar color
        if (Platform.OS === 'ios') {
            if (this.props.statusBarColor === 'black') {
                StatusBarIOS.setStyle(0);
            } else {
                StatusBarIOS.setStyle(1);
            }
        } else if (Platform.OS === 'android') {
            // no android version yet
        }
        let statusBar;
        // if (StatusBar && (!this.props.hideNavigationBar && !this.state.route.hideNavigationBar)) {
        //     let color = '#5589B7';
        //     if (this.props.navbarStyle && this.props.navbarStyle.backgroundColor) {
        //         color = this.props.navbarStyle.backgroundColor;
        //     }
        //     statusBar = (
        //         <StatusBar backgroundColor={color}  translucent={true} />
        //     );
        // }

        if (!this.props.hideNavigationBar) {
            navigationBar = (
                <NavigationBar navigator={navigator}
                               style={this.props.navbarStyle}
                               titleStyle={this.props.titleStyle}
                               currentRoute={this.state.route}
                               rightBarItem={this.props.rightBarItem}
                               leftBarItem={this.props.leftBarItem}
                               titleBarItem={this.props.titleBarItem}
                               leftProps={this.state.leftProps}
                               rightProps={this.state.rightProps}
                               titleProps={this.state.titleProps}
                               goForward={this.onForward.bind(this)}
                               goBack={this.onBack.bind(this)}
                               customAction={this.customAction.bind(this)}
                />
            );
        }

        return (
            <View style={{flex: 1}}>
                {statusBar}
                <Navigator initialRoute={this.props.initialRoute}
                           navigationBar={navigationBar}
                           ref="navigator"
                           renderScene={this.renderScene.bind(this)}
                           configureScene={this.configureScene}
                />
            </View>
        );
    }
}

NavigationController.defaultProps = {

};

NavigationController.propTypes={
    /**
     * 初始路由
     */
    initalRoute: React.PropTypes.object, // {title, component, sceneConfig}

    /**
     * 导航栏样式
     */
    navbarStyle: View.propTypes.style,
    /**
     * 内容页样式
     */
    itemWrapperStyle: View.propTypes.style,
    /**
     * 导航栏标题样式
     */
    //titleStyle: View.propTypes.style,

    /**
     * 右边按钮, component
     */
    rightBarItem: React.PropTypes.element,
    /**
     * 左边按钮, component
     */
    leftBarItem: React.PropTypes.element,
    /**
     * 中间标题, component
     */
    titleBarItem: React.PropTypes.element,


};

var styles = Object.assign({}, NavStyles);
