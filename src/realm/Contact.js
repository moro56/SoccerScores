import realm, {Config} from "./index";

class Contact {
  static all() {
    return realm.objects("Contact").filtered("deleted = false").filtered("id != $0", Config.get("myself"));
  }

  static allFriend() {
    return realm.objects("Contact").filtered("deleted = false").filtered("invites = false").filtered("invited = false").filtered("id != $0", Config.get("myself"));
  }

  static allInvites() {
    return realm.objects("Contact").filtered("deleted = false").filtered("invites = true").filtered("id != $0", Config.get("myself"));
  }

  static allInvited() {
    return realm.objects("Contact").filtered("deleted = false").filtered("invited = true").filtered("id != $0", Config.get("myself"));
  }

  static find(query) {
    if (query) {
      return realm.objects("Contact").filtered("deleted = false").filtered("name CONTAINS[c] $0", query).sorted("name");
    }
    return realm.objects("Contact").filtered("deleted = false").sorted("name");
  }

  static findById(id) {
    return realm.objectForPrimaryKey("Contact", id);
  }

  static findByEmail(email) {
    return realm.objects("Contact").filtered("email = $0", email)[0];
  }

  static myself() {
    const id = Config.get("myself");
    if (id) {
      return realm.objectForPrimaryKey("Contact", id);
    }
    return null;
  }

  static setMyself(user) {
    let contact = this.findById(user._id);
    realm.write(() => {
      if (contact) {
        contact.avatar = user.avatar;
        contact.name = user.nickname;
        contact.email = user.email;
      } else {
        realm.create("Contact", {
          id: user._id,
          avatar: user.avatar,
          name: user.nickname,
          email: user.email
        });
      }
    });
    Config.put("myself", user._id);
  }

  static removeMyselfId() {
    Config.remove("myself");
  }

  static createOrUpdate(user, type) {
    let contact = this.findByEmail(user.email);
    realm.write(() => {
      if (contact != null) {
        contact.avatar = user.avatar;
        contact.name = user.nickname;
        if (type === "invites") {
          contact.invites = true;
        } else if (type === "invited") {
          contact.invited = true;
        } else {
          contact.invites = false;
          contact.invited = false;
        }

        if(user.notDeleted) {
          contact.deleted = false;
        }
      } else {
        realm.create("Contact", {
          id: user._id,
          avatar: user.avatar,
          name: user.nickname,
          email: user.email,
          invites: type === "invites",
          invited: type === "invited"
        });
      }
    });
  }

  static acceptInvite(userId) {
    const contact = Contact.findById(userId);
    if (contact) {
      realm.write(() => {
        contact.invites = false;
        contact.invited = false;
      });
    }
  }

  static rejectInvite(userId) {
    const contact = Contact.findById(userId);
    if (contact) {
      realm.write(() => {
        contact.deleted = true;
      });
    }
  }

  static sync(friends, invites, invited) {
    friends.forEach(friend => {
      Contact.createOrUpdate(friend);
    });
    invites.forEach(contact => {
      Contact.createOrUpdate(contact, "invites");
    });
    invited.forEach(contact => {
      Contact.createOrUpdate(contact, "invited");
    });
  }

  static deleteAll() {
    realm.delete(realm.objects("Contact"));
  }
}

Contact.schema = {
  name: "Contact",
  primaryKey: "id",
  properties: {
    id: {type: "string"},
    avatar: {type: "string", optional: true},
    name: {type: "string"},
    email: {type: "string"},
    invites: {type: "bool", default: false},
    invited: {type: "bool", default: false},
    deleted: {type: "bool", default: false}
  }
};

export default Contact;