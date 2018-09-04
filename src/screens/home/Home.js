import React from "react";
import {View, StyleSheet} from "react-native";
import {createTabNavigator, TabBarTop} from 'react-navigation';
import HeaderButtons from 'react-navigation-header-buttons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Scores from "../scores/Scores";
import Contacts from "../contacts/Contacts";
import Profile from "../profile/Profile";
import Fab from "./../../components/Fab";

import realm from "./../../realm";

const HomeTab = createTabNavigator({
  Scores: {screen: Scores},
  Contacts: {screen: Contacts},
  Profile: {screen: Profile}
}, {
  tabBarComponent: TabBarTop,
  tabBarOptions: {
    activeTintColor: "#FF9800",
    inactiveTintColor: "black",
    labelStyle: {
      fontWeight: "bold"
    },
    style: {
      backgroundColor: "white",
      elevation: 0
    },
    indicatorStyle: {
      backgroundColor: "#FF9800"
    }
  },
  backBehavior: 'none'
});

class Home extends React.Component {
  static navigationOptions = {
    title: "Soccer Scores",
    headerTitleStyle: {
      textAlign: 'center', alignSelf: 'center', flex: 1
    }
  };

  state = {
    tabPosition: 0
  };

  render() {
    const {tabPosition} = this.state;

    const fab = <Fab color="white" tint="#FF9800" icon="plus" onPress={this._onFab}/>;
    const showFab = tabPosition !== 2;

    return (
      <View style={styles.background}>
        <HomeTab
          onNavigationStateChange={(prevState, currentState) => this._onTabChange(prevState, currentState)}
          screenProps={{ rootNavigation: this.props.navigation }}
        />
        <View style={styles.fabLayout}>
          {showFab && fab}
        </View>
      </View>
    )
  }

  _onTabChange = (prevState, currentState) => {
    this.setState({
      tabPosition: currentState.index
    });
  };

  _onFab = () => {
    const {navigation} = this.props;
    const {tabPosition} = this.state;

    switch (tabPosition) {
      case 0:
        // realm.write(()=> {
        // realm.delete(realm.objects("Score"));})
        navigation.navigate("AddScore");
        break;
      case 1:
        // realm.write(()=> {
        //   realm.delete(realm.objects("Contact"));})
        navigation.navigate("InviteContact");
        break;
    }
  }
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "#FAFAFA"
  },
  fabLayout: {
    position: "absolute",
    bottom: 16,
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center"
  }
});

export default Home;
