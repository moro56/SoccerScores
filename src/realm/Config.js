import realm from "./index";

class Config {
  static get(key) {
    const config = realm.objectForPrimaryKey("Config", key);
    if (config) {
      return config.data;
    }
    return null;
  }

  static put(key, data) {
    realm.write(() => {
      const config = realm.objectForPrimaryKey("Config", key);
      if (config) {
        realm.delete(config);
      }
      realm.create("Config", {key, data});
    });
  }

  static remove(key) {
    realm.write(() => {
      const config = realm.objectForPrimaryKey("Config", key);
      if (config) {
        realm.delete(config);
      }
    });
  }

  static deleteAll() {
    realm.delete(realm.objects("Config"));
  }
}

Config.schema = {
  name: "Config",
  primaryKey: "key",
  properties: {
    key: {type: "string"},
    data: {type: "string"}
  }
};

export default Config;