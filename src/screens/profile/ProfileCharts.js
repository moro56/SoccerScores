import React from "react";
import {View, StyleSheet, Text} from "react-native";
import {VictoryAxis, VictoryChart, VictoryLabel, VictoryBar, VictoryPie, VictoryTheme} from "victory-native";

import * as config from "./../../utils/config";
import Score from "../../realm/Score";

class ProfileCharts extends React.Component {

  shouldComponentUpdate(newProps) {
    return JSON.stringify(newProps.results) !== JSON.stringify(this.props.results);
  }

  render() {
    const {results: {win, lose, draw, maxDatesWin, maxDatesLose, maxDatesDraw, maxPoint, startDay}} = this.props;

    const winBar = <VictoryBar data={win} barRatio={0.1} labelComponent={<VictoryLabel text={""}/>}
                               style={{data: {fill: config.COLOR_LIST[2]}}}/>;
    const loseBar = <VictoryBar data={lose} barRatio={0.1} labelComponent={<VictoryLabel text={""}/>}
                                style={{data: {fill: config.COLOR_LIST[1]}}}/>;
    const drawBar = <VictoryBar data={draw} barRatio={0.1} labelComponent={<VictoryLabel text={""}/>}
                                style={{data: {fill: config.COLOR_LIST[0]}}}/>;

    const pieDataScore = Score.statTeamNumber();
    const pieDataScoreLabels = pieDataScore.map((item, index) => {
      return <Text style={styles.pieLabelsContainerText}><Text
        style={{color: config.COLOR_LIST[index]}}>■</Text> {item.x}   </Text>;
    });

    const resultChartsLayout = {
      parent: {
        marginTop: -35
      }
    };
    console.log(win, lose, draw);

    return (
      <View style={styles.container} pointerEvents={"none"}>
        <Text style={styles.sectionHeader}>Most used teams</Text>
        <View style={styles.layout}>
          <VictoryPie height={150} colorScale={config.COLOR_LIST} data={pieDataScore} labelRadius={0}
                      labelComponent={<VictoryLabel text={""}/>} padding={0} padAngle={3} innerRadius={30}/>
          <Text style={styles.pieLabelsContainer}>
            {pieDataScoreLabels}
          </Text>
        </View>
        <Text style={styles.sectionHeader}>Result stats</Text>
        <View style={[styles.layout, styles.resultStatsLayout]}>
          <View style={styles.resultStats}>
            <Text style={styles.resultStatsLabel}>Win</Text>
            <Text style={styles.resultStatsValue}>{win.reduce((a, b) => a + b.y, 0)}</Text>
          </View>
          <View style={styles.resultStatsDivider}/>
          <View style={styles.resultStats}>
            <Text style={styles.resultStatsLabel}>Lose</Text>
            <Text style={styles.resultStatsValue}>{lose.reduce((a, b) => a + b.y, 0)}</Text>
          </View>
          <View style={styles.resultStatsDivider}/>
          <View style={styles.resultStats}>
            <Text style={styles.resultStatsLabel}>Draw</Text>
            <Text style={styles.resultStatsValue}>{draw.reduce((a, b) => a + b.y, 0)}</Text>
          </View>
        </View>
        <Text style={styles.sectionHeader}>Result charts</Text>
        <View style={styles.layout}>
          {win.length > 0 &&
          [
            <Text>Win</Text>,
            <VictoryChart height={200} theme={VictoryTheme.material} style={resultChartsLayout}>
              <VictoryAxis crossAxis domain={[0, maxDatesWin]}
                           tickFormat={(t) => startDay.clone().add(t, "days").format("D/M")}/>
              <VictoryAxis dependentAxis domain={[0, maxPoint]} tickFormat={(t) => `${Math.round(t)}`}/>
              {winBar}
            </VictoryChart>
          ]}
          {lose.length > 0 &&
          [
            <Text>Lose</Text>,
            <VictoryChart height={200} theme={VictoryTheme.material} style={resultChartsLayout}>
              <VictoryAxis crossAxis domain={[0, maxDatesLose]}
                           tickFormat={(t) => startDay.clone().add(t, "days").format("D/M")}/>
              <VictoryAxis dependentAxis domain={[0, maxPoint]} tickFormat={(t) => `${Math.round(t)}`}/>
              {loseBar}
            </VictoryChart>
          ]}
          {draw.length > 0 &&
          [
            <Text>Draw</Text>,
            <VictoryChart height={200} theme={VictoryTheme.material} style={resultChartsLayout}>
              <VictoryAxis crossAxis domain={[0, maxDatesDraw]}
                           tickFormat={(t) => startDay.clone().add(t, "days").format("D/M")}/>
              <VictoryAxis dependentAxis domain={[0, maxPoint]} tickFormat={(t) => `${Math.round(t)}`}/>
              {drawBar}
            </VictoryChart>
          ]}
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: -16,
    marginHorizontal: 16,
    marginBottom: 16
  },
  layout: {
    backgroundColor: "white",
    flex: 1,
    padding: 12,
    alignItems: "center"
  },
  sectionHeader: {
    fontWeight: "bold",
    marginLeft: 10,
    marginTop: 12,
    marginBottom: 8
  },
  pieLabelsContainer: {
    flexWrap: "wrap",
    marginTop: 8
  },
  pieLabelsContainerText: {
    fontSize: 12
  },
  resultStatsLayout: {
    flexDirection: "row",
    flexGrow: 1
  },
  resultStats: {
    flex: 1,
    alignItems: "center"
  },
  resultStatsLabel: {
    flex: 1,
    alignItems: "center",
    fontSize: 16
  },
  resultStatsValue: {
    flex: 1,
    alignItems: "center",
    fontWeight: "bold",
    fontSize: 20,
    marginTop: 4
  },
  resultStatsDivider: {
    backgroundColor: "lightgray",
    width: 1,
    height: 35,
    marginTop: 5
  }
});

export default ProfileCharts;
