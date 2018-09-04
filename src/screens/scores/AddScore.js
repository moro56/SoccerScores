import React from "react";
import {View, StyleSheet, Text, ScrollView, TouchableWithoutFeedback, Image} from "react-native";
import {observer} from 'mobx-react/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {ImageLoader} from 'react-native-image-fallback';
import {Button} from 'react-native-elements';

import AddScoreStore from "./stores/AddScoreStore";
import Fab from "./../../components/Fab";
import {requireImage} from "../../providers";
import Progress from "./../../components/Progress";

@observer
class AddScore extends React.Component {
  static navigationOptions = {
    title: "Add Score",
    headerTitleStyle: {
      textAlign: 'center', alignSelf: 'center', flex: 1
    },
    headerRight: (<View/>)
  };

  state = {
    loading: false
  };

  render() {
    const {navigation} = this.props;
    const {
      player1Name, player1Icon, team1Icon, team1Name, player2Name, player2Icon, team2Icon, team2Name, result1,
      decResult1, incResult1, result2, decResult2, incResult2, onContactChoosen, onTeamChoosen
    } = AddScoreStore;
    const {loading} = this.state;

    const teamImage1 = requireImage(team1Icon);
    let crest1;
    if (teamImage1) {
      crest1 = <Image style={styles.contentIconInner} resizeMode={"contain"} source={teamImage1}/>;
    } else {
      crest1 = <Icon style={styles.contentIconInnerPlaceholder} name={"shield"} size={26} color={"darkgray"}/>;
    }

    const teamImage2 = requireImage(team2Icon);
    let crest2;
    if (teamImage2) {
      crest2 = <Image style={styles.contentIconInner} resizeMode={"contain"} source={teamImage2}/>;
    } else {
      crest2 = <Icon style={styles.contentIconInnerPlaceholder} name={"shield"} size={26} color={"darkgray"}/>;
    }

    return (
      <View style={styles.background}>
        <ScrollView>
          <View style={{paddingBottom: 80}}>
            <Text style={styles.title}>PLAYER 1</Text>
            <View style={styles.card}>
              <View style={styles.contentLine}>
                <View style={styles.contentIcon}>
                  <ImageLoader style={styles.contactPlayerIcon} source={player1Icon}
                               fallback={[require("./../../assets/avatar_contatti.png")]}/>
                </View>
                <TouchableWithoutFeedback
                  onPress={() => navigation.navigate("AddScoreChooseContact", {isContact1: true, onContactChoosen})}>
                  <Text style={styles.contentText}>{player1Name}</Text>
                </TouchableWithoutFeedback>
              </View>
              <View style={styles.contentLine}>
                <View style={styles.contentIcon}>
                  {crest1}
                </View>
                <TouchableWithoutFeedback
                  onPress={() => navigation.navigate("AddScoreChooseTeam", {isTeam1: true, onTeamChoosen})}>
                  <Text style={styles.contentText}>{team1Name}</Text>
                </TouchableWithoutFeedback>
              </View>
            </View>
            <View style={styles.results}>
              <View style={styles.resultsLine}>
                <Fab color="white" tint="#FF9800" icon="minus" size={36} onPress={decResult1}/>
                <Text style={styles.resultText}>{result1}</Text>
                <Fab color="white" tint="#FF9800" icon="plus" size={36} onPress={incResult1}/>
              </View>
              <View style={styles.resultsLine}>
                <Fab color="white" tint="#FF9800" icon="minus" size={36} onPress={decResult2}/>
                <Text style={styles.resultText}>{result2}</Text>
                <Fab color="white" tint="#FF9800" icon="plus" size={36} onPress={incResult2}/>
              </View>
            </View>
            <Text style={styles.title}>GIOCATORE 2</Text>
            <View style={styles.card}>
              <View style={styles.contentLine}>
                <View style={styles.contentIcon}>
                  <ImageLoader style={styles.contactPlayerIcon} source={player2Icon}
                               fallback={[require("./../../assets/avatar_contatti.png")]}/>
                </View>
                <TouchableWithoutFeedback
                  onPress={() => navigation.navigate("AddScoreChooseContact", {isContact1: false, onContactChoosen})}>
                  <Text style={styles.contentText}>{player2Name}</Text>
                </TouchableWithoutFeedback>
              </View>
              <View style={styles.contentLine}>
                <View style={styles.contentIcon}>
                  {crest2}
                </View>
                <TouchableWithoutFeedback
                  onPress={() => navigation.navigate("AddScoreChooseTeam", {isTeam1: false, onTeamChoosen})}>
                  <Text style={styles.contentText}>{team2Name}</Text>
                </TouchableWithoutFeedback>
              </View>
            </View>
          </View>
        </ScrollView>
        <View style={styles.confirmLayout}>
          <Button title="CONFIRM" buttonStyle={styles.confirm} color={"#FF9800"} onPress={this._addScore}/>
        </View>
        {loading && <Progress/>}
      </View>
    );
  }

  _addScore = async () => {
    const {navigation} = this.props;
    const {addScore} = AddScoreStore;

    this._setLoading(true);
    const {ok} = await addScore();
    this._setLoading(false);
    if (ok) {
      navigation.goBack();
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
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 20,
    marginTop: 20,
    marginBottom: 12
  },
  card: {
    backgroundColor: "white",
    paddingBottom: 8
  },
  contactPlayerIcon: {
    width: 26,
    height: 26,
    borderRadius: 26
  },
  contentLine: {
    flexDirection: "row",
    marginTop: 8
  },
  contentIcon: {
    width: 48,
    height: 48,
    alignItems: "flex-end",
    justifyContent: "center"
  },
  contentIconInner: {
    width: 36,
    height: 36,
    marginTop: 2,
    marginRight: -6
  },
  contentIconInnerPlaceholder: {
    width: 36,
    height: 36,
    marginTop: 8,
    marginRight: -10
  },
  contentText: {
    flex: 1,
    height: 42,
    backgroundColor: "rgba(0,0,0,0.02)",
    borderRadius: 8,
    marginTop: 4,
    marginLeft: 16,
    marginRight: 16,
    lineHeight: 42,
    paddingLeft: 8,
    paddingRight: 8
  },
  results: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: -10
  },
  resultsLine: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  resultText: {
    width: 100,
    fontSize: 40,
    fontWeight: "bold",
    textAlign: "center",
    color: "black",
    marginTop: 8,
    marginBottom: 8
  },
  confirmLayout: {
    position: "absolute",
    bottom: 16,
    right: 0,
    left: 0,
    paddingTop: 8,
    backgroundColor: "#FAFAFA"
  },
  confirm: {
    backgroundColor: "white",
    elevation: 1
  }
});

export default AddScore;
