var YYNavigator = {
    get NavigationController() {return require('./Navigation/NavigationController');},
    get NavigationButton() {return require('./Navigation/NavigationButton');}
    get NavigatorMixin() { return require('./Navigation/NavigatorMixin');}
}

module.exports = YYNavigator;
