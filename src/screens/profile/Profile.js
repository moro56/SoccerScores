import React from "react";
import {View, StyleSheet, ScrollView, Text} from "react-native";
import {Button} from 'react-native-elements';
import {inject, observer} from "mobx-react";
import {NavigationActions} from 'react-navigation';

import {Contact, Score} from "./../../realm";
import ImageLoader from "react-native-image-fallback/src/components/ImageLoader";
import ProfileCharts from "./ProfileCharts";

@inject(stores => ({
  store: stores.authStore
}))
@observer
class Profile extends React.Component {

  state = {
    results: Score.statResults(),
    profile: Contact.myself()
  };

  render() {
    const {profile, results} = this.state;

    return (
      <View style={styles.background}>
        <ScrollView>
          <View style={styles.container}>
            <View style={styles.profileContainer}>
              <ImageLoader style={styles.profileIcon} source={profile.avatar}
                           fallback={[require("./../../assets/avatar_contatti.png")]}/>
              <Text style={styles.profileText}>{profile.name}</Text>
              <Text style={styles.profileSubText}>{profile.email}</Text>
            </View>
            <ProfileCharts results={results}/>
            <Button title="LOGOUT" icon={{name: "exit-to-app", color: "red"}} buttonStyle={styles.logout} color={"red"}
                    onPress={this._logout}/>
          </View>
        </ScrollView>
      </View>
    )
  }

  _logout = () => {
    const {store} = this.props;
    const {rootNavigation} = this.props.screenProps;

    store.logout();
    rootNavigation.dispatch(NavigationActions.reset({
      index: 0, actions: [NavigationActions.navigate({routeName: "SignIn"})]
    }));
  }
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "#FAFAFA"
  },
  container: {
    marginBottom: 16
  },
  logout: {
    backgroundColor: "white",
    elevation: 1
  },
  profileContainer: {
    backgroundColor: "white",
    flex: 1,
    margin: 16,
    padding: 12,
    alignItems: "center"
  },
  profileIcon: {
    width: 82,
    height: 82,
    borderRadius: 82
  },
  profileText: {
    marginTop: 16,
    fontSize: 16
  },
  profileSubText: {
    fontSize: 13,
    opacity: 0.7,
    marginTop: -1
  }
});

export default Profile;
