import React from "react";
import {View, StyleSheet, FlatList, Text, Image} from "react-native";
import {observer} from "mobx-react";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import {Score} from "./../../realm";
import {requireImage} from "../../providers";
import {accountStore} from "../../stores";

@observer
class Scores extends React.Component {
  state = {
    scores: Score.all()
  };

  componentDidMount() {
    const {scores} = this.state;

    scores.addListener(this._updateScores);
  }

  componentWillUnmount() {
    const {scores} = this.state;

    scores.removeListener(this._updateScores);
  }

  render() {
    const {scores} = this.state;

    return (
      <View style={styles.background}>
        <FlatList style={styles.list} data={scores} renderItem={this._renderScore}
                  ListFooterComponent={<View style={{height: 100}}/>}/>
      </View>
    )
  }

  _renderScore = ({item}) => {
    const team1Image = requireImage(item.team1.crest);
    let team1Icon;
    if (team1Image) {
      team1Icon = <Image style={styles.teamIcon} resizeMode={"contain"} source={team1Image}/>;
    } else {
      team1Icon = <Icon style={styles.teamIcon} name={"shield"} size={34} color={"darkgray"}/>;
    }

    const team2Image = requireImage(item.team2.crest);
    let team2Icon;
    if (team2Image) {
      team2Icon = <Image style={styles.teamIcon} resizeMode={"contain"} source={team2Image}/>;
    } else {
      team2Icon = <Icon style={styles.teamIcon} name={"shield"} size={34} color={"darkgray"}/>;
    }

    const contact1Style = item.contact1.id === accountStore.userId ? [styles.contactName, styles.contactNameMe] : styles.contactName;
    const contact2Style = item.contact2.id === accountStore.userId ? [styles.contactName, styles.contactNameMe] : styles.contactName;

    return (
      <View style={styles.scoreContainer}>
        <View style={styles.teamNameLayout}>
          <Text style={styles.teamName} numberOfLines={1}>{item.team1.name}</Text>
          <Text style={styles.teamName} numberOfLines={1}>{item.team2.name}</Text>
        </View>
        <View style={styles.teamIconLayout}>
          {team1Icon}
          {team2Icon}
          <View style={styles.resultContainer}>
            <Text style={styles.result}>{item.score1} - {item.score2}</Text>
          </View>
        </View>
        <View style={styles.contactsLayout}>
          <Text style={contact1Style} numberOfLines={1}>{item.contact1.name}</Text>
          <Text style={contact2Style} numberOfLines={1}>{item.contact2.name}</Text>
        </View>
      </View>
    );
  };

  _updateScores = () => {
    this.setState({
      scores: Score.all()
    })
  }
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "#FAFAFA"
  },
  list: {
    paddingTop: 8
  },
  scoreContainer: {
    backgroundColor: "white",
    flex: 1,
    marginLeft: 8,
    marginRight: 8,
    marginBottom: 2,
    padding: 8
  },
  teamNameLayout: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  teamName: {
    width: 120,
    fontWeight: "bold",
    textAlign: "center",
    color: "black"
  },
  teamIconLayout: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 42,
    paddingRight: 42,
    marginTop: 8
  },
  teamIcon: {
    width: 36,
    height: 36,
    marginTop: 2,
    marginBottom: 2
  },
  resultContainer: {
    flexDirection: "row",
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center"
  },
  result: {
    fontSize: 30,
    fontWeight: "bold",
    color: "black"
  },
  contactsLayout: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6
  },
  contactName: {
    width: 120,
    textAlign: "center",
    fontSize: 11
  },
  contactNameMe: {
    color: "blue"
  }
});

export default Scores;
