import React from "react";
import {View, StyleSheet, TextInput} from "react-native";
import {observer} from 'mobx-react/native';
import {Button} from 'react-native-elements';

import InviteContactStore from "./stores/InviteContactStore";
import Progress from "./../../components/Progress";

@observer
class InviteContact extends React.Component {
  static navigationOptions = {
    title: "Add Contact",
    headerTitleStyle: {
      textAlign: 'center', alignSelf: 'center', flex: 1
    },
    headerRight: (<View/>)
  };

  state = {
    loading: false
  };

  render() {
    const {email, setEmail} = InviteContactStore;
    const {loading} = this.state;

    return (
      <View style={styles.background}>
        <View style={styles.card}>
          <View style={styles.contentLine}>
            <View style={styles.contentTextLayout}>
              <TextInput style={styles.contentText} underlineColorAndroid={"rgba(0,0,0,0)"} value={email}
                         keyboardType={"email-address"} placeholder={"Email"} autoCapitalize={"none"}
                         onChangeText={setEmail}/>
            </View>
          </View>
        </View>
        <View style={styles.inviteLayout}>
          <Button title="INVITE" buttonStyle={styles.invite} color={"#FF9800"} onPress={this._invite}/>
        </View>
        {loading && <Progress/>}
      </View>
    );
  }

  _invite = async() => {
    const {navigation} = this.props;
    const {invite} = InviteContactStore;

    try {
      this._setLoading(true);
      await invite();
      navigation.goBack();
      this._setLoading(false);
    } catch (e) {
      this._setLoading(false);
    }
  };

  _setLoading = (value) => {
    this.setState({
      loading: value
    });
  }
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "#FAFAFA"
  },
  card: {
    backgroundColor: "white",
    paddingBottom: 8
  },
  contentLine: {
    flexDirection: "row",
    marginTop: 8,
    marginBottom: 8
  },
  contentTextLayout: {
    flex: 1,
    height: 42,
    backgroundColor: "rgba(0,0,0,0.02)",
    borderRadius: 8,
    marginTop: 8,
    marginLeft: 16,
    marginRight: 16,
  },
  contentText: {
    height: 32,
    lineHeight: 32,
    marginTop: 5,
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 0,
    paddingBottom: 0
  },
  inviteLayout: {
    position: "absolute",
    bottom: 16,
    right: 0,
    left: 0
  },
  invite: {
    backgroundColor: "white",
    elevation: 1
  }
});

export default InviteContact;