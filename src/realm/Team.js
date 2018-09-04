import realm from "./index";

class Team {
  static findById(id) {
    return realm.objectForPrimaryKey("Team", id);
  }

  static find(query) {
    if (query) {
      return realm.objects("Team").filtered("name CONTAINS[c] $0", query).sorted("name");
    }
    return realm.objects("Team").sorted("name");
  }

  static init(data) {
    const objs = realm.objects("Team");
    if (!objs || !objs.length) {
      try {
        realm.write(() => {
          data.forEach(item => {
            const values = {
              id: item.index.toString(),
              name: item.name || "",
              crest: item.crest
            };
            realm.create("Team", values, false);
          });
        });
      } catch (e) {
      }
    }
  }
}

Team.schema = {
  name: "Team",
  primaryKey: "id",
  properties: {
    id: {type: "string"},
    name: {type: "string"},
    crest: {type: "string", optional: true}
  }
};

export default Team;