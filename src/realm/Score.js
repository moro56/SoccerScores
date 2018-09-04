import moment from 'moment';

import realm, {Contact, Team, Config} from "./index";
import {accountStore} from "./../stores";

class Score {
  static all() {
    return realm.objects("Score").sorted("createdAt", true);
  }

  static findById(id) {
    return realm.objectForPrimaryKey("Score", id);
  }

  static create(score) {
    realm.write(() => {
      const oldScore = Score.findById(score._id);
      if (!oldScore) {
        const contact1 = Contact.findById(score.contactId1);
        const team1 = Team.findById(score.teamId1);
        const contact2 = Contact.findById(score.contactId2);
        const team2 = Team.findById(score.teamId2);
        realm.create("Score", {
          id: score._id,
          contact1: contact1,
          team1: team1,
          score1: score.result1,
          contact2: contact2,
          team2: team2,
          score2: score.result2,
          createdAt: score.createdAt
        });
      }
    });
  }

  static sync(scores) {
    scores.forEach(score => {
      Score.create(score);
    });
  }

  static deleteAll() {
    realm.delete(realm.objects("Score"));
  }

  static statTeamNumber() {
    const data = [];
    const scores = realm.objects("Score").filtered("contact1.id = $0 OR contact2.id = $0", accountStore.userId);
    if (scores) {
      scores.forEach(score => {
        if (score.contact1.id === accountStore.userId) {
          let team1 = data.find(team => team.x === score.team1.name);
          if (team1) {
            team1.y++;
          } else {
            team1 = {x: score.team1.name, y: 1};
            data.push(team1);
          }
        } else if (score.contact2.id === accountStore.userId) {
          let team2 = data.find(team => team.x === score.team2.name);
          if (team2) {
            team2.y++;
          } else {
            team2 = {x: score.team2.name, y: 1};
            data.push(team2);
          }
        }
      });
    }

    data.sort((a, b) => b.y - a.y);
    return data.slice(0, 10);
  }

  static statResults() {
    const data = {win: [], lose: [], draw: [], maxDates: 0, maxPoint: 0};
    const scores = realm.objects("Score").filtered("contact1.id = $0 OR contact2.id = $0", accountStore.userId).sorted("createdAt", false);
    if (scores) {
      let i = 0;
      let startDay = null;
      let point = 1;
      scores.forEach(score => {
        if (!startDay) {
          startDay = moment(score.createdAt);
          data.win.push({x: 0, label: startDay.format("D MMM YYYY").toString(), y: 0});
          data.lose.push({x: 0, label: startDay.format("D MMM YYYY").toString(), y: 0});
          data.draw.push({x: 0, label: startDay.format("D MMM YYYY").toString(), y: 0});
        }
        i = moment(score.createdAt).diff(startDay, "days");

        let win = data.win.find(item => item.label === moment(score.createdAt).format("D MMM YYYY").toString());
        let lose = data.lose.find(item => item.label === moment(score.createdAt).format("D MMM YYYY").toString());
        let draw = data.draw.find(item => item.label === moment(score.createdAt).format("D MMM YYYY").toString());
        if (score.contact1.id === accountStore.userId) {
          if (score.score1 > score.score2) {
            if (win) {
              win.y++;
              if (win.y > point) {
                point = win.y;
              }
            } else {
              win = {x: i + 1, label: moment(score.createdAt).format("D MMM YYYY").toString(), y: 1};
              data.win.push(win);
            }
          } else if (score.score1 < score.score2) {
            if (lose) {
              lose.y++;
              if (lose.y > point) {
                point = lose.y;
              }
            } else {
              lose = {x: i + 1, label: moment(score.createdAt).format("D MMM YYYY").toString(), y: 1};
              data.lose.push(lose);
            }
          } else {
            if (draw) {
              draw.y++;
              if (draw.y > point) {
                point = draw.y;
              }
            } else {
              draw = {x: i + 1, label: moment(score.createdAt).format("D MMM YYYY").toString(), y: 1};
              data.draw.push(draw);
            }
          }
        } else if (score.contact2.id === accountStore.userId) {
          if (score.score2 > score.score1) {
            if (win) {
              win.y++;
              if (win.y > point) {
                point = win.y;
              }
            } else {
              win = {x: i + 1, label: moment(score.createdAt).format("D MMM YYYY").toString(), y: 1};
              data.win.push(win);
            }
          } else if (score.score2 < score.score1) {
            if (lose) {
              lose.y++;
              if (lose.y > point) {
                point = lose.y;
              }
            } else {
              lose = {x: i + 1, label: moment(score.createdAt).format("D MMM YYYY").toString(), y: 1};
              data.lose.push(lose);
            }
          } else {
            if (draw) {
              draw.y++;
              if (draw.y > point) {
                point = draw.y;
              }
            } else {
              draw = {x: i + 1, label: moment(score.createdAt).format("D MMM").toString(), y: 1};
              data.draw.push(draw);
            }
          }
        }
      });

      data.maxDatesWin = data.win[data.win.length - 1].x;
      data.maxDatesLose = data.lose[data.lose.length - 1].x;
      data.maxDatesDraw = data.draw[data.draw.length - 1].x;
      data.maxPoint = point + 3;
      data.startDay = startDay;

      if (data.win.length === 1) {
        data.win.push(data.win[0]);
      }
      if (data.lose.length === 1) {
        data.lose.push(data.lose[0]);
      }
      if (data.draw.length === 1) {
        data.draw.push(data.draw[0]);
      }
    }

    return data;
  }
}

Score.schema = {
  name: "Score",
  primaryKey: "id",
  properties: {
    id: {type: "string"},
    contact1: {type: "Contact"},
    team1: {type: "Team"},
    score1: {type: "int"},
    contact2: {type: "Contact"},
    team2: {type: "Team"},
    score2: {type: "int"},
    createdAt: {type: "date"}
  }
};

export default Score;
