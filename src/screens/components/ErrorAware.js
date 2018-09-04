import React from "react";
import {View} from "react-native";
import {observer} from "mobx-react";
import {reaction} from "mobx";

import SnackBarManager from "./../../components/snackbar/SnackBarManager";

@observer
class ErrorAware extends React.Component {

  componentDidMount() {
    const {errorStore} = this.props;

    const snackbarManager = new SnackBarManager();

    reaction(
      () => errorStore.error,
      (value) => {
        if (value) {
          snackbarManager.show(value, {duration: 3000});
          errorStore.errorShown();
        }
      }
    )
  }

  render() {
    return (
      <View/>
    );
  }
}

export default ErrorAware;