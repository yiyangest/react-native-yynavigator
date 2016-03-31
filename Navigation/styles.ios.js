'use strict';
import {StyleSheet, PixelRatio} from 'react-native';

var styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f7f9',
        marginTop: 64
    },
    navbarContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 64,
        backgroundColor: '#5589B7',
        borderBottomWidth: 1 / PixelRatio.get(),
        borderColor: '#d2d2d2'
    },
    navbarContainerHidden: {
        position: 'absolute',
        top: -64,
        left: 0,
        right: 0,
        height: 64,
    },
    navbar: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 64, // Default iOS navbar height
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        paddingTop: 13
    },
    navbarText: {
        color: 'white',
        fontSize: 17,
        margin: 10,
        marginTop: 14,
        textAlign: 'center',
        alignItems: 'center',
    },
    barItem: {
        flex: 1,
        justifyContent: 'center',
    },
    alignLeft: {
        alignItems: 'flex-start'
    },
    alignRight: {
        alignItems: 'flex-end'
    },
});

export default styles;
