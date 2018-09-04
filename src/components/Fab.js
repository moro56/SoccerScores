import React from "react";
import {View, TouchableNativeFeedback} from "react-native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default ({size, color, tint, elevation, icon, borderColor, onPress}) => {
  const style = {
    width: size || 56,
    height: size || 56,
    borderRadius: size / 2 || 28,
    backgroundColor: color || "red"
  };
  const radiusStyle = borderColor ? {
    borderColor: borderColor,
    borderWidth: 6,
    borderRadius: (size + 4) / 2 || 34
  } : {};
  const childStyle = {
    alignItems: "center",
    justifyContent: "center"
  };
  return <View style={radiusStyle}>
    <View style={[style, {elevation: elevation || 1}]}>
      <TouchableNativeFeedback background={TouchableNativeFeedback.SelectableBackgroundBorderless()} onPress={onPress}>
        <View style={[style, childStyle]}>
          <Icon name={icon} size={24} color={tint || "black"}/>
        </View>
      </TouchableNativeFeedback>
    </View>
  </View>
}