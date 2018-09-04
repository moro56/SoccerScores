import React from "react";
import {View, StyleSheet, TouchableNativeFeedback, Text} from "react-native";
import {inject, observer} from "mobx-react";
import {SocialIcon} from 'react-native-elements';
import {NavigationActions} from 'react-navigation';

import {disconnect} from "./../../services/socket";
import Progress from "./../../components/Progress";
import {connect} from "./../../services/socket";

@inject(stores => ({
  store: stores.authStore,
  socketStore: stores.socketStore
}))
@observer
class SignIn extends React.Component {
  static navigationOptions = {
    header: null
  };

  state = {
    loading: false
  };

  componentDidMount() {
    disconnect();
  }

  render() {
    const {loading} = this.state;

    return (
      <View style={styles.background}>
        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Sign in with:</Text>
          <SocialIcon title='Google' style={styles.socialButton} fontStyle={styles.socialButtonFont} button
                      type='google-plus-official' onPress={this._googleLogin}/>
          <SocialIcon title='Facebook' style={styles.socialButton} fontStyle={styles.socialButtonFont} button
                      type='facebook' onPress={this._facebookLogin}/>
        </View>
        {loading && <Progress/>}
      </View>
    );
  }

  _googleLogin = async() => {
    const {store, navigation, socketStore} = this.props;

    this._setLoading(true);
    try {
      await store.googleLogin();
      await socketStore.sync();
      navigation.dispatch(NavigationActions.reset({
        index: 0, actions: [NavigationActions.navigate({routeName: "Home"})]
      }));
      connect();
      this._setLoading(false);
    } catch (e) {
      this._setLoading(false);
    }
  };

  _facebookLogin = async() => {
    const {store, navigation, socketStore} = this.props;

    this._setLoading(true);
    try {
      await store.facebookLogin();
      await socketStore.sync();
      navigation.dispatch(NavigationActions.reset({
        index: 0, actions: [NavigationActions.navigate({routeName: "Home"})]
      }));
      connect();
      this._setLoading(false);
    } catch (e) {
      this._setLoading(false);
    }
  };

  _setLoading = (value) => {
    this.setState({
      loading: value
    });
  };
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    flexDirection: "column-reverse",
    backgroundColor: "#FAFAFA"
  },
  loginContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 100
  },
  loginText: {
    fontWeight: "bold",
    marginBottom: 8
  },
  socialButton: {
    width: 200,
    borderRadius: 0,
    elevation: 1
  },
  socialButtonFont: {
    fontSize: 17
  }
});

export default SignIn;