'use strict'

import React from 'react-native'

var {
  View,
  Text,
  Image,
  TouchableOpacity,
    TouchableHighlight,
  StyleSheet
} = React;

export const BUTTON_TEXT_ONLY = 1;
export const BUTTON_IMAGE_ONLY = 2;

class NavigationButton extends React.Component {
  static defaultProps = {
    barItemType: BUTTON_TEXT_ONLY,
    onBarButtonPressed: Function,
  };

  render () {
    var button;
    switch (this.props.barItemType) {
      case BUTTON_TEXT_ONLY:
          button = this.renderTextOnlyBtn();
        break;
      case BUTTON_IMAGE_ONLY: {
        button = this.renderImageOnlyBtn();
      }
        break;
      default: {
        button = (
          <View></View>
        );
      }
    }

    return (
      <TouchableHighlight  onPress={()=>this.onPress()} underlayColor="transparent" {...this.props}>
        {button}
      </TouchableHighlight>
    );

  }

    onPress() {
        this.props.onPress && this.props.onPress();
    }

  renderTextOnlyBtn() {
    return (
          <View>
            <Text style={[styles.navBarBtnText, this.props.textStyle]}>
              {this.props.barItemTitle}
            </Text>
          </View>
    );
  }
  renderImageOnlyBtn() {
    let imgSrc = this.props.barItemImage;
    return (
          <View>
            <Image style={[styles.navBarBtnImg, this.props.imageStyle]} source={imgSrc}/>
          </View>
    );
  }
}

var styles = StyleSheet.create({
  navBarBtn: {
    flexDirection: 'column',
    justifyContent: 'center'
  },
  navBarBtnText: {
    fontSize: 16,
      margin: 10,
      textAlign: 'center',
      alignItems: 'center',
      color: 'black',
  },
  navBarBtnImg: {
    width: 24,
    height: 24
  }
});

export default NavigationButton;
