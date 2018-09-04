import React from "react";
import {View, TouchableWithoutFeedback} from "react-native";
import * as Progress from 'react-native-progress';

export default () => {
  return (
    <TouchableWithoutFeedback>
      <View style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        top: 0,
        justifyContent: "center",
        alignItems: "center",
        elevation: 4
      }}>
        <Progress.Circle size={36} indeterminate={true} color={"FF9800"} borderWidth={3}/>
      </View>
    </TouchableWithoutFeedback>
  );
}