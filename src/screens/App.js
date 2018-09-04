import React from "react";
import {View, AppState, StatusBar} from "react-native";
import {createStackNavigator} from 'react-navigation';
import {Provider} from 'mobx-react';

import {connect} from "./../services/socket";
import * as stores from "./../stores";
import teams from "./../assets/teams.json";
import {Team, Contact} from "./../realm";
import Home from "./home/Home";
import AddScore from "./scores/AddScore";
import AddScoreChooseContact from "./scores/AddScoreChooseContact";
import AddScoreChooseTeam from "./scores/AddScoreChooseTeam";
import SignIn from "./signin/SignIn";
import InviteContact from "./contacts/InviteContact";
import ErrorAware from "./components/ErrorAware";
import NavigationService from "./../services/NavigationService";

const AppNavigator = createStackNavigator({
  Home: {screen: Home},
  AddScore: {screen: AddScore},
  AddScoreChooseContact: {screen: AddScoreChooseContact},
  AddScoreChooseTeam: {screen: AddScoreChooseTeam},
  SignIn: {screen: SignIn},
  InviteContact: {screen: InviteContact}
}, {
  initialRouteName: Contact.myself() ? "Home" : "SignIn",
  navigationOptions: {
    headerStyle: {
      backgroundColor: 'white',
      elevation: 0
    }
  }
});

class App extends React.Component {
  state = {
    appState: AppState.currentState
  };

  componentDidMount() {
    Team.init(teams);
    if (Contact.myself()) {
      connect();
      this._sync();
    }

    AppState.addEventListener('change', this._handleAppStateChange);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <StatusBar barStyle="dark-content" backgroundColor="white"/>
        <Provider {...stores}>
          <AppNavigator ref={navigator => NavigationService.setTopLevelNavigator(navigator)}/>
        </Provider>
        <ErrorAware errorStore={stores.errorStore}/>
      </View>
    )
  }

  _handleAppStateChange = (nextAppState) => {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {

    }
    this.setState({appState: nextAppState});
  };

  async _sync() {
    const {socketStore} = stores;

    try {
      await socketStore.sync();
    } catch (e) {
      console.log("App", e);
    }
  }
}

export default App;
