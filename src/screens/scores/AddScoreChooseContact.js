import React from "react";
import {
  View,
  StyleSheet,
  TextInput,
  FlatList,
  Text,
  TouchableWithoutFeedback,
  TouchableNativeFeedback
} from "react-native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {ImageLoader} from 'react-native-image-fallback';

import {Contact} from "./../../realm";

class AddScoreChooseContact extends React.Component {
  static navigationOptions = ({navigation}) => {
    let {params} = navigation.state;
    params = params || {isContact1: true}; //TODO rimuovere

    return {
      title: params.isContact1 ? "Choose Player 1" : "Choose Player 2",
      headerTitleStyle: {
        textAlign: 'center', alignSelf: 'center', flex: 1
      },
      headerRight: (<View/>)
    };
  };

  state = {
    showPlaceholderIcon: true,
    contacts: Contact.find()
  };

  render() {
    const {showPlaceholderIcon, contacts} = this.state;

    const searchIcon = <TouchableWithoutFeedback onPress={() => this.refs.searchView.focus()}>
      <View style={styles.searchPlaceholderIconLayout}>
        <Icon style={styles.searchPlaceholderIcon} name={"magnify"} size={16} color={"rgba(0,0,0,0.5)"}
              onPress={() => this.refs.searchView.focus()}/>
      </View>
    </TouchableWithoutFeedback>;

    const clearIcon = <Icon style={styles.searchClearIcon} name={"close"} size={16} color={"rgba(0,0,0,0.5)"}
                            onPress={this._clearSearch}/>;

    return (
      <View style={styles.background}>
        <TextInput ref="searchView" style={styles.searchView} underlineColorAndroid={"rgba(0,0,0,0)"}
                   placeholder={"Search"} onChangeText={this._textChanged}
                   placeholderTextColor={"rgba(0,0,0,0.5)"}/>
        {showPlaceholderIcon && searchIcon}
        {!showPlaceholderIcon && clearIcon}
        <FlatList data={contacts} renderItem={this._renderContact}/>
      </View>
    );
  }

  _renderContact = ({item}) => {
    return (
      <View style={styles.contactContainer}>
        <TouchableNativeFeedback onPress={() => this._chooseContact(item)}>
          <View style={styles.contactInnerContainer}>
            <ImageLoader style={styles.contactIcon} source={item.avatar}
                         fallback={[require("./../../assets/avatar_contatti.png")]}/>
            <View style={styles.contactTextContainer}>
              <Text style={styles.contactText}>{item.name}</Text>
              <Text style={styles.contactSubText}>{item.email}</Text>
            </View>
          </View>
        </TouchableNativeFeedback>
      </View>
    );
  };

  _textChanged = (text) => {
    const {showPlaceholderIcon} = this.state;
    if (text && showPlaceholderIcon) {
      this.setState({
        showPlaceholderIcon: false
      })
    } else if (!text) {
      this.setState({
        showPlaceholderIcon: true
      })
    }

    this.setState({
      contacts: Contact.find(text)
    });
  };

  _clearSearch = () => {
    this.refs.searchView.clear();
    this.setState({
      showPlaceholderIcon: true,
      contacts: Contact.find()
    })
  };

  _chooseContact(item) {
    const {goBack} = this.props.navigation;
    const {params: {isContact1, onContactChoosen}} = this.props.navigation.state;
    onContactChoosen(item, isContact1);
    goBack();
  }
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "#FAFAFA"
  },
  searchView: {
    backgroundColor: "white",
    margin: 8,
    height: 42,
    elevation: 1,
    textAlign: "center",
    fontSize: 20,
    color: "black",
    paddingLeft: 50,
    paddingRight: 50
  },
  searchPlaceholderIconLayout: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 20.5,
    elevation: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  searchPlaceholderIcon: {
    marginRight: 60
  },
  searchClearIcon: {
    width: 36,
    height: 42,
    position: "absolute",
    top: 20.5,
    right: 0,
    elevation: 1
  },
  contactContainer: {
    backgroundColor: "white",
    flex: 1,
    marginLeft: 8,
    marginRight: 8,
    marginBottom: 2
  },
  contactInnerContainer: {
    flexDirection: "row",
    padding: 12,
    alignItems: "center"
  },
  contactIcon: {
    width: 42,
    height: 42,
    borderRadius: 42
  },
  contactTextContainer: {
    marginLeft: 16,
    marginRight: 8,
    justifyContent: "center"
  },
  contactText: {
    fontSize: 16
  },
  contactSubText: {
    fontSize: 13,
    opacity: 0.7,
    marginTop: -1
  },
});

export default AddScoreChooseContact;
