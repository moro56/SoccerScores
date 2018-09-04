import React from "react";
import {
  View,
  StyleSheet,
  TextInput,
  FlatList,
  Text,
  Image,
  TouchableWithoutFeedback,
  TouchableNativeFeedback
} from "react-native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import {Team} from "./../../realm";
import {requireImage} from "../../providers";

class AddScoreChooseTeam extends React.Component {
  static navigationOptions = ({navigation}) => {
    let {params} = navigation.state;
    params = params || {isTeam1: true}; //TODO rimuovere

    return {
      title: params.isTeam1 ? "Choose Team 1" : "Choose Team 2",
      headerTitleStyle: {
        textAlign: 'center', alignSelf: 'center', flex: 1
      },
      headerRight: (<View/>)
    };
  };

  state = {
    showPlaceholderIcon: true,
    teams: Team.find()
  };

  render() {
    const {showPlaceholderIcon, teams} = this.state;

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
        <FlatList data={teams} renderItem={this._renderTeam} keyExtractor={(item) => item.id}
                  removeClippedSubviews={true}
                  getItemLayout={(data, index) => ({length: 52, offset: 54 * index, index})}/>
      </View>
    );
  }

  _renderTeam = ({item}) => {
    const image = requireImage(item.crest);
    let icon;
    if (image) {
      icon = <Image style={styles.teamIcon} resizeMode={"contain"} source={image}/>;
    } else {
      icon = <Icon style={styles.teamIcon} name={"shield"} size={34} color={"darkgray"}/>;
    }

    return (
      <View style={styles.teamContainer}>
        <TouchableNativeFeedback onPress={() => this._chooseTeam(item)}>
          <View style={styles.teamInnerContainer}>
            {icon}
            <Text style={styles.teamText} numberOfLines={2}>{item.name}</Text>
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
      teams: Team.find(text)
    });
  };

  _clearSearch = () => {
    this.refs.searchView.clear();
    this.setState({
      showPlaceholderIcon: true,
      teams: Team.find()
    })
  };

  _chooseTeam(item) {
    const {goBack} = this.props.navigation;
    const {params: {isTeam1, onTeamChoosen}} = this.props.navigation.state;
    onTeamChoosen(item, isTeam1);
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
  teamContainer: {
    backgroundColor: "white",
    flex: 1,
    height: 52,
    marginLeft: 8,
    marginRight: 8,
    marginBottom: 2
  },
  teamInnerContainer: {
    flexDirection: "row",
    padding: 8,
    alignItems: "center"
  },
  teamIcon: {
    width: 36,
    height: 36,
    marginTop: 2,
    marginBottom: 2,
    marginRight: -6
  },
  teamText: {
    fontSize: 18,
    marginLeft: 16,
    marginRight: 8
  }
});

export default AddScoreChooseTeam;
