'use strict';
let NavigatorMixin = {
    navigatorPush(aTitle, aPageView, aParams) {
        if (this.props.goForward) {
            this.props.goForward({
                title: aTitle,
                component: aPageView,
                passProps: {
                    ...aParams
                }
            });
            return;
        }
        var navigator = this.props.navigator;
        if (navigator != null) {
            this.props.navigator.push({
                title: aTitle,
                component: aPageView,
                backButtonTitle: ' ',
                passProps: {
                    ...aParams
                },
            });
        }
    }
}

module.exports = NavigatorMixin;
