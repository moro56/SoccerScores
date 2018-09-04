import {types, flow} from "mobx-state-tree";
import {GoogleSignin} from 'react-native-google-signin';
import firebase from 'react-native-firebase';
import FBSDK from 'react-native-fbsdk';
const {GraphRequest, GraphRequestManager, AccessToken, LoginManager} = FBSDK;

import api from "./../api";
import realm, {Config, Contact, Score} from "./../realm";
import {accountStore, errorStore} from "./";

export default types.model("AuthStore", {}).actions(self => {
  function saveInfo(user, accessToken) {
    accountStore.updateInfo(user, accessToken);
    Contact.setMyself(user);
  }

  const googleLogin = flow(function*() {
    // Add any configuration settings here:
    yield GoogleSignin.configure();
    const result = yield GoogleSignin.signIn();
    // create a new firebase credential with the token
    const credential = firebase.auth.GoogleAuthProvider.credential(result.idToken, result.accessToken);
    // login with credential
    const currentUser = yield firebase.auth().signInAndRetrieveDataWithCredential(credential);
    const {ok, data} = yield api.post("/login/google", {user: currentUser.user._user});
    if (ok) {
      saveInfo(data.user, data.user.accessToken);
    } else {
      errorStore.notifyError(data.errorMessage);
      throw data;
    }
  });

  function runFacebookLogin() {
    return new Promise((resolve, reject) => LoginManager.logInWithReadPermissions(['public_profile', 'email']).then(
      (result)=> resolve(result),
      (error) => reject(error)
    ));
  }

  function runGraphRequest(path, config) {
    return new Promise((resolve, reject) => {
      const request = new GraphRequest(path, config, (error, result) => {
        if (result) {
          resolve(result);
        } else {
          reject(error);
        }
      });

      new GraphRequestManager().addRequest(request).start();
    });
  }

  const facebookLogin = flow(function*() {
    let accessToken = null;

    const result = yield runFacebookLogin();
    if (!result.isCancelled) {
      const data = yield AccessToken.getCurrentAccessToken();
      accessToken = data.accessToken;
    } else {
      throw "CANCELED";
    }

    const me = yield runGraphRequest('/me', {
      httpMethod: 'GET',
      version: 'v2.5',
      parameters: {fields: {string: 'id, name, email, first_name, last_name,cover'}}
    });

    const {ok, data} = yield api.post("/login/facebook", {user: me, accessToken: accessToken});
    if (ok) {
      saveInfo(data.user, data.user.accessToken);
    } else {
      errorStore.notifyError(data.errorMessage);
      throw data;
    }
  });

  function logout() {
    accountStore.logout();
    Contact.removeMyselfId();

    realm.write(() => {
      Config.deleteAll();
      Score.deleteAll();
      Contact.deleteAll();
    })
  }

  return {
    googleLogin,
    facebookLogin,
    logout
  }
}).create({});
